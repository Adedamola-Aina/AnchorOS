import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const { mockUser, mockEvents, mockLogout, mockShowToast, mockConfirm, mockGetAuthEvents, mockReportUnrecognised } = vi.hoisted(() => ({
  mockUser: { uid: 'u1' } as { uid: string } | null,
  mockEvents: [] as Array<{ id: string; timestamp: string; deviceInfo: { os: string; browser: string }; method: string; ipHash: string; reported: boolean }>,
  mockLogout: vi.fn(),
  mockShowToast: vi.fn(),
  mockConfirm: vi.fn().mockResolvedValue(true),
  mockGetAuthEvents: vi.fn().mockResolvedValue([]),
  mockReportUnrecognised: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout }),
}));
vi.mock('../../../context/NotificationContext', () => ({
  useNotifications: () => ({ showToast: mockShowToast, confirm: mockConfirm }),
}));
vi.mock('../../../services/authEventService', () => ({
  getAuthEvents: (...args: unknown[]) => mockGetAuthEvents(...args),
  reportUnrecognisedSignIn: (...args: unknown[]) => mockReportUnrecognised(...args),
}));
vi.mock('../../../utils/error', () => ({ captureError: vi.fn() }));

import { SessionManagement } from './SessionManagement';

const makeEvent = (id: string, os: string, browser: string, method = 'password') => ({
  id,
  timestamp: new Date().toISOString(),
  deviceInfo: { os, browser },
  method,
  ipHash: 'abc123',
  reported: false,
});

describe('SessionManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEvents.length = 0;
  });

  it('renders empty state when no sessions', async () => {
    mockGetAuthEvents.mockResolvedValue([]);
    render(<SessionManagement />);
    await waitFor(() => expect(screen.getByText(/no active sessions/i)).toBeInTheDocument());
  });

  it('renders session list with device info', async () => {
    mockGetAuthEvents.mockResolvedValue([
      makeEvent('e1', 'macOS', 'Chrome'),
      makeEvent('e2', 'iOS', 'Safari'),
    ]);
    render(<SessionManagement />);
    await waitFor(() => expect(screen.getByText(/macOS/)).toBeInTheDocument());
    expect(screen.getByText(/iOS/)).toBeInTheDocument();
  });

  it('marks first session as current device', async () => {
    mockGetAuthEvents.mockResolvedValue([makeEvent('e1', 'macOS', 'Chrome')]);
    render(<SessionManagement />);
    await waitFor(() => expect(screen.getByText(/this device/i)).toBeInTheDocument());
  });

  it('shows sign out all button when multiple sessions', async () => {
    mockGetAuthEvents.mockResolvedValue([
      makeEvent('e1', 'macOS', 'Chrome'),
      makeEvent('e2', 'Android', 'Chrome'),
    ]);
    render(<SessionManagement />);
    await waitFor(() => expect(screen.getByRole('button', { name: /sign out other devices/i })).toBeInTheDocument());
  });

  it('calls reportUnrecognisedSignIn and logout on sign-out-all', async () => {
    const events = [makeEvent('e1', 'macOS', 'Chrome'), makeEvent('e2', 'Android', 'Chrome')];
    mockGetAuthEvents.mockResolvedValue(events);
    render(<SessionManagement />);
    await waitFor(() => screen.getByRole('button', { name: /sign out other devices/i }));
    fireEvent.click(screen.getByRole('button', { name: /sign out other devices/i }));
    await waitFor(() => expect(mockConfirm).toHaveBeenCalled());
    await waitFor(() => expect(mockReportUnrecognised).toHaveBeenCalledWith('e2'));
    await waitFor(() => expect(mockLogout).toHaveBeenCalled());
  });

  it('renders Active Sessions header', async () => {
    mockGetAuthEvents.mockResolvedValue([]);
    render(<SessionManagement />);
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
  });
});
