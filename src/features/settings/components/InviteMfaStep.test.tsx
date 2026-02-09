import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InviteMfaStep } from './InviteMfaStep';

describe('InviteMfaStep', () => {
  const defaultProps = {
    mfaCode: '',
    setMfaCode: vi.fn(),
    error: '',
    loading: false,
    onSubmit: vi.fn(),
    onBack: vi.fn(),
  };

  beforeEach(() => vi.clearAllMocks());

  it('renders MFA code input', () => {
    render(<InviteMfaStep {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('strips non-digits from input', () => {
    render(<InviteMfaStep {...defaultProps} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '12ab34' } });
    // setMfaCode called with digits-only
    expect(defaultProps.setMfaCode).toHaveBeenCalledWith('1234');
  });

  it('calls onBack when back button clicked', () => {
    render(<InviteMfaStep {...defaultProps} />);
    const backBtn = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backBtn);
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  it('disables submit when code < 6 digits', () => {
    render(<InviteMfaStep {...defaultProps} mfaCode="123" />);
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons.find(b => b.textContent?.includes('Verify'));
    expect(submitBtn).toBeDisabled();
  });

  it('enables submit when code is 6 digits', () => {
    render(<InviteMfaStep {...defaultProps} mfaCode="123456" />);
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons.find(b => b.textContent?.includes('Verify'));
    expect(submitBtn).not.toBeDisabled();
  });

  it('shows error when provided', () => {
    render(<InviteMfaStep {...defaultProps} error="Invalid code" />);
    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('auto-submits when code reaches 6 digits', () => {
    vi.useFakeTimers();
    const { rerender } = render(<InviteMfaStep {...defaultProps} mfaCode="12345" />);
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();

    rerender(<InviteMfaStep {...defaultProps} mfaCode="123456" />);
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('does not auto-submit when loading', () => {
    render(<InviteMfaStep {...defaultProps} mfaCode="123456" loading={true} />);
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
});
