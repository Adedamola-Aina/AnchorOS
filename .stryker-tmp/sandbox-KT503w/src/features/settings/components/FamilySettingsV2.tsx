/**
 * Family Mode v2 - Family Settings Component
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * UI states extracted to FamilySettingsStates.tsx
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
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Users } from 'lucide-react';
import { InviteFamilyMember } from './InviteFamilyMember';
import { PendingConfirmation } from './PendingConfirmation';
import { FamilyLoadingState, FamilyPostConnectionMessage, FamilyConnectedState, FamilyInviteCard } from './FamilySettingsStates';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, APP_ID } from '../../../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
interface FamilyConnection {
  id: string;
  ownerUid: string;
  memberUid: string;
  ownerDisplayName: string;
  memberDisplayName: string;
  status: 'active' | 'disconnected';
  connectedAt: string;
}
interface FamilySettingsV2Props {
  onNavigateToFinance?: () => void;
}
export function FamilySettingsV2({
  onNavigateToFinance
}: FamilySettingsV2Props) {
  if (stryMutAct_9fa48("5716")) {
    {}
  } else {
    stryCov_9fa48("5716");
    const {
      user
    } = useAuth();
    const {
      showToast,
      confirm: confirmDialog
    } = useNotifications();
    const [loading, setLoading] = useState(stryMutAct_9fa48("5717") ? false : (stryCov_9fa48("5717"), true));
    const [connection, setConnection] = useState<FamilyConnection | null>(null);
    const [hasPendingInvite, setHasPendingInvite] = useState(stryMutAct_9fa48("5718") ? true : (stryCov_9fa48("5718"), false));
    const [showInviteForm, setShowInviteForm] = useState(stryMutAct_9fa48("5719") ? true : (stryCov_9fa48("5719"), false));
    const [disconnecting, setDisconnecting] = useState(stryMutAct_9fa48("5720") ? true : (stryCov_9fa48("5720"), false));
    const [showPostConnectionMessage, setShowPostConnectionMessage] = useState(stryMutAct_9fa48("5721") ? true : (stryCov_9fa48("5721"), false));
    const [postConnectionMessage, setPostConnectionMessage] = useState(stryMutAct_9fa48("5722") ? "Stryker was here!" : (stryCov_9fa48("5722"), ''));
    useEffect(() => {
      if (stryMutAct_9fa48("5723")) {
        {}
      } else {
        stryCov_9fa48("5723");
        if (stryMutAct_9fa48("5726") ? false : stryMutAct_9fa48("5725") ? true : stryMutAct_9fa48("5724") ? user : (stryCov_9fa48("5724", "5725", "5726"), !user)) return;
        const connectionsRef = collection(db, stryMutAct_9fa48("5727") ? "" : (stryCov_9fa48("5727"), 'artifacts'), APP_ID, stryMutAct_9fa48("5728") ? "" : (stryCov_9fa48("5728"), 'family_connections'));
        const ownerQuery = query(connectionsRef, where(stryMutAct_9fa48("5729") ? "" : (stryCov_9fa48("5729"), 'ownerUid'), stryMutAct_9fa48("5730") ? "" : (stryCov_9fa48("5730"), '=='), user.uid), where(stryMutAct_9fa48("5731") ? "" : (stryCov_9fa48("5731"), 'status'), stryMutAct_9fa48("5732") ? "" : (stryCov_9fa48("5732"), '=='), stryMutAct_9fa48("5733") ? "" : (stryCov_9fa48("5733"), 'active')));
        const memberQuery = query(connectionsRef, where(stryMutAct_9fa48("5734") ? "" : (stryCov_9fa48("5734"), 'memberUid'), stryMutAct_9fa48("5735") ? "" : (stryCov_9fa48("5735"), '=='), user.uid), where(stryMutAct_9fa48("5736") ? "" : (stryCov_9fa48("5736"), 'status'), stryMutAct_9fa48("5737") ? "" : (stryCov_9fa48("5737"), '=='), stryMutAct_9fa48("5738") ? "" : (stryCov_9fa48("5738"), 'active')));
        const unsubOwner = onSnapshot(ownerQuery, snapshot => {
          if (stryMutAct_9fa48("5739")) {
            {}
          } else {
            stryCov_9fa48("5739");
            if (stryMutAct_9fa48("5742") ? false : stryMutAct_9fa48("5741") ? true : stryMutAct_9fa48("5740") ? snapshot.empty : (stryCov_9fa48("5740", "5741", "5742"), !snapshot.empty)) {
              if (stryMutAct_9fa48("5743")) {
                {}
              } else {
                stryCov_9fa48("5743");
                const doc = snapshot.docs[0];
                setConnection({
                  id: doc.id,
                  ...doc.data()
                } as FamilyConnection);
              }
            }
            setLoading(stryMutAct_9fa48("5744") ? true : (stryCov_9fa48("5744"), false));
          }
        });
        const unsubMember = onSnapshot(memberQuery, snapshot => {
          if (stryMutAct_9fa48("5745")) {
            {}
          } else {
            stryCov_9fa48("5745");
            if (stryMutAct_9fa48("5748") ? false : stryMutAct_9fa48("5747") ? true : stryMutAct_9fa48("5746") ? snapshot.empty : (stryCov_9fa48("5746", "5747", "5748"), !snapshot.empty)) {
              if (stryMutAct_9fa48("5749")) {
                {}
              } else {
                stryCov_9fa48("5749");
                const doc = snapshot.docs[0];
                setConnection({
                  id: doc.id,
                  ...doc.data()
                } as FamilyConnection);
              }
            }
            setLoading(stryMutAct_9fa48("5750") ? true : (stryCov_9fa48("5750"), false));
          }
        });
        const invitesRef = collection(db, stryMutAct_9fa48("5751") ? "" : (stryCov_9fa48("5751"), 'artifacts'), APP_ID, stryMutAct_9fa48("5752") ? "" : (stryCov_9fa48("5752"), 'family_invitations'));
        const pendingQuery = query(invitesRef, where(stryMutAct_9fa48("5753") ? "" : (stryCov_9fa48("5753"), 'ownerUid'), stryMutAct_9fa48("5754") ? "" : (stryCov_9fa48("5754"), '=='), user.uid), where(stryMutAct_9fa48("5755") ? "" : (stryCov_9fa48("5755"), 'status'), stryMutAct_9fa48("5756") ? "" : (stryCov_9fa48("5756"), 'in'), stryMutAct_9fa48("5757") ? [] : (stryCov_9fa48("5757"), [stryMutAct_9fa48("5758") ? "" : (stryCov_9fa48("5758"), 'pending'), stryMutAct_9fa48("5759") ? "" : (stryCov_9fa48("5759"), 'awaiting_confirmation')])));
        const unsubPending = onSnapshot(pendingQuery, snapshot => {
          if (stryMutAct_9fa48("5760")) {
            {}
          } else {
            stryCov_9fa48("5760");
            setHasPendingInvite(stryMutAct_9fa48("5761") ? snapshot.empty : (stryCov_9fa48("5761"), !snapshot.empty));
          }
        });
        return () => {
          if (stryMutAct_9fa48("5762")) {
            {}
          } else {
            stryCov_9fa48("5762");
            unsubOwner();
            unsubMember();
            unsubPending();
          }
        };
      }
    }, stryMutAct_9fa48("5763") ? [] : (stryCov_9fa48("5763"), [user]));
    const handleConnectionConfirmed = (_redirectTo: string, message: string) => {
      if (stryMutAct_9fa48("5764")) {
        {}
      } else {
        stryCov_9fa48("5764");
        setShowPostConnectionMessage(stryMutAct_9fa48("5765") ? false : (stryCov_9fa48("5765"), true));
        setPostConnectionMessage(message);
      }
    };
    const handleGoToFinance = () => {
      if (stryMutAct_9fa48("5766")) {
        {}
      } else {
        stryCov_9fa48("5766");
        setShowPostConnectionMessage(stryMutAct_9fa48("5767") ? true : (stryCov_9fa48("5767"), false));
        onNavigateToFinance ? onNavigateToFinance() : window.location.href = stryMutAct_9fa48("5768") ? "" : (stryCov_9fa48("5768"), '/finance');
      }
    };
    const handleDisconnect = async () => {
      if (stryMutAct_9fa48("5769")) {
        {}
      } else {
        stryCov_9fa48("5769");
        if (stryMutAct_9fa48("5772") ? !connection && !user : stryMutAct_9fa48("5771") ? false : stryMutAct_9fa48("5770") ? true : (stryCov_9fa48("5770", "5771", "5772"), (stryMutAct_9fa48("5773") ? connection : (stryCov_9fa48("5773"), !connection)) || (stryMutAct_9fa48("5774") ? user : (stryCov_9fa48("5774"), !user)))) return;
        const isOwner = stryMutAct_9fa48("5777") ? connection.ownerUid !== user.uid : stryMutAct_9fa48("5776") ? false : stryMutAct_9fa48("5775") ? true : (stryCov_9fa48("5775", "5776", "5777"), connection.ownerUid === user.uid);
        const otherName = isOwner ? connection.memberDisplayName : connection.ownerDisplayName;
        const confirmed = await confirmDialog(stryMutAct_9fa48("5778") ? {} : (stryCov_9fa48("5778"), {
          title: isOwner ? stryMutAct_9fa48("5779") ? "" : (stryCov_9fa48("5779"), 'Remove Family Member?') : stryMutAct_9fa48("5780") ? "" : (stryCov_9fa48("5780"), 'Leave Household?'),
          message: isOwner ? stryMutAct_9fa48("5781") ? `` : (stryCov_9fa48("5781"), `This will remove ${otherName} from your household and revoke all shared account access immediately.`) : stryMutAct_9fa48("5782") ? `` : (stryCov_9fa48("5782"), `This will disconnect you from ${otherName}'s household. You will lose access to all shared accounts.`),
          type: stryMutAct_9fa48("5783") ? "" : (stryCov_9fa48("5783"), 'danger'),
          confirmText: isOwner ? stryMutAct_9fa48("5784") ? "" : (stryCov_9fa48("5784"), 'Remove') : stryMutAct_9fa48("5785") ? "" : (stryCov_9fa48("5785"), 'Leave')
        }));
        if (stryMutAct_9fa48("5788") ? false : stryMutAct_9fa48("5787") ? true : stryMutAct_9fa48("5786") ? confirmed : (stryCov_9fa48("5786", "5787", "5788"), !confirmed)) return;
        setDisconnecting(stryMutAct_9fa48("5789") ? false : (stryCov_9fa48("5789"), true));
        try {
          if (stryMutAct_9fa48("5790")) {
            {}
          } else {
            stryCov_9fa48("5790");
            const functions = getFunctions();
            const disconnectFamily = httpsCallable<{
              type: 'remove_member' | 'leave';
            }, {
              success: boolean;
            }>(functions, stryMutAct_9fa48("5791") ? "" : (stryCov_9fa48("5791"), 'disconnectFamily'));
            await disconnectFamily(stryMutAct_9fa48("5792") ? {} : (stryCov_9fa48("5792"), {
              type: isOwner ? stryMutAct_9fa48("5793") ? "" : (stryCov_9fa48("5793"), 'remove_member') : stryMutAct_9fa48("5794") ? "" : (stryCov_9fa48("5794"), 'leave')
            }));
            showToast(stryMutAct_9fa48("5795") ? "" : (stryCov_9fa48("5795"), 'Family connection removed'), stryMutAct_9fa48("5796") ? "" : (stryCov_9fa48("5796"), 'success'));
            setConnection(null);
          }
        } catch (err) {
          if (stryMutAct_9fa48("5797")) {
            {}
          } else {
            stryCov_9fa48("5797");
            console.error(stryMutAct_9fa48("5798") ? "" : (stryCov_9fa48("5798"), 'Disconnect error:'), err);
            showToast(stryMutAct_9fa48("5799") ? "" : (stryCov_9fa48("5799"), 'Failed to disconnect'), stryMutAct_9fa48("5800") ? "" : (stryCov_9fa48("5800"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("5801")) {
            {}
          } else {
            stryCov_9fa48("5801");
            setDisconnecting(stryMutAct_9fa48("5802") ? true : (stryCov_9fa48("5802"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("5805") ? false : stryMutAct_9fa48("5804") ? true : stryMutAct_9fa48("5803") ? user : (stryCov_9fa48("5803", "5804", "5805"), !user)) return null;
    if (stryMutAct_9fa48("5807") ? false : stryMutAct_9fa48("5806") ? true : (stryCov_9fa48("5806", "5807"), loading)) return <FamilyLoadingState />;
    if (stryMutAct_9fa48("5809") ? false : stryMutAct_9fa48("5808") ? true : (stryCov_9fa48("5808", "5809"), showPostConnectionMessage)) return <FamilyPostConnectionMessage message={postConnectionMessage} onGoToFinance={handleGoToFinance} />;
    if (stryMutAct_9fa48("5811") ? false : stryMutAct_9fa48("5810") ? true : (stryCov_9fa48("5810", "5811"), connection)) return <FamilyConnectedState connection={connection} currentUserId={user.uid} disconnecting={disconnecting} onDisconnect={handleDisconnect} />;
    if (stryMutAct_9fa48("5813") ? false : stryMutAct_9fa48("5812") ? true : (stryCov_9fa48("5812", "5813"), hasPendingInvite)) return <PendingConfirmation userId={user.uid} onConnectionConfirmed={handleConnectionConfirmed} />;
    if (stryMutAct_9fa48("5815") ? false : stryMutAct_9fa48("5814") ? true : (stryCov_9fa48("5814", "5815"), showInviteForm)) {
      if (stryMutAct_9fa48("5816")) {
        {}
      } else {
        stryCov_9fa48("5816");
        return <Card className="overflow-hidden">
                <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-900/10">
                    <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-500 flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg"><Users className="w-5 h-5 text-amber-600 dark:text-amber-500" /></div>
                        Invite Family Member
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <InviteFamilyMember userEmail={stryMutAct_9fa48("5819") ? user.email && '' : stryMutAct_9fa48("5818") ? false : stryMutAct_9fa48("5817") ? true : (stryCov_9fa48("5817", "5818", "5819"), user.email || (stryMutAct_9fa48("5820") ? "Stryker was here!" : (stryCov_9fa48("5820"), '')))} isEmailVerified={user.emailVerified} onInviteSent={stryMutAct_9fa48("5821") ? () => undefined : (stryCov_9fa48("5821"), () => setShowInviteForm(stryMutAct_9fa48("5822") ? true : (stryCov_9fa48("5822"), false)))} />
                </CardContent>
            </Card>;
      }
    }
    return <FamilyInviteCard onShowInviteForm={stryMutAct_9fa48("5823") ? () => undefined : (stryCov_9fa48("5823"), () => setShowInviteForm(stryMutAct_9fa48("5824") ? false : (stryCov_9fa48("5824"), true)))} />;
  }
}