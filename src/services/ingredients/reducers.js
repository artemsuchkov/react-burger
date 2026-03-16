import { createSlice } from '@reduxjs/toolkit';

import { loadIngredients } from './actions';

const initialState = {
  ingredients: [],
  ingredientBurgers: [],
  isLoading: false,
  error: null,
};

const ingredientsReducers = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredientToBurger: (state, action) => {
      state.ingredientBurgers.push(action.payload);
    },
    removeIngredientFromBurger: (state, action) => {
      const itemIdToRemove = action.payload;
      state.ingredientBurgers = state.ingredientBurgers.filter(
        ({ item }) => item._id !== itemIdToRemove
      );
    },
    clearIngredientBurgers: (state) => {
      state.ingredientBurgers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // loadTasks
      .addCase(loadIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload.data;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error?.message ?? 'Unknown error';
      });

    /*       // addTask
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // removeTask
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      }); */
  },
});

// Экспортируем редюсеры как экшены
export const {
  addIngredientToBurger,
  removeIngredientFromBurger,
  clearIngredientBurgers,
} = ingredientsReducers.actions;

export default ingredientsReducers.reducer;
