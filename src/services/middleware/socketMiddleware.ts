import type { Middleware, PayloadAction, MiddlewareAPI } from '@reduxjs/toolkit';

// Реэкспорт типов из старого middleware для совместимости
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

export type UserOrdersResponse = Order[];

export type SocketMiddlewareConfig = {
  // Типы экшенов для управления соединением
  connectActionType: string;
  disconnectActionType: string;
  sendMessageActionType?: string;

  // Типы экшенов для событий WebSocket
  onOpenActionType: string;
  onMessageActionType: string;
  onErrorActionType: string;
  onCloseActionType: string;

  // Функция для создания URL (может использовать payload)
  createUrl: (payload?: { token?: string }) => string;

  // Функция для обработки входящих сообщений
  onMessage: (
    data: string,
    store: MiddlewareAPI,
    originalPayload?: { token?: string }
  ) => void;

  // Опциональные настройки
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;

  // Хуки для кастомизации
  onBeforeConnect?: (payload?: { token?: string }) => void | Promise<void>;
  onAfterDisconnect?: () => void;

  // Дополнительные обработчики WebSocket событий
  onOpenHandler?: (
    event: Event,
    store: MiddlewareAPI,
    payload?: { token?: string }
  ) => void;
  onErrorHandler?: (event: Event, store: MiddlewareAPI) => void;
  onCloseHandler?: (event: CloseEvent, store: MiddlewareAPI) => void;
};

type SocketConnection = {
  ws: WebSocket | null;
  reconnectAttempts: number;
  isConnecting: boolean;
  lastPayload?: { token?: string } | undefined;
  reconnectTimer?: NodeJS.Timeout;
  wasManuallyClosed?: boolean;
};

export const createSocketMiddleware = (config: SocketMiddlewareConfig): Middleware => {
  const connections = new Map<string, SocketConnection>();

  return (store) => (next) => (action) => {
    const { type, payload } = action as PayloadAction<{ token?: string } | undefined>;

    // Генерация ключа соединения на основе типа экшена
    const connectionKey = config.connectActionType;
    let connection = connections.get(connectionKey);

    if (!connection) {
      connection = {
        ws: null,
        reconnectAttempts: 0,
        isConnecting: false,
        wasManuallyClosed: false,
      };
      connections.set(connectionKey, connection);
    }

    // Обработка подключения
    if (type === config.connectActionType) {
      // Если уже подключаемся или соединение установлено, не делаем ничего
      if (
        connection.isConnecting ||
        (connection.ws && connection.ws.readyState === WebSocket.OPEN)
      ) {
        console.log(
          `[SocketMiddleware] ${config.connectActionType}: уже подключается или соединено, пропускаем`
        );
        return next(action);
      }

      // Закрываем существующее соединение (если есть и оно не в состоянии CONNECTING)
      if (connection.ws && connection.ws.readyState !== WebSocket.CONNECTING) {
        console.log(
          `[SocketMiddleware] ${config.connectActionType}: закрываем существующее соединение (состояние: ${connection.ws.readyState})`
        );
        connection.ws.close();
        connection.ws = null;
      } else if (connection.ws) {
        console.log(
          `[SocketMiddleware] ${config.connectActionType}: соединение уже устанавливается, пропускаем создание нового`
        );
        return next(action);
      }

      // Очищаем таймер переподключения
      if (connection.reconnectTimer) {
        clearTimeout(connection.reconnectTimer);
        connection.reconnectTimer = undefined;
      }

      // Вызываем хук перед подключением
      if (config.onBeforeConnect) {
        Promise.resolve(config.onBeforeConnect(payload)).catch(() => {
          // Игнорируем ошибку хука
        });
      }

      // Сбрасываем счетчик переподключений
      connection.reconnectAttempts = 0;
      connection.lastPayload = payload;
      connection.isConnecting = true;

      // Создаем URL
      const url = config.createUrl(payload);
      console.log(
        `[SocketMiddleware] ${config.connectActionType}: создаем WebSocket с URL: ${url}`
      );

      try {
        connection.ws = new WebSocket(url);

        // Обработчик открытия соединения
        connection.ws.onopen = (event: Event): void => {
          console.log(
            `[SocketMiddleware] ${config.connectActionType}: соединение открыто`
          );
          connection!.isConnecting = false;
          connection!.reconnectAttempts = 0;
          connection!.wasManuallyClosed = false;

          if (config.onOpenHandler) {
            config.onOpenHandler(event, store, payload);
          } else {
            store.dispatch({ type: config.onOpenActionType });
          }
        };

        // Обработчик входящих сообщений
        connection.ws.onmessage = (event: MessageEvent): void => {
          try {
            config.onMessage(event.data, store, payload);
          } catch (error) {
            store.dispatch({
              type: config.onErrorActionType,
              payload:
                error instanceof Error ? error.message : 'Ошибка обработки сообщения',
            });
          }
        };

        // Обработчик ошибок
        connection.ws.onerror = (event: Event): void => {
          console.log(
            `[SocketMiddleware] ${config.connectActionType}: ошибка WebSocket`
          );
          if (config.onErrorHandler) {
            config.onErrorHandler(event, store);
          } else {
            store.dispatch({
              type: config.onErrorActionType,
              payload: 'WebSocket ошибка',
            });
          }
        };

        // Обработчик закрытия соединения
        connection.ws.onclose = (event: CloseEvent): void => {
          console.log(
            `[SocketMiddleware] ${config.connectActionType}: соединение закрыто, код: ${event.code}, причина: ${event.reason}, было чисто: ${event.wasClean}, manually: ${connection!.wasManuallyClosed}`
          );
          connection!.ws = null;
          connection!.isConnecting = false;

          if (config.onCloseHandler) {
            config.onCloseHandler(event, store);
          } else {
            store.dispatch({ type: config.onCloseActionType });
          }

          // Автопереподключение
          if (
            config.autoReconnect &&
            connection!.reconnectAttempts < (config.maxReconnectAttempts || 5) &&
            !event.wasClean &&
            !connection!.wasManuallyClosed
          ) {
            connection!.reconnectAttempts++;
            console.log(
              `[SocketMiddleware] ${config.connectActionType}: планируем переподключение #${connection!.reconnectAttempts} через ${config.reconnectInterval || 3000}ms`
            );

            connection!.reconnectTimer = setTimeout(() => {
              store.dispatch({
                type: config.connectActionType,
                payload: connection!.lastPayload,
              });
            }, config.reconnectInterval || 3000);
          }

          // Сбрасываем флаг ручного закрытия
          connection!.wasManuallyClosed = false;
        };
      } catch (error) {
        store.dispatch({
          type: config.onErrorActionType,
          payload: `Ошибка создания WebSocket: ${error}`,
        });
        connection.isConnecting = false;
      }
    }

    // Обработка отключения
    if (type === config.disconnectActionType) {
      connection.wasManuallyClosed = true;

      if (connection.ws) {
        connection.ws.close();
        connection.ws = null;
      }

      if (connection.reconnectTimer) {
        clearTimeout(connection.reconnectTimer);
        connection.reconnectTimer = undefined;
      }

      connection.reconnectAttempts = 0;
      connection.isConnecting = false;

      if (config.onAfterDisconnect) {
        config.onAfterDisconnect();
      }
    }

    // Обработка отправки сообщения
    if (
      type === config.sendMessageActionType &&
      connection.ws?.readyState === WebSocket.OPEN
    ) {
      try {
        const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
        connection.ws.send(message);
      } catch (error) {
        store.dispatch({
          type: config.onErrorActionType,
          payload: `Ошибка отправки сообщения: ${error}`,
        });
      }
    }

    return next(action);
  };
};

// Утилитарная функция для создания конфигураций
export function createSocketConfig(
  baseConfig: Partial<SocketMiddlewareConfig>
): SocketMiddlewareConfig {
  return {
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    onMessage: (data, store) => {
      // Базовая обработка - просто диспатчим данные
      store.dispatch({
        type: baseConfig.onMessageActionType!,
        payload: data,
      });
    },
    ...baseConfig,
  } as SocketMiddlewareConfig;
}
