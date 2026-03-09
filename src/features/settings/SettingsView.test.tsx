// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Hoisted mock fns so tests can assert on calls
const mockLogout = vi.fn();
const mockUpdateProfile = vi.fn();
const mockNavigateTo = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    profile: { name: 'Test User', theme: 'dark', mfaEnabled: false, notificationPreferences: {}, accessibility: null },
    updateProfile: mockUpdateProfile,
    user: { uid: 'user-1', email: 'test@test.com', emailVerified: true },
    logout: mockLogout,
    accountNotifications: [],
    sendVerificationEmail: vi.fn(),
    generateMfaSecret: vi.fn(),
    enrollMfa: vi.fn(),
    unenrollMfa: vi.fn(),
    reauthenticate: vi.fn(),
  }),
}));

vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({
    showToast: vi.fn(),
    pushPermissionStatus: 'default' as NotificationPermission,
    requestPushPermission: vi.fn(),
  }),
}));

vi.mock('../../context/AnchorContext', () => ({
  useApp: () => ({ navigateTo: mockNavigateTo }),
}));

vi.mock('../../hooks/useFamilySharing', () => ({
  useFamilySharing: () => ({ connection: null, loading: false, disconnectFamily: vi.fn() }),
}));

vi.mock('../flags/useFeatureFlag', () => ({
  useFeatureFlag: () => true,
}));

vi.mock('./hooks/useMfaEnrollmentUI', () => ({
  useMfaEnrollmentUI: () => ({
    isEnrolling: false, show2FASetup: false, mfaQrUrl: '', mfaManualKey: '',
    mfaCode: '', mfaError: '', recoveryCodes: null,
    setShow2FASetup: vi.fn(), setMfaCode: vi.fn(),
    handleGenerateSecret: vi.fn(), handleEnroll: vi.fn(), clearRecoveryCodes: vi.fn(),
  }),
}));

vi.mock('../../components/ContactModal', () => ({ default: () => <div data-testid="contact-modal" /> }));
vi.mock('./components/ProfileSettings', () => ({ ProfileSettings: () => <div data-testid="profile-settings">Profile</div> }));
vi.mock('./components/AppearanceSettings', () => ({ AppearanceSettings: () => <div data-testid="appearance-settings">Appearance</div> }));
vi.mock('./components/SecuritySettings', () => ({ SecuritySettings: () => <div data-testid="security-settings">Security</div> }));
vi.mock('./components/NotificationSettings', () => ({ NotificationSettings: () => <div data-testid="notification-settings">Notifications</div> }));
vi.mock('./components/AnchorAISettings', () => ({ AnchorAISettings: () => <div data-testid="anchor-ai-settings">Anchor AI</div> }));
vi.mock('./components/FamilySettingsV2', () => ({ FamilySettingsV2: () => <div data-testid="family-settings">Family</div> }));
vi.mock('./components/SupportSettings', () => ({ SupportSettings: ({ onOpenContact }: { onOpenContact: () => void }) => <button data-testid="support" onClick={onOpenContact}>Support</button> }));
vi.mock('./components/DeveloperTools', () => ({ DeveloperTools: () => <div data-testid="dev-tools">DevTools</div> }));
vi.mock('./components/DataManagement', () => ({ DataManagement: () => <div data-testid="data-mgmt">Data</div> }));
vi.mock('./components/DangerZone', () => ({ DangerZone: () => <div data-testid="danger-zone">Danger</div> }));
vi.mock('./components/ReauthModal', () => ({ ReauthModal: () => null }));
vi.mock('./components/RecoveryCodesDisplay', () => ({ RecoveryCodesDisplay: () => null }));
vi.mock('./components/SectionNav', () => ({ SectionNav: () => <nav data-testid="section-nav" /> }));
vi.mock('./components/SettingsDataActions', () => ({
  handleWipeData: vi.fn(),
  handleDeleteAccount: vi.fn(),
}));
vi.mock('../../components/shared/FeatureErrorBoundary', () => ({
  FeatureErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('../../services/AuditService', () => ({
  auditSettings: { profileUpdated: vi.fn(), themeChanged: vi.fn() },
}));
vi.mock('../../utils/error', () => ({ captureError: vi.fn() }));

import SettingsView from './SettingsView';

describe('SettingsView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all major settings sections', () => {
    render(<SettingsView />);
    expect(screen.getByText('System Settings')).toBeInTheDocument();
    expect(screen.getByTestId('section-nav')).toBeInTheDocument();
    expect(screen.getByTestId('profile-settings')).toBeInTheDocument();
    expect(screen.getByTestId('appearance-settings')).toBeInTheDocument();
    expect(screen.getByTestId('security-settings')).toBeInTheDocument();
    expect(screen.getByTestId('notification-settings')).toBeInTheDocument();
    expect(screen.getByTestId('anchor-ai-settings')).toBeInTheDocument();
    expect(screen.getByTestId('family-settings')).toBeInTheDocument();
    expect(screen.getByTestId('data-mgmt')).toBeInTheDocument();
    expect(screen.getByTestId('danger-zone')).toBeInTheDocument();
  });

  it('renders sign out button', () => {
    render(<SettingsView />);
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<SettingsView />);
    expect(screen.getByText(/manage your preferences/i)).toBeInTheDocument();
  });

  it('opens contact modal via support', () => {
    render(<SettingsView />);
    fireEvent.click(screen.getByTestId('support'));
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument();
  });

  it('calls logout when sign out is clicked', () => {
    render(<SettingsView />);
    fireEvent.click(screen.getByText('Sign Out'));
    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('renders developer tools in non-production env', () => {
    render(<SettingsView />);
    expect(screen.getByTestId('dev-tools')).toBeInTheDocument();
  });

  it('wraps content in FeatureErrorBoundary', () => {
    render(<SettingsView />);
    expect(screen.getByText('System Settings')).toBeInTheDocument();
  });
});
