/**
 * CM-15 / CM-16 / CM-29 — the Commitments find-or-add field.
 *
 * One field, two jobs: what you type filters what you already have, and when the same
 * text reads as something new, it offers to become it. That property is worth keeping.
 *
 * What it used to do is not: a synthetic result row appeared among the matches with two
 * unlabelled verbs, **Add** and **Adjust**. "Add" silently persisted whatever was in the
 * field — including a single character — and "Adjust" was a different word for the same
 * intent. Creation was merged into the result list, so it read as one of the things you
 * already had.
 *
 * Now:
 *   - matches are the list below (nothing synthetic is injected into them),
 *   - creation is its own labelled block, "Create new", with the interpretation shown
 *     before anything is persisted,
 *   - the primary action is named for what it does — `Create`, `Continue setup` (a
 *     cadence that still needs a day), or `Edit details` (when the text is not a
 *     schedule v1 can claim),
 *   - nothing is created by typing, and nothing is created by Enter.
 */
import React, { useRef } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { describeCadence, describeQuickAdd, isDirectlyCreatable, type CommitmentIntent } from '../utils/parseQuickAdd';

interface CommitmentFindOrAddProps {
    /** One value, two jobs: it filters the list *and* it is read for a new commitment. */
    value: string;
    onChange: (value: string) => void;
    /** What the current text matched, so the field reports its own effect. */
    resultCount: number;
    /** The reading of the current text, parsed by the caller (one parse, one source). */
    intent: CommitmentIntent | null;
    /** Direct creation — only ever offered for a complete, deterministic reading. */
    onCreateDraft: (intent: CommitmentIntent) => void;
    /** Opens the existing composer with every recognised field pre-filled. */
    onEditDetails: (intent: CommitmentIntent) => void;
}

export const CommitmentFindOrAdd: React.FC<CommitmentFindOrAddProps> = ({
    value,
    onChange,
    resultCount,
    intent,
    onCreateDraft,
    onEditDetails,
}) => {
    const query = value.trim();
    const primaryActionRef = useRef<HTMLButtonElement>(null);

    const canCreateDirectly = isDirectlyCreatable(intent);
    const needsSetup = !!intent && intent.missing.length > 0;

    /**
     * Enter never persists. It moves focus to the one action this text offers, so the
     * keyboard does something useful and the user still makes the decision — a partial
     * line such as "g" can never become a commitment by pressing a key.
     */
    const submit = (event: React.FormEvent) => {
        event.preventDefault();
        primaryActionRef.current?.focus();
    };

    /**
     * What the block promises. A fallback says nothing about the schedule (it cannot),
     * so it asks for the details instead of claiming "One-off".
     */
    const summary = !intent || intent.confidence === 'fallback'
        ? ''
        : (describeQuickAdd(intent) || describeCadence(intent.type));

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor="commitment-find" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Find or add
            </label>
            <form onSubmit={submit} role="search">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                    <input
                        id="commitment-find"
                        type="search"
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder="Find a commitment, or type a new one"
                        data-testid="commitment-find-or-add"
                        /*
                         * Always "search": Enter no longer submits anything, so the key
                         * must not promise "done". It moves focus to the action the text
                         * offers, and the user still decides.
                         */
                        enterKeyHint="search"
                        className="w-full min-h-[44px] pl-9 pr-10 rounded-card border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            aria-label="Clear the search"
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </form>

            {query && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400" role="status" data-testid="search-result-count">
                    {resultCount === 0
                        ? `No commitments found for “${query}”`
                        : `${resultCount} ${resultCount === 1 ? 'match' : 'matches'} for “${query}”`}
                </p>
            )}

            {intent && (
                <section aria-labelledby="create-new-heading" data-testid="create-new" className="mt-1">
                    <h3 id="create-new-heading" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Create new
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 px-3 py-2 rounded-card bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <span className="min-w-0 flex-1 text-xs text-slate-600 dark:text-slate-300">
                            <strong className="font-semibold text-slate-800 dark:text-white">
                                + Create “{intent.title}”
                            </strong>
                            <span className="block text-[11px] text-slate-500 dark:text-slate-400" data-testid="create-summary">
                                {summary || 'Set schedule and details'}
                            </span>
                        </span>
                        <div className="flex items-center gap-1">
                            {canCreateDirectly && (
                                <Button
                                    ref={primaryActionRef}
                                    type="button"
                                    size="sm"
                                    className="min-h-[44px]"
                                    data-testid="create-commitment"
                                    onClick={() => onCreateDraft(intent)}
                                >
                                    Create
                                </Button>
                            )}
                            <Button
                                ref={canCreateDirectly ? undefined : primaryActionRef}
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="min-h-[44px]"
                                data-testid="edit-details"
                                onClick={() => onEditDetails(intent)}
                            >
                                {needsSetup ? 'Continue setup' : 'Edit details'}
                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};