/**
 * CM-15 / CM-16 — the Commitments toolbar.
 *
 * There is one control here now: a single field that finds an existing commitment
 * *or* adds a new one.
 *
 * The "Show me" smart-view bar (Today / Overdue / This week / Later / Done / All)
 * used to sit above it — six more buttons whose views mostly restated what the
 * rows already say, and whose "Today" default meant a list with nothing due today
 * looked empty.
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { describeQuickAdd, parseQuickAdd, type QuickAddDraft } from '../utils/parseQuickAdd';

/**
 * CM-16 / CM-15 — one field that finds *or* adds.
 *
 * These were two adjacent full-width inputs: a "Find" search box and a separate
 * "Quick add" line, both asking the user to type a commitment title, stacked one
 * above the other. The platform pattern is a single field — what you type filters
 * what you already have, and when the same text reads as something new, it offers
 * to become it. Nothing is captured by surprise: the parse is shown back with its
 * cadence and schedule first, and Enter adds it.
 */
interface CommitmentFindOrAddProps {
    /** One value, two jobs: it filters the list *and* it is parsed for a new commitment. */
    value: string;
    onChange: (value: string) => void;
    /** What the current text matched, so the field reports its own effect. */
    resultCount: number;
    onSaveDraft: (draft: QuickAddDraft) => void;
    onAdjustDraft: (draft: QuickAddDraft) => void;
    now?: Date;
}

export const CommitmentFindOrAdd: React.FC<CommitmentFindOrAddProps> = ({
    value,
    onChange,
    resultCount,
    onSaveDraft,
    onAdjustDraft,
    now,
}) => {
    const query = value.trim();
    const draft = query ? parseQuickAdd(query, now ?? new Date()) : null;

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        // Enter adds the parsed commitment. The iOS keyboard fix only forces an
        // `enterkeyhint` when one is absent, so the hint is set here explicitly —
        // otherwise the key reads "done" and never submits.
        if (draft) onSaveDraft(draft);
    };

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor="commitment-find" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Find or add
            </label>
            <form onSubmit={submit}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                    <input
                        id="commitment-find"
                        type="search"
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder="Find a commitment, or type a new one"
                        data-testid="commitment-find-or-add"
                        enterKeyHint={draft ? 'done' : 'search'}
                        className="w-full min-h-[44px] pl-9 pr-10 rounded-card border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500"
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            aria-label="Clear"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </form>

            {query && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400" role="status" data-testid="search-result-count">
                    {resultCount === 0
                        ? `No commitments match “${query}”.`
                        : `${resultCount} ${resultCount === 1 ? 'match' : 'matches'} for “${query}”.`}
                </p>
            )}

            {draft && (
                <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-card bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" data-testid="quick-add-preview">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                        <strong className="font-semibold text-slate-800 dark:text-white">{draft.title}</strong>
                        {describeQuickAdd(draft) && <span> · {describeQuickAdd(draft)}</span>}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                        <Button type="button" size="sm" className="min-h-[44px]" onClick={() => onSaveDraft(draft)}>Add</Button>
                        <Button type="button" size="sm" variant="secondary" className="min-h-[44px]" onClick={() => onAdjustDraft(draft)}>Adjust</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

