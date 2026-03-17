import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  onAuthStateChanged: vi.fn(),
  auth: { mocked: true },
  user: null as object | null,
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => mockState.onAuthStateChanged(...args),
}));

vi.mock('../config/firebase', () => ({
  auth: mockState.auth,
}));

import { useAuthService } from './useAuthService';

describe('useAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Provide a default no-op unsubscribe so the hook always has a valid cleanup
    mockState.onAuthStateChanged.mockReturnValue(vi.fn());
  });

  it('starts with loading: true and user: null', () => {
    const { result } = renderHook(() => useAuthService());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('sets user and clears loading when auth state resolves with a user', async () => {
    const fakeUser = { uid: 'user-1', email: 'test@example.com' };
    mockState.onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(fakeUser);
      return vi.fn();
    });

    const { result } = renderHook(() => useAuthService());

    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toEqual(fakeUser);
  });

  it('sets user to null and clears loading when auth state resolves with no user', async () => {
    mockState.onAuthStateChanged.mockImplementation((_auth, cb) => {
      cb(null);
      return vi.fn();
    });

    const { result } = renderHook(() => useAuthService());

    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('clears loading on auth error', async () => {
    mockState.onAuthStateChanged.mockImplementation((_auth, _cb, errCb) => {
      errCb(new Error('auth error'));
      return vi.fn();
    });

    const { result } = renderHook(() => useAuthService());

    await act(async () => {});

    expect(result.current.loading).toBe(false);
  });

  it('calls unsubscribe on unmount', () => {
    const unsubscribe = vi.fn();
    mockState.onAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useAuthService());
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
