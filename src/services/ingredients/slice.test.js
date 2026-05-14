import { describe, it, expect } from 'vitest';

import { loadIngredients, getOrderId } from './actions';
import reducer, {
  addIngredientToBurger,
  removeIngredientFromBurger,
  getBurgeringredientModal,
  reorderIngredients,
} from './slice';

// Моковые данные
const mockIngredient = {
  _id: '60d3b41abdacab0026a733c6',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
};

const mockBurgerIngredient = {
  item: mockIngredient,
  id: 'unique-id-1',
};

const mockIngredientsResponse = {
  success: true,
  data: [mockIngredient],
};

const mockOrderResponse = {
  success: true,
  name: 'Space флюоресцентный бургер',
  order: {
    number: 12345,
  },
};

describe('ingredients slice', () => {
  describe('initialState', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual({
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      });
    });
  });

  describe('synchronous reducers', () => {
    it('should handle addIngredientToBurger', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      };

      const action = addIngredientToBurger(mockBurgerIngredient);
      const result = reducer(previousState, action);

      expect(result.ingredientBurgers).toHaveLength(1);
      expect(result.ingredientBurgers[0]).toEqual(mockBurgerIngredient);
    });

    it('should handle removeIngredientFromBurger', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [mockBurgerIngredient],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      };

      const action = removeIngredientFromBurger('unique-id-1');
      const result = reducer(previousState, action);

      expect(result.ingredientBurgers).toHaveLength(0);
    });

    it('should handle getBurgeringredientModal', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      };

      const modalIngredients = [mockIngredient];
      const action = getBurgeringredientModal(modalIngredients);
      const result = reducer(previousState, action);

      expect(result.ingredientModal).toEqual(modalIngredients);
    });

    it('should handle reorderIngredients', () => {
      const ingredient1 = { ...mockBurgerIngredient, id: 'id1' };
      const ingredient2 = { ...mockBurgerIngredient, id: 'id2' };
      const ingredient3 = { ...mockBurgerIngredient, id: 'id3' };

      const previousState = {
        ingredients: [],
        ingredientBurgers: [ingredient1, ingredient2, ingredient3],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      };

      const action = reorderIngredients({ from: 0, to: 2 });
      const result = reducer(previousState, action);

      expect(result.ingredientBurgers).toEqual([ingredient2, ingredient3, ingredient1]);
    });
  });

  describe('async actions: loadIngredients', () => {
    it('should handle loadIngredients.pending', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: 'some error',
        isOrderLoading: false,
        errorOrder: null,
      };

      const action = { type: loadIngredients.pending.type };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle loadIngredients.fulfilled', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: true,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      };

      const action = {
        type: loadIngredients.fulfilled.type,
        payload: mockIngredientsResponse,
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ingredients).toEqual(mockIngredientsResponse.data);
    });

    it('should handle loadIngredients.rejected with payload', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: true,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      };

      const action = {
        type: loadIngredients.rejected.type,
        payload: 'Network error',
        error: { message: 'Network error' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle loadIngredients.rejected without payload', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: true,
        error: null,
        isOrderLoading: false,
        errorOrder: null,
      };

      const action = {
        type: loadIngredients.rejected.type,
        payload: undefined,
        error: { message: 'Unknown error' },
      };
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.error).toBe('Unknown error');
    });
  });

  describe('async actions: getOrderId', () => {
    it('should handle getOrderId.pending', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [mockBurgerIngredient],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: false,
        errorOrder: 'previous error',
      };

      const action = { type: getOrderId.pending.type };
      const result = reducer(previousState, action);

      expect(result.isOrderLoading).toBe(true);
      expect(result.errorOrder).toBe(null);
    });

    it('should handle getOrderId.fulfilled', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [mockBurgerIngredient],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: true,
        errorOrder: null,
      };

      const action = {
        type: getOrderId.fulfilled.type,
        payload: mockOrderResponse,
      };
      const result = reducer(previousState, action);

      expect(result.isOrderLoading).toBe(false);
      expect(result.orderAnswer).toEqual(mockOrderResponse);
      expect(result.ingredientBurgers).toEqual([]); // должен очищаться
    });

    it('should handle getOrderId.rejected with payload', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: true,
        errorOrder: null,
      };

      const action = {
        type: getOrderId.rejected.type,
        payload: 'Order failed',
        error: { message: 'Order failed' },
      };
      const result = reducer(previousState, action);

      expect(result.isOrderLoading).toBe(false);
      expect(result.errorOrder).toBe('Order failed');
    });

    it('should handle getOrderId.rejected without payload', () => {
      const previousState = {
        ingredients: [],
        ingredientBurgers: [],
        ingredientModal: [],
        orderAnswer: null,
        isLoading: false,
        error: null,
        isOrderLoading: true,
        errorOrder: null,
      };

      const action = {
        type: getOrderId.rejected.type,
        payload: undefined,
        error: { message: 'Unknown error' },
      };
      const result = reducer(previousState, action);

      expect(result.isOrderLoading).toBe(false);
      expect(result.errorOrder).toBe('Unknown error');
    });
  });
});
