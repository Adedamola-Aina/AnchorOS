
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalancesSummary } from './BalancesSummary';
import type { AnchorAccount } from '../../types';

const makeAccount = (id: string, currency: 'NGN' | 'USD', balanceCents: number): AnchorAccount => ({
    id, name: `Account ${id}`, type: 'checking', currency, balanceCents,
    color: '#000', scope: 'personal', isArchived: false,
});

/**
 * UX-FN-02 regression guard, in its final form.
 *
 * The old component printed per-currency figures under a "TOTAL ASSETS" heading: a
 * heading that promised a single total over numbers that were never summed. That was
 * fixed by renaming the block and adding an account count plus a "no exchange rate is
 * applied" sentence — which then became the clutter: three lines of furniture around
 * one number, under a page that already says "your accounts, balances and spending in
 * one place".
 *
 * What actually prevents a misleading total is structural, and these tests hold it:
 * every figure is labelled with its own currency, and the figures are never summed.
 */
describe('BalancesSummary (UX-FN-02)', () => {
    it('renders nothing when there are no accounts', () => {
        const { container } = render(<BalancesSummary accounts={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('never claims a total', () => {
        render(<BalancesSummary accounts={[makeAccount('1', 'USD', 500000)]} />);
        expect(screen.getByTestId('balances-summary')).toBeInTheDocument();
        expect(screen.queryByText(/total assets/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/^total$/i)).not.toBeInTheDocument();
    });

    /** The heading and the count/disclosure line were reported as clutter. */
    it('shows the figures with no heading, no account count and no FX note', () => {
        render(<BalancesSummary accounts={[
            makeAccount('1', 'NGN', 50000000),
            makeAccount('2', 'USD', 500000),
        ]} />);

        expect(screen.getByTestId('balances-NGN')).toHaveTextContent(/₦500,000\.00/);
        expect(screen.getByTestId('balances-USD')).toHaveTextContent(/\$5,000\.00/);

        expect(screen.queryByRole('heading', { name: /balances/i })).not.toBeInTheDocument();
        expect(screen.queryByText(/^\d+ accounts?$/)).not.toBeInTheDocument();
        expect(screen.queryByText(/no exchange rate/i)).not.toBeInTheDocument();
        expect(screen.queryByTestId('balances-fx-note')).not.toBeInTheDocument();
    });

    it('keeps each currency labelled, so no figure can be read as a sum', () => {
        render(<BalancesSummary accounts={[
            makeAccount('1', 'NGN', 100000),
            makeAccount('2', 'USD', 100000),
        ]} />);

        // Two currencies, two separate figures — never one added number.
        expect(screen.getByTestId('balances-NGN')).toBeInTheDocument();
        expect(screen.getByTestId('balances-USD')).toBeInTheDocument();
    });

    it('keeps the account count in the accessible name', () => {
        render(<BalancesSummary accounts={[
            makeAccount('1', 'NGN', 100000),
            makeAccount('2', 'NGN', 100000),
        ]} />);

        expect(screen.getByText(/balance across 2 accounts/i)).toBeInTheDocument();
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
