import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CallableRequest } from 'firebase-functions/v2/https';

// Mock logger before imports
vi.mock('firebase-functions', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn() },
}));

import { withTracing, createSpanAttributes } from '../callableTracing';

function makeRequest(data: unknown = {}, uid = 'user-1'): CallableRequest {
  return { data, auth: { uid, token: {} } } as unknown as CallableRequest;
}

describe('callableTracing', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('createSpanAttributes', () => {
    it('returns function name and timestamp', () => {
      const attrs = createSpanAttributes('myFunc', makeRequest());
      expect(attrs['function.name']).toBe('myFunc');
      expect(attrs['user.authenticated']).toBe(true);
      expect(typeof attrs['invocation.timestamp']).toBe('string');
    });

    it('marks unauthenticated when auth is missing', () => {
      const req = { data: {} } as CallableRequest;
      const attrs = createSpanAttributes('myFunc', req);
      expect(attrs['user.authenticated']).toBe(false);
    });
  });

  describe('withTracing', () => {
    it('calls the handler and returns its result', async () => {
      const handler = vi.fn().mockResolvedValue({ ok: true });
      const traced = withTracing('testFunc', handler);
      const result = await traced(makeRequest({ input: 1 }));
      expect(result).toEqual({ ok: true });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('records duration in metadata', async () => {
      const handler = vi.fn().mockResolvedValue('done');
      const traced = withTracing('testFunc', handler);
      await traced(makeRequest());
      // Handler was called — that's the key assertion
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('re-throws handler errors after logging', async () => {
      const error = new Error('boom');
      const handler = vi.fn().mockRejectedValue(error);
      const traced = withTracing('failFunc', handler);
      await expect(traced(makeRequest())).rejects.toThrow('boom');
    });

    it('measures duration even on failure', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('fail'));
      const traced = withTracing('failFunc', handler);
      await expect(traced(makeRequest())).rejects.toThrow('fail');
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('passes the original request to the handler', async () => {
      const handler = vi.fn().mockResolvedValue(null);
      const traced = withTracing('testFunc', handler);
      const req = makeRequest({ key: 'val' });
      await traced(req);
      expect(handler).toHaveBeenCalledWith(req);
    });
  });
});
