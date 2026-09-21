/**
 * HomeAnchorSection — the assistant's substance, on Home.
 *
 * What was wrong: UX-AI-09 removed Anchor from the bottom nav on the promise
 * that it "belongs inside Home, not in the bar" — but Home then carried only a
 * pill that navigated to the assistant's own page. So the assistant contributed
 * nothing to the dashboard, and the user had to leave Home to get any value out
 * of it at all. That is the opposite of the intent.
 *
 * What this is: the assistant's output, in place, where the user already looks —
 * how today's commitments stand, and the insights it has surfaced about their
 * money and their commitments. The full assistant stays one tap away for
 * questions, but reading requires no navigation.
 *
 * `insights` is capped at 3 and ranked upstream (UX-AI-01), so Home shows the
 * same top-of-list the assistant page does.
 */
// @ts-nocheck

import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import type { Insight } from '../../../types';
import type { TodayStats } from '../../../types/fabricBriefing';
import { FabricInsightCard } from '../../fabric/FabricInsightCard';
import { FabricTodayCard } from '../../fabric/FabricTodayCard';

interface HomeAnchorSectionProps {
  /** Undefined until the assistant has produced a briefing. */
  todayStats?: TodayStats | null;
  insights?: Insight[] | null;
  onOpenCommitments: () => void;
  onOpenAssistant: () => void;
}

export const HomeAnchorSection: React.FC<HomeAnchorSectionProps> = ({
  todayStats,
  insights,
  onOpenCommitments,
  onOpenAssistant,
}) => {
  const topInsights = (insights ?? []).slice(0, 3);

  return (
    <section data-testid="home-anchor" className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-primary-500" aria-hidden="true" />
          Anchor AI
        </p>
        <button
          type="button"
          onClick={onOpenAssistant}
          data-testid="home-anchor-open"
          className="inline-flex items-center gap-1 min-h-11 px-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
        >
          Ask a question
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {todayStats && <FabricTodayCard todayStats={todayStats} onOpenCommitments={onOpenCommitments} />}

      {topInsights.map((insight) => (
        <FabricInsightCard key={insight.id} insight={insight} />
      ))}
    </section>
  );
};