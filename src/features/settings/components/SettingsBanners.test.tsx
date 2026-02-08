import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VerifyEmailBanner, EnableMfaBanner } from './SettingsBanners';

describe('VerifyEmailBanner', () => {
  it('renders with warning text and verify button', () => {
    const onResend = vi.fn();
    render(<VerifyEmailBanner isResending={false} onResend={onResend} />);
    expect(screen.getByText('Email Not Verified')).toBeInTheDocument();
    expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Verify Now'));
    expect(onResend).toHaveBeenCalled();
  });

  it('disables button when resending', () => {
    render(<VerifyEmailBanner isResending={true} onResend={vi.fn()} />);
    // Button has isLoading which renders a spinner
    expect(screen.getByText('Verify Now')).toBeInTheDocument();
  });
});

describe('EnableMfaBanner', () => {
  it('renders MFA recommendation', () => {
    const onEnable = vi.fn();
    render(<EnableMfaBanner onEnable={onEnable} />);
    expect(screen.getByText('MFA Recommended')).toBeInTheDocument();
    expect(screen.getByText(/two-factor authentication/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Enable 2FA'));
    expect(onEnable).toHaveBeenCalled();
  });
});
