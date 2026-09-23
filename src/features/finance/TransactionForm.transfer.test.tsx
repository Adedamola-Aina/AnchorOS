
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransactionForm } from './TransactionForm';
import { FinanceContext } from '../../context/FinanceContext';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

// Mock HIG components to render as native elements for test interaction
vi.mock('../../components/shared', async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
        ...actual,
        PopoverMenu: ({ items, value, onChange, label, testId }: any) => (
            <div>
                {label && <label htmlFor={testId}>{label}</label>}
                <select id={testId} data-testid={testId} value={value} onChange={(e: any) => onChange(e.target.value)}>
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
        SegmentedControl: ({ options, value, onChange, label, testId }: any) => (
            <div data-testid={testId}>
                {label && <span>{label}</span>}
                {options.map((opt: any) => (
                    <button key={opt.value} onClick={() => onChange(opt.value)} data-selected={value === opt.value}>{opt.label}</button>
                ))}
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

        // 3. Select Destination — a compact picker, not a wall of tiles.
        // The default destination is the first account that is not the source.
        const destTrigger = screen.getByTestId('tx-destination');
        expect(destTrigger).toHaveAttribute('aria-label', 'To: Savings');

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

        // 3. Select Destination (acc3 is USD) through the picker sheet
        await user.click(screen.getByTestId('tx-destination'));
        await user.click(screen.getByTestId('tx-destination-option-acc3'));

        // 4. The FX panel appears only for a cross-currency transfer, and the rate
        //    starts EMPTY — AnchorOS has no FX feed, so it must not invent one
        //    (UX-FN-19).
        expect(screen.getByTestId('fx-panel')).toBeInTheDocument();
        const rateInput = screen.getByLabelText(/1 NGN =/i);
        expect(rateInput).toHaveValue('');
        expect(screen.queryByTestId('fx-receives')).not.toBeInTheDocument();

        // 5. State the rate the user was given
        fireEvent.change(rateInput, { target: { value: '0.001' } });
        expect(screen.getByTestId('fx-receives')).toHaveTextContent(/\$1\.00/);

        // 6. Submit
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

    it('refuses to submit a cross-currency transfer without a rate', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' });

        await user.type(screen.getByLabelText(/Description/i), 'Transfer with no rate');
        await user.type(screen.getByLabelText(/Amount/i), '1000.00');
        await user.click(screen.getByRole('button', { name: /Transfer/i }));
        await user.click(screen.getByTestId('tx-destination'));
        await user.click(screen.getByTestId('tx-destination-option-acc3'));

        await user.click(screen.getByRole('button', { name: /Record Transfer/i }));

        // The transfer writes two paired ledger documents — with no rate there is
        // no honest destination amount, so nothing may be written.
        await waitFor(() => {
            expect(mockAddTransaction).not.toHaveBeenCalled();
        });
    });

    it('never offers the source account as the destination', async () => {
        const user = userEvent.setup();
        renderForm({ defaultAccountId: 'acc1' });

        await user.click(screen.getByRole('button', { name: /Transfer/i }));
        await user.click(screen.getByTestId('tx-destination'));

        // TransferDetails excludes the source account from the picker, so the
        // "same account" state is unreachable from the UI.
        expect(screen.queryByTestId('tx-destination-option-acc1')).not.toBeInTheDocument();
        expect(screen.getByTestId('tx-destination-option-acc2')).toBeInTheDocument();
    });
});
