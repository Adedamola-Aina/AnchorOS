// @ts-nocheck
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import AuthGate from './AuthGate';

const mockUseAuth = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: vi.fn() }),
}));

vi.mock('../../features/auth/AuthView', () => ({
  default: () => <div data-testid="auth-view">Auth view</div>,
}));

vi.mock('./AuthGateParts', () => ({
  AuthLoadingScreen: () => <div>Loading auth</div>,
  EmailVerificationGate: () => <div data-testid="email-verification-gate">Verify your email</div>,
}));

vi.mock('../../api/MfaRecoveryApi', () => ({
  consumeMfaRecoveryCode: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
  getRedirectResult: vi.fn(() => Promise.resolve(null)),
  getMultiFactorResolver: vi.fn(),
}));

vi.mock('../../config/firebase', () => ({
  auth: {},
}));

function setUser(overrides = {}) {
  mockUseAuth.mockReturnValue({
    user: { uid: 'u1', email: 'person@example.com', emailVerified: false, ...overrides },
    loading: false,
    profile: { theme: 'light' },
    profileLoaded: false,
    updateProfile: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    verifyMfa: vi.fn(),
    logout: vi.fn(),
    sendVerificationEmail: vi.fn(),
    sendPasswordReset: vi.fn(),
  });
}

const renderGate = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthGate>
        <div data-testid="app-content">App</div>
      </AuthGate>
    </MemoryRouter>,
  );

describe('AuthGate email-verification parity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    setUser();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('enforces the email-verification gate in staging', () => {
    vi.stubEnv('VITE_APP_ENV', 'staging');
    renderGate();
    expect(screen.getByTestId('email-verification-gate')).toBeInTheDocument();
    expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
  });

  it('enforces the email-verification gate in production', () => {
    vi.stubEnv('VITE_APP_ENV', 'production');
    renderGate();
    expect(screen.getByTestId('email-verification-gate')).toBeInTheDocument();
    expect(screen.queryByTestId('app-content')).not.toBeInTheDocument();
  });

  it('bypasses the gate only in local emulator development', () => {
    vi.stubEnv('VITE_APP_ENV', 'development');
    renderGate();
    expect(screen.queryByTestId('email-verification-gate')).not.toBeInTheDocument();
    expect(screen.getByTestId('app-content')).toBeInTheDocument();
  });

  it('renders verified users in every environment', () => {
    for (const env of ['development', 'staging', 'production']) {
      vi.stubEnv('VITE_APP_ENV', env);
      setUser({ emailVerified: true });
      const { unmount } = renderGate();
      expect(screen.queryByTestId('email-verification-gate')).not.toBeInTheDocument();
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
      unmount();
    }
  });

  it('preserves the explicit @anchor-os.com repository fixture exception', () => {
    vi.stubEnv('VITE_APP_ENV', 'production');
    setUser({ email: 'ci-canary@anchor-os.com' });
    renderGate();
    expect(screen.queryByTestId('email-verification-gate')).not.toBeInTheDocument();
    expect(screen.getByTestId('app-content')).toBeInTheDocument();
  });
});
