import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';
import App from './App';

vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuth: () => ({
    user: null,
    profile: { theme: 'light' },
    loading: true,
    profileLoaded: false,
  }),
}));

vi.mock('./context/AnchorContext', () => ({
  AppProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('./context/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock('./components/shared/EnvironmentBanner', () => ({
  EnvironmentBanner: () => null,
}));

vi.mock('./components/shared/OfflineIndicator', () => ({
  OfflineIndicator: () => null,
}));

vi.mock('./hooks/useVersionCheck', () => ({
  useVersionCheck: vi.fn(),
}));

describe('App marketing route', () => {
  it('renders the public website without waiting for auth state', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /a private operating system for the life you're building/i,
      })
    ).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
