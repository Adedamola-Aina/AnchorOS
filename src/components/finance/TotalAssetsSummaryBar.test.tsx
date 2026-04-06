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
});
