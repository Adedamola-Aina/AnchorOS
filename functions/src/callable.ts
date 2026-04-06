/**
 * Shared callable factory with staged App Check enforcement.
 * Includes distributed tracing instrumentation (ENG-007).
 */

import { onCall, type CallableOptions, type CallableRequest } from 'firebase-functions/v2/https';
import { withTracing } from './tracing';

const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? '';
const shouldEnforceByDefault = projectId === 'anchor-os' || projectId === 'anchor-os-staging';
const enforceAppCheck = process.env.ENFORCE_APPCHECK
    ? process.env.ENFORCE_APPCHECK === 'true'
    : shouldEnforceByDefault;

type CallableHandler<T, R> = (request: CallableRequest<T>) => Promise<R> | R;

/**
 * Returns CORS allowed origins for the current environment.
 * - Production / staging: strict list of known origins
 * - Dev: true (allow any origin — safe for development only)
 */
function getAllowedCors(): string[] | true {
    const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? '';
    if (projectId === 'anchor-os') return ['https://anchor-os.web.app', 'https://anchor-os.firebaseapp.com'];
    if (projectId === 'anchor-os-staging') return ['https://anchor-os-staging.web.app', 'https://anchor-os-staging.firebaseapp.com'];
    return true; // Dev — allow all origins (localhost, Tailscale, etc.)
}

function withAppCheck<T>(options: CallableOptions<T>): CallableOptions<T> {
    return {
        cors: getAllowedCors(),
        ...options,
        enforceAppCheck: options.enforceAppCheck ?? enforceAppCheck,
    };
}

/** Counter used to derive a unique trace name when none is provided. */
let callableCounter = 0;

export function secureOnCall<T = unknown, R = unknown>(
    optionsOrHandler: CallableOptions<T> | CallableHandler<T, R>,
    maybeHandler?: CallableHandler<T, R>,
    traceName?: string,
) {
    const name = traceName ?? `callable_${++callableCounter}`;

    if (typeof optionsOrHandler === 'function') {
        return onCall(withAppCheck<T>({}), withTracing(name, optionsOrHandler));
    }

    if (!maybeHandler) {
        throw new Error('secureOnCall requires a handler when options are provided');
    }

    return onCall(withAppCheck(optionsOrHandler), withTracing(name, maybeHandler));
}
