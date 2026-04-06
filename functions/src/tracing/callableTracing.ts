/**
 * Cloud Function callable tracing — ENG-007
 *
 * Wraps callable handlers with structured timing, logging, and
 * span-like attribute capture. Designed to integrate with
 * Cloud Trace via structured logging (Cloud Functions v2 on Cloud Run
 * automatically picks up structured logs as trace spans).
 */

import { logger } from 'firebase-functions';
import type { CallableRequest } from 'firebase-functions/v2/https';

interface SpanAttributes {
  'function.name': string;
  'user.authenticated': boolean;
  'invocation.timestamp': string;
  [key: string]: string | number | boolean;
}

/**
 * Build span attributes for a callable invocation.
 */
export function createSpanAttributes(
  functionName: string,
  request: CallableRequest,
): SpanAttributes {
  return {
    'function.name': functionName,
    'user.authenticated': !!request.auth?.uid,
    'invocation.timestamp': new Date().toISOString(),
  };
}

type CallableHandler<T, R> = (request: CallableRequest<T>) => Promise<R> | R;

/**
 * Wrap a callable handler with tracing instrumentation.
 * Captures: start time, end time, duration, success/failure, and span attributes.
 * Logs structured JSON that Cloud Trace/Cloud Logging can correlate.
 */
export function withTracing<T, R>(
  functionName: string,
  handler: CallableHandler<T, R>,
): CallableHandler<T, R> {
  return async (request: CallableRequest<T>): Promise<R> => {
    const startMs = Date.now();
    const attributes = createSpanAttributes(functionName, request);

    logger.info(`[Trace] ${functionName} start`, {
      ...attributes,
      'trace.phase': 'start',
    });

    try {
      const result = await handler(request);
      const durationMs = Date.now() - startMs;

      logger.info(`[Trace] ${functionName} complete`, {
        ...attributes,
        'trace.phase': 'end',
        'trace.durationMs': durationMs,
        'trace.status': 'ok',
      });

      return result;
    } catch (error) {
      const durationMs = Date.now() - startMs;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      logger.error(`[Trace] ${functionName} failed`, {
        ...attributes,
        'trace.phase': 'end',
        'trace.durationMs': durationMs,
        'trace.status': 'error',
        'error.message': errorMessage,
      });

      throw error;
    }
  };
}
