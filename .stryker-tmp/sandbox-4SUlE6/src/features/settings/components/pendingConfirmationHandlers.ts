/**
 * Family Mode v2 - Pending Confirmation Handlers
 * Extracted from PendingConfirmation.tsx per CLAUDE.md §3.2
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
  if (stryMutAct_9fa48("6504")) {
    {}
  } else {
    stryCov_9fa48("6504");
    const functions = getFunctions();
    const confirmConnection = httpsCallable<{
      inviteId: string;
      password: string;
      confirmed: boolean;
    }, ConfirmConnectionResult>(functions, stryMutAct_9fa48("6505") ? "" : (stryCov_9fa48("6505"), 'confirmConnection'));
    const result = await confirmConnection(stryMutAct_9fa48("6506") ? {} : (stryCov_9fa48("6506"), {
      inviteId,
      password,
      confirmed: stryMutAct_9fa48("6507") ? false : (stryCov_9fa48("6507"), true)
    }));
    return result.data;
  }
}
export async function reauthenticateUser(password: string): Promise<void> {
  if (stryMutAct_9fa48("6508")) {
    {}
  } else {
    stryCov_9fa48("6508");
    const user = auth.currentUser;
    if (stryMutAct_9fa48("6511") ? !user && !user.email : stryMutAct_9fa48("6510") ? false : stryMutAct_9fa48("6509") ? true : (stryCov_9fa48("6509", "6510", "6511"), (stryMutAct_9fa48("6512") ? user : (stryCov_9fa48("6512"), !user)) || (stryMutAct_9fa48("6513") ? user.email : (stryCov_9fa48("6513"), !user.email)))) throw new Error(stryMutAct_9fa48("6514") ? "" : (stryCov_9fa48("6514"), 'Not authenticated'));
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }
}
export function getMfaResolver(error: unknown): MultiFactorResolver {
  if (stryMutAct_9fa48("6515")) {
    {}
  } else {
    stryCov_9fa48("6515");
    return getMultiFactorResolver(auth, error as any);
  }
}
export async function verifyMfaAndComplete(resolver: MultiFactorResolver, code: string): Promise<void> {
  if (stryMutAct_9fa48("6516")) {
    {}
  } else {
    stryCov_9fa48("6516");
    const totpHint = resolver.hints.find(stryMutAct_9fa48("6517") ? () => undefined : (stryCov_9fa48("6517"), hint => stryMutAct_9fa48("6520") ? hint.factorId !== 'totp' : stryMutAct_9fa48("6519") ? false : stryMutAct_9fa48("6518") ? true : (stryCov_9fa48("6518", "6519", "6520"), hint.factorId === (stryMutAct_9fa48("6521") ? "" : (stryCov_9fa48("6521"), 'totp')))));
    if (stryMutAct_9fa48("6524") ? false : stryMutAct_9fa48("6523") ? true : stryMutAct_9fa48("6522") ? totpHint : (stryCov_9fa48("6522", "6523", "6524"), !totpHint)) throw new Error(stryMutAct_9fa48("6525") ? "" : (stryCov_9fa48("6525"), 'TOTP not found. Please use your authenticator app.'));
    const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, code);
    await resolver.resolveSignIn(assertion);
  }
}
export async function rejectInvitation(inviteId: string): Promise<void> {
  if (stryMutAct_9fa48("6526")) {
    {}
  } else {
    stryCov_9fa48("6526");
    const functions = getFunctions();
    const confirmConnection = httpsCallable<{
      inviteId: string;
      password: string;
      confirmed: boolean;
    }, ConfirmConnectionResult>(functions, stryMutAct_9fa48("6527") ? "" : (stryCov_9fa48("6527"), 'confirmConnection'));
    await confirmConnection(stryMutAct_9fa48("6528") ? {} : (stryCov_9fa48("6528"), {
      inviteId,
      password: stryMutAct_9fa48("6529") ? "Stryker was here!" : (stryCov_9fa48("6529"), ''),
      confirmed: stryMutAct_9fa48("6530") ? true : (stryCov_9fa48("6530"), false)
    }));
  }
}
export async function cancelInvitation(inviteId: string): Promise<void> {
  if (stryMutAct_9fa48("6531")) {
    {}
  } else {
    stryCov_9fa48("6531");
    const functions = getFunctions();
    const revokeInvitation = httpsCallable<{
      inviteId: string;
    }, {
      success: boolean;
    }>(functions, stryMutAct_9fa48("6532") ? "" : (stryCov_9fa48("6532"), 'revokeInvitation'));
    await revokeInvitation(stryMutAct_9fa48("6533") ? {} : (stryCov_9fa48("6533"), {
      inviteId
    }));
  }
}