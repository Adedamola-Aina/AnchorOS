import { describe, expect, it } from 'vitest';
import { normalizeInviteeEmail } from './familyInvitationValidation';

describe('normalizeInviteeEmail', () => {
  it('trims and lowercases a valid address', () => {
    expect(normalizeInviteeEmail(' Partner@Example.com ')).toBe('partner@example.com');
  });

  it('rejects missing and malformed email addresses', () => {
    expect(normalizeInviteeEmail('')).toBeNull();
    expect(normalizeInviteeEmail('not-an-email')).toBeNull();
  });
});
