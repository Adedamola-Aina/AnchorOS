/**
 * authAlertDetection — AUTH-008
 *
 * Detects new/unrecognized devices by comparing a user-agent fingerprint
 * against the user's recent sign-in history.
 */

import { createHash } from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import { createAuditLog } from './helpers';

/**
 * Hash a user-agent string to create a device fingerprint.
 * Uses SHA-256 truncated to 16 chars for efficient comparison.
 */
export function hashUserAgent(userAgent: string): string {
  if (!userAgent) return '';
  return createHash('sha256').update(`ua:${userAgent}`).digest('hex').slice(0, 16);
}

/**
 * Check if the current user-agent hash is new (not seen in recent events).
 */
export function isNewDevice(currentUaHash: string, recentUaHashes: string[]): boolean {
  if (!currentUaHash) return true;
  return !recentUaHashes.includes(currentUaHash);
}

/**
 * Build a human-readable device description from a user-agent string.
 */
export function describeDevice(userAgent: string): string {
  let os = 'Unknown device';
  let browser = '';

  if (/iPhone|iPad|iPod/.test(userAgent)) os = 'iPhone';
  else if (/Android/.test(userAgent)) os = 'Android';
  else if (/Windows/.test(userAgent)) os = 'Windows PC';
  else if (/Mac OS X/.test(userAgent)) os = 'Mac';
  else if (/Linux/.test(userAgent)) os = 'Linux PC';

  if (/Chrome/.test(userAgent) && !/Edg/.test(userAgent)) browser = 'Chrome';
  else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) browser = 'Safari';
  else if (/Firefox/.test(userAgent)) browser = 'Firefox';
  else if (/Edg/.test(userAgent)) browser = 'Edge';

  return browser ? `${os} on ${browser}` : os;
}

/**
 * Check if a sign-in is from a new device and flag the event if so.
 * Called fire-and-forget after recording an auth event.
 */
export async function checkNewDeviceAlert(
  uid: string,
  userAgent: string,
  eventsCol: FirebaseFirestore.CollectionReference,
): Promise<void> {
  const currentHash = hashUserAgent(userAgent);
  if (!currentHash) return;

  const recentSnap = await eventsCol.orderBy('timestamp', 'desc').limit(11).get();
  const recentHashes = recentSnap.docs
    .map((d) => hashUserAgent(typeof d.data().userAgent === 'string' ? d.data().userAgent : ''))
    .filter((h) => h !== currentHash && h !== '');

  if (recentHashes.length === 0) return; // First-ever sign-in, skip

  if (isNewDevice(currentHash, recentHashes)) {
    const authUser = await getAuth().getUser(uid);
    if (!authUser.email) return;
    const device = describeDevice(userAgent);
    const time = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });
    const latestDoc = recentSnap.docs[0];
    if (latestDoc) {
      await latestDoc.ref.update({ newDevice: true, deviceDescription: device });
    }
    await createAuditLog('security_alert_new_device', uid, { device, time });
  }
}
