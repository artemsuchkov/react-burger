import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsTasks, getOrderIdTasks } from '@/utils/api-ingredients.js';

import type { RootState } from '@/services/store';

// Типы данных
export type Ingredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

export type OrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type BurgerIngredient = {
  item: Ingredient;
  id: string;
};

// Асинхронные thunk'и с типизацией
export const loadIngredients = createAsyncThunk<IngredientsResponse>(
  'ingredients/loadIngredients',
  async () => {
    const response = await getIngredientsTasks();
    return response as IngredientsResponse;
  }
);

export const getOrderId = createAsyncThunk<OrderResponse, void, { state: RootState }>(
  'orders/getOrderId',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const ingredientBurgers = state.ingredients.ingredientBurgers as BurgerIngredient[];

    try {
      const response = await getOrderIdTasks(ingredientBurgers);
      return response as OrderResponse;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
