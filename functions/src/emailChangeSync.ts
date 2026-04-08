/**
 * emailChangeSync — AUTH-006
 * 
 * Cloud Function callable for syncing email changes.
 * When a user changes their email via Firebase Auth (verifyBeforeUpdateEmail),
 * this callable updates the Firestore profile and related records.
 */

import { HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { secureOnCall } from './callable';
import { createAuditLog } from './helpers';
import { enforceRateLimit } from './rateLimit';
import { db, APP_ID } from './config';

/**
 * Sync the authenticated user's Firebase Auth email to their Firestore profile.
 * Called after the user verifies their new email address.
 */
export const syncEmailToProfile = secureOnCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  await enforceRateLimit('emailSync', request.auth.uid);

  const uid = request.auth.uid;

  // Get the current auth email (already updated by Firebase after verification)
  const authUser = await getAuth().getUser(uid);
  const currentEmail = authUser.email;

  if (!currentEmail) {
    throw new HttpsError('failed-precondition', 'No email found on auth account');
  }

  // Update Firestore profile
  const profileRef = db
    .collection('artifacts').doc(APP_ID)
    .collection('users').doc(uid);

  const profileSnap = await profileRef.get();
  const oldEmail = profileSnap.exists ? profileSnap.data()?.email : undefined;

  if (oldEmail === currentEmail) {
    return { success: true, message: 'Email already in sync' };
  }

  await profileRef.update({ email: currentEmail });

  await createAuditLog('email_changed', uid, {
    oldEmail: oldEmail ?? 'none',
    newEmail: currentEmail,
  });

  return { success: true, oldEmail, newEmail: currentEmail };
});
