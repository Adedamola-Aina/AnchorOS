export const REMINDER_DEDUPE_WINDOW_MS = 10 * 60 * 1000;

interface SkipReminderParams {
    previousKey?: string;
    previousSentAt?: string;
    currentKey: string;
    nowMs: number;
    windowMs?: number;
}

export function buildReminderDeliveryKey(
    date: string,
    time: string,
    titles: string[],
): string {
    const normalizedTitles = [...titles]
        .map((title) => title.trim())
        .filter((title) => title.length > 0)
        .sort((a, b) => a.localeCompare(b));

    return `${date}|${time}|${normalizedTitles.join('||')}`;
}

export function shouldSkipReminderDelivery({
    previousKey,
    previousSentAt,
    currentKey,
    nowMs,
    windowMs = REMINDER_DEDUPE_WINDOW_MS,
}: SkipReminderParams): boolean {
    if (!previousKey || previousKey !== currentKey || !previousSentAt) {
        return false;
    }

    const previousSentMs = Date.parse(previousSentAt);
    if (!Number.isFinite(previousSentMs)) {
        return false;
    }

    return (nowMs - previousSentMs) < windowMs;
}
