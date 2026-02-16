// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { FamilySettingsV2 } from './FamilySettingsV2';

const mockShowToast = vi.fn();
const mockConfirm = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast, confirm: mockConfirm }),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'user-1', email: 'user@test.com', emailVerified: true },
  }),
}));

vi.mock('../../../utils/error', () => ({ captureError: vi.fn() }));

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
}));

const mockDisconnect = vi.fn();
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(() => ({})),
  httpsCallable: vi.fn(() => mockDisconnect),
}));

// Mock child components
vi.mock('./InviteFamilyMember', () => ({
  InviteFamilyMember: () => <div data-testid="invite-form">Invite Form</div>,
}));
vi.mock('./PendingConfirmation', () => ({
  PendingConfirmation: () => <div data-testid="pending-confirmation">Pending</div>,
}));
vi.mock('./FamilySettingsStates', () => ({
  FamilyLoadingState: () => <div data-testid="loading-state">Loading...</div>,
  FamilyPostConnectionMessage: ({ message, onGoToFinance }: { message: string; onGoToFinance: () => void }) => (
    <div data-testid="post-connection">
      <p>{message}</p>
      <button onClick={onGoToFinance}>Go to Finance</button>
    </div>
  ),
  FamilyConnectedState: ({ connection, onDisconnect }: { connection: { memberDisplayName: string }; onDisconnect: () => void }) => (
    <div data-testid="connected-state">
      <p>Connected with {connection.memberDisplayName}</p>
      <button onClick={onDisconnect}>Disconnect</button>
    </div>
  ),
  FamilyInviteCard: ({ onShowInviteForm }: { onShowInviteForm: () => void }) => (
    <div data-testid="invite-card">
      <button onClick={onShowInviteForm}>Invite Family Member</button>
    </div>
  ),
}));

describe('FamilySettingsV2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockResolvedValue(true);
  });

  it('shows loading state when connectionLoading', () => {
    render(<FamilySettingsV2 connectionLoading={true} />);
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('shows connected state when connection provided', () => {
    const connection = {
      id: 'conn-1',
      ownerUid: 'user-1',
      memberUid: 'user-2',
      memberDisplayName: 'Partner',
      ownerDisplayName: 'Me',
      connectedAt: '2025-01-15',
      status: 'active' as const,
    };
    render(<FamilySettingsV2 connection={connection} />);
    // Emit no pending invites
    act(() => snapshotCallback({ empty: true, docs: [] }));
    expect(screen.getByTestId('connected-state')).toBeInTheDocument();
    expect(screen.getByText('Connected with Partner')).toBeInTheDocument();
  });

  it('shows invite card when no connection and no pending invite', () => {
    render(<FamilySettingsV2 />);
    act(() => snapshotCallback({ empty: true, docs: [] }));
    expect(screen.getByTestId('invite-card')).toBeInTheDocument();
  });

  it('navigates to invite form on button click', () => {
    render(<FamilySettingsV2 />);
    act(() => snapshotCallback({ empty: true, docs: [] }));
    fireEvent.click(screen.getByText('Invite Family Member'));
    expect(screen.getByTestId('invite-form')).toBeInTheDocument();
  });

  it('shows pending confirmation when pending invite exists', () => {
    render(<FamilySettingsV2 />);
    act(() => snapshotCallback({ empty: false, docs: [{ id: 'inv-1', data: () => ({}) }] }));
    expect(screen.getByTestId('pending-confirmation')).toBeInTheDocument();
  });

  it('handles disconnect flow', async () => {
    const connection = {
      id: 'conn-1',
      ownerUid: 'user-1',
      memberUid: 'user-2',
      memberDisplayName: 'Partner',
      ownerDisplayName: 'Me',
      connectedAt: '2025-01-15',
      status: 'active' as const,
    };
    mockDisconnect.mockResolvedValue({ data: { success: true } });

    render(<FamilySettingsV2 connection={connection} />);
    act(() => snapshotCallback({ empty: true, docs: [] }));

    fireEvent.click(screen.getByText('Disconnect'));
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith(expect.objectContaining({
        type: 'danger',
      }));
    });
  });

  it('unsubscribes on unmount', () => {
    const { unmount } = render(<FamilySettingsV2 />);
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
