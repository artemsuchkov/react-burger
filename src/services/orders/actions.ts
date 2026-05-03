import { createAction } from '@reduxjs/toolkit';

import type { DataResponse } from '../middleware/middleware.ts';

// Управляющие экшены
export const connect = createAction('socket/connect', (token: string) => ({
  payload: token,
}));
export const disconnect = createAction('socket/disconnect');
export const sendMessage = createAction('socket/sendMessage');

// Событийные экшены
export const onOpen = createAction('socket/onOpen');
export const onMessage = createAction<DataResponse>('socket/onMessage');
export const onError = createAction<string>('socket/onError');
export const onClose = createAction('socket/onClose');
