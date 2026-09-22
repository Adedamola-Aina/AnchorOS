/**
 * The one insight Home shows.
 *
 * Home previously rendered up to three assistant insights in a block headed
 * "Anchor AI", which read as a chatbot feed rather than as the dashboard being
 * intelligent — and the card the user actually saw first was a count they had already
 * read two inches above it.
 *
 * The rule here: pick the single most useful *interpretation* available from real data,
 * rank it, and say why it matters. Nothing is fabricated — if no insight clears the bar,
 * this returns null and Home renders no insight card at all (an empty card is worse than
 * no card, because it teaches the user that "Anchor" has nothing to say).
 *
 * `reasoning` and `evidence` are carried through from whichever source produced the
 * reading, so "Why?" can show the user exactly what it looked at.
 */
import type { Insight } from '../../../types/fabric';
import type { TodayCommitmentsView } from '../todayCommitments';

export interface HomeInsightAction {
    label: string;
    href: string;
}

export interface HomeInsight {
    /** Stable identity, so a dismissal can be remembered. */
    id: string;
    /** `attention` earns the top slot; `positive` is shown only when nothing needs it. */
    severity: 'attention' | 'positive' | 'neutral';
    title: string;
    /** One sentence: what was noticed. */
    summary: string;
    /** Why it matters — the interpretation, not a restatement. */
    why: string;
    /** The numbers it looked at, as readable lines. */
    evidence: string[];
    actions: HomeInsightAction[];
    /** Where the reading came from, for provenance. */
    source: 'commitments' | 'assistant';
    generatedAt: string;
}

/** Workload at or above this, with this much of it carried over, is worth saying out loud. */
const HEAVY_REMAINING = 8;
const HEAVY_CARRIED = 3;

/**
 * A commitments reading built from the canonical today view.
 *
 * Deliberately restrained: it fires on a real, checkable condition (a heavy day that is
 * mostly carried-over work) rather than on a threshold invented to make a card appear.
 */
function commitmentsInsight(today: TodayCommitmentsView, now: Date): HomeInsight | null {
    if (today.remaining < HEAVY_REMAINING || today.carriedOver < HEAVY_CARRIED) return null;

    const carriedShare = Math.round((today.carriedOver / today.remaining) * 100);
    return {
        id: 'home-insight-overcommitment',
        severity: 'attention',
        title: 'Today is heavier than it looks',
        summary: `${today.remaining} commitments are still outstanding, and ${today.carriedOver} of them were carried over from an earlier day.`,
        why: `Carried-over work is what makes a day feel unmanageable, and it is ${carriedShare}% of what is left. Finishing the ${today.focusCount} priorities first would clear the part that has already waited longest.`,
        evidence: [
            `${today.dueTotal} due today`,
            `${today.scheduledToday} scheduled for today`,
            `${today.carriedOver} carried over`,
            `${today.completedToday} already done`,
        ],
        actions: [
            { label: 'Review commitments', href: '/commitments' },
        ],
        source: 'commitments',
        generatedAt: now.toISOString(),
    };
}

/** An assistant insight, adapted — its own reasoning is preserved, never paraphrased away. */
function fromAssistant(insight: Insight): HomeInsight {
    return {
        id: insight.id,
        severity: insight.severity,
        title: insight.headline,
        summary: insight.detail,
        why: insight.reasoning ?? 'Derived from your own activity in AnchorOS.',
        evidence: insight.metric
            ? [`${insight.metric.current}${insight.metric.unit} now`, `Trend: ${insight.trend}`]
            : [`Trend: ${insight.trend}`],
        actions: insight.actionLink ? [{ label: 'See the detail', href: insight.actionLink }] : [],
        source: 'assistant',
        generatedAt: insight.createdAt,
    };
}

export interface HomeInsightInput {
    today: TodayCommitmentsView;
    /** The assistant's own ranked insights, when Anchor AI is enabled. */
    insights?: Insight[] | null;
    /** Committed to by the user; a dismissed insight stays dismissed. */
    dismissedIds?: string[];
    now: Date;
}

export function selectHomeInsight({ today, insights, dismissedIds = [], now }: HomeInsightInput): HomeInsight | null {
    // Anything that needs attention outranks anything that is merely nice.
    const attention = (insights ?? []).find((insight) => insight.severity === 'attention');
    const candidates = [
        commitmentsInsight(today, now),
        attention ? fromAssistant(attention) : null,
        ...(insights ?? []).filter((insight) => insight.severity === 'positive').map(fromAssistant),
    ].filter((candidate): candidate is HomeInsight => candidate !== null)
        .filter((candidate) => !dismissedIds.includes(candidate.id));

    if (candidates.length === 0) return null;

    return candidates.sort((a, b) => {
        const rank = (insight: HomeInsight) => (insight.severity === 'attention' ? 0 : insight.severity === 'positive' ? 1 : 2);
        return rank(a) - rank(b);
    })[0];
}