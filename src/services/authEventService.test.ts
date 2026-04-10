/**
 * authEventService tests — SEC-009
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const callableMock = vi.fn();
const queryCollectionMock = vi.fn();

vi.mock('firebase/functions', () => ({
  httpsCallable: vi.fn(() => callableMock),
}));

vi.mock('../config/firebase', () => ({
  functions: { app: 'test' },
}));

vi.mock('../utils/secureDb', () => ({
  secureDb: {
    queryCollection: (...args: unknown[]) => queryCollectionMock(...args),
  },
}));

import {
  parseUserAgent,
  recordAuthEvent,
  getAuthEvents,
  reportUnrecognisedSignIn,
  dismissAuthEvent,
  revokeSession,
} from './authEventService';

describe('parseUserAgent', () => {
  it('detects iOS + Safari', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const result = parseUserAgent(ua);
    expect(result.os).toBe('iOS');
    expect(result.browser).toBe('Safari');
  });

  it('detects Android + Chrome', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    const result = parseUserAgent(ua);
    expect(result.os).toBe('Android');
    expect(result.browser).toBe('Chrome');
  });

  it('detects Windows + Edge', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 Edg/120.0';
    const result = parseUserAgent(ua);
    expect(result.os).toBe('Windows');
    expect(result.browser).toBe('Edge');
  });

  it('detects macOS + Chrome', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const result = parseUserAgent(ua);
    expect(result.os).toBe('macOS');
    expect(result.browser).toBe('Chrome');
  });

  it('detects Firefox on Linux', () => {
    const ua = 'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0';
    const result = parseUserAgent(ua);
    expect(result.os).toBe('Linux');
    expect(result.browser).toBe('Firefox');
  });

  it('handles iOS-specific browsers', () => {
    const iosChrome = parseUserAgent('Mozilla/5.0 (iPhone) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1');
    const iosFirefox = parseUserAgent('Mozilla/5.0 (iPhone) FxiOS/125.0 Mobile/15E148 Safari/605.1.15');
    expect(iosChrome.browser).toBe('Chrome (iOS)');
    expect(iosFirefox.browser).toBe('Firefox (iOS)');
  });

  it('truncates raw UA to 200 chars', () => {
    const ua = 'a'.repeat(300);
    const result = parseUserAgent(ua);
    expect(result.raw.length).toBeLessThanOrEqual(200);
  });

  it('falls back gracefully for unrecognised UA', () => {
    const ua = 'Unknown/1.0';
    const result = parseUserAgent(ua);
    expect(result.os).toBe('Unknown OS');
    expect(result.browser).toBe('Unknown Browser');
  });
});

describe('auth event callables', () => {
  beforeEach(() => {
    callableMock.mockReset();
    queryCollectionMock.mockReset();
  });

  it('records an auth event and swallows callable failures', async () => {
    callableMock.mockResolvedValueOnce({});
    await expect(recordAuthEvent('ua-string', 'google')).resolves.toBeUndefined();
    expect(callableMock).toHaveBeenCalledWith({ userAgent: 'ua-string', method: 'google' });

    callableMock.mockRejectedValueOnce(new Error('boom'));
    await expect(recordAuthEvent('ua-string-2', 'password')).resolves.toBeUndefined();
  });

  it('maps, normalizes and sorts auth events', async () => {
    queryCollectionMock.mockResolvedValueOnce([
      {
        id: 'evt-1',
        timestamp: { toDate: () => new Date('2026-04-10T10:00:00.000Z') },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36',
        ipHash: 'abc',
        method: 'google',
        reported: false,
        newDevice: true,
      },
      {
        id: 'evt-2',
        timestamp: { seconds: 1775810000 },
        userAgent: 'Unknown/1.0',
      },
      {
        id: 'evt-3',
        timestamp: '2026-04-11T00:00:00.000Z',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Version/17.0 Mobile Safari/604.1',
      },
    ]);

    const events = await getAuthEvents('user-123');

    expect(queryCollectionMock).toHaveBeenCalledWith('user-123', 'authEvents', []);
    expect(events).toHaveLength(3);
    expect(events[0].id).toBe('evt-3');
    expect(events[1].id).toBe('evt-1');
    expect(events[2].id).toBe('evt-2');
    expect(events[1].method).toBe('google');
    expect(events[2].method).toBe('password');
    expect(events[2].ipHash).toBe('unknown');
  });

  it('limits events to latest 10', async () => {
    const list = Array.from({ length: 12 }, (_, i) => ({
      id: `evt-${i}`,
      timestamp: `2026-04-${String(i + 1).padStart(2, '0')}T00:00:00.000Z`,
      userAgent: 'Unknown/1.0',
    }));
    queryCollectionMock.mockResolvedValueOnce(list);
    const events = await getAuthEvents('user-cap');
    expect(events).toHaveLength(10);
  });

  it('invokes report/dismiss/revoke callables with event id payload', async () => {
    callableMock.mockResolvedValue({});

    await reportUnrecognisedSignIn('evt-1');
    expect(callableMock).toHaveBeenCalledWith({ eventId: 'evt-1' });

    await dismissAuthEvent('evt-2');
    expect(callableMock).toHaveBeenCalledWith({ eventId: 'evt-2' });

    await revokeSession('evt-3');
    expect(callableMock).toHaveBeenCalledWith({ eventId: 'evt-3' });
  });
});
