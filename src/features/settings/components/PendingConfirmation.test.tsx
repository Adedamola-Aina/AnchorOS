// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { PendingConfirmation } from './PendingConfirmation';

const mockShowToast = vi.fn();
const mockConfirm = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast, confirm: mockConfirm }),
}));

// Mock Firestore
const mockUnsubscribe = vi.fn();
let snapshotCallback: Function;
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  onSnapshot: vi.fn((_q: unknown, cb: Function) => {
    snapshotCallback = cb;
    return mockUnsubscribe;
  }),
}));

vi.mock('../../../config/firebase', () => ({
  db: {},
  APP_ID: 'test-app',
  auth: { currentUser: { email: 'user@test.com' } },
}));

// Mock handlers
const mockCompleteConnection = vi.fn();
const mockReauthenticate = vi.fn();
const mockReject = vi.fn();
const mockCancel = vi.fn();
vi.mock('./pendingConfirmationHandlers', () => ({
  completeConnectionConfirmation: (...args: unknown[]) => mockCompleteConnection(...args),
  reauthenticateUser: (...args: unknown[]) => mockReauthenticate(...args),
  getMfaResolver: vi.fn(),
  verifyMfaAndComplete: vi.fn(),
  rejectInvitation: (...args: unknown[]) => mockReject(...args),
  cancelInvitation: (...args: unknown[]) => mockCancel(...args),
}));

// Mock child components for simplicity — we test them individually
vi.mock('./MfaConfirmationCard', () => ({
  MfaConfirmationCard: () => <div data-testid="mfa-card" />,
}));

describe('PendingConfirmation', () => {
  const defaultProps = {
    userId: 'user-1',
    onConnectionConfirmed: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockResolvedValue(true);
    mockReauthenticate.mockResolvedValue(undefined);
    mockCompleteConnection.mockResolvedValue({ success: true, memberName: 'Partner' });
  });

  const emitSnapshot = (docs: any[]) => {
    snapshotCallback({
      empty: docs.length === 0,
      docs: docs.map(d => ({ id: d.id, data: () => d })),
    });
  };

  it('returns null when loading', () => {
    const { container } = render(<PendingConfirmation {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when no pending invite', () => {
    render(<PendingConfirmation {...defaultProps} />);
    act(() => emitSnapshot([]));
    expect(screen.queryByText(/partner/i)).not.toBeInTheDocument();
  });

  it('shows PendingInviteCard for pending status', () => {
    render(<PendingConfirmation {...defaultProps} />);
    act(() => emitSnapshot([{
      id: 'inv-1',
      inviteeEmail: 'partner@test.com',
      status: 'pending',
      createdAt: '2025-01-15T00:00:00Z',
    }]));
    expect(screen.getByText('partner@test.com')).toBeInTheDocument();
  });

  it('shows AwaitingConfirmationCard for awaiting_confirmation', () => {
    render(<PendingConfirmation {...defaultProps} />);
    act(() => emitSnapshot([{
      id: 'inv-2',
      inviteeEmail: 'member@test.com',
      status: 'awaiting_confirmation',
      createdAt: '2025-01-15T00:00:00Z',
    }]));
    expect(screen.getByText('member@test.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
  });

  it('handles cancel invitation', async () => {
    mockCancel.mockResolvedValue(undefined);
    render(<PendingConfirmation {...defaultProps} />);
    act(() => emitSnapshot([{
      id: 'inv-1',
      inviteeEmail: 'partner@test.com',
      status: 'pending',
      createdAt: '2025-01-15T00:00:00Z',
    }]));
    
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalled();
    });
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = render(<PendingConfirmation {...defaultProps} />);
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
