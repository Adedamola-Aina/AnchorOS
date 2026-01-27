/**
 * Family Mode v2 - Pending Confirmation Handlers
 * Extracted from PendingConfirmation.tsx per CLAUDE.md §3.2
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { EmailAuthProvider, reauthenticateWithCredential, getMultiFactorResolver, TotpMultiFactorGenerator, type MultiFactorResolver } from 'firebase/auth';
import { auth } from '../../../config/firebase';

interface ConfirmConnectionResult {
    success: boolean;
    rejected?: boolean;
    redirect?: string;
    message?: string;
    memberName?: string;
}

export async function completeConnectionConfirmation(inviteId: string, password: string): Promise<ConfirmConnectionResult> {
    const functions = getFunctions();
    const confirmConnection = httpsCallable<{ inviteId: string; password: string; confirmed: boolean }, ConfirmConnectionResult>(functions, 'confirmConnection');
    const result = await confirmConnection({ inviteId, password, confirmed: true });
    return result.data;
}

export async function reauthenticateUser(password: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('Not authenticated');
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
}

export function getMfaResolver(error: unknown): MultiFactorResolver {
    return getMultiFactorResolver(auth, error as any);
}

export async function verifyMfaAndComplete(resolver: MultiFactorResolver, code: string): Promise<void> {
    const totpHint = resolver.hints.find(hint => hint.factorId === 'totp');
    if (!totpHint) throw new Error('TOTP not found. Please use your authenticator app.');
    const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, code);
    await resolver.resolveSignIn(assertion);
}

export async function rejectInvitation(inviteId: string): Promise<void> {
    const functions = getFunctions();
    const confirmConnection = httpsCallable<{ inviteId: string; password: string; confirmed: boolean }, ConfirmConnectionResult>(functions, 'confirmConnection');
    await confirmConnection({ inviteId, password: '', confirmed: false });
}

export async function cancelInvitation(inviteId: string): Promise<void> {
    const functions = getFunctions();
    const revokeInvitation = httpsCallable<{ inviteId: string }, { success: boolean }>(functions, 'revokeInvitation');
    await revokeInvitation({ inviteId });
}
