/**
 * Auto-Accept Invitation Action
 * Split from DeveloperTools.tsx per CLAUDE.md §3.2 (200-line rule)
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
import React from 'react';
import { Button } from '@anchor-os/ui';
import { useNotifications } from '../../../../context/NotificationContext';
interface AutoAcceptActionProps {
  userUid: string;
}
export const AutoAcceptInvitationAction: React.FC<AutoAcceptActionProps> = ({
  userUid
}) => {
  if (stryMutAct_9fa48("6347")) {
    {}
  } else {
    stryCov_9fa48("6347");
    const {
      showToast
    } = useNotifications();
    const handleAutoAccept = async () => {
      if (stryMutAct_9fa48("6348")) {
        {}
      } else {
        stryCov_9fa48("6348");
        try {
          if (stryMutAct_9fa48("6349")) {
            {}
          } else {
            stryCov_9fa48("6349");
            const {
              db,
              APP_ID,
              auth
            } = await import(stryMutAct_9fa48("6350") ? "" : (stryCov_9fa48("6350"), '../../../../config/firebase'));
            const {
              collection,
              query,
              where,
              getDocs,
              doc,
              writeBatch
            } = await import(stryMutAct_9fa48("6351") ? "" : (stryCov_9fa48("6351"), 'firebase/firestore'));
            const currentUserEmail = stryMutAct_9fa48("6352") ? auth.currentUser.email : (stryCov_9fa48("6352"), auth.currentUser?.email);
            if (stryMutAct_9fa48("6355") ? false : stryMutAct_9fa48("6354") ? true : stryMutAct_9fa48("6353") ? currentUserEmail : (stryCov_9fa48("6353", "6354", "6355"), !currentUserEmail)) {
              if (stryMutAct_9fa48("6356")) {
                {}
              } else {
                stryCov_9fa48("6356");
                showToast(stryMutAct_9fa48("6357") ? "" : (stryCov_9fa48("6357"), 'Not logged in'), stryMutAct_9fa48("6358") ? "" : (stryCov_9fa48("6358"), 'error'));
                return;
              }
            }

            // Find pending invitations for this user
            const invitesRef = collection(db, stryMutAct_9fa48("6359") ? "" : (stryCov_9fa48("6359"), 'artifacts'), APP_ID, stryMutAct_9fa48("6360") ? "" : (stryCov_9fa48("6360"), 'family_invitations'));
            const q = query(invitesRef, where(stryMutAct_9fa48("6361") ? "" : (stryCov_9fa48("6361"), 'inviteeEmail'), stryMutAct_9fa48("6362") ? "" : (stryCov_9fa48("6362"), '=='), currentUserEmail), where(stryMutAct_9fa48("6363") ? "" : (stryCov_9fa48("6363"), 'status'), stryMutAct_9fa48("6364") ? "" : (stryCov_9fa48("6364"), '=='), stryMutAct_9fa48("6365") ? "" : (stryCov_9fa48("6365"), 'pending')));
            const snapshot = await getDocs(q);
            if (stryMutAct_9fa48("6367") ? false : stryMutAct_9fa48("6366") ? true : (stryCov_9fa48("6366", "6367"), snapshot.empty)) {
              if (stryMutAct_9fa48("6368")) {
                {}
              } else {
                stryCov_9fa48("6368");
                // Try finding invitations sent BY this user
                const q2 = query(invitesRef, where(stryMutAct_9fa48("6369") ? "" : (stryCov_9fa48("6369"), 'ownerEmail'), stryMutAct_9fa48("6370") ? "" : (stryCov_9fa48("6370"), '=='), currentUserEmail), where(stryMutAct_9fa48("6371") ? "" : (stryCov_9fa48("6371"), 'status'), stryMutAct_9fa48("6372") ? "" : (stryCov_9fa48("6372"), '=='), stryMutAct_9fa48("6373") ? "" : (stryCov_9fa48("6373"), 'pending')));
                const snapshot2 = await getDocs(q2);
                if (stryMutAct_9fa48("6375") ? false : stryMutAct_9fa48("6374") ? true : (stryCov_9fa48("6374", "6375"), snapshot2.empty)) {
                  if (stryMutAct_9fa48("6376")) {
                    {}
                  } else {
                    stryCov_9fa48("6376");
                    showToast(stryMutAct_9fa48("6377") ? "" : (stryCov_9fa48("6377"), 'No pending invitations found'), stryMutAct_9fa48("6378") ? "" : (stryCov_9fa48("6378"), 'warning'));
                    return;
                  }
                }

                // Auto-accept invitation sent by this user (simulate invitee accepting)
                const invite = snapshot2.docs[0];
                const inviteData = invite.data();
                const batch = writeBatch(db);
                const timestamp = new Date().toISOString();

                // Update invitation status
                batch.update(invite.ref, stryMutAct_9fa48("6379") ? {} : (stryCov_9fa48("6379"), {
                  status: stryMutAct_9fa48("6380") ? "" : (stryCov_9fa48("6380"), 'accepted'),
                  acceptedAt: timestamp
                }));

                // Create family connection
                const connectionId = stryMutAct_9fa48("6381") ? `` : (stryCov_9fa48("6381"), `${inviteData.ownerUid}_${inviteData.inviteeEmail.replace(stryMutAct_9fa48("6382") ? "" : (stryCov_9fa48("6382"), '@'), stryMutAct_9fa48("6383") ? "" : (stryCov_9fa48("6383"), '_at_'))}`);
                const connectionRef = doc(db, stryMutAct_9fa48("6384") ? "" : (stryCov_9fa48("6384"), 'artifacts'), APP_ID, stryMutAct_9fa48("6385") ? "" : (stryCov_9fa48("6385"), 'family_connections'), connectionId);
                batch.set(connectionRef, stryMutAct_9fa48("6386") ? {} : (stryCov_9fa48("6386"), {
                  ownerUid: inviteData.ownerUid,
                  ownerEmail: inviteData.ownerEmail,
                  ownerName: inviteData.ownerDisplayName,
                  memberEmail: inviteData.inviteeEmail,
                  status: stryMutAct_9fa48("6387") ? "" : (stryCov_9fa48("6387"), 'connected'),
                  createdAt: timestamp,
                  confirmedAt: timestamp
                }));

                // Update owner profile
                const ownerRef = doc(db, stryMutAct_9fa48("6388") ? "" : (stryCov_9fa48("6388"), 'artifacts'), APP_ID, stryMutAct_9fa48("6389") ? "" : (stryCov_9fa48("6389"), 'users'), inviteData.ownerUid);
                batch.update(ownerRef, stryMutAct_9fa48("6390") ? {} : (stryCov_9fa48("6390"), {
                  familyMode: stryMutAct_9fa48("6391") ? false : (stryCov_9fa48("6391"), true),
                  familyMemberEmail: inviteData.inviteeEmail,
                  familyConnectionStatus: stryMutAct_9fa48("6392") ? "" : (stryCov_9fa48("6392"), 'connected'),
                  familyConnectedAt: timestamp
                }));
                await batch.commit();
                showToast(stryMutAct_9fa48("6393") ? "" : (stryCov_9fa48("6393"), 'Invitation auto-completed! Refresh to see changes.'), stryMutAct_9fa48("6394") ? "" : (stryCov_9fa48("6394"), 'success'));
                return;
              }
            }

            // Process invitation where current user is invitee
            const invite = snapshot.docs[0];
            const inviteData = invite.data();
            const batch = writeBatch(db);
            const timestamp = new Date().toISOString();

            // Update invitation
            batch.update(invite.ref, stryMutAct_9fa48("6395") ? {} : (stryCov_9fa48("6395"), {
              status: stryMutAct_9fa48("6396") ? "" : (stryCov_9fa48("6396"), 'accepted'),
              acceptedAt: timestamp
            }));

            // Create family connection
            const connectionId = stryMutAct_9fa48("6397") ? `` : (stryCov_9fa48("6397"), `${inviteData.ownerUid}_${userUid}`);
            const connectionRef = doc(db, stryMutAct_9fa48("6398") ? "" : (stryCov_9fa48("6398"), 'artifacts'), APP_ID, stryMutAct_9fa48("6399") ? "" : (stryCov_9fa48("6399"), 'family_connections'), connectionId);
            batch.set(connectionRef, stryMutAct_9fa48("6400") ? {} : (stryCov_9fa48("6400"), {
              ownerUid: inviteData.ownerUid,
              ownerEmail: inviteData.ownerEmail,
              ownerName: inviteData.ownerDisplayName,
              memberUid: userUid,
              memberEmail: currentUserEmail,
              status: stryMutAct_9fa48("6401") ? "" : (stryCov_9fa48("6401"), 'connected'),
              createdAt: timestamp,
              confirmedAt: timestamp
            }));

            // Only update current user's profile (member)
            const memberRef = doc(db, stryMutAct_9fa48("6402") ? "" : (stryCov_9fa48("6402"), 'artifacts'), APP_ID, stryMutAct_9fa48("6403") ? "" : (stryCov_9fa48("6403"), 'users'), userUid);
            batch.update(memberRef, stryMutAct_9fa48("6404") ? {} : (stryCov_9fa48("6404"), {
              familyMode: stryMutAct_9fa48("6405") ? false : (stryCov_9fa48("6405"), true),
              familyMemberId: inviteData.ownerUid,
              familyMemberEmail: inviteData.ownerEmail,
              familyMemberName: inviteData.ownerDisplayName,
              familyConnectionStatus: stryMutAct_9fa48("6406") ? "" : (stryCov_9fa48("6406"), 'connected'),
              familyConnectedAt: timestamp
            }));
            await batch.commit();
            showToast(stryMutAct_9fa48("6407") ? "" : (stryCov_9fa48("6407"), 'Invitation accepted! Refresh to see family connection.'), stryMutAct_9fa48("6408") ? "" : (stryCov_9fa48("6408"), 'success'));
          }
        } catch (e) {
          if (stryMutAct_9fa48("6409")) {
            {}
          } else {
            stryCov_9fa48("6409");
            showToast((stryMutAct_9fa48("6410") ? "" : (stryCov_9fa48("6410"), 'Error: ')) + (e as Error).message, stryMutAct_9fa48("6411") ? "" : (stryCov_9fa48("6411"), 'error'));
          }
        }
      }
    };
    return <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Auto-Accept Invitation</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bypass email verification and auto-complete pending family invitations.</p>
            </div>
            <Button onClick={handleAutoAccept} className="bg-amber-600 hover:bg-amber-700 h-10 px-6 text-xs font-black uppercase tracking-widest">
                Auto-Accept
            </Button>
        </div>;
  }
};