import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FabricView from './FabricView';

const useFabricMock = vi.fn();
const runQuery = vi.fn(async () => ({ summary: 'ok', visualizable: false, data: null, actions: [] }));
const generateWeeklyReport = vi.fn(async () => null);

vi.mock('../../hooks/useFabric', () => ({
  useFabric: () => useFabricMock(),
}));

vi.mock('./FabricPromptChips', () => ({
  FabricPromptChips: () => <div data-testid="prompt-chips">chips</div>,
}));

describe('FabricView', () => {
  it('shows disabled state when Anchor AI is off', () => {
    useFabricMock.mockReturnValue({
      isEnabled: false,
      isReady: false,
      context: { timeOfDay: 'morning' },
      patterns: [],
      insights: [],
      predictions: [],
      lastQueryResult: null,
      weeklyReport: null,
      dismissPrediction: vi.fn(),
      runQuery,
      generateWeeklyReport,
    });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText('Anchor AI is disabled. Enable it in Settings to view your assistant tab.')).toBeInTheDocument();
  });

  it('shows onboarding and prompt chips when there are no patterns', () => {
    useFabricMock.mockReturnValue({
      isEnabled: true,
      isReady: true,
      context: { timeOfDay: 'morning' },
      patterns: [],
      insights: [],
      predictions: [],
      lastQueryResult: null,
      weeklyReport: null,
      dismissPrediction: vi.fn(),
      runQuery,
      generateWeeklyReport,
    });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText("Hey! I'm Anchor AI.")).toBeInTheDocument();
    expect(screen.getByTestId('prompt-chips')).toBeInTheDocument();
  });

  it('submits freeform query and can trigger weekly report generation', () => {
    useFabricMock.mockReturnValue({
      isEnabled: true,
      isReady: true,
      context: { timeOfDay: 'morning' },
      patterns: [{ id: 'p-1' }],
      insights: [],
      predictions: [],
      lastQueryResult: null,
      weeklyReport: null,
      dismissPrediction: vi.fn(),
      runQuery,
      generateWeeklyReport,
    });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('How much did I spend this month?'), { target: { value: 'how much did i spend this month' } });
    fireEvent.click(screen.getByRole('button', { name: 'Ask' }));
    fireEvent.click(screen.getByRole('button', { name: 'Generate weekly report' }));

    expect(runQuery).toHaveBeenCalledWith('how much did i spend this month');
    expect(generateWeeklyReport).toHaveBeenCalled();
  });
});
