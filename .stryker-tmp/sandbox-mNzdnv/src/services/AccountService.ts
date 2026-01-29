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
    if (stryMutAct_9fa48("8071")) {
      {}
    } else {
      stryCov_9fa48("8071");
      this.firestore = firestore;
    }
  }

  /** Add a new account */
  async addAccount(userId: string, payload: CreateAccountPayload): Promise<string> {
    if (stryMutAct_9fa48("8072")) {
      {}
    } else {
      stryCov_9fa48("8072");
      try {
        if (stryMutAct_9fa48("8073")) {
          {}
        } else {
          stryCov_9fa48("8073");
          const docRef = await addDoc(collection(this.firestore, stryMutAct_9fa48("8074") ? "" : (stryCov_9fa48("8074"), 'artifacts'), APP_ID, stryMutAct_9fa48("8075") ? "" : (stryCov_9fa48("8075"), 'users'), userId, stryMutAct_9fa48("8076") ? "" : (stryCov_9fa48("8076"), 'accounts')), stryMutAct_9fa48("8077") ? {} : (stryCov_9fa48("8077"), {
            ...payload,
            ownerId: userId,
            isArchived: stryMutAct_9fa48("8078") ? true : (stryCov_9fa48("8078"), false),
            shares: {}
          }));
          return docRef.id;
        }
      } catch (error) {
        if (stryMutAct_9fa48("8079")) {
          {}
        } else {
          stryCov_9fa48("8079");
          throw new AnchorError(stryMutAct_9fa48("8080") ? "" : (stryCov_9fa48("8080"), 'Failed to add account'), stryMutAct_9fa48("8081") ? "" : (stryCov_9fa48("8081"), 'DATABASE'), error);
        }
      }
    }
  }

  /** Delete (archive) an account */
  async deleteAccount(userId: string, userName: string, account: AnchorAccount): Promise<void> {
    if (stryMutAct_9fa48("8082")) {
      {}
    } else {
      stryCov_9fa48("8082");
      if (stryMutAct_9fa48("8085") ? false : stryMutAct_9fa48("8084") ? true : stryMutAct_9fa48("8083") ? canManageAccount(account, userId) : (stryCov_9fa48("8083", "8084", "8085"), !canManageAccount(account, userId))) {
        if (stryMutAct_9fa48("8086")) {
          {}
        } else {
          stryCov_9fa48("8086");
          throw new AnchorError(stryMutAct_9fa48("8087") ? "" : (stryCov_9fa48("8087"), 'Permission denied: You cannot delete this account.'), stryMutAct_9fa48("8088") ? "" : (stryCov_9fa48("8088"), 'PERMISSION'));
        }
      }
      try {
        if (stryMutAct_9fa48("8089")) {
          {}
        } else {
          stryCov_9fa48("8089");
          const batch = writeBatch(this.firestore);
          const timestamp = new Date().toISOString();
          const accRef = doc(this.firestore, stryMutAct_9fa48("8090") ? "" : (stryCov_9fa48("8090"), 'artifacts'), APP_ID, stryMutAct_9fa48("8091") ? "" : (stryCov_9fa48("8091"), 'users'), userId, stryMutAct_9fa48("8092") ? "" : (stryCov_9fa48("8092"), 'accounts'), account.id);
          batch.update(accRef, stryMutAct_9fa48("8093") ? {} : (stryCov_9fa48("8093"), {
            isArchived: stryMutAct_9fa48("8094") ? false : (stryCov_9fa48("8094"), true)
          }));
          if (stryMutAct_9fa48("8096") ? false : stryMutAct_9fa48("8095") ? true : (stryCov_9fa48("8095", "8096"), account.shares)) {
            if (stryMutAct_9fa48("8097")) {
              {}
            } else {
              stryCov_9fa48("8097");
              Object.keys(account.shares).forEach(uid => {
                if (stryMutAct_9fa48("8098")) {
                  {}
                } else {
                  stryCov_9fa48("8098");
                  if (stryMutAct_9fa48("8101") ? uid === userId : stryMutAct_9fa48("8100") ? false : stryMutAct_9fa48("8099") ? true : (stryCov_9fa48("8099", "8100", "8101"), uid !== userId)) {
                    if (stryMutAct_9fa48("8102")) {
                      {}
                    } else {
                      stryCov_9fa48("8102");
                      const notifRef = doc(collection(this.firestore, stryMutAct_9fa48("8103") ? "" : (stryCov_9fa48("8103"), 'artifacts'), APP_ID, stryMutAct_9fa48("8104") ? "" : (stryCov_9fa48("8104"), 'users'), uid, stryMutAct_9fa48("8105") ? "" : (stryCov_9fa48("8105"), 'notifications')));
                      batch.set(notifRef, stryMutAct_9fa48("8106") ? {} : (stryCov_9fa48("8106"), {
                        type: stryMutAct_9fa48("8107") ? "" : (stryCov_9fa48("8107"), 'system'),
                        date: timestamp,
                        read: stryMutAct_9fa48("8108") ? true : (stryCov_9fa48("8108"), false),
                        message: stryMutAct_9fa48("8109") ? `` : (stryCov_9fa48("8109"), `The account "${account.name}" has been deleted by the owner. You no longer have access.`),
                        title: stryMutAct_9fa48("8110") ? "" : (stryCov_9fa48("8110"), 'Account Deleted'),
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
        }
      } catch (error) {
        if (stryMutAct_9fa48("8111")) {
          {}
        } else {
          stryCov_9fa48("8111");
          throw new AnchorError(stryMutAct_9fa48("8112") ? "" : (stryCov_9fa48("8112"), 'Failed to delete account'), stryMutAct_9fa48("8113") ? "" : (stryCov_9fa48("8113"), 'DATABASE'), error);
        }
      }
    }
  }

  /**
   * Rename an account and track history.
   * Handles large transaction sets by chunking batch writes (Firestore limit: 500 ops).
   */
  async renameAccount(userId: string, userName: string, account: AnchorAccount, newName: string): Promise<void> {
    if (stryMutAct_9fa48("8114")) {
      {}
    } else {
      stryCov_9fa48("8114");
      if (stryMutAct_9fa48("8117") ? false : stryMutAct_9fa48("8116") ? true : stryMutAct_9fa48("8115") ? canManageAccount(account, userId) : (stryCov_9fa48("8115", "8116", "8117"), !canManageAccount(account, userId))) {
        if (stryMutAct_9fa48("8118")) {
          {}
        } else {
          stryCov_9fa48("8118");
          throw new AnchorError(stryMutAct_9fa48("8119") ? "" : (stryCov_9fa48("8119"), 'Permission denied: You cannot rename this account.'), stryMutAct_9fa48("8120") ? "" : (stryCov_9fa48("8120"), 'PERMISSION'));
        }
      }
      if (stryMutAct_9fa48("8123") ? false : stryMutAct_9fa48("8122") ? true : stryMutAct_9fa48("8121") ? newName.trim() : (stryCov_9fa48("8121", "8122", "8123"), !(stryMutAct_9fa48("8124") ? newName : (stryCov_9fa48("8124"), newName.trim())))) {
        if (stryMutAct_9fa48("8125")) {
          {}
        } else {
          stryCov_9fa48("8125");
          throw new AnchorError(stryMutAct_9fa48("8126") ? "" : (stryCov_9fa48("8126"), 'Account name cannot be empty.'), stryMutAct_9fa48("8127") ? "" : (stryCov_9fa48("8127"), 'VALIDATION'));
        }
      }
      try {
        if (stryMutAct_9fa48("8128")) {
          {}
        } else {
          stryCov_9fa48("8128");
          const timestamp = new Date().toISOString();
          const ownerId = stryMutAct_9fa48("8131") ? account.ownerId && userId : stryMutAct_9fa48("8130") ? false : stryMutAct_9fa48("8129") ? true : (stryCov_9fa48("8129", "8130", "8131"), account.ownerId || userId);
          const accRef = doc(this.firestore, stryMutAct_9fa48("8132") ? "" : (stryCov_9fa48("8132"), 'artifacts'), APP_ID, stryMutAct_9fa48("8133") ? "" : (stryCov_9fa48("8133"), 'users'), ownerId, stryMutAct_9fa48("8134") ? "" : (stryCov_9fa48("8134"), 'accounts'), account.id);
          const historyEntry = stryMutAct_9fa48("8135") ? {} : (stryCov_9fa48("8135"), {
            date: timestamp,
            oldName: account.name,
            newName,
            actorId: userId,
            actorName: userName
          });
          const currentHistory = stryMutAct_9fa48("8138") ? account.nameHistory && [] : stryMutAct_9fa48("8137") ? false : stryMutAct_9fa48("8136") ? true : (stryCov_9fa48("8136", "8137", "8138"), account.nameHistory || (stryMutAct_9fa48("8139") ? ["Stryker was here"] : (stryCov_9fa48("8139"), [])));
          const txQuery = query(collection(this.firestore, stryMutAct_9fa48("8140") ? "" : (stryCov_9fa48("8140"), 'artifacts'), APP_ID, stryMutAct_9fa48("8141") ? "" : (stryCov_9fa48("8141"), 'users'), ownerId, stryMutAct_9fa48("8142") ? "" : (stryCov_9fa48("8142"), 'finance')), where(stryMutAct_9fa48("8143") ? "" : (stryCov_9fa48("8143"), 'accountId'), stryMutAct_9fa48("8144") ? "" : (stryCov_9fa48("8144"), '=='), account.id));
          const txSnap = await getDocs(txQuery);
          const txDocs = txSnap.docs;
          const BATCH_CHUNK_SIZE = 400;
          const chunks: typeof txDocs[] = stryMutAct_9fa48("8145") ? ["Stryker was here"] : (stryCov_9fa48("8145"), []);
          for (let i = 0; stryMutAct_9fa48("8148") ? i >= txDocs.length : stryMutAct_9fa48("8147") ? i <= txDocs.length : stryMutAct_9fa48("8146") ? false : (stryCov_9fa48("8146", "8147", "8148"), i < txDocs.length); stryMutAct_9fa48("8149") ? i -= BATCH_CHUNK_SIZE : (stryCov_9fa48("8149"), i += BATCH_CHUNK_SIZE)) {
            if (stryMutAct_9fa48("8150")) {
              {}
            } else {
              stryCov_9fa48("8150");
              chunks.push(stryMutAct_9fa48("8151") ? txDocs : (stryCov_9fa48("8151"), txDocs.slice(i, stryMutAct_9fa48("8152") ? i - BATCH_CHUNK_SIZE : (stryCov_9fa48("8152"), i + BATCH_CHUNK_SIZE))));
            }
          }
          const firstBatch = writeBatch(this.firestore);
          firstBatch.update(accRef, stryMutAct_9fa48("8153") ? {} : (stryCov_9fa48("8153"), {
            name: newName,
            nameHistory: stryMutAct_9fa48("8154") ? [] : (stryCov_9fa48("8154"), [...currentHistory, historyEntry])
          }));
          if (stryMutAct_9fa48("8158") ? chunks.length <= 0 : stryMutAct_9fa48("8157") ? chunks.length >= 0 : stryMutAct_9fa48("8156") ? false : stryMutAct_9fa48("8155") ? true : (stryCov_9fa48("8155", "8156", "8157", "8158"), chunks.length > 0)) {
            if (stryMutAct_9fa48("8159")) {
              {}
            } else {
              stryCov_9fa48("8159");
              chunks[0].forEach(stryMutAct_9fa48("8160") ? () => undefined : (stryCov_9fa48("8160"), d => firstBatch.update(d.ref, stryMutAct_9fa48("8161") ? {} : (stryCov_9fa48("8161"), {
                accountName: newName
              }))));
            }
          }
          await firstBatch.commit();
          for (let i = 1; stryMutAct_9fa48("8164") ? i >= chunks.length : stryMutAct_9fa48("8163") ? i <= chunks.length : stryMutAct_9fa48("8162") ? false : (stryCov_9fa48("8162", "8163", "8164"), i < chunks.length); stryMutAct_9fa48("8165") ? i-- : (stryCov_9fa48("8165"), i++)) {
            if (stryMutAct_9fa48("8166")) {
              {}
            } else {
              stryCov_9fa48("8166");
              const batch = writeBatch(this.firestore);
              chunks[i].forEach(stryMutAct_9fa48("8167") ? () => undefined : (stryCov_9fa48("8167"), d => batch.update(d.ref, stryMutAct_9fa48("8168") ? {} : (stryCov_9fa48("8168"), {
                accountName: newName
              }))));
              await batch.commit();
            }
          }

          // Sync shared account transactions
          if (stryMutAct_9fa48("8170") ? false : stryMutAct_9fa48("8169") ? true : (stryCov_9fa48("8169", "8170"), account.shares)) {
            if (stryMutAct_9fa48("8171")) {
              {}
            } else {
              stryCov_9fa48("8171");
              for (const spouseId of Object.keys(account.shares)) {
                if (stryMutAct_9fa48("8172")) {
                  {}
                } else {
                  stryCov_9fa48("8172");
                  const spouseTxQuery = query(collection(this.firestore, stryMutAct_9fa48("8173") ? "" : (stryCov_9fa48("8173"), 'artifacts'), APP_ID, stryMutAct_9fa48("8174") ? "" : (stryCov_9fa48("8174"), 'users'), spouseId, stryMutAct_9fa48("8175") ? "" : (stryCov_9fa48("8175"), 'finance')), where(stryMutAct_9fa48("8176") ? "" : (stryCov_9fa48("8176"), 'accountId'), stryMutAct_9fa48("8177") ? "" : (stryCov_9fa48("8177"), '=='), account.id));
                  const spouseTxSnap = await getDocs(spouseTxQuery);
                  if (stryMutAct_9fa48("8180") ? false : stryMutAct_9fa48("8179") ? true : stryMutAct_9fa48("8178") ? spouseTxSnap.empty : (stryCov_9fa48("8178", "8179", "8180"), !spouseTxSnap.empty)) {
                    if (stryMutAct_9fa48("8181")) {
                      {}
                    } else {
                      stryCov_9fa48("8181");
                      const spouseTxDocs = spouseTxSnap.docs;
                      for (let i = 0; stryMutAct_9fa48("8184") ? i >= spouseTxDocs.length : stryMutAct_9fa48("8183") ? i <= spouseTxDocs.length : stryMutAct_9fa48("8182") ? false : (stryCov_9fa48("8182", "8183", "8184"), i < spouseTxDocs.length); stryMutAct_9fa48("8185") ? i -= BATCH_CHUNK_SIZE : (stryCov_9fa48("8185"), i += BATCH_CHUNK_SIZE)) {
                        if (stryMutAct_9fa48("8186")) {
                          {}
                        } else {
                          stryCov_9fa48("8186");
                          const spouseBatch = writeBatch(this.firestore);
                          stryMutAct_9fa48("8187") ? spouseTxDocs.forEach(d => spouseBatch.update(d.ref, {
                            accountName: newName
                          })) : (stryCov_9fa48("8187"), spouseTxDocs.slice(i, stryMutAct_9fa48("8188") ? i - BATCH_CHUNK_SIZE : (stryCov_9fa48("8188"), i + BATCH_CHUNK_SIZE)).forEach(stryMutAct_9fa48("8189") ? () => undefined : (stryCov_9fa48("8189"), d => spouseBatch.update(d.ref, stryMutAct_9fa48("8190") ? {} : (stryCov_9fa48("8190"), {
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
        }
      } catch (error) {
        if (stryMutAct_9fa48("8191")) {
          {}
        } else {
          stryCov_9fa48("8191");
          if (stryMutAct_9fa48("8193") ? false : stryMutAct_9fa48("8192") ? true : (stryCov_9fa48("8192", "8193"), error instanceof AnchorError)) throw error;
          throw new AnchorError(stryMutAct_9fa48("8194") ? "" : (stryCov_9fa48("8194"), 'Failed to rename account'), stryMutAct_9fa48("8195") ? "" : (stryCov_9fa48("8195"), 'DATABASE'), error);
        }
      }
    }
  }
}
export const accountService = new AccountService();