// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DashboardView from './DashboardView';

const navigateTo = vi.fn();
let fabricState: Record<string, unknown> = {};

vi.mock('../../context/AnchorContext', () => ({ useApp: () => ({ navigateTo }) }));
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ profile: { name: 'Test Captain' }, user: { uid: 'u1' } }),
}));
vi.mock('../../context/FinanceContext', () => ({
  useFinance: () => ({ accounts: [], recentActivity: [], cashFlow: null, refetch: vi.fn() }),
}));
vi.mock('../../context/TaskContext', () => ({ useTasks: () => ({ tasks: [] }) }));
vi.mock('../../hooks/useResponsive', () => ({ useResponsive: () => ({ isMobile: false }) }));
vi.mock('../../hooks/useHaptic', () => ({ useHaptic: () => ({ trigger: vi.fn() }) }));
vi.mock('../../hooks/useFabric', () => ({ useFabric: () => fabricState }));
vi.mock('../../hooks/queries/useGoalsQuery', () => ({
  useGoalsQuery: () => ({ data: [], isLoading: false }),
}));
vi.mock('./hooks/useBeyondBasics', () => ({
  useBeyondBasics: () => ({ allComplete: true, items: [], completedCount: 0, totalCount: 0 }),
}));

// Heavy children are irrelevant to these findings — stub them so the test
// asserts the *Home shell* contract, not widget internals.
vi.mock('./components/DashboardWidgets', () => ({
  PortfolioWidget: () => null,
  CashFlowWidget: () => null,
  RecentActivityWidget: () => null,
  ProductivityWidget: () => null,
  TodaysFocusWidget: () => null,
}));
vi.mock('./components/AssetAllocationWidget', () => ({ AssetAllocationWidget: () => null }));
vi.mock('./components/GoalProgressCard', () => ({ GoalProgressCard: () => null }));
vi.mock('./components/BeyondBasicsChecklist', () => ({ BeyondBasicsChecklist: () => null }));
vi.mock('../../components/mobile/PullToRefresh', () => ({
  PullToRefresh: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('../fabric/FabricMoodCard', () => ({
  FabricMoodCard: () => <div data-testid="mood-card">mood</div>,
}));
// The assistant's cards are stubbed so these tests assert *Home's* contract
// (that the substance is rendered in place), not the cards' internals.
vi.mock('../fabric/FabricTodayCard', () => ({
  FabricTodayCard: () => <div data-testid="home-today-card">today</div>,
}));
vi.mock('../fabric/FabricInsightCard', () => ({
  FabricInsightCard: ({ insight }: { insight: { id: string; headline: string } }) => (
    <div data-testid={`home-insight-${insight.id}`}>{insight.headline}</div>
  ),
}));

describe('DashboardView — Home shell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fabricState = {
      isEnabled: true,
      moodToday: null,
      saveMood: vi.fn(),
      briefing: { todayStats: { totalTasks: 4, completedTasks: 1, pendingTasks: 3, trackedCommitments: 4 } },
      insights: [
        { id: 'i1', headline: 'Transport spending is up 20%', detail: 'detail', trend: 'up', category: 'spending', severity: 'medium' },
        { id: 'i2', headline: 'You have missed 2 commitments', detail: 'detail', trend: 'down', category: 'consistency', severity: 'high' },
        { id: 'i3', headline: 'Savings target on track', detail: 'detail', trend: 'stable', category: 'savings', severity: 'low' },
        { id: 'i4', headline: 'A fourth insight that must not appear on Home', detail: 'detail', trend: 'stable', category: 'savings', severity: 'low' },
      ],
    };
  });

  // ─── UX-GL-02: exactly one settings entry point ──────────────────────────
  it('does not offer a second Settings entry point (UX-GL-02)', () => {
    render(<DashboardView />);

    // The dashboard gear used to live here; Settings is reachable from the nav
    // only, so any contextual need must deep-link to a Settings *section*.
    expect(screen.queryByTestId('settings-pill')).toBeNull();
  });

  // ─── UX-AI-09: Anchor belongs inside Home, not in the bar ────────────────
  it('carries the doorway to the assistant when it is enabled (UX-AI-09)', () => {
    render(<DashboardView />);

    const doorway = screen.getByTestId('ask-anchor-doorway');
    expect(doorway).toBeInTheDocument();

    fireEvent.click(doorway);
    expect(navigateTo).toHaveBeenCalledWith('fabric');
  });

  it('hides the doorway when the assistant is switched off', () => {
    fabricState = { isEnabled: false, moodToday: null, saveMood: vi.fn() };
    render(<DashboardView />);

    expect(screen.queryByTestId('ask-anchor-doorway')).toBeNull();
  });

  // ─── UX-AI-04: mood relocates out of the assistant ───────────────────────
  it('renders the mood check-in on Home (UX-AI-04)', () => {
    render(<DashboardView />);

    expect(screen.getByTestId('home-mood-section')).toBeInTheDocument();
    expect(screen.getByTestId('mood-card')).toBeInTheDocument();
  });

  it('does not render a mood check-in while the assistant is off', () => {
    fabricState = { isEnabled: false, moodToday: null, saveMood: vi.fn() };
    render(<DashboardView />);

    expect(screen.queryByTestId('home-mood-section')).toBeNull();
  });

  // ─── The assistant's substance, in place on Home ─────────────────────────
  it('renders the assistant briefing and its top insights on Home, in place', () => {
    render(<DashboardView />);

    expect(screen.getByTestId('home-anchor')).toBeInTheDocument();
    expect(screen.getByTestId('home-today-card')).toBeInTheDocument();

    // Reading Anchor's view of your commitments and money costs no navigation.
    expect(screen.getByTestId('home-insight-i1')).toBeInTheDocument();
    expect(screen.getByTestId('home-insight-i2')).toBeInTheDocument();
    expect(screen.getByTestId('home-insight-i3')).toBeInTheDocument();
    // Home shows the same ranked top-of-list the assistant page shows.
    expect(screen.queryByTestId('home-insight-i4')).toBeNull();
  });

  it('keeps the full assistant one tap away from Home', () => {
    render(<DashboardView />);

    fireEvent.click(screen.getByTestId('home-anchor-open'));
    expect(navigateTo).toHaveBeenCalledWith('fabric');
  });

  it('shows no assistant substance on Home while it is switched off', () => {
    fabricState = { isEnabled: false, moodToday: null, saveMood: vi.fn() };
    render(<DashboardView />);

    expect(screen.queryByTestId('home-anchor')).toBeNull();
    expect(screen.queryByTestId('home-today-card')).toBeNull();
  });
});
