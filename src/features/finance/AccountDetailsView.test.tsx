// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

const createMockContexts = (financeOverrides = {}, notificationOverrides = {}) => {
    const finance = {
        transactions: mockTransactions,
        accounts: [mockAccount],
        addAccount: vi.fn(),
        deleteAccount: vi.fn(),
        addTransaction: vi.fn(),
        deleteTransaction: vi.fn(),
        updateAccountPersonalization: vi.fn(),
        renameAccount: vi.fn(),
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
    const notifications = { showToast: vi.fn(), confirm: vi.fn().mockResolvedValue(true), ...notificationOverrides };

    return { finance, app, auth, family, notifications };
};

const wrapWithContext = (ui: React.ReactElement, { finance = {}, notifications: notificationOverrides = {} } = {}) => {
    const { finance: mockFinance, app, auth, family: _family, notifications } = createMockContexts(finance, notificationOverrides);
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return (
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

const renderWithContext = (ui: React.ReactElement, { finance = {}, notifications = {} } = {}) => render(wrapWithContext(ui, { finance, notifications }));

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

    it('replaces the rename placeholder: opening Edit Account shows the rename UI, not a "coming soon" toast', async () => {
        const showToast = vi.fn();
        const user = userEvent.setup();
        renderWithContext(
            <AccountDetailsView account={mockAccount} onBack={vi.fn()} />,
            { notifications: { showToast } }
        );
        await user.click(screen.getByLabelText('Account options'));
        await user.click(screen.getByText('Edit Account'));
        expect(screen.getByText('Rename Account')).toBeInTheDocument();
        expect(showToast).not.toHaveBeenCalledWith('Rename coming soon', 'info');
    });
});

describe('AccountDetailsView rename (Issue #142)', () => {
    const openRenameModal = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.click(screen.getByLabelText('Account options'));
        await user.click(screen.getByText('Edit Account'));
    };

    it('owner can open the rename UI pre-filled with the current account name', async () => {
        const user = userEvent.setup();
        renderWithContext(<AccountDetailsView account={mockAccount} onBack={vi.fn()} />);
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        expect(screen.getByText('Rename Account')).toBeInTheDocument();
        expect(input).toHaveValue('Checking Account');
        expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    });

    it('submits the trimmed new name via FinanceContext.renameAccount with the account id (keyboard Enter)', async () => {
        const renameAccount = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        renderWithContext(
            <AccountDetailsView account={mockAccount} onBack={vi.fn()} />,
            { finance: { renameAccount } }
        );
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, '  Main Checking  ');
        await user.keyboard('{Enter}');
        await waitFor(() => expect(renameAccount).toHaveBeenCalledTimes(1));
        expect(renameAccount).toHaveBeenCalledWith('acc-1', 'Main Checking');
    });

    it('does not submit when the name is empty or whitespace-only', async () => {
        const renameAccount = vi.fn().mockResolvedValue(undefined);
        const showToast = vi.fn();
        const user = userEvent.setup();
        renderWithContext(
            <AccountDetailsView account={mockAccount} onBack={vi.fn()} />,
            { finance: { renameAccount }, notifications: { showToast } }
        );
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, '   ');
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(renameAccount).not.toHaveBeenCalled();
        expect(showToast).toHaveBeenCalledWith('Account name cannot be empty', 'error');
    });

    it('does not submit when the normalized name is unchanged', async () => {
        const renameAccount = vi.fn().mockResolvedValue(undefined);
        const showToast = vi.fn();
        const user = userEvent.setup();
        renderWithContext(
            <AccountDetailsView account={mockAccount} onBack={vi.fn()} />,
            { finance: { renameAccount }, notifications: { showToast } }
        );
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Checking   Account'); // identical after whitespace normalization
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(renameAccount).not.toHaveBeenCalled();
        expect(showToast).toHaveBeenCalledWith('No changes to save', 'info');
    });

    it('non-owner (shared viewer) cannot access or submit rename', async () => {
        const sharedAccount: AnchorAccount = {
            ...mockAccount,
            ownerId: 'owner-1',
            sharedWith: { 'test-user': { permission: 'read' } },
        };
        const renameAccount = vi.fn();
        const user = userEvent.setup();
        renderWithContext(
            <AccountDetailsView account={sharedAccount} onBack={vi.fn()} />,
            { finance: { renameAccount } }
        );
        await user.click(screen.getByLabelText('Account options'));
        // Owner-only actions are absent; no rename entry point, no rename UI
        expect(screen.queryByText('Edit Account')).not.toBeInTheDocument();
        expect(screen.queryByText('Rename Account')).not.toBeInTheDocument();
        expect(renameAccount).not.toHaveBeenCalled();
    });

    it('prevents duplicate submissions while a rename is pending', async () => {
        let resolveRename: (value: void) => void = () => {};
        const renameAccount = vi.fn().mockImplementation(() => new Promise<void>((resolve) => { resolveRename = resolve; }));
        const user = userEvent.setup();
        renderWithContext(
            <AccountDetailsView account={mockAccount} onBack={vi.fn()} />,
            { finance: { renameAccount } }
        );
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        const pendingButton = await screen.findByRole('button', { name: 'Renaming...' });
        expect(pendingButton).toBeDisabled();
        // Clicks while pending must not submit again (also covered by the isRenaming guard)
        await user.click(pendingButton);
        await user.click(pendingButton);
        expect(renameAccount).toHaveBeenCalledTimes(1);

        resolveRename();
        await waitFor(() => expect(screen.queryByRole('button', { name: 'Renaming...' })).not.toBeInTheDocument());
    });

    it('failure keeps the modal recoverable with entered text and surfaces an error; retry succeeds', async () => {
        const renameAccount = vi.fn()
            .mockRejectedValueOnce(new Error('network'))
            .mockResolvedValueOnce(undefined);
        const showToast = vi.fn();
        const user = userEvent.setup();
        renderWithContext(
            <AccountDetailsView account={mockAccount} onBack={vi.fn()} />,
            { finance: { renameAccount }, notifications: { showToast } }
        );
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));

        await waitFor(() => expect(showToast).toHaveBeenCalledWith('Unable to rename account right now', 'error'));
        // Modal stays open and the entered text is preserved for recovery
        expect(screen.getByText('Rename Account')).toBeInTheDocument();
        expect(screen.getByLabelText('Account name')).toHaveValue('Main Checking');

        // Retry with the same text succeeds and closes the modal
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(renameAccount).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(screen.queryByText('Rename Account')).not.toBeInTheDocument());
        expect(showToast).toHaveBeenCalledWith('Account renamed to "Main Checking"', 'success');
    });

    it('displays the updated account name after a successful rename (parent data flow)', async () => {
        const renameAccount = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        const view = renderWithContext(
            <AccountDetailsView account={mockAccount} onBack={vi.fn()} />,
            { finance: { renameAccount } }
        );
        await openRenameModal(user);
        const input = screen.getByLabelText('Account name');
        await user.clear(input);
        await user.type(input, 'Main Checking');
        await user.click(screen.getByRole('button', { name: 'Save' }));
        await waitFor(() => expect(renameAccount).toHaveBeenCalledWith('acc-1', 'Main Checking'));

        // In the real app the accounts onSnapshot listener updates the shared accounts
        // data; FinanceView re-derives selectedAccount and re-renders this view with the
        // renamed account prop. Simulate that data flow and assert the UI reflects it
        // (header + account card), not merely that the mocked function was called.
        const renamedAccount: AnchorAccount = { ...mockAccount, name: 'Main Checking' };
        view.rerender(wrapWithContext(<AccountDetailsView account={renamedAccount} onBack={vi.fn()} />, { finance: { renameAccount } }));
        // The renamed account is reflected everywhere it is displayed (header and card)
        expect(screen.getAllByText('Main Checking').length).toBeGreaterThan(0);
        expect(screen.getByText('Main Checking', { selector: 'h2' })).toBeInTheDocument();
        expect(screen.queryByText('Checking Account', { selector: 'h2' })).not.toBeInTheDocument();
    });
});
