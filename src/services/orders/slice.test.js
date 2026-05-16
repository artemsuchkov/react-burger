import { describe, it, expect } from 'vitest';

import { mockOrder, mockDataResponse } from '@/utils/constants';

import reducer, {
  connect,
  disconnect,
  onOpen,
  onAllOrders,
  onUserOrders,
  onError,
  onClose,
  selectIsConnected,
  selectAllOrders,
  selectUserOrders,
} from './slice';

describe('socket slice', () => {
  describe('initialState', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, { type: 'unknown' })).toEqual({
        isConnected: false,
        allOrders: [],
        userOrders: [],
        error: null,
        isLoading: false,
      });
    });
  });

  describe('synchronous reducers', () => {
    it('should handle connect', () => {
      const previousState = {
        isConnected: false,
        allOrders: [],
        userOrders: [],
        error: 'previous error',
        isLoading: false,
      };

      const action = connect();
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(true);
      expect(result.error).toBe(null);
      // остальные поля не должны меняться
      expect(result.isConnected).toBe(false);
      expect(result.allOrders).toEqual([]);
      expect(result.userOrders).toEqual([]);
    });

    it('should handle disconnect', () => {
      const previousState = {
        isConnected: true,
        allOrders: [mockDataResponse],
        userOrders: [mockOrder],
        error: null,
        isLoading: true,
      };

      const action = disconnect();
      const result = reducer(previousState, action);

      expect(result.isConnected).toBe(false);
      expect(result.allOrders).toEqual([]);
      expect(result.userOrders).toEqual([]);
      expect(result.isLoading).toBe(false);
      expect(result.error).toBe(null);
    });

    it('should handle onOpen', () => {
      const previousState = {
        isConnected: false,
        allOrders: [],
        userOrders: [],
        error: 'some error',
        isLoading: true,
      };

      const action = onOpen();
      const result = reducer(previousState, action);

      expect(result.isLoading).toBe(false);
      expect(result.isConnected).toBe(true);
      expect(result.error).toBe(null);
      // остальные поля не меняются
      expect(result.allOrders).toEqual([]);
      expect(result.userOrders).toEqual([]);
    });

    it('should handle onAllOrders', () => {
      const previousState = {
        isConnected: true,
        allOrders: [],
        userOrders: [],
        error: null,
        isLoading: false,
      };

      const action = onAllOrders(mockDataResponse);
      const result = reducer(previousState, action);

      expect(result.allOrders).toEqual([mockDataResponse]);
      // остальные поля не меняются
      expect(result.isConnected).toBe(true);
      expect(result.userOrders).toEqual([]);
      expect(result.error).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('should handle onUserOrders', () => {
      const previousState = {
        isConnected: true,
        allOrders: [],
        userOrders: [],
        error: null,
        isLoading: false,
      };

      const action = onUserOrders([mockOrder]);
      const result = reducer(previousState, action);

      expect(result.userOrders).toEqual([mockOrder]);
      // остальные поля не меняются
      expect(result.isConnected).toBe(true);
      expect(result.allOrders).toEqual([]);
      expect(result.error).toBe(null);
      expect(result.isLoading).toBe(false);
    });

    it('should handle onError', () => {
      const previousState = {
        isConnected: true,
        allOrders: [],
        userOrders: [],
        error: null,
        isLoading: true,
      };

      const action = onError('Socket connection failed');
      const result = reducer(previousState, action);

      expect(result.error).toBe('Socket connection failed');
      expect(result.isLoading).toBe(false);
      // остальные поля не меняются
      expect(result.isConnected).toBe(true);
      expect(result.allOrders).toEqual([]);
      expect(result.userOrders).toEqual([]);
    });

    it('should handle onClose', () => {
      const previousState = {
        isConnected: true,
        allOrders: [mockDataResponse],
        userOrders: [mockOrder],
        error: null,
        isLoading: true,
      };

      const action = onClose();
      const result = reducer(previousState, action);

      expect(result.isConnected).toBe(false);
      expect(result.isLoading).toBe(false);
      // остальные поля не меняются
      expect(result.allOrders).toEqual([mockDataResponse]);
      expect(result.userOrders).toEqual([mockOrder]);
      expect(result.error).toBe(null);
    });
  });

  describe('selectors', () => {
    it('should select isConnected', () => {
      const state = {
        socket: {
          isConnected: true,
          allOrders: [],
          userOrders: [],
          error: null,
          isLoading: false,
        },
      };

      expect(selectIsConnected(state)).toBe(true);
    });

    it('should select allOrders', () => {
      const state = {
        socket: {
          isConnected: false,
          allOrders: [mockDataResponse],
          userOrders: [],
          error: null,
          isLoading: false,
        },
      };

      expect(selectAllOrders(state)).toEqual([mockDataResponse]);
    });

    it('should select userOrders', () => {
      const state = {
        socket: {
          isConnected: false,
          allOrders: [],
          userOrders: [mockOrder],
          error: null,
          isLoading: false,
        },
      };

      expect(selectUserOrders(state)).toEqual([mockOrder]);
    });
  });
});
