/**
 * AccountService
 * 
 * Handles all account-related operations including creation, deletion (archival),
 * and renaming with history tracking.
 * 
 * @module services/AccountService
 * 
 * NOTE: This file is ~175 lines after type extraction.
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
import { collection, doc, addDoc, writeBatch, query, where, getDocs, type Firestore } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { AnchorError } from '../utils/error';
import { checkRateLimit, formatRetryTime, RATE_LIMIT_CONFIGS } from '../utils/rateLimit';
import { auditFinance } from './AuditService';
import type { AnchorAccount } from '../types';
import { canManageAccount } from '../features/finance/utils/permissions';
import type { CreateAccountPayload } from './financeTypes';

// Re-export types for backward compatibility
export type { CreateAccountPayload } from './financeTypes';

/**
 * AccountService providing account management operations
 */
export class AccountService {
  private firestore: Firestore;
  constructor(firestore: Firestore = db) {
    if (stryMutAct_9fa48("243")) {
      {}
    } else {
      stryCov_9fa48("243");
      this.firestore = firestore;
    }
  }

  /** Add a new account */
  async addAccount(userId: string, payload: CreateAccountPayload): Promise<string> {
    if (stryMutAct_9fa48("244")) {
      {}
    } else {
      stryCov_9fa48("244");
      // Rate limit: 10 accounts per 24 hours
      const rateCheck = checkRateLimit(stryMutAct_9fa48("245") ? `` : (stryCov_9fa48("245"), `accountCreate:${userId}`), RATE_LIMIT_CONFIGS.accountCreate);
      if (stryMutAct_9fa48("247") ? false : stryMutAct_9fa48("246") ? true : (stryCov_9fa48("246", "247"), rateCheck.isLimited)) {
        if (stryMutAct_9fa48("248")) {
          {}
        } else {
          stryCov_9fa48("248");
          throw new AnchorError(stryMutAct_9fa48("249") ? `` : (stryCov_9fa48("249"), `Too many accounts created. Please try again in ${formatRetryTime(stryMutAct_9fa48("252") ? rateCheck.retryAfterMs && 0 : stryMutAct_9fa48("251") ? false : stryMutAct_9fa48("250") ? true : (stryCov_9fa48("250", "251", "252"), rateCheck.retryAfterMs || 0))}.`), stryMutAct_9fa48("253") ? "" : (stryCov_9fa48("253"), 'RATE_LIMIT'));
        }
      }
      try {
        if (stryMutAct_9fa48("254")) {
          {}
        } else {
          stryCov_9fa48("254");
          const docRef = await addDoc(collection(this.firestore, stryMutAct_9fa48("255") ? "" : (stryCov_9fa48("255"), 'artifacts'), APP_ID, stryMutAct_9fa48("256") ? "" : (stryCov_9fa48("256"), 'users'), userId, stryMutAct_9fa48("257") ? "" : (stryCov_9fa48("257"), 'accounts')), stryMutAct_9fa48("258") ? {} : (stryCov_9fa48("258"), {
            ...payload,
            ownerId: userId,
            isArchived: stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259"), false),
            shares: {}
          }));

          // AUDIT: Log account creation
          auditFinance.accountCreated(docRef.id, payload.name, payload.type);
          return docRef.id;
        }
      } catch (error) {
        if (stryMutAct_9fa48("260")) {
          {}
        } else {
          stryCov_9fa48("260");
          throw new AnchorError(stryMutAct_9fa48("261") ? "" : (stryCov_9fa48("261"), 'Failed to add account'), stryMutAct_9fa48("262") ? "" : (stryCov_9fa48("262"), 'DATABASE'), error);
        }
      }
    }
  }

  /** Delete (archive) an account */
  async deleteAccount(userId: string, userName: string, account: AnchorAccount): Promise<void> {
    if (stryMutAct_9fa48("263")) {
      {}
    } else {
      stryCov_9fa48("263");
      if (stryMutAct_9fa48("266") ? false : stryMutAct_9fa48("265") ? true : stryMutAct_9fa48("264") ? canManageAccount(account, userId) : (stryCov_9fa48("264", "265", "266"), !canManageAccount(account, userId))) {
        if (stryMutAct_9fa48("267")) {
          {}
        } else {
          stryCov_9fa48("267");
          throw new AnchorError(stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'Permission denied: You cannot delete this account.'), stryMutAct_9fa48("269") ? "" : (stryCov_9fa48("269"), 'PERMISSION'));
        }
      }
      try {
        if (stryMutAct_9fa48("270")) {
          {}
        } else {
          stryCov_9fa48("270");
          const batch = writeBatch(this.firestore);
          const timestamp = new Date().toISOString();
          const accRef = doc(this.firestore, stryMutAct_9fa48("271") ? "" : (stryCov_9fa48("271"), 'artifacts'), APP_ID, stryMutAct_9fa48("272") ? "" : (stryCov_9fa48("272"), 'users'), userId, stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), 'accounts'), account.id);
          batch.update(accRef, stryMutAct_9fa48("274") ? {} : (stryCov_9fa48("274"), {
            isArchived: stryMutAct_9fa48("275") ? false : (stryCov_9fa48("275"), true)
          }));
          if (stryMutAct_9fa48("277") ? false : stryMutAct_9fa48("276") ? true : (stryCov_9fa48("276", "277"), account.shares)) {
            if (stryMutAct_9fa48("278")) {
              {}
            } else {
              stryCov_9fa48("278");
              Object.keys(account.shares).forEach(uid => {
                if (stryMutAct_9fa48("279")) {
                  {}
                } else {
                  stryCov_9fa48("279");
                  if (stryMutAct_9fa48("282") ? uid === userId : stryMutAct_9fa48("281") ? false : stryMutAct_9fa48("280") ? true : (stryCov_9fa48("280", "281", "282"), uid !== userId)) {
                    if (stryMutAct_9fa48("283")) {
                      {}
                    } else {
                      stryCov_9fa48("283");
                      const notifRef = doc(collection(this.firestore, stryMutAct_9fa48("284") ? "" : (stryCov_9fa48("284"), 'artifacts'), APP_ID, stryMutAct_9fa48("285") ? "" : (stryCov_9fa48("285"), 'users'), uid, stryMutAct_9fa48("286") ? "" : (stryCov_9fa48("286"), 'notifications')));
                      batch.set(notifRef, stryMutAct_9fa48("287") ? {} : (stryCov_9fa48("287"), {
                        type: stryMutAct_9fa48("288") ? "" : (stryCov_9fa48("288"), 'system'),
                        date: timestamp,
                        read: stryMutAct_9fa48("289") ? true : (stryCov_9fa48("289"), false),
                        message: stryMutAct_9fa48("290") ? `` : (stryCov_9fa48("290"), `The account "${account.name}" has been deleted by the owner. You no longer have access.`),
                        title: stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), 'Account Deleted'),
                        actorId: userId,
                        actorName: userName
                      }));
                    }
                  }
                }
              });
            }
          }
          await batch.commit();

          // AUDIT: Log account archival
          auditFinance.accountArchived(account.id, account.name);
        }
      } catch (error) {
        if (stryMutAct_9fa48("292")) {
          {}
        } else {
          stryCov_9fa48("292");
          throw new AnchorError(stryMutAct_9fa48("293") ? "" : (stryCov_9fa48("293"), 'Failed to delete account'), stryMutAct_9fa48("294") ? "" : (stryCov_9fa48("294"), 'DATABASE'), error);
        }
      }
    }
  }

  /**
   * Rename an account and track history.
   * Handles large transaction sets by chunking batch writes (Firestore limit: 500 ops).
   */
  async renameAccount(userId: string, userName: string, account: AnchorAccount, newName: string): Promise<void> {
    if (stryMutAct_9fa48("295")) {
      {}
    } else {
      stryCov_9fa48("295");
      if (stryMutAct_9fa48("298") ? false : stryMutAct_9fa48("297") ? true : stryMutAct_9fa48("296") ? canManageAccount(account, userId) : (stryCov_9fa48("296", "297", "298"), !canManageAccount(account, userId))) {
        if (stryMutAct_9fa48("299")) {
          {}
        } else {
          stryCov_9fa48("299");
          throw new AnchorError(stryMutAct_9fa48("300") ? "" : (stryCov_9fa48("300"), 'Permission denied: You cannot rename this account.'), stryMutAct_9fa48("301") ? "" : (stryCov_9fa48("301"), 'PERMISSION'));
        }
      }
      if (stryMutAct_9fa48("304") ? false : stryMutAct_9fa48("303") ? true : stryMutAct_9fa48("302") ? newName.trim() : (stryCov_9fa48("302", "303", "304"), !(stryMutAct_9fa48("305") ? newName : (stryCov_9fa48("305"), newName.trim())))) {
        if (stryMutAct_9fa48("306")) {
          {}
        } else {
          stryCov_9fa48("306");
          throw new AnchorError(stryMutAct_9fa48("307") ? "" : (stryCov_9fa48("307"), 'Account name cannot be empty.'), stryMutAct_9fa48("308") ? "" : (stryCov_9fa48("308"), 'VALIDATION'));
        }
      }
      try {
        if (stryMutAct_9fa48("309")) {
          {}
        } else {
          stryCov_9fa48("309");
          const timestamp = new Date().toISOString();
          const ownerId = stryMutAct_9fa48("312") ? account.ownerId && userId : stryMutAct_9fa48("311") ? false : stryMutAct_9fa48("310") ? true : (stryCov_9fa48("310", "311", "312"), account.ownerId || userId);
          const accRef = doc(this.firestore, stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), 'artifacts'), APP_ID, stryMutAct_9fa48("314") ? "" : (stryCov_9fa48("314"), 'users'), ownerId, stryMutAct_9fa48("315") ? "" : (stryCov_9fa48("315"), 'accounts'), account.id);
          const historyEntry = stryMutAct_9fa48("316") ? {} : (stryCov_9fa48("316"), {
            date: timestamp,
            oldName: account.name,
            newName,
            actorId: userId,
            actorName: userName
          });
          const currentHistory = stryMutAct_9fa48("319") ? account.nameHistory && [] : stryMutAct_9fa48("318") ? false : stryMutAct_9fa48("317") ? true : (stryCov_9fa48("317", "318", "319"), account.nameHistory || (stryMutAct_9fa48("320") ? ["Stryker was here"] : (stryCov_9fa48("320"), [])));
          const txQuery = query(collection(this.firestore, stryMutAct_9fa48("321") ? "" : (stryCov_9fa48("321"), 'artifacts'), APP_ID, stryMutAct_9fa48("322") ? "" : (stryCov_9fa48("322"), 'users'), ownerId, stryMutAct_9fa48("323") ? "" : (stryCov_9fa48("323"), 'finance')), where(stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), 'accountId'), stryMutAct_9fa48("325") ? "" : (stryCov_9fa48("325"), '=='), account.id));
          const txSnap = await getDocs(txQuery);
          const txDocs = txSnap.docs;
          const BATCH_CHUNK_SIZE = 400;
          const chunks: typeof txDocs[] = stryMutAct_9fa48("326") ? ["Stryker was here"] : (stryCov_9fa48("326"), []);
          for (let i = 0; stryMutAct_9fa48("329") ? i >= txDocs.length : stryMutAct_9fa48("328") ? i <= txDocs.length : stryMutAct_9fa48("327") ? false : (stryCov_9fa48("327", "328", "329"), i < txDocs.length); stryMutAct_9fa48("330") ? i -= BATCH_CHUNK_SIZE : (stryCov_9fa48("330"), i += BATCH_CHUNK_SIZE)) {
            if (stryMutAct_9fa48("331")) {
              {}
            } else {
              stryCov_9fa48("331");
              chunks.push(stryMutAct_9fa48("332") ? txDocs : (stryCov_9fa48("332"), txDocs.slice(i, stryMutAct_9fa48("333") ? i - BATCH_CHUNK_SIZE : (stryCov_9fa48("333"), i + BATCH_CHUNK_SIZE))));
            }
          }
          const firstBatch = writeBatch(this.firestore);
          firstBatch.update(accRef, stryMutAct_9fa48("334") ? {} : (stryCov_9fa48("334"), {
            name: newName,
            nameHistory: stryMutAct_9fa48("335") ? [] : (stryCov_9fa48("335"), [...currentHistory, historyEntry])
          }));
          if (stryMutAct_9fa48("339") ? chunks.length <= 0 : stryMutAct_9fa48("338") ? chunks.length >= 0 : stryMutAct_9fa48("337") ? false : stryMutAct_9fa48("336") ? true : (stryCov_9fa48("336", "337", "338", "339"), chunks.length > 0)) {
            if (stryMutAct_9fa48("340")) {
              {}
            } else {
              stryCov_9fa48("340");
              chunks[0].forEach(stryMutAct_9fa48("341") ? () => undefined : (stryCov_9fa48("341"), d => firstBatch.update(d.ref, stryMutAct_9fa48("342") ? {} : (stryCov_9fa48("342"), {
                accountName: newName
              }))));
            }
          }
          await firstBatch.commit();
          for (let i = 1; stryMutAct_9fa48("345") ? i >= chunks.length : stryMutAct_9fa48("344") ? i <= chunks.length : stryMutAct_9fa48("343") ? false : (stryCov_9fa48("343", "344", "345"), i < chunks.length); stryMutAct_9fa48("346") ? i-- : (stryCov_9fa48("346"), i++)) {
            if (stryMutAct_9fa48("347")) {
              {}
            } else {
              stryCov_9fa48("347");
              const batch = writeBatch(this.firestore);
              chunks[i].forEach(stryMutAct_9fa48("348") ? () => undefined : (stryCov_9fa48("348"), d => batch.update(d.ref, stryMutAct_9fa48("349") ? {} : (stryCov_9fa48("349"), {
                accountName: newName
              }))));
              await batch.commit();
            }
          }

          // Sync shared account transactions
          if (stryMutAct_9fa48("351") ? false : stryMutAct_9fa48("350") ? true : (stryCov_9fa48("350", "351"), account.shares)) {
            if (stryMutAct_9fa48("352")) {
              {}
            } else {
              stryCov_9fa48("352");
              for (const spouseId of Object.keys(account.shares)) {
                if (stryMutAct_9fa48("353")) {
                  {}
                } else {
                  stryCov_9fa48("353");
                  const spouseTxQuery = query(collection(this.firestore, stryMutAct_9fa48("354") ? "" : (stryCov_9fa48("354"), 'artifacts'), APP_ID, stryMutAct_9fa48("355") ? "" : (stryCov_9fa48("355"), 'users'), spouseId, stryMutAct_9fa48("356") ? "" : (stryCov_9fa48("356"), 'finance')), where(stryMutAct_9fa48("357") ? "" : (stryCov_9fa48("357"), 'accountId'), stryMutAct_9fa48("358") ? "" : (stryCov_9fa48("358"), '=='), account.id));
                  const spouseTxSnap = await getDocs(spouseTxQuery);
                  if (stryMutAct_9fa48("361") ? false : stryMutAct_9fa48("360") ? true : stryMutAct_9fa48("359") ? spouseTxSnap.empty : (stryCov_9fa48("359", "360", "361"), !spouseTxSnap.empty)) {
                    if (stryMutAct_9fa48("362")) {
                      {}
                    } else {
                      stryCov_9fa48("362");
                      const spouseTxDocs = spouseTxSnap.docs;
                      for (let i = 0; stryMutAct_9fa48("365") ? i >= spouseTxDocs.length : stryMutAct_9fa48("364") ? i <= spouseTxDocs.length : stryMutAct_9fa48("363") ? false : (stryCov_9fa48("363", "364", "365"), i < spouseTxDocs.length); stryMutAct_9fa48("366") ? i -= BATCH_CHUNK_SIZE : (stryCov_9fa48("366"), i += BATCH_CHUNK_SIZE)) {
                        if (stryMutAct_9fa48("367")) {
                          {}
                        } else {
                          stryCov_9fa48("367");
                          const spouseBatch = writeBatch(this.firestore);
                          stryMutAct_9fa48("368") ? spouseTxDocs.forEach(d => spouseBatch.update(d.ref, {
                            accountName: newName
                          })) : (stryCov_9fa48("368"), spouseTxDocs.slice(i, stryMutAct_9fa48("369") ? i - BATCH_CHUNK_SIZE : (stryCov_9fa48("369"), i + BATCH_CHUNK_SIZE)).forEach(stryMutAct_9fa48("370") ? () => undefined : (stryCov_9fa48("370"), d => spouseBatch.update(d.ref, stryMutAct_9fa48("371") ? {} : (stryCov_9fa48("371"), {
                            accountName: newName
                          })))));
                          await spouseBatch.commit();
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          // AUDIT: Log account rename
          auditFinance.accountRenamed(account.id, account.name, newName);
        }
      } catch (error) {
        if (stryMutAct_9fa48("372")) {
          {}
        } else {
          stryCov_9fa48("372");
          if (stryMutAct_9fa48("374") ? false : stryMutAct_9fa48("373") ? true : (stryCov_9fa48("373", "374"), error instanceof AnchorError)) throw error;
          throw new AnchorError(stryMutAct_9fa48("375") ? "" : (stryCov_9fa48("375"), 'Failed to rename account'), stryMutAct_9fa48("376") ? "" : (stryCov_9fa48("376"), 'DATABASE'), error);
        }
      }
    }
  }
}
export const accountService = new AccountService();