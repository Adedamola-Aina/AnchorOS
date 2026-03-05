interface NotificationCategories {
    finance?: boolean;
    commitments?: boolean;
    family?: boolean;
}

type NotificationCategory = keyof NotificationCategories;

interface QuietHours {
    enabled?: boolean;
    startTime?: string;
    endTime?: string;
}

export interface NotificationPreferences {
    enabled?: boolean;
    categories?: NotificationCategories;
    quietHours?: QuietHours;
}

function toMinutes(value: string): number {
    const [h, m] = value.split(':').map((part) => Number(part));
    return (h * 60) + m;
}

export function isWithinQuietHours(
    currentTime: string,
    startTime: string,
    endTime: string,
): boolean {
    const current = toMinutes(currentTime);
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    if (start === end) {
        return false;
    }

    if (start < end) {
        return current >= start && current < end;
    }

    return current >= start || current < end;
}

export function shouldSendCommitmentReminder(
    preferences: NotificationPreferences | undefined,
    currentTime: string,
): boolean {
    return shouldSendReminderForCategory(preferences, 'commitments', currentTime);
}

export function shouldSendReminderForCategory(
    preferences: NotificationPreferences | undefined,
    category: NotificationCategory,
    currentTime: string,
): boolean {
    if (!preferences) {
        return true;
    }

    if (preferences.enabled === false) {
        return false;
    }

    if (preferences.categories?.[category] === false) {
        return false;
    }

    const quietHours = preferences.quietHours;
    if (!quietHours?.enabled) {
        return true;
    }

    if (!quietHours.startTime || !quietHours.endTime) {
        return true;
    }

    return !isWithinQuietHours(currentTime, quietHours.startTime, quietHours.endTime);
}
