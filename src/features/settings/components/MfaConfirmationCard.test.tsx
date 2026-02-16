// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MfaConfirmationCard } from './MfaConfirmationCard';

describe('MfaConfirmationCard', () => {
  const defaultProps = {
    inviteeEmail: 'partner@test.com',
    mfaCode: '',
    setMfaCode: vi.fn(),
    error: '',
    confirmingConnection: false,
    onMfaSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => { vi.clearAllMocks(); });

  it('renders MFA card with email', () => {
    render(<MfaConfirmationCard {...defaultProps} />);
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
    expect(screen.getByText(/partner@test.com/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
  });

  it('filters non-numeric input', () => {
    render(<MfaConfirmationCard {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: 'abc123' } });
    expect(defaultProps.setMfaCode).toHaveBeenCalledWith('123');
  });

  it('shows error message', () => {
    render(<MfaConfirmationCard {...defaultProps} error="Invalid code" />);
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('disables confirm when code is not 6 digits', () => {
    render(<MfaConfirmationCard {...defaultProps} mfaCode="123" />);
    expect(screen.getByText('Confirm').closest('button')).toBeDisabled();
  });

  it('calls onBack when Back clicked', () => {
    render(<MfaConfirmationCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Back'));
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('auto-submits on 6 digits', () => {
    render(<MfaConfirmationCard {...defaultProps} mfaCode="123456" />);
    expect(defaultProps.onMfaSubmit).toHaveBeenCalled();
  });
});
