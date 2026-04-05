/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
    Search: () => <div data-testid="search-icon">Search</div>,
    Layers: () => <div data-testid="layers-icon">Layers</div>,
    List: () => <div data-testid="list-icon">List</div>,
  };
});

// Mock new wallet-style components
vi.mock('../../components/finance/CardStack', () => ({
  CardStack: ({ accounts, mode, onCardTap }: any) => (
    <div data-testid="card-stack" data-mode={mode}>
      {accounts.map((acc: any, i: number) => (
        <button key={acc.id} data-testid={`account-card-${acc.id}`} onClick={() => onCardTap(acc, i, document.createElement('div'))}>
          <span>{acc.name}</span>
          <span>{acc.balanceCents}</span>
          <span>{acc.type}</span>
        </button>
      ))}
    </div>
  ),
}));

vi.mock('../../components/finance/TotalAssetsSummaryBar', () => ({
  TotalAssetsSummaryBar: ({ accounts }: any) => (
    <div data-testid="total-assets-bar">Total: {accounts.length} accounts</div>
  ),
}));

vi.mock('../../components/finance/SkeletonCards', () => ({
  SkeletonCards: ({ count }: any) => (
    <div data-testid="skeleton-cards">Loading {count} cards...</div>
  ),
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
    localStorage.clear();
  });

  describe('3-Zone Layout', () => {
    it('renders page header with Finance title', () => {
      renderWithContext(<FinanceView />);
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });

    it('renders search icon and view toggle buttons', () => {
      renderWithContext(<FinanceView />);
      expect(screen.getByLabelText('Search transactions')).toBeInTheDocument();
      expect(screen.getByLabelText(/Switch to/)).toBeInTheDocument();
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

  describe('View Mode Toggle', () => {
    it('toggles between collapsed and expanded mode', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      const stack = screen.getByTestId('card-stack');
      expect(stack).toHaveAttribute('data-mode', 'collapsed');

      await user.click(screen.getByLabelText(/Switch to list view/));
      expect(screen.getByTestId('card-stack')).toHaveAttribute('data-mode', 'expanded');

      await user.click(screen.getByLabelText(/Switch to stack view/));
      expect(screen.getByTestId('card-stack')).toHaveAttribute('data-mode', 'collapsed');
    });

    it('persists view mode to localStorage', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      await user.click(screen.getByLabelText(/Switch to list view/));
      expect(localStorage.getItem('anchor_finance_view_mode')).toBe('expanded');
    });

    it('restores view mode from localStorage', () => {
      localStorage.setItem('anchor_finance_view_mode', 'expanded');
      renderWithContext(<FinanceView />);
      expect(screen.getByTestId('card-stack')).toHaveAttribute('data-mode', 'expanded');
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
  });

  describe('Account Selection', () => {
    it('navigates to account details when a card is tapped', async () => {
      renderWithContext(<FinanceView />);
      const user = userEvent.setup();

      await user.click(screen.getByTestId('account-card-acc-1'));
      // AccountDetailsContainer should be rendered (it's mocked via the component)
      await waitFor(() => {
        expect(screen.queryByTestId('card-stack')).not.toBeInTheDocument();
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
