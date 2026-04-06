/**
 * deviceAttestation — SEC-006
 *
 * Cloud Function callable that verifies device attestation tokens.
 * Currently validates the request came through App Check.
 * Future: integrate Play Integrity API (Android) and DeviceCheck API (iOS).
 */
// @ts-nocheck

import { HttpsError } from 'firebase-functions/v2/https';
import { secureOnCall } from './callable';
import { createAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';

/**
 * Verify device attestation.
 * Phase 1: Validates App Check token (already enforced by secureOnCall).
 * Phase 2 (future): Accept and verify Play Integrity / DeviceCheck tokens.
 */
export const verifyDeviceAttestation = secureOnCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  await enforceRateLimit('deviceAttestation', request.auth.uid);

  // Phase 1: If the request reached here, App Check passed (secureOnCall enforces it).
  // The device is trusted at the App Check level.
  const trusted = true;

  await createAuditLog('device_attestation_verified', request.auth.uid, {
    method: 'appcheck',
    trusted,
  });

  return { trusted, method: 'appcheck' };
});
