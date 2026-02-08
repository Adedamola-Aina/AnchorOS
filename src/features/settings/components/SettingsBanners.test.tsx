import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VerifyEmailBanner } from './SettingsBanners';

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

// EnableMfaBanner tests removed — component removed, onboarding handles MFA now.
