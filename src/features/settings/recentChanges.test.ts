import { describe, it, expect } from 'vitest';
import { describeChangeAge, describeProfileChanges, SETTINGS_FIELD_LABELS } from './recentChanges';
import type { UserProfile } from '../../types';

const base: Partial<UserProfile> = { name: 'Ada', theme: 'light', mfaEnabled: false };

describe('UX-ST-04 — recently changed settings', () => {
    it('names the settings that changed, not the internal keys', () => {
        expect(describeProfileChanges(base, { ...base, theme: 'dark' })).toEqual(['Appearance']);
        expect(describeProfileChanges(base, { ...base, mfaEnabled: true })).toEqual(['Two-factor authentication']);
    });

    it('reports several changes in a stable order', () => {
        expect(describeProfileChanges(base, { ...base, theme: 'dark', name: 'Ada Lovelace' }))
            .toEqual(['Display name', 'Appearance']);
    });

    it('says nothing when nothing changed', () => {
        expect(describeProfileChanges(base, { ...base })).toEqual([]);
    });

    it('ignores fields a user cannot change in Settings', () => {
        const withInternal = { ...base, someInternalFlag: 'x' } as Partial<UserProfile>;
        expect(describeProfileChanges(base, withInternal)).toEqual([]);
    });

    it('has a friendly label for every field it watches', () => {
        for (const [key, label] of Object.entries(SETTINGS_FIELD_LABELS)) {
            expect(key.length).toBeGreaterThan(0);
            expect(label).not.toBe(key);
            expect(label.charAt(0)).toBe(label.charAt(0).toUpperCase());
        }
    });

    it('has nothing to compare on first load, so it stays quiet', () => {
        expect(describeProfileChanges(null, base)).toEqual([]);
        expect(describeProfileChanges(base, null)).toEqual([]);
    });

    it('describes how long ago a change was made', () => {
        const now = 1_000_000_000;
        expect(describeChangeAge(now, now)).toBe('just now');
        expect(describeChangeAge(now - 5 * 60_000, now)).toBe('5 min ago');
        expect(describeChangeAge(now - 60 * 60_000, now)).toBe('an hour ago');
        expect(describeChangeAge(now - 3 * 60 * 60_000, now)).toBe('3 hours ago');
    });
});
