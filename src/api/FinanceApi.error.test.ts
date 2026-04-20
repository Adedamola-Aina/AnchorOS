// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { onSnapshot, where, limit } from 'firebase/firestore';
import { FinanceApi } from './FinanceApi';

describe('FinanceApi — error callbacks & search filters', () => {
  let api: FinanceApi;
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (FinanceApi as any).instance = undefined;
    api = FinanceApi.getInstance();
  });

  it('subscribeToAccounts forwards snapshot errors', () => {
    let errorCb: any;
    vi.mocked(onSnapshot).mockImplementation((_q, _o, _next, err) => {
      errorCb = err;
      return mockUnsubscribe;
    });
    const onError = vi.fn();
    api.subscribeToAccounts('u1', vi.fn(), onError);
    errorCb(new Error('perm-denied'));
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('subscribeToRecentTransactions forwards snapshot errors', () => {
    let errorCb: any;
    vi.mocked(onSnapshot).mockImplementation((_q, _o, _next, err) => {
      errorCb = err;
      return mockUnsubscribe;
    });
    const onError = vi.fn();
    api.subscribeToRecentTransactions('u1', 10, vi.fn(), onError);
    errorCb(new Error('boom'));
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('subscribeToRecentTransactions delivers mapped data', async () => {
    let nextCb: any;
    vi.mocked(onSnapshot).mockImplementation((_q, _o, next) => {
      nextCb = next;
      return mockUnsubscribe;
    });
    const onData = vi.fn();
    api.subscribeToRecentTransactions('u1', 5, onData, vi.fn());
    nextCb({ docs: [{ id: 'r1', data: () => ({ title: 'Coffee', amountCents: 300 }) }] });
    await vi.waitFor(() =>
      expect(onData).toHaveBeenCalledWith([{ id: 'r1', title: 'Coffee', amountCents: 300 }]),
    );
  });

  it('searchTransactions applies category, type, min & max filters', () => {
    vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);
    api.searchTransactions(
      'u1',
      { category: 'Food', type: 'expense', minAmount: 100, maxAmount: 1000, limit: 25 },
      vi.fn(),
      vi.fn(),
    );
    expect(where).toHaveBeenCalledWith('category', '==', 'Food');
    expect(where).toHaveBeenCalledWith('type', '==', 'expense');
    expect(where).toHaveBeenCalledWith('amountCents', '>=', 100);
    expect(where).toHaveBeenCalledWith('amountCents', '<=', 1000);
    expect(limit).toHaveBeenCalledWith(25);
  });

  it('searchTransactions forwards data and errors', () => {
    let nextCb: any;
    let errorCb: any;
    vi.mocked(onSnapshot).mockImplementation((_q, _o, next, err) => {
      nextCb = next;
      errorCb = err;
      return mockUnsubscribe;
    });
    const onData = vi.fn();
    const onError = vi.fn();
    api.searchTransactions('u1', {}, onData, onError);
    nextCb({ docs: [{ id: 's1', data: () => ({ title: 'Item' }) }] });
    expect(onData).toHaveBeenCalledWith([{ id: 's1', title: 'Item' }]);
    errorCb(new Error('search failed'));
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('searchTransactions falls back to limit of 50 when none is supplied', () => {
    vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe);
    api.searchTransactions('u1', {}, vi.fn(), vi.fn());
    expect(limit).toHaveBeenCalledWith(50);
  });
});
