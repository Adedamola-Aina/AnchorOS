import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

// Hoist mocks so vi.mock factories can reference them
const { mockOnSnapshot, mockUpdateDoc } = vi.hoisted(() => ({
    mockOnSnapshot: vi.fn(),
    mockUpdateDoc: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../config/firebase', () => ({
    db: {},
    APP_ID: 'anchor-os',
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
    onSnapshot: mockOnSnapshot,
    doc: vi.fn(),
    updateDoc: mockUpdateDoc,
}));

vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: { uid: 'user-1' } }),
}));

vi.mock('lucide-react', () => ({
    X: (props: Record<string, unknown>) => <span data-testid="icon-x" {...props} />,
    ArrowRight: (props: Record<string, unknown>) => <span data-testid="icon-arrow" {...props} />,
}));

vi.mock('./notificationStyles', () => ({
    getNotificationIcon: () => (props: Record<string, unknown>) => <span data-testid="notif-icon" {...props} />,
    getNotificationBgColor: () => 'bg-amber-50',
    getNotificationIconColor: () => 'text-amber-500',
}));

import { FamilyNotificationBanner } from './FamilyNotificationBanner';

type SnapshotCallback = (snap: { docs: { id: string; data: () => Record<string, unknown> }[] }) => void;

const makeFakeNotif = (overrides: Partial<{ id: string; type: string; title: string; message: string; actorUid: string; actorName: string; read: boolean; dismissed: boolean; createdAt: { seconds: number }; accountId: string; }> = {}) => ({
    id: 'notif-1',
    type: 'family_connected',
    title: 'Family Connected',
    message: 'Jane joined your family',
    actorUid: 'actor-1',
    actorName: 'Jane',
    read: false,
    dismissed: false,
    createdAt: { seconds: Date.now() / 1000 },
    ...overrides,
});

describe('FamilyNotificationBanner', () => {
    let snapshotCb: SnapshotCallback;

    beforeEach(() => {
        vi.clearAllMocks();
        // Capture the callback but don't call it synchronously
        mockOnSnapshot.mockImplementation((_q: unknown, cb: SnapshotCallback) => {
            snapshotCb = cb;
            return vi.fn(); // unsubscribe
        });
    });

    it('returns null when no notifications', () => {
        const { container } = render(<FamilyNotificationBanner />);
        // Before snapshot callback fires, should be empty
        act(() => snapshotCb({ docs: [] }));
        expect(container.firstChild).toBeNull();
    });

    it('renders a notification when present', () => {
        render(<FamilyNotificationBanner />);
        const notif = makeFakeNotif();
        act(() => snapshotCb({ docs: [{ id: notif.id, data: () => notif }] }));
        expect(screen.getByText('Family Connected')).toBeInTheDocument();
        expect(screen.getByText('Jane joined your family')).toBeInTheDocument();
    });

    it('shows View action button', () => {
        render(<FamilyNotificationBanner />);
        const notif = makeFakeNotif();
        act(() => snapshotCb({ docs: [{ id: notif.id, data: () => notif }] }));
        expect(screen.getByText('View')).toBeInTheDocument();
    });

    it('calls onNavigate with settings on family_connected action', () => {
        const onNavigate = vi.fn();
        render(<FamilyNotificationBanner onNavigate={onNavigate} />);
        const notif = makeFakeNotif({ type: 'family_connected' });
        act(() => snapshotCb({ docs: [{ id: notif.id, data: () => notif }] }));
        fireEvent.click(screen.getByText('View'));
        expect(onNavigate).toHaveBeenCalledWith('settings');
    });

    it('calls onNavigate with finance on account notifications', () => {
        const onNavigate = vi.fn();
        render(<FamilyNotificationBanner onNavigate={onNavigate} />);
        const notif = makeFakeNotif({ type: 'shared_account_update' });
        act(() => snapshotCb({ docs: [{ id: notif.id, data: () => notif }] }));
        fireEvent.click(screen.getByText('View'));
        expect(onNavigate).toHaveBeenCalledWith('finance');
    });

    it('dismisses notification on X click', async () => {
        render(<FamilyNotificationBanner />);
        const notif = makeFakeNotif();
        act(() => snapshotCb({ docs: [{ id: notif.id, data: () => notif }] }));
        await act(async () => {
            fireEvent.click(screen.getByTitle('Dismiss'));
        });
        expect(mockUpdateDoc).toHaveBeenCalledWith(undefined, { dismissed: true });
    });

    it('shows pagination when multiple notifications', () => {
        render(<FamilyNotificationBanner />);
        const n1 = makeFakeNotif({ id: 'n1', title: 'First' });
        const n2 = makeFakeNotif({ id: 'n2', title: 'Second' });
        act(() => snapshotCb({
            docs: [
                { id: n1.id, data: () => n1 },
                { id: n2.id, data: () => n2 },
            ]
        }));
        expect(screen.getByText('1 of 2')).toBeInTheDocument();
    });

    it('navigates between notifications with arrows', () => {
        render(<FamilyNotificationBanner />);
        const n1 = makeFakeNotif({ id: 'n1', title: 'First' });
        const n2 = makeFakeNotif({ id: 'n2', title: 'Second' });
        act(() => snapshotCb({
            docs: [
                { id: n1.id, data: () => n1 },
                { id: n2.id, data: () => n2 },
            ]
        }));
        expect(screen.getByText('First')).toBeInTheDocument();

        fireEvent.click(screen.getByText('→'));
        expect(screen.getByText('Second')).toBeInTheDocument();
        expect(screen.getByText('2 of 2')).toBeInTheDocument();

        fireEvent.click(screen.getByText('←'));
        expect(screen.getByText('First')).toBeInTheDocument();
    });

    it('filters by accountId when provided', () => {
        render(<FamilyNotificationBanner accountId="acc-1" />);
        const n1 = makeFakeNotif({ id: 'n1', title: 'Match', accountId: 'acc-1' });
        const n2 = makeFakeNotif({ id: 'n2', title: 'NoMatch', accountId: 'acc-2' });
        act(() => snapshotCb({
            docs: [
                { id: n1.id, data: () => n1 },
                { id: n2.id, data: () => n2 },
            ]
        }));
        expect(screen.getByText('Match')).toBeInTheDocument();
        expect(screen.queryByText('NoMatch')).not.toBeInTheDocument();
    });

    it('unsubscribes on unmount', () => {
        const unsubscribe = vi.fn();
        mockOnSnapshot.mockImplementation((_q: unknown, cb: SnapshotCallback) => {
            snapshotCb = cb;
            return unsubscribe;
        });

        const { unmount } = render(<FamilyNotificationBanner />);
        unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });
});
