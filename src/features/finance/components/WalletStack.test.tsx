// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { WalletStack } from './WalletStack';
import type { AnchorAccount } from '../../../types';

vi.mock('../../../utils/format', () => ({
    formatCurrencyCompact: (amount: number, currency: string) => `${currency}${amount}`,
}));

vi.mock('../../../utils/moneyUtils', () => ({
    fromCents: (cents: number) => cents / 100,
}));

const makeAccount = (overrides: Partial<AnchorAccount> = {}): AnchorAccount => ({
    id: 'acc-1',
    name: 'Checking Account',
    type: 'checking',
    currency: 'USD',
    balanceCents: 150000,
    color: '#3b82f6',
    scope: 'personal',
    ...overrides,
});

describe('WalletStack', () => {
    const defaultProps = {
        userId: 'user-1',
        onSelect: vi.fn(),
    };

    it('renders nothing when accounts is empty', () => {
        const { container } = render(
            <WalletStack accounts={[]} {...defaultProps} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders all account cards in the stack', () => {
        const accounts = [
            makeAccount({ id: 'a1', name: 'Kuda' }),
            makeAccount({ id: 'a2', name: 'Savings', type: 'savings' }),
            makeAccount({ id: 'a3', name: 'Investment', type: 'investment' }),
        ];

        render(<WalletStack accounts={accounts} {...defaultProps} />);

        expect(screen.getByTestId('wallet-stack')).toBeInTheDocument();
        expect(screen.getByTestId('account-card-a1')).toBeInTheDocument();
        expect(screen.getByTestId('account-card-a2')).toBeInTheDocument();
        expect(screen.getByTestId('account-card-a3')).toBeInTheDocument();
    });

    it('preserves data-testid format for account cards', () => {
        const accounts = [makeAccount({ id: 'checking-main' })];
        render(<WalletStack accounts={accounts} {...defaultProps} />);
        expect(screen.getByTestId('account-card-checking-main')).toBeInTheDocument();
    });

    it('calls onSelect with the correct account when tapped', () => {
        const onSelect = vi.fn();
        const account = makeAccount({ id: 'a1', name: 'Kuda' });

        render(<WalletStack accounts={[account]} userId="user-1" onSelect={onSelect} />);
        fireEvent.click(screen.getByTestId('account-card-a1'));

        expect(onSelect).toHaveBeenCalledWith(account);
    });

    it('displays account name and balance on each card', () => {
        const accounts = [
            makeAccount({ id: 'a1', name: 'Daily Spending', balanceCents: 50000, currency: 'NGN' }),
            makeAccount({ id: 'a2', name: 'Emergency Fund', balanceCents: 200000, currency: 'USD', type: 'savings' }),
        ];

        render(<WalletStack accounts={accounts} {...defaultProps} />);

        expect(screen.getByText('Daily Spending')).toBeInTheDocument();
        expect(screen.getByText('NGN500')).toBeInTheDocument();
        expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
        expect(screen.getByText('USD2000')).toBeInTheDocument();
    });

    it('sets stack height based on number of accounts', () => {
        const accounts = [
            makeAccount({ id: 'a1' }),
            makeAccount({ id: 'a2', type: 'savings' }),
            makeAccount({ id: 'a3', type: 'investment' }),
        ];

        render(<WalletStack accounts={accounts} {...defaultProps} />);
        const stack = screen.getByTestId('wallet-stack');
        // Height = 180 (first card) + 2 * 56 (peek strips) = 292
        expect(stack.style.height).toBe('292px');
    });

    it('stacks cards with descending z-index', () => {
        const accounts = [
            makeAccount({ id: 'a1' }),
            makeAccount({ id: 'a2', type: 'savings' }),
        ];

        render(<WalletStack accounts={accounts} {...defaultProps} />);
        const cards = screen.getByTestId('wallet-stack').children;
        // First card has higher z-index
        expect(Number(cards[0].style.zIndex)).toBeGreaterThan(Number(cards[1].style.zIndex));
    });

    it('each card has minimum 44px touch target', () => {
        const accounts = [
            makeAccount({ id: 'a1' }),
            makeAccount({ id: 'a2', type: 'savings' }),
        ];

        render(<WalletStack accounts={accounts} {...defaultProps} />);
        const buttons = screen.getAllByRole('button');
        // WalletCard uses min-h-[44px] — all buttons should be tappable
        buttons.forEach(btn => {
            expect(btn.classList.contains('min-h-[44px]')).toBe(true);
        });
    });
});
