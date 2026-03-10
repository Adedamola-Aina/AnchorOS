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

vi.mock('../../context/AnchorContext', () => ({
  useApp: () => ({ navigateTo: vi.fn() }),
}));

vi.mock('./FabricPromptChips', () => ({
  FabricPromptChips: () => <div data-testid="prompt-chips">chips</div>,
}));

const baseHook = {
  isEnabled: true,
  isReady: true,
  context: { timeOfDay: 'morning' as const },
  patterns: [{ id: 'p-1' }],
  insights: [],
  predictions: [],
  lastQueryResult: null,
  weeklyReport: null,
  dismissPrediction: vi.fn(),
  runQuery,
  generateWeeklyReport,
};

describe('FabricView', () => {
  it('shows disabled state when Anchor AI is off', () => {
    useFabricMock.mockReturnValue({ ...baseHook, isEnabled: false, isReady: false, patterns: [] });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText('Anchor AI is disabled. Enable it in Settings to view your assistant tab.')).toBeInTheDocument();
  });

  it('shows onboarding when there are no patterns', () => {
    useFabricMock.mockReturnValue({ ...baseHook, patterns: [] });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText("Hey! I'm Anchor AI.")).toBeInTheDocument();
  });

  it('does not render free-text chat input', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.queryByPlaceholderText('How much did I spend this month?')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Ask' })).not.toBeInTheDocument();
  });

  it('merges briefing context into header subtitle', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText(/Good morning/)).toBeInTheDocument();
    // No dedicated "Daily briefing" section card
    expect(screen.queryByText('Daily briefing')).not.toBeInTheDocument();
  });

  it('renders predictions section when predictions exist', () => {
    useFabricMock.mockReturnValue({
      ...baseHook,
      predictions: [{ id: 'pred-1', message: 'Budget alert', detail: 'Spending is up', confidence: 0.8 }],
    });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText('Budget alert')).toBeInTheDocument();
    expect(screen.getByText('Spending is up')).toBeInTheDocument();
  });

  it('renders prompt chips as quick actions', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByTestId('prompt-chips')).toBeInTheDocument();
    expect(screen.getByText('Quick actions')).toBeInTheDocument();
  });

  it('shows weekly report when generated', () => {
    useFabricMock.mockReturnValue({
      ...baseHook,
      weeklyReport: {
        financeSummary: { totalIncome: 1000, totalSpent: 500 },
        commitmentSummary: { completionRate: 80 },
      },
    });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText('Weekly Snapshot')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Generate weekly report' }));
    expect(generateWeeklyReport).toHaveBeenCalled();
  });
});
