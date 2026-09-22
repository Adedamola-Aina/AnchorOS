// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DashboardView from './DashboardView';

const navigateTo = vi.fn();
let fabricState: Record<string, unknown> = {};
/** Commitments the mocked TaskContext hands to Home (CM-30 tests set this). */
let taskState: { tasks: unknown[] } = { tasks: [] };

vi.mock('../../context/AnchorContext', () => ({ useApp: () => ({ navigateTo }) }));
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ profile: { name: 'Test Captain' }, user: { uid: 'u1' } }),
}));
vi.mock('../../context/FinanceContext', () => ({
  useFinance: () => ({ accounts: [], recentActivity: [], cashFlow: null, refetch: vi.fn() }),
}));
vi.mock('../../context/TaskContext', () => ({ useTasks: () => ({ tasks: taskState.tasks }) }));
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
    /**
     * CM-30: freeze the clock so "today" is a known Sunday, and give Home a workload
     * whose arithmetic the brief can be held to: two scheduled today (one done) and two
     * carried over from earlier days.
     */
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 20, 9, 0, 0));
    const base = { category: 'personal', createdAt: new Date('2026-01-01') };
    taskState = {
      tasks: [
        { ...base, id: 't1', title: 'Daily one', type: 'daily', completed: false },
        { ...base, id: 't2', title: 'Daily two', type: 'daily', completed: true, lastCompletedAt: new Date(2026, 8, 20, 8, 0, 0) },
        { ...base, id: 't3', title: 'Monday slot', type: 'weekly', daysOfWeek: [1], completed: false },
        { ...base, id: 't4', title: 'Wednesday slot', type: 'weekly', daysOfWeek: [3], completed: false },
      ],
    };
    fabricState = {
      isEnabled: true,
      moodToday: null,
      saveMood: vi.fn(),
      briefing: { todayStats: { totalTasks: 4, completedTasks: 1, pendingTasks: 3, trackedCommitments: 4 } },
      insights: [
        { id: 'i1', headline: 'Transport spending is up 20%', detail: 'detail', reasoning: 'From your last 30 days of transactions.', trend: 'up', category: 'spending', severity: 'positive', actionLink: '/finance', createdAt: '2026-09-20T09:00:00.000Z' },
        { id: 'i2', headline: 'You have missed 2 commitments', detail: 'detail', reasoning: 'Counted against your schedule.', trend: 'down', category: 'commitments', severity: 'attention', actionLink: '/commitments', createdAt: '2026-09-20T09:00:00.000Z' },
      ],
    };
  });

  afterEach(() => vi.useRealTimers());

  // ─── UX-GL-02: exactly one settings entry point ──────────────────────────
  it('does not offer a second Settings entry point (UX-GL-02)', () => {
    render(<DashboardView />);

    // The dashboard gear used to live here; Settings is reachable from the nav
    // only, so any contextual need must deep-link to a Settings *section*.
    expect(screen.queryByTestId('settings-pill')).toBeNull();
  });

  // ─── CM-30: the dashboard's own intelligence, in place ───────────────────
  it('states the count relationship instead of printing competing totals', () => {
    render(<DashboardView />);

    // Deterministic product logic: today's brief needs no assistant.
    const brief = screen.getByTestId('home-today-brief');
    expect(brief).toHaveTextContent('3 still to do');
    expect(brief).toHaveTextContent('4 due today');
    expect(brief).toHaveTextContent('2 scheduled for today');
    expect(brief).toHaveTextContent('2 carried over');
    expect(screen.getByTestId('home-today-progress')).toHaveTextContent('1 of 4 done');
  });

  it('renders the assistant interpretation in place, with its provenance on demand', () => {
    render(<DashboardView />);

    const insight = screen.getByTestId('home-insight');
    expect(insight).toBeInTheDocument();
    expect(screen.getByTestId('home-insight-summary')).toBeInTheDocument();
    expect(screen.queryByTestId('home-insight-provenance')).toBeNull();

    fireEvent.click(screen.getByTestId('home-insight-why'));
    expect(screen.getByTestId('home-insight-provenance')).toBeInTheDocument();
  });

  it('keeps the conversational entry point one tap away', () => {
    render(<DashboardView />);

    fireEvent.click(screen.getByTestId('home-ask-anchor-open'));
    expect(navigateTo).toHaveBeenCalledWith('fabric');
  });

  it('dismisses an insight instead of showing the same one again', () => {
    render(<DashboardView />);
    expect(screen.getByTestId('home-insight-title')).toHaveTextContent('You have missed 2 commitments');

    fireEvent.click(screen.getByTestId('home-insight-dismiss'));

    // The dismissed reading is gone. A *different* one may take its place — that is the
    // point of ranking: dismissing is not the same as emptying the card.
    expect(screen.queryByText('You have missed 2 commitments')).toBeNull();
  });

  it('renders no insight card when there is nothing worth saying', () => {
    fabricState = { isEnabled: true, moodToday: null, saveMood: vi.fn(), insights: [], briefing: null };
    render(<DashboardView />);

    expect(screen.queryByTestId('home-insight')).toBeNull();
  });

  it('shows no assistant surfaces while it is switched off — but Home stays useful', () => {
    fabricState = { isEnabled: false, moodToday: null, saveMood: vi.fn() };
    render(<DashboardView />);

    expect(screen.queryByTestId('home-ask-anchor')).toBeNull();
    expect(screen.queryByTestId('ask-anchor-doorway')).toBeNull();
    // The deterministic half is not an assistant feature and does not disappear.
    expect(screen.getByTestId('home-today')).toBeInTheDocument();
    expect(screen.getByTestId('home-today-brief')).toBeInTheDocument();
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
  it('shows one ranked interpretation rather than a feed of cards', () => {
    render(<DashboardView />);

    // Attention outranks good news, and only the top reading is shown.
    expect(screen.getByTestId('home-insight-title')).toHaveTextContent('You have missed 2 commitments');
    expect(screen.queryByText('Transport spending is up 20%')).toBeNull();
  });

  it('shows no assistant substance on Home while it is switched off', () => {
    fabricState = { isEnabled: false, moodToday: null, saveMood: vi.fn() };
    render(<DashboardView />);

    expect(screen.queryByTestId('home-anchor')).toBeNull();
    expect(screen.queryByTestId('home-today-card')).toBeNull();
  });
});
