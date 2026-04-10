import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  pathname: '/dashboard',
  navigate: vi.fn(),
  backHandler: undefined as ((event: { canGoBack: boolean }) => void) | undefined,
  addListener: vi.fn((_event: string, callback: (event: { canGoBack: boolean }) => void) => {
    mockState.backHandler = callback;
    return Promise.resolve({ remove: vi.fn() });
  }),
  exitApp: vi.fn(() => Promise.resolve()),
  isNative: true,
  isAndroid: true,
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockState.navigate,
  useLocation: () => ({ pathname: mockState.pathname }),
}));

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: (...args: unknown[]) => mockState.addListener(...args),
    exitApp: (...args: unknown[]) => mockState.exitApp(...args),
  },
}));

vi.mock('../utils/platform', () => ({
  isNative: () => mockState.isNative,
  isAndroid: () => mockState.isAndroid,
}));

vi.mock('../utils/error', () => ({
  captureError: vi.fn(),
}));

import { useAndroidBackButton } from './useAndroidBackButton';

describe('useAndroidBackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.pathname = '/dashboard';
    mockState.backHandler = undefined;
    mockState.isNative = true;
    mockState.isAndroid = true;
  });

  it('registers listener on native android', async () => {
    renderHook(() => useAndroidBackButton());

    await waitFor(() => {
      expect(mockState.addListener).toHaveBeenCalledWith('backButton', expect.any(Function));
    });
  });

  it('navigates nested finance routes back to /finance', async () => {
    mockState.pathname = '/finance/account/a1';
    renderHook(() => useAndroidBackButton());

    await waitFor(() => {
      expect(mockState.backHandler).toBeDefined();
    });

    mockState.backHandler?.({ canGoBack: true });

    expect(mockState.navigate).toHaveBeenCalledWith('/finance');
  });

  it('navigates top-level tabs back to dashboard', async () => {
    mockState.pathname = '/commitments';
    renderHook(() => useAndroidBackButton());

    await waitFor(() => {
      expect(mockState.backHandler).toBeDefined();
    });

    mockState.backHandler?.({ canGoBack: true });

    expect(mockState.navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('goes back in history when possible', async () => {
    mockState.pathname = '/settings/security';
    renderHook(() => useAndroidBackButton());

    await waitFor(() => {
      expect(mockState.backHandler).toBeDefined();
    });

    mockState.backHandler?.({ canGoBack: true });

    expect(mockState.navigate).toHaveBeenCalledWith(-1);
  });

  it('exits app on dashboard root with no history', async () => {
    mockState.pathname = '/dashboard';
    renderHook(() => useAndroidBackButton());

    await waitFor(() => {
      expect(mockState.backHandler).toBeDefined();
    });

    mockState.backHandler?.({ canGoBack: false });

    expect(mockState.exitApp).toHaveBeenCalledTimes(1);
  });
});
