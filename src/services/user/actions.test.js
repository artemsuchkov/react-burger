import { describe, it, expect, vi, beforeEach } from 'vitest';

import { api } from '@/utils/api-user.ts';
import { isTokenExists } from '@utils/tokens.ts';

import {
  login,
  register,
  getUser,
  updateUserData,
  logout,
  forgotPassword,
  resetPassword,
  checkUserAuth,
} from './actions';
import { setUser, setIsAuthChecked } from './slice.ts';

// Мокаем модули
vi.mock('@/utils/api-user.ts');
vi.mock('@utils/tokens.ts');
vi.mock('./slice.ts', () => ({
  setUser: vi.fn(),
  setIsAuthChecked: vi.fn(),
}));

// Моковые данные
const mockUser = {
  email: 'test@example.com',
  name: 'Test User',
};

const mockLoginResponse = {
  user: mockUser,
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
};

const mockRegisterResponse = {
  user: mockUser,
  accessToken: 'access-token-789',
  refreshToken: 'refresh-token-abc',
};

const mockUpdateUserResponse = {
  user: mockUser,
};

const mockGetUserResponse = {
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

const mockLogoutResponse = {
  message: 'Successfully logged out',
  success: true,
};

describe('async thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('должен вызывать api.login с правильными данными и возвращать пользователя', async () => {
      // Arrange
      vi.mocked(api.login).mockResolvedValue(mockLoginResponse);
      const formData = { email: 'test@example.com', password: 'password123' };

      // Act
      const thunk = login(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.login).toHaveBeenCalledTimes(1);
      expect(api.login).toHaveBeenCalledWith(formData);
      expect(result).toMatchObject({
        type: login.fulfilled.type,
        payload: mockUser,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове api.login', async () => {
      // Arrange
      const errorMessage = 'Invalid credentials';
      vi.mocked(api.login).mockRejectedValue(new Error(errorMessage));
      const formData = { email: 'test@example.com', password: 'wrong' };

      // Act
      const thunk = login(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.login).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        type: login.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('register', () => {
    it('должен вызывать api.register с правильными данными и возвращать пользователя', async () => {
      // Arrange
      vi.mocked(api.register).mockResolvedValue(mockRegisterResponse);
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Act
      const thunk = register(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.register).toHaveBeenCalledTimes(1);
      expect(api.register).toHaveBeenCalledWith(formData);
      expect(result).toMatchObject({
        type: register.fulfilled.type,
        payload: mockUser,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове api.register', async () => {
      // Arrange
      const errorMessage = 'Email already exists';
      vi.mocked(api.register).mockRejectedValue(new Error(errorMessage));
      const formData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Act
      const thunk = register(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.register).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        type: register.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('getUser', () => {
    it('должен вызывать api.getUser и возвращать пользователя', async () => {
      // Arrange
      vi.mocked(api.getUser).mockResolvedValue(mockGetUserResponse);

      // Act
      const thunk = getUser();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.getUser).toHaveBeenCalledTimes(1);
      expect(api.getUser).toHaveBeenCalledWith();
      expect(result).toMatchObject({
        type: getUser.fulfilled.type,
        payload: mockUser,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове api.getUser', async () => {
      // Arrange
      const errorMessage = 'Unauthorized';
      vi.mocked(api.getUser).mockRejectedValue(new Error(errorMessage));

      // Act
      const thunk = getUser();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.getUser).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        type: getUser.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('updateUserData', () => {
    it('должен вызывать api.updateUserData с правильными данными и возвращать ответ', async () => {
      // Arrange
      vi.mocked(api.updateUserData).mockResolvedValue(mockUpdateUserResponse);
      const formData = { name: 'Updated Name', email: 'updated@example.com' };

      // Act
      const thunk = updateUserData(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.updateUserData).toHaveBeenCalledTimes(1);
      expect(api.updateUserData).toHaveBeenCalledWith(formData);
      expect(result).toMatchObject({
        type: updateUserData.fulfilled.type,
        payload: mockUpdateUserResponse,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове api.updateUserData', async () => {
      // Arrange
      const errorMessage = 'Update failed';
      vi.mocked(api.updateUserData).mockRejectedValue(new Error(errorMessage));
      const formData = { name: 'Updated Name' };

      // Act
      const thunk = updateUserData(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.updateUserData).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        type: updateUserData.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('logout', () => {
    it('должен вызывать api.logout и возвращать undefined', async () => {
      // Arrange
      vi.mocked(api.logout).mockResolvedValue(mockLogoutResponse);

      // Act
      const thunk = logout();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.logout).toHaveBeenCalledTimes(1);
      expect(api.logout).toHaveBeenCalledWith();
      expect(result).toMatchObject({
        type: logout.fulfilled.type,
        payload: undefined,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове api.logout', async () => {
      // Arrange
      const errorMessage = 'Logout failed';
      vi.mocked(api.logout).mockRejectedValue(new Error(errorMessage));

      // Act
      const thunk = logout();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.logout).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        type: logout.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('forgotPassword', () => {
    it('должен вызывать api.forgotPassword с правильными данными и возвращать ответ', async () => {
      // Arrange
      vi.mocked(api.forgotPassword).mockResolvedValue(mockForgotPasswordResponse);
      const formData = { email: 'test@example.com' };

      // Act
      const thunk = forgotPassword(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.forgotPassword).toHaveBeenCalledTimes(1);
      expect(api.forgotPassword).toHaveBeenCalledWith(formData);
      expect(result).toMatchObject({
        type: forgotPassword.fulfilled.type,
        payload: mockForgotPasswordResponse,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове api.forgotPassword', async () => {
      // Arrange
      const errorMessage = 'Email not found';
      vi.mocked(api.forgotPassword).mockRejectedValue(new Error(errorMessage));
      const formData = { email: 'nonexistent@example.com' };

      // Act
      const thunk = forgotPassword(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.forgotPassword).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        type: forgotPassword.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('resetPassword', () => {
    it('должен вызывать api.resetPassword с правильными данными и возвращать ответ', async () => {
      // Arrange
      vi.mocked(api.resetPassword).mockResolvedValue(mockResetPasswordResponse);
      const formData = { password: 'newpassword123', token: 'reset-token-xyz' };

      // Act
      const thunk = resetPassword(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.resetPassword).toHaveBeenCalledTimes(1);
      expect(api.resetPassword).toHaveBeenCalledWith(formData);
      expect(result).toMatchObject({
        type: resetPassword.fulfilled.type,
        payload: mockResetPasswordResponse,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове api.resetPassword', async () => {
      // Arrange
      const errorMessage = 'Invalid token';
      vi.mocked(api.resetPassword).mockRejectedValue(new Error(errorMessage));
      const formData = { password: 'newpassword123', token: 'invalid-token' };

      // Act
      const thunk = resetPassword(formData);
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(api.resetPassword).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        type: resetPassword.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('checkUserAuth', () => {
    it('должен вызывать setUser и setIsAuthChecked при наличии токена', async () => {
      // Arrange
      vi.mocked(isTokenExists).mockReturnValue(true);
      vi.mocked(api.getUser).mockResolvedValue(mockGetUserResponse);

      // Act
      const thunk = checkUserAuth();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      await thunk(dispatch, getState, extra);

      // Assert
      expect(isTokenExists).toHaveBeenCalledTimes(1);
      expect(api.getUser).toHaveBeenCalledTimes(1);
      expect(setUser).toHaveBeenCalledTimes(1);
      expect(setUser).toHaveBeenCalledWith(mockUser);
      expect(setIsAuthChecked).toHaveBeenCalledTimes(1);
      expect(setIsAuthChecked).toHaveBeenCalledWith(true);
    });

    it('должен вызывать только setIsAuthChecked при отсутствии токена', async () => {
      // Arrange
      vi.mocked(isTokenExists).mockReturnValue(false);

      // Act
      const thunk = checkUserAuth();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      await thunk(dispatch, getState, extra);

      // Assert
      expect(isTokenExists).toHaveBeenCalledTimes(1);
      expect(api.getUser).not.toHaveBeenCalled();
      expect(setUser).not.toHaveBeenCalled();
      expect(setIsAuthChecked).toHaveBeenCalledTimes(1);
      expect(setIsAuthChecked).toHaveBeenCalledWith(true);
    });

    it('должен вызывать setIsAuthChecked даже при ошибке получения пользователя', async () => {
      // Arrange
      vi.mocked(isTokenExists).mockReturnValue(true);
      vi.mocked(api.getUser).mockRejectedValue(new Error('Network error'));

      // Act
      const thunk = checkUserAuth();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      await thunk(dispatch, getState, extra);

      // Assert
      expect(isTokenExists).toHaveBeenCalledTimes(1);
      expect(api.getUser).toHaveBeenCalledTimes(1);
      expect(setUser).not.toHaveBeenCalled();
      expect(setIsAuthChecked).toHaveBeenCalledTimes(1);
      expect(setIsAuthChecked).toHaveBeenCalledWith(true);
    });
  });
});
