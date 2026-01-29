/**
 * Family Settings UI States
 * Extracted from FamilySettingsV2.tsx per CLAUDE.md §3.2
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
import { Card, CardContent, CardHeader, CardTitle } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
import { Users, Check, Loader2, UserMinus, ArrowRight } from 'lucide-react';
interface FamilyConnection {
  id: string;
  ownerUid: string;
  memberUid: string;
  ownerDisplayName: string;
  memberDisplayName: string;
  status: 'active' | 'disconnected';
  connectedAt: string;
}
export const FamilyLoadingState: React.FC = stryMutAct_9fa48("5705") ? () => undefined : (stryCov_9fa48("5705"), (() => {
  const FamilyLoadingState: React.FC = () => <Card>
        <CardContent className="p-6 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
        </CardContent>
    </Card>;
  return FamilyLoadingState;
})());
interface PostConnectionProps {
  message: string;
  onGoToFinance: () => void;
}
export const FamilyPostConnectionMessage: React.FC<PostConnectionProps> = stryMutAct_9fa48("5706") ? () => undefined : (stryCov_9fa48("5706"), (() => {
  const FamilyPostConnectionMessage: React.FC<PostConnectionProps> = ({
    message,
    onGoToFinance
  }) => <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
                <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">🎉 Connected!</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{message}</p>
            </div>
            <Button onClick={onGoToFinance} className="gap-2">Go to Finance <ArrowRight className="w-4 h-4" /></Button>
        </CardContent>
    </Card>;
  return FamilyPostConnectionMessage;
})());
interface ConnectedStateProps {
  connection: FamilyConnection;
  currentUserId: string;
  disconnecting: boolean;
  onDisconnect: () => void;
}
export const FamilyConnectedState: React.FC<ConnectedStateProps> = ({
  connection,
  currentUserId,
  disconnecting,
  onDisconnect
}) => {
  if (stryMutAct_9fa48("5707")) {
    {}
  } else {
    stryCov_9fa48("5707");
    const isOwner = stryMutAct_9fa48("5710") ? connection.ownerUid !== currentUserId : stryMutAct_9fa48("5709") ? false : stryMutAct_9fa48("5708") ? true : (stryCov_9fa48("5708", "5709", "5710"), connection.ownerUid === currentUserId);
    const partnerName = isOwner ? connection.memberDisplayName : connection.ownerDisplayName;
    return <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/30 dark:bg-emerald-900/10">
                <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-500 flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Users className="w-5 h-5 text-emerald-600 dark:text-emerald-500" /></div>
                    Family Connected
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center"><span className="text-lg">👥</span></div>
                        <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{partnerName}</p>
                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">{isOwner ? stryMutAct_9fa48("5711") ? "" : (stryCov_9fa48("5711"), 'Family Member') : stryMutAct_9fa48("5712") ? "" : (stryCov_9fa48("5712"), 'Household Owner')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Check className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">Active</span>
                    </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Connected since {new Date(connection.connectedAt).toLocaleDateString()}</p>
                <Button variant="secondary" onClick={onDisconnect} disabled={disconnecting} className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/30">
                    {disconnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserMinus className="w-4 h-4 mr-2" />}
                    {isOwner ? stryMutAct_9fa48("5713") ? "" : (stryCov_9fa48("5713"), 'Remove Family Member') : stryMutAct_9fa48("5714") ? "" : (stryCov_9fa48("5714"), 'Leave Household')}
                </Button>
            </CardContent>
        </Card>;
  }
};
interface InviteCardProps {
  onShowInviteForm: () => void;
}
export const FamilyInviteCard: React.FC<InviteCardProps> = stryMutAct_9fa48("5715") ? () => undefined : (stryCov_9fa48("5715"), (() => {
  const FamilyInviteCard: React.FC<InviteCardProps> = ({
    onShowInviteForm
  }) => <Card className="overflow-hidden border-dashed border-2 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
        <CardContent className="p-6">
            <button onClick={onShowInviteForm} className="w-full flex items-center gap-4 text-left group">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 transition-colors">
                    <Users className="w-6 h-6 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors">Invite Family Member</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Share selected accounts with a spouse or partner</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
            </button>
        </CardContent>
    </Card>;
  return FamilyInviteCard;
})());