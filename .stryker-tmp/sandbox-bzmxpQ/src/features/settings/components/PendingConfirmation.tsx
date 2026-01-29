/**
 * Family Mode v2 - Pending Confirmation Component
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Handlers extracted to pendingConfirmationHandlers.ts
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
import { useState, useEffect } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import type { MultiFactorResolver } from 'firebase/auth';
import { db, APP_ID } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { AwaitingConfirmationCard } from './AwaitingConfirmationCard';
import { PendingInviteCard } from './PendingInviteCard';
import { MfaConfirmationCard } from './MfaConfirmationCard';
import { completeConnectionConfirmation, reauthenticateUser, getMfaResolver, verifyMfaAndComplete, rejectInvitation, cancelInvitation } from './pendingConfirmationHandlers';
interface PendingInvitation {
  id: string;
  inviteeEmail: string;
  status: 'pending' | 'awaiting_confirmation';
  createdAt: string;
}
interface PendingConfirmationProps {
  userId: string;
  onConnectionConfirmed: (redirectTo: string, message: string) => void;
}
export function PendingConfirmation({
  userId,
  onConnectionConfirmed
}: PendingConfirmationProps) {
  if (stryMutAct_9fa48("6084")) {
    {}
  } else {
    stryCov_9fa48("6084");
    const {
      showToast,
      confirm: confirmDialog
    } = useNotifications();
    const [pendingInvite, setPendingInvite] = useState<PendingInvitation | null>(null);
    const [loading, setLoading] = useState(stryMutAct_9fa48("6085") ? false : (stryCov_9fa48("6085"), true));
    const [confirmingConnection, setConfirmingConnection] = useState(stryMutAct_9fa48("6086") ? true : (stryCov_9fa48("6086"), false));
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(stryMutAct_9fa48("6087") ? true : (stryCov_9fa48("6087"), false));
    const [password, setPassword] = useState(stryMutAct_9fa48("6088") ? "Stryker was here!" : (stryCov_9fa48("6088"), ''));
    const [error, setError] = useState(stryMutAct_9fa48("6089") ? "Stryker was here!" : (stryCov_9fa48("6089"), ''));
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
    const [mfaCode, setMfaCode] = useState(stryMutAct_9fa48("6090") ? "Stryker was here!" : (stryCov_9fa48("6090"), ''));
    useEffect(() => {
      if (stryMutAct_9fa48("6091")) {
        {}
      } else {
        stryCov_9fa48("6091");
        const invitationsRef = collection(db, stryMutAct_9fa48("6092") ? "" : (stryCov_9fa48("6092"), 'artifacts'), APP_ID, stryMutAct_9fa48("6093") ? "" : (stryCov_9fa48("6093"), 'family_invitations'));
        const q = query(invitationsRef, where(stryMutAct_9fa48("6094") ? "" : (stryCov_9fa48("6094"), 'ownerUid'), stryMutAct_9fa48("6095") ? "" : (stryCov_9fa48("6095"), '=='), userId), where(stryMutAct_9fa48("6096") ? "" : (stryCov_9fa48("6096"), 'status'), stryMutAct_9fa48("6097") ? "" : (stryCov_9fa48("6097"), 'in'), stryMutAct_9fa48("6098") ? [] : (stryCov_9fa48("6098"), [stryMutAct_9fa48("6099") ? "" : (stryCov_9fa48("6099"), 'pending'), stryMutAct_9fa48("6100") ? "" : (stryCov_9fa48("6100"), 'awaiting_confirmation')])));
        const unsubscribe = onSnapshot(q, snapshot => {
          if (stryMutAct_9fa48("6101")) {
            {}
          } else {
            stryCov_9fa48("6101");
            if (stryMutAct_9fa48("6104") ? false : stryMutAct_9fa48("6103") ? true : stryMutAct_9fa48("6102") ? snapshot.empty : (stryCov_9fa48("6102", "6103", "6104"), !snapshot.empty)) {
              if (stryMutAct_9fa48("6105")) {
                {}
              } else {
                stryCov_9fa48("6105");
                const doc = snapshot.docs[0];
                const data = doc.data();
                setPendingInvite(stryMutAct_9fa48("6106") ? {} : (stryCov_9fa48("6106"), {
                  id: doc.id,
                  inviteeEmail: data.inviteeEmail,
                  status: data.status,
                  createdAt: data.createdAt
                }));
              }
            } else {
              if (stryMutAct_9fa48("6107")) {
                {}
              } else {
                stryCov_9fa48("6107");
                setPendingInvite(null);
              }
            }
            setLoading(stryMutAct_9fa48("6108") ? true : (stryCov_9fa48("6108"), false));
          }
        });
        return stryMutAct_9fa48("6109") ? () => undefined : (stryCov_9fa48("6109"), () => unsubscribe());
      }
    }, stryMutAct_9fa48("6110") ? [] : (stryCov_9fa48("6110"), [userId]));
    const completeConfirmation = async () => {
      if (stryMutAct_9fa48("6111")) {
        {}
      } else {
        stryCov_9fa48("6111");
        if (stryMutAct_9fa48("6114") ? false : stryMutAct_9fa48("6113") ? true : stryMutAct_9fa48("6112") ? pendingInvite : (stryCov_9fa48("6112", "6113", "6114"), !pendingInvite)) return;
        const result = await completeConnectionConfirmation(pendingInvite.id, password);
        if (stryMutAct_9fa48("6117") ? result.success || !result.rejected : stryMutAct_9fa48("6116") ? false : stryMutAct_9fa48("6115") ? true : (stryCov_9fa48("6115", "6116", "6117"), result.success && (stryMutAct_9fa48("6118") ? result.rejected : (stryCov_9fa48("6118"), !result.rejected)))) {
          if (stryMutAct_9fa48("6119")) {
            {}
          } else {
            stryCov_9fa48("6119");
            showToast(stryMutAct_9fa48("6120") ? `` : (stryCov_9fa48("6120"), `Connected with ${result.memberName}!`), stryMutAct_9fa48("6121") ? "" : (stryCov_9fa48("6121"), 'success'));
            onConnectionConfirmed(stryMutAct_9fa48("6124") ? result.redirect && '/finance' : stryMutAct_9fa48("6123") ? false : stryMutAct_9fa48("6122") ? true : (stryCov_9fa48("6122", "6123", "6124"), result.redirect || (stryMutAct_9fa48("6125") ? "" : (stryCov_9fa48("6125"), '/finance'))), stryMutAct_9fa48("6128") ? result.message && 'Connection confirmed!' : stryMutAct_9fa48("6127") ? false : stryMutAct_9fa48("6126") ? true : (stryCov_9fa48("6126", "6127", "6128"), result.message || (stryMutAct_9fa48("6129") ? "" : (stryCov_9fa48("6129"), 'Connection confirmed!'))));
          }
        }
      }
    };
    const handlePasswordSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("6130")) {
        {}
      } else {
        stryCov_9fa48("6130");
        e.preventDefault();
        if (stryMutAct_9fa48("6133") ? !pendingInvite && !password : stryMutAct_9fa48("6132") ? false : stryMutAct_9fa48("6131") ? true : (stryCov_9fa48("6131", "6132", "6133"), (stryMutAct_9fa48("6134") ? pendingInvite : (stryCov_9fa48("6134"), !pendingInvite)) || (stryMutAct_9fa48("6135") ? password : (stryCov_9fa48("6135"), !password)))) return;
        setConfirmingConnection(stryMutAct_9fa48("6136") ? false : (stryCov_9fa48("6136"), true));
        setError(stryMutAct_9fa48("6137") ? "Stryker was here!" : (stryCov_9fa48("6137"), ''));
        try {
          if (stryMutAct_9fa48("6138")) {
            {}
          } else {
            stryCov_9fa48("6138");
            await reauthenticateUser(password);
            await completeConfirmation();
          }
        } catch (err) {
          if (stryMutAct_9fa48("6139")) {
            {}
          } else {
            stryCov_9fa48("6139");
            const error = err as Error & {
              code?: string;
            };
            if (stryMutAct_9fa48("6142") ? error.code !== 'auth/multi-factor-auth-required' : stryMutAct_9fa48("6141") ? false : stryMutAct_9fa48("6140") ? true : (stryCov_9fa48("6140", "6141", "6142"), error.code === (stryMutAct_9fa48("6143") ? "" : (stryCov_9fa48("6143"), 'auth/multi-factor-auth-required')))) {
              if (stryMutAct_9fa48("6144")) {
                {}
              } else {
                stryCov_9fa48("6144");
                setMfaResolver(getMfaResolver(err));
                setError(stryMutAct_9fa48("6145") ? "Stryker was here!" : (stryCov_9fa48("6145"), ''));
              }
            } else if (stryMutAct_9fa48("6148") ? error.code === 'auth/wrong-password' && error.code === 'auth/invalid-credential' : stryMutAct_9fa48("6147") ? false : stryMutAct_9fa48("6146") ? true : (stryCov_9fa48("6146", "6147", "6148"), (stryMutAct_9fa48("6150") ? error.code !== 'auth/wrong-password' : stryMutAct_9fa48("6149") ? false : (stryCov_9fa48("6149", "6150"), error.code === (stryMutAct_9fa48("6151") ? "" : (stryCov_9fa48("6151"), 'auth/wrong-password')))) || (stryMutAct_9fa48("6153") ? error.code !== 'auth/invalid-credential' : stryMutAct_9fa48("6152") ? false : (stryCov_9fa48("6152", "6153"), error.code === (stryMutAct_9fa48("6154") ? "" : (stryCov_9fa48("6154"), 'auth/invalid-credential')))))) {
              if (stryMutAct_9fa48("6155")) {
                {}
              } else {
                stryCov_9fa48("6155");
                setError(stryMutAct_9fa48("6156") ? "" : (stryCov_9fa48("6156"), 'Incorrect password'));
              }
            } else {
              if (stryMutAct_9fa48("6157")) {
                {}
              } else {
                stryCov_9fa48("6157");
                setError(stryMutAct_9fa48("6158") ? "" : (stryCov_9fa48("6158"), 'Failed to confirm connection. Please try again.'));
              }
            }
          }
        } finally {
          if (stryMutAct_9fa48("6159")) {
            {}
          } else {
            stryCov_9fa48("6159");
            setConfirmingConnection(stryMutAct_9fa48("6160") ? true : (stryCov_9fa48("6160"), false));
          }
        }
      }
    };
    const handleMfaSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("6161")) {
        {}
      } else {
        stryCov_9fa48("6161");
        e.preventDefault();
        if (stryMutAct_9fa48("6164") ? (!mfaResolver || !mfaCode) && mfaCode.length !== 6 : stryMutAct_9fa48("6163") ? false : stryMutAct_9fa48("6162") ? true : (stryCov_9fa48("6162", "6163", "6164"), (stryMutAct_9fa48("6166") ? !mfaResolver && !mfaCode : stryMutAct_9fa48("6165") ? false : (stryCov_9fa48("6165", "6166"), (stryMutAct_9fa48("6167") ? mfaResolver : (stryCov_9fa48("6167"), !mfaResolver)) || (stryMutAct_9fa48("6168") ? mfaCode : (stryCov_9fa48("6168"), !mfaCode)))) || (stryMutAct_9fa48("6170") ? mfaCode.length === 6 : stryMutAct_9fa48("6169") ? false : (stryCov_9fa48("6169", "6170"), mfaCode.length !== 6)))) return;
        setConfirmingConnection(stryMutAct_9fa48("6171") ? false : (stryCov_9fa48("6171"), true));
        setError(stryMutAct_9fa48("6172") ? "Stryker was here!" : (stryCov_9fa48("6172"), ''));
        try {
          if (stryMutAct_9fa48("6173")) {
            {}
          } else {
            stryCov_9fa48("6173");
            await verifyMfaAndComplete(mfaResolver, mfaCode);
            await completeConfirmation();
          }
        } catch (err) {
          if (stryMutAct_9fa48("6174")) {
            {}
          } else {
            stryCov_9fa48("6174");
            const error = err as Error & {
              code?: string;
            };
            setError((stryMutAct_9fa48("6177") ? error.code !== 'auth/invalid-verification-code' : stryMutAct_9fa48("6176") ? false : stryMutAct_9fa48("6175") ? true : (stryCov_9fa48("6175", "6176", "6177"), error.code === (stryMutAct_9fa48("6178") ? "" : (stryCov_9fa48("6178"), 'auth/invalid-verification-code')))) ? stryMutAct_9fa48("6179") ? "" : (stryCov_9fa48("6179"), 'Invalid code. Please try again.') : stryMutAct_9fa48("6180") ? "" : (stryCov_9fa48("6180"), 'MFA verification failed. Please try again.'));
          }
        } finally {
          if (stryMutAct_9fa48("6181")) {
            {}
          } else {
            stryCov_9fa48("6181");
            setConfirmingConnection(stryMutAct_9fa48("6182") ? true : (stryCov_9fa48("6182"), false));
          }
        }
      }
    };
    const handleReject = async () => {
      if (stryMutAct_9fa48("6183")) {
        {}
      } else {
        stryCov_9fa48("6183");
        if (stryMutAct_9fa48("6186") ? false : stryMutAct_9fa48("6185") ? true : stryMutAct_9fa48("6184") ? pendingInvite : (stryCov_9fa48("6184", "6185", "6186"), !pendingInvite)) return;
        const confirmed = await confirmDialog(stryMutAct_9fa48("6187") ? {} : (stryCov_9fa48("6187"), {
          title: stryMutAct_9fa48("6188") ? "" : (stryCov_9fa48("6188"), 'Reject Connection?'),
          message: stryMutAct_9fa48("6189") ? `` : (stryCov_9fa48("6189"), `Reject connection with ${pendingInvite.inviteeEmail}?`),
          type: stryMutAct_9fa48("6190") ? "" : (stryCov_9fa48("6190"), 'danger'),
          confirmText: stryMutAct_9fa48("6191") ? "" : (stryCov_9fa48("6191"), 'Reject')
        }));
        if (stryMutAct_9fa48("6194") ? false : stryMutAct_9fa48("6193") ? true : stryMutAct_9fa48("6192") ? confirmed : (stryCov_9fa48("6192", "6193", "6194"), !confirmed)) return;
        setConfirmingConnection(stryMutAct_9fa48("6195") ? false : (stryCov_9fa48("6195"), true));
        try {
          if (stryMutAct_9fa48("6196")) {
            {}
          } else {
            stryCov_9fa48("6196");
            await rejectInvitation(pendingInvite.id);
            showToast(stryMutAct_9fa48("6197") ? "" : (stryCov_9fa48("6197"), 'Invitation rejected'), stryMutAct_9fa48("6198") ? "" : (stryCov_9fa48("6198"), 'info'));
            setPendingInvite(null);
          }
        } catch {
          if (stryMutAct_9fa48("6199")) {
            {}
          } else {
            stryCov_9fa48("6199");
            showToast(stryMutAct_9fa48("6200") ? "" : (stryCov_9fa48("6200"), 'Failed to reject invitation'), stryMutAct_9fa48("6201") ? "" : (stryCov_9fa48("6201"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("6202")) {
            {}
          } else {
            stryCov_9fa48("6202");
            setConfirmingConnection(stryMutAct_9fa48("6203") ? true : (stryCov_9fa48("6203"), false));
          }
        }
      }
    };
    const handleCancelInvite = async () => {
      if (stryMutAct_9fa48("6204")) {
        {}
      } else {
        stryCov_9fa48("6204");
        if (stryMutAct_9fa48("6207") ? false : stryMutAct_9fa48("6206") ? true : stryMutAct_9fa48("6205") ? pendingInvite : (stryCov_9fa48("6205", "6206", "6207"), !pendingInvite)) return;
        const confirmed = await confirmDialog(stryMutAct_9fa48("6208") ? {} : (stryCov_9fa48("6208"), {
          title: stryMutAct_9fa48("6209") ? "" : (stryCov_9fa48("6209"), 'Cancel Invitation?'),
          message: stryMutAct_9fa48("6210") ? `` : (stryCov_9fa48("6210"), `Cancel invitation to ${pendingInvite.inviteeEmail}?`),
          type: stryMutAct_9fa48("6211") ? "" : (stryCov_9fa48("6211"), 'danger'),
          confirmText: stryMutAct_9fa48("6212") ? "" : (stryCov_9fa48("6212"), 'Cancel Invitation')
        }));
        if (stryMutAct_9fa48("6215") ? false : stryMutAct_9fa48("6214") ? true : stryMutAct_9fa48("6213") ? confirmed : (stryCov_9fa48("6213", "6214", "6215"), !confirmed)) return;
        try {
          if (stryMutAct_9fa48("6216")) {
            {}
          } else {
            stryCov_9fa48("6216");
            await cancelInvitation(pendingInvite.id);
            showToast(stryMutAct_9fa48("6217") ? "" : (stryCov_9fa48("6217"), 'Invitation cancelled'), stryMutAct_9fa48("6218") ? "" : (stryCov_9fa48("6218"), 'success'));
            setPendingInvite(null);
          }
        } catch {
          if (stryMutAct_9fa48("6219")) {
            {}
          } else {
            stryCov_9fa48("6219");
            showToast(stryMutAct_9fa48("6220") ? "" : (stryCov_9fa48("6220"), 'Failed to cancel invitation'), stryMutAct_9fa48("6221") ? "" : (stryCov_9fa48("6221"), 'error'));
          }
        }
      }
    };
    if (stryMutAct_9fa48("6224") ? loading && !pendingInvite : stryMutAct_9fa48("6223") ? false : stryMutAct_9fa48("6222") ? true : (stryCov_9fa48("6222", "6223", "6224"), loading || (stryMutAct_9fa48("6225") ? pendingInvite : (stryCov_9fa48("6225"), !pendingInvite)))) return null;
    if (stryMutAct_9fa48("6227") ? false : stryMutAct_9fa48("6226") ? true : (stryCov_9fa48("6226", "6227"), mfaResolver)) {
      if (stryMutAct_9fa48("6228")) {
        {}
      } else {
        stryCov_9fa48("6228");
        return <MfaConfirmationCard inviteeEmail={pendingInvite.inviteeEmail} mfaCode={mfaCode} setMfaCode={setMfaCode} error={error} confirmingConnection={confirmingConnection} onMfaSubmit={handleMfaSubmit} onBack={() => {
          if (stryMutAct_9fa48("6229")) {
            {}
          } else {
            stryCov_9fa48("6229");
            setMfaResolver(null);
            setMfaCode(stryMutAct_9fa48("6230") ? "Stryker was here!" : (stryCov_9fa48("6230"), ''));
            setError(stryMutAct_9fa48("6231") ? "Stryker was here!" : (stryCov_9fa48("6231"), ''));
          }
        }} />;
      }
    }
    if (stryMutAct_9fa48("6234") ? pendingInvite.status !== 'awaiting_confirmation' : stryMutAct_9fa48("6233") ? false : stryMutAct_9fa48("6232") ? true : (stryCov_9fa48("6232", "6233", "6234"), pendingInvite.status === (stryMutAct_9fa48("6235") ? "" : (stryCov_9fa48("6235"), 'awaiting_confirmation')))) {
      if (stryMutAct_9fa48("6236")) {
        {}
      } else {
        stryCov_9fa48("6236");
        return <AwaitingConfirmationCard inviteeEmail={pendingInvite.inviteeEmail} showPasswordPrompt={showPasswordPrompt} password={password} setPassword={setPassword} error={error} confirmingConnection={confirmingConnection} onPasswordSubmit={handlePasswordSubmit} onBack={() => {
          if (stryMutAct_9fa48("6237")) {
            {}
          } else {
            stryCov_9fa48("6237");
            setShowPasswordPrompt(stryMutAct_9fa48("6238") ? true : (stryCov_9fa48("6238"), false));
            setPassword(stryMutAct_9fa48("6239") ? "Stryker was here!" : (stryCov_9fa48("6239"), ''));
            setError(stryMutAct_9fa48("6240") ? "Stryker was here!" : (stryCov_9fa48("6240"), ''));
          }
        }} onConfirm={stryMutAct_9fa48("6241") ? () => undefined : (stryCov_9fa48("6241"), () => setShowPasswordPrompt(stryMutAct_9fa48("6242") ? false : (stryCov_9fa48("6242"), true)))} onReject={handleReject} />;
      }
    }
    return <PendingInviteCard inviteeEmail={pendingInvite.inviteeEmail} createdAt={pendingInvite.createdAt} onCancelInvite={handleCancelInvite} />;
  }
}