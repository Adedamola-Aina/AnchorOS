/**
 * SwipeableTransactionItem Component Tests
 * 
 * Tests the mobile-optimized transaction item wrapper.
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

        it('renders swipe action indicators', () => {
            render(
                <SwipeableTransactionItem
                    transaction={mockTransaction}
                    onEdit={mockOnEdit}
                    onDelete={mockOnDelete}
                />
            );

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

            // $50.00 formatted from 5000 cents
            expect(screen.getByText(/-\$50\.00/)).toBeInTheDocument();
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
