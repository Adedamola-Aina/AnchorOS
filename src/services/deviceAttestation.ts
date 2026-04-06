/**
 * deviceAttestation — SEC-006
 *
 * Device trust verification for Anchor OS.
 * - Web: Relies on Firebase App Check (ReCaptcha Enterprise), already configured.
 * - Native (iOS/Android): Calls Cloud Function that verifies Play Integrity / DeviceCheck.
 *
 * High-risk operations (transfers, account linking) should call isDeviceTrusted()
 * before proceeding.
 */
// @ts-nocheck
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { isNative } from '../utils/platform';

interface AttestationResult {
  trusted: boolean;
  method: 'web-appcheck' | 'native-attestation';
  error?: string;
}

/**
 * Perform device attestation.
 * On web, App Check handles this transparently.
 * On native, we call a Cloud Function to verify the device token.
 */
export async function attestDevice(): Promise<AttestationResult> {
  if (!isNative()) {
    // Web: App Check is already enforced via Firebase config
    return { trusted: true, method: 'web-appcheck' };
  }

  try {
    const verifyDevice = httpsCallable(functions, 'verifyDeviceAttestation');
    const result = await verifyDevice({});
    const data = result.data as { trusted: boolean };
    return { trusted: data.trusted, method: 'native-attestation' };
  } catch {
    return { trusted: false, method: 'native-attestation', error: 'Attestation failed' };
  }
}

/**
 * Quick check: is the current device trusted?
 * Use this as a gate before high-risk operations.
 */
export async function isDeviceTrusted(): Promise<boolean> {
  const result = await attestDevice();
  return result.trusted;
}
