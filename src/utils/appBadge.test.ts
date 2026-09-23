import { beforeEach, describe, expect, it, vi } from 'vitest';

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

  it('sets the badge for a positive count', async () => {
    await setAppBadgeCount(3);

    expect(setAppBadge).toHaveBeenCalledWith(3);
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

  it('is a no-op when the Badging API is unavailable', async () => {
    Object.defineProperty(navigator, 'setAppBadge', {
      configurable: true,
      writable: true,
      value: undefined,
    });

    await expect(setAppBadgeCount(5)).resolves.toBeUndefined();
    expect(captureError).not.toHaveBeenCalled();
  });

  it('captures errors when the badge API throws', async () => {
    setAppBadge.mockRejectedValueOnce(new Error('badge fail'));

    await setAppBadgeCount(5);

    expect(captureError).toHaveBeenCalledWith(expect.any(Error), 'Badge.webUpdate');
  });

  it('supports clear helper', async () => {
    await clearAppBadge();

    expect(clearAppBadgeMock).toHaveBeenCalledTimes(1);
  });
});