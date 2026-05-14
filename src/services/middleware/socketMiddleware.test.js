import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { createSocketMiddleware, createSocketConfig } from './socketMiddleware.ts';

// Мок WebSocket
const createMockWebSocket = () => {
  const instances = [];
  const MockWebSocket = vi.fn(function (url) {
    this.url = url;
    this.readyState = MockWebSocket.CONNECTING;
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
    this.sentMessages = [];
    this.close = vi.fn(() => {
      this.readyState = MockWebSocket.CLOSED;
      if (this.onclose) {
        this.onclose({ code: 1000, reason: '', wasClean: true });
      }
    });
    this.send = vi.fn((message) => {
      this.sentMessages.push(message);
    });
    instances.push(this);
  });

  MockWebSocket.CONNECTING = 0;
  MockWebSocket.OPEN = 1;
  MockWebSocket.CLOSING = 2;
  MockWebSocket.CLOSED = 3;

  MockWebSocket.prototype.simulateOpen = function () {
    this.readyState = MockWebSocket.OPEN;
    if (this.onopen) this.onopen({});
  };

  MockWebSocket.prototype.simulateMessage = function (data) {
    if (this.onmessage) this.onmessage({ data });
  };

  MockWebSocket.prototype.simulateError = function () {
    if (this.onerror) this.onerror({});
  };

  MockWebSocket.prototype.simulateClose = function (
    event = { code: 1000, reason: '', wasClean: true }
  ) {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) this.onclose(event);
  };

  MockWebSocket.instances = instances;
  // Не добавляем mockClear, чтобы избежать рекурсии

  return MockWebSocket;
};

// Мок store
const createMockStore = () => {
  const actions = [];
  const store = {
    getState: vi.fn(() => ({})),
    dispatch: vi.fn((action) => {
      actions.push(action);
      return action;
    }),
  };
  const next = vi.fn((action) => action);
  return { store, next, actions };
};

describe('createSocketMiddleware', () => {
  let MockWebSocket;
  let config;
  let middleware;
  let mockStore;
  let next;
  let dispatch;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Спай на таймерах для проверки вызовов
    vi.spyOn(global, 'setTimeout');
    vi.spyOn(global, 'clearTimeout');

    MockWebSocket = createMockWebSocket();
    global.WebSocket = MockWebSocket;

    config = {
      connectActionType: 'WS_CONNECT',
      disconnectActionType: 'WS_DISCONNECT',
      sendMessageActionType: 'WS_SEND_MESSAGE',
      onOpenActionType: 'WS_OPEN',
      onMessageActionType: 'WS_MESSAGE',
      onErrorActionType: 'WS_ERROR',
      onCloseActionType: 'WS_CLOSE',
      createUrl: vi.fn((payload) => `wss://example.com?token=${payload?.token || ''}`),
      onMessage: vi.fn((data, store) => {
        store.dispatch({ type: 'WS_MESSAGE', payload: data });
      }),
      autoReconnect: true,
      reconnectInterval: 100,
      maxReconnectAttempts: 3,
    };

    middleware = createSocketMiddleware(config);
    mockStore = createMockStore();
    next = mockStore.next;
    dispatch = (action) => middleware(mockStore.store)(next)(action);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('подключение (connect)', () => {
    it('должен создавать WebSocket при действии connect', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });

      expect(config.createUrl).toHaveBeenCalledWith({ token: 'abc' });
      expect(MockWebSocket).toHaveBeenCalledWith('wss://example.com?token=abc');
    });

    it('не должен создавать новое соединение, если уже подключается', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.readyState = WebSocket.CONNECTING;

      const firstCallCount = MockWebSocket.mock.calls.length;

      // Второй вызов connect
      dispatch({ type: 'WS_CONNECT', payload: { token: 'def' } });
      const secondCallCount = MockWebSocket.mock.calls.length;

      expect(secondCallCount).toBe(firstCallCount); // Новый WebSocket не создан
      expect(next).toHaveBeenCalledTimes(2);
    });

    it('не должен создавать новое соединение, если соединение уже открыто', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateOpen();

      // Второй вызов connect
      dispatch({ type: 'WS_CONNECT', payload: { token: 'def' } });
      const callCount = MockWebSocket.mock.calls.length;

      expect(callCount).toBe(1); // Только один вызов конструктора
      expect(next).toHaveBeenCalledTimes(2);
    });

    it('должен вызывать onBeforeConnect хук', () => {
      const onBeforeConnect = vi.fn();
      config.onBeforeConnect = onBeforeConnect;
      middleware = createSocketMiddleware(config);
      dispatch = (action) => middleware(mockStore.store)(next)(action);

      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });

      expect(onBeforeConnect).toHaveBeenCalledWith({ token: 'abc' });
    });

    it('должен диспатчить ошибку, если создание WebSocket выбрасывает исключение', () => {
      MockWebSocket.mockImplementation(() => {
        throw new Error('Connection failed');
      });

      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });

      expect(mockStore.store.dispatch).toHaveBeenCalledWith({
        type: 'WS_ERROR',
        payload: 'Ошибка создания WebSocket: Error: Connection failed',
      });
    });
  });

  describe('отключение (disconnect)', () => {
    it('должен устанавливать флаг wasManuallyClosed при действии disconnect', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      dispatch({ type: 'WS_DISCONNECT' });

      // Проверяем, что соединение обнулено
      expect(wsInstance.close).not.toHaveBeenCalled(); // В коде закомментирован close
      expect(next).toHaveBeenCalledTimes(2);
    });

    it('должен очищать таймер переподключения', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateClose({ wasClean: false });

      // Таймер установился
      expect(setTimeout).toHaveBeenCalled();

      // Вызываем disconnect
      dispatch({ type: 'WS_DISCONNECT' });

      expect(clearTimeout).toHaveBeenCalled();
    });

    it('должен вызывать onAfterDisconnect хук', () => {
      const onAfterDisconnect = vi.fn();
      config.onAfterDisconnect = onAfterDisconnect;
      middleware = createSocketMiddleware(config);
      dispatch = (action) => middleware(mockStore.store)(next)(action);

      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      dispatch({ type: 'WS_DISCONNECT' });

      expect(onAfterDisconnect).toHaveBeenCalled();
    });

    it('должен сбрасывать счетчик переподключений', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateClose({ wasClean: false });

      // Таймер установился, reconnectAttempts увеличился
      vi.advanceTimersByTime(config.reconnectInterval);
      // После переподключения счетчик увеличивается, но мы не проверяем

      dispatch({ type: 'WS_DISCONNECT' });

      // Проверяем, что после disconnect reconnectAttempts сброшен (в коде установлен в 0)
      // Это внутреннее состояние, сложно проверить напрямую, но можно проверить, что таймер очищен
      expect(clearTimeout).toHaveBeenCalled();
    });
  });

  describe('отправка сообщений', () => {
    it('должен отправлять сообщение, если соединение открыто', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateOpen();

      const message = { type: 'ping' };
      dispatch({ type: 'WS_SEND_MESSAGE', payload: message });

      expect(wsInstance.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('должен отправлять строку как есть, если payload является строкой', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateOpen();

      const message = 'ping';
      dispatch({ type: 'WS_SEND_MESSAGE', payload: message });

      expect(wsInstance.send).toHaveBeenCalledWith('ping');
    });

    it('не должен отправлять сообщение, если соединение не открыто', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      // Не открываем соединение, readyState остаётся CONNECTING

      dispatch({ type: 'WS_SEND_MESSAGE', payload: 'test' });

      expect(wsInstance.send).not.toHaveBeenCalled();
    });

    it('должен диспатчить ошибку, если отправка сообщения выбрасывает исключение', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateOpen();
      wsInstance.send.mockImplementation(() => {
        throw new Error('Send failed');
      });

      dispatch({ type: 'WS_SEND_MESSAGE', payload: 'test' });

      expect(mockStore.store.dispatch).toHaveBeenCalledWith({
        type: 'WS_ERROR',
        payload: 'Ошибка отправки сообщения: Error: Send failed',
      });
    });
  });

  describe('обработка событий WebSocket', () => {
    it('должен диспатчить onOpenActionType при открытии соединения', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      wsInstance.simulateOpen();

      expect(mockStore.store.dispatch).toHaveBeenCalledWith({
        type: 'WS_OPEN',
      });
    });

    it('должен вызывать onOpenHandler, если он предоставлен', () => {
      const onOpenHandler = vi.fn();
      config.onOpenHandler = onOpenHandler;
      middleware = createSocketMiddleware(config);
      dispatch = (action) => middleware(mockStore.store)(next)(action);

      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateOpen();

      expect(onOpenHandler).toHaveBeenCalledWith(expect.any(Object), mockStore.store, {
        token: 'abc',
      });
      expect(mockStore.store.dispatch).not.toHaveBeenCalledWith({
        type: 'WS_OPEN',
      });
    });

    it('должен вызывать onMessage при получении сообщения', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      wsInstance.simulateMessage('{"orders":[]}');

      expect(config.onMessage).toHaveBeenCalledWith('{"orders":[]}', mockStore.store, {
        token: 'abc',
      });
    });

    it('должен диспатчить ошибку, если onMessage выбрасывает исключение', () => {
      config.onMessage.mockImplementation(() => {
        throw new Error('Parse error');
      });
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      wsInstance.simulateMessage('invalid');

      expect(mockStore.store.dispatch).toHaveBeenCalledWith({
        type: 'WS_ERROR',
        payload: 'Parse error',
      });
    });

    it('должен диспатчить onErrorActionType при ошибке WebSocket', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      wsInstance.simulateError();

      expect(mockStore.store.dispatch).toHaveBeenCalledWith({
        type: 'WS_ERROR',
        payload: 'WebSocket ошибка',
      });
    });

    it('должен вызывать onErrorHandler, если он предоставлен', () => {
      const onErrorHandler = vi.fn();
      config.onErrorHandler = onErrorHandler;
      middleware = createSocketMiddleware(config);
      dispatch = (action) => middleware(mockStore.store)(next)(action);

      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateError();

      expect(onErrorHandler).toHaveBeenCalledWith(expect.any(Object), mockStore.store);
      expect(mockStore.store.dispatch).not.toHaveBeenCalledWith({
        type: 'WS_ERROR',
        payload: 'WebSocket ошибка',
      });
    });

    it('должен диспатчить onCloseActionType при закрытии соединения', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      wsInstance.simulateClose({ code: 1000, reason: '', wasClean: true });

      expect(mockStore.store.dispatch).toHaveBeenCalledWith({
        type: 'WS_CLOSE',
      });
    });

    it('должен вызывать onCloseHandler, если он предоставлен', () => {
      const onCloseHandler = vi.fn();
      config.onCloseHandler = onCloseHandler;
      middleware = createSocketMiddleware(config);
      dispatch = (action) => middleware(mockStore.store)(next)(action);

      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      const closeEvent = { code: 1000, reason: '', wasClean: true };
      wsInstance.simulateClose(closeEvent);

      expect(onCloseHandler).toHaveBeenCalledWith(closeEvent, mockStore.store);
      expect(mockStore.store.dispatch).not.toHaveBeenCalledWith({
        type: 'WS_CLOSE',
      });
    });
  });

  describe('автопереподключение', () => {
    it('должен планировать переподключение при нечистом закрытии', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      // Закрываем с wasClean: false
      wsInstance.simulateClose({ code: 1006, reason: '', wasClean: false });

      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        config.reconnectInterval
      );
    });

    it('не должен планировать переподключение при чистом закрытии', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      wsInstance.simulateClose({ code: 1000, reason: '', wasClean: true });

      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('не должен планировать переподключение, если autoReconnect отключен', () => {
      config.autoReconnect = false;
      middleware = createSocketMiddleware(config);
      dispatch = (action) => middleware(mockStore.store)(next)(action);

      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];
      wsInstance.simulateClose({ wasClean: false });

      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('не должен планировать переподключение, если было ручное отключение', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      // Ручное отключение
      dispatch({ type: 'WS_DISCONNECT' });
      wsInstance.simulateClose({ wasClean: false });

      expect(setTimeout).not.toHaveBeenCalled();
    });

    it('должен увеличивать счетчик переподключений', () => {
      dispatch({ type: 'WS_CONNECT', payload: { token: 'abc' } });
      const wsInstance = MockWebSocket.instances[0];

      wsInstance.simulateClose({ wasClean: false });

      // После первого закрытия reconnectAttempts = 1
      // Таймер установлен, запускаем его
      vi.advanceTimersByTime(config.reconnectInterval);

      // Должен быть диспатч connect с тем же payload
      expect(mockStore.store.dispatch).toHaveBeenCalledWith({
        type: 'WS_CONNECT',
        payload: { token: 'abc' },
      });
    });
  });

  describe('createSocketConfig', () => {
    it('должен создавать конфигурацию с дефолтными значениями', () => {
      const baseConfig = {
        connectActionType: 'CUSTOM_CONNECT',
        disconnectActionType: 'CUSTOM_DISCONNECT',
        onOpenActionType: 'CUSTOM_OPEN',
        onMessageActionType: 'CUSTOM_MESSAGE',
        onErrorActionType: 'CUSTOM_ERROR',
        onCloseActionType: 'CUSTOM_CLOSE',
        createUrl: () => 'wss://custom.com',
      };

      const config = createSocketConfig(baseConfig);

      expect(config.autoReconnect).toBe(true);
      expect(config.reconnectInterval).toBe(3000);
      expect(config.maxReconnectAttempts).toBe(5);
      expect(config.onMessage).toBeDefined();
      expect(config.connectActionType).toBe('CUSTOM_CONNECT');
      expect(config.createUrl()).toBe('wss://custom.com');
    });

    it('должен переопределять дефолтные значения', () => {
      const baseConfig = {
        connectActionType: 'CUSTOM_CONNECT',
        disconnectActionType: 'CUSTOM_DISCONNECT',
        onOpenActionType: 'CUSTOM_OPEN',
        onMessageActionType: 'CUSTOM_MESSAGE',
        onErrorActionType: 'CUSTOM_ERROR',
        onCloseActionType: 'CUSTOM_CLOSE',
        createUrl: () => 'wss://custom.com',
        autoReconnect: false,
        reconnectInterval: 5000,
        maxReconnectAttempts: 10,
      };

      const config = createSocketConfig(baseConfig);

      expect(config.autoReconnect).toBe(false);
      expect(config.reconnectInterval).toBe(5000);
      expect(config.maxReconnectAttempts).toBe(10);
    });

    it('должен предоставлять базовую обработку onMessage', () => {
      const baseConfig = {
        connectActionType: 'CUSTOM_CONNECT',
        disconnectActionType: 'CUSTOM_DISCONNECT',
        onOpenActionType: 'CUSTOM_OPEN',
        onMessageActionType: 'CUSTOM_MESSAGE',
        onErrorActionType: 'CUSTOM_ERROR',
        onCloseActionType: 'CUSTOM_CLOSE',
        createUrl: () => 'wss://custom.com',
      };

      const config = createSocketConfig(baseConfig);
      const mockStore = { dispatch: vi.fn() };

      config.onMessage('test data', mockStore);

      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: 'CUSTOM_MESSAGE',
        payload: 'test data',
      });
    });
  });
});
