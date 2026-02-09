import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccountNotifications } from './useAccountNotifications';

// Mock AuthContext
let mockUser: any = { uid: 'user-1', email: 'test@test.com' };
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: mockUser })),
}));

// Capture onSnapshot callback
let snapshotCallback: ((snap: any) => void) | null = null;
const unsubscribeMock = vi.fn();

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    collection: vi.fn((_db, ...paths) => ({ path: paths.join('/') })),
    query: vi.fn((ref) => ref),
    orderBy: vi.fn(),
    limit: vi.fn(),
    where: vi.fn(),
    doc: vi.fn((_db, ...paths) => ({ path: paths.join('/') })),
    updateDoc: vi.fn(() => Promise.resolve()),
    onSnapshot: vi.fn((_q, cb) => {
      snapshotCallback = cb;
      return unsubscribeMock;
    }),
    writeBatch: vi.fn(() => ({
      update: vi.fn(),
      commit: vi.fn(() => Promise.resolve()),
    })),
  };
});

vi.mock('../config/firebase', () => ({
  db: {},
  APP_ID: 'test-app',
}));

const { onSnapshot, updateDoc, where, writeBatch } = await import('firebase/firestore');

function makeSnapshotDocs(docs: Array<{ id: string; [k: string]: any }>) {
  return {
    docs: docs.map(d => ({
      id: d.id,
      data: () => {
        const { id: _, ...rest } = d;
        return rest;
      },
    })),
  };
}

describe('useAccountNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    snapshotCallback = null;
  });

  it('subscribes to notifications on mount and returns them', async () => {
    const { result } = renderHook(() => useAccountNotifications());

    expect(result.current.loading).toBe(true);
    expect(onSnapshot).toHaveBeenCalled();

    // Simulate snapshot
    act(() => {
      snapshotCallback!(makeSnapshotDocs([
        { id: 'n1', message: 'Transaction added', read: false, date: '2026-01-01' },
        { id: 'n2', message: 'Account shared', read: true, date: '2026-01-02' },
      ]));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0].id).toBe('n1');
  });

  it('filters by accountId when provided', () => {
    renderHook(() => useAccountNotifications('acct-1'));
    expect(where).toHaveBeenCalledWith('accountId', '==', 'acct-1');
  });

  it('handles no user gracefully', async () => {
    const saved = mockUser;
    mockUser = null;

    const { result } = renderHook(() => useAccountNotifications());

    expect(result.current.loading).toBe(false);
    expect(result.current.notifications).toEqual([]);
    expect(onSnapshot).not.toHaveBeenCalled();

    mockUser = saved;
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = renderHook(() => useAccountNotifications());
    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('markAsRead updates Firestore and optimistically updates local state', async () => {
    const { result } = renderHook(() => useAccountNotifications());

    act(() => {
      snapshotCallback!(makeSnapshotDocs([
        { id: 'n1', message: 'Test', read: false, date: '2026-01-01' },
      ]));
    });

    expect(result.current.notifications[0].read).toBe(false);

    await act(async () => {
      await result.current.markAsRead('n1');
    });

    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ path: expect.stringContaining('notifications') }),
      { read: true }
    );
    expect(result.current.notifications[0].read).toBe(true);
  });

  it('markAllAsRead batches all unread notifications', async () => {
    const mockBatch = { update: vi.fn(), commit: vi.fn(() => Promise.resolve()) };
    vi.mocked(writeBatch).mockReturnValue(mockBatch as any);

    const { result } = renderHook(() => useAccountNotifications());

    act(() => {
      snapshotCallback!(makeSnapshotDocs([
        { id: 'n1', message: 'A', read: false, date: '2026-01-01' },
        { id: 'n2', message: 'B', read: false, date: '2026-01-02' },
        { id: 'n3', message: 'C', read: true, date: '2026-01-03' },
      ]));
    });

    await act(async () => {
      await result.current.markAllAsRead();
    });

    // Should update only unread (n1, n2), not n3
    expect(mockBatch.update).toHaveBeenCalledTimes(2);
    expect(mockBatch.commit).toHaveBeenCalled();
    // All should now be read
    result.current.notifications.forEach(n => {
      expect(n.read).toBe(true);
    });
  });

  it('markAllAsRead does nothing with empty notifications', async () => {
    const { result } = renderHook(() => useAccountNotifications());

    act(() => {
      snapshotCallback!(makeSnapshotDocs([]));
    });

    await act(async () => {
      await result.current.markAllAsRead();
    });

    expect(writeBatch).not.toHaveBeenCalled();
  });

  it('markAsRead is no-op when user is null', async () => {
    const saved = mockUser;
    mockUser = null;

    const { result } = renderHook(() => useAccountNotifications());

    await act(async () => {
      await result.current.markAsRead('n1');
    });

    expect(updateDoc).not.toHaveBeenCalled();
    mockUser = saved;
  });
});
