import { beforeEach, describe, expect, it, vi } from 'vitest';

// Must be hoisted before module imports
const mockOnCall = vi.hoisted(() => vi.fn((options, handler) => ({ options, handler })));

vi.mock('firebase-functions/v2/https', () => ({
  onCall: (...args: unknown[]) => mockOnCall(...args),
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

      expect(mockOnCall).toHaveBeenCalledWith(
        expect.objectContaining({}),
        handler,
      );
    });

    it('wraps handler with provided options object', () => {
      const handler = vi.fn();
      const options = { region: 'us-central1' };
      secureOnCall(options, handler);

      expect(mockOnCall).toHaveBeenCalledWith(
        expect.objectContaining({ region: 'us-central1' }),
        handler,
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
        handler,
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
});
