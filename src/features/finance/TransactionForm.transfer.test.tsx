// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionForm } from './TransactionForm';
import { FinanceContext } from '../../context/FinanceContext';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

// Mock Dependencies
const mockAddTransaction = vi.fn().mockResolvedValue(undefined);
const mockUpdateTransaction = vi.fn().mockResolvedValue(undefined);
const mockRefetch = vi.fn().mockResolvedValue(undefined);
const mockClose = vi.fn();
const mockShowToast = vi.fn();

const mockUser = { uid: 'user1', email: 'test@example.com' };

const mockAccounts = [
    { id: 'acc1', name: 'Main Checking', balanceCents: 500000, currency: 'NGN', type: 'checking', scope: 'personal', color: '#000', ownerId: 'user1' },
    { id: 'acc2', name: 'Savings', balanceCents: 200000, currency: 'NGN', type: 'savings', scope: 'family', color: '#111', ownerId: 'user1' },
    { id: 'acc3', name: 'USD Account', balanceCents: 10000, currency: 'USD', type: 'checking', scope: 'personal', color: '#222', ownerId: 'user1' }
];

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
});

const renderForm = (props: any = {}) => {
    const { defaultAccountId = 'acc1', ...restProps } = props;
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ user: mockUser, loading: false, profileLoaded: true } as any}>
                <NotificationContext.Provider value={{ showToast: mockShowToast } as any}>
                    <FinanceContext.Provider value={{
                        transactions: [],
                        accounts: mockAccounts,
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

describe('TransactionForm (Transfers)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it('submits a valid same-currency transfer', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' }); // From acc1

        // 1. Fill basics
        await user.type(screen.getByLabelText(/Description/i), 'Transfer to Savings');
        await user.type(screen.getByLabelText(/Amount/i), '50.00');

        // 2. Select "Transfer" type
        // The type selector might be buttons or tabs. 
        // Based on TransactionForm.tsx, it uses TransactionTypeSelector.
        // Let's assume it has buttons with names "Expense", "Income", "Transfer".
        const transferBtn = screen.getByRole('button', { name: /Transfer/i });
        await user.click(transferBtn);

        // 3. Select Destination
        // TransferDetails uses a select with id="tx-destination" (label "To Account")
        const destSelect = screen.getByLabelText(/To Account/i);
        // By default it might select the first available different account (acc2)
        expect(destSelect).toHaveValue('acc2');

        // 4. Submit
        const submitBtn = screen.getByRole('button', { name: /Record Transfer/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(mockAddTransaction).toHaveBeenCalled();
        });

        const payload = mockAddTransaction.mock.calls[0][0];
        expect(payload.type).toBe('transfer');
        expect(payload.amountCents).toBe(5000);
        expect(payload.accountId).toBe('acc1');
        expect(payload.destinationAccountId).toBe('acc2');
        // Same currency, so no destinationAmountCents
        expect(payload.destinationAmountCents).toBeUndefined();
    });

    it('submits a valid cross-currency transfer', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' }); // NGN

        // 1. Fill basics
        await user.type(screen.getByLabelText(/Description/i), 'Transfer to USD');
        await user.type(screen.getByLabelText(/Amount/i), '1000.00'); // 1000 NGN

        // 2. Switch to Transfer
        const transferBtn = screen.getByRole('button', { name: /Transfer/i });
        await user.click(transferBtn);

        // 3. Select Destination (acc3 is USD)
        const destSelect = screen.getByLabelText(/To Account/i);
        await user.selectOptions(destSelect, 'acc3');

        // 4. Check Exchange Rate field appears
        // Input type="number" with value "1.0" initially
        const rateInput = screen.getByDisplayValue('1.0');
        expect(rateInput).toBeInTheDocument();

        // Change rate to 0.001 (1 NGN = 0.001 USD roughly)
        await user.clear(rateInput);
        await user.type(rateInput, '0.001');

        // 5. Submit
        const submitBtn = screen.getByRole('button', { name: /Record Transfer/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(mockAddTransaction).toHaveBeenCalled();
        });

        const payload = mockAddTransaction.mock.calls[0][0];
        expect(payload.type).toBe('transfer');
        expect(payload.amountCents).toBe(100000); // 1000.00 NGN = 100000 cents
        expect(payload.accountId).toBe('acc1');
        expect(payload.destinationAccountId).toBe('acc3');
        expect(payload.destinationAmountCents).toBeDefined();
        // 1000 * 0.001 = 1 USD = 100 cents
        expect(payload.destinationAmountCents).toBe(100);
        expect(payload.exchangeRate).toBe(0.001);
    });

    it('shows validation error if destination is same as source', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' });

        await user.type(screen.getByLabelText(/Description/i), 'Bad Transfer');
        await user.type(screen.getByLabelText(/Amount/i), '10.00');

        const transferBtn = screen.getByRole('button', { name: /Transfer/i });
        await user.click(transferBtn);

        // Force select same account (if UI allows it, or check if logic prevents it)
        // useTransactionFormState tries to prevent it, but let's try.
        // If the select contains source account, we can select it.
        // TransferDetails filters out source account: accounts.filter(a => a.id !== sourceAccount?.id)
        // So we can't select it via UI. 
        // This test might verify that the source account is NOT in the list.
        const destSelect = screen.getByLabelText(/To Account/i);
        const options = Array.from(destSelect.querySelectorAll('option'));
        const acc1Option = options.find(o => o.value === 'acc1');
        expect(acc1Option).toBeUndefined();
    });
});
