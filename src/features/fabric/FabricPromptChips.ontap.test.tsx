import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FabricPromptChips } from './FabricPromptChips';

const navigateTo = vi.fn();

vi.mock('../../context/AnchorContext', () => ({
  useApp: () => ({ navigateTo }),
}));

describe('FabricPromptChips — onTap coverage', () => {
  beforeEach(() => {
    navigateTo.mockClear();
  });

  it('navigates for every non-prompt chip', () => {
    render(<FabricPromptChips />);

    fireEvent.click(screen.getByText("What's coming up?"));
    fireEvent.click(screen.getByText('Plan my week'));
    fireEvent.click(screen.getByText('Am I saving enough?'));
    fireEvent.click(screen.getByText('Habits vs spending'));
    fireEvent.click(screen.getByText('How am I doing?'));
    fireEvent.click(screen.getByText('Log a transaction'));

    expect(navigateTo).toHaveBeenCalledWith('finance');
    expect(navigateTo).toHaveBeenCalledWith('commitments');
    expect(navigateTo).toHaveBeenCalledWith('fabric');
    expect(navigateTo).toHaveBeenCalledWith('dashboard');
  });

  it('invokes onGenerateWeeklyReport when the weekly report chip is clicked', () => {
    const onGenerateWeeklyReport = vi.fn();
    render(<FabricPromptChips onGenerateWeeklyReport={onGenerateWeeklyReport} />);

    fireEvent.click(screen.getByText('Generate weekly report'));
    expect(onGenerateWeeklyReport).toHaveBeenCalledTimes(1);
  });
});
