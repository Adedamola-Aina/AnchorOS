/**
 * Cloud Function tracing — ENG-007
 *
 * Barrel export for the tracing module.
 * Provides callable tracing middleware for secureOnCall.
 */

export { withTracing, createSpanAttributes } from './callableTracing';
