import { onOpen, onMessage, onError, onClose } from '../orders/actions.ts';

import type { Middleware, PayloadAction } from '@reduxjs/toolkit';

export type Order = {
  _id: string;
  ingredients: string[];
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type DataResponse = {
  success: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
};

const SOCKET_URL = 'wss://new-stellarburgers.education-services.ru/orders';

let ws: WebSocket | null = null;

const socketMiddleware: Middleware = (store) => (next) => (action) => {
  const { type } = action as PayloadAction;
  const { payload: token } = action as PayloadAction<string>;

  if (type === 'socket/connect') {
    if (token !== undefined) ws = new WebSocket(`${SOCKET_URL}?token=${token}`);
    else ws = new WebSocket(`${SOCKET_URL}/all`);

    // Закрываем старое соединение, если есть
    /* if (ws) {
            ws.close();
        } */

    // Обработчик открытия соединения
    ws.onopen = (): void => {
      store.dispatch(onOpen());
    };

    // Обработчик входящих сообщений
    ws.onmessage = (event: MessageEvent<string>): void => {
      try {
        const data: DataResponse = JSON.parse(event.data);
        store.dispatch(onMessage(data));
      } catch (_error) {
        const errorMessage =
          _error instanceof Error ? _error.message : 'Ошибка парсинга сообщения';
        store.dispatch(onError(errorMessage));
      }
    };

    // Обработчик ошибок
    ws.onerror = (): void => {
      store.dispatch(onError('WebSocket ошибка'));
    };

    // Обработчик закрытия соединения
    ws.onclose = (): void => {
      store.dispatch(onClose());
      ws = null;
    };
  }

  if (type === 'socket/disconnect') {
    if (ws) {
      ws.close();
      ws = null;
    }
  }

  if (type === 'socket/onError') {
    store.dispatch(onError('Ручной вызов ошибки'));
  }

  return next(action);
};

export default socketMiddleware;
