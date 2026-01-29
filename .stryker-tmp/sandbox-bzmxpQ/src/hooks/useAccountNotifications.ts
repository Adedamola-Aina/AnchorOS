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
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import type { AnchorNotification } from '../types';
export const useAccountNotifications = (accountId?: string) => {
  if (stryMutAct_9fa48("6791")) {
    {}
  } else {
    stryCov_9fa48("6791");
    const {
      user
    } = useAuth();
    const [notifications, setNotifications] = useState<AnchorNotification[]>(stryMutAct_9fa48("6792") ? ["Stryker was here"] : (stryCov_9fa48("6792"), []));
    const [loading, setLoading] = useState(stryMutAct_9fa48("6793") ? false : (stryCov_9fa48("6793"), true));
    useEffect(() => {
      if (stryMutAct_9fa48("6794")) {
        {}
      } else {
        stryCov_9fa48("6794");
        if (stryMutAct_9fa48("6797") ? false : stryMutAct_9fa48("6796") ? true : stryMutAct_9fa48("6795") ? user : (stryCov_9fa48("6795", "6796", "6797"), !user)) {
          if (stryMutAct_9fa48("6798")) {
            {}
          } else {
            stryCov_9fa48("6798");
            setLoading(stryMutAct_9fa48("6799") ? true : (stryCov_9fa48("6799"), false));
            return;
          }
        }
        const colRef = collection(db, stryMutAct_9fa48("6800") ? "" : (stryCov_9fa48("6800"), 'artifacts'), APP_ID, stryMutAct_9fa48("6801") ? "" : (stryCov_9fa48("6801"), 'users'), user.uid, stryMutAct_9fa48("6802") ? "" : (stryCov_9fa48("6802"), 'notifications'));
        let q = query(colRef, orderBy(stryMutAct_9fa48("6803") ? "" : (stryCov_9fa48("6803"), 'date'), stryMutAct_9fa48("6804") ? "" : (stryCov_9fa48("6804"), 'desc')), limit(50));
        if (stryMutAct_9fa48("6806") ? false : stryMutAct_9fa48("6805") ? true : (stryCov_9fa48("6805", "6806"), accountId)) {
          if (stryMutAct_9fa48("6807")) {
            {}
          } else {
            stryCov_9fa48("6807");
            q = query(colRef, where(stryMutAct_9fa48("6808") ? "" : (stryCov_9fa48("6808"), 'accountId'), stryMutAct_9fa48("6809") ? "" : (stryCov_9fa48("6809"), '=='), accountId), orderBy(stryMutAct_9fa48("6810") ? "" : (stryCov_9fa48("6810"), 'date'), stryMutAct_9fa48("6811") ? "" : (stryCov_9fa48("6811"), 'desc')), limit(20));
          }
        }
        const unsubscribe = onSnapshot(q, snapshot => {
          if (stryMutAct_9fa48("6812")) {
            {}
          } else {
            stryCov_9fa48("6812");
            const msgs = snapshot.docs.map(stryMutAct_9fa48("6813") ? () => undefined : (stryCov_9fa48("6813"), d => ({
              id: d.id,
              ...d.data()
            }) as AnchorNotification));
            // Client-side filtering for unread if needed, or we just show them.
            // We want to show unread ones prominently.
            setNotifications(msgs);
            setLoading(stryMutAct_9fa48("6814") ? true : (stryCov_9fa48("6814"), false));
          }
        });
        return stryMutAct_9fa48("6815") ? () => undefined : (stryCov_9fa48("6815"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("6816") ? [] : (stryCov_9fa48("6816"), [user, accountId]));
    const markAsRead = async (id: string) => {
      if (stryMutAct_9fa48("6817")) {
        {}
      } else {
        stryCov_9fa48("6817");
        if (stryMutAct_9fa48("6820") ? false : stryMutAct_9fa48("6819") ? true : stryMutAct_9fa48("6818") ? user : (stryCov_9fa48("6818", "6819", "6820"), !user)) return;
        const ref = doc(db, stryMutAct_9fa48("6821") ? "" : (stryCov_9fa48("6821"), 'artifacts'), APP_ID, stryMutAct_9fa48("6822") ? "" : (stryCov_9fa48("6822"), 'users'), user.uid, stryMutAct_9fa48("6823") ? "" : (stryCov_9fa48("6823"), 'notifications'), id);
        await updateDoc(ref, stryMutAct_9fa48("6824") ? {} : (stryCov_9fa48("6824"), {
          read: stryMutAct_9fa48("6825") ? false : (stryCov_9fa48("6825"), true)
        }));
        // Optimistic update
        setNotifications(stryMutAct_9fa48("6826") ? () => undefined : (stryCov_9fa48("6826"), prev => prev.map(stryMutAct_9fa48("6827") ? () => undefined : (stryCov_9fa48("6827"), n => (stryMutAct_9fa48("6830") ? n.id !== id : stryMutAct_9fa48("6829") ? false : stryMutAct_9fa48("6828") ? true : (stryCov_9fa48("6828", "6829", "6830"), n.id === id)) ? stryMutAct_9fa48("6831") ? {} : (stryCov_9fa48("6831"), {
          ...n,
          read: stryMutAct_9fa48("6832") ? false : (stryCov_9fa48("6832"), true)
        }) : n))));
      }
    };
    const markAllAsRead = async () => {
      if (stryMutAct_9fa48("6833")) {
        {}
      } else {
        stryCov_9fa48("6833");
        if (stryMutAct_9fa48("6836") ? !user && notifications.length === 0 : stryMutAct_9fa48("6835") ? false : stryMutAct_9fa48("6834") ? true : (stryCov_9fa48("6834", "6835", "6836"), (stryMutAct_9fa48("6837") ? user : (stryCov_9fa48("6837"), !user)) || (stryMutAct_9fa48("6839") ? notifications.length !== 0 : stryMutAct_9fa48("6838") ? false : (stryCov_9fa48("6838", "6839"), notifications.length === 0)))) return;
        const batch = (await import(stryMutAct_9fa48("6840") ? "" : (stryCov_9fa48("6840"), 'firebase/firestore'))).writeBatch(db);
        stryMutAct_9fa48("6841") ? notifications.forEach(n => {
          const ref = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'notifications', n.id);
          batch.update(ref, {
            read: true
          });
        }) : (stryCov_9fa48("6841"), notifications.filter(stryMutAct_9fa48("6842") ? () => undefined : (stryCov_9fa48("6842"), n => stryMutAct_9fa48("6843") ? n.read : (stryCov_9fa48("6843"), !n.read))).forEach(n => {
          if (stryMutAct_9fa48("6844")) {
            {}
          } else {
            stryCov_9fa48("6844");
            const ref = doc(db, stryMutAct_9fa48("6845") ? "" : (stryCov_9fa48("6845"), 'artifacts'), APP_ID, stryMutAct_9fa48("6846") ? "" : (stryCov_9fa48("6846"), 'users'), user.uid, stryMutAct_9fa48("6847") ? "" : (stryCov_9fa48("6847"), 'notifications'), n.id);
            batch.update(ref, stryMutAct_9fa48("6848") ? {} : (stryCov_9fa48("6848"), {
              read: stryMutAct_9fa48("6849") ? false : (stryCov_9fa48("6849"), true)
            }));
          }
        }));
        await batch.commit();
        setNotifications(stryMutAct_9fa48("6850") ? () => undefined : (stryCov_9fa48("6850"), prev => prev.map(stryMutAct_9fa48("6851") ? () => undefined : (stryCov_9fa48("6851"), n => stryMutAct_9fa48("6852") ? {} : (stryCov_9fa48("6852"), {
          ...n,
          read: stryMutAct_9fa48("6853") ? false : (stryCov_9fa48("6853"), true)
        })))));
      }
    };
    return stryMutAct_9fa48("6854") ? {} : (stryCov_9fa48("6854"), {
      notifications,
      loading,
      markAsRead,
      markAllAsRead
    });
  }
};