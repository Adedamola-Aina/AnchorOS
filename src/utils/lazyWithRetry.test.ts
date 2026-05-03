// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';

const RELOAD_KEY = 'chunk_reload_ts';
const COOLDOWN_MS = 15_000;

// Test the retry logic directly — the sessionStorage + reload guard
function makeRetryHandler() {
  return (error: Error): Promise<never> | never => {
    const lastReload = parseInt(sessionStorage.getItem(RELOAD_KEY) ?? '0', 10);
    const cooldownExpired = Date.now() - lastReload > COOLDOWN_MS;
    if (cooldownExpired) {
      sessionStorage.setItem(RELOAD_KEY, Date.now().toString());
      window.location.reload();
      return new Promise(() => {/* reloading — never resolves */});
    }
    throw error;
  };
}

describe('lazyWithRetry — reload guard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
      configurable: true,
    });
  });

  it('reloads and returns a pending promise on first chunk failure', async () => {
    const handler = makeRetryHandler();
    const error = new Error('Failed to fetch dynamically imported module');
    const result = handler(error);

    expect(window.location.reload).toHaveBeenCalledOnce();
    expect(sessionStorage.getItem(RELOAD_KEY)).not.toBeNull();
    // Should be a pending promise — not thrown
    await expect(
      Promise.race([result, Promise.resolve('pending')])
    ).resolves.toBe('pending');
  });

  it('does not reload and throws when within cooldown window', () => {
    sessionStorage.setItem(RELOAD_KEY, Date.now().toString());
    const handler = makeRetryHandler();
    const error = new Error('chunk error');

    expect(() => handler(error)).toThrow(error);
    expect(window.location.reload).not.toHaveBeenCalled();
  });

  it('reloads again after cooldown expires (second deploy scenario)', async () => {
    sessionStorage.setItem(RELOAD_KEY, (Date.now() - 20_000).toString());
    const handler = makeRetryHandler();
    const error = new Error('chunk error');
    const result = handler(error);

    expect(window.location.reload).toHaveBeenCalledOnce();
    await expect(
      Promise.race([result, Promise.resolve('pending')])
    ).resolves.toBe('pending');
  });
});
