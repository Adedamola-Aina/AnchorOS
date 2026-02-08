/**
 * Telemetry Service
 * 
 * Lightweight abstraction for performance tracing and event logging.
 * Reports to Sentry in all environments; also outputs to console in development.
 * 
 * @module services/telemetry
 */
import * as Sentry from '@sentry/react';

interface TraceOptions {
    attributes?: Record<string, string | number | boolean>;
}

interface EventOptions {
    level?: 'debug' | 'info' | 'warn' | 'error';
    attributes?: Record<string, unknown>;
}

const isDev = import.meta.env.DEV;

/**
 * Trace a synchronous or asynchronous operation
 */
export async function trace<T>(
    name: string,
    fn: () => T | Promise<T>,
    options?: TraceOptions
): Promise<T> {
    const start = performance.now();

    try {
        const result = await fn();
        const duration = performance.now() - start;

        if (isDev) {
            console.debug(`[Trace] ${name}`, {
                duration: `${duration.toFixed(2)}ms`,
                ...options?.attributes,
            });
        }

        return result;
    } catch (error) {
        const duration = performance.now() - start;

        // Always add Sentry breadcrumb for failed operations
        Sentry.addBreadcrumb({
            category: 'trace',
            message: `${name} failed (${duration.toFixed(0)}ms)`,
            level: 'error',
            data: {
                duration: `${duration.toFixed(2)}ms`,
                error: error instanceof Error ? error.message : 'Unknown error',
                ...options?.attributes,
            },
        });

        if (isDev) {
            console.error(`[Trace Error] ${name}`, {
                duration: `${duration.toFixed(2)}ms`,
                error: error instanceof Error ? error.message : 'Unknown error',
                ...options?.attributes,
            });
        }

        throw error;
    }
}

/**
 * Log an event with optional attributes
 */
export function logEvent(
    name: string,
    options?: EventOptions
): void {
    if (!isDev && options?.level === 'debug') {
        return; // Skip debug logs in production
    }

    // Always send breadcrumb to Sentry (gives context before errors)
    Sentry.addBreadcrumb({
        category: 'event',
        message: name,
        level: options?.level === 'error' ? 'error'
            : options?.level === 'warn' ? 'warning' : 'info',
        data: options?.attributes as Record<string, unknown> | undefined,
    });

    const logFn = options?.level === 'error'
        ? console.error
        : options?.level === 'warn'
            ? console.warn
            : console.log;

    logFn(`[Event] ${name}`, options?.attributes ?? {});
}

/**
 * Create a scoped tracer for a specific feature
 */
export function createTracer(featureName: string) {
    return {
        trace: <T>(operationName: string, fn: () => T | Promise<T>, options?: TraceOptions) =>
            trace(`${featureName}.${operationName}`, fn, options),

        logEvent: (eventName: string, options?: EventOptions) =>
            logEvent(`${featureName}.${eventName}`, options),
    };
}

export const TelemetryService = {
    trace,
    logEvent,
    createTracer,
};

export default TelemetryService;
