/**
 * UX-ST-04 — "Recently changed".
 *
 * The last part of the Settings finding: a change you just made should be
 * visible, so you can confirm it took effect (or find what you changed by
 * accident) without hunting through sections.
 *
 * It is derived centrally by comparing the profile before and after a write,
 * rather than instrumented in every section — so a new setting is covered
 * without touching its component.
 */

import { useEffect, useRef, useState } from 'react';
import type { UserProfile } from '../../types';

/** Friendly names for the fields a user can actually change in Settings. */
export const SETTINGS_FIELD_LABELS: Record<string, string> = {
    name: 'Display name',
    theme: 'Appearance',
    familyMode: 'Family mode',
    mfaEnabled: 'Two-factor authentication',
    notificationPreferences: 'Notification preferences',
    accessibility: 'Accessibility',
    language: 'Language',
    currency: 'Default currency',
    privacy: 'Privacy',
    onboardingProgress: 'Getting started progress',
};

interface RecentChange {
    id: string;
    label: string;
    at: number;
}

/**
 * Which settings changed between two profiles, in a stable order. Pure, so the
 * rule is testable without rendering anything.
 */
export function describeProfileChanges(
    previous: Partial<UserProfile> | null,
    next: Partial<UserProfile> | null,
): string[] {
    if (!previous || !next) return [];
    const changed: string[] = [];
    for (const key of Object.keys(SETTINGS_FIELD_LABELS)) {
        const before = previous[key as keyof UserProfile];
        const after = next[key as keyof UserProfile];
        if (JSON.stringify(before) === JSON.stringify(after)) continue;
        // A first-ever value is a change the user should still see acknowledged.
        changed.push(SETTINGS_FIELD_LABELS[key]);
    }
    return changed;
}

const MAX_ENTRIES = 5;

/** Human age of a change, without pulling in a date library. */
export function describeChangeAge(at: number, now: number): string {
    const seconds = Math.max(0, Math.round((now - at) / 1000));
    if (seconds < 45) return 'just now';
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.round(minutes / 60);
    return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
}

/**
 * Keeps a short, bounded list of the settings changed while the app is open.
 * Deliberately session-scoped: it answers "what did I just change?", and the
 * list says so rather than implying a permanent audit trail.
 */
export function useRecentSettingsChanges(profile: Partial<UserProfile> | null) {
    const [changes, setChanges] = useState<RecentChange[]>([]);
    const previous = useRef<Partial<UserProfile> | null>(null);

    useEffect(() => {
        const before = previous.current;
        previous.current = profile;
        const labels = describeProfileChanges(before, profile);
        if (labels.length === 0) return;
        const at = Date.now();
        setChanges((existing) => [
            ...labels.map((label, index) => ({ id: `${at}-${index}-${label}`, label, at })),
            ...existing,
        ].slice(0, MAX_ENTRIES));
    }, [profile]);

    return changes;
}
