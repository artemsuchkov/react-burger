import { createAction } from '@reduxjs/toolkit';

import type { DataResponse, Order } from '../middleware/socketMiddleware';

// Управляющие экшены
export const connect = createAction(
  'socket/connect',
  (payload?: { token?: string }) => ({
    payload,
  })
);

export const disconnect = createAction('socket/disconnect');

export const sendMessage = createAction('socket/sendMessage', (message: unknown) => ({
  payload: message,
}));

// Событийные экшены
export const onOpen = createAction('socket/onOpen');
export const onAllOrders = createAction<DataResponse>('socket/onAllOrders');
export const onUserOrders = createAction<Order[]>('socket/onUserOrders');
export const onError = createAction<string>('socket/onError');
export const onClose = createAction('socket/onClose');
