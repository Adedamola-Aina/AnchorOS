// @ts-nocheck
import { doc, setDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { APP_ID, db } from '../config/firebase';
import { functions } from '../config/firebase';

export interface MfaRecoveryPayload {
  hashedCodes: string[];
  generatedAt: string;
  codesRemaining: number;
}

/**
 * Persist hashed MFA recovery codes for a user.
 */
export async function saveMfaRecoveryCodes(userId: string, payload: MfaRecoveryPayload): Promise<void> {
  await setDoc(
    doc(db, 'artifacts', APP_ID, 'users', userId, 'security', 'mfaRecovery'),
    payload,
  );
}

export async function consumeMfaRecoveryCode(email: string, recoveryCode: string): Promise<void> {
  const recoverMfa = httpsCallable(functions, 'recoverMfaWithCode');
  await recoverMfa({ email, recoveryCode });
}
