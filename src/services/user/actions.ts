import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/utils/api-user.ts';
import { isTokenExists } from '@utils/tokens.ts';

import { setUser, setIsAuthChecked } from './slice.ts';

// Типы данных
export type User = {
  email: string;
  name: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUserFormData = {
  name?: string;
  email?: string;
  password?: string;
};

export type ForgotPasswordFormData = {
  email: string;
};

export type ResetPasswordFormData = {
  password: string;
  token: string;
};

// Ответы API
type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

type RegisterResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

type UpdateUserResponse = {
  user: User;
};

type GetUserResponse = {
  user: User;
};

type ForgotPasswordResponse = {
  message: string;
  success: boolean;
};

type ResetPasswordResponse = {
  message: string;
  success: boolean;
};

// Асинхронные thunk'и с типизацией
export const login = createAsyncThunk<User, LoginFormData>(
  'user/login',
  async (formData) => {
    const response = (await api.login(formData)) as LoginResponse;
    return response.user;
  }
);

export const updateUserData = createAsyncThunk<UpdateUserResponse, UpdateUserFormData>(
  'user/updateData',
  async (formData) => {
    const response = (await api.updateUserData(formData)) as UpdateUserResponse;
    return response;
  }
);

export const getUser = createAsyncThunk<User>('user/getUser', async () => {
  const response = (await api.getUser()) as GetUserResponse;
  return response.user;
});

export const logout = createAsyncThunk<void>('user/logout', async () => {
  await api.logout();
});

export const register = createAsyncThunk<User, RegisterFormData>(
  'user/register',
  async (formData) => {
    const response = (await api.register(formData)) as RegisterResponse;
    return response.user;
  }
);

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordFormData
>('user/forgotPassword', async (formData) => {
  const response = (await api.forgotPassword(formData)) as ForgotPasswordResponse;
  return response;
});

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordFormData
>('user/resetPassword', async (formData) => {
  const response = (await api.resetPassword(formData)) as ResetPasswordResponse;
  return response;
});

export const checkUserAuth = createAsyncThunk<void>(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (isTokenExists()) {
        const response = (await api.getUser()) as GetUserResponse;
        dispatch(setUser(response.user));
      }
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);
