import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FabricTransparency from './FabricTransparency';

const deletePattern = vi.fn();
const useFabricMock = vi.fn();

vi.mock('../../hooks/useFabric', () => ({
  useFabric: () => useFabricMock(),
}));

const renderTransparency = () =>
  render(
    <MemoryRouter>
      <FabricTransparency />
    </MemoryRouter>
  );

describe('FabricTransparency', () => {
  it('renders empty state when no confirmed patterns exist', () => {
    useFabricMock.mockReturnValue({ confirmedPatterns: [], deletePattern });

    renderTransparency();

    expect(screen.getByText("Anchor AI hasn't learned any confirmed patterns yet.")).toBeInTheDocument();
  });

  // ─── UX-AI-10: no back affordance, no explanation ────────────────────────
  describe('UX-AI-10', () => {
    it('offers a way back to the assistant', () => {
      useFabricMock.mockReturnValue({ confirmedPatterns: [], deletePattern });

      renderTransparency();

      expect(screen.getByTestId('transparency-back')).toHaveAttribute('href', '/fabric');
    });

    it('explains what it learns from and when to expect patterns', () => {
      useFabricMock.mockReturnValue({ confirmedPatterns: [], deletePattern });

      renderTransparency();

      const empty = screen.getByTestId('transparency-empty');
      // The old copy stated the fact and stopped, which reads as "broken".
      expect(empty.textContent).toMatch(/only learns from your own activity/i);
      expect(empty.textContent).toMatch(/expected to be empty when you have just started/i);
    });
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

    renderTransparency();

    fireEvent.click(screen.getByText('Delete group'));
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

    renderTransparency();

    expect(screen.getByText(/transaction recorded.*Food.*review budget.*Food/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction recorded.*Transport.*review budget.*Transport/i)).toBeInTheDocument();
  });
});
