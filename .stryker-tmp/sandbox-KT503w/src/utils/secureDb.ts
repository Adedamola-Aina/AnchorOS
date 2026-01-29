/**
 * Secure Database Utility Layer
 * 
 * Centralized Firestore wrapper with timeout handling, error mapping, and type-safe operations.
 * Refactored per CLAUDE.md §3.2 - core helpers extracted to secureDbCore.ts
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
import { getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, type QueryConstraint } from 'firebase/firestore';
import { withTimeout, logOp, getUserDocRef, getUserCollectionPath } from './secureDbCore';
interface SecureDbOptions {
  timeoutMs?: number;
}
export const secureDb = stryMutAct_9fa48("9368") ? {} : (stryCov_9fa48("9368"), {
  async getDocument<T>(userId: string, path: string[], options: SecureDbOptions = {}): Promise<T | null> {
    if (stryMutAct_9fa48("9369")) {
      {}
    } else {
      stryCov_9fa48("9369");
      const docPath = path.join(stryMutAct_9fa48("9370") ? "" : (stryCov_9fa48("9370"), '/'));
      logOp(stryMutAct_9fa48("9371") ? "" : (stryCov_9fa48("9371"), 'GET'), stryMutAct_9fa48("9372") ? `` : (stryCov_9fa48("9372"), `users/${userId}/${docPath}`));
      try {
        if (stryMutAct_9fa48("9373")) {
          {}
        } else {
          stryCov_9fa48("9373");
          const docRef = getUserDocRef(userId, ...path);
          const snapshot = await withTimeout(getDoc(docRef), options.timeoutMs, stryMutAct_9fa48("9374") ? `` : (stryCov_9fa48("9374"), `getDocument(${docPath})`));
          if (stryMutAct_9fa48("9377") ? false : stryMutAct_9fa48("9376") ? true : stryMutAct_9fa48("9375") ? snapshot.exists() : (stryCov_9fa48("9375", "9376", "9377"), !snapshot.exists())) return null;
          return {
            id: snapshot.id,
            ...snapshot.data()
          } as T;
        }
      } catch (error) {
        if (stryMutAct_9fa48("9378")) {
          {}
        } else {
          stryCov_9fa48("9378");
          console.error(stryMutAct_9fa48("9379") ? `` : (stryCov_9fa48("9379"), `[SecureDb] Error getting document: ${docPath}`), error);
          throw error;
        }
      }
    }
  },
  async queryCollection<T>(userId: string, collectionName: string, constraints: QueryConstraint[] = stryMutAct_9fa48("9380") ? ["Stryker was here"] : (stryCov_9fa48("9380"), []), options: SecureDbOptions = {}): Promise<T[]> {
    if (stryMutAct_9fa48("9381")) {
      {}
    } else {
      stryCov_9fa48("9381");
      logOp(stryMutAct_9fa48("9382") ? "" : (stryCov_9fa48("9382"), 'QUERY'), stryMutAct_9fa48("9383") ? `` : (stryCov_9fa48("9383"), `users/${userId}/${collectionName}`));
      try {
        if (stryMutAct_9fa48("9384")) {
          {}
        } else {
          stryCov_9fa48("9384");
          const collectionRef = getUserCollectionPath(userId, collectionName);
          const q = (stryMutAct_9fa48("9388") ? constraints.length <= 0 : stryMutAct_9fa48("9387") ? constraints.length >= 0 : stryMutAct_9fa48("9386") ? false : stryMutAct_9fa48("9385") ? true : (stryCov_9fa48("9385", "9386", "9387", "9388"), constraints.length > 0)) ? query(collectionRef, ...constraints) : query(collectionRef);
          const snapshot = await withTimeout(getDocs(q), options.timeoutMs, stryMutAct_9fa48("9389") ? `` : (stryCov_9fa48("9389"), `queryCollection(${collectionName})`));
          return snapshot.docs.map(stryMutAct_9fa48("9390") ? () => undefined : (stryCov_9fa48("9390"), doc => ({
            id: doc.id,
            ...doc.data()
          }) as T));
        }
      } catch (error) {
        if (stryMutAct_9fa48("9391")) {
          {}
        } else {
          stryCov_9fa48("9391");
          console.error(stryMutAct_9fa48("9392") ? `` : (stryCov_9fa48("9392"), `[SecureDb] Error querying collection: ${collectionName}`), error);
          throw error;
        }
      }
    }
  },
  async setDocument(userId: string, path: string[], data: Record<string, unknown>, options: SecureDbOptions = {}): Promise<void> {
    if (stryMutAct_9fa48("9393")) {
      {}
    } else {
      stryCov_9fa48("9393");
      const docPath = path.join(stryMutAct_9fa48("9394") ? "" : (stryCov_9fa48("9394"), '/'));
      logOp(stryMutAct_9fa48("9395") ? "" : (stryCov_9fa48("9395"), 'SET'), stryMutAct_9fa48("9396") ? `` : (stryCov_9fa48("9396"), `users/${userId}/${docPath}`), data);
      try {
        if (stryMutAct_9fa48("9397")) {
          {}
        } else {
          stryCov_9fa48("9397");
          const docRef = getUserDocRef(userId, ...path);
          await withTimeout(setDoc(docRef, data), options.timeoutMs, stryMutAct_9fa48("9398") ? `` : (stryCov_9fa48("9398"), `setDocument(${docPath})`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("9399")) {
          {}
        } else {
          stryCov_9fa48("9399");
          console.error(stryMutAct_9fa48("9400") ? `` : (stryCov_9fa48("9400"), `[SecureDb] Error setting document: ${docPath}`), error);
          throw error;
        }
      }
    }
  },
  async updateDocument(userId: string, path: string[], data: Record<string, unknown>, options: SecureDbOptions = {}): Promise<void> {
    if (stryMutAct_9fa48("9401")) {
      {}
    } else {
      stryCov_9fa48("9401");
      const docPath = path.join(stryMutAct_9fa48("9402") ? "" : (stryCov_9fa48("9402"), '/'));
      logOp(stryMutAct_9fa48("9403") ? "" : (stryCov_9fa48("9403"), 'UPDATE'), stryMutAct_9fa48("9404") ? `` : (stryCov_9fa48("9404"), `users/${userId}/${docPath}`), data);
      try {
        if (stryMutAct_9fa48("9405")) {
          {}
        } else {
          stryCov_9fa48("9405");
          const docRef = getUserDocRef(userId, ...path);
          await withTimeout(updateDoc(docRef, data), options.timeoutMs, stryMutAct_9fa48("9406") ? `` : (stryCov_9fa48("9406"), `updateDocument(${docPath})`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("9407")) {
          {}
        } else {
          stryCov_9fa48("9407");
          console.error(stryMutAct_9fa48("9408") ? `` : (stryCov_9fa48("9408"), `[SecureDb] Error updating document: ${docPath}`), error);
          throw error;
        }
      }
    }
  },
  async deleteDocument(userId: string, path: string[], options: SecureDbOptions = {}): Promise<void> {
    if (stryMutAct_9fa48("9409")) {
      {}
    } else {
      stryCov_9fa48("9409");
      const docPath = path.join(stryMutAct_9fa48("9410") ? "" : (stryCov_9fa48("9410"), '/'));
      logOp(stryMutAct_9fa48("9411") ? "" : (stryCov_9fa48("9411"), 'DELETE'), stryMutAct_9fa48("9412") ? `` : (stryCov_9fa48("9412"), `users/${userId}/${docPath}`));
      try {
        if (stryMutAct_9fa48("9413")) {
          {}
        } else {
          stryCov_9fa48("9413");
          const docRef = getUserDocRef(userId, ...path);
          await withTimeout(deleteDoc(docRef), options.timeoutMs, stryMutAct_9fa48("9414") ? `` : (stryCov_9fa48("9414"), `deleteDocument(${docPath})`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("9415")) {
          {}
        } else {
          stryCov_9fa48("9415");
          console.error(stryMutAct_9fa48("9416") ? `` : (stryCov_9fa48("9416"), `[SecureDb] Error deleting document: ${docPath}`), error);
          throw error;
        }
      }
    }
  }
});

// Re-exports
export { where, query } from 'firebase/firestore';
export { withTimeout, mapSecureDbError, getUserDocRef, getUserCollectionPath } from './secureDbCore';