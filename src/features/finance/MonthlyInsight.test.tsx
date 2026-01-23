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
});
