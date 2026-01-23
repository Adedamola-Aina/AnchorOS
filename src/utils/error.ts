/**
 * Custom error class for Anchor OS application
 */
export type ErrorCategory = 'VALIDATION' | 'PERMISSION' | 'NETWORK' | 'AUTH' | 'DATABASE' | 'UNKNOWN';

export class AnchorError extends Error {
    public category: ErrorCategory;
    public userMessage: string;
    public originalError?: any;

    constructor(message: string, category: ErrorCategory = 'UNKNOWN', originalError?: any) {
        super(message);
        this.name = 'AnchorError';
        this.category = category;
        this.userMessage = message;
        this.originalError = originalError;

        // Ensure stack trace is captured correctly
        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, AnchorError);
        }
    }

    static isAnchorError(error: any): error is AnchorError {
        return error instanceof AnchorError;
    }
}

/**
 * Global error handler utility
 */
export const handleError = (error: any, fallbackMessage: string = 'An unexpected error occurred'): AnchorError => {
    if (AnchorError.isAnchorError(error)) {
        console.error(`[${error.category}] ${error.message}`, error.originalError);
        return error;
    }

    console.error('[UNKNOWN]', error);
    return new AnchorError(fallbackMessage, 'UNKNOWN', error);
};
