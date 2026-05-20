// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { AssetAllocationWidget } from './AssetAllocationWidget';

vi.mock('../../../utils/format', () => ({
  formatCurrency: (a: number, c: string) => `${c}${a}`,
  formatCurrencyCompact: (a: number, c: string) => `${c}${a}`,
}));

const makeAssets = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `a${i}`, name: `Asset ${i}`, type: 'savings',
    amount: (i + 1) * 1000, percent: 100 / count, currency: 'NGN',
  }));

describe('AssetAllocationWidget', () => {
  it('renders asset list', () => {
    render(<AssetAllocationWidget assets={makeAssets(3)} />);
    expect(screen.getByText('Asset Split')).toBeInTheDocument();
    expect(screen.getByText('Asset 0')).toBeInTheDocument();
  });

  it('shows max 4 items collapsed with View More', () => {
    render(<AssetAllocationWidget assets={makeAssets(6)} />);
    expect(screen.getByText(/view 2 more/i)).toBeInTheDocument();
  });

  it('expands to show all on click', () => {
    render(<AssetAllocationWidget assets={makeAssets(6)} />);
    fireEvent.click(screen.getByText(/view 2 more/i));
    expect(screen.getByText('Asset 5')).toBeInTheDocument();
  });
});
