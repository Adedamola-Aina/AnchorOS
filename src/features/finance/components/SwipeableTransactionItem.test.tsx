/**
 * SwipeableTransactionItem Component Tests
 * 
 * Tests the mobile-optimized transaction item wrapper.
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwipeableTransactionItem } from './SwipeableTransactionItem';
import type { AnchorTransaction } from '../../../types';

// Mock useResponsive hook
vi.mock('../../../hooks/useResponsive', () => ({
    useResponsive: vi.fn(() => ({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        breakpoint: 'desktop',
        isTouchDevice: false,
    })),
}));

import { useResponsive } from '../../../hooks/useResponsive';

const mockTransaction: AnchorTransaction = {
    id: 'tx-1',
    title: 'Test Transaction',
    amountCents: 5000,
    currency: 'USD',
    type: 'expense',
    category: 'Food',
    date: '2024-01-15',
    accountId: 'acc-1',
    scope: 'personal',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
};

describe('SwipeableTransactionItem', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Desktop Mode', () => {
        beforeEach(() => {
            vi.mocked(useResponsive).mockReturnValue({
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                breakpoint: 'desktop',
                isTouchDevice: false,
            });
        });

        it('renders TransactionItem directly without SwipeableRow', () => {
            render(
                <SwipeableTransactionItem
                    transaction={mockTransaction}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText('Test Transaction')).toBeInTheDocument();
            expect(screen.queryByTestId('swipeable-row')).not.toBeInTheDocument();
        });
    });

    describe('Mobile Mode', () => {
        beforeEach(() => {
            vi.mocked(useResponsive).mockReturnValue({
                isMobile: true,
                isTablet: false,
                isDesktop: false,
                breakpoint: 'mobile',
                isTouchDevice: true,
            });
        });

        it('wraps TransactionItem with SwipeableRow', () => {
            render(
                <SwipeableTransactionItem
                    transaction={mockTransaction}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText('Test Transaction')).toBeInTheDocument();
            expect(screen.getByTestId('swipeable-row')).toBeInTheDocument();
        });

        it('reveals the swipe actions while the row is being swiped', () => {
            render(
                <SwipeableTransactionItem
                    transaction={mockTransaction}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            // At rest the action layers are not rendered at all: they sit behind
            // the row and their colour used to leak through the rounded corners
            // as a halo around every transaction.
            expect(screen.queryByTestId('left-action')).not.toBeInTheDocument();
            expect(screen.queryByTestId('right-action')).not.toBeInTheDocument();

            fireEvent.touchStart(screen.getByTestId('swipeable-content'), {
                touches: [{ clientX: 200, clientY: 100 }],
            });

            expect(screen.getByTestId('left-action')).toBeInTheDocument();
            expect(screen.getByTestId('right-action')).toBeInTheDocument();
            expect(screen.getByText('Edit')).toBeInTheDocument();
            expect(screen.getByText('Delete')).toBeInTheDocument();
        });
    });

    describe('Transaction Display', () => {
        it('displays transaction title', () => {
            render(
                <SwipeableTransactionItem
                    transaction={mockTransaction}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText('Test Transaction')).toBeInTheDocument();
        });

        it('displays formatted amount', () => {
            render(
                <SwipeableTransactionItem
                    transaction={mockTransaction}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            const row = screen.getByTestId('transaction-row');
            // $50.00 formatted from 5000 cents, with the minus sign for an expense.
            expect(row).toHaveTextContent(/50\.00/);
            expect(row).toHaveTextContent(/−/);
            // Direction is stated in words for assistive tech, never colour alone.
            expect(row).toHaveTextContent(/Money out/);
        });

        it('displays category', () => {
            render(
                <SwipeableTransactionItem
                    transaction={mockTransaction}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

            expect(screen.getByText('Food')).toBeInTheDocument();
        });
    });
});
