/**
 * Settings section registry — the single source of truth for the hub (UX-ST-01/02/06).
 *
 * Before this module, Settings was **ten sections in one continuous scroll**
 * behind **nine** anchor chips that called `scrollIntoView`. Sections therefore
 * had no identity, no URL and no back behaviour, and every "go to Settings"
 * journey from elsewhere in the app lost its target (`UX-ST-02`, `UX-ST-06`).
 *
 * Now each section is a stable id with its own route (`/settings/<id>`), and
 * this registry is reused by:
 *   - the hub index (grouped rows + search),
 *   - the router (validating `/settings/:section`),
 *   - the section screen chrome (title + description + back affordance),
 *   - any deep-linking call site (use `settingsSectionPath`).
 *
 * `synonyms` exist because a user looking for "dark mode" or "2fa" will not
 * type the label we chose — the hub's search matches them too.
 */

export type SettingsGroupId = 'personal' | 'access' | 'intelligence' | 'data';

export interface SettingsGroupDef {
    id: SettingsGroupId;
    label: string;
}

export interface SettingsSectionDef {
    id: string;
    label: string;
    /** One line, shown under the label in the hub and in the section header. */
    description: string;
    /** Extra search terms — the words a user would actually type. */
    synonyms: string[];
    group: SettingsGroupId;
}

export const SETTINGS_ROOT = '/settings';

export const settingsSectionPath = (id: string): string => `${SETTINGS_ROOT}/${id}`;

export const SETTINGS_GROUPS: SettingsGroupDef[] = [
    { id: 'personal', label: 'You' },
    { id: 'access', label: 'Access & alerts' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'data', label: 'Data & about' },
];

export const SETTINGS_SECTIONS: SettingsSectionDef[] = [
    {
        id: 'profile',
        label: 'Profile',
        description: 'Your name, photo and email',
        synonyms: ['account', 'avatar', 'photo', 'name', 'identity', 'email'],
        group: 'personal',
    },
    {
        id: 'family',
        label: 'Family',
        description: 'Sharing, invites and connections',
        synonyms: ['partner', 'sharing', 'invite', 'household', 'connection', 'spouse'],
        group: 'personal',
    },
    {
        id: 'security',
        label: 'Account & security',
        description: 'Password, two-factor, passkeys and sessions',
        synonyms: ['password', '2fa', 'mfa', 'passkey', 'session', 'device', 'login', 'verification', 'recovery'],
        group: 'access',
    },
    {
        id: 'notifications',
        label: 'Notifications',
        description: 'Email and push alerts',
        synonyms: ['alerts', 'email', 'push', 'digest', 'reminders', 'frequency'],
        group: 'access',
    },
    {
        id: 'preferences',
        label: 'Preferences',
        description: 'Theme, text size and contrast',
        synonyms: ['appearance', 'theme', 'dark', 'light', 'auto', 'contrast', 'text size', 'font', 'accessibility', 'motion'],
        group: 'access',
    },
    {
        id: 'assistant',
        label: 'Assistant',
        description: 'Anchor AI behaviour, data sources and transparency',
        synonyms: ['ai', 'anchor ai', 'fabric', 'knowledge', 'patterns', 'privacy', 'transparency', 'insights'],
        group: 'intelligence',
    },
    {
        id: 'data',
        label: 'Data & privacy',
        description: 'Export, wipe and account deletion',
        synonyms: ['export', 'wipe', 'delete', 'erase', 'privacy', 'backup', 'account'],
        group: 'data',
    },
    {
        id: 'about',
        label: 'About',
        description: 'Version, support and technical details',
        synonyms: ['support', 'contact', 'feedback', 'version', 'technical', 'identifier', 'id', 'build'],
        group: 'data',
    },
];

export function getSettingsSection(id: string | undefined): SettingsSectionDef | null {
    if (!id) return null;
    return SETTINGS_SECTIONS.find((section) => section.id === id) ?? null;
}

export function isSettingsSectionId(id: string | undefined): boolean {
    return getSettingsSection(id) !== null;
}

export function sectionsInGroup(group: SettingsGroupId): SettingsSectionDef[] {
    return SETTINGS_SECTIONS.filter((section) => section.group === group);
}

/**
 * Search by label, description **or synonym**. An empty query returns every
 * section, so the hub renders its grouped list.
 */
export function filterSettingsSections(query: string): SettingsSectionDef[] {
    const needle = query.trim().toLowerCase();
    if (!needle) return SETTINGS_SECTIONS;

    return SETTINGS_SECTIONS.filter((section) => {
        const haystack = [section.label, section.description, ...section.synonyms]
            .join(' ')
            .toLowerCase();
        return haystack.includes(needle);
    });
}
