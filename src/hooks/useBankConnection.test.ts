// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBankConnection } from './useBankConnection';

// Mock firebase/functions
const mockCallable = vi.fn();
vi.mock('firebase/functions', () => ({
  httpsCallable: (...args: unknown[]) => mockCallable(...args),
}));

vi.mock('../config/firebase', () => ({
  functions: { app: {} },
}));

describe('useBankConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with idle state', () => {
    const { result } = renderHook(() => useBankConnection());
    expect(result.current.isLinking).toBe(false);
    expect(result.current.isSyncing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('linkBank', () => {
    it('calls linkBankAccount callable with auth code', async () => {
      const mockResult = { data: { accountId: 'acc-1', institutionName: 'GTBank' } };
      mockCallable.mockReturnValue(vi.fn().mockResolvedValue(mockResult));

      const { result } = renderHook(() => useBankConnection());
      let response: unknown;
      await act(async () => {
        response = await result.current.linkBank('mono_auth_code_123');
      });

      expect(mockCallable).toHaveBeenCalledWith(expect.anything(), 'linkBankAccount');
      expect(response).toEqual(mockResult.data);
    });

    it('sets isLinking during the call', async () => {
      let resolvePromise: (v: unknown) => void;
      const pending = new Promise(r => { resolvePromise = r; });
      mockCallable.mockReturnValue(vi.fn().mockReturnValue(pending));

      const { result } = renderHook(() => useBankConnection());
      let linkPromise: Promise<unknown>;
      act(() => {
        linkPromise = result.current.linkBank('code');
      });
      expect(result.current.isLinking).toBe(true);

      await act(async () => {
        resolvePromise!({ data: {} });
        await linkPromise;
      });
      expect(result.current.isLinking).toBe(false);
    });

    it('sets error on failure and clears isLinking', async () => {
      mockCallable.mockReturnValue(vi.fn().mockRejectedValue(new Error('Connection failed')));

      const { result } = renderHook(() => useBankConnection());
      await act(async () => {
        await result.current.linkBank('bad_code').catch(() => {});
      });

      expect(result.current.isLinking).toBe(false);
      expect(result.current.error).toBe('Connection failed');
    });
  });

  describe('unlinkBank', () => {
    it('calls unlinkBankAccount callable with account id', async () => {
      mockCallable.mockReturnValue(vi.fn().mockResolvedValue({ data: { success: true } }));

      const { result } = renderHook(() => useBankConnection());
      await act(async () => {
        await result.current.unlinkBank('acc-1');
      });

      expect(mockCallable).toHaveBeenCalledWith(expect.anything(), 'unlinkBankAccount');
    });
  });

  describe('syncNow', () => {
    it('calls syncBankAccountNow callable with account id', async () => {
      mockCallable.mockReturnValue(vi.fn().mockResolvedValue({ data: { transactionsAdded: 5 } }));

      const { result } = renderHook(() => useBankConnection());
      let response: unknown;
      await act(async () => {
        response = await result.current.syncNow('acc-1');
      });

      expect(mockCallable).toHaveBeenCalledWith(expect.anything(), 'syncBankAccountNow');
      expect(response).toEqual({ transactionsAdded: 5 });
    });

    it('sets isSyncing during the call', async () => {
      let resolvePromise: (v: unknown) => void;
      const pending = new Promise(r => { resolvePromise = r; });
      mockCallable.mockReturnValue(vi.fn().mockReturnValue(pending));

      const { result } = renderHook(() => useBankConnection());
      let syncPromise: Promise<unknown>;
      act(() => {
        syncPromise = result.current.syncNow('acc-1');
      });
      expect(result.current.isSyncing).toBe(true);

      await act(async () => {
        resolvePromise!({ data: { transactionsAdded: 0 } });
        await syncPromise;
      });
      expect(result.current.isSyncing).toBe(false);
    });

    it('returns early with error when offline', async () => {
      const original = navigator.onLine;
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

      const { result } = renderHook(() => useBankConnection());
      let response: unknown;
      await act(async () => {
        response = await result.current.syncNow('acc-1');
      });

      expect(response).toEqual({ transactionsAdded: 0 });
      expect(result.current.error).toBe('You are offline — sync requires an internet connection');
      expect(mockCallable).not.toHaveBeenCalled();

      Object.defineProperty(navigator, 'onLine', { value: original, configurable: true });
    });
  });

  describe('clearError', () => {
    it('resets error state', async () => {
      mockCallable.mockReturnValue(vi.fn().mockRejectedValue(new Error('oops')));

      const { result } = renderHook(() => useBankConnection());
      await act(async () => {
        await result.current.linkBank('code').catch(() => {});
      });
      expect(result.current.error).toBe('oops');

      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });
  });
});
