import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InviteCodeEntry } from './InviteCodeEntry';

describe('InviteCodeEntry', () => {
  const defaults = {
    verificationCode: '',
    setVerificationCode: vi.fn(),
    attemptsRemaining: 3,
    error: '',
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders code entry form', () => {
    render(<InviteCodeEntry {...defaults} />);
    expect(screen.getByText('Enter Verification Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
    expect(screen.getByText('3 attempts remaining')).toBeInTheDocument();
  });

  it('filters non-numeric input', () => {
    render(<InviteCodeEntry {...defaults} />);
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: 'abc123' } });
    expect(defaults.setVerificationCode).toHaveBeenCalledWith('123');
  });

  it('shows error', () => {
    render(<InviteCodeEntry {...defaults} error="Invalid code" />);
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('disables verify with < 6 digits', () => {
    render(<InviteCodeEntry {...defaults} verificationCode="123" />);
    expect(screen.getByText('Verify').closest('button')).toBeDisabled();
  });

  it('auto-submits on 6 digits', () => {
    render(<InviteCodeEntry {...defaults} verificationCode="123456" />);
    expect(defaults.onSubmit).toHaveBeenCalled();
  });

  it('shows singular attempt text', () => {
    render(<InviteCodeEntry {...defaults} attemptsRemaining={1} />);
    expect(screen.getByText('1 attempt remaining')).toBeInTheDocument();
  });
});
