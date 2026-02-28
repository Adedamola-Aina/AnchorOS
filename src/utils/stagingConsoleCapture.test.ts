import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initStagingConsoleCapture } from './stagingConsoleCapture';

declare global {
  interface Window {
    __ANCHOR_CONSOLE_CAPTURE__?: {
      getLogs: () => Array<{ ts: string; level: string; message: string }>;
      clear: () => void;
      exportText: () => string;
    };
  }
}

describe('initStagingConsoleCapture', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete window.__ANCHOR_CONSOLE_CAPTURE__;
    vi.restoreAllMocks();
  });

  it('does not initialize outside staging', () => {
    initStagingConsoleCapture('production');
    expect(window.__ANCHOR_CONSOLE_CAPTURE__).toBeUndefined();
  });

  it('captures console errors in staging', () => {
    initStagingConsoleCapture('staging');

    console.error('mfaEnrollment:start failed', 400);

    const logs = window.__ANCHOR_CONSOLE_CAPTURE__?.getLogs() ?? [];
    expect(logs.length).toBeGreaterThan(0);
    const hasEntry = logs.some((entry) => entry.level === 'error' && entry.message.includes('mfaEnrollment:start failed 400'));
    expect(hasEntry).toBe(true);
  });

  it('clears stored logs', () => {
    initStagingConsoleCapture('staging');

    console.warn('network changed');
    window.__ANCHOR_CONSOLE_CAPTURE__?.clear();

    expect(window.__ANCHOR_CONSOLE_CAPTURE__?.getLogs()).toEqual([]);
    expect(window.localStorage.getItem('anchor_staging_console_logs_v1')).toBeNull();
  });
});
