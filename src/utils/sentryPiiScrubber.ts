/**
 * sentryPiiScrubber — SEC-007
 *
 * Sentry beforeSend hook that strips sensitive financial data from error
 * payloads before they leave the device. Prevents PII leaking to Sentry
 * when uncaught exceptions occur in finance views.
 *
 * Scrubs from: extra, contexts, request body, breadcrumb data:
 *   - Firestore document IDs (path-like strings anchored with users/)
 *   - Account numbers and balance figures
 *   - Transaction amount fields
 *   - Email addresses
 */
import type { Event, Breadcrumb } from '@sentry/react';

// Patterns that identify sensitive field names
const SENSITIVE_FIELD_KEYS = new Set([
    'accountNumber', 'balance', 'balanceCents', 'amountCents', 'amount',
    'income', 'expenses', 'netWorth', 'transactionId', 'accountId',
    'userId', 'uid', 'email', 'ipHash', 'monoAccountId',
]);

// Regex patterns to scrub from string values
const SENSITIVE_PATTERNS: RegExp[] = [
    // Firestore document paths: users/abc123/finance/xyz789
    /users\/[a-zA-Z0-9_-]{20,}\/[a-zA-Z0-9/_-]*/g,
    // Email addresses
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    // Nigerian naira amounts: ₦1,234,567.89 or plain large numbers
    /₦[\d,]+(?:\.\d{2})?/g,
    // Currency amounts like 1250000 or 125000.00
    /\b\d{6,}\b/g,
];

const REDACTED = '[redacted]';

function scrubString(value: string): string {
    let result = value;
    for (const pattern of SENSITIVE_PATTERNS) {
        result = result.replace(pattern, REDACTED);
    }
    return result;
}

function scrubValue(key: string, value: unknown): unknown {
    if (SENSITIVE_FIELD_KEYS.has(key)) return REDACTED;
    if (typeof value === 'string') return scrubString(value);
    if (typeof value === 'number' && String(key).toLowerCase().includes('amount')) return REDACTED;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return scrubObject(value as Record<string, unknown>);
    }
    return value;
}

function scrubObject(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key] = scrubValue(key, value);
    }
    return result;
}

function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
    if (!breadcrumb.data) return breadcrumb;
    return { ...breadcrumb, data: scrubObject(breadcrumb.data as Record<string, unknown>) };
}

/**
 * Pass this as Sentry.init({ beforeSend }) to redact PII from all events.
 */
export function sentryBeforeSend(event: Event): Event | null {
    const scrubbed: Event = { ...event };

    // Scrub extra data
    if (scrubbed.extra) {
        scrubbed.extra = scrubObject(scrubbed.extra as Record<string, unknown>);
    }

    // Scrub contexts (includes device info, OS, Firebase data)
    if (scrubbed.contexts) {
        scrubbed.contexts = scrubObject(scrubbed.contexts as Record<string, unknown>) as Event['contexts'];
    }

    // Scrub request body
    if (scrubbed.request?.data) {
        scrubbed.request = {
            ...scrubbed.request,
            data: typeof scrubbed.request.data === 'string'
                ? scrubString(scrubbed.request.data)
                : scrubObject(scrubbed.request.data as Record<string, unknown>),
        };
    }

    // Scrub breadcrumbs
    if (scrubbed.breadcrumbs && Array.isArray(scrubbed.breadcrumbs)) {
        scrubbed.breadcrumbs = scrubbed.breadcrumbs.map(scrubBreadcrumb);
    }

    // Clean user field — keep only anonymous id, drop email
    if (scrubbed.user) {
        const { id } = scrubbed.user;
        scrubbed.user = id ? { id } : undefined;
    }

    return scrubbed;
}
