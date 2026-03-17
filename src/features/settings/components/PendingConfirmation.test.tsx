// @ts-nocheck
import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PendingConfirmation } from './PendingConfirmation';

const mockShowToast = vi.fn();
const mockConfirmDialog = vi.fn();
const mockSubscribeToOwnerPendingInvitations = vi.fn();
const mockUnsubscribe = vi.fn();
const mockCompleteConnectionConfirmation = vi.fn();
const mockReauthenticateUser = vi.fn();
const mockGetMfaResolver = vi.fn();
const mockVerifyMfaAndComplete = vi.fn();
const mockRejectInvitation = vi.fn();
const mockCancelInvitation = vi.fn();

let pendingListener: ((invitations: Array<Record<string, unknown>>) => void) | undefined;

vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({
    showToast: mockShowToast,
    confirm: mockConfirmDialog,
  }),
}));

vi.mock('../../../api/FamilyInvitationApi', () => ({
  subscribeToOwnerPendingInvitations: (...args: unknown[]) => {
    const callback = args[1] as (invitations: Array<Record<string, unknown>>) => void;
    pendingListener = callback;
    mockSubscribeToOwnerPendingInvitations(...args);
    return mockUnsubscribe;
  },
}));

vi.mock('./pendingConfirmationHandlers', () => ({
  completeConnectionConfirmation: (...args: unknown[]) => mockCompleteConnectionConfirmation(...args),
  reauthenticateUser: (...args: unknown[]) => mockReauthenticateUser(...args),
  getMfaResolver: (...args: unknown[]) => mockGetMfaResolver(...args),
  verifyMfaAndComplete: (...args: unknown[]) => mockVerifyMfaAndComplete(...args),
  rejectInvitation: (...args: unknown[]) => mockRejectInvitation(...args),
  cancelInvitation: (...args: unknown[]) => mockCancelInvitation(...args),
}));

vi.mock('./MfaConfirmationCard', () => ({
  MfaConfirmationCard: ({ error, setMfaCode, onMfaSubmit, onBack }: {
    error: string;
    setMfaCode: (value: string) => void;
    onMfaSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
  }) => (
    <div data-testid="mfa-card">
      <div data-testid="mfa-error">{error}</div>
      <button onClick={() => setMfaCode('12')}>set-short-mfa</button>
      <button onClick={() => setMfaCode('123456')}>set-valid-mfa</button>
      <button onClick={(e) => onMfaSubmit(e as unknown as React.FormEvent)}>submit-mfa</button>
      <button onClick={onBack}>back-mfa</button>
    </div>
  ),
}));

describe('PendingConfirmation', () => {
  const onConnectionConfirmed = vi.fn();

  const emitInvitations = (invitations: Array<Record<string, unknown>>) => {
    if (!pendingListener) throw new Error('pending invitation listener not set');
    act(() => pendingListener?.(invitations));
  };

  const renderSubject = () => {
    return render(
      <PendingConfirmation userId="owner-1" onConnectionConfirmed={onConnectionConfirmed} />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    pendingListener = undefined;
    mockConfirmDialog.mockResolvedValue(true);
    mockReauthenticateUser.mockResolvedValue(undefined);
    mockCompleteConnectionConfirmation.mockResolvedValue({
      success: true,
      memberName: 'Partner',
      redirect: '/finance',
      message: 'Connection confirmed!',
    });
    mockVerifyMfaAndComplete.mockResolvedValue(undefined);
  });

  it('renders null while loading and when there are no pending invites', () => {
    const { container } = renderSubject();
    expect(container.firstChild).toBeNull();

    emitInvitations([]);
    expect(container.firstChild).toBeNull();
    expect(mockSubscribeToOwnerPendingInvitations).toHaveBeenCalledWith('owner-1', expect.any(Function));
  });

  it('confirms awaiting invitation via password and calls redirect callback', async () => {
    renderSubject();
    emitInvitations([
      {
        id: 'inv-1',
        inviteeEmail: 'invitee@test.com',
        status: 'awaiting_confirmation',
        createdAt: '2025-01-15T00:00:00Z',
      },
    ]);

    fireEvent.click(screen.getByRole('button', { name: /confirm connection/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'secret-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    await waitFor(() => {
      expect(mockReauthenticateUser).toHaveBeenCalledWith('secret-pass');
      expect(mockCompleteConnectionConfirmation).toHaveBeenCalledWith('inv-1', 'secret-pass');
      expect(mockShowToast).toHaveBeenCalledWith('Connected with Partner!', 'success');
      expect(onConnectionConfirmed).toHaveBeenCalledWith('/finance', 'Connection confirmed!');
    });
  });

  it('shows credential error for wrong password', async () => {
    mockReauthenticateUser.mockRejectedValueOnce({ code: 'auth/wrong-password' });

    renderSubject();
    emitInvitations([
      {
        id: 'inv-2',
        inviteeEmail: 'invitee@test.com',
        status: 'awaiting_confirmation',
        createdAt: '2025-01-15T00:00:00Z',
      },
    ]);

    fireEvent.click(screen.getByRole('button', { name: /confirm connection/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'bad-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    expect(await screen.findByText('Incorrect password')).toBeInTheDocument();
    expect(mockCompleteConnectionConfirmation).not.toHaveBeenCalled();
  });

  it('enters MFA flow and reports invalid MFA code errors', async () => {
    mockReauthenticateUser.mockRejectedValueOnce({ code: 'auth/multi-factor-auth-required' });
    mockGetMfaResolver.mockReturnValue({ id: 'resolver-1' });
    mockVerifyMfaAndComplete.mockRejectedValueOnce({ code: 'auth/invalid-verification-code' });

    renderSubject();
    emitInvitations([
      {
        id: 'inv-3',
        inviteeEmail: 'invitee@test.com',
        status: 'awaiting_confirmation',
        createdAt: '2025-01-15T00:00:00Z',
      },
    ]);

    fireEvent.click(screen.getByRole('button', { name: /confirm connection/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'good-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    await waitFor(() => expect(screen.getByTestId('mfa-card')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'set-short-mfa' }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-mfa' }));
    expect(mockVerifyMfaAndComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'set-valid-mfa' }));
    fireEvent.click(screen.getByRole('button', { name: 'submit-mfa' }));

    await waitFor(() => {
      expect(mockVerifyMfaAndComplete).toHaveBeenCalledWith({ id: 'resolver-1' }, '123456');
      expect(screen.getByTestId('mfa-error')).toHaveTextContent('Invalid code. Please try again.');
    });
  });

  it('returns from MFA view back to awaiting confirmation card', async () => {
    mockReauthenticateUser.mockRejectedValueOnce({ code: 'auth/multi-factor-auth-required' });
    mockGetMfaResolver.mockReturnValue({ id: 'resolver-2' });

    renderSubject();
    emitInvitations([
      {
        id: 'inv-4',
        inviteeEmail: 'invitee@test.com',
        status: 'awaiting_confirmation',
        createdAt: '2025-01-15T00:00:00Z',
      },
    ]);

    fireEvent.click(screen.getByRole('button', { name: /confirm connection/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'good-pass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^confirm$/i }));

    await waitFor(() => expect(screen.getByTestId('mfa-card')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'back-mfa' }));

    await waitFor(() => {
      expect(screen.queryByTestId('mfa-card')).not.toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^confirm$/i })).toBeInTheDocument();
    });
  });

  it('handles reject and cancel confirmation branches', async () => {
    renderSubject();

    emitInvitations([
      {
        id: 'inv-5',
        inviteeEmail: 'invitee@test.com',
        status: 'awaiting_confirmation',
        createdAt: '2025-01-15T00:00:00Z',
      },
    ]);

    mockConfirmDialog.mockResolvedValueOnce(false);
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    await waitFor(() => expect(mockConfirmDialog).toHaveBeenCalled());
    expect(mockRejectInvitation).not.toHaveBeenCalled();

    mockConfirmDialog.mockResolvedValueOnce(true);
    mockRejectInvitation.mockRejectedValueOnce(new Error('reject failed'));
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    await waitFor(() => {
      expect(mockRejectInvitation).toHaveBeenCalledWith('inv-5');
      expect(mockShowToast).toHaveBeenCalledWith('Failed to reject invitation', 'error');
    });

    emitInvitations([
      {
        id: 'inv-6',
        inviteeEmail: 'invitee@test.com',
        status: 'pending',
        createdAt: '2025-01-15T00:00:00Z',
      },
    ]);

    mockConfirmDialog.mockResolvedValueOnce(true);
    mockCancelInvitation.mockResolvedValueOnce(undefined);
    fireEvent.click(screen.getByRole('button', { name: /cancel invitation/i }));

    await waitFor(() => {
      expect(mockCancelInvitation).toHaveBeenCalledWith('inv-6');
      expect(mockShowToast).toHaveBeenCalledWith('Invitation cancelled', 'success');
    });
  });

  it('unsubscribes from invitation stream on unmount', () => {
    const { unmount } = renderSubject();
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
