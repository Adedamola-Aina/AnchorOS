/**
 * Health check endpoint — SRE-003
 *
 * Public HTTP endpoint used by UptimeRobot / Freshping to verify
 * Cloud Functions are reachable. Returns 200 OK with a JSON body.
 * No authentication required — does not expose sensitive data.
 */

import { onRequest } from 'firebase-functions/v2/https';

export const health = onRequest(
    { cors: false, invoker: 'public' as const },
    (_req, res) => {
        res.status(200).json({
            status: 'ok',
            service: 'anchor-os-functions',
            ts: Date.now(),
        });
    }
);
