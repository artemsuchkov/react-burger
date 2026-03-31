import { createAsyncThunk } from '@reduxjs/toolkit';

import { api } from '@utils/api.js';
import { isTokenExists } from '@utils/tokens.js';

import { setUser, setIsAuthChecked } from './slice.js';

export const login = createAsyncThunk('user/login', async (formData) => {
  const response = await api.login(formData);
  return response.user;
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await api.getUser();
  console.log(response);
  return response.user;
});

export const logout = createAsyncThunk('user/logout', async () => {
  await api.logout();
});

export const register = createAsyncThunk('user/register', async (formData) => {
  const response = await api.register(formData);
  return response.user;
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (isTokenExists()) {
        console.log('TokenExists');
        const response = await api.getUser();
        dispatch(setUser(response.user));
      }
    } finally {
      dispatch(setIsAuthChecked(true));
      console.log('IsAuthChecked');
    }
  }
);
