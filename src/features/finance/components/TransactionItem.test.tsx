// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { TransactionItem } from './TransactionItem';
import type { AnchorTransaction } from '../../../types';

// Mock shared components
vi.mock('../../../components/shared', () => ({
    CategoryIcon: ({ category }: { category: string }) => <div data-testid="category-icon">{category}</div>,
}));

vi.mock('@anchor-os/ui', () => ({
    Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card" className={className}>{children}</div>
    ),
}));

const baseTx: AnchorTransaction = {
    id: 'tx-1',
    title: 'Netflix Subscription',
    amountCents: 1599,
    type: 'expense',
    category: 'Entertainment',
    accountId: 'acc-1',
    currency: 'USD',
    scope: 'personal',
    date: '2026-02-16T12:00:00Z',
};

const defaultProps = {
    transaction: baseTx,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
};

describe('TransactionItem', () => {
    it('renders transaction title and category', () => {
        render(<TransactionItem {...defaultProps} />);
        expect(screen.getByText('Netflix Subscription')).toBeInTheDocument();
        // Category appears in both icon and pill
        expect(screen.getAllByText('Entertainment').length).toBeGreaterThanOrEqual(1);
    });

    it('shows Recurring pill when transaction has recurringId', () => {
        const recurringTx: AnchorTransaction = {
            ...baseTx,
            recurringId: 'rec-123',
        };
        render(<TransactionItem {...defaultProps} transaction={recurringTx} />);
        expect(screen.getByText('Recurring')).toBeInTheDocument();
    });

    it('does NOT show Recurring pill when recurringId is absent', () => {
        render(<TransactionItem {...defaultProps} />);
        expect(screen.queryByText('Recurring')).not.toBeInTheDocument();
    });

    it('shows Backdated pill when isBackdated is true', () => {
        const backdatedTx: AnchorTransaction = { ...baseTx, isBackdated: true };
        render(<TransactionItem {...defaultProps} transaction={backdatedTx} />);
        expect(screen.getByText('Backdated')).toBeInTheDocument();
    });

    it('shows account name pill when provided', () => {
        render(<TransactionItem {...defaultProps} accountName="Savings" />);
        expect(screen.getByText('Savings')).toBeInTheDocument();
    });
});
