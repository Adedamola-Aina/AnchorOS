import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  FamilyLoadingState,
  FamilyPostConnectionMessage,
  FamilyConnectedState,
  FamilyInviteCard,
} from './FamilySettingsStates';

describe('FamilySettingsStates', () => {
  describe('FamilyLoadingState', () => {
    it('renders a loading indicator', () => {
      const { container } = render(<FamilyLoadingState />);
      expect(container.querySelector('[class*="animate"]')).toBeInTheDocument();
    });
  });

  describe('FamilyPostConnectionMessage', () => {
    it('shows success message', () => {
      render(<FamilyPostConnectionMessage message="Connected to household!" onGoToFinance={vi.fn()} />);
      expect(screen.getByText('Connected to household!')).toBeInTheDocument();
    });

    it('calls onGoToFinance when button clicked', () => {
      const mockGoTo = vi.fn();
      render(<FamilyPostConnectionMessage message="ok" onGoToFinance={mockGoTo} />);
      fireEvent.click(screen.getByRole('button', { name: /finance/i }));
      expect(mockGoTo).toHaveBeenCalled();
    });
  });

  describe('FamilyConnectedState', () => {
    const connection = {
      id: 'conn-1',
      ownerUid: 'owner-1',
      memberUid: 'member-1',
      ownerDisplayName: 'Alice',
      memberDisplayName: 'Bob',
      status: 'active' as const,
      connectedAt: '2025-01-01T00:00:00Z',
      createdAt: '2025-01-01T00:00:00Z',
    };

    it('shows partner name for owner', () => {
      render(
        <FamilyConnectedState
          connection={connection}
          currentUserId="owner-1"
          disconnecting={false}
          onDisconnect={vi.fn()}
        />
      );
      expect(screen.getByText(/Bob/)).toBeInTheDocument();
    });

    it('shows "Remove Family Member" for owner', () => {
      render(
        <FamilyConnectedState
          connection={connection}
          currentUserId="owner-1"
          disconnecting={false}
          onDisconnect={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    it('shows "Leave Household" for member', () => {
      render(
        <FamilyConnectedState
          connection={connection}
          currentUserId="member-1"
          disconnecting={false}
          onDisconnect={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /leave/i })).toBeInTheDocument();
    });

    it('calls onDisconnect', () => {
      const mockDisconnect = vi.fn();
      render(
        <FamilyConnectedState
          connection={connection}
          currentUserId="owner-1"
          disconnecting={false}
          onDisconnect={mockDisconnect}
        />
      );
      fireEvent.click(screen.getByRole('button', { name: /remove/i }));
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('disables button while disconnecting', () => {
      render(
        <FamilyConnectedState
          connection={connection}
          currentUserId="owner-1"
          disconnecting={true}
          onDisconnect={vi.fn()}
        />
      );
      expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled();
    });
  });

  describe('FamilyInviteCard', () => {
    it('renders invite CTA', () => {
      render(<FamilyInviteCard onShowInviteForm={vi.fn()} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls onShowInviteForm', () => {
      const mockShow = vi.fn();
      render(<FamilyInviteCard onShowInviteForm={mockShow} />);
      fireEvent.click(screen.getByRole('button'));
      expect(mockShow).toHaveBeenCalled();
    });
  });
});
