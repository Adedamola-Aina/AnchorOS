/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    <AuthContext.Provider value={mockAuth as any}>
      
        <AppContext.Provider value={mockApp as any}>
          <FinanceContext.Provider value={mockFinance as any}>
            <NotificationContext.Provider value={mockNotifications as any}>
              {ui}
            </NotificationContext.Provider>
          </FinanceContext.Provider>
        </AppContext.Provider>
      
    </AuthContext.Provider>
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

      // USD accounts should show $
      expect(screen.getAllByText(/\$5,000\.00/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$10,000\.00/).length).toBeGreaterThan(0);

      // NGN account should show ₦
      expect(screen.getAllByText(/₦500,000\.00/).length).toBeGreaterThan(0);
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
    it('shows add transaction form when "New Transaction" button is clicked', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      expect(screen.getAllByText('New Transaction')).not.toHaveLength(0);
    });

    it('shows error message when no accounts exist', async () => {
      renderWithContext(<FinanceView />, { finance: { accounts: [] } });
      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      expect(screen.getByText('Please create an account first.')).toBeInTheDocument();
    });

    it('allows selecting account for transaction', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      const accountButtons = screen.getAllByRole('button', { name: /Checking Account|Savings Account|Naira Account/ });
      expect(accountButtons.length).toBeGreaterThan(0);
    });

    it('toggles between expense and income types', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      const expenseButton = screen.getByRole('button', { name: /^Expense$/i });
      const incomeButton = screen.getByRole('button', { name: /^Income$/i });

      expect(expenseButton).toBeInTheDocument();
      expect(incomeButton).toBeInTheDocument();

      await user.click(incomeButton);
      // Income button should now be active (visual indication)

      await user.click(expenseButton);
      // Expense button should be active again
    });

    it('calls addTransaction with correct data when form is submitted', async () => {
      const { finance: mockFinance } = createMockContexts();

      renderWithContext(<FinanceView />, { finance: mockFinance });

      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      // Fill in transaction details
      const descInput = screen.getByPlaceholderText(/e.g. Groceries/);
      await user.type(descInput, 'Test Expense');

      const amountInput = screen.getByPlaceholderText('0.00');
      await user.type(amountInput, '250.75');

      const submitButton = screen.getByRole('button', { name: /Record Transaction/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFinance.addTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Expense',
            amountCents: 25075,
            type: 'expense',
          })
        );
      });
    });

    it('rejects transaction description with XSS payload', async () => {
      const { finance: mockFinance } = createMockContexts();
      renderWithContext(<FinanceView />, { finance: mockFinance });
      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      const descInput = screen.getByPlaceholderText(/e.g. Groceries/);
      await user.type(descInput, '<script>alert("xss")</script>');

      const amountInput = screen.getByPlaceholderText('0.00');
      await user.type(amountInput, '100');

      const submitButton = screen.getByRole('button', { name: /Record Transaction/i });
      await user.click(submitButton);

      // Should show validation error and NOT call addTransaction
      await waitFor(() => {
        expect(screen.getByText(/contains invalid content/i)).toBeInTheDocument();
        expect(mockFinance.addTransaction).not.toHaveBeenCalled();
      });
    });

    it('uses standard font scale for Amount field (no hero sizing)', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      const amountInput = screen.getByPlaceholderText('0.00');
      // Verify it DOES NOT have text-3xl or h-14
      expect(amountInput).not.toHaveClass('text-3xl');
      expect(amountInput).not.toHaveClass('h-14');
      // Verify it has the standard font-bold we added
      expect(amountInput).toHaveClass('font-bold');
    });
  });

  describe('Delete Operations', () => {
    it('calls deleteAccount when delete account button is clicked', async () => {
      const { finance: mockFinance } = createMockContexts();
      renderWithContext(<FinanceView />, { finance: mockFinance });

      const user = userEvent.setup();

      const deleteButtons = screen.getAllByTestId('trash-icon');
      // First few trash icons are for accounts
      const firstAccountDelete = deleteButtons[0];
      await user.click(firstAccountDelete.closest('button')!);

      // Should show confirmation modal
      const confirmButton = screen.getByRole('button', { name: /Delete/i });
      await user.click(confirmButton);

      expect(mockFinance.deleteAccount).toHaveBeenCalled();
    });

    it('calls deleteTransaction when delete transaction button is clicked', async () => {
      const { finance: mockFinance } = createMockContexts();
      renderWithContext(<FinanceView />, { finance: mockFinance });

      const user = userEvent.setup();

      const deleteButtons = screen.getAllByTestId('trash-icon');
      // Later trash icons are for transactions
      const transactionDeleteButton = deleteButtons[deleteButtons.length - 1];
      await user.click(transactionDeleteButton.closest('button')!);

      expect(mockFinance.deleteTransaction).toHaveBeenCalled();
    });
  });

  describe('Family Mode Integration', () => {
    it('uses family scope when familyMode is enabled', async () => {
      const familyProfile = { ...mockProfile, familyMode: true };
      const { finance: mockFinance } = createMockContexts();

      // Pass auth overrides to mock the user profile correctly
      renderWithContext(<FinanceView />, {
        finance: mockFinance,
        auth: { profile: familyProfile }
      });

      const user = userEvent.setup();

      const addTxButton = screen.getByRole('button', { name: /New Transaction/i });
      await user.click(addTxButton);

      const descInput = screen.getByPlaceholderText(/e.g. Groceries/);
      await user.type(descInput, 'Family Expense');

      const amountInput = screen.getByPlaceholderText('0.00');
      await user.type(amountInput, '100');

      const submitButton = screen.getByRole('button', { name: /Record Transaction/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFinance.addTransaction).toHaveBeenCalledWith(
          expect.objectContaining({
            scope: 'family',
          })
        );
      });
    });
  });
});
