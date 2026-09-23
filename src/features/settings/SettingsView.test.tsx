
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Hoisted mock fns so tests can assert on calls
const mockLogout = vi.fn();
const mockUpdateProfile = vi.fn();
const mockNavigateTo = vi.fn();
let flagEnabled = true;


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
  useFeatureFlag: () => flagEnabled,
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
import { MemoryRouter, Route, Routes } from 'react-router-dom';

/**
 * Settings is a hub (`/settings`) plus one route per section
 * (`/settings/<id>`), so every render needs a router.
 */
const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/settings" element={<SettingsView />} />
        <Route path="/settings/:section" element={<SettingsView />} />
      </Routes>
    </MemoryRouter>
  );

describe('SettingsView — hub (UX-ST-01/02/06)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    flagEnabled = true;
  });

  it('renders the grouped hub with a row per section and no chip bar', () => {
    renderAt('/settings');

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('settings-hub')).toBeInTheDocument();

    // Every section is reachable as its own destination.
    for (const id of ['profile', 'security', 'notifications', 'preferences', 'assistant', 'family', 'data', 'about']) {
      expect(screen.getByTestId(`settings-row-${id}`)).toBeInTheDocument();
    }

    // The defect: ten sections rendered in one continuous scroll.
    expect(screen.queryByTestId('profile-settings')).not.toBeInTheDocument();
    expect(screen.queryByTestId('data-mgmt')).not.toBeInTheDocument();
    // …and the overflowing chip bar is gone.
    expect(screen.queryByTestId('section-nav')).not.toBeInTheDocument();
  });

  it('renders sign out button', () => {
    renderAt('/settings');
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderAt('/settings');
    expect(screen.getByText(/manage your account/i)).toBeInTheDocument();
  });

  it('calls logout when sign out is clicked', () => {
    renderAt('/settings');
    fireEvent.click(screen.getByText('Sign Out'));
    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('wraps content in FeatureErrorBoundary', () => {
    renderAt('/settings');
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('searches by synonym, not just by label', () => {
    renderAt('/settings');

    fireEvent.change(screen.getByTestId('settings-search'), { target: { value: '2fa' } });

    expect(screen.getByTestId('settings-row-security')).toBeInTheDocument();
    expect(screen.queryByTestId('settings-row-profile')).not.toBeInTheDocument();
  });

  it('says so when nothing matches', () => {
    renderAt('/settings');

    fireEvent.change(screen.getByTestId('settings-search'), { target: { value: 'zzzz' } });

    expect(screen.getByTestId('settings-search-empty')).toBeInTheDocument();
  });

  it('hides the assistant section when the Anchor AI flag is off', () => {
    flagEnabled = false;
    renderAt('/settings');

    expect(screen.queryByTestId('settings-row-assistant')).not.toBeInTheDocument();
    expect(screen.getByTestId('settings-row-profile')).toBeInTheDocument();
  });
});

describe('SettingsView — sections (UX-ST-02/05)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    flagEnabled = true;
  });

  it('renders ONE section for a deep link, with a back affordance', () => {
    renderAt('/settings/preferences');

    expect(screen.getByTestId('settings-section-preferences')).toBeInTheDocument();
    expect(screen.getByTestId('appearance-settings')).toBeInTheDocument();
    expect(screen.getByTestId('settings-back')).toHaveAttribute('href', '/settings');
    // The hub is not rendered behind it.
    expect(screen.queryByTestId('settings-hub')).not.toBeInTheDocument();
    expect(screen.queryByTestId('security-settings')).not.toBeInTheDocument();
  });

  it('renders the security section with its own content', () => {
    renderAt('/settings/security');
    expect(screen.getByTestId('security-settings')).toBeInTheDocument();
  });

  it('redirects an unknown section to the hub instead of rendering half a page', () => {
    renderAt('/settings/not-a-section');

    expect(screen.getByTestId('settings-hub')).toBeInTheDocument();
  });

  it('redirects a feature-gated section to the hub', () => {
    flagEnabled = false;
    renderAt('/settings/assistant');

    expect(screen.getByTestId('settings-hub')).toBeInTheDocument();
  });

  it('owns the assistant configuration and links to transparency (UX-ST-05)', () => {
    renderAt('/settings/assistant');

    expect(screen.getByTestId('anchor-ai-settings')).toBeInTheDocument();
    expect(screen.getByTestId('assistant-transparency-link')).toHaveAttribute('href', '/fabric/transparency');
  });

  it('opens contact modal via support', () => {
    renderAt('/settings/about');
    fireEvent.click(screen.getByTestId('support'));
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument();
  });

  it('renders developer tools in local development only', () => {
    vi.stubEnv('VITE_APP_ENV', 'development');
    renderAt('/settings/about');
    expect(screen.getByTestId('dev-tools')).toBeInTheDocument();
  });

  it('never renders developer tools in staging or production', () => {
    for (const env of ['staging', 'production']) {
      vi.stubEnv('VITE_APP_ENV', env);
      const { unmount } = renderAt('/settings/about');
      expect(screen.queryByTestId('dev-tools')).not.toBeInTheDocument();
      unmount();
    }
  });
});
