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
export const secureDb = stryMutAct_9fa48("1831") ? {} : (stryCov_9fa48("1831"), {
  async getDocument<T>(userId: string, path: string[], options: SecureDbOptions = {}): Promise<T | null> {
    if (stryMutAct_9fa48("1832")) {
      {}
    } else {
      stryCov_9fa48("1832");
      const docPath = path.join(stryMutAct_9fa48("1833") ? "" : (stryCov_9fa48("1833"), '/'));
      logOp(stryMutAct_9fa48("1834") ? "" : (stryCov_9fa48("1834"), 'GET'), stryMutAct_9fa48("1835") ? `` : (stryCov_9fa48("1835"), `users/${userId}/${docPath}`));
      try {
        if (stryMutAct_9fa48("1836")) {
          {}
        } else {
          stryCov_9fa48("1836");
          const docRef = getUserDocRef(userId, ...path);
          const snapshot = await withTimeout(getDoc(docRef), options.timeoutMs, stryMutAct_9fa48("1837") ? `` : (stryCov_9fa48("1837"), `getDocument(${docPath})`));
          if (stryMutAct_9fa48("1840") ? false : stryMutAct_9fa48("1839") ? true : stryMutAct_9fa48("1838") ? snapshot.exists() : (stryCov_9fa48("1838", "1839", "1840"), !snapshot.exists())) return null;
          return {
            id: snapshot.id,
            ...snapshot.data()
          } as T;
        }
      } catch (error) {
        if (stryMutAct_9fa48("1841")) {
          {}
        } else {
          stryCov_9fa48("1841");
          console.error(stryMutAct_9fa48("1842") ? `` : (stryCov_9fa48("1842"), `[SecureDb] Error getting document: ${docPath}`), error);
          throw error;
        }
      }
    }
  },
  async queryCollection<T>(userId: string, collectionName: string, constraints: QueryConstraint[] = stryMutAct_9fa48("1843") ? ["Stryker was here"] : (stryCov_9fa48("1843"), []), options: SecureDbOptions = {}): Promise<T[]> {
    if (stryMutAct_9fa48("1844")) {
      {}
    } else {
      stryCov_9fa48("1844");
      logOp(stryMutAct_9fa48("1845") ? "" : (stryCov_9fa48("1845"), 'QUERY'), stryMutAct_9fa48("1846") ? `` : (stryCov_9fa48("1846"), `users/${userId}/${collectionName}`));
      try {
        if (stryMutAct_9fa48("1847")) {
          {}
        } else {
          stryCov_9fa48("1847");
          const collectionRef = getUserCollectionPath(userId, collectionName);
          const q = (stryMutAct_9fa48("1851") ? constraints.length <= 0 : stryMutAct_9fa48("1850") ? constraints.length >= 0 : stryMutAct_9fa48("1849") ? false : stryMutAct_9fa48("1848") ? true : (stryCov_9fa48("1848", "1849", "1850", "1851"), constraints.length > 0)) ? query(collectionRef, ...constraints) : query(collectionRef);
          const snapshot = await withTimeout(getDocs(q), options.timeoutMs, stryMutAct_9fa48("1852") ? `` : (stryCov_9fa48("1852"), `queryCollection(${collectionName})`));
          return snapshot.docs.map(stryMutAct_9fa48("1853") ? () => undefined : (stryCov_9fa48("1853"), doc => ({
            id: doc.id,
            ...doc.data()
          }) as T));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1854")) {
          {}
        } else {
          stryCov_9fa48("1854");
          console.error(stryMutAct_9fa48("1855") ? `` : (stryCov_9fa48("1855"), `[SecureDb] Error querying collection: ${collectionName}`), error);
          throw error;
        }
      }
    }
  },
  async setDocument(userId: string, path: string[], data: Record<string, unknown>, options: SecureDbOptions = {}): Promise<void> {
    if (stryMutAct_9fa48("1856")) {
      {}
    } else {
      stryCov_9fa48("1856");
      const docPath = path.join(stryMutAct_9fa48("1857") ? "" : (stryCov_9fa48("1857"), '/'));
      logOp(stryMutAct_9fa48("1858") ? "" : (stryCov_9fa48("1858"), 'SET'), stryMutAct_9fa48("1859") ? `` : (stryCov_9fa48("1859"), `users/${userId}/${docPath}`), data);
      try {
        if (stryMutAct_9fa48("1860")) {
          {}
        } else {
          stryCov_9fa48("1860");
          const docRef = getUserDocRef(userId, ...path);
          await withTimeout(setDoc(docRef, data), options.timeoutMs, stryMutAct_9fa48("1861") ? `` : (stryCov_9fa48("1861"), `setDocument(${docPath})`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1862")) {
          {}
        } else {
          stryCov_9fa48("1862");
          console.error(stryMutAct_9fa48("1863") ? `` : (stryCov_9fa48("1863"), `[SecureDb] Error setting document: ${docPath}`), error);
          throw error;
        }
      }
    }
  },
  async updateDocument(userId: string, path: string[], data: Record<string, unknown>, options: SecureDbOptions = {}): Promise<void> {
    if (stryMutAct_9fa48("1864")) {
      {}
    } else {
      stryCov_9fa48("1864");
      const docPath = path.join(stryMutAct_9fa48("1865") ? "" : (stryCov_9fa48("1865"), '/'));
      logOp(stryMutAct_9fa48("1866") ? "" : (stryCov_9fa48("1866"), 'UPDATE'), stryMutAct_9fa48("1867") ? `` : (stryCov_9fa48("1867"), `users/${userId}/${docPath}`), data);
      try {
        if (stryMutAct_9fa48("1868")) {
          {}
        } else {
          stryCov_9fa48("1868");
          const docRef = getUserDocRef(userId, ...path);
          await withTimeout(updateDoc(docRef, data), options.timeoutMs, stryMutAct_9fa48("1869") ? `` : (stryCov_9fa48("1869"), `updateDocument(${docPath})`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1870")) {
          {}
        } else {
          stryCov_9fa48("1870");
          console.error(stryMutAct_9fa48("1871") ? `` : (stryCov_9fa48("1871"), `[SecureDb] Error updating document: ${docPath}`), error);
          throw error;
        }
      }
    }
  },
  async deleteDocument(userId: string, path: string[], options: SecureDbOptions = {}): Promise<void> {
    if (stryMutAct_9fa48("1872")) {
      {}
    } else {
      stryCov_9fa48("1872");
      const docPath = path.join(stryMutAct_9fa48("1873") ? "" : (stryCov_9fa48("1873"), '/'));
      logOp(stryMutAct_9fa48("1874") ? "" : (stryCov_9fa48("1874"), 'DELETE'), stryMutAct_9fa48("1875") ? `` : (stryCov_9fa48("1875"), `users/${userId}/${docPath}`));
      try {
        if (stryMutAct_9fa48("1876")) {
          {}
        } else {
          stryCov_9fa48("1876");
          const docRef = getUserDocRef(userId, ...path);
          await withTimeout(deleteDoc(docRef), options.timeoutMs, stryMutAct_9fa48("1877") ? `` : (stryCov_9fa48("1877"), `deleteDocument(${docPath})`));
        }
      } catch (error) {
        if (stryMutAct_9fa48("1878")) {
          {}
        } else {
          stryCov_9fa48("1878");
          console.error(stryMutAct_9fa48("1879") ? `` : (stryCov_9fa48("1879"), `[SecureDb] Error deleting document: ${docPath}`), error);
          throw error;
        }
      }
    }
  }
});

// Re-exports
export { where, query } from 'firebase/firestore';
export { withTimeout, mapSecureDbError, getUserDocRef, getUserCollectionPath } from './secureDbCore';