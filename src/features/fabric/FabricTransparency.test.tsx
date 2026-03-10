import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import FabricTransparency from './FabricTransparency';

const deletePattern = vi.fn();
const useFabricMock = vi.fn();

vi.mock('../../hooks/useFabric', () => ({
  useFabric: () => useFabricMock(),
}));

describe('FabricTransparency', () => {
  it('renders empty state when no confirmed patterns exist', () => {
    useFabricMock.mockReturnValue({ confirmedPatterns: [], deletePattern });

    render(<FabricTransparency />);

    expect(screen.getByText("Anchor AI hasn't learned any confirmed patterns yet.")).toBeInTheDocument();
  });

  it('renders patterns and allows deletion', () => {
    useFabricMock.mockReturnValue({
      confirmedPatterns: [
        {
          id: 'pattern-1',
          trigger: { type: 'app_opened' },
          followUpAction: { type: 'view_page' },
        },
      ],
      deletePattern,
    });

    render(<FabricTransparency />);

    fireEvent.click(screen.getByText('Delete pattern'));
    expect(deletePattern).toHaveBeenCalledWith('pattern-1');
  });

  it('includes category in pattern description when present', () => {
    useFabricMock.mockReturnValue({
      confirmedPatterns: [
        {
          id: 'pattern-food',
          trigger: { type: 'transaction_recorded', category: 'Food' },
          followUpAction: { type: 'review_budget', category: 'Food' },
        },
        {
          id: 'pattern-transport',
          trigger: { type: 'transaction_recorded', category: 'Transport' },
          followUpAction: { type: 'review_budget', category: 'Transport' },
        },
      ],
      deletePattern,
    });

    render(<FabricTransparency />);

    expect(screen.getByText(/transaction recorded.*Food.*review budget.*Food/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction recorded.*Transport.*review budget.*Transport/i)).toBeInTheDocument();
  });
});
