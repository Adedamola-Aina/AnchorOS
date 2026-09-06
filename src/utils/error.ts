import { getSentry } from './lazySentry';

/**
 * Custom error class for Anchor OS application
 */
export type ErrorCategory = 'VALIDATION' | 'PERMISSION' | 'NETWORK' | 'AUTH' | 'DATABASE' | 'RATE_LIMIT' | 'UNKNOWN';

export class AnchorError extends Error {
    public category: ErrorCategory;
    public userMessage: string;
    public originalError?: unknown;

    constructor(message: string, category: ErrorCategory = 'UNKNOWN', originalError?: unknown) {
        super(message);
        this.name = 'AnchorError';
        this.category = category;
        this.userMessage = message;
        this.originalError = originalError;

        // Ensure stack trace is captured correctly (V8-specific API)
        if ('captureStackTrace' in Error && typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, AnchorError);
        }
    }

    static isAnchorError(error: unknown): error is AnchorError {
        return error instanceof AnchorError;
    }
}

/** Severity mapping: VALIDATION/RATE_LIMIT are warnings, rest are errors */
const SENTRY_LEVEL: Record<ErrorCategory, 'warning' | 'error' | 'fatal'> = {
    VALIDATION: 'warning',
    RATE_LIMIT: 'warning',
    PERMISSION: 'error',
    NETWORK: 'error',
    AUTH: 'error',
    DATABASE: 'error',
    UNKNOWN: 'error',
};

/**
 * Global error handler utility
 * Logs to console AND reports to Sentry with full context
 */
export const handleError = (error: unknown, fallbackMessage: string = 'An unexpected error occurred'): AnchorError => {
    if (AnchorError.isAnchorError(error)) {
        console.error(`[${error.category}] ${error.message}`, error.originalError);

        void getSentry().then((Sentry) =>
            Sentry?.captureException(error.originalError || error, {
                level: SENTRY_LEVEL[error.category],
                tags: { category: error.category },
                extra: {
                    userMessage: error.userMessage,
                    originalError: error.originalError instanceof Error ? error.originalError.message : error.originalError,
                },
            }),
        );
        return error;
    }

    console.error('[UNKNOWN]', error);

    const wrapped = new AnchorError(fallbackMessage, 'UNKNOWN', error);
    void getSentry().then((Sentry) =>
        Sentry?.captureException(error, {
            level: 'error',
            tags: { category: 'UNKNOWN' },
            extra: { fallbackMessage },
        }),
    );
    return wrapped;
};

/**
 * Lightweight error reporter — sends to Sentry WITHOUT wrapping or re-throwing.
 * Use in catch blocks that already handle the error (toast, state, etc.)
 * to get visibility in Sentry without changing existing behavior.
 *
 * @example
 * catch (err) {
 *   captureError(err, 'TransactionForm.submit');
 *   showToast('Failed to save', 'error');
 * }
 */
export const captureError = (error: unknown, context: string, extra?: Record<string, unknown>): void => {
    const err = error instanceof Error ? error : new Error(String(error));
    void getSentry().then((Sentry) =>
        Sentry?.captureException(err, {
            level: AnchorError.isAnchorError(error) ? SENTRY_LEVEL[error.category] : 'error',
            tags: {
                context,
                category: AnchorError.isAnchorError(error) ? error.category : 'UNKNOWN',
            },
            extra: {
                ...extra,
                originalMessage: err.message,
            },
        }),
    );
};
