export type ReminderCategory = 'commitments' | 'finance' | 'family';

const CATEGORY_LINKS: Record<ReminderCategory, string> = {
    commitments: '/commitments',
    finance: '/finance',
    family: '/settings?tab=family',
};

export function getReminderLinkPath(categories: ReminderCategory[]): string {
    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.length !== 1) {
        return '/notifications';
    }

    return CATEGORY_LINKS[uniqueCategories[0]];
}
