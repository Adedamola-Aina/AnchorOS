import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useVersionCheck } from './useVersionCheck';

describe('useVersionCheck', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      text: async () => '<script src="/assets/index-abc123.js"></script>',
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('does not fetch when hostname is localhost', async () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'localhost' },
      writable: true,
      configurable: true,
    });

    renderHook(() => useVersionCheck(true));
    await vi.advanceTimersByTimeAsync(10000);

    expect(fetch).not.toHaveBeenCalled();
  });

  it('does not set up timers when enabled is false', async () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'anchor-os.web.app' },
      writable: true,
      configurable: true,
    });

    renderHook(() => useVersionCheck(false));
    await vi.advanceTimersByTimeAsync(10000);

    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches the page with cache-busting headers on non-localhost after initial delay', async () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'anchor-os.web.app' },
      writable: true,
      configurable: true,
    });

    renderHook(() => useVersionCheck(true));
    // Advance past the 5-second initial delay
    await vi.advanceTimersByTimeAsync(6000);

    expect(fetch).toHaveBeenCalledWith(
      '/',
      expect.objectContaining({
        method: 'GET',
        cache: 'no-store',
        headers: expect.objectContaining({ 'Cache-Control': 'no-cache, no-store, must-revalidate' }),
      }),
    );
  });

  it('does not reload when hash is first seen (initial run)', async () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { hostname: 'anchor-os.web.app', reload: reloadMock },
      writable: true,
      configurable: true,
    });

    renderHook(() => useVersionCheck(true));
    await vi.advanceTimersByTimeAsync(6000);

    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('reloads when hash changes between checks', async () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { hostname: 'anchor-os.web.app', reload: reloadMock },
      writable: true,
      configurable: true,
    });

    let callCount = 0;
    vi.spyOn(window, 'fetch').mockImplementation(async () => {
      callCount++;
      const hash = callCount === 1 ? 'abc123' : 'def456';
      return {
        ok: true,
        text: async () => `<script src="/assets/index-${hash}.js"></script>`,
      } as Response;
    });

    renderHook(() => useVersionCheck(true));

    // First check — sets initial hash (5s initial timeout)
    await vi.advanceTimersByTimeAsync(6000);
    // Second check — detects change (60s interval)
    await vi.advanceTimersByTimeAsync(61000);
    // Reload fires after RELOAD_DELAY_MS (2000ms)
    await vi.advanceTimersByTimeAsync(3000);

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });

  it('silently handles fetch errors without throwing', async () => {
    Object.defineProperty(window, 'location', {
      value: { hostname: 'anchor-os.web.app' },
      writable: true,
      configurable: true,
    });
    vi.spyOn(window, 'fetch').mockRejectedValue(new Error('network error'));

    expect(() => {
      renderHook(() => useVersionCheck(true));
    }).not.toThrow();
  });
});
