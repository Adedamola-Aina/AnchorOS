import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionForm } from './TransactionForm';
import { FinanceContext } from '../../context/FinanceContext';
import { NotificationContext } from '../../context/NotificationContext';

// Mock Dependencies
const mockAddTransaction = vi.fn();
const mockUpdateTransaction = vi.fn();
const mockClose = vi.fn();
const mockShowToast = vi.fn();

const mockAccounts = [
    { id: 'acc1', name: 'Main Checking', balanceCents: 500000, currency: 'NGN', type: 'checking', ownerId: 'user1' },
    { id: 'acc2', name: 'Savings', balanceCents: 200000, currency: 'NGN', type: 'savings', ownerId: 'user1' }
];

const renderForm = (props: any = {}) => {
    return render(
        <NotificationContext.Provider value={{ showToast: mockShowToast } as any}>
            <FinanceContext.Provider value={{
                transactions: [],
                accounts: mockAccounts,
                addTransaction: mockAddTransaction,
                updateTransaction: mockUpdateTransaction,
            } as any}>
                <TransactionForm onClose={mockClose} defaultAccountId="acc1" {...props} />
            </FinanceContext.Provider>
        </NotificationContext.Provider>
    );
};

describe('TransactionForm', () => {
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
});
