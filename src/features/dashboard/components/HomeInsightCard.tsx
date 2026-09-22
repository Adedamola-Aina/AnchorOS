/**
 * HomeInsightCard — Anchor's interpretation, on Home (CM-30).
 *
 * Two things changed here. The heading is no longer "ANCHOR AI" over a card that links
 * elsewhere: the interpretation is rendered in place, so the dashboard is intelligent
 * rather than a doorway to something intelligent. And "Why?" is a disclosure on the card
 * itself, showing the exact numbers and source behind the sentence — provenance you can
 * open, not a promise of transparency.
 *
 * It renders nothing when there is no insight: an empty "Anchor" card teaches the user
 * that Anchor has nothing to say.
 */
import React, { useState } from 'react';
import { ChevronDown, Sparkles, X } from 'lucide-react';
import type { HomeInsight } from '../../../services/fabric/insights/homeInsight';

interface HomeInsightCardProps {
    insight: HomeInsight;
    onAction: (href: string) => void;
    onDismiss: (id: string) => void;
}

export const HomeInsightCard: React.FC<HomeInsightCardProps> = ({ insight, onAction, onDismiss }) => {
    const [showWhy, setShowWhy] = useState(false);
    const isAttention = insight.severity === 'attention';

    return (
        <section
            data-testid="home-insight"
            aria-labelledby="home-insight-title"
            className={`rounded-xl border p-4 space-y-2 ${isAttention
                ? 'border-warning-border bg-warning-surface'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
        >
            <div className="flex items-start gap-2">
                <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${isAttention ? 'text-warning' : 'text-primary-500'}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Anchor insight
                    </p>
                    <h2 id="home-insight-title" className="text-sm font-semibold text-slate-800 dark:text-white" data-testid="home-insight-title">
                        {insight.title}
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={() => onDismiss(insight.id)}
                    aria-label="Dismiss this insight"
                    data-testid="home-insight-dismiss"
                    className="w-11 h-11 -m-2 shrink-0 inline-flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200" data-testid="home-insight-summary">{insight.summary}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300" data-testid="home-insight-why-matters">{insight.why}</p>
            {/*
              * Deliberately not a negative margin trick: the disclosure is a normal
              * in-flow control with a 44px target.
              */}
            <button
                type="button"
                onClick={() => setShowWhy((open) => !open)}
                aria-expanded={showWhy}
                aria-controls="home-insight-provenance"
                data-testid="home-insight-why"
                className="inline-flex items-center gap-1 min-h-11 text-xs font-semibold text-primary-600 dark:text-primary-400"
            >
                {showWhy ? 'Hide details' : 'Why?'}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showWhy ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>

            {showWhy && (
                <div id="home-insight-provenance" data-testid="home-insight-provenance" className="rounded-lg bg-black/5 dark:bg-white/5 p-3 space-y-1.5">
                    <ul className="space-y-0.5">
                        {insight.evidence.map((line) => (
                            <li key={line} className="text-xs text-slate-600 dark:text-slate-300">{line}</li>
                        ))}
                    </ul>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        From {insight.source === 'assistant' ? 'Anchor’s own reading of your activity' : 'your commitments'}, generated{' '}
                        {new Date(insight.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.
                    </p>
                </div>
            )}

            {insight.actions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {insight.actions.map((action) => (
                        <button
                            key={action.href}
                            type="button"
                            onClick={() => onAction(action.href)}
                            data-testid="home-insight-action"
                            className="inline-flex items-center min-h-11 px-3 rounded-pill bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};