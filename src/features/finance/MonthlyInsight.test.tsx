// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonthlyInsight } from './MonthlyInsight';
import type { AnchorTransaction } from '../../types';

describe('MonthlyInsight', () => {
    const mockIncome: AnchorTransaction = {
        id: '1',
        type: 'income',
        amountCents: 100000, // $1000
        date: new Date().toISOString(),
        title: 'Salary',
        category: 'Salary',
        accountId: 'acc1',
        currency: 'USD',
        scope: 'personal',
        isSoftDeleted: false
    };

    const mockExpense: AnchorTransaction = {
        id: '2',
        type: 'expense',
        amountCents: 50000, // $500
        date: new Date().toISOString(),
        title: 'Groceries',
        category: 'Food',
        accountId: 'acc1',
        currency: 'USD',
        scope: 'personal',
        isSoftDeleted: false
    };

    it('displays "Potential Savings" when income > expense', () => {
        render(<MonthlyInsight transactions={[mockIncome, mockExpense]} currency="USD" />);

        expect(screen.getByText('Total Income')).toBeInTheDocument();
        expect(screen.getByText(/\$1,000.00/)).toBeInTheDocument();

        expect(screen.getByText('Total Spent')).toBeInTheDocument();
        // Use getAllByText as $500 might appear twice
        const fiveHundreds = screen.getAllByText(/\$500.00/);
        expect(fiveHundreds.length).toBeGreaterThanOrEqual(1);

        expect(screen.getByText('Potential Savings')).toBeInTheDocument();
    });

    it('displays "Overspending" when expense > income', () => {
        const largeExpense: AnchorTransaction = {
            ...mockExpense,
            amountCents: 150000 // $1500
        };

        render(<MonthlyInsight transactions={[mockIncome, largeExpense]} currency="USD" />);

        expect(screen.getByText('Total Income')).toBeInTheDocument();
        expect(screen.getByText(/\$1,000.00/)).toBeInTheDocument();

        expect(screen.getByText('Total Spent')).toBeInTheDocument();
        const fifteenHundreds = screen.getAllByText(/\$1,500.00/);
        expect(fifteenHundreds.length).toBeGreaterThanOrEqual(1);

        expect(screen.getByText('Overspending')).toBeInTheDocument();
        expect(screen.getByText(/\$500.00/)).toBeInTheDocument(); // |1000 - 1500|

        const amountElement = screen.getByText(/\$500.00/).closest('p');
        expect(amountElement).toHaveClass('text-rose-600');
    });

    it('displays "Potential Savings" of $0 when income equals expense', () => {
        const exactExpense: AnchorTransaction = {
            ...mockExpense,
            amountCents: 100000 // $1000
        };

        render(<MonthlyInsight transactions={[mockIncome, exactExpense]} currency="USD" />);

        expect(screen.getByText('Potential Savings')).toBeInTheDocument();
        expect(screen.getByText(/\$0.00/)).toBeInTheDocument();
    });

    it('handles currency formatting correctly', () => {
        render(<MonthlyInsight transactions={[mockIncome, mockExpense]} currency="NGN" />);
        expect(screen.getByText(/1,000.00/)).toBeInTheDocument();
    });

    it('renders nothing if no transactions', () => {
        const { container } = render(<MonthlyInsight transactions={[]} currency="USD" />);
        expect(container.firstChild).toBeNull();
    });

    // BUG-037: Transfers should NOT be counted in income/expense totals
    it('excludes transfers from income and expense totals (BUG-037)', () => {
        const transferOut: AnchorTransaction = {
            id: '3',
            type: 'expense',
            amountCents: 25000, // $250 transfer out
            date: new Date().toISOString(),
            title: 'Transfer to Savings',
            category: 'Transfer',
            accountId: 'acc1',
            currency: 'USD',
            scope: 'personal',
            isSoftDeleted: false,
            linkId: 'link-123',
            linkedTransactionId: 'tx-dest',
            linkedUserId: 'user-1',
        };

        const transferIn: AnchorTransaction = {
            id: '4',
            type: 'income',
            amountCents: 25000, // $250 transfer in
            date: new Date().toISOString(),
            title: 'Transfer from Checking',
            category: 'Transfer',
            accountId: 'acc2',
            currency: 'USD',
            scope: 'personal',
            isSoftDeleted: false,
            linkId: 'link-123',
            linkedTransactionId: 'tx-source',
            linkedUserId: 'user-1',
        };

        // Include real income/expense + transfers
        render(<MonthlyInsight transactions={[mockIncome, mockExpense, transferOut, transferIn]} currency="USD" />);

        // Income should be $1000 (not $1250 which would include transfer)
        expect(screen.getByText(/\$1,000.00/)).toBeInTheDocument();
        // Expense should be $500 (not $750 which would include transfer)
        const expenseAmounts = screen.getAllByText(/\$500.00/);
        expect(expenseAmounts.length).toBeGreaterThanOrEqual(1);

        // Should NOT show $1250 or $750
        expect(screen.queryByText(/\$1,250.00/)).not.toBeInTheDocument();
        expect(screen.queryByText(/\$750.00/)).not.toBeInTheDocument();
    });
});
