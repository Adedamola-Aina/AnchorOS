import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FabricService } from '../../services/fabric/FabricService';
import { useFabricLiveSync } from './useFabricLiveSync';

const collection = vi.fn();
const query = vi.fn();
const where = vi.fn();
const orderBy = vi.fn();
const limit = vi.fn();
const onSnapshot = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: (...args: unknown[]) => collection(...args),
  query: (...args: unknown[]) => query(...args),
  where: (...args: unknown[]) => where(...args),
  orderBy: (...args: unknown[]) => orderBy(...args),
  limit: (...args: unknown[]) => limit(...args),
  onSnapshot: (...args: unknown[]) => onSnapshot(...args),
}));

vi.mock('../../config/firebase', () => ({
  db: { mocked: true },
  APP_ID: 'app-test-id',
}));

type SnapshotCallback = (snapshot: {
  docs: Array<{ id: string; data: () => Record<string, unknown> }>;
}) => void;

interface HookArgs {
  userId: string | null;
  isEnabled: boolean;
  fabricService: FabricService;
  refresh: () => void;
}

function makeArgs(overrides: Partial<HookArgs> = {}): HookArgs {
  return {
    userId: 'user-1',
    isEnabled: true,
    fabricService: {
      updateActivity: vi.fn(),
    } as unknown as FabricService,
    refresh: vi.fn(),
    ...overrides,
  };
}

describe('useFabricLiveSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockImplementation((...args: unknown[]) => ({ type: 'collection', args }));
    query.mockImplementation((...args: unknown[]) => ({ type: 'query', args }));
    where.mockImplementation((...args: unknown[]) => ({ type: 'where', args }));
    orderBy.mockImplementation((...args: unknown[]) => ({ type: 'orderBy', args }));
    limit.mockImplementation((...args: unknown[]) => ({ type: 'limit', args }));
  });

  it('does nothing when user is missing', () => {
    const args = makeArgs({ userId: null });

    renderHook(() => useFabricLiveSync(args));

    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it('does nothing when feature is disabled', () => {
    const args = makeArgs({ isEnabled: false });

    renderHook(() => useFabricLiveSync(args));

    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it('subscribes to all live data sources and pushes merged activity', () => {
    const callbacks: SnapshotCallback[] = [];
    onSnapshot.mockImplementation((_: unknown, cb: SnapshotCallback) => {
      callbacks.push(cb);
      return vi.fn();
    });

    const args = makeArgs();
    renderHook(() => useFabricLiveSync(args));

    expect(onSnapshot).toHaveBeenCalledTimes(4);
    expect(collection).toHaveBeenCalledWith(
      { mocked: true },
      'artifacts',
      'app-test-id',
      'users',
      'user-1',
      'finance',
    );
    expect(collection).toHaveBeenCalledWith(
      { mocked: true },
      'artifacts',
      'app-test-id',
      'users',
      'user-1',
      'commitments',
    );

    act(() => {
      callbacks[0]({ docs: [{ id: 'tx-1', data: () => ({ title: 'Food', type: 'expense' }) }] });
      callbacks[1]({ docs: [{ id: 'task-1', data: () => ({ title: 'Read', completed: true }) }] });
      callbacks[2]({ docs: [{ id: 'acc-1', data: () => ({ name: 'Main', balanceCents: 1000 }) }] });
      callbacks[3]({ docs: [{ id: 'rec-1', data: () => ({ title: 'Rent', status: 'active' }) }] });
    });

    expect((args.fabricService as unknown as { updateActivity: ReturnType<typeof vi.fn> }).updateActivity).toHaveBeenCalledTimes(4);
    expect(args.refresh).toHaveBeenCalledTimes(4);

    const finalCall = (args.fabricService as unknown as { updateActivity: ReturnType<typeof vi.fn> }).updateActivity.mock.calls.at(-1);
    expect(finalCall?.[0]).toHaveLength(1);
    expect(finalCall?.[1]).toHaveLength(1);
    expect(finalCall?.[2]).toHaveLength(1);
    expect(finalCall?.[3]).toHaveLength(1);
  });

  it('unsubscribes all listeners on unmount', () => {
    const unsubscribers = [vi.fn(), vi.fn(), vi.fn(), vi.fn()];
    let i = 0;
    onSnapshot.mockImplementation(() => unsubscribers[i++]);

    const args = makeArgs();
    const { unmount } = renderHook(() => useFabricLiveSync(args));
    unmount();

    expect(unsubscribers[0]).toHaveBeenCalledTimes(1);
    expect(unsubscribers[1]).toHaveBeenCalledTimes(1);
    expect(unsubscribers[2]).toHaveBeenCalledTimes(1);
    expect(unsubscribers[3]).toHaveBeenCalledTimes(1);
  });
});