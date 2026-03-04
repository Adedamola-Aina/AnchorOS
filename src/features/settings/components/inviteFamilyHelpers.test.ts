import { describe, expect, it } from 'vitest';
import { mapInvitationError, mapMfaError, validateInviteeEmail } from './inviteFamilyHelpers';

describe('inviteFamilyHelpers', () => {
  it('validates invitee email and blocks self-invite', () => {
    expect(validateInviteeEmail('invalid-email', 'user@example.com')).toBe('Please enter a valid email address');
    expect(validateInviteeEmail('user@example.com', 'user@example.com')).toBe('You cannot invite yourself');
    expect(validateInviteeEmail('spouse@example.com', 'user@example.com')).toBeNull();
  });

  it('maps invitation errors to user-facing message', () => {
    expect(mapInvitationError({ code: 'auth/wrong-password', message: '' })).toBe('Incorrect password');
    expect(mapInvitationError({ message: 'already have pending invite' })).toBe('already have pending invite');
    expect(mapInvitationError({ message: 'Maximum invitations reached' })).toContain('daily limit');
    expect(mapInvitationError({ message: 'unknown' })).toBe('Failed to create invitation. Please try again.');
  });

  it('maps MFA errors correctly', () => {
    expect(mapMfaError({ code: 'auth/invalid-verification-code', message: '' })).toContain('Invalid code');
    expect(mapMfaError({ message: 'resolver expired' })).toBe('resolver expired');
    expect(mapMfaError({ message: '' })).toBe('MFA verification failed. Please try again.');
  });
});
