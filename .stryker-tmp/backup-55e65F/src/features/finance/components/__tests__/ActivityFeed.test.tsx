import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActivityFeed } from '../ActivityFeed';
import type { AccountActivity } from '../../../../types/activity';

// Mock lucide-react icons
vi.mock('lucide-react', async () => {
    const actual = await vi.importActual('lucide-react');
    return {
        ...actual,
        PlusCircle: () => <span data-testid="plus-icon">+</span>,
        Pencil: () => <span data-testid="pencil-icon">✏</span>,
        Trash2: () => <span data-testid="trash-icon">🗑</span>,
        Type: () => <span data-testid="type-icon">T</span>,
        UserPlus: () => <span data-testid="user-plus-icon">👤+</span>,
        UserMinus: () => <span data-testid="user-minus-icon">👤-</span>,
        Activity: () => <span data-testid="activity-icon">⚡</span>,
        Clock: () => <span data-testid="clock-icon">🕐</span>,
    };
});

const createMockActivity = (overrides: Partial<AccountActivity> = {}): AccountActivity => ({
    id: 'activity-1',
    accountId: 'acc-1',
    accountOwnerId: 'user-1',
    action: 'transaction_added',
    actorId: 'user-1',
    actorName: 'John Doe',
    timestamp: new Date().toISOString(),
    details: {
        transactionTitle: 'Groceries',
        amountCents: 5000,
        currency: 'USD',
        type: 'expense',
    },
    ...overrides,
});

describe('ActivityFeed', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders empty state when no activities', () => {
        render(<ActivityFeed activities={[]} />);

        expect(screen.getByText('No activity yet')).toBeInTheDocument();
        expect(screen.getByText(/Activity will appear here/)).toBeInTheDocument();
    });

    it('renders loading skeleton when loading', () => {
        render(<ActivityFeed activities={[]} loading={true} />);

        // Should have skeleton placeholders (animated divs)
        const container = document.querySelector('.animate-pulse');
        expect(container).toBeInTheDocument();
    });

    it('renders activity items correctly', () => {
        const activities = [
            createMockActivity({
                id: 'act-1',
                action: 'transaction_added',
                actorName: 'John',
                details: { transactionTitle: 'Lunch', amountCents: 1500, currency: 'USD', type: 'expense' },
            }),
        ];

        render(<ActivityFeed activities={activities} />);

        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText(/added "Lunch"/)).toBeInTheDocument();
    });

    it('shows "You" for current user activities', () => {
        const activities = [
            createMockActivity({
                actorId: 'current-user',
                actorName: 'Me',
            }),
        ];

        render(<ActivityFeed activities={activities} currentUserId="current-user" />);

        expect(screen.getByText('You')).toBeInTheDocument();
    });

    it('shows family member name for other user activities', () => {
        const activities = [
            createMockActivity({
                actorId: 'other-user',
                actorName: 'Sarah',
            }),
        ];

        render(<ActivityFeed activities={activities} currentUserId="current-user" />);

        expect(screen.getByText('Sarah')).toBeInTheDocument();
    });

    it('displays amount for transaction activities', () => {
        const activities = [
            createMockActivity({
                details: {
                    transactionTitle: 'Electric Bill',
                    amountCents: 12500,
                    currency: 'USD',
                    type: 'expense',
                },
            }),
        ];

        render(<ActivityFeed activities={activities} />);

        // Should display formatted amount
        expect(screen.getByText(/-\$125\.00/)).toBeInTheDocument();
    });

    it('shows previous amount when transaction was edited', () => {
        const activities = [
            createMockActivity({
                action: 'transaction_edited',
                details: {
                    transactionTitle: 'Rent',
                    amountCents: 150000,
                    previousAmountCents: 120000,
                    currency: 'USD',
                    type: 'expense',
                },
            }),
        ];

        render(<ActivityFeed activities={activities} />);

        // Should show "was" amount
        expect(screen.getByText(/was \$1,200\.00/)).toBeInTheDocument();
    });

    it('respects maxItems prop', () => {
        const activities = [
            createMockActivity({ id: '1', details: { transactionTitle: 'Item 1' } }),
            createMockActivity({ id: '2', details: { transactionTitle: 'Item 2' } }),
            createMockActivity({ id: '3', details: { transactionTitle: 'Item 3' } }),
            createMockActivity({ id: '4', details: { transactionTitle: 'Item 4' } }),
            createMockActivity({ id: '5', details: { transactionTitle: 'Item 5' } }),
        ];

        render(<ActivityFeed activities={activities} maxItems={3} />);

        // Should show "+ X more activities" message
        expect(screen.getByText('+2 more activities')).toBeInTheDocument();
    });

    it('renders different icons for different activity types', () => {
        const activities = [
            createMockActivity({ id: '1', action: 'transaction_added' }),
            createMockActivity({ id: '2', action: 'transaction_edited' }),
            createMockActivity({ id: '3', action: 'transaction_deleted' }),
        ];

        render(<ActivityFeed activities={activities} />);

        expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
        expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();
        expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
    });

    it('formats relative time correctly', () => {
        const recentActivity = createMockActivity({
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        });

        render(<ActivityFeed activities={[recentActivity]} />);

        expect(screen.getByText('5m ago')).toBeInTheDocument();
    });

    it('does not show amount for deleted transactions', () => {
        const activities = [
            createMockActivity({
                action: 'transaction_deleted',
                details: {
                    transactionTitle: 'Deleted Item',
                    amountCents: 5000,
                    currency: 'USD',
                    type: 'expense',
                },
            }),
        ];

        render(<ActivityFeed activities={activities} />);

        // Amount should not be shown for deleted transactions
        expect(screen.queryByText(/-\$50\.00/)).not.toBeInTheDocument();
    });
});
