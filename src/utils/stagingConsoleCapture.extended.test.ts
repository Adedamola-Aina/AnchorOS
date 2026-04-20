import { beforeEach, describe, expect, it } from 'vitest';
import { initStagingConsoleCapture } from './stagingConsoleCapture';

describe('stagingConsoleCapture — extended coverage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    // @ts-expect-error cleanup
    delete window.__ANCHOR_CONSOLE_CAPTURE__;
  });

  it('captures log, info, warn, and debug levels', () => {
    initStagingConsoleCapture('staging');
    console.log('log-message');
    console.info('info-message');
    console.warn('warn-message');
    console.debug('debug-message');

    const logs = window.__ANCHOR_CONSOLE_CAPTURE__?.getLogs() ?? [];
    const levels = logs.map((l) => l.level);
    expect(levels).toContain('log');
    expect(levels).toContain('info');
    expect(levels).toContain('warn');
    expect(levels).toContain('debug');
  });

  it('redacts sensitive content (emails, long IDs, bearer tokens)', () => {
    initStagingConsoleCapture('staging');
    console.error('user test@example.com amount 1234567 bearer abc.def-123');
    const logs = window.__ANCHOR_CONSOLE_CAPTURE__?.getLogs() ?? [];
    const msg = logs.find((l) => l.level === 'error')?.message ?? '';
    expect(msg).not.toContain('test@example.com');
    expect(msg).not.toContain('1234567');
    expect(msg.toLowerCase()).not.toContain('bearer abc');
    expect(msg).toContain('[redacted]');
  });

  it('exportText returns a JSON string of the buffer', () => {
    initStagingConsoleCapture('staging');
    console.log('hello');
    const text = window.__ANCHOR_CONSOLE_CAPTURE__?.exportText() ?? '';
    expect(text.startsWith('[')).toBe(true);
    const parsed = JSON.parse(text);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.some((e: { message: string }) => e.message.includes('hello'))).toBe(true);
  });

  it('is idempotent — second init does not double-wrap', () => {
    initStagingConsoleCapture('staging');
    const api1 = window.__ANCHOR_CONSOLE_CAPTURE__;
    initStagingConsoleCapture('staging');
    const api2 = window.__ANCHOR_CONSOLE_CAPTURE__;
    expect(api1).toBe(api2);
  });

  it('captures window error events', () => {
    initStagingConsoleCapture('staging');
    window.dispatchEvent(new ErrorEvent('error', { message: 'boom!' }));
    const logs = window.__ANCHOR_CONSOLE_CAPTURE__?.getLogs() ?? [];
    expect(logs.some((l) => l.message.includes('window.error') && l.message.includes('boom!'))).toBe(true);
  });

  it('serializes Error objects, numbers, booleans, null, and plain objects', () => {
    initStagingConsoleCapture('staging');
    console.log(new Error('Ouch'), 42, true, null, { a: 1 });
    const logs = window.__ANCHOR_CONSOLE_CAPTURE__?.getLogs() ?? [];
    const msg = logs.find((l) => l.level === 'log')?.message ?? '';
    expect(msg).toContain('Error: Ouch');
    expect(msg).toContain('42');
    expect(msg).toContain('true');
    expect(msg).toContain('null');
    expect(msg).toContain('"a":1');
  });
});
