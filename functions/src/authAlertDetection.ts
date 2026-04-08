/**
 * authAlertDetection — AUTH-008
 *
 * Detects new/unrecognized devices by comparing a user-agent fingerprint
 * against the user's recent sign-in history. Sends a security alert email
 * when a new device is detected.
 */

import { createHash } from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import { createAuditLog } from './helpers';
import { getResend, EMAIL_FROM, APP_URL } from './config';

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

/** Build the HTML body for a new-device security alert email. */
function buildSecurityAlertEmail(email: string, device: string, time: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;"><div style="max-width:600px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);"><div style="background:#0f172a;padding:32px;text-align:center;"><h1 style="color:white;margin:0;font-size:24px;letter-spacing:-0.5px;">⚓ Anchor OS</h1></div><div style="padding:40px 32px;"><div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:28px;text-align:center;"><p style="color:#dc2626;font-size:16px;font-weight:600;margin:0 0 4px;">New sign-in detected</p><p style="color:#ef4444;font-size:14px;margin:0;">Was this you?</p></div><p style="color:#475569;font-size:16px;line-height:1.6;">A new sign-in to your Anchor OS account was detected from a device we haven't seen before.</p><div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin:20px 0;"><table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="color:#64748b;font-size:14px;padding-bottom:8px;">Account</td><td style="color:#0f172a;font-size:14px;font-weight:600;text-align:right;padding-bottom:8px;">${email}</td></tr><tr><td style="color:#64748b;font-size:14px;padding-bottom:8px;">Device</td><td style="color:#0f172a;font-size:14px;font-weight:600;text-align:right;padding-bottom:8px;">${device}</td></tr><tr><td style="color:#64748b;font-size:14px;">Time</td><td style="color:#0f172a;font-size:14px;font-weight:600;text-align:right;">${time}</td></tr></table></div><p style="color:#475569;font-size:14px;line-height:1.6;margin-top:24px;">If this was you, no action is needed. If you don't recognise this sign-in, secure your account immediately.</p><div style="text-align:center;margin:28px 0;"><a href="${APP_URL}/settings" style="display:inline-block;background:#dc2626;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">Review Account Security</a></div></div><div style="background:#f8fafc;padding:24px;text-align:center;border-top:1px solid #e2e8f0;"><p style="color:#94a3b8;font-size:12px;margin:0;">You're receiving this because a sign-in was detected on your account. Go to Settings to manage security alerts.</p></div></div></body></html>`;
}

/**
 * Check if a sign-in is from a new device and send a security alert if so.
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

    try {
      await getResend().emails.send({
        from: EMAIL_FROM,
        to: authUser.email,
        subject: 'New sign-in detected on your Anchor OS account',
        html: buildSecurityAlertEmail(authUser.email, device, time),
      });
    } catch {
      // Non-fatal — audit log was already written, don't block sign-in flow
    }
  }
}
