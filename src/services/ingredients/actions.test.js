import Cookies from 'js-cookie';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getIngredientsTasks, getOrderIdTasks } from '@/utils/api-ingredients.ts';
import {
  mockBurgerIngredient,
  mockIngredientsResponse,
  mockOrderResponse,
} from '@/utils/constants';

import { loadIngredients, getOrderId } from './actions';

// Мокаем модули
vi.mock('@/utils/api-ingredients.ts');
vi.mock('js-cookie');

describe('async thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadIngredients', () => {
    it('должен вызывать getIngredientsTasks и возвращать успешный ответ', async () => {
      // Arrange
      vi.mocked(getIngredientsTasks).mockResolvedValue(mockIngredientsResponse);

      // Act
      const thunk = loadIngredients();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(getIngredientsTasks).toHaveBeenCalledTimes(1);
      // Проверяем, что возвращается action fulfilled с payload
      expect(result).toMatchObject({
        type: loadIngredients.fulfilled.type,
        payload: mockIngredientsResponse,
      });
      // meta должно присутствовать
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове getIngredientsTasks', async () => {
      // Arrange
      const errorMessage = 'Network error';
      vi.mocked(getIngredientsTasks).mockRejectedValue(new Error(errorMessage));

      // Act
      const thunk = loadIngredients();
      const dispatch = vi.fn();
      const getState = vi.fn();
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(getIngredientsTasks).toHaveBeenCalledTimes(1);
      // При ошибке без rejectWithValue возвращается action rejected с error
      expect(result).toMatchObject({
        type: loadIngredients.rejected.type,
        error: {
          message: errorMessage,
        },
      });
      expect(result.meta).toBeDefined();
    });
  });

  describe('getOrderId', () => {
    it('должен вызывать getOrderIdTasks с правильными аргументами и возвращать успешный ответ', async () => {
      // Arrange
      vi.mocked(getOrderIdTasks).mockResolvedValue(mockOrderResponse);
      vi.mocked(Cookies.get).mockReturnValue('test-token');

      const mockState = {
        ingredients: {
          ingredientBurgers: [mockBurgerIngredient],
        },
      };

      // Act
      const thunk = getOrderId();
      const dispatch = vi.fn();
      const getState = () => mockState;
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(getOrderIdTasks).toHaveBeenCalledTimes(1);
      expect(getOrderIdTasks).toHaveBeenCalledWith([mockBurgerIngredient]);
      expect(result).toMatchObject({
        type: getOrderId.fulfilled.type,
        payload: mockOrderResponse,
      });
      expect(result.meta).toBeDefined();
    });

    it('должен обрабатывать ошибку при вызове getOrderIdTasks', async () => {
      // Arrange
      const errorMessage = 'Order failed';
      vi.mocked(getOrderIdTasks).mockRejectedValue(new Error(errorMessage));
      vi.mocked(Cookies.get).mockReturnValue('test-token');

      const mockState = {
        ingredients: {
          ingredientBurgers: [mockBurgerIngredient],
        },
      };

      // Act
      const thunk = getOrderId();
      const dispatch = vi.fn();
      const getState = () => mockState;
      const extra = {};
      const result = await thunk(dispatch, getState, extra);

      // Assert
      expect(getOrderIdTasks).toHaveBeenCalledTimes(1);
      // Используется rejectWithValue, поэтому payload содержит сообщение ошибки
      expect(result).toMatchObject({
        type: getOrderId.rejected.type,
        payload: errorMessage,
      });
      expect(result.meta).toBeDefined();
      expect(result.meta.rejectedWithValue).toBe(true);
    });

    it('должен использовать пустой accessToken, если cookie отсутствует', async () => {
      // Arrange
      vi.mocked(getOrderIdTasks).mockResolvedValue(mockOrderResponse);
      vi.mocked(Cookies.get).mockReturnValue(undefined);

      const mockState = {
        ingredients: {
          ingredientBurgers: [mockBurgerIngredient],
        },
      };

      // Act
      const thunk = getOrderId();
      const dispatch = vi.fn();
      const getState = () => mockState;
      const extra = {};
      await thunk(dispatch, getState, extra);

      // Assert
      expect(getOrderIdTasks).toHaveBeenCalledTimes(1);
    });
  });
});
