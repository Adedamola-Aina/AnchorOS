/**
 * AuditService
 * 
 * Client-side service for logging audit events to the server.
 * All security-sensitive operations should call this service.
 * 
 * Events are validated against a server-side whitelist and stored
 * in Firestore's audit_log collection.
 * 
 * @module services/AuditService
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
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
export type AuditEventType =
// Auth events
'auth_login_success' | 'auth_login_failed' | 'auth_logout' | 'auth_mfa_challenge_started' | 'auth_mfa_challenge_completed' | 'auth_password_changed' | 'auth_email_verified'
// Finance events
| 'account_created' | 'account_archived' | 'account_renamed' | 'transaction_created' | 'transaction_deleted' | 'transaction_updated'
// Settings events
| 'settings_profile_updated' | 'settings_notifications_changed' | 'settings_theme_changed'
// Commitment events
| 'commitment_created' | 'commitment_completed' | 'commitment_deleted' | 'commitment_edited';
interface AuditMetadata {
  [key: string]: unknown;
}

/**
 * Log an audit event to the server.
 * Silently fails to avoid disrupting user experience.
 * 
 * @param action - The audit event type
 * @param metadata - Additional context about the event
 */
export async function logAuditEvent(action: AuditEventType, metadata: AuditMetadata = {}): Promise<void> {
  if (stryMutAct_9fa48("377")) {
    {}
  } else {
    stryCov_9fa48("377");
    try {
      if (stryMutAct_9fa48("378")) {
        {}
      } else {
        stryCov_9fa48("378");
        const logAudit = httpsCallable(functions, stryMutAct_9fa48("379") ? "" : (stryCov_9fa48("379"), 'logAuditEvent'));
        await logAudit(stryMutAct_9fa48("380") ? {} : (stryCov_9fa48("380"), {
          action,
          metadata
        }));
      }
    } catch (error) {
      if (stryMutAct_9fa48("381")) {
        {}
      } else {
        stryCov_9fa48("381");
        // Silently log - audit failures should never block user operations
        console.warn(stryMutAct_9fa48("382") ? "" : (stryCov_9fa48("382"), '[AuditService] Failed to log event:'), action, error);
      }
    }
  }
}

// Convenience functions for common operations

export const auditAuth = stryMutAct_9fa48("383") ? {} : (stryCov_9fa48("383"), {
  loginSuccess: stryMutAct_9fa48("384") ? () => undefined : (stryCov_9fa48("384"), (method: 'password' | 'google' | 'mfa') => logAuditEvent(stryMutAct_9fa48("385") ? "" : (stryCov_9fa48("385"), 'auth_login_success'), stryMutAct_9fa48("386") ? {} : (stryCov_9fa48("386"), {
    method
  }))),
  loginFailed: stryMutAct_9fa48("387") ? () => undefined : (stryCov_9fa48("387"), (method: 'password' | 'google', reason: string) => logAuditEvent(stryMutAct_9fa48("388") ? "" : (stryCov_9fa48("388"), 'auth_login_failed'), stryMutAct_9fa48("389") ? {} : (stryCov_9fa48("389"), {
    method,
    reason
  }))),
  logout: stryMutAct_9fa48("390") ? () => undefined : (stryCov_9fa48("390"), () => logAuditEvent(stryMutAct_9fa48("391") ? "" : (stryCov_9fa48("391"), 'auth_logout'), {})),
  mfaStarted: stryMutAct_9fa48("392") ? () => undefined : (stryCov_9fa48("392"), () => logAuditEvent(stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), 'auth_mfa_challenge_started'), {})),
  mfaCompleted: stryMutAct_9fa48("394") ? () => undefined : (stryCov_9fa48("394"), (success: boolean) => logAuditEvent(stryMutAct_9fa48("395") ? "" : (stryCov_9fa48("395"), 'auth_mfa_challenge_completed'), stryMutAct_9fa48("396") ? {} : (stryCov_9fa48("396"), {
    success
  }))),
  passwordChanged: stryMutAct_9fa48("397") ? () => undefined : (stryCov_9fa48("397"), () => logAuditEvent(stryMutAct_9fa48("398") ? "" : (stryCov_9fa48("398"), 'auth_password_changed'), {})),
  emailVerified: stryMutAct_9fa48("399") ? () => undefined : (stryCov_9fa48("399"), () => logAuditEvent(stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), 'auth_email_verified'), {}))
});
export const auditFinance = stryMutAct_9fa48("401") ? {} : (stryCov_9fa48("401"), {
  accountCreated: stryMutAct_9fa48("402") ? () => undefined : (stryCov_9fa48("402"), (accountId: string, accountName: string, type: string) => logAuditEvent(stryMutAct_9fa48("403") ? "" : (stryCov_9fa48("403"), 'account_created'), stryMutAct_9fa48("404") ? {} : (stryCov_9fa48("404"), {
    accountId,
    accountName,
    type
  }))),
  accountArchived: stryMutAct_9fa48("405") ? () => undefined : (stryCov_9fa48("405"), (accountId: string, accountName: string) => logAuditEvent(stryMutAct_9fa48("406") ? "" : (stryCov_9fa48("406"), 'account_archived'), stryMutAct_9fa48("407") ? {} : (stryCov_9fa48("407"), {
    accountId,
    accountName
  }))),
  accountRenamed: stryMutAct_9fa48("408") ? () => undefined : (stryCov_9fa48("408"), (accountId: string, oldName: string, newName: string) => logAuditEvent(stryMutAct_9fa48("409") ? "" : (stryCov_9fa48("409"), 'account_renamed'), stryMutAct_9fa48("410") ? {} : (stryCov_9fa48("410"), {
    accountId,
    oldName,
    newName
  }))),
  transactionCreated: stryMutAct_9fa48("411") ? () => undefined : (stryCov_9fa48("411"), (transactionId: string, accountId: string, amountCents: number, type: string) => logAuditEvent(stryMutAct_9fa48("412") ? "" : (stryCov_9fa48("412"), 'transaction_created'), stryMutAct_9fa48("413") ? {} : (stryCov_9fa48("413"), {
    transactionId,
    accountId,
    amountCents,
    type
  }))),
  transactionDeleted: stryMutAct_9fa48("414") ? () => undefined : (stryCov_9fa48("414"), (transactionId: string, accountId: string) => logAuditEvent(stryMutAct_9fa48("415") ? "" : (stryCov_9fa48("415"), 'transaction_deleted'), stryMutAct_9fa48("416") ? {} : (stryCov_9fa48("416"), {
    transactionId,
    accountId
  }))),
  transactionUpdated: stryMutAct_9fa48("417") ? () => undefined : (stryCov_9fa48("417"), (transactionId: string, accountId: string, changes: string[]) => logAuditEvent(stryMutAct_9fa48("418") ? "" : (stryCov_9fa48("418"), 'transaction_updated'), stryMutAct_9fa48("419") ? {} : (stryCov_9fa48("419"), {
    transactionId,
    accountId,
    changedFields: changes
  })))
});
export const auditSettings = stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
  profileUpdated: stryMutAct_9fa48("421") ? () => undefined : (stryCov_9fa48("421"), (fields: string[]) => logAuditEvent(stryMutAct_9fa48("422") ? "" : (stryCov_9fa48("422"), 'settings_profile_updated'), stryMutAct_9fa48("423") ? {} : (stryCov_9fa48("423"), {
    updatedFields: fields
  }))),
  notificationsChanged: stryMutAct_9fa48("424") ? () => undefined : (stryCov_9fa48("424"), (enabled: boolean) => logAuditEvent(stryMutAct_9fa48("425") ? "" : (stryCov_9fa48("425"), 'settings_notifications_changed'), stryMutAct_9fa48("426") ? {} : (stryCov_9fa48("426"), {
    enabled
  }))),
  themeChanged: stryMutAct_9fa48("427") ? () => undefined : (stryCov_9fa48("427"), (theme: string) => logAuditEvent(stryMutAct_9fa48("428") ? "" : (stryCov_9fa48("428"), 'settings_theme_changed'), stryMutAct_9fa48("429") ? {} : (stryCov_9fa48("429"), {
    theme
  })))
});
export const auditCommitments = stryMutAct_9fa48("430") ? {} : (stryCov_9fa48("430"), {
  created: stryMutAct_9fa48("431") ? () => undefined : (stryCov_9fa48("431"), (commitmentId: string, title: string) => logAuditEvent(stryMutAct_9fa48("432") ? "" : (stryCov_9fa48("432"), 'commitment_created'), stryMutAct_9fa48("433") ? {} : (stryCov_9fa48("433"), {
    commitmentId,
    title
  }))),
  completed: stryMutAct_9fa48("434") ? () => undefined : (stryCov_9fa48("434"), (commitmentId: string) => logAuditEvent(stryMutAct_9fa48("435") ? "" : (stryCov_9fa48("435"), 'commitment_completed'), stryMutAct_9fa48("436") ? {} : (stryCov_9fa48("436"), {
    commitmentId
  }))),
  deleted: stryMutAct_9fa48("437") ? () => undefined : (stryCov_9fa48("437"), (commitmentId: string) => logAuditEvent(stryMutAct_9fa48("438") ? "" : (stryCov_9fa48("438"), 'commitment_deleted'), stryMutAct_9fa48("439") ? {} : (stryCov_9fa48("439"), {
    commitmentId
  }))),
  edited: stryMutAct_9fa48("440") ? () => undefined : (stryCov_9fa48("440"), (commitmentId: string, changes: string[]) => logAuditEvent(stryMutAct_9fa48("441") ? "" : (stryCov_9fa48("441"), 'commitment_edited'), stryMutAct_9fa48("442") ? {} : (stryCov_9fa48("442"), {
    commitmentId,
    changedFields: changes
  })))
});