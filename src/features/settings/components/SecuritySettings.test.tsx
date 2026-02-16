// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock child components
vi.mock('./SecuritySettingsParts', () => ({
  MfaStep1GetApp: ({ onNext }: any) => <button onClick={onNext}>Step1-Next</button>,
  MfaStep2ScanQR: ({ onBack, onNext }: any) => <div><button onClick={onBack}>Step2-Back</button><button onClick={onNext}>Step2-Next</button></div>,
  MfaStep3Verify: ({ onEnroll, onBack }: any) => <div><button onClick={onBack}>Step3-Back</button><button onClick={onEnroll}>Verify</button></div>,
}));
vi.mock('./PasswordChange', () => ({
  PasswordChange: () => <div data-testid="password-change">PasswordChange</div>,
}));
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: vi.fn(), confirm: vi.fn().mockResolvedValue(true) }),
}));
vi.mock('../../../utils/error', () => ({
  captureError: vi.fn(),
}));

import { SecuritySettings } from './SecuritySettings';

const baseProps = {
  mfaEnabled: false,
  isEnrolling: false,
  show2FASetup: false,
  mfaQrUrl: '',
  mfaManualKey: '',
  mfaCode: '',
  mfaError: '',
  onSetShow2FASetup: vi.fn(),
  onSetMfaCode: vi.fn(),
  onGenerateMfaSecret: vi.fn().mockResolvedValue(undefined),
  onEnrollMfa: vi.fn().mockResolvedValue(undefined),
  onUnenrollMfa: vi.fn().mockResolvedValue(undefined),
};

describe('SecuritySettings', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders 2FA section with Setup button when not enabled', () => {
    render(<SecuritySettings {...baseProps} />);
    expect(screen.getByText(/two-factor authentication/i)).toBeInTheDocument();
    expect(screen.getByText(/setup 2fa/i)).toBeInTheDocument();
  });

  it('renders Disable button when mfaEnabled', () => {
    render(<SecuritySettings {...baseProps} mfaEnabled={true} />);
    expect(screen.getByText(/disable/i)).toBeInTheDocument();
  });

  it('shows 2FA setup wizard when show2FASetup is true', () => {
    render(<SecuritySettings {...baseProps} show2FASetup={true} />);
    expect(screen.getByText('Step1-Next')).toBeInTheDocument();
  });

  it('navigates through wizard steps', () => {
    render(<SecuritySettings {...baseProps} show2FASetup={true} />);
    fireEvent.click(screen.getByText('Step1-Next'));
    expect(screen.getByText('Step2-Next')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Step2-Next'));
    expect(screen.getByText('Verify')).toBeInTheDocument();
  });

  it('calls onGenerateMfaSecret when Setup 2FA clicked', () => {
    render(<SecuritySettings {...baseProps} />);
    fireEvent.click(screen.getByText(/setup 2fa/i));
    expect(baseProps.onGenerateMfaSecret).toHaveBeenCalled();
  });
});
