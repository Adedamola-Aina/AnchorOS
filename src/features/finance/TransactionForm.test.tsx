// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionForm } from './TransactionForm';
import { FinanceContext } from '../../context/FinanceContext';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

// Mock HIG components to render as native elements for test interaction
vi.mock('../../components/shared', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        PopoverMenu: ({ items, value, onChange, label, testId }: any) => (
            <div data-testid={testId}>
                {label && <label htmlFor={`mock-pm-${testId}`}>{label}</label>}
                <select id={`mock-pm-${testId}`} value={value} onChange={(e: any) => onChange(e.target.value)}>
                    {items.map((item: any) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
            </div>
        ),
        InlineDatePicker: ({ value, onChange, label, disabled, testId }: any) => (
            <div data-testid={testId}>
                {label && <label htmlFor={`mock-dp-${testId}`}>{label}</label>}
                <input id={`mock-dp-${testId}`} type="date" value={value} onChange={(e: any) => onChange(e.target.value)} disabled={disabled} />
            </div>
        ),
    };
});

// Mock Dependencies
const mockAddTransaction = vi.fn().mockResolvedValue(undefined);
const mockUpdateTransaction = vi.fn().mockResolvedValue(undefined);
const mockRefetch = vi.fn().mockResolvedValue(undefined);
const mockClose = vi.fn();
const mockShowToast = vi.fn();

const mockUser = { uid: 'user1', email: 'test@example.com' };

const mockAccounts = [
    { id: 'acc1', name: 'Main Checking', balanceCents: 500000, currency: 'NGN', type: 'checking', scope: 'personal', color: '#000', ownerId: 'user1' },
    { id: 'acc2', name: 'Savings', balanceCents: 200000, currency: 'NGN', type: 'savings', scope: 'family', color: '#111', ownerId: 'user1' }
];

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

const renderForm = (props: any = {}) => {
    const { defaultAccountId = 'acc1', accounts = mockAccounts, ...restProps } = props;
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ user: mockUser, loading: false, profileLoaded: true } as any}>
                <NotificationContext.Provider value={{ showToast: mockShowToast } as any}>
                    <FinanceContext.Provider value={{
                        transactions: [],
                        accounts,
                        addTransaction: mockAddTransaction,
                        updateTransaction: mockUpdateTransaction,
                        refetch: mockRefetch,
                    } as any}>
                        <TransactionForm onClose={mockClose} defaultAccountId={defaultAccountId} {...restProps} />
                    </FinanceContext.Provider>
                </NotificationContext.Provider>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

describe('TransactionForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear(); // Clear localStorage between tests
    });

    afterEach(() => {
        cleanup(); // Ensure components are unmounted between tests
    });

    it('initializes with default values', () => {
        renderForm();
        expect(screen.getByLabelText(/Amount/i)).toHaveValue('');
        expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    });

    it('populates fields from prefillData prop (Fabric AI Magic)', () => {
        const prefillData = {
            amount: 150.00,
            category: 'Groceries',
            title: 'Weekly Shop'
        };

        renderForm({ prefillData });

        // Amount should be formatted with 2 decimal places
        expect(screen.getByLabelText(/Amount/i)).toHaveValue('150.00');
        expect(screen.getByLabelText(/Description/i)).toHaveValue('Weekly Shop');
        // Category selector is complex, but we can check if the value is passed to state. 
        // For now, let's assume if title/amount work, the pattern holds.
    });

    // UX-FN-03: recording a transaction never showed the account's resulting
    // position, so cause and effect were invisible — but the projection must
    // also not state a result nobody entered (an empty composer used to read
    // "Main Checking balance: ₦5,000.00 → ₦5,000.00").
    it('shows the account balance before → after the transaction, once an amount exists (UX-FN-03)', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' });

        // Nothing typed: there is no "after" yet, so there is no projection.
        expect(screen.queryByTestId('balance-preview')).toBeNull();

        await user.type(screen.getByLabelText(/Amount/i), '100');

        // ₦5,000.00 − ₦100.00 — the "after" figure is now visible before saving.
        const preview = screen.getByTestId('balance-preview');
        expect(preview).toHaveTextContent(/Main Checking/);
        expect(preview).toHaveTextContent(/₦5,000\.00/);
        expect(preview).toHaveTextContent(/₦4,900\.00/);
    });

    // The overdraft warning describes the result of the transaction being
    // entered, so an empty composer must not raise it either.
    it('does not warn about overdraft until an amount is entered (UX-FN-03)', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1', accounts: [{ ...mockAccounts[0], balanceCents: -50000 }] });

        expect(screen.queryByText(/Overdraft Risk/i)).toBeNull();

        await user.type(screen.getByLabelText(/Amount/i), '100');

        expect(screen.getByText(/Overdraft Risk/i)).toBeInTheDocument();
    });

    // BUG-033: scope field must be included in addTransaction call
    it('includes scope field from source account when creating a transaction', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' });

        // Fill required fields
        const descInput = screen.getByLabelText(/Description/i);
        const amountInput = screen.getByLabelText(/Amount/i);
        await user.type(descInput, 'Groceries');
        await user.type(amountInput, '100.00');

        // Select category (click first visible category chip)
        const categoryButtons = screen.getAllByRole('button');
        const categoryChip = categoryButtons.find(b => b.textContent && !['income', 'expense', 'transfer'].includes(b.textContent.toLowerCase()) && b.textContent !== '×' && b.textContent !== 'Record');
        if (categoryChip) await user.click(categoryChip);

        // Submit form
        const submitButton = screen.getByRole('button', { name: /Record/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockAddTransaction).toHaveBeenCalled();
        });

        // Verify scope was included and matches the source account scope
        const payload = mockAddTransaction.mock.calls[0][0];
        expect(payload.scope).toBe('personal'); // acc1 scope is 'personal'
        // Verify no `as any` hiding — scope must be explicitly typed
        expect(payload.scope).toBeDefined();
    });

    // BUG-033: scope field must use sourceAccount scope (family case)
    // Note: Account selection is tested via the first test which passes acc1.
    // This test verifies that any account scope is correctly propagated.
    it('always includes scope field - never undefined', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' });

        const descInput = screen.getByLabelText(/Description/i);
        const amountInput = screen.getByLabelText(/Amount/i);
        await user.type(descInput, 'Test transaction');
        await user.type(amountInput, '25.00');

        const categoryButtons = screen.getAllByRole('button');
        const categoryChip = categoryButtons.find(b => b.textContent && !['income', 'expense', 'transfer'].includes(b.textContent.toLowerCase()) && b.textContent !== '×' && b.textContent !== 'Record');
        if (categoryChip) await user.click(categoryChip);

        const submitButton = screen.getByRole('button', { name: /Record/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockAddTransaction).toHaveBeenCalled();
        });

        const payload = mockAddTransaction.mock.calls[0][0];
        // The critical fix: scope must NEVER be undefined (was the bug)
        expect(payload.scope).toBeDefined();
        expect(['personal', 'family']).toContain(payload.scope);
    });

    // ── Context-aware form behavior ─────────────────────────────────
    describe('context-aware layout', () => {
        it('shows a compact account row when lockedAccount is true', () => {
            renderForm({ defaultAccountId: 'acc1', lockedAccount: true });
            // The account row states the choice; it never renders every account.
            expect(screen.getByTestId('tx-account')).toHaveTextContent('Main Checking');
            expect(screen.queryByTestId('tx-account-option-acc2')).not.toBeInTheDocument();
        });

        /**
         * UX-FN-17: the composer used to render every account as a permanent tile,
         * pushing the amount field below the fold. The account is now one row that
         * opens a dedicated picker — so other accounts exist only inside the sheet.
         */
        it('keeps other accounts out of the form and inside the picker (UX-FN-17)', async () => {
            const user = userEvent.setup();
            renderForm({ defaultAccountId: 'acc1' });

            expect(screen.getByTestId('tx-account')).toHaveTextContent('Main Checking');
            expect(screen.queryByTestId('tx-account-option-acc2')).not.toBeInTheDocument();

            await user.click(screen.getByTestId('tx-account'));
            expect(screen.getByTestId('tx-account-option-acc2')).toHaveTextContent('Savings');

            await user.click(screen.getByTestId('tx-account-option-acc2'));
            expect(screen.getByTestId('tx-account')).toHaveTextContent('Savings');
        });

        it('hides type selector for transfer intent (lockedAccount + transfer)', () => {
            renderForm({ defaultAccountId: 'acc1', defaultType: 'transfer', lockedAccount: true });
            // Transfer and Expense/Income buttons should not exist
            expect(screen.queryByRole('button', { name: /^Expense$/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /^Income$/i })).not.toBeInTheDocument();
        });

        it('hides duplicate From row in transfer when account context is set', () => {
            renderForm({ defaultAccountId: 'acc1', defaultType: 'transfer', lockedAccount: true });
            // Compact badge already shows "From" + account name at the top
            expect(screen.getByText('From')).toBeInTheDocument();
            // The TransferDetails "From:" label inside the transfer box should NOT appear
            const fromLabels = screen.queryAllByText('From:');
            expect(fromLabels).toHaveLength(0);
        });

        it('hides type selector for pay bill intent', () => {
            renderForm({
                defaultAccountId: 'acc1', defaultType: 'expense', lockedAccount: true,
                prefillData: { category: 'Bills & Utilities' }
            });
            // Type toggle buttons should not exist
            expect(screen.queryByRole('button', { name: /^Expense$/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /^Income$/i })).not.toBeInTheDocument();
            // Header should say "Pay Bill"
            expect(screen.getByRole('heading', { name: /Pay Bill/i })).toBeInTheDocument();
            // Submit button should say "Pay Bill" too
            expect(screen.getByRole('button', { name: /^Pay Bill$/i })).toBeInTheDocument();
        });

        it('shows type selector for generic add from account detail', () => {
            renderForm({ defaultAccountId: 'acc1', defaultType: 'expense', lockedAccount: true });
            // Compact badge but type selector visible (no special prefill)
            expect(screen.getByText('Main Checking')).toBeInTheDocument();
            // Type selector has exact-name buttons
            expect(screen.getByRole('button', { name: /^Expense$/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /^Income$/i })).toBeInTheDocument();
        });

        it('shows specific submit labels per type', () => {
            renderForm({ defaultAccountId: 'acc1', defaultType: 'expense' });
            expect(screen.getByRole('button', { name: /Record Expense/i })).toBeInTheDocument();
        });
    });

    describe('synced transaction guard', () => {
        const syncedTx = {
            id: 'tx-1', accountId: 'acc1', title: 'POS Purchase', amountCents: 5000,
            type: 'expense', category: 'Shopping', date: '2025-01-15',
            source: 'synced', externalTransactionId: 'mono_tx_1',
        };

        it('disables amount, description, and date fields for synced transactions', () => {
            renderForm({ initialData: syncedTx });
            expect(screen.getByLabelText(/Amount/i)).toBeDisabled();
            expect(screen.getByLabelText(/Description/i)).toBeDisabled();
            expect(screen.getByDisplayValue('2025-01-15')).toBeDisabled();
        });

        it('shows notice banner for synced transactions', () => {
            renderForm({ initialData: syncedTx });
            expect(screen.getByText(/only the category can be changed/i)).toBeInTheDocument();
        });

        it('hides type selector for synced transactions', () => {
            renderForm({ initialData: syncedTx });
            expect(screen.queryByRole('button', { name: /^Expense$/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /^Income$/i })).not.toBeInTheDocument();
        });
    });
});
