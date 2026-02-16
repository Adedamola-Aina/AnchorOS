// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InvitePasswordStep } from './InvitePasswordStep';

describe('InvitePasswordStep', () => {
  const defaultProps = {
    inviteeEmail: 'spouse@test.com',
    password: '',
    setPassword: vi.fn(),
    error: '',
    loading: false,
    onSubmit: vi.fn((e: any) => e.preventDefault()),
    onBack: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('shows invitee email', () => {
    render(<InvitePasswordStep {...defaultProps} />);
    expect(screen.getByText('spouse@test.com')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(<InvitePasswordStep {...defaultProps} />);
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  it('calls setPassword on input', () => {
    render(<InvitePasswordStep {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'pass123' } });
    expect(defaultProps.setPassword).toHaveBeenCalledWith('pass123');
  });

  it('disables submit when loading', () => {
    render(<InvitePasswordStep {...defaultProps} loading={true} />);
    expect(screen.getByText('Sending...')).toBeInTheDocument();
  });

  it('disables submit when no password', () => {
    render(<InvitePasswordStep {...defaultProps} password="" />);
    const btn = screen.getByRole('button', { name: /send invitation/i });
    expect(btn).toBeDisabled();
  });

  it('calls onBack when Back clicked', () => {
    render(<InvitePasswordStep {...defaultProps} />);
    fireEvent.click(screen.getByText('Back'));
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('shows error', () => {
    render(<InvitePasswordStep {...defaultProps} error="Incorrect password" />);
    expect(screen.getByText('Incorrect password')).toBeInTheDocument();
  });
});
