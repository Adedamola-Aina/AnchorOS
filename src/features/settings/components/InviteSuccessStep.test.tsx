// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InviteSuccessStep } from './InviteSuccessStep';

describe('InviteSuccessStep', () => {
  const defaultProps = {
    inviteeEmail: 'spouse@test.com',
    verificationCode: 'ABC123',
    copied: false,
    onCopyCode: vi.fn(),
    onDone: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('shows invitation sent message', () => {
    render(<InviteSuccessStep {...defaultProps} />);
    expect(screen.getByText('Invitation Sent!')).toBeInTheDocument();
  });

  it('shows invitee email', () => {
    render(<InviteSuccessStep {...defaultProps} />);
    expect(screen.getByText('spouse@test.com')).toBeInTheDocument();
  });

  it('displays verification code', () => {
    render(<InviteSuccessStep {...defaultProps} />);
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('calls onCopyCode when copy button clicked', () => {
    render(<InviteSuccessStep {...defaultProps} />);
    // The copy button is a plain button element
    const buttons = screen.getAllByRole('button');
    const copyBtn = buttons.find(b => b.querySelector('svg'));
    fireEvent.click(copyBtn!);
    expect(defaultProps.onCopyCode).toHaveBeenCalled();
  });

  it('calls onDone when Done clicked', () => {
    render(<InviteSuccessStep {...defaultProps} />);
    fireEvent.click(screen.getByText('Done'));
    expect(defaultProps.onDone).toHaveBeenCalled();
  });
});
