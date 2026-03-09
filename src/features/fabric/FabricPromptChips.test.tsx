import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FabricPromptChips } from './FabricPromptChips';

const navigateTo = vi.fn();

vi.mock('../../context/AnchorContext', () => ({
  useApp: () => ({ navigateTo }),
}));

describe('FabricPromptChips', () => {
  it('renders guided chips and triggers navigation', () => {
    render(<FabricPromptChips />);

    fireEvent.click(screen.getByText('Spending this month'));
    fireEvent.click(screen.getByText('My streaks'));

    expect(navigateTo).toHaveBeenCalledWith('finance', { filter: 'this_month' });
    expect(navigateTo).toHaveBeenCalledWith('commitments');
  });

  it('uses onPrompt callback when provided', () => {
    const onPrompt = vi.fn();
    render(<FabricPromptChips onPrompt={onPrompt} />);

    fireEvent.click(screen.getByText('Spending this month'));
    expect(onPrompt).toHaveBeenCalledWith('how much did i spend this month');
  });
});
