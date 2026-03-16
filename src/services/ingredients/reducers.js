import { createSlice } from '@reduxjs/toolkit';

import { loadIngredients } from './actions';

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

const ingredientsReducers = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
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

export default ingredientsReducers.reducer;
