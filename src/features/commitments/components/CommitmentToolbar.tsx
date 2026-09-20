/**
 * CM-21 / CM-15 — the Commitments toolbar.
 *
 * The page used to lead with a cadence filter ("Daily/Weekly/…"), which is a
 * question about storage, not about the user's day. It now leads with the smart
 * views — Today, Overdue, This week, Later, Done — and search, so the first
 * thing on screen answers "what do I owe right now?".
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { SMART_VIEWS, type SmartViewId } from '../utils/smartViews';
import { describeQuickAdd, parseQuickAdd, type QuickAddDraft } from '../utils/parseQuickAdd';

interface SmartViewBarProps {
    view: SmartViewId;
    onViewChange: (view: SmartViewId) => void;
    /** Counts per view, so the bar states the size of each answer. */
    counts: Partial<Record<SmartViewId, number>>;
}

export const SmartViewBar: React.FC<SmartViewBarProps> = ({ view, onViewChange, counts }) => (
    <div className="flex flex-col gap-1.5">
        <span id="commitments-view-label" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Show me
        </span>
        <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-labelledby="commitments-view-label"
            data-testid="smart-view-bar"
        >
            {SMART_VIEWS.map((entry) => {
                const isActive = view === entry.id;
                const count = counts[entry.id];
                return (
                    <Button
                        key={entry.id}
                        onClick={() => onViewChange(entry.id)}
                        variant={isActive ? 'primary' : 'secondary'}
                        size="sm"
                        aria-pressed={isActive}
                        aria-label={`${entry.label} — ${entry.description}`}
                        className="min-h-[44px] text-[11px] uppercase tracking-widest"
                    >
                        {entry.label}
                        {typeof count === 'number' && count > 0 && (
                            <span className="ml-1.5 text-[10px] font-black opacity-70">{count}</span>
                        )}
                    </Button>
                );
            })}
        </div>
    </div>
);

interface QuickAddBarProps {
    /** CM-16: save the parsed draft straight away (it is undoable). */
    onSave: (draft: QuickAddDraft) => void;
    /** CM-16: open the composer with the draft pre-filled, to adjust it. */
    onAdjust: (draft: QuickAddDraft) => void;
    now?: Date;
}

/**
 * CM-16 — instant add.
 *
 * One line at the top of Commitments: "Pay rent Fri 9am" becomes a weekly
 * commitment with a Friday reminder, and "Read 15m daily" a daily one. The parse
 * is shown back before it is saved, so nothing is captured by surprise, and
 * "Adjust" hands the same draft to the full composer.
 */
export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onSave, onAdjust, now }) => {
    const [line, setLine] = React.useState('');
    const [draft, setDraft] = React.useState<QuickAddDraft | null>(null);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        const parsed = parseQuickAdd(line, now ?? new Date());
        if (!parsed) return;
        setDraft(parsed);
    };

    const reset = () => { setDraft(null); setLine(''); };

    return (
        <form onSubmit={submit} className="flex flex-col gap-2" data-testid="quick-add">
            <label htmlFor="quick-add-input" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Quick add
            </label>
            <div className="flex gap-2">
                <input
                    id="quick-add-input"
                    value={line}
                    onChange={(event) => { setLine(event.target.value); setDraft(null); }}
                    placeholder="Pay rent Fri 9am · Read 15m daily"
                    className="flex-1 min-h-[44px] px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500"
                />
                <Button type="submit" variant="secondary" className="min-h-[44px]" disabled={!line.trim()}>
                    Add
                </Button>
            </div>
            {draft && (
                <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700" data-testid="quick-add-preview">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                        <strong className="font-semibold text-slate-800 dark:text-white">{draft.title}</strong>
                        {describeQuickAdd(draft) && <span> · {describeQuickAdd(draft)}</span>}
                    </span>
                    <div className="flex items-center gap-1 ml-auto">
                        <Button type="button" size="sm" className="min-h-[44px]" onClick={() => { onSave(draft); reset(); }}>Save</Button>
                        <Button type="button" size="sm" variant="secondary" className="min-h-[44px]" onClick={() => { onAdjust(draft); reset(); }}>Adjust</Button>
                    </div>
                </div>
            )}
        </form>
    );
};

interface CommitmentSearchFieldProps {
    value: string;
    onChange: (value: string) => void;
    /** What the current query matched, so the field reports its own effect. */
    resultCount: number;
}

/** CM-15: search across title, notes and area — labelled, clearable, 44px. */
export const CommitmentSearchField: React.FC<CommitmentSearchFieldProps> = ({ value, onChange, resultCount }) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor="commitment-search" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Find
        </label>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <input
                id="commitment-search"
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search commitments, notes or area"
                className="w-full min-h-[44px] pl-9 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    <X className="w-4 h-4" aria-hidden="true" />
                </button>
            )}
        </div>
        {value.trim() && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400" role="status" data-testid="search-result-count">
                {resultCount === 0
                    ? `No commitments match “${value.trim()}”.`
                    : `${resultCount} ${resultCount === 1 ? 'match' : 'matches'} for “${value.trim()}”.`}
            </p>
        )}
    </div>
);
