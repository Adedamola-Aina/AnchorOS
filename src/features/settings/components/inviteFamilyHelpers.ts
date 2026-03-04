export function validateInviteeEmail(inviteeEmail: string, userEmail: string): string | null {
  if (!inviteeEmail.includes('@')) {
    return 'Please enter a valid email address';
  }

  if (inviteeEmail.toLowerCase() === userEmail.toLowerCase()) {
    return 'You cannot invite yourself';
  }

  return null;
}

export function mapInvitationError(error: Error & { code?: string }): string {
  if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
    return 'Incorrect password';
  }

  if (error.message?.includes('already have')) {
    return error.message;
  }

  if (error.message?.includes('Maximum')) {
    return 'You have reached the daily limit of 10 invitations. Please try again tomorrow.';
  }

  return 'Failed to create invitation. Please try again.';
}

export function mapMfaError(error: Error & { code?: string }): string {
  if (error.code === 'auth/invalid-verification-code') {
    return 'Invalid code. Please check your authenticator app.';
  }

  return error.message || 'MFA verification failed. Please try again.';
}
