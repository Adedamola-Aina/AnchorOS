import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InviteEmailStep } from './InviteEmailStep';

describe('InviteEmailStep', () => {
  const defaultProps = {
    inviteeEmail: '',
    setInviteeEmail: vi.fn(),
    error: '',
    onSubmit: vi.fn((e: any) => e.preventDefault()),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders email input', () => {
    render(<InviteEmailStep {...defaultProps} />);
    expect(screen.getByPlaceholderText('spouse@example.com')).toBeInTheDocument();
  });

  it('calls setInviteeEmail on input', () => {
    render(<InviteEmailStep {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('spouse@example.com'), { target: { value: 'test@test.com' } });
    expect(defaultProps.setInviteeEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('shows error when provided', () => {
    render(<InviteEmailStep {...defaultProps} error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('submits form on Continue click', () => {
    render(<InviteEmailStep {...defaultProps} />);
    fireEvent.click(screen.getByText('Continue'));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
});
