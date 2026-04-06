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

const mockLogProductEvent = vi.fn();
const mockHapticSelection = vi.fn();

vi.mock('../../services/telemetry', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../services/telemetry')>();
  return {
    ...actual,
    logProductEvent: (...args: unknown[]) => mockLogProductEvent(...args),
  };
});

vi.mock('../../utils/haptic', () => ({
  haptic: {
    selection: () => mockHapticSelection(),
    lift: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
    Plus: () => <div data-testid="plus-icon">+</div>,
  };
});

// Mock useResponsive to simulate mobile viewport (wallet stack tests)
vi.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    breakpoint: 'mobile' as const,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isTouchDevice: true,
  }),
}));

// Mock new wallet-style components
vi.mock('../../components/finance/CardStack', () => ({
  CardStack: ({ accounts, mode, onCardTap, onReorder, onShowAll }: any) => (
    <div data-testid="card-stack" data-mode={mode}>
      {accounts.map((acc: any, i: number) => (
        <button key={acc.id} data-testid={`account-card-${acc.id}`} onClick={() => onCardTap(acc, i, document.createElement('div'))}>
          <span>{acc.name}</span>
          <span>{acc.balanceCents}</span>
          <span>{acc.type}</span>
        </button>
      ))}
      <button type="button" data-testid="trigger-reorder" onClick={() => onReorder?.([accounts[1], accounts[0], ...accounts.slice(2)])}>
        Reorder
      </button>
      {onShowAll ? (
        <button type="button" data-testid="trigger-show-all" onClick={() => onShowAll()}>
          Show all
        </button>
      ) : null}
    </div>
  ),
}));

vi.mock('../../components/finance/TotalAssetsSummaryBar', () => ({
  TotalAssetsSummaryBar: ({ accounts, onShowDetails }: any) => (
    <div data-testid="total-assets-bar">
      <span>Total: {accounts.length} accounts</span>
      <button type="button" onClick={() => onShowDetails?.()}>Show Details</button>
    </div>
  ),
}));

vi.mock('../../components/finance/SkeletonCards', () => ({
  SkeletonCards: ({ count }: any) => (
    <div data-testid="skeleton-cards">Loading {count} cards...</div>
  ),
}));

vi.mock('./components/AccountDetailsContainer', () => ({
  AccountDetailsContainer: ({ account, onBack }: any) => (
    <div data-testid="account-details-container">
      <span>{account.name}</span>
      <button type="button" onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock('./components/VirtualTransactionList', () => ({
  VirtualTransactionList: ({ transactions }: any) => (
    <div data-testid="global-transaction-list">
      {transactions.map((tx: any) => (
        <div key={tx.id} data-testid={`tx-${tx.id}`}>{tx.title}</div>
      ))}
    </div>
  ),
}));

vi.mock('./components/TransactionHistorySection', () => ({
  TransactionHistorySection: ({ transactions, onEdit, onDelete }: any) => (
    <div data-testid="transaction-history-section">
      <div data-testid="global-transaction-list">
        {transactions.map((tx: any) => (
          <div key={tx.id} data-testid={`tx-${tx.id}`}>{tx.title}</div>
        ))}
      </div>
    </div>
  ),
}));

vi.mock('./components/FinanceBillsSection', () => ({
  FinanceBillsSection: () => null,
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

const renderWithContext = (
  ui: React.ReactElement,
  {
    finance = {},
    app = {},
    auth = {},
    family = {},
    initialEntries = ['/finance'],
  }: {
    finance?: Record<string, unknown>;
    app?: Record<string, unknown>;
    auth?: Record<string, unknown>;
    family?: Record<string, unknown>;
    initialEntries?: string[];
  } = {}
) => {
  const { finance: mockFinance, app: mockApp, auth: mockAuth, family: mockFamily, notifications: mockNotifications } = createMockContexts(finance, app, auth, family);
  return render(
    <MemoryRouter initialEntries={initialEntries}>
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
    localStorage.clear();
    delete (document as Document & { startViewTransition?: unknown }).startViewTransition;
  });

  describe('3-Zone Layout', () => {
    it('renders page header with Finance title', () => {
      renderWithContext(<FinanceView />);
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });

    it('renders create account button', () => {
      renderWithContext(<FinanceView />);
      expect(screen.getByLabelText('Create account')).toBeInTheDocument();
    });

    it('renders TotalAssetsSummaryBar with active accounts', () => {
      renderWithContext(<FinanceView />);
      expect(screen.getByTestId('total-assets-bar')).toBeInTheDocument();
      expect(screen.getByText('Total: 3 accounts')).toBeInTheDocument();
    });

    it('renders CardStack with active accounts in collapsed mode by default', () => {
      renderWithContext(<FinanceView />);
      const stack = screen.getByTestId('card-stack');
      expect(stack).toBeInTheDocument();
      expect(stack).toHaveAttribute('data-mode', 'collapsed');
    });

    it('filters out archived accounts from the card stack', () => {
      const archivedAccounts = [
        ...mockAccounts,
        { id: 'acc-archived', name: 'Old Account', type: 'checking', currency: 'USD', balanceCents: 100, color: '', scope: 'personal', ownerId: 'test-user', isArchived: true },
      ];
      renderWithContext(<FinanceView />, { finance: { accounts: archivedAccounts } });
      expect(screen.queryByTestId('account-card-acc-archived')).not.toBeInTheDocument();
    });
  });

  describe('View Mode', () => {
    it('restores view mode from localStorage', () => {
      localStorage.setItem('anchor_finance_view_mode', 'expanded');
      renderWithContext(<FinanceView />);
      expect(screen.getByTestId('card-stack')).toHaveAttribute('data-mode', 'expanded');
    });
  });

  describe('Reorder Analytics', () => {
    it('logs a finance card reordered analytics event', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId('trigger-reorder'));

      expect(mockLogProductEvent).toHaveBeenCalledWith('finance_card_reordered', {
        accountId: 'acc-2',
        fromIndex: 1,
        toIndex: 0,
      });
    });
  });

  describe('Account Rendering', () => {
    it('renders all accounts in the card stack', () => {
      renderWithContext(<FinanceView />);

      expect(screen.getByTestId('account-card-acc-1')).toBeInTheDocument();
      expect(screen.getByTestId('account-card-acc-2')).toBeInTheDocument();
      expect(screen.getByTestId('account-card-acc-3')).toBeInTheDocument();
    });

    it('displays account names', () => {
      renderWithContext(<FinanceView />);
      expect(screen.getAllByText('Checking Account').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Savings Account').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Naira Account').length).toBeGreaterThan(0);
    });

    it('displays account type badges', () => {
      renderWithContext(<FinanceView />);
      const checkingBadges = screen.getAllByText('checking');
      expect(checkingBadges).toHaveLength(2);
      expect(screen.getByText('savings')).toBeInTheDocument();
    });

    it('shows empty state when no accounts exist', () => {
      renderWithContext(<FinanceView />, { finance: { accounts: [] } });
      expect(screen.getByText('No accounts yet')).toBeInTheDocument();
    });

    it('shows skeleton cards while loading with no accounts', () => {
      renderWithContext(<FinanceView />, { finance: { accounts: [], loadingFinance: true } });
      expect(screen.getByTestId('skeleton-cards')).toBeInTheDocument();
    });

    it('navigates to the all accounts route when the overflow action is used', async () => {
      const extraAccounts = Array.from({ length: 11 }, (_, index) => ({
        ...mockAccounts[index % mockAccounts.length],
        id: `acc-extra-${index}`,
        name: `Extra Account ${index + 1}`,
      }));
      renderWithContext(<FinanceView />, { finance: { accounts: extraAccounts } });
      const user = userEvent.setup();

      await user.click(screen.getByTestId('trigger-show-all'));

      expect(screen.getByText('All Accounts')).toBeInTheDocument();
      expect(screen.getByText('Extra Account 1')).toBeInTheDocument();
    });

    it('opens account creation from the all accounts route', async () => {
      const extraAccounts = Array.from({ length: 11 }, (_, index) => ({
        ...mockAccounts[index % mockAccounts.length],
        id: `acc-extra-${index}`,
        name: `Extra Account ${index + 1}`,
      }));
      renderWithContext(<FinanceView />, { finance: { accounts: extraAccounts } });
      const user = userEvent.setup();

      await user.click(screen.getByTestId('trigger-show-all'));
      await user.click(screen.getByRole('button', { name: /new account/i }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    });
  });

  describe('Account Selection', () => {
    it('uses the browser view transition API when opening account details', async () => {
      const startViewTransition = vi.fn((callback: () => void) => {
        callback();
        return {
          finished: Promise.resolve(),
          ready: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
          skipTransition: vi.fn(),
        };
      });
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: startViewTransition,
      });

      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId('account-card-acc-1'));

      await waitFor(() => {
        expect(startViewTransition).toHaveBeenCalled();
      });
    });

    it('navigates to account details when a card is tapped', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId('account-card-acc-1'));
      await waitFor(() => {
        expect(screen.queryByTestId('card-stack')).not.toBeInTheDocument();
      });
    });

    it('logs a finance card tapped analytics event', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId('account-card-acc-1'));

      await waitFor(() => {
        expect(mockLogProductEvent).toHaveBeenCalledWith('finance_card_tapped', {
          accountId: 'acc-1',
          viewMode: 'collapsed',
        });
      });
    });

    it('renders account details when deep-linked to a finance account route', async () => {
      renderWithContext(<FinanceView />, { initialEntries: ['/finance/account/acc-1'] });

      await waitFor(() => {
        expect(screen.queryByTestId('card-stack')).not.toBeInTheDocument();
      });
      expect(screen.getAllByText('Checking Account').length).toBeGreaterThan(0);
    });

    it('uses the browser view transition API when closing account details', async () => {
      const startViewTransition = vi.fn((callback: () => void) => {
        callback();
        return {
          finished: Promise.resolve(),
          ready: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
          skipTransition: vi.fn(),
        };
      });
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: startViewTransition,
      });

      renderWithContext(<FinanceView />, { initialEntries: ['/finance/account/acc-1'] });
      const user = userEvent.setup();

      await user.click(screen.getByRole('button', { name: /back/i }));

      await waitFor(() => {
        expect(startViewTransition).toHaveBeenCalled();
      });
    });
  });

  describe('Add Account Form', () => {
    it('shows empty state create action when no accounts exist', async () => {
      renderWithContext(<FinanceView />, { finance: { accounts: [] } });
      expect(screen.getByText('No accounts yet')).toBeInTheDocument();
    });
  });

  describe('Family Mode Integration', () => {
    it('renders correctly when familyMode is enabled in profile', () => {
      const familyProfile = { ...mockProfile, familyMode: true };
      renderWithContext(<FinanceView />, {
        finance: {},
        auth: { profile: familyProfile }
      });

      expect(screen.getByText('Finance')).toBeInTheDocument();
      expect(screen.getByTestId('card-stack')).toBeInTheDocument();
    });
  });
});
