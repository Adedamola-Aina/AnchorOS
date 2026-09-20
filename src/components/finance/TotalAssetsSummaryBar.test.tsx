// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TotalAssetsSummaryBar } from './TotalAssetsSummaryBar';
import type { AnchorAccount } from '../../types';

const makeAccount = (id: string, currency: 'USD' | 'NGN', cents: number): AnchorAccount => ({
  id, name: `Account ${id}`, type: 'checking', currency,
  balanceCents: cents, color: '', scope: 'personal', ownerId: 'u1',
});

describe('TotalAssetsSummaryBar', () => {
  it('shows USD total with full format when only USD accounts exist', () => {
    render(<TotalAssetsSummaryBar accounts={[makeAccount('1', 'USD', 500000)]} />);
    expect(screen.getByTestId('total-assets-bar')).toBeTruthy();
    expect(screen.getByText(/\$5,000\.00/)).toBeTruthy();
  });

  it('shows NGN as primary and USD as secondary when both exist', () => {
    render(<TotalAssetsSummaryBar accounts={[
      makeAccount('1', 'USD', 500000),
      makeAccount('2', 'NGN', 50000000),
    ]} />);
    expect(screen.getByText(/₦500,000\.00/)).toBeTruthy();
    expect(screen.getByText(/\$5,000\.00/)).toBeTruthy();
  });

  it('returns null when no accounts', () => {
    const { container } = render(<TotalAssetsSummaryBar accounts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows Total Assets label', () => {
    render(<TotalAssetsSummaryBar accounts={[makeAccount('1', 'USD', 100000)]} />);
    expect(screen.getByText('Total Assets')).toBeTruthy();
  });

  it('does not show secondary currency when only one currency exists', () => {
    render(<TotalAssetsSummaryBar accounts={[makeAccount('1', 'NGN', 100000)]} />);
    expect(screen.queryByText(/\$/)).toBeNull();
  });

  // UX-FN-02: mixed currencies must never read as one headline figure.
  describe('UX-FN-02: per-currency labelling', () => {
    it('labels each currency and counts its accounts', () => {
      render(<TotalAssetsSummaryBar accounts={[
        makeAccount('1', 'NGN', 50000000),
        makeAccount('2', 'NGN', 5000000),
        makeAccount('3', 'USD', 500000),
      ]} />);

      expect(screen.getByTestId('total-assets-NGN')).toHaveTextContent('NGN · 2 accounts');
      expect(screen.getByTestId('total-assets-USD')).toHaveTextContent('USD · 1 account');
      // The total is per currency: ₦500,000.00 + ₦50,000.00, and $5,000.00 on its own.
      expect(screen.getByTestId('total-assets-NGN')).toHaveTextContent(/₦550,000\.00/);
      expect(screen.getByTestId('total-assets-USD')).toHaveTextContent(/\$5,000\.00/);
    });

    it('states that no exchange rate is applied when currencies are mixed', () => {
      render(<TotalAssetsSummaryBar accounts={[
        makeAccount('1', 'NGN', 50000000),
        makeAccount('2', 'USD', 500000),
      ]} />);

      expect(screen.getByTestId('total-assets-fx-note')).toHaveTextContent(/no exchange rate is applied/i);
    });

    it('does not mention exchange rates when there is only one currency', () => {
      render(<TotalAssetsSummaryBar accounts={[makeAccount('1', 'NGN', 100000)]} />);
      expect(screen.queryByTestId('total-assets-fx-note')).not.toBeInTheDocument();
    });

    it('never prints a single combined number for two currencies', () => {
      render(<TotalAssetsSummaryBar accounts={[
        makeAccount('1', 'NGN', 50000000),
        makeAccount('2', 'USD', 500000),
      ]} />);

      // 500,000.00 + 5,000.00 would be the meaningless "505,000" figure.
      expect(screen.queryByText(/505,000/)).not.toBeInTheDocument();
    });
  });
});
