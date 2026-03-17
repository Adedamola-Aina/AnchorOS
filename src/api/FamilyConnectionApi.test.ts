// @ts-nocheck
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  disconnectFamilyConnection,
  shareFamilyAccount,
  subscribeToActiveFamilyConnection,
} from './FamilyConnectionApi';

const collection = vi.fn();
const query = vi.fn();
const where = vi.fn();
const onSnapshot = vi.fn();

const getFunctions = vi.fn();
const httpsCallable = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  query: (...args: unknown[]) => query(...args),
  where: (...args: unknown[]) => where(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
}));

vi.mock('firebase/functions', () => ({
  getFunctions: (...args: unknown[]) => getFunctions(...args),
  httpsCallable: (...args: unknown[]) => httpsCallable(...args),
}));

vi.mock('../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'app-test-id',
}));

describe('FamilyConnectionApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    where.mockImplementation((...args: unknown[]) => ({ type: 'where', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    getFunctions.mockReturnValue({ mockedFunctions: true });
  });

  it('subscribes to owner and member queries and emits owner priority', () => {
    const ownerUnsub = vi.fn();
    const memberUnsub = vi.fn();
    const callbacks: Array<(snap: { empty: boolean; docs: Array<{ id: string; data: () => Record<string, unknown> }> }) => void> = [];

    onSnapshot
      .mockImplementationOnce((_q: unknown, cb: (snap: unknown) => void) => {
        callbacks.push(cb as never);
        return ownerUnsub;
      })
      .mockImplementationOnce((_q: unknown, cb: (snap: unknown) => void) => {
        callbacks.push(cb as never);
        return memberUnsub;
      });

    const onData = vi.fn();
    const onLoaded = vi.fn();

    const unsubscribe = subscribeToActiveFamilyConnection('user-1', onData, onLoaded);

    callbacks[0]({
      empty: false,
      docs: [{ id: 'owner-conn', data: () => ({ ownerUid: 'user-1', status: 'active' }) }],
    });
    callbacks[1]({
      empty: false,
      docs: [{ id: 'member-conn', data: () => ({ memberUid: 'user-1', status: 'active' }) }],
    });

    expect(onData).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ id: 'owner-conn', ownerUid: 'user-1' }),
    );
    expect(onData).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ id: 'owner-conn' }),
    );
    expect(onLoaded).toHaveBeenCalledTimes(2);

    unsubscribe();
    expect(ownerUnsub).toHaveBeenCalledTimes(1);
    expect(memberUnsub).toHaveBeenCalledTimes(1);
  });

  it('falls back to member connection when owner snapshot is empty', () => {
    const callbacks: Array<(snap: { empty: boolean; docs: Array<{ id: string; data: () => Record<string, unknown> }> }) => void> = [];

    onSnapshot
      .mockImplementationOnce((_q: unknown, cb: (snap: unknown) => void) => {
        callbacks.push(cb as never);
        return vi.fn();
      })
      .mockImplementationOnce((_q: unknown, cb: (snap: unknown) => void) => {
        callbacks.push(cb as never);
        return vi.fn();
      });

    const onData = vi.fn();
    subscribeToActiveFamilyConnection('user-1', onData, vi.fn());

    callbacks[0]({ empty: true, docs: [] });
    callbacks[1]({
      empty: false,
      docs: [{ id: 'member-conn', data: () => ({ memberUid: 'user-1', status: 'active' }) }],
    });

    expect(onData).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: 'member-conn', memberUid: 'user-1' }),
    );
  });

  it('emits null when both owner and member snapshots are empty', () => {
    const callbacks: Array<(snap: { empty: boolean; docs: Array<{ id: string; data: () => Record<string, unknown> }> }) => void> = [];

    onSnapshot
      .mockImplementationOnce((_q: unknown, cb: (snap: unknown) => void) => {
        callbacks.push(cb as never);
        return vi.fn();
      })
      .mockImplementationOnce((_q: unknown, cb: (snap: unknown) => void) => {
        callbacks.push(cb as never);
        return vi.fn();
      });

    const onData = vi.fn();
    subscribeToActiveFamilyConnection('user-1', onData, vi.fn());

    callbacks[0]({ empty: true, docs: [] });
    callbacks[1]({ empty: true, docs: [] });

    expect(onData).toHaveBeenLastCalledWith(null);
  });

  it('calls shareAccount callable with payload', async () => {
    const callable = vi.fn().mockResolvedValue({ data: { success: true } });
    httpsCallable.mockReturnValue(callable);

    await shareFamilyAccount('acc-1', true);

    expect(httpsCallable).toHaveBeenCalledWith({ mockedFunctions: true }, 'shareAccount');
    expect(callable).toHaveBeenCalledWith({ accountId: 'acc-1', share: true });
  });

  it('calls disconnectFamily callable with payload', async () => {
    const callable = vi.fn().mockResolvedValue({ data: { success: true } });
    httpsCallable.mockReturnValue(callable);

    await disconnectFamilyConnection('leave');

    expect(httpsCallable).toHaveBeenCalledWith({ mockedFunctions: true }, 'disconnectFamily');
    expect(callable).toHaveBeenCalledWith({ type: 'leave' });
  });
});