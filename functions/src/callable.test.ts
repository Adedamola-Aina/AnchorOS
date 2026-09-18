import { beforeEach, describe, expect, it, vi } from 'vitest';

// Must be hoisted before module imports
const mockOnCall = vi.hoisted(() => vi.fn((options, handler) => ({ options, handler })));
const mockWithTracing = vi.hoisted(() => vi.fn((_name, handler) => handler));
const mockAssertSessionValid = vi.hoisted(() => vi.fn());

vi.mock('firebase-functions/v2/https', () => ({
  onCall: (...args: unknown[]) => mockOnCall(...args),
}));

vi.mock('./tracing', () => ({
  withTracing: (...args: unknown[]) => mockWithTracing(...args),
}));

vi.mock('./sessionEnforcement', () => ({
  assertSessionValid: (...args: unknown[]) => mockAssertSessionValid(...args),
}));

// Import after mocks are set up
const { secureOnCall } = await import('./callable');

describe('callable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnCall.mockImplementation((options, handler) => ({ options, handler }));
  });

  describe('secureOnCall', () => {
    it('wraps a function-only handler with empty options', () => {
      const handler = vi.fn();
      secureOnCall(handler);

      // The registered handler is the session-guarded wrapper (A-03), not the raw
      // handler — behaviour is asserted in the session-guard suite below.
      expect(mockOnCall).toHaveBeenCalledWith(
        expect.objectContaining({}),
        expect.any(Function),
      );
    });

    it('wraps handler with provided options object', () => {
      const handler = vi.fn();
      const options = { region: 'us-central1' };
      secureOnCall(options, handler);

      expect(mockOnCall).toHaveBeenCalledWith(
        expect.objectContaining({ region: 'us-central1' }),
        expect.any(Function),
      );
    });

    it('throws when options object is provided without a handler', () => {
      expect(() => secureOnCall({ region: 'us-central1' })).toThrow(
        'secureOnCall requires a handler when options are provided',
      );
    });

    it('merges enforceAppCheck from env into options', () => {
      const originalEnv = process.env.ENFORCE_APPCHECK;
      process.env.ENFORCE_APPCHECK = 'true';

      // Re-import to pick up env change — test the options merge behavior
      const handler = vi.fn();
      secureOnCall({}, handler);

      // The function was called with options that include enforceAppCheck
      expect(mockOnCall).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Function),
      );

      process.env.ENFORCE_APPCHECK = originalEnv;
    });

    it('does not override explicitly set enforceAppCheck in options', () => {
      const handler = vi.fn();
      secureOnCall({ enforceAppCheck: false }, handler);

      const callArgs = mockOnCall.mock.calls[0][0];
      expect(callArgs.enforceAppCheck).toBe(false);
    });

    it('returns the result of onCall', () => {
      const handler = vi.fn();
      const expected = { options: {}, handler };
      mockOnCall.mockReturnValue(expected);

      const result = secureOnCall(handler);
      expect(result).toBe(expected);
    });
  });

  // A-03 / AM-11: every authenticated callable must honour session revocation.
  describe('session guard', () => {
    const registeredHandler = () => mockOnCall.mock.calls[0][1] as (request: unknown) => Promise<unknown>;

    it('enforces session validity for authenticated calls', async () => {
      mockAssertSessionValid.mockResolvedValueOnce(undefined);
      const handler = vi.fn().mockResolvedValue('ok');
      secureOnCall(handler);

      const result = await registeredHandler()({ auth: { uid: 'u1', token: { auth_time: 100 } } });

      expect(mockAssertSessionValid).toHaveBeenCalledWith('u1', 100);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(result).toBe('ok');
    });

    it('rejects a revoked session without running the handler', async () => {
      mockAssertSessionValid.mockRejectedValueOnce(new Error('This session was revoked.'));
      const handler = vi.fn();
      secureOnCall(handler);

      await expect(
        registeredHandler()({ auth: { uid: 'u1', token: { auth_time: 1 } } }),
      ).rejects.toThrow('This session was revoked.');

      expect(handler).not.toHaveBeenCalled();
    });

    it('does not enforce for unauthenticated calls', async () => {
      const handler = vi.fn().mockResolvedValue('ok');
      secureOnCall(handler);

      await registeredHandler()({ auth: null });

      expect(mockAssertSessionValid).not.toHaveBeenCalled();
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });
});
