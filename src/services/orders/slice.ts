import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { DataResponse, Order } from '../middleware/middleware.ts';
import type { RootState } from '../store.ts';

// Интерфейсы для данных
type SocketState = {
  isConnected: boolean;
  allOrders: DataResponse[];
  userOrders: Order[];
  error: string | null;
  isLoading: boolean;
};

// Начальное состояние
const initialState: SocketState = {
  isConnected: false,
  allOrders: [],
  userOrders: [],
  error: null,
  isLoading: false,
};

// Создаём слайс
const socketSlice = createSlice({
  name: 'socket', // Название слайса
  initialState,
  selectors: {
    isConnected: (state) => state.isConnected,
    allOrders: (state) => state.allOrders,
    userOrders: (state) => state.userOrders,
  },
  reducers: {
    // Управляющие редьюсеры
    connect: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.allOrders = [];
      state.userOrders = [];
      state.isLoading = false;
    },
    // Событийные редьюсеры
    onOpen: (state) => {
      state.isLoading = false;
      state.isConnected = true;
      state.error = null;
    },
    onAllOrders: (state, action: PayloadAction<DataResponse>) => {
      state.allOrders = [action.payload];
    },
    onUserOrders: (state, action: PayloadAction<Order[]>) => {
      state.userOrders = action.payload;
    },
    onError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    onClose: (state) => {
      state.isConnected = false;
      state.isLoading = false;
    },
  },
});

// Экспортируем экшены
export const {
  connect,
  disconnect,
  onOpen,
  onAllOrders,
  onUserOrders,
  onError,
  onClose,
} = socketSlice.actions;

export const selectIsConnected = (state: RootState): boolean => state.socket.isConnected;
export const selectAllOrders = (state: RootState): DataResponse[] =>
  state.socket.allOrders;
export const selectUserOrders = (state: RootState): Order[] => state.socket.userOrders;

// Экспортируем редьюсер (его мы позже подключим к store)
export default socketSlice.reducer;
