import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockState = vi.hoisted(() => ({
  isSupported: false,
  set: vi.fn(() => Promise.resolve()),
  clear: vi.fn(() => Promise.resolve()),
  isSupportedFn: vi.fn(() => Promise.resolve({ isSupported: false })),
}));

vi.mock('@capawesome/capacitor-badge', () => ({
  Badge: {
    isSupported: (...args: unknown[]) => mockState.isSupportedFn(...args),
    set: (...args: unknown[]) => mockState.set(...args),
    clear: (...args: unknown[]) => mockState.clear(...args),
  },
}));

const captureError = vi.fn();
vi.mock('./error', () => ({
  captureError: (...args: unknown[]) => captureError(...args),
}));

import { clearAppBadge, setAppBadgeCount } from './appBadge';

describe('appBadge', () => {
  const setAppBadge = vi.fn(() => Promise.resolve());
  const clearAppBadgeMock = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
    mockState.isSupported = false;
    mockState.set.mockResolvedValue(undefined);
    mockState.clear.mockResolvedValue(undefined);
    mockState.isSupportedFn.mockResolvedValue({ isSupported: false });

    Object.defineProperty(navigator, 'setAppBadge', {
      configurable: true,
      writable: true,
      value: setAppBadge,
    });

    Object.defineProperty(navigator, 'clearAppBadge', {
      configurable: true,
      writable: true,
      value: clearAppBadgeMock,
    });
  });

  it('uses native badge plugin on native platforms', async () => {
    mockState.isSupportedFn.mockResolvedValue({ isSupported: true });

    await setAppBadgeCount(3);

    expect(mockState.set).toHaveBeenCalledWith({ count: 3 });
    expect(setAppBadge).not.toHaveBeenCalled();
  });

  it('clears badge when count is zero', async () => {
    await setAppBadgeCount(0);

    expect(clearAppBadgeMock).toHaveBeenCalledTimes(1);
  });

  it('normalizes count to a non-negative integer', async () => {
    await setAppBadgeCount(-2.8);

    expect(clearAppBadgeMock).toHaveBeenCalledTimes(1);

    await setAppBadgeCount(4.9);

    expect(setAppBadge).toHaveBeenCalledWith(4);
  });

  it('falls back to web API when native plugin fails', async () => {
    mockState.isSupportedFn.mockRejectedValueOnce(new Error('native fail'));

    await setAppBadgeCount(5);

    expect(captureError).toHaveBeenCalledWith(expect.any(Error), 'Badge.nativeUpdate');
    expect(setAppBadge).toHaveBeenCalledWith(5);
  });

  it('supports clear helper', async () => {
    await clearAppBadge();

    expect(clearAppBadgeMock).toHaveBeenCalledTimes(1);
  });
});
