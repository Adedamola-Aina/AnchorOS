/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FabricProactiveQuestionCard } from './FabricProactiveQuestionCard';

describe('FabricProactiveQuestionCard', () => {
  it('renders question text', () => {
    render(
      <FabricProactiveQuestionCard
        question="Should we review your subscriptions this week?"
        onDismiss={vi.fn()}
        onTap={vi.fn()}
      />,
    );

    expect(screen.getByText('Should we review your subscriptions this week?')).toBeInTheDocument();
  });

  it('calls onTap when question text is clicked', () => {
    const onTap = vi.fn();
    render(
      <FabricProactiveQuestionCard
        question="Do you want to plan this week?"
        onDismiss={vi.fn()}
        onTap={onTap}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Do you want to plan this week?' }));
    expect(onTap).toHaveBeenCalledWith('Do you want to plan this week?');
  });

  it('calls onDismiss when dismiss is clicked', () => {
    const onDismiss = vi.fn();
    render(
      <FabricProactiveQuestionCard
        question="Do you want to review this month?"
        onDismiss={onDismiss}
        onTap={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('uses a 44px touch target for the question button', () => {
    render(
      <FabricProactiveQuestionCard
        question="Should we check your cash flow?"
        onDismiss={vi.fn()}
        onTap={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Should we check your cash flow?' })).toHaveClass('min-h-11');
  });
});
