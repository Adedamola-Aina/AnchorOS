/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FabricInsightCard } from './FabricInsightCard';

const logProductEvent = vi.fn();

vi.mock('../../services/telemetry', () => ({
  logProductEvent: (...args: unknown[]) => logProductEvent(...args),
}));

const insight = {
  id: 'insight-1',
  category: 'patterns',
  headline: 'You stayed consistent this week',
  detail: 'Completion trend improved by 12%.',
  trend: 'up',
  severity: 'positive',
  createdAt: '2026-03-16T12:00:00.000Z',
} as const;

describe('FabricInsightCard', () => {
  it('renders headline and detail', () => {
    render(<FabricInsightCard insight={insight} />);

    expect(screen.getByText('You stayed consistent this week')).toBeInTheDocument();
    expect(screen.getByText('Completion trend improved by 12%.')).toBeInTheDocument();
  });

  it('logs viewed event on mount', () => {
    render(<FabricInsightCard insight={insight} />);

    expect(logProductEvent).toHaveBeenCalledWith('fabric_insight_viewed', {
      insightId: 'insight-1',
      category: 'patterns',
      severity: 'positive',
    });
  });

  it('renders dismiss action and logs dismiss event', () => {
    const onDismiss = vi.fn();
    render(<FabricInsightCard insight={insight} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(logProductEvent).toHaveBeenCalledWith('fabric_insight_dismissed', {
      insightId: 'insight-1',
      category: 'patterns',
    });
    expect(onDismiss).toHaveBeenCalledWith('insight-1');
  });

  it('does not crash when telemetry throws', () => {
    logProductEvent.mockImplementation(() => {
      throw new Error('telemetry-down');
    });

    expect(() => render(<FabricInsightCard insight={insight} onDismiss={vi.fn()} />)).not.toThrow();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  });

  it('renders reasoning when provided', () => {
    const withReasoning = {
      ...insight,
      reasoning: 'Based on 30 days of transaction history across 47 expenses.',
    };
    render(<FabricInsightCard insight={withReasoning} />);
    expect(screen.getByText('Based on 30 days of transaction history across 47 expenses.')).toBeInTheDocument();
  });

  it('does not render reasoning section when absent', () => {
    render(<FabricInsightCard insight={insight} />);
    expect(screen.queryByTestId('insight-reasoning')).not.toBeInTheDocument();
  });
});