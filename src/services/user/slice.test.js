import { describe, it, expect } from 'vitest';

import {
  getUser,
  login,
  updateUserData,
  logout,
  forgotPassword,
  resetPassword,
} from './actions';
import reducer, {
  setIsAuthChecked,
  setUser,
  resetForgotPasswordState,
  resetResetPasswordState,
  selectIsAuthChecked,
  selectUser,
  selectIsLoading,
  selectError,
  selectForgotPassword,
  selectResetPassword,
} from './slice';

// Моковые данные
const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
};

const mockUpdateUserResponse = {
  user: mockUser,
};

const mockForgotPasswordResponse = {
  message: 'Reset email sent',
  success: true,
};

const mockResetPasswordResponse = {
  message: 'Password successfully reset',
  success: true,
};

describe('user slice', () => {
  describe('initialState', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual({
        user: null,
        isLoading: false,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      });
    });
  });

  describe('synchronous reducers', () => {
    it('should handle setIsAuthChecked', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = setIsAuthChecked(true);
      const result = reducer(previousState, action);

      expect(result.isAuthChecked).toBe(true);
    });

    it('should handle setUser', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = setUser(mockUser);
      const result = reducer(previousState, action);

      expect(result.user).toEqual(mockUser);
    });

    it('should handle setUser with null', () => {
      const previousState = {
        user: mockUser,
        isLoading: false,
        error: null,
        isAuthChecked: true,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = setUser(null);
      const result = reducer(previousState, action);

      expect(result.user).toBeNull();
    });

    it('should handle resetForgotPasswordState', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: true,
        resetPasswordCode: false,
      };

      const action = resetForgotPasswordState();
      const result = reducer(previousState, action);

      expect(result.forgotPasswordCode).toBe(false);
    });

    it('should handle resetResetPasswordState', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: true,
      };

      const action = resetResetPasswordState();
      const result = reducer(previousState, action);

      expect(result.resetPasswordCode).toBe(false);
    });
  });

  describe('async actions: updateUserData', () => {
    it('should handle updateUserData.pending', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: 'some error',
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = { type: updateUserData.pending.type };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle updateUserData.fulfilled', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: updateUserData.fulfilled.type,
        payload: mockUpdateUserResponse,
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBe(null);
    });

    it('should handle updateUserData.rejected', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: updateUserData.rejected.type,
        error: { message: 'Update failed' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Update failed');
    });
  });

  describe('async actions: resetPassword', () => {
    it('should handle resetPassword.pending', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: 'some error',
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = { type: resetPassword.pending.type };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle resetPassword.fulfilled', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: resetPassword.fulfilled.type,
        payload: mockResetPasswordResponse,
      };
      const result = reducer(previousState, action);

      // isLoading не меняется в slice для resetPassword.fulfilled
      expect(result.isLoading).toBe(true);
      expect(result.resetPasswordCode).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle resetPassword.rejected', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: resetPassword.rejected.type,
        error: { message: 'Reset failed' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Reset failed');
    });
  });

  describe('async actions: forgotPassword', () => {
    it('should handle forgotPassword.pending', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: 'some error',
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = { type: forgotPassword.pending.type };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle forgotPassword.fulfilled', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: forgotPassword.fulfilled.type,
        payload: mockForgotPasswordResponse,
      };
      const result = reducer(previousState, action);

      // isLoading не меняется в slice для forgotPassword.fulfilled
      expect(result.isLoading).toBe(true);
      expect(result.forgotPasswordCode).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle forgotPassword.rejected', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: forgotPassword.rejected.type,
        error: { message: 'Forgot password failed' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Forgot password failed');
    });
  });

  describe('async actions: login', () => {
    it('should handle login.pending', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: 'some error',
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = { type: login.pending.type };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle login.fulfilled', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: login.fulfilled.type,
        payload: mockUser,
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBe(null);
      expect(result.isAuthChecked).toBe(true);
    });

    it('should handle login.rejected', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: login.rejected.type,
        error: { message: 'Login failed' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Login failed');
    });
  });

  describe('async actions: getUser', () => {
    it('should handle getUser.pending', () => {
      const previousState = {
        user: null,
        isLoading: false,
        error: 'some error',
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = { type: getUser.pending.type };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle getUser.fulfilled', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser,
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBe(null);
    });

    it('should handle getUser.rejected', () => {
      const previousState = {
        user: null,
        isLoading: true,
        error: null,
        isAuthChecked: false,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: getUser.rejected.type,
        error: { message: 'Get user failed' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Get user failed');
    });
  });

  describe('async actions: logout', () => {
    it('should handle logout.pending', () => {
      const previousState = {
        user: mockUser,
        isLoading: false,
        error: 'some error',
        isAuthChecked: true,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = { type: logout.pending.type };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle logout.fulfilled', () => {
      const previousState = {
        user: mockUser,
        isLoading: true,
        error: null,
        isAuthChecked: true,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: logout.fulfilled.type,
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.user).toBeNull();
      expect(result.error).toBe(null);
    });

    it('should handle logout.rejected', () => {
      const previousState = {
        user: mockUser,
        isLoading: true,
        error: null,
        isAuthChecked: true,
        forgotPasswordCode: false,
        resetPasswordCode: false,
      };

      const action = {
        type: logout.rejected.type,
        error: { message: 'Logout failed' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Logout failed');
    });
  });

  describe('selectors', () => {
    const rootState = {
      user: {
        user: mockUser,
        isLoading: true,
        error: 'Test error',
        isAuthChecked: true,
        forgotPasswordCode: true,
        resetPasswordCode: false,
      },
    };

    it('selectIsAuthChecked should return isAuthChecked', () => {
      expect(selectIsAuthChecked(rootState)).toBe(true);
    });

    it('selectUser should return user', () => {
      expect(selectUser(rootState)).toEqual(mockUser);
    });

    it('selectIsLoading should return isLoading', () => {
      expect(selectIsLoading(rootState)).toBe(true);
    });

    it('selectError should return error', () => {
      expect(selectError(rootState)).toBe('Test error');
    });

    it('selectForgotPassword should return forgotPasswordCode', () => {
      expect(selectForgotPassword(rootState)).toBe(true);
    });

    it('selectResetPassword should return resetPasswordCode', () => {
      expect(selectResetPassword(rootState)).toBe(false);
    });
  });
});
