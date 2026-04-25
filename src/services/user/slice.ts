import { createSlice, isRejected } from '@reduxjs/toolkit';

import {
  getUser,
  login,
  updateUserData,
  logout,
  forgotPassword,
  resetPassword,
  type User,
} from './actions';

import type { PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  forgotPasswordCode: boolean;
  resetPasswordCode: boolean;
};

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
  forgotPasswordCode: false,
  resetPasswordCode: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    resetForgotPasswordState: (state) => {
      state.forgotPasswordCode = false;
    },
    resetResetPasswordState: (state) => {
      state.resetPasswordCode = false;
    },
  },
  selectors: {
    selectIsAuthChecked: (state: UserState) => state.isAuthChecked,
    selectUser: (state: UserState) => state.user,
    selectIsLoading: (state: UserState) => state.isLoading,
    selectError: (state: UserState) => state.error,
    selectForgotPassword: (state: UserState) => state.forgotPasswordCode,
    selectResetPassword: (state: UserState) => state.resetPasswordCode,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordCode = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordCode = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Unknown error';
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
        state.error = action.error.message ?? 'Unknown error';
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(isRejected, (state, action) => {
        state.isLoading = false;
        // isRejected гарантирует наличие action.error
        state.error = action.error.message ?? 'Unknown error';
      });
  },
});

export const {
  setIsAuthChecked,
  setUser,
  resetForgotPasswordState,
  resetResetPasswordState,
} = userSlice.actions;
export const {
  selectIsAuthChecked,
  selectIsLoading,
  selectError,
  selectUser,
  selectForgotPassword,
  selectResetPassword,
} = userSlice.selectors;

export default userSlice.reducer;
