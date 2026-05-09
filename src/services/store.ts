import { configureStore } from '@reduxjs/toolkit';

import ingredientsSlice from './ingredients/slice.ts';
import { createSocketMiddleware } from './middleware/socketMiddleware';
import socketSlice from './orders/slice.ts';
// Конфиг для заказов
import { ordersSocketConfig } from './orders/socketConfig';
import userSlice from './user/slice.ts';

// Создаем middleware для заказов
const ordersSocketMiddleware = createSocketMiddleware(ordersSocketConfig);

export const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    user: userSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ordersSocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof configureStore>;
