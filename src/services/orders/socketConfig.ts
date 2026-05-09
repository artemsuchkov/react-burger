import { createSocketConfig } from '../middleware/socketMiddleware';

export const ordersSocketConfig = createSocketConfig({
  connectActionType: 'socket/connect',
  disconnectActionType: 'socket/disconnect',
  sendMessageActionType: 'socket/sendMessage',

  onOpenActionType: 'socket/onOpen',
  onMessageActionType: 'socket/onMessage',
  onErrorActionType: 'socket/onError',
  onCloseActionType: 'socket/onClose',

  createUrl: (payload?: { token?: string }) => {
    const baseUrl = 'wss://new-stellarburgers.education-services.ru/orders';
    if (payload?.token) {
      return `${baseUrl}?token=${payload.token}`;
    }
    return `${baseUrl}/all`;
  },

  onMessage: (data: string, store, originalPayload) => {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;

      if (parsed.success !== undefined && Array.isArray(parsed.orders)) {
        if (originalPayload?.token) {
          // Личные заказы
          store.dispatch({
            type: 'socket/onUserOrders',
            payload: parsed.orders,
          });
        } else {
          // Публичные заказы
          store.dispatch({
            type: 'socket/onAllOrders',
            payload: parsed,
          });
        }
      } else {
        console.log('[SocketConfig] Неизвестный формат ответа:', parsed);
        store.dispatch({
          type: 'socket/onError',
          payload: 'Неизвестный формат ответа',
        });
      }
    } catch (error) {
      store.dispatch({
        type: 'orders/onError',
        payload: error instanceof Error ? error.message : 'Ошибка парсинга сообщения',
      });
    }
  },

  onOpenHandler: (_, store) => {
    store.dispatch({ type: 'socket/onOpen' });
  },

  onErrorHandler: (_, store) => {
    store.dispatch({
      type: 'socket/onError',
      payload: 'WebSocket ошибка',
    });
  },

  onCloseHandler: (_, store) => {
    store.dispatch({ type: 'socket/onClose' });
  },

  autoReconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
});
