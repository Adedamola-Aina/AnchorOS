/**
 * SubscriptionDetector — INN-002
 *
 * Analyses transaction history to surface recurring subscription charges.
 *
 * Algorithm:
 * 1. Normalize and group transactions by merchant title + exact amount.
 * 2. For each group with ≥2 occurrences, measure intervals between dates.
 * 3. Classify as monthly (28–33 days), quarterly (85–95), or annual (358–368).
 * 4. Score by consistency of interval ± tolerance.
 * 5. Return groups with confidence > MIN_CONFIDENCE as DetectedSubscription[].
 */

import type { AnchorTransaction } from '../../types';

export type SubscriptionFrequency = 'monthly' | 'quarterly' | 'annual';

export interface DetectedSubscription {
    title: string;
    amountCents: number;
    frequency: SubscriptionFrequency;
    /** 0–1: higher = more confident it's a subscription */
    confidence: number;
    transactionIds: string[];
    lastChargeDate: string;
    /** ISO date string for next expected charge */
    nextExpectedDate: string;
}

const MIN_OCCURRENCES = 2;
const MIN_CONFIDENCE = 0.5;

interface FrequencySpec {
    name: SubscriptionFrequency;
    minDays: number;
    maxDays: number;
    nominalDays: number;
}

const FREQUENCIES: FrequencySpec[] = [
    { name: 'monthly', minDays: 26, maxDays: 35, nominalDays: 30 },
    { name: 'quarterly', minDays: 85, maxDays: 97, nominalDays: 91 },
    { name: 'annual', minDays: 355, maxDays: 375, nominalDays: 365 },
];

/** Normalize a transaction title to a canonical merchant key. */
export function normalizeTitle(raw: string): string {
    return raw
        .toLowerCase()
        .replace(/\*/g, '')           // Remove asterisks (e.g. *Prime Video)
        .replace(/\.com\/?/g, '') // Strip .com and optional trailing slash, preserve rest of path
        .replace(/\s+/g, ' ')
        .trim();
}

function daysBetween(a: string, b: string): number {
    return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function addDays(date: string, days: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

function classifyIntervals(intervals: number[]): { spec: FrequencySpec; confidence: number } | null {
    let best: { spec: FrequencySpec; confidence: number } | null = null;

    for (const spec of FREQUENCIES) {
        const matching = intervals.filter(d => d >= spec.minDays && d <= spec.maxDays);
        if (matching.length === 0) continue;
        const ratio = matching.length / intervals.length;
        // Confidence: proportion of intervals that fit × consistency of those intervals
        const avg = matching.reduce((s, d) => s + d, 0) / matching.length;
        const deviation = matching.reduce((s, d) => s + Math.abs(d - avg), 0) / matching.length;
        const consistency = Math.max(0, 1 - deviation / spec.nominalDays);
        const confidence = ratio * consistency;
        if (!best || confidence > best.confidence) {
            best = { spec, confidence };
        }
    }

    return best;
}

/**
 * Scan a list of transactions and return detected recurring subscriptions.
 * Only expense-type transactions are considered.
 */
export function detectSubscriptions(transactions: AnchorTransaction[]): DetectedSubscription[] {
    const expenses = transactions.filter(t => t.type === 'expense' && !t.isSoftDeleted);

    // Group by normalized title + exact amount
    const groups = new Map<string, AnchorTransaction[]>();
    for (const tx of expenses) {
        const key = `${normalizeTitle(tx.title)}|${tx.amountCents}`;
        const group = groups.get(key) ?? [];
        group.push(tx);
        groups.set(key, group);
    }

    const results: DetectedSubscription[] = [];

    for (const [key, group] of groups) {
        if (group.length < MIN_OCCURRENCES) continue;

        const sorted = [...group].sort((a, b) => a.date.localeCompare(b.date));
        const intervals: number[] = [];
        for (let i = 1; i < sorted.length; i++) {
            intervals.push(daysBetween(sorted[i - 1].date, sorted[i].date));
        }

        const classification = classifyIntervals(intervals);
        if (!classification || classification.confidence < MIN_CONFIDENCE) continue;

        const lastDate = sorted.at(-1)!.date;
        const nextExpectedDate = addDays(lastDate, classification.spec.nominalDays);
        const [normalizedTitle] = key.split('|');

        results.push({
            title: normalizedTitle,
            amountCents: sorted[0].amountCents,
            frequency: classification.spec.name,
            confidence: classification.confidence,
            transactionIds: sorted.map(t => t.id!).filter(Boolean) as string[],
            lastChargeDate: lastDate,
            nextExpectedDate,
        });
    }

    return results;
}
