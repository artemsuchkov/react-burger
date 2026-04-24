import Cookies from 'js-cookie';

import { request, ServerError } from './request.ts';

// Типы для данных формы
export type RegisterFormData = {
  email: string;
  password: string;
  name: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type UserFormData = {
  name?: string;
  email?: string;
  password?: string;
};

export type PasswordResetFormData = {
  email: string;
};

export type PasswordResetConfirmFormData = {
  password: string;
  token: string;
};

// Типы для ответов API
export type AuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
};

export type UserResponse = {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export async function register(formData: RegisterFormData): Promise<AuthResponse> {
  return await request('auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function login(formData: LoginFormData): Promise<AuthResponse> {
  const response = await request<AuthResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  Cookies.set('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response;
}

export async function updateUserData(formData: UserFormData): Promise<UserResponse> {
  return await request('auth/user', {
    method: 'PATCH',
    headers: {
      authorization: Cookies.get('accessToken') || '',
    },
    body: JSON.stringify(formData),
  });
}

export async function forgotPassword(
  formData: PasswordResetFormData
): Promise<MessageResponse> {
  return await request('password-reset', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

export async function resetPassword(
  formData: PasswordResetConfirmFormData
): Promise<MessageResponse> {
  return await request('password-reset/reset', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}

async function getUser(): Promise<UserResponse> {
  return await fetchWithRefresh('auth/user', {
    method: 'GET',
    headers: {
      authorization: Cookies.get('accessToken') || '',
    },
  });
}

export async function refreshToken(): Promise<RefreshTokenResponse> {
  const refreshData = await request<RefreshTokenResponse>('auth/token', {
    method: 'POST',
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });

  Cookies.set('accessToken', refreshData.accessToken);
  localStorage.setItem('refreshToken', refreshData.refreshToken);

  return refreshData;
}

export async function fetchWithRefresh<T = unknown>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  try {
    return await request<T>(endpoint, options);
  } catch (error: unknown) {
    // Проверяем, является ли ошибка ServerError с полем statusCode
    if (
      error instanceof ServerError &&
      (error.statusCode === 401 || error.statusCode === 403)
    ) {
      const refreshData = await refreshToken();

      return request<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          authorization: refreshData.accessToken,
        },
      });
    } else {
      throw error;
    }
  }
}

export async function logout(): Promise<MessageResponse> {
  const response = await request<MessageResponse>('auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });

  Cookies.remove('accessToken');
  localStorage.removeItem('refreshToken');

  return response;
}

export const api = {
  getUser,
  updateUserData,
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
};
