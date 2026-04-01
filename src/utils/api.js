import Cookies from 'js-cookie';

import { request } from './request.js';

export async function register(formData) {
  return await request('auth/register', { body: JSON.stringify(formData) });
}

export async function login(formData) {
  const response = await request('auth/login', { body: JSON.stringify(formData) });
  Cookies.set('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response;
}

export async function forgotPassword(formData) {
  return await request('password-reset', { body: JSON.stringify(formData) });
}

export async function resetPassword(formData) {
  return await request('password-reset/reset', { body: JSON.stringify(formData) });
}

async function getUser() {
  return await fetchWithRefresh('auth/user', {
    method: 'GET',
    headers: {
      authorization: Cookies.get('accessToken'),
    },
  });
}

export async function refreshToken() {
  const refreshData = await request('auth/token', {
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });

  Cookies.set('accessToken', refreshData.accessToken);
  localStorage.setItem('refreshToken', refreshData.refreshToken);

  return refreshData;
}

export async function fetchWithRefresh(endpoint, options) {
  try {
    return await request(endpoint, options);
  } catch (error) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      const refreshData = await refreshToken();

      return request(endpoint, {
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

export async function logout() {
  const response = await request('auth/logout', {
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
  });

  Cookies.remove('accessToken');
  localStorage.removeItem('refreshToken');

  return response;
}

export const api = {
  getUser,
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
};
