import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@/utils/api-user.js';
import { isTokenExists } from '@utils/tokens.js';

import { setUser, setIsAuthChecked } from './slice.js';

export const login = createAsyncThunk('user/login', async (formData) => {
  const response = await api.login(formData);
  return response.user;
});

export const updateUserData = createAsyncThunk('user/updateData', async (formData) => {
  const response = await api.updateUserData(formData);
  return response;
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await api.getUser();
  return response.user;
});

export const logout = createAsyncThunk('user/logout', async () => {
  await api.logout();
});

export const register = createAsyncThunk('user/register', async (formData) => {
  const response = await api.register(formData);
  return response.user;
});

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (formData) => {
    const response = await api.forgotPassword(formData);
    return response;
  }
);

export const resetPassword = createAsyncThunk('user/resetPassword', async (formData) => {
  const response = await api.resetPassword(formData);
  return response;
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (isTokenExists()) {
        const response = await api.getUser();
        dispatch(setUser(response.user));
      }
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);
