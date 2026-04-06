// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountDetailsView } from './AccountDetailsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContext } from '../../context/AnchorContext';
import { FinanceContext } from '../../context/FinanceContext';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import type { AnchorAccount, AnchorTransaction, UserProfile } from '../../types';

// Mock lucide-react icons
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('lucide-react')>();
    return {
        ...actual,
        X: () => <div data-testid="x-icon">X</div>,
        MoreHorizontal: () => <div data-testid="more-icon">MoreHorizontal</div>,
        TrendingUp: () => <div data-testid="trending-up">TrendingUp</div>,
        Search: () => <div data-testid="search">Search</div>,
        Trash2: () => <div data-testid="trash">Trash</div>,
        ArrowUpRight: () => <div data-testid="arrow-up-right">ArrowUpRight</div>,
        ArrowDownLeft: () => <div data-testid="arrow-down-left">ArrowDownLeft</div>,
        Pencil: () => <div data-testid="pencil">Pencil</div>,
        Palette: () => <div data-testid="palette">Palette</div>,
        Download: () => <div data-testid="download">Download</div>,
        RefreshCw: () => <div data-testid="refresh">RefreshCw</div>,
    };
});

vi.mock('../../components/shared/Modal', () => ({
    Modal: ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode }) => {
        if (!isOpen) return null;
        return (
            <div data-testid="modal" role="dialog">
                <div>
                    <h3>{title}</h3>
                    <button onClick={onClose}>Close</button>
                </div>
                <div>{children}</div>
            </div>
        );
    }
}));

// Test Data
const mockAccount: AnchorAccount = {
    id: 'acc-1',
    name: 'Checking Account',
    type: 'checking',
    currency: 'USD',
    balanceCents: 500000,
    color: 'bg-blue-500',
    scope: 'personal',
};

const mockTransactions: AnchorTransaction[] = [
    {
        id: 'tx-1',
        title: 'Grocery Shopping',
        amountCents: 15050,
        type: 'expense',
        category: 'Food',
        accountId: 'acc-1',
        accountName: 'Checking Account',
        currency: 'USD',
        scope: 'personal',
        date: new Date().toISOString(),
    },
    {
        id: 'tx-2',
        title: 'Other Account Tx',
        amountCents: 2000,
        type: 'expense',
        category: 'Misc',
        accountId: 'acc-2',
        accountName: 'Savings',
        currency: 'USD',
        scope: 'personal',
        date: new Date().toISOString(),
    }
];

const mockProfile: UserProfile = {
    name: 'Test User',
    familyMode: false,
    theme: 'light',
};

const createMockContexts = (financeOverrides = {}) => {
    const finance = {
        transactions: mockTransactions,
        accounts: [mockAccount],
        addAccount: vi.fn(),
        deleteAccount: vi.fn(),
        addTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
        updateAccountPersonalization: vi.fn(),
        shareAccount: vi.fn(),
        currentMonth: new Date(),
        nextMonth: vi.fn(),
        prevMonth: vi.fn(),
        jumpToMonth: vi.fn(),
        loadingFinance: false,
        ...financeOverrides,
    };

    const app = { navigateTo: vi.fn(), activeTab: 'finance' };
    const auth = { user: { uid: 'test-user' }, profile: mockProfile };
    const family = { spouseId: null };
    const notifications = { showToast: vi.fn(), confirm: vi.fn().mockResolvedValue(true) };

    return { finance, app, auth, family, notifications };
};

const renderWithContext = (ui: React.ReactElement, { finance = {} } = {}) => {
    const { finance: mockFinance, app, auth, family: _family, notifications } = createMockContexts(finance);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={auth as any}>

                <AppContext.Provider value={app as any}>
                    <FinanceContext.Provider value={mockFinance as any}>
                        <NotificationContext.Provider value={notifications as any}>
                            {ui}
                        </NotificationContext.Provider>
                    </FinanceContext.Provider>
                </AppContext.Provider>

            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

describe('AccountDetailsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock layout for virtualization
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 600 });
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 600 });
    });

    it('renders account name and balance correctly', () => {
        renderWithContext(
            <AccountDetailsView
                account={mockAccount}
                onBack={vi.fn()}
            />
        );
        // Account name appears in header + card
        expect(screen.getAllByText('Checking Account').length).toBeGreaterThanOrEqual(1);
        // Balance strip shows formatted balance
        expect(screen.getAllByText(/\$5,000\.00/).length).toBeGreaterThanOrEqual(1);
        // History section heading
        expect(screen.getAllByText('History').length).toBeGreaterThanOrEqual(1);
    });

    it('renders only transactions for selected account', () => {
        renderWithContext(
            <AccountDetailsView
                account={mockAccount}
                onBack={vi.fn()}
            />
        );
        expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
        expect(screen.queryByText('Other Account Tx')).not.toBeInTheDocument();
    });

    it('filters transactions by search query', async () => {
        renderWithContext(
            <AccountDetailsView
                account={mockAccount}
                onBack={vi.fn()}
            />
        );
        const user = userEvent.setup();
        const searchInput = screen.getByPlaceholderText('Search...');

        await user.type(searchInput, 'Grocery');
        expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();

        await user.clear(searchInput);
        await user.type(searchInput, 'Nothing');
        expect(screen.queryByText('Grocery Shopping')).not.toBeInTheDocument();
    });

    it('calls onBack when close button is clicked', async () => {
        const onBack = vi.fn();
        renderWithContext(
            <AccountDetailsView
                account={mockAccount}
                onBack={onBack}
            />
        );
        const user = userEvent.setup();
        const closeButton = screen.getByLabelText('Close account details');
        await user.click(closeButton);
        expect(onBack).toHaveBeenCalled();
    });

    it('shows Record Transaction button when onAddTransaction is provided', () => {
        const onAdd = vi.fn();
        renderWithContext(
            <AccountDetailsView
                account={mockAccount}
                onBack={vi.fn()}
                onAddTransaction={onAdd}
            />
        );
        expect(screen.getByText('Record Transaction')).toBeInTheDocument();
    });

    it('opens action sheet when ellipsis is clicked', async () => {
        renderWithContext(
            <AccountDetailsView
                account={mockAccount}
                onBack={vi.fn()}
                onDelete={vi.fn()}
            />
        );
        const user = userEvent.setup();

        await user.click(screen.getByLabelText('Account options'));

        // Action sheet shows Edit, Customize, Export, Delete
        expect(screen.getByText('Edit Account')).toBeInTheDocument();
        expect(screen.getByText('Customize Card')).toBeInTheDocument();
        expect(screen.getByText('Export Transactions')).toBeInTheDocument();
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
    });
});
