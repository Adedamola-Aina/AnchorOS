// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PendingInviteCard } from './PendingInviteCard';

describe('PendingInviteCard', () => {
  const defaultProps = {
    inviteeEmail: 'partner@example.com',
    createdAt: '2025-01-15T10:30:00Z',
    onCancelInvite: vi.fn(),
  };

  it('shows invitee email', () => {
    render(<PendingInviteCard {...defaultProps} />);
    expect(screen.getByText('partner@example.com')).toBeInTheDocument();
  });

  it('formats and shows created date', () => {
    render(<PendingInviteCard {...defaultProps} />);
    const dateStr = new Date('2025-01-15T10:30:00Z').toLocaleDateString();
    expect(screen.getByText(new RegExp(dateStr))).toBeInTheDocument();
  });

  it('calls onCancelInvite when cancel button clicked', () => {
    render(<PendingInviteCard {...defaultProps} />);
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);
    expect(defaultProps.onCancelInvite).toHaveBeenCalled();
  });
});
