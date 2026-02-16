// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAccountNotifications } from './useAccountNotifications';

// Mock AuthContext
let mockUser: any = { uid: 'user-1', email: 'test@test.com' };
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: mockUser })),
}));

const {
  mockSubscribeToAccountNotifications,
  mockMarkAccountNotificationAsRead,
  mockMarkAllAccountNotificationsAsRead,
} = vi.hoisted(() => ({
  mockSubscribeToAccountNotifications: vi.fn(),
  mockMarkAccountNotificationAsRead: vi.fn(),
  mockMarkAllAccountNotificationsAsRead: vi.fn(),
}));

vi.mock('../api/AccountNotificationsApi', () => ({
  subscribeToAccountNotifications: mockSubscribeToAccountNotifications,
  markAccountNotificationAsRead: mockMarkAccountNotificationAsRead,
  markAllAccountNotificationsAsRead: mockMarkAllAccountNotificationsAsRead,
}));

let notificationsCallback: ((notifications: any[]) => void) | null = null;
const unsubscribeMock = vi.fn();

describe('useAccountNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    notificationsCallback = null;
    mockSubscribeToAccountNotifications.mockImplementation((_uid: string, _accountId: string | undefined, cb: any) => {
      notificationsCallback = cb;
      return unsubscribeMock;
    });
    mockMarkAccountNotificationAsRead.mockResolvedValue(undefined);
    mockMarkAllAccountNotificationsAsRead.mockResolvedValue(undefined);
  });

  it('subscribes to notifications on mount and returns them', async () => {
    const { result } = renderHook(() => useAccountNotifications());

    expect(result.current.loading).toBe(true);
    expect(mockSubscribeToAccountNotifications).toHaveBeenCalled();

    // Simulate subscription callback payload
    act(() => {
      notificationsCallback!([
        { id: 'n1', message: 'Transaction added', read: false, date: '2026-01-01' },
        { id: 'n2', message: 'Account shared', read: true, date: '2026-01-02' },
      ]);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0].id).toBe('n1');
  });

  it('filters by accountId when provided', () => {
    renderHook(() => useAccountNotifications('acct-1'));
    expect(mockSubscribeToAccountNotifications).toHaveBeenCalledWith('user-1', 'acct-1', expect.any(Function));
  });

  it('handles no user gracefully', async () => {
    const saved = mockUser;
    mockUser = null;

    const { result } = renderHook(() => useAccountNotifications());

    expect(result.current.loading).toBe(false);
    expect(result.current.notifications).toEqual([]);
    expect(mockSubscribeToAccountNotifications).not.toHaveBeenCalled();

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
      notificationsCallback!([
        { id: 'n1', message: 'Test', read: false, date: '2026-01-01' },
      ]);
    });

    expect(result.current.notifications[0].read).toBe(false);

    await act(async () => {
      await result.current.markAsRead('n1');
    });

    expect(mockMarkAccountNotificationAsRead).toHaveBeenCalledWith('user-1', 'n1');
    expect(result.current.notifications[0].read).toBe(true);
  });

  it('markAllAsRead batches all unread notifications', async () => {
    const { result } = renderHook(() => useAccountNotifications());

    act(() => {
      notificationsCallback!([
        { id: 'n1', message: 'A', read: false, date: '2026-01-01' },
        { id: 'n2', message: 'B', read: false, date: '2026-01-02' },
        { id: 'n3', message: 'C', read: true, date: '2026-01-03' },
      ]);
    });

    await act(async () => {
      await result.current.markAllAsRead();
    });

    expect(mockMarkAllAccountNotificationsAsRead).toHaveBeenCalledWith(
      'user-1',
      expect.arrayContaining([
        expect.objectContaining({ id: 'n1' }),
        expect.objectContaining({ id: 'n2' }),
      ])
    );
    // All should now be read
    result.current.notifications.forEach(n => {
      expect(n.read).toBe(true);
    });
  });

  it('markAllAsRead does nothing with empty notifications', async () => {
    const { result } = renderHook(() => useAccountNotifications());

    act(() => {
      notificationsCallback!([]);
    });

    await act(async () => {
      await result.current.markAllAsRead();
    });

    expect(mockMarkAllAccountNotificationsAsRead).not.toHaveBeenCalled();
  });

  it('markAsRead is no-op when user is null', async () => {
    const saved = mockUser;
    mockUser = null;

    const { result } = renderHook(() => useAccountNotifications());

    await act(async () => {
      await result.current.markAsRead('n1');
    });

    expect(mockMarkAccountNotificationAsRead).not.toHaveBeenCalled();
    mockUser = saved;
  });
});
