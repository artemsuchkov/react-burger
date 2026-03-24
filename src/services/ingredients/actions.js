import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsTasks, getOrderIdTasks } from '@utils/todoist-api.js';

export const loadIngredients = createAsyncThunk(
  'ingredients/loadIngredients',
  async () => {
    return getIngredientsTasks();
  }
);

export const getOrderId = createAsyncThunk(
  'orders/getOrderId',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const ingredientBurgers = state.ingredients.ingredientBurgers;

    try {
      return await getOrderIdTasks(ingredientBurgers);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
