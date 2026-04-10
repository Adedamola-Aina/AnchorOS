// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthEventHistory } from './AuthEventHistory';

vi.mock('@anchor-os/ui', () => ({
    Card: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardTitle: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
    Button: ({ children, onClick, title, isLoading, disabled, 'aria-label': ariaLabel }: any) => (
        <button onClick={onClick} title={title} aria-label={ariaLabel} disabled={disabled || isLoading}>
            {children}
        </button>
    ),
}));

const mockShowToast = vi.fn();
const mockConfirm = vi.fn();
const mockLogout = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: mockShowToast, confirm: mockConfirm }),
}));
vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { uid: 'u-1' }, logout: mockLogout }),
}));

const mockGetEvents = vi.fn();
const mockDismissAuthEvent = vi.fn().mockResolvedValue(undefined);
const mockReportUnrecognised = vi.fn().mockResolvedValue(undefined);

vi.mock('../../../services/authEventService', () => ({
    getAuthEvents: (...args: any[]) => mockGetEvents(...args),
    dismissAuthEvent: (...args: any[]) => mockDismissAuthEvent(...args),
    reportUnrecognisedSignIn: (...args: any[]) => mockReportUnrecognised(...args),
}));
vi.mock('../../../utils/error', () => ({ captureError: vi.fn() }));

const EVENTS = [
    { id: 'e-1', timestamp: new Date().toISOString(), deviceInfo: { os: 'macOS', browser: 'Chrome', raw: '' }, ipHash: 'abc', method: 'password', reported: false, newDevice: false },
    { id: 'e-2', timestamp: new Date(Date.now() - 86400000).toISOString(), deviceInfo: { os: 'iOS', browser: 'Safari', raw: '' }, ipHash: 'def', method: 'password', reported: false, newDevice: false },
    { id: 'e-3', timestamp: new Date(Date.now() - 172800000).toISOString(), deviceInfo: { os: 'Android', browser: 'Chrome', raw: '' }, ipHash: 'ghi', method: 'google', reported: false, newDevice: true },
];

beforeEach(() => {
    vi.clearAllMocks();
    mockGetEvents.mockResolvedValue(EVENTS);
    mockConfirm.mockResolvedValue(true);
});

describe('AuthEventHistory', () => {
    it('renders Devices & Sessions heading', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => expect(screen.getByText('Devices & Sessions')).toBeInTheDocument());
    });

    it('shows This device badge on the first (current) session', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => expect(screen.getByText('This device')).toBeInTheDocument());
    });

    it('does not show a Sign out button on the current device', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByText('This device'));
        const signOutBtns = screen.getAllByTitle('Sign out this device');
        // Should only exist for the 2 non-current sessions
        expect(signOutBtns).toHaveLength(2);
    });

    it('shows Sign out button on non-current sessions', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => screen.getAllByTitle('Sign out this device'));
        expect(screen.getAllByTitle('Sign out this device')).toHaveLength(2);
    });

    it('shows New device badge when newDevice is true', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => expect(screen.getByText('New')).toBeInTheDocument());
    });

    it('clicking Sign out calls revokeSession and removes the row', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => screen.getAllByTitle('Sign out this device'));
        fireEvent.click(screen.getAllByTitle('Sign out this device')[0]);
        await waitFor(() => {
            expect(mockDismissAuthEvent).toHaveBeenCalledWith('e-2');
            expect(screen.queryByText(/iOS/)).not.toBeInTheDocument();
        });
    });

    it('rolls back the row if revokeSession fails', async () => {
        mockDismissAuthEvent.mockRejectedValueOnce(new Error('network error'));
        mockGetEvents.mockResolvedValue(EVENTS);
        render(<AuthEventHistory />);
        await waitFor(() => screen.getAllByTitle('Sign out this device'));
        fireEvent.click(screen.getAllByTitle('Sign out this device')[0]);
        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith(
            expect.stringContaining('Could not sign out'), 'error'
        ));
    });

    it('hides Sign out all button when only one session', async () => {
        mockGetEvents.mockResolvedValue([EVENTS[0]]);
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByText('This device'));
        expect(screen.queryByText(/Sign out all other/)).not.toBeInTheDocument();
    });

    it('shows Sign out all other devices button when multiple sessions exist', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => expect(screen.getByText(/Sign out all other/)).toBeInTheDocument());
    });

    it('Sign out all confirms before acting', async () => {
        mockConfirm.mockResolvedValueOnce(false);
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByText(/Sign out all other/));
        fireEvent.click(screen.getByText(/Sign out all other/));
        await waitFor(() => expect(mockConfirm).toHaveBeenCalled());
        expect(mockReportUnrecognised).not.toHaveBeenCalled();
    });

    it('Sign out all calls reportUnrecognisedSignIn and logout on confirm', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByText(/Sign out all other/));
        fireEvent.click(screen.getByText(/Sign out all other/));
        await waitFor(() => {
            expect(mockReportUnrecognised).toHaveBeenCalled();
            expect(mockLogout).toHaveBeenCalled();
        });
    });

    it('renders empty state when no sessions found', async () => {
        mockGetEvents.mockResolvedValue([]);
        render(<AuthEventHistory />);
        await waitFor(() => expect(screen.getByText(/No active sessions/)).toBeInTheDocument());
    });
});
