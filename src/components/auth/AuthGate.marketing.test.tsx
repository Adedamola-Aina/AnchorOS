import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  EmailVerificationGate: () => <div>Email verification</div>,
  OnboardingGate: () => <div>Onboarding</div>,
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

describe('AuthGate marketing routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
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
  });

  it('redirects unauthenticated private route access to login', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/" element={<div>Marketing</div>} />
          <Route path="/login" element={<div>Login route</div>} />
          <Route path="/dashboard" element={<AuthGate><div>Private app</div></AuthGate>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Login route')).toBeInTheDocument());
    expect(screen.queryByText('Private app')).not.toBeInTheDocument();
  });

  it('renders auth UI on the login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<AuthGate><div>Private app</div></AuthGate>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('auth-view')).toBeInTheDocument();
  });
});
