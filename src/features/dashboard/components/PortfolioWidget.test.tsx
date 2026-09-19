// @ts-nocheck
/**
 * DB-03: the Portfolio card advertised "Total across N accounts" and never
 * printed a total.
 * DB-04: it also listed every asset with an amount and a percentage, which is
 * exactly what the Asset Split card already renders — the same payload twice on
 * one screen.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { PortfolioWidget } from './DashboardWidgets';

vi.mock('../../../utils/format', () => ({
    formatCurrency: (a: number, c: string) => `${c} ${a}`,
    formatCurrencyCompact: (a: number, c: string) => `${c} ${a}`,
}));

describe('PortfolioWidget (DB-03 / DB-04)', () => {
    it('prints the total the label promises (DB-03)', () => {
        render(
            <PortfolioWidget
                totals={[{ currency: 'NGN', total: 5000, accountCount: 1 }]}
                onNavigate={vi.fn()}
                accountCount={1}
            />,
        );

        expect(screen.getByTestId('portfolio-total-NGN')).toHaveTextContent('NGN 5000');
    });

    it('shows one total per currency rather than a concatenated figure (UX-FN-02)', () => {
        render(
            <PortfolioWidget
                totals={[
                    { currency: 'NGN', total: 5000, accountCount: 2 },
                    { currency: 'USD', total: 1200, accountCount: 1 },
                ]}
                onNavigate={vi.fn()}
                accountCount={3}
            />,
        );

        expect(screen.getByTestId('portfolio-total-NGN')).toHaveTextContent('NGN 5000');
        expect(screen.getByTestId('portfolio-total-USD')).toHaveTextContent('USD 1200');
    });

    it('no longer prints per-asset shares, which Asset Split owns (DB-04)', () => {
        render(
            <PortfolioWidget
                totals={[{ currency: 'NGN', total: 5000, accountCount: 2 }]}
                onNavigate={vi.fn()}
                accountCount={2}
            />,
        );

        // The widget cannot even receive assets now, so the duplicated
        // amount-and-percentage rows cannot creep back in.
        expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('uses the singular for one account', () => {
        render(
            <PortfolioWidget
                totals={[{ currency: 'NGN', total: 100, accountCount: 1 }]}
                onNavigate={vi.fn()}
                accountCount={1}
            />,
        );

        expect(screen.getByText(/total across 1 account/i)).toBeInTheDocument();
    });

    it('says so honestly when there are no accounts', () => {
        render(<PortfolioWidget totals={[]} onNavigate={vi.fn()} accountCount={0} />);

        expect(screen.getByText(/no accounts yet/i)).toBeInTheDocument();
    });
});