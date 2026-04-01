import { createSlice } from '@reduxjs/toolkit';

import { getUser, login, logout, forgotPassword } from './actions.js';

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
  forgotPasswordCode: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetForgotPasswordState: (state) => {
      state.forgotPasswordCode = false;
    },
  },
  selectors: {
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUser: (state) => state.user,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error,
    selectForgotPassword: (state) => state.forgotPasswordCode,
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordCode = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      /* .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      ) */
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const { setIsAuthChecked, setUser, resetForgotPasswordState } = userSlice.actions;
export const {
  selectIsAuthChecked,
  selectIsLoading,
  selectError,
  selectUser,
  selectForgotPassword,
} = userSlice.selectors;

export default userSlice.reducer;
