import { createSlice } from '@reduxjs/toolkit';

import {
  loadIngredients,
  getOrderId,
  type Ingredient,
  type BurgerIngredient,
  type IngredientsResponse,
  type OrderResponse,
} from './actions';

import type { PayloadAction } from '@reduxjs/toolkit';

export type IngredientsState = {
  ingredients: Ingredient[];
  ingredientBurgers: BurgerIngredient[];
  ingredientModal: Ingredient[];
  orderAnswer: OrderResponse | null;
  isLoading: boolean;
  error: string | null;
  isOrderLoading: boolean;
  errorOrder: string | null;
};

const initialState: IngredientsState = {
  ingredients: [],
  ingredientBurgers: [],
  ingredientModal: [],
  orderAnswer: null,
  isLoading: false,
  error: null,
  isOrderLoading: false,
  errorOrder: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredientToBurger: (state, action: PayloadAction<BurgerIngredient>) => {
      state.ingredientBurgers.push(action.payload);
    },
    removeIngredientFromBurger: (state, action: PayloadAction<string>) => {
      const itemIdToRemove = action.payload;
      state.ingredientBurgers = state.ingredientBurgers.filter(
        (ingredient) => ingredient.item._id !== itemIdToRemove
      );
    },
    getBurgeringredientModal: (state, action: PayloadAction<Ingredient[]>) => {
      state.ingredientModal = action.payload;
    },
    reorderIngredients: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      const newList = [...state.ingredientBurgers];
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
      .addCase(
        loadIngredients.fulfilled,
        (state, action: PayloadAction<IngredientsResponse>) => {
          state.isLoading = false;
          state.ingredients = action.payload.data;
        }
      )
      .addCase(loadIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? action.error?.message ?? 'Unknown error';
      });
    builder
      // getOrderId
      .addCase(getOrderId.pending, (state) => {
        state.isOrderLoading = true;
        state.errorOrder = null;
      })
      .addCase(getOrderId.fulfilled, (state, action: PayloadAction<OrderResponse>) => {
        state.isOrderLoading = false;
        state.orderAnswer = action.payload;
        state.ingredientBurgers = [];
      })
      .addCase(getOrderId.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.errorOrder =
          (action.payload as string) ?? action.error?.message ?? 'Unknown error';
      });
  },
});

// Экспортируем редюсеры как экшены
export const {
  addIngredientToBurger,
  removeIngredientFromBurger,
  getBurgeringredientModal,
  reorderIngredients,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
