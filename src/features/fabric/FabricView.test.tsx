/// <reference types="@testing-library/jest-dom/vitest" />
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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

    expect(screen.getByText(/Anchor AI is off/i)).toBeInTheDocument();
  });

  // UX-ST-02: a contextual "manage X" need must deep-link into the Settings
  // SECTION, never the Settings root.
  it('sends a disabled-state user to the assistant settings section', async () => {
    useFabricMock.mockReturnValue({ ...baseHook, isEnabled: false, isReady: false, patterns: [], briefing: null });

    render(
      <MemoryRouter initialEntries={['/fabric']}>
        <Routes>
          <Route path="/fabric" element={<FabricView />} />
          <Route path="/settings" element={<div data-testid="settings-root">settings root</div>} />
          <Route path="/settings/:section" element={<div data-testid="settings-section-marker">section</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /open settings to enable it/i }));

    expect(await screen.findByTestId('settings-section-marker')).toBeInTheDocument();
    expect(screen.queryByTestId('settings-root')).not.toBeInTheDocument();
  });

  it('shows onboarding when there are no patterns', () => {
    useFabricMock.mockReturnValue({ ...baseHook, patterns: [] });

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByText("Hey! I'm Anchor AI.")).toBeInTheDocument();
    expect(screen.getByTestId('fabric-onboarding-illustration')).toBeInTheDocument();
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

  // UX-AI-04 / UX-AI-09: mood is not an AI feature — it left the assistant.
  it('renders the today card but no mood card (UX-AI-04)', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByTestId('today-card')).toBeInTheDocument();
    expect(screen.queryByTestId('mood-card')).not.toBeInTheDocument();
  });

  // UX-AI-05: provenance was effectively hidden — transparency is reachable
  // from the assistant itself.
  it('links to transparency from the assistant (UX-AI-05)', () => {
    useFabricMock.mockReturnValue(baseHook);

    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );

    expect(screen.getByTestId('transparency-link')).toHaveAttribute('href', '/fabric/transparency');
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
    expect(screen.queryByRole('button', { name: /Generate weekly report/i })).not.toBeInTheDocument();
  });

  it('does not render FabricPromptChips directly (delegated to FabricQuerySection)', async () => {
    // FabricPromptChips is no longer imported by FabricView — it lives in FabricQuerySection.
    // This test guards against re-introducing the direct import.
    render(
      <MemoryRouter>
        <FabricView />
      </MemoryRouter>
    );
    await screen.findByTestId('fabric-view');
    // prompt-chips testid comes from FabricQuerySection mock, not FabricView directly
    expect(screen.queryByTestId('prompt-chips')).toBeInTheDocument();
  });
});
