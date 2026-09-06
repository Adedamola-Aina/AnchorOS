// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { InviteFamilyMember } from './InviteFamilyMember';

const mockShowToast = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));

const mockReauthenticate = vi.fn();
vi.mock('firebase/auth', () => ({
  EmailAuthProvider: { credential: vi.fn((email: string, pw: string) => ({ email, password: pw })) },
  reauthenticateWithCredential: (...args: unknown[]) => mockReauthenticate(...args),
  getMultiFactorResolver: vi.fn(),
  TotpMultiFactorGenerator: {
    assertionForSignIn: vi.fn(() => 'totp-assertion'),
    FACTOR_ID: 'totp',
  },
}));

const mockHttpsCallable = vi.fn();
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: (...args: unknown[]) => mockHttpsCallable(...args),
}));

vi.mock('../../../config/firebase', () => ({
  auth: { currentUser: { uid: 'user-1', email: 'owner@test.com' } },
}));

describe('InviteFamilyMember', () => {
  const defaultProps = {
    userEmail: 'owner@test.com',
    isEmailVerified: true,
    onInviteSent: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockReauthenticate.mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText: vi.fn(() => Promise.resolve()) } });
  });

  it('shows email verification warning when not verified', () => {
    render(<InviteFamilyMember {...defaultProps} isEmailVerified={false} />);
    expect(screen.getByText(/verify/i)).toBeInTheDocument();
  });

  it('renders email step initially', () => {
    render(<InviteFamilyMember {...defaultProps} />);
    expect(screen.getByPlaceholderText('spouse@example.com')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<InviteFamilyMember {...defaultProps} />);
    const input = screen.getByPlaceholderText('spouse@example.com');
    fireEvent.change(input, { target: { value: 'notanemail' } });
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('prevents self-invitation', async () => {
    render(<InviteFamilyMember {...defaultProps} />);
    const input = screen.getByPlaceholderText('spouse@example.com');
    fireEvent.change(input, { target: { value: 'owner@test.com' } });
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => {
      expect(screen.getByText(/yourself/i)).toBeInTheDocument();
    });
  });

  it('transitions to password step on valid email', async () => {
    render(<InviteFamilyMember {...defaultProps} />);
    const input = screen.getByPlaceholderText('spouse@example.com');
    fireEvent.change(input, { target: { value: 'partner@test.com' } });
    fireEvent.submit(input.closest('form')!);
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });
  });

  it('completes full invitation flow', async () => {
    const mockCallable = vi.fn().mockResolvedValue({
      data: { success: true, verificationCode: 'VER-123', inviteId: 'inv-1', emailQueued: true },
    });
    mockHttpsCallable.mockReturnValue(mockCallable);

    render(<InviteFamilyMember {...defaultProps} />);

    // Step 1: Email
    const emailInput = screen.getByPlaceholderText('spouse@example.com');
    fireEvent.change(emailInput, { target: { value: 'partner@test.com' } });
    fireEvent.submit(emailInput.closest('form')!);

    // Step 2: Password
    await waitFor(() => screen.getByPlaceholderText('Enter your password'));
    const pwInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(pwInput, { target: { value: 'mypassword' } });
    await act(async () => {
      fireEvent.submit(pwInput.closest('form')!);
    });

    // Step 3: Success (verification code shown)
    await waitFor(() => {
      expect(screen.getByText('VER-123')).toBeInTheDocument();
    });
    expect(mockShowToast).toHaveBeenCalledWith(expect.stringContaining('email queued'), 'success');
  });

  it('shows error on wrong password', async () => {
    mockReauthenticate.mockRejectedValue({ code: 'auth/wrong-password' });

    render(<InviteFamilyMember {...defaultProps} />);
    const emailInput = screen.getByPlaceholderText('spouse@example.com');
    fireEvent.change(emailInput, { target: { value: 'partner@test.com' } });
    fireEvent.submit(emailInput.closest('form')!);

    await waitFor(() => screen.getByPlaceholderText('Enter your password'));
    const pwInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(pwInput, { target: { value: 'wrong' } });
    await act(async () => {
      fireEvent.submit(pwInput.closest('form')!);
    });

    await waitFor(() => {
      expect(screen.getByText(/incorrect password/i)).toBeInTheDocument();
    });
  });
});
