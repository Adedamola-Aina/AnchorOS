/**
 * Family Mode v2 - Account Sharing Hook
 * 
 * Provides state and actions for managing account sharing with family members.
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
import { useState, useEffect, useCallback } from 'react';
import { db, APP_ID } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useNotifications } from '../context/NotificationContext';
interface FamilyConnection {
  id: string;
  ownerUid: string;
  memberUid: string;
  ownerDisplayName: string;
  memberDisplayName: string;
  status: 'active' | 'disconnected';
  connectedAt: string;
}
interface UseFamilySharingResult {
  connection: FamilyConnection | null;
  isOwner: boolean;
  familyMemberUid: string | null;
  familyMemberName: string | null;
  loading: boolean;
  shareAccount: (accountId: string, share: boolean) => Promise<void>;
  disconnectFamily: (type: 'remove_member' | 'leave') => Promise<void>;
}
export function useFamilySharing(userId: string | undefined): UseFamilySharingResult {
  if (stryMutAct_9fa48("7279")) {
    {}
  } else {
    stryCov_9fa48("7279");
    const {
      showToast
    } = useNotifications();
    const [connection, setConnection] = useState<FamilyConnection | null>(null);
    const [dataLoaded, setDataLoaded] = useState(stryMutAct_9fa48("7280") ? true : (stryCov_9fa48("7280"), false));

    // Loading is true when we have a userId but haven't loaded data yet
    const loading = stryMutAct_9fa48("7283") ? !!userId || !dataLoaded : stryMutAct_9fa48("7282") ? false : stryMutAct_9fa48("7281") ? true : (stryCov_9fa48("7281", "7282", "7283"), (stryMutAct_9fa48("7284") ? !userId : (stryCov_9fa48("7284"), !(stryMutAct_9fa48("7285") ? userId : (stryCov_9fa48("7285"), !userId)))) && (stryMutAct_9fa48("7286") ? dataLoaded : (stryCov_9fa48("7286"), !dataLoaded)));

    // Reset dataLoaded when userId changes - this is intentional to restart loading
    useEffect(() => {
      if (stryMutAct_9fa48("7287")) {
        {}
      } else {
        stryCov_9fa48("7287");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDataLoaded(stryMutAct_9fa48("7288") ? true : (stryCov_9fa48("7288"), false));
      }
    }, stryMutAct_9fa48("7289") ? [] : (stryCov_9fa48("7289"), [userId]));

    // Listen for active family connection
    useEffect(() => {
      if (stryMutAct_9fa48("7290")) {
        {}
      } else {
        stryCov_9fa48("7290");
        if (stryMutAct_9fa48("7293") ? false : stryMutAct_9fa48("7292") ? true : stryMutAct_9fa48("7291") ? userId : (stryCov_9fa48("7291", "7292", "7293"), !userId)) {
          if (stryMutAct_9fa48("7294")) {
            {}
          } else {
            stryCov_9fa48("7294");
            return;
          }
        }
        const connectionsRef = collection(db, stryMutAct_9fa48("7295") ? "" : (stryCov_9fa48("7295"), 'artifacts'), APP_ID, stryMutAct_9fa48("7296") ? "" : (stryCov_9fa48("7296"), 'family_connections'));

        // Check as owner
        const ownerQuery = query(connectionsRef, where(stryMutAct_9fa48("7297") ? "" : (stryCov_9fa48("7297"), 'ownerUid'), stryMutAct_9fa48("7298") ? "" : (stryCov_9fa48("7298"), '=='), userId), where(stryMutAct_9fa48("7299") ? "" : (stryCov_9fa48("7299"), 'status'), stryMutAct_9fa48("7300") ? "" : (stryCov_9fa48("7300"), '=='), stryMutAct_9fa48("7301") ? "" : (stryCov_9fa48("7301"), 'active')));

        // Check as member
        const memberQuery = query(connectionsRef, where(stryMutAct_9fa48("7302") ? "" : (stryCov_9fa48("7302"), 'memberUid'), stryMutAct_9fa48("7303") ? "" : (stryCov_9fa48("7303"), '=='), userId), where(stryMutAct_9fa48("7304") ? "" : (stryCov_9fa48("7304"), 'status'), stryMutAct_9fa48("7305") ? "" : (stryCov_9fa48("7305"), '=='), stryMutAct_9fa48("7306") ? "" : (stryCov_9fa48("7306"), 'active')));
        let ownerConnection: FamilyConnection | null = null;
        let memberConnection: FamilyConnection | null = null;
        const unsubOwner = onSnapshot(ownerQuery, snapshot => {
          if (stryMutAct_9fa48("7307")) {
            {}
          } else {
            stryCov_9fa48("7307");
            if (stryMutAct_9fa48("7310") ? false : stryMutAct_9fa48("7309") ? true : stryMutAct_9fa48("7308") ? snapshot.empty : (stryCov_9fa48("7308", "7309", "7310"), !snapshot.empty)) {
              if (stryMutAct_9fa48("7311")) {
                {}
              } else {
                stryCov_9fa48("7311");
                const doc = snapshot.docs[0];
                ownerConnection = {
                  id: doc.id,
                  ...doc.data()
                } as FamilyConnection;
                setConnection(ownerConnection);
              }
            } else {
              if (stryMutAct_9fa48("7312")) {
                {}
              } else {
                stryCov_9fa48("7312");
                ownerConnection = null;
                if (stryMutAct_9fa48("7315") ? false : stryMutAct_9fa48("7314") ? true : stryMutAct_9fa48("7313") ? memberConnection : (stryCov_9fa48("7313", "7314", "7315"), !memberConnection)) {
                  if (stryMutAct_9fa48("7316")) {
                    {}
                  } else {
                    stryCov_9fa48("7316");
                    setConnection(null);
                  }
                }
              }
            }
            setDataLoaded(stryMutAct_9fa48("7317") ? false : (stryCov_9fa48("7317"), true));
          }
        });
        const unsubMember = onSnapshot(memberQuery, snapshot => {
          if (stryMutAct_9fa48("7318")) {
            {}
          } else {
            stryCov_9fa48("7318");
            if (stryMutAct_9fa48("7321") ? false : stryMutAct_9fa48("7320") ? true : stryMutAct_9fa48("7319") ? snapshot.empty : (stryCov_9fa48("7319", "7320", "7321"), !snapshot.empty)) {
              if (stryMutAct_9fa48("7322")) {
                {}
              } else {
                stryCov_9fa48("7322");
                const doc = snapshot.docs[0];
                memberConnection = {
                  id: doc.id,
                  ...doc.data()
                } as FamilyConnection;
                if (stryMutAct_9fa48("7325") ? false : stryMutAct_9fa48("7324") ? true : stryMutAct_9fa48("7323") ? ownerConnection : (stryCov_9fa48("7323", "7324", "7325"), !ownerConnection)) {
                  if (stryMutAct_9fa48("7326")) {
                    {}
                  } else {
                    stryCov_9fa48("7326");
                    setConnection(memberConnection);
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("7327")) {
                {}
              } else {
                stryCov_9fa48("7327");
                memberConnection = null;
              }
            }
            setDataLoaded(stryMutAct_9fa48("7328") ? false : (stryCov_9fa48("7328"), true));
          }
        });
        return () => {
          if (stryMutAct_9fa48("7329")) {
            {}
          } else {
            stryCov_9fa48("7329");
            unsubOwner();
            unsubMember();
          }
        };
      }
    }, stryMutAct_9fa48("7330") ? [] : (stryCov_9fa48("7330"), [userId]));
    const isOwner = stryMutAct_9fa48("7333") ? connection?.ownerUid !== userId : stryMutAct_9fa48("7332") ? false : stryMutAct_9fa48("7331") ? true : (stryCov_9fa48("7331", "7332", "7333"), (stryMutAct_9fa48("7334") ? connection.ownerUid : (stryCov_9fa48("7334"), connection?.ownerUid)) === userId);
    const familyMemberUid = connection ? isOwner ? connection.memberUid : connection.ownerUid : null;
    const familyMemberName = connection ? isOwner ? connection.memberDisplayName : connection.ownerDisplayName : null;
    const shareAccount = useCallback(async (accountId: string, share: boolean) => {
      if (stryMutAct_9fa48("7335")) {
        {}
      } else {
        stryCov_9fa48("7335");
        if (stryMutAct_9fa48("7338") ? false : stryMutAct_9fa48("7337") ? true : stryMutAct_9fa48("7336") ? connection : (stryCov_9fa48("7336", "7337", "7338"), !connection)) return;
        try {
          if (stryMutAct_9fa48("7339")) {
            {}
          } else {
            stryCov_9fa48("7339");
            const functions = getFunctions();
            const shareAccountFn = httpsCallable<{
              accountId: string;
              share: boolean;
            }, {
              success: boolean;
            }>(functions, stryMutAct_9fa48("7340") ? "" : (stryCov_9fa48("7340"), 'shareAccount'));
            await shareAccountFn(stryMutAct_9fa48("7341") ? {} : (stryCov_9fa48("7341"), {
              accountId,
              share
            }));
            showToast(share ? stryMutAct_9fa48("7342") ? "" : (stryCov_9fa48("7342"), 'Account shared with family') : stryMutAct_9fa48("7343") ? "" : (stryCov_9fa48("7343"), 'Account sharing removed'), stryMutAct_9fa48("7344") ? "" : (stryCov_9fa48("7344"), 'success'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("7345")) {
            {}
          } else {
            stryCov_9fa48("7345");
            console.error(stryMutAct_9fa48("7346") ? "" : (stryCov_9fa48("7346"), 'Share account error:'), err);
            showToast(stryMutAct_9fa48("7347") ? "" : (stryCov_9fa48("7347"), 'Failed to update sharing'), stryMutAct_9fa48("7348") ? "" : (stryCov_9fa48("7348"), 'error'));
          }
        }
      }
    }, stryMutAct_9fa48("7349") ? [] : (stryCov_9fa48("7349"), [connection, showToast]));
    const disconnectFamily = useCallback(async (type: 'remove_member' | 'leave') => {
      if (stryMutAct_9fa48("7350")) {
        {}
      } else {
        stryCov_9fa48("7350");
        try {
          if (stryMutAct_9fa48("7351")) {
            {}
          } else {
            stryCov_9fa48("7351");
            const functions = getFunctions();
            const disconnectFn = httpsCallable<{
              type: 'remove_member' | 'leave';
            }, {
              success: boolean;
            }>(functions, stryMutAct_9fa48("7352") ? "" : (stryCov_9fa48("7352"), 'disconnectFamily'));
            await disconnectFn(stryMutAct_9fa48("7353") ? {} : (stryCov_9fa48("7353"), {
              type
            }));
            showToast(stryMutAct_9fa48("7354") ? "" : (stryCov_9fa48("7354"), 'Family connection removed'), stryMutAct_9fa48("7355") ? "" : (stryCov_9fa48("7355"), 'success'));
            setConnection(null);
          }
        } catch (err) {
          if (stryMutAct_9fa48("7356")) {
            {}
          } else {
            stryCov_9fa48("7356");
            console.error(stryMutAct_9fa48("7357") ? "" : (stryCov_9fa48("7357"), 'Disconnect error:'), err);
            showToast(stryMutAct_9fa48("7358") ? "" : (stryCov_9fa48("7358"), 'Failed to disconnect'), stryMutAct_9fa48("7359") ? "" : (stryCov_9fa48("7359"), 'error'));
            throw err;
          }
        }
      }
    }, stryMutAct_9fa48("7360") ? [] : (stryCov_9fa48("7360"), [showToast]));
    return stryMutAct_9fa48("7361") ? {} : (stryCov_9fa48("7361"), {
      connection,
      isOwner,
      familyMemberUid,
      familyMemberName,
      loading,
      shareAccount,
      disconnectFamily
    });
  }
}