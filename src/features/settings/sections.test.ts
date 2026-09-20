import { describe, it, expect } from 'vitest';
import {
    SETTINGS_GROUPS,
    SETTINGS_SECTIONS,
    filterSettingsSections,
    getSettingsSection,
    isSettingsSectionId,
    sectionsInGroup,
    settingsSectionPath,
} from './sections';

/**
 * UX-ST-02/06: the registry is the single source of truth the hub, the router
 * and any deep-linking call site share, so its invariants are worth pinning.
 */
describe('settings sections registry', () => {
    it('has unique, stable ids', () => {
        const ids = SETTINGS_SECTIONS.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('builds a real path per section', () => {
        expect(settingsSectionPath('profile')).toBe('/settings/profile');
        expect(settingsSectionPath('assistant')).toBe('/settings/assistant');
    });

    it('resolves known ids and rejects unknown ones', () => {
        expect(getSettingsSection('security')?.label).toBe('Account & security');
        expect(getSettingsSection('not-a-section')).toBeNull();
        expect(isSettingsSectionId('not-a-section')).toBe(false);
        expect(isSettingsSectionId(undefined)).toBe(false);
        expect(isSettingsSectionId('data')).toBe(true);
    });

    it('gives every section a description and synonyms (so search can work)', () => {
        for (const section of SETTINGS_SECTIONS) {
            expect(section.description.length).toBeGreaterThan(0);
            expect(section.synonyms.length).toBeGreaterThan(0);
        }
    });

    it('places every section in exactly one group', () => {
        const grouped = SETTINGS_GROUPS.flatMap((g) => sectionsInGroup(g.id).map((s) => s.id));
        expect(grouped.sort()).toEqual(SETTINGS_SECTIONS.map((s) => s.id).sort());
    });

    it('returns every section for an empty query', () => {
        expect(filterSettingsSections('')).toHaveLength(SETTINGS_SECTIONS.length);
        expect(filterSettingsSections('   ')).toHaveLength(SETTINGS_SECTIONS.length);
    });

    it('matches the words a user would actually type, not just our labels', () => {
        expect(filterSettingsSections('2fa').map((s) => s.id)).toEqual(['security']);
        expect(filterSettingsSections('dark').map((s) => s.id)).toEqual(['preferences']);
        expect(filterSettingsSections('identifier').map((s) => s.id)).toEqual(['about']);
        expect(filterSettingsSections('wipe').map((s) => s.id)).toEqual(['data']);
    });

    it('is case-insensitive', () => {
        expect(filterSettingsSections('THEME').map((s) => s.id)).toEqual(['preferences']);
    });

    it('returns nothing when nothing matches', () => {
        expect(filterSettingsSections('zzzzz')).toEqual([]);
    });
});
