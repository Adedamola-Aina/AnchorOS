/**
 * GettingStartedSecurity tests — TDD
 */
// @ts-nocheck


import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GettingStartedSecurity } from './GettingStartedSecurity';

vi.mock('lucide-react', () => ({
  Shield: () => <span data-testid="shield-icon" />,
  Mail: () => <span data-testid="mail-icon" />,
  CheckCircle2: (props: Record<string, unknown>) => <span data-testid={props['data-testid'] || 'check-icon'} />,
}));

describe('GettingStartedSecurity', () => {
  const defaultProps = {
    emailVerified: false,
    mfaEnabled: false,
    onVerifyEmail: vi.fn().mockResolvedValue(undefined),
    onEnableMfa: vi.fn(),
    onFinish: vi.fn(),
    onSkip: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders security heading', () => {
    render(<GettingStartedSecurity {...defaultProps} />);
    expect(screen.getByText('Secure Your Account')).toBeInTheDocument();
  });

  it('shows both verification items', () => {
    render(<GettingStartedSecurity {...defaultProps} />);
    expect(screen.getByText('Verify Email')).toBeInTheDocument();
    expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
  });

  it('shows Send Link button when email not verified', () => {
    render(<GettingStartedSecurity {...defaultProps} />);
    expect(screen.getByText('Send Link')).toBeInTheDocument();
  });

  it('calls onVerifyEmail and shows Sent state', async () => {
    const onVerifyEmail = vi.fn().mockResolvedValue(undefined);
    render(<GettingStartedSecurity {...defaultProps} onVerifyEmail={onVerifyEmail} />);
    fireEvent.click(screen.getByText('Send Link'));
    await waitFor(() => {
      expect(onVerifyEmail).toHaveBeenCalled();
      expect(screen.getByText('Sent ✓')).toBeInTheDocument();
    });
  });

  it('shows check icon when email already verified', () => {
    render(<GettingStartedSecurity {...defaultProps} emailVerified={true} />);
    expect(screen.getByTestId('email-verified-icon')).toBeInTheDocument();
    expect(screen.queryByText('Send Link')).not.toBeInTheDocument();
  });

  it('shows Enable button for MFA when not enabled', () => {
    render(<GettingStartedSecurity {...defaultProps} />);
    expect(screen.getByText('Enable')).toBeInTheDocument();
  });

  it('calls onEnableMfa when Enable clicked', () => {
    const onEnableMfa = vi.fn();
    render(<GettingStartedSecurity {...defaultProps} onEnableMfa={onEnableMfa} />);
    fireEvent.click(screen.getByText('Enable'));
    expect(onEnableMfa).toHaveBeenCalled();
  });

  it('shows check icon when MFA already enabled', () => {
    render(<GettingStartedSecurity {...defaultProps} mfaEnabled={true} />);
    expect(screen.getByTestId('mfa-enabled-icon')).toBeInTheDocument();
    expect(screen.queryByText('Enable')).not.toBeInTheDocument();
  });

  it('shows "All Set" when both are complete', () => {
    render(<GettingStartedSecurity {...defaultProps} emailVerified={true} mfaEnabled={true} />);
    expect(screen.getByText('All Set — Enter Anchor OS')).toBeInTheDocument();
  });

  it('shows "Continue" when not all complete', () => {
    render(<GettingStartedSecurity {...defaultProps} />);
    expect(screen.getByText('Continue to Anchor OS')).toBeInTheDocument();
  });

  it('calls onFinish when continue clicked', () => {
    const onFinish = vi.fn();
    render(<GettingStartedSecurity {...defaultProps} onFinish={onFinish} />);
    fireEvent.click(screen.getByText('Continue to Anchor OS'));
    expect(onFinish).toHaveBeenCalled();
  });

  it('calls onBack when back clicked', () => {
    const onBack = vi.fn();
    render(<GettingStartedSecurity {...defaultProps} onBack={onBack} />);
    fireEvent.click(screen.getByText('← Back'));
    expect(onBack).toHaveBeenCalled();
  });

  it('calls onSkip when skip clicked', () => {
    const onSkip = vi.fn();
    render(<GettingStartedSecurity {...defaultProps} onSkip={onSkip} />);
    fireEvent.click(screen.getByText("I'll do this later →"));
    expect(onSkip).toHaveBeenCalled();
  });
});
