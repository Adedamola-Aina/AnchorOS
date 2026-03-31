// @ts-nocheck
//
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthEventHistory } from './AuthEventHistory';

vi.mock('@anchor-os/ui', () => ({
    Card: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardTitle: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
    Button: ({ children, onClick, title, isLoading, disabled }: any) => (
        <button onClick={onClick} title={title} disabled={disabled || isLoading}>{children}</button>
    ),
}));

const mockShowToast = vi.fn();
const mockConfirm = vi.fn();
vi.mock('../../../context/NotificationContext', () => ({
    useNotifications: () => ({ showToast: mockShowToast, confirm: mockConfirm }),
}));

vi.mock('../../../context/AuthContext', () => ({
    useAuth: () => ({ user: { uid: 'u-1' }, logout: vi.fn() }),
}));

const mockDismiss = vi.fn().mockResolvedValue(undefined);
const mockReport = vi.fn().mockResolvedValue(undefined);
const mockGetEvents = vi.fn();

vi.mock('../../../services/authEventService', () => ({
    getAuthEvents: (...args) => mockGetEvents(...args),
    reportUnrecognisedSignIn: (...args) => mockReport(...args),
    dismissAuthEvent: (...args) => mockDismiss(...args),
}));

vi.mock('../../../utils/error', () => ({ captureError: vi.fn() }));

const EVENTS = [
    { id: 'e-1', timestamp: new Date().toISOString(), deviceInfo: { os: 'macOS', browser: 'Chrome', raw: '' }, ipHash: 'abc', method: 'password', reported: false },
    { id: 'e-2', timestamp: new Date(Date.now() - 86400000).toISOString(), deviceInfo: { os: 'iOS', browser: 'Safari', raw: '' }, ipHash: 'def', method: 'password', reported: false },
];

beforeEach(() => {
    vi.clearAllMocks();
    mockGetEvents.mockResolvedValue(EVENTS);
    mockConfirm.mockResolvedValue(true);
});

describe('AuthEventHistory', () => {
    it('renders sign-in events', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => expect(screen.getByText(/macOS/)).toBeInTheDocument());
        expect(screen.getByText(/iOS/)).toBeInTheDocument();
    });

    it('does not show dismiss button for the most recent (current) event', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByText(/macOS/));
        // There should be only one dismiss button — for the second (older) event
        const dismissBtns = screen.getAllByTitle('Remove from history');
        expect(dismissBtns).toHaveLength(1);
    });

    it('calls dismissAuthEvent and removes the event persistently', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByTitle('Remove from history'));
        fireEvent.click(screen.getByTitle('Remove from history'));
        await waitFor(() => {
            expect(mockDismiss).toHaveBeenCalledWith('e-2');
            expect(screen.queryByText(/iOS/)).not.toBeInTheDocument();
        });
    });

    it('rolls back on dismiss failure', async () => {
        mockDismiss.mockRejectedValueOnce(new Error('network error'));
        mockGetEvents.mockResolvedValue(EVENTS);
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByTitle('Remove from history'));
        fireEvent.click(screen.getByTitle('Remove from history'));
        await waitFor(() => expect(mockShowToast).toHaveBeenCalledWith(
            'Could not remove entry — please try again.', 'error'
        ));
    });

    it('calls reportUnrecognisedSignIn on sign-out-all', async () => {
        render(<AuthEventHistory />);
        await waitFor(() => screen.getByTitle('Not you? Sign out all sessions'));
        fireEvent.click(screen.getByTitle('Not you? Sign out all sessions'));
        await waitFor(() => expect(mockReport).toHaveBeenCalled());
    });
});
