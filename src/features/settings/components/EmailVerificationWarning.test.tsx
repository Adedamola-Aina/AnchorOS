
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// RA-11 (#167): the warning now offers a resend action, so the auth and
// notification contexts must be stubbed for this unit test.
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'owner@test.com', emailVerified: false, reload: vi.fn() },
    sendVerificationEmail: vi.fn(),
  }),
}));
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: vi.fn() }),
}));

import { EmailVerificationWarning } from './EmailVerificationWarning';

describe('EmailVerificationWarning', () => {
  it('renders warning message', () => {
    render(<EmailVerificationWarning />);
    expect(screen.getByText('Email Verification Required')).toBeInTheDocument();
  });

  it('mentions verification link in inbox', () => {
    render(<EmailVerificationWarning />);
    expect(screen.getByText(/verify your email address/)).toBeInTheDocument();
    expect(screen.getByText(/verification link/)).toBeInTheDocument();
  });
});
