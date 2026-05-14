import { describe, it, expect } from 'vitest';

import {
  connect,
  disconnect,
  sendMessage,
  onOpen,
  onAllOrders,
  onUserOrders,
  onError,
  onClose,
} from './actions';

describe('orders actions', () => {
  describe('connect', () => {
    it('должен создавать экшен с типом "socket/connect"', () => {
      const action = connect();
      expect(action).toEqual({
        type: 'socket/connect',
        payload: undefined,
      });
    });

    it('должен создавать экшен с payload, содержащим token', () => {
      const action = connect({ token: 'test-token' });
      expect(action).toEqual({
        type: 'socket/connect',
        payload: { token: 'test-token' },
      });
    });

    it('должен создавать экшен с пустым payload, если передан undefined', () => {
      const action = connect(undefined);
      expect(action).toEqual({
        type: 'socket/connect',
        payload: undefined,
      });
    });
  });

  describe('disconnect', () => {
    it('должен создавать экшен с типом "socket/disconnect"', () => {
      const action = disconnect();
      expect(action).toEqual({
        type: 'socket/disconnect',
      });
    });
  });

  describe('sendMessage', () => {
    it('должен создавать экшен с типом "socket/sendMessage" и payload', () => {
      const message = { type: 'ping', data: 'hello' };
      const action = sendMessage(message);
      expect(action).toEqual({
        type: 'socket/sendMessage',
        payload: message,
      });
    });

    it('должен обрабатывать различные типы сообщений', () => {
      const stringMessage = 'test';
      expect(sendMessage(stringMessage)).toEqual({
        type: 'socket/sendMessage',
        payload: stringMessage,
      });

      const numberMessage = 123;
      expect(sendMessage(numberMessage)).toEqual({
        type: 'socket/sendMessage',
        payload: numberMessage,
      });

      const nullMessage = null;
      expect(sendMessage(nullMessage)).toEqual({
        type: 'socket/sendMessage',
        payload: nullMessage,
      });
    });
  });

  describe('onOpen', () => {
    it('должен создавать экшен с типом "socket/onOpen"', () => {
      const action = onOpen();
      expect(action).toEqual({
        type: 'socket/onOpen',
      });
    });
  });

  describe('onAllOrders', () => {
    it('должен создавать экшен с типом "socket/onAllOrders" и payload типа DataResponse', () => {
      const payload = {
        success: true,
        orders: [
          {
            _id: '1',
            ingredients: ['60d3b41abdacab0026a733c6'],
            status: 'done',
            name: 'Burger',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
            number: 12345,
          },
        ],
        total: 100,
        totalToday: 10,
      };
      const action = onAllOrders(payload);
      expect(action).toEqual({
        type: 'socket/onAllOrders',
        payload,
      });
    });
  });

  describe('onUserOrders', () => {
    it('должен создавать экшен с типом "socket/onUserOrders" и payload типа Order[]', () => {
      const payload = [
        {
          _id: '2',
          ingredients: ['60d3b41abdacab0026a733c7'],
          status: 'pending',
          name: 'User Burger',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
          number: 54321,
        },
      ];
      const action = onUserOrders(payload);
      expect(action).toEqual({
        type: 'socket/onUserOrders',
        payload,
      });
    });
  });

  describe('onError', () => {
    it('должен создавать экшен с типом "socket/onError" и payload строкой', () => {
      const errorMessage = 'Connection failed';
      const action = onError(errorMessage);
      expect(action).toEqual({
        type: 'socket/onError',
        payload: errorMessage,
      });
    });
  });

  describe('onClose', () => {
    it('должен создавать экшен с типом "socket/onClose"', () => {
      const action = onClose();
      expect(action).toEqual({
        type: 'socket/onClose',
      });
    });
  });
});
