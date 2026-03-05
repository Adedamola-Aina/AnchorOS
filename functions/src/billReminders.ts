import type { RecurringTransaction } from './types';

const MS_24H = 24 * 60 * 60 * 1000;

interface BillReminderMessage {
    title: string;
    body: string;
}

/**
 * Filters recurring rules to those due within the next 24 hours.
 * Only returns active expense rules (bills).
 */
export function getBillsDueSoon(
    rules: RecurringTransaction[],
    now: Date,
): RecurringTransaction[] {
    const nowMs = now.getTime();

    return rules.filter(rule => {
        if (rule.status !== 'active') return false;
        if (rule.type === 'income') return false;

        const dueMs = new Date(rule.nextRunAt).getTime();
        const diff = dueMs - nowMs;
        return diff > 0 && diff <= MS_24H;
    });
}

/**
 * Builds a notification message for upcoming bill(s).
 */
export function buildBillReminderMessage(bills: RecurringTransaction[]): BillReminderMessage {
    if (bills.length === 1) {
        return {
            title: '💰 Bill Due Tomorrow',
            body: `${bills[0].title} is due soon`,
        };
    }

    const first = bills[0].title;
    return {
        title: `💰 ${bills.length} Bills Due Soon`,
        body: `${first} and ${bills.length - 1} more`,
    };
}

/**
 * Dedup check — returns true if a reminder should be sent.
 */
export function shouldSendBillReminder(
    ruleId: string,
    lastReminderDate: string | undefined,
    todayDate: string,
): boolean {
    if (!lastReminderDate) return true;
    return lastReminderDate !== todayDate;
}
