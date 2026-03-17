/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FabricView from './FabricView';

const useFabricMock = vi.fn();
const runQuery = vi.fn(async () => ({ summary: 'ok', visualizable: false, data: null, actions: [] }));
const generateWeeklyReport = vi.fn(async () => null);
const saveMood = vi.fn(async () => undefined);

vi.mock('../../hooks/useFabric', () => ({
  useFabric: () => useFabricMock(),
}));

vi.mock('../../context/AnchorContext', () => ({
  useApp: () => ({ navigateTo: vi.fn() }),
}));

vi.mock('./FabricPromptChips', () => ({
  FabricPromptChips: () => <div data-testid="prompt-chips">chips</div>,
}));

vi.mock('./FabricTodayCard', () => ({
  FabricTodayCard: () => <div data-testid="today-card">today</div>,
}));

vi.mock('./FabricMoodCard', () => ({
  FabricMoodCard: () => <div data-testid="mood-card">mood</div>,
}));

vi.mock('./FabricUpcomingCard', () => ({
  FabricUpcomingCard: () => <div data-testid="upcoming-card">upcoming</div>,
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
  briefing: {
    greeting: 'Good morning',
    subtitle: '3 tasks remaining',
    todayStats: { totalTasks: 3, completedTasks: 0, pendingTasks: 3 },
    upcoming: [],
    spendingThisWeek: 0,
    currency: 'USD',
    generatedAt: new Date().toISOString(),
  },
  moodToday: null,
  learnFrom: vi.fn(),
  dismissPrediction: vi.fn(),
  runQuery,
  generateWeeklyReport,
  saveMood,
};

describe('FabricView', () => {
  it('shows disabled state when Anchor AI is off', () => {
    useFabricMock.mockReturnValue({ ...baseHook, isEnabled: false, isReady: false, patterns: [], briefing: null });

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

  it('renders free-text chat input', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('What do I have today? Plan my week...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
  });

  it('shows Anchor AI title and briefing subtitle in header', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText('Anchor AI')).toBeInTheDocument();
    expect(screen.getByText('3 tasks remaining')).toBeInTheDocument();
  });

  it('renders today card and mood card', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByTestId('today-card')).toBeInTheDocument();
    expect(screen.getByTestId('mood-card')).toBeInTheDocument();
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
    expect(screen.getByText('Ask Anchor AI')).toBeInTheDocument();
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
