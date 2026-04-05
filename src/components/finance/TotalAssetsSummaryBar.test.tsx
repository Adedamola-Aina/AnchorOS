// @ts-nocheck
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TotalAssetsSummaryBar } from './TotalAssetsSummaryBar';
import type { AnchorAccount } from '../../types';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return { ...actual, ChevronRight: () => <span data-testid="chevron" /> };
});

const makeAccount = (id: string, currency: 'USD' | 'NGN', cents: number): AnchorAccount => ({
  id, name: `Account ${id}`, type: 'checking', currency,
  balanceCents: cents, color: '', scope: 'personal', ownerId: 'u1',
});

describe('TotalAssetsSummaryBar', () => {
  it('shows USD total when only USD accounts exist', () => {
    render(<TotalAssetsSummaryBar accounts={[makeAccount('1', 'USD', 500000)]} />);
    expect(screen.getByTestId('total-assets-bar')).toBeInTheDocument();
    expect(screen.getByText(/\$5K/)).toBeInTheDocument();
  });

  it('shows both USD and NGN totals', () => {
    render(<TotalAssetsSummaryBar accounts={[
      makeAccount('1', 'USD', 500000),
      makeAccount('2', 'NGN', 50000000),
    ]} />);
    expect(screen.getByText(/\$5K/)).toBeInTheDocument();
    expect(screen.getByText(/₦500K/)).toBeInTheDocument();
  });

  it('returns null when no accounts', () => {
    const { container } = render(<TotalAssetsSummaryBar accounts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows separator between currencies', () => {
    render(<TotalAssetsSummaryBar accounts={[
      makeAccount('1', 'USD', 500000),
      makeAccount('2', 'NGN', 50000000),
    ]} />);
    expect(screen.getByText('|')).toBeInTheDocument();
  });

  it('has a Show Details button', () => {
    render(<TotalAssetsSummaryBar accounts={[makeAccount('1', 'USD', 100000)]} />);
    expect(screen.getByText('Show Details')).toBeInTheDocument();
  });

  it('calls onShowDetails when the button is pressed', async () => {
    const onShowDetails = vi.fn();
    render(<TotalAssetsSummaryBar accounts={[makeAccount('1', 'USD', 100000)]} onShowDetails={onShowDetails} />);

    await userEvent.setup().click(screen.getByRole('button', { name: /show details/i }));

    expect(onShowDetails).toHaveBeenCalledTimes(1);
  });
});
