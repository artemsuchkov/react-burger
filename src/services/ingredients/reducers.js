import { createSlice } from '@reduxjs/toolkit';

import { loadIngredients, getOrderId } from './actions';

const initialState = {
  ingredients: [], // массив ингредиентов от сервера
  ingredientBurgers: [], // массив ингредиентов в собранном бургере
  ingredientModal: [], // модальное окно с ингредиентами
  orderAnswer: [], // модальное окно с ингредиентами
  isLoading: false,
  error: null,
  isOrderLoading: false,
  errorOrder: null,
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
        (ingredient) => ingredient.item.id !== itemIdToRemove
      );
    },
    getBurgeringredientModal: (state, action) => {
      state.ingredientModal = action.payload;
    },
    reorderIngredients: (state, action) => {
      const { from, to } = action.payload;
      const newList = [...state.ingredientBurgers];
      console.log('newList');
      console.log(newList);
      const movedItem = newList.splice(from, 1)[0];
      newList.splice(to, 0, movedItem);
      state.ingredientBurgers = newList;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadIngredients
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
    builder
      // getOrderId
      .addCase(getOrderId.pending, (state) => {
        state.isOrderLoading = true;
        state.errorOrder = null;
      })
      .addCase(getOrderId.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orderAnswer = action.payload;
        state.ingredientBurgers = []; // очищаем массив ингредиентов в собранном бургере
      })
      .addCase(getOrderId.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.errorOrder = action.payload ?? action.error?.message ?? 'Unknown error';
      });
  },
});

// Экспортируем редюсеры как экшены
export const {
  addIngredientToBurger,
  removeIngredientFromBurger,
  getBurgeringredientModal,
  reorderIngredients,
} = ingredientsReducers.actions;

export default ingredientsReducers.reducer;
