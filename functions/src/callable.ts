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
 * - Dev: explicit allow-list of local origins (localhost:5173 Vite dev server,
 *   localhost:4173 vite preview, Tailscale dev host, dev Hosting site).
 *   Never `true` — an unknown/missing project ID must not widen CORS in a
 *   misconfigured production deployment.
 */
const DEV_CORS_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
    'https://anchor-os-dev-1c6ec.web.app',
    'https://anchor-os-dev-1c6ec.firebaseapp.com',
];

function getAllowedCors(): string[] {
    const projectId = process.env.GCLOUD_PROJECT ?? process.env.GCP_PROJECT ?? '';
    if (projectId === 'anchor-os') return ['https://anchor-os.web.app', 'https://anchor-os.firebaseapp.com'];
    if (projectId === 'anchor-os-staging') return ['https://anchor-os-staging.web.app', 'https://anchor-os-staging.firebaseapp.com'];
    return DEV_CORS_ORIGINS; // Dev — explicit allow-list only
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
