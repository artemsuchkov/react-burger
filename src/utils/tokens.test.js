import Cookies from 'js-cookie';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { isTokenExists } from '@/utils/tokens.ts';

// Мокаем модуль js-cookie
vi.mock('js-cookie');

describe('Функция isTokenExists', () => {
  beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    vi.clearAllMocks();
  });

  it('должна возвращать true, когда токен существует', () => {
    // 1. Arrange
    const mockToken = 'test-access-token';
    // Мокаем Cookies.get чтобы возвращать токен
    vi.mocked(Cookies.get).mockReturnValue(mockToken);

    // 2. Act
    const result = isTokenExists();

    // 3. Assert
    expect(result).toBe(true);
    // Проверяем что Cookies.get был вызван с правильным ключом
    expect(Cookies.get).toHaveBeenCalledWith('accessToken');
  });

  it('должна возвращать false, когда токен отсутствует', () => {
    // 1. Arrange
    // Мокаем Cookies.get чтобы возвращать undefined
    vi.mocked(Cookies.get).mockReturnValue(undefined);

    // 2. Act
    const result = isTokenExists();

    // 3. Assert
    expect(result).toBe(false);
    expect(Cookies.get).toHaveBeenCalledWith('accessToken');
  });

  it('должна возвращать false, когда токен пустая строка', () => {
    // 1. Arrange
    // Мокаем Cookies.get чтобы возвращать пустую строку
    vi.mocked(Cookies.get).mockReturnValue('');

    // 2. Act
    const result = isTokenExists();

    // 3. Assert
    expect(result).toBe(false);
    expect(Cookies.get).toHaveBeenCalledWith('accessToken');
  });
});
