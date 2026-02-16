import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const mockShowToast = vi.fn();
vi.mock('../../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast }),
}));

const mockGetDocs = vi.fn();
const mockWriteBatch = vi.fn(() => ({
  update: vi.fn(),
  set: vi.fn(),
  commit: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../../config/firebase', () => ({
  db: {},
  APP_ID: 'anchor-os',
  auth: { currentUser: { email: 'test@test.com' } },
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  doc: vi.fn(),
  writeBatch: mockWriteBatch,
}));

import { AutoAcceptInvitationAction } from './AutoAcceptAction';

describe('AutoAcceptInvitationAction', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders auto-accept button and description', () => {
    render(<AutoAcceptInvitationAction userUid="uid1" />);
    expect(screen.getByText('Auto-Accept')).toBeInTheDocument();
    expect(screen.getByText(/auto-accept invitation/i)).toBeInTheDocument();
    expect(screen.getByText(/bypass email verification/i)).toBeInTheDocument();
  });

  it('shows warning when no pending invitations found', async () => {
    mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] })
               .mockResolvedValueOnce({ empty: true, docs: [] });

    render(<AutoAcceptInvitationAction userUid="uid1" />);
    fireEvent.click(screen.getByText('Auto-Accept'));
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('No pending invitations found', 'warning');
    });
  });

  it('auto-accepts invitation where user is invitee', async () => {
    const inviteRef = { id: 'inv-1' };
    mockGetDocs.mockResolvedValueOnce({
      empty: false,
      docs: [{
        ref: inviteRef,
        data: () => ({
          ownerUid: 'owner-1',
          ownerEmail: 'owner@test.com',
          ownerDisplayName: 'Owner',
        }),
      }],
    });

    render(<AutoAcceptInvitationAction userUid="uid1" />);
    fireEvent.click(screen.getByText('Auto-Accept'));
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('accepted'),
        'success'
      );
    });
  });

  it('auto-accepts invitation sent by current user', async () => {
    // First query (invitee) returns empty, second query (owner) returns match
    mockGetDocs.mockResolvedValueOnce({ empty: true, docs: [] })
               .mockResolvedValueOnce({
      empty: false,
      docs: [{
        ref: { id: 'inv-2' },
        data: () => ({
          ownerUid: 'uid1',
          ownerEmail: 'test@test.com',
          ownerDisplayName: 'Test',
          inviteeEmail: 'invitee@test.com',
        }),
      }],
    });

    render(<AutoAcceptInvitationAction userUid="uid1" />);
    fireEvent.click(screen.getByText('Auto-Accept'));
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('auto-completed'),
        'success'
      );
    });
  });

  it('shows error toast on failure', async () => {
    mockGetDocs.mockRejectedValueOnce(new Error('Firestore error'));

    render(<AutoAcceptInvitationAction userUid="uid1" />);
    fireEvent.click(screen.getByText('Auto-Accept'));
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining('Firestore error'),
        'error'
      );
    });
  });
});
