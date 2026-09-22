// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalancesSummary } from './BalancesSummary';
import type { AnchorAccount } from '../../types';

const makeAccount = (id: string, currency: 'NGN' | 'USD', balanceCents: number): AnchorAccount => ({
    id, name: `Account ${id}`, type: 'checking', currency, balanceCents,
    color: '#000', scope: 'personal', isArchived: false,
});

/**
 * UX-FN-02 regression guard, in its corrected form.
 *
 * The old component printed per-currency figures under a "TOTAL ASSETS" heading:
 * a heading that promises a single total, over numbers that were never summed.
 * The redesign renames the block to what it actually is ("Balances"), states the
 * account count once, and — when more than one currency is present — says plainly
 * that no exchange rate was applied. Adding NGN to USD is not a number this
 * product may print, so no code path here can produce one.
 */
describe('BalancesSummary (UX-FN-02)', () => {
    it('renders nothing when there are no accounts', () => {
        const { container } = render(<BalancesSummary accounts={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('labels the block "Balances", never "Total Assets"', () => {
        render(<BalancesSummary accounts={[makeAccount('1', 'USD', 500000)]} />);
        expect(screen.getByTestId('balances-summary')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Balances' })).toBeInTheDocument();
        expect(screen.queryByText(/total assets/i)).not.toBeInTheDocument();
    });

    it('shows a single currency with its amount and the account count', () => {
        render(<BalancesSummary accounts={[makeAccount('1', 'USD', 500000)]} />);
        expect(screen.getByTestId('balances-USD')).toHaveTextContent(/\$5,000\.00/);
        expect(screen.getByText(/^1 account$/)).toBeInTheDocument();
        // One currency means no conversion caveat is needed.
        expect(screen.queryByTestId('balances-fx-note')).not.toBeInTheDocument();
    });

    it('groups mixed currencies separately with their own counts', () => {
        render(<BalancesSummary accounts={[
            makeAccount('1', 'NGN', 50000000),
            makeAccount('2', 'NGN', 5000000),
            makeAccount('3', 'USD', 500000),
        ]} />);

        expect(screen.getByTestId('balances-NGN')).toHaveTextContent(/₦550,000\.00/);
        expect(screen.getByTestId('balances-USD')).toHaveTextContent(/\$5,000\.00/);
        expect(screen.getByText(/3 accounts/)).toBeInTheDocument();
    });

    it('discloses that no exchange rate was applied when currencies are mixed', () => {
        render(<BalancesSummary accounts={[
            makeAccount('1', 'NGN', 100000),
            makeAccount('2', 'USD', 100000),
        ]} />);
        expect(screen.getByTestId('balances-fx-note')).toHaveTextContent(/no exchange rate is applied/i);
    });

    it('never prints a combined figure across currencies', () => {
        const { container } = render(<BalancesSummary accounts={[
            makeAccount('1', 'NGN', 100000),
            makeAccount('2', 'USD', 100000),
        ]} />);
        // ₦1,000 + $1,000 must not appear as ₦2,000 or $2,000.
        expect(container.textContent).not.toMatch(/2,000\.00/);
    });

    it('renders a zero balance as a real figure, not as an empty row', () => {
        render(<BalancesSummary accounts={[makeAccount('1', 'NGN', 0)]} />);
        expect(screen.getByTestId('balances-NGN')).toHaveTextContent(/₦0\.00/);
    });

    it('renders a negative balance with its sign', () => {
        render(<BalancesSummary accounts={[makeAccount('1', 'USD', -12500)]} />);
        expect(screen.getByTestId('balances-USD')).toHaveTextContent(/-?\$125\.00/);
    });

    it('survives an extremely large balance without truncating it', () => {
        render(<BalancesSummary accounts={[makeAccount('1', 'NGN', 9999999999900)]} />);
        expect(screen.getByTestId('balances-NGN')).toHaveTextContent(/99,999,999,999\.00/);
    });
});
