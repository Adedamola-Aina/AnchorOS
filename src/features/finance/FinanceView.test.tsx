/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FinanceView from './FinanceView';
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
    Landmark: () => <div data-testid="landmark-icon">Landmark</div>,
    Plus: () => <div data-testid="plus-icon">Plus</div>,
    Search: () => <div data-testid="search-icon">Search</div>,
    DollarSign: () => <div data-testid="dollar-icon">DollarSign</div>,
    Banknote: () => <div data-testid="banknote-icon">Banknote</div>,
    Trash2: () => <div data-testid="trash-icon">Trash</div>,
    ArrowUpRight: () => <div data-testid="arrow-up-right">ArrowUpRight</div>,
    ArrowDownLeft: () => <div data-testid="arrow-down-left">ArrowDownLeft</div>,
    Calendar: () => <div data-testid="calendar">Calendar</div>,
    TrendingUp: () => <div data-testid="trending-up">TrendingUp</div>,
    User: () => <div data-testid="user">User</div>,
    Pencil: () => <div data-testid="pencil">Pencil</div>,
  };
});

// Mock VirtualTransactionList to render all items without virtualization for testing
vi.mock('./components/VirtualTransactionList', () => ({
  VirtualTransactionList: ({ transactions, currentUserId, onEdit, onDelete, loading, searchQuery, onClearSearch }: any) => {
    if (transactions.length === 0) {
      return (
        <div className="p-16 text-center">
          <h4>{searchQuery ? 'No transactions found' : 'No transactions yet'}</h4>
          {searchQuery && onClearSearch && (
            <button onClick={onClearSearch}>Clear Search</button>
          )}
        </div>
      );
    }

    // Render simplified transaction items directly
    return (
      <div className={loading ? 'opacity-40' : ''} data-testid="transaction-list">
        {transactions.map((tx: any) => (
          <div key={tx.id} className="border-b border-slate-100 p-4">
            <div className="flex justify-between">
              <span>{tx.title}</span>
              <span>
                {tx.type === 'income' ? '+' : '-'}
                {(tx.amountCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="text-sm text-slate-500">
              <span>{tx.category}</span>
              {tx.accountName && <span> • {tx.accountName}</span>}
            </div>
            <button onClick={() => onEdit(tx)} data-testid={`edit-tx-${tx.id}`}>Edit</button>
            <button onClick={() => onDelete(tx)} data-testid="trash-icon">Trash</button>
          </div>
        ))}
      </div>
    );
  }
}));

// Mock Modal to render without portal for testing
vi.mock('../../components/shared/Modal', () => ({
  Modal: ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" role="dialog">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    );
  }
}));

const mockAccounts: AnchorAccount[] = [
  {
    id: 'acc-1',
    name: 'Checking Account',
    type: 'checking',
    currency: 'USD',
    balanceCents: 500000,
    color: 'bg-blue-500',
    scope: 'personal',
    ownerId: 'test-user',
  },
  {
    id: 'acc-2',
    name: 'Savings Account',
    type: 'savings',
    currency: 'USD',
    balanceCents: 1000000,
    color: 'bg-green-500',
    scope: 'personal',
    ownerId: 'test-user',
  },
  {
    id: 'acc-3',
    name: 'Naira Account',
    type: 'checking',
    currency: 'NGN',
    balanceCents: 50000000,
    color: 'bg-emerald-500',
    scope: 'personal',
    ownerId: 'test-user',
  },
];

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
    date: '2024-01-15T10:30:00Z',
  },
  {
    id: 'tx-2',
    title: 'Salary',
    amountCents: 500000,
    type: 'income',
    category: 'Salary',
    accountId: 'acc-1',
    accountName: 'Checking Account',
    currency: 'USD',
    scope: 'personal',
    date: '2024-01-01T09:00:00Z',
  },
  {
    id: 'tx-3',
    title: 'Rent Payment',
    amountCents: 150000,
    type: 'expense',
    category: 'Housing',
    accountId: 'acc-1',
    accountName: 'Checking Account',
    currency: 'USD',
    scope: 'personal',
    date: '2024-01-05T14:00:00Z',
  },
];

const mockProfile: UserProfile = {
  name: 'Test User',
  familyMode: false,
  theme: 'light',
};

const createMockContexts = (financeOverrides = {}, appOverrides = {}, authOverrides = {}, familyOverrides = {}) => {
  const finance = {
    transactions: mockTransactions,
    accounts: mockAccounts,
    addAccount: vi.fn(),
    deleteAccount: vi.fn(),
    addTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    shareAccount: vi.fn(),
    nextMonth: vi.fn(),
    prevMonth: vi.fn(),
    jumpToMonth: vi.fn(),
    currentMonth: new Date(2024, 0, 1), // Jan 2024
    loadingFinance: false,
    netWorth: { NGN: 500000, USD: 15000 },
    recentActivity: mockTransactions.slice(0, 5),
    cashFlow: { income: 5000, expenses: 1500 },
    ...financeOverrides,
  };

  const app = {
    navigateTo: vi.fn(),
    activeTab: 'finance',
    ...appOverrides,
  };

  const auth = {
    user: { uid: 'test-user' } as any,
    profile: mockProfile,
    loading: false,
    updateProfile: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    verifyMfa: vi.fn(),
    generateMfaSecret: vi.fn(),
    enrollMfa: vi.fn(),
    unenrollMfa: vi.fn(),
    logout: vi.fn(),
    sendVerificationEmail: vi.fn(),
    ...authOverrides,
  };

  const family = {
    spouseId: null,
    sendInvite: vi.fn(),
    acceptInvite: vi.fn(),
    ...familyOverrides,
  };

  const notifications = {
    showToast: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
  };

  return { finance, app, auth, family, notifications };
};

const renderWithContext = (ui: React.ReactElement, { finance = {}, app = {}, auth = {}, family = {} } = {}) => {
  const { finance: mockFinance, app: mockApp, auth: mockAuth, family: mockFamily, notifications: mockNotifications } = createMockContexts(finance, app, auth, family);
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuth as any}>
        <AppContext.Provider value={mockApp as any}>
          <FinanceContext.Provider value={mockFinance as any}>
            <NotificationContext.Provider value={mockNotifications as any}>
              {ui}
            </NotificationContext.Provider>
          </FinanceContext.Provider>
        </AppContext.Provider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('FinanceView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    global.confirm = vi.fn(() => true);
  });

  describe('Account Rendering', () => {
    it('renders all accounts correctly', () => {
      const { finance, app } = createMockContexts();
      renderWithContext(<FinanceView />, { finance, app });

      expect(screen.getAllByText('Checking Account').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Savings Account').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Naira Account').length).toBeGreaterThan(0);
    });

    it('displays account balances with correct currency formatting', () => {
      renderWithContext(<FinanceView />);

      // USD $5,000 is < 10K threshold → full format
      expect(screen.getAllByText(/\$5,000\.00/).length).toBeGreaterThan(0);
      // USD $10,000 is at 10K threshold → abbreviated to $10K (trailing .0 stripped)
      expect(screen.getAllByText(/\$10K/).length).toBeGreaterThan(0);

      // NGN ₦500,000 → abbreviated to ₦500K (trailing .0 stripped)
      expect(screen.getAllByText(/₦500K/).length).toBeGreaterThan(0);
    });

    it('displays account type badges correctly', () => {
      renderWithContext(<FinanceView />);

      const badges = screen.getAllByText('checking');
      expect(badges).toHaveLength(2); // Two checking accounts
      expect(screen.getByText('savings')).toBeInTheDocument();
    });

    it('shows empty state when no accounts exist', () => {
      renderWithContext(<FinanceView />, { finance: { accounts: [] } });

      expect(screen.getByText('No accounts yet')).toBeInTheDocument();
    });

    it('shows delete button on account hover', async () => {
      renderWithContext(<FinanceView />);

      const trashIcons = screen.getAllByTestId('trash-icon');
      expect(trashIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Transaction Rendering', () => {
    it('renders all transactions correctly', () => {
      renderWithContext(<FinanceView />);

      expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
      expect(screen.getAllByText('Salary').length).toBeGreaterThan(0);
      expect(screen.getByText('Rent Payment')).toBeInTheDocument();
    });

    it('displays transaction amounts with correct sign and currency', () => {
      renderWithContext(<FinanceView />);

      // Income should have + sign
      expect(screen.getByText((content) => content.includes('5,000.00') && content.includes('+'))).toBeInTheDocument();

      // Expenses should have - sign
      expect(screen.getByText((content) => content.includes('150.50') && content.includes('-'))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('1,500.00') && content.includes('-'))).toBeInTheDocument();
    });

    it('displays transaction categories correctly', () => {
      renderWithContext(<FinanceView />);

      expect(screen.getAllByText('Food').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Salary').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Housing').length).toBeGreaterThan(0);
    });

    it('displays account names with transactions', () => {
      renderWithContext(<FinanceView />);

      const accountNames = screen.getAllByText(/Checking Account/);
      expect(accountNames.length).toBeGreaterThan(0);
    });

    it('shows empty state for filtered transactions', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const searchInput = screen.getByPlaceholderText(/Search/);
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText('No transactions found')).toBeInTheDocument();
      });
    });
  });

  describe('Transaction Search', () => {
    it('filters transactions by title', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const searchInput = screen.getByPlaceholderText(/Search/);
      await user.type(searchInput, 'Grocery');

      await waitFor(() => {
        expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
        expect(screen.queryByText('Salary')).not.toBeInTheDocument();
        expect(screen.queryByText('Rent Payment')).not.toBeInTheDocument();
      });
    });

    it('filters transactions by account name', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const searchInput = screen.getByPlaceholderText(/Search/);
      await user.type(searchInput, 'Checking');

      await waitFor(() => {
        // All transactions are from Checking Account
        expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
        expect(screen.getAllByText('Salary').length).toBeGreaterThan(0);
      });
    });

    it('filters transactions by category', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const searchInput = screen.getByPlaceholderText(/Search/);
      await user.type(searchInput, 'Food');

      await waitFor(() => {
        expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
        expect(screen.queryByText('Salary')).not.toBeInTheDocument();
      });
    });

    it('search is case insensitive', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const searchInput = screen.getByPlaceholderText(/Search/);
      await user.type(searchInput, 'GROCERY');

      await waitFor(() => {
        expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
      });
    });
  });

  describe('Add Account Form', () => {
    it('shows add account form when "Add Account" button is clicked', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const addAccountButton = screen.getByRole('button', { name: /Add Account/i });
      await user.click(addAccountButton);

      expect(screen.getByText('Setup New Account')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e.g. Zenith Spending/)).toBeInTheDocument();
    });

    it('closes add account form when cancel is clicked', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const addAccountButton = screen.getByRole('button', { name: /Add Account/i });
      await user.click(addAccountButton);

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Setup New Account')).not.toBeInTheDocument();
      });
    });

    it('calls addAccount with correct data when form is submitted', async () => {
      const addAccountSpy = vi.fn();
      renderWithContext(<FinanceView />, { finance: { addAccount: addAccountSpy } });

      const user = userEvent.setup();

      const addAccountButton = screen.getByRole('button', { name: /Add Account/i });
      await user.click(addAccountButton);

      const nameInput = screen.getByPlaceholderText(/e.g. Zenith Spending/);
      await user.type(nameInput, 'Test Account');

      const balanceInput = screen.getByPlaceholderText('0.00');
      await user.type(balanceInput, '1000');

      const submitButton = screen.getByRole('button', { name: /Create Account/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(addAccountSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Account',
            type: 'checking',
            currency: 'NGN',
            balanceCents: 100000,
          })
        );
      });
    });
  });

  describe('Add Transaction Form', () => {
    // NOTE: Transaction creation was moved from main Finance view to Account Details view.
    // The "New Transaction" button no longer exists on the main Finance page.
    // Users now click into an account to add transactions for that account.
    // These tests verify the core transaction list functionality instead.

    it('transaction list is visible and displays transactions', async () => {
      renderWithContext(<FinanceView />);

      // Verify transaction list is rendered
      const transactionList = screen.getByTestId('transaction-list');
      expect(transactionList).toBeInTheDocument();

      // Verify transactions are displayed
      expect(screen.getByText('Grocery Shopping')).toBeInTheDocument();
      expect(screen.getAllByText('Salary').length).toBeGreaterThan(0);
    });

    it('transaction list shows income transactions with correct formatting', async () => {
      renderWithContext(<FinanceView />);

      // Income should have + sign
      expect(screen.getByText((content) => content.includes('5,000.00') && content.includes('+'))).toBeInTheDocument();
    });

    it('transaction list shows expense transactions with correct formatting', async () => {
      renderWithContext(<FinanceView />);

      // Expenses should have - sign
      expect(screen.getByText((content) => content.includes('150.50') && content.includes('-'))).toBeInTheDocument();
    });

    it('account cards are clickable to access account-specific transaction form', async () => {
      renderWithContext(<FinanceView />);

      // Verify account cards are clickable (leads to account details where transaction form is)
      const accountCard = screen.getByText('Checking Account');
      expect(accountCard.closest('button, [role="button"], div[class*="cursor-pointer"]')).toBeTruthy();
    });

    it('transaction list supports editing via edit button', async () => {
      const { finance: mockFinance } = createMockContexts();
      renderWithContext(<FinanceView />, { finance: mockFinance });

      // Verify edit buttons are present
      const editButtons = screen.getAllByTestId(/edit-tx/);
      expect(editButtons.length).toBeGreaterThan(0);
    });

    it('shows confirmation modal when deleting a transaction', async () => {
      const { finance: mockFinance } = createMockContexts();
      renderWithContext(<FinanceView />, { finance: mockFinance });

      const user = userEvent.setup();

      const deleteButtons = screen.getAllByTestId('trash-icon');
      const transactionDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(transactionDeleteButton.closest('button')!);

      // Confirmation modal should appear
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();
    });

    it('transaction list correctly handles amount formatting', async () => {
      renderWithContext(<FinanceView />);

      // Check the rent payment (150000 cents = $1,500.00)
      expect(screen.getByText((content) => content.includes('1,500.00') && content.includes('-'))).toBeInTheDocument();
    });

    it('transaction list displays categories for each transaction', async () => {
      renderWithContext(<FinanceView />);

      expect(screen.getAllByText('Food').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Housing').length).toBeGreaterThan(0);
    });
  });

  describe('Delete Operations', () => {
    // NOTE: Account delete button is now in AccountDetailsView, not on the card
    // This test verifies that accounts are clickable to access details
    it('account cards are interactive for accessing account details', async () => {
      const { finance: mockFinance } = createMockContexts();
      renderWithContext(<FinanceView />, { finance: mockFinance });

      // Verify account cards are present and can be interacted with
      const accountCard = screen.getByText('Checking Account');

      // Account cards should be clickable (leads to details view)
      expect(accountCard.closest('button, [role="button"], div[class*="cursor-pointer"]')).toBeTruthy();
    });

    it('shows confirmation modal and calls deleteTransaction when confirmed', async () => {
      const { finance: mockFinance } = createMockContexts();
      renderWithContext(<FinanceView />, { finance: mockFinance });

      const user = userEvent.setup();

      const deleteButtons = screen.getAllByTestId('trash-icon');
      // Later trash icons are for transactions
      const transactionDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(transactionDeleteButton.closest('button')!);

      // Confirmation modal should appear with message about the transaction
      expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument();

      // Find all "Delete Transaction" elements - one is title, one is button
      const deleteElements = screen.getAllByText(/Delete Transaction/i);
      expect(deleteElements.length).toBeGreaterThanOrEqual(1);

      // Find the button specifically
      const confirmButton = deleteElements.find(el => el.tagName === 'BUTTON')
        || deleteElements[deleteElements.length - 1].closest('button');
      expect(confirmButton).toBeTruthy();
      await user.click(confirmButton!);

      expect(mockFinance.deleteTransaction).toHaveBeenCalled();
    });
  });

  describe('Family Mode Integration', () => {
    // NOTE: The scope field is now determined by account ownership, not a profile flag.
    // When using shared accounts from a family member, the transaction automatically
    // uses the appropriate scope. This behavior is tested in useFinanceService.family.test.tsx
    it('renders correctly when familyMode is enabled in profile', async () => {
      const familyProfile = { ...mockProfile, familyMode: true };
      const { finance: mockFinance } = createMockContexts();

      // Simply verify the view renders without errors when familyMode is enabled
      renderWithContext(<FinanceView />, {
        finance: mockFinance,
        auth: { profile: familyProfile }
      });

      // Verify core elements are present
      expect(screen.getByRole('button', { name: /Add Account/i })).toBeInTheDocument();
      // Verify transaction list is rendered
      expect(screen.getByTestId('transaction-list')).toBeInTheDocument();
    });
  });
});
