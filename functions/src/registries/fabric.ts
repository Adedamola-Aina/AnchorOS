import type { CallableRegistryEntry } from '../callableRegistry';

export const fabricRegistry: ReadonlyArray<CallableRegistryEntry> = [
    {
        name: 'fabricBudgetNudge',
        version: 1,
        description: 'Scheduled nudge for budget threshold alerts',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },
    {
        name: 'fabricStreakNudge',
        version: 1,
        description: 'Scheduled nudge for savings streak encouragement',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },
    {
        name: 'fabricSurplusNudge',
        version: 1,
        description: 'Scheduled nudge for surplus allocation suggestions',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },
    {
        name: 'generateWeeklyReport',
        version: 1,
        description: 'Generate weekly Fabric insight report',
        trigger: 'scheduled',
        auth: 'none',
        rateLimit: null,
        status: 'stable',
        domain: 'fabric',
    },
];
