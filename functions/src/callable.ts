/**
 * Shared callable factory with staged App Check enforcement.
 */

import { onCall, type CallableOptions, type CallableRequest } from 'firebase-functions/v2/https';

const enforceAppCheck = process.env.ENFORCE_APPCHECK === 'true';

type CallableHandler<T, R> = (request: CallableRequest<T>) => Promise<R> | R;

function withAppCheck<T>(options: CallableOptions<T>): CallableOptions<T> {
    return {
        ...options,
        enforceAppCheck: options.enforceAppCheck ?? enforceAppCheck,
    };
}

export function secureOnCall<T = unknown, R = unknown>(
    optionsOrHandler: CallableOptions<T> | CallableHandler<T, R>,
    maybeHandler?: CallableHandler<T, R>
) {
    if (typeof optionsOrHandler === 'function') {
        return onCall(withAppCheck<T>({}), optionsOrHandler);
    }

    if (!maybeHandler) {
        throw new Error('secureOnCall requires a handler when options are provided');
    }

    return onCall(withAppCheck(optionsOrHandler), maybeHandler);
}
