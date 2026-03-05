export interface ReminderMessage {
    title: string;
    body?: string;
}

export function buildReminderMessage(titles: string[]): ReminderMessage {
    if (titles.length === 0) {
        return { title: 'Commitment reminder', body: undefined };
    }

    if (titles.length === 1) {
        return { title: titles[0], body: undefined };
    }

    return {
        title: titles[0],
        body: `+${titles.length - 1} more commitments due now`,
    };
}
