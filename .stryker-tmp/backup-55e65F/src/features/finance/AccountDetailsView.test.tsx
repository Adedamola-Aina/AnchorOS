
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
        ArrowLeft: () => <div data-testid="arrow-left">ArrowLeft</div>,
        TrendingUp: () => <div data-testid="trending-up">TrendingUp</div>,
        CategoryIcon: () => <div data-testid="category-icon">CategoryIcon</div>,
        Search: () => <div data-testid="search">Search</div>,
        Trash2: () => <div data-testid="trash">Trash</div>,
        ArrowUpRight: () => <div data-testid="arrow-up-right">ArrowUpRight</div>,
        ArrowDownLeft: () => <div data-testid="arrow-down-left">ArrowDownLeft</div>,
        Calendar: () => <div data-testid="calendar">Calendar</div>,
        User: () => <div data-testid="user">User</div>,
        Pencil: () => <div data-testid="pencil">Pencil</div>,
    };
});

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
        // Account name appears in header + transaction bank tag pill
        expect(screen.getAllByText('Checking Account').length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();
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

    it('calls onBack when back button is clicked', async () => {
        const onBack = vi.fn();
        renderWithContext(
            <AccountDetailsView
                account={mockAccount}
                onBack={onBack}
            />
        );
        const user = userEvent.setup();
        const backButton = screen.getByTestId('arrow-left').closest('button');
        await user.click(backButton!);
        expect(onBack).toHaveBeenCalled();
    });

    it('shows share button when spouseId is provided and user is owner', () => {
        const onShare = vi.fn();
        renderWithContext(
            <AccountDetailsView
                account={{ ...mockAccount, ownerId: undefined }} // Current user owns it (default)
                onBack={vi.fn()}
                onShare={onShare}
                familyMemberId="spouse-1"
            />
        );
        // It renders the User icon button
        // We can't easily query by icon without testid, but we can check if onShare works
        // Or check title
        const shareBtn = screen.getByTitle('Manage Sharing');
        expect(shareBtn).toBeInTheDocument();
    });
});
