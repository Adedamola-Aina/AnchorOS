/**
 * AccountHeader - Premium header section with balance and action buttons
 * Redesigned for a more modern, polished look
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Sub-components extracted to AccountHeaderParts.tsx
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
import { ArrowLeft, Trash2, Users, Pencil, Sparkles } from 'lucide-react';
import type { AnchorAccount } from '../../../types';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import { AccountRenameInput, AccountActionButtons } from './AccountHeaderParts';
interface AccountHeaderProps {
  account: AnchorAccount;
  isOwner: boolean;
  familyMemberId?: string | null;
  isEditingName: boolean;
  newName: string;
  isRenaming: boolean;
  onBack: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onTransfer?: () => void;
  onPayBill?: () => void;
  onStartRename: () => void;
  onCancelRename: () => void;
  onConfirmRename: () => void;
  onNameChange: (name: string) => void;
}
const getAccountStyle = (account: AnchorAccount) => {
  if (stryMutAct_9fa48("4249")) {
    {}
  } else {
    stryCov_9fa48("4249");
    if (stryMutAct_9fa48("4252") ? account.currency !== 'USD' : stryMutAct_9fa48("4251") ? false : stryMutAct_9fa48("4250") ? true : (stryCov_9fa48("4250", "4251", "4252"), account.currency === (stryMutAct_9fa48("4253") ? "" : (stryCov_9fa48("4253"), 'USD')))) {
      if (stryMutAct_9fa48("4254")) {
        {}
      } else {
        stryCov_9fa48("4254");
        return stryMutAct_9fa48("4255") ? {} : (stryCov_9fa48("4255"), {
          gradient: stryMutAct_9fa48("4256") ? "" : (stryCov_9fa48("4256"), 'from-slate-900 via-slate-800 to-slate-900'),
          accent: stryMutAct_9fa48("4257") ? "" : (stryCov_9fa48("4257"), 'bg-finance-500'),
          accentText: stryMutAct_9fa48("4258") ? "" : (stryCov_9fa48("4258"), 'text-finance-400'),
          glow: stryMutAct_9fa48("4259") ? "" : (stryCov_9fa48("4259"), 'shadow-emerald-500/20')
        });
      }
    }
    return stryMutAct_9fa48("4260") ? {} : (stryCov_9fa48("4260"), {
      gradient: stryMutAct_9fa48("4261") ? "" : (stryCov_9fa48("4261"), 'from-indigo-600 via-purple-600 to-pink-500'),
      accent: stryMutAct_9fa48("4262") ? "" : (stryCov_9fa48("4262"), 'bg-white'),
      accentText: stryMutAct_9fa48("4263") ? "" : (stryCov_9fa48("4263"), 'text-white'),
      glow: stryMutAct_9fa48("4264") ? "" : (stryCov_9fa48("4264"), 'shadow-purple-500/30')
    });
  }
};
export const AccountHeader = ({
  account,
  isOwner,
  familyMemberId,
  isEditingName,
  newName,
  isRenaming,
  onBack,
  onDelete,
  onShare,
  onTransfer,
  onPayBill,
  onStartRename,
  onCancelRename,
  onConfirmRename,
  onNameChange
}: AccountHeaderProps) => {
  if (stryMutAct_9fa48("4265")) {
    {}
  } else {
    stryCov_9fa48("4265");
    const style = getAccountStyle(account);
    const isShared = stryMutAct_9fa48("4268") ? account.sharedWith || Object.keys(account.sharedWith).length > 0 : stryMutAct_9fa48("4267") ? false : stryMutAct_9fa48("4266") ? true : (stryCov_9fa48("4266", "4267", "4268"), account.sharedWith && (stryMutAct_9fa48("4271") ? Object.keys(account.sharedWith).length <= 0 : stryMutAct_9fa48("4270") ? Object.keys(account.sharedWith).length >= 0 : stryMutAct_9fa48("4269") ? true : (stryCov_9fa48("4269", "4270", "4271"), Object.keys(account.sharedWith).length > 0)));
    return <div className={stryMutAct_9fa48("4272") ? `` : (stryCov_9fa48("4272"), `bg-gradient-to-br ${style.gradient} rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl ${style.glow}`)}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="absolute inset-0 opacity-[0.03]" style={stryMutAct_9fa48("4273") ? {} : (stryCov_9fa48("4273"), {
        backgroundImage: stryMutAct_9fa48("4274") ? `` : (stryCov_9fa48("4274"), `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23fff' stroke-width='1' fill='none'/%3E%3C/svg%3E")`)
      })} />

            <div className="relative z-10">
                {/* Top Bar */}
                <div className="flex items-center justify-between mb-8">
                    <button onClick={onBack} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        {stryMutAct_9fa48("4277") ? isShared || <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">Shared</span>
                            </div> : stryMutAct_9fa48("4276") ? false : stryMutAct_9fa48("4275") ? true : (stryCov_9fa48("4275", "4276", "4277"), isShared && <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">Shared</span>
                            </div>)}
                        {stryMutAct_9fa48("4280") ? isOwner || <button onClick={onStartRename} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Rename account">
                                <Pencil className="w-4 h-4" />
                            </button> : stryMutAct_9fa48("4279") ? false : stryMutAct_9fa48("4278") ? true : (stryCov_9fa48("4278", "4279", "4280"), isOwner && <button onClick={onStartRename} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Rename account">
                                <Pencil className="w-4 h-4" />
                            </button>)}
                        {stryMutAct_9fa48("4283") ? onShare && familyMemberId && !account.ownerId || <button onClick={onShare} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Manage Sharing">
                                <Users className="w-4 h-4" />
                            </button> : stryMutAct_9fa48("4282") ? false : stryMutAct_9fa48("4281") ? true : (stryCov_9fa48("4281", "4282", "4283"), (stryMutAct_9fa48("4285") ? onShare && familyMemberId || !account.ownerId : stryMutAct_9fa48("4284") ? true : (stryCov_9fa48("4284", "4285"), (stryMutAct_9fa48("4287") ? onShare || familyMemberId : stryMutAct_9fa48("4286") ? true : (stryCov_9fa48("4286", "4287"), onShare && familyMemberId)) && (stryMutAct_9fa48("4288") ? account.ownerId : (stryCov_9fa48("4288"), !account.ownerId)))) && <button onClick={onShare} className="bg-white/10 hover:bg-white/20 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Manage Sharing">
                                <Users className="w-4 h-4" />
                            </button>)}
                        {stryMutAct_9fa48("4291") ? onDelete && isOwner || <button onClick={onDelete} className="bg-white/10 hover:bg-red-500/80 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Delete account">
                                <Trash2 className="w-4 h-4" />
                            </button> : stryMutAct_9fa48("4290") ? false : stryMutAct_9fa48("4289") ? true : (stryCov_9fa48("4289", "4290", "4291"), (stryMutAct_9fa48("4293") ? onDelete || isOwner : stryMutAct_9fa48("4292") ? true : (stryCov_9fa48("4292", "4293"), onDelete && isOwner)) && <button onClick={onDelete} className="bg-white/10 hover:bg-red-500/80 backdrop-blur-xl p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/10" title="Delete account">
                                <Trash2 className="w-4 h-4" />
                            </button>)}
                    </div>
                </div>

                {/* Account Info */}
                <div className="mb-8">
                    {isEditingName ? <AccountRenameInput newName={newName} isRenaming={isRenaming} onNameChange={onNameChange} onConfirmRename={onConfirmRename} onCancelRename={onCancelRename} /> : <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-h1 lg:text-h1-lg tracking-tight">{account.name}</h1>
                                <Sparkles className="w-5 h-5 opacity-50" />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-xs font-semibold uppercase tracking-wider border border-white/10">{account.type}</span>
                                <span className="text-white/50 text-sm font-medium">{(stryMutAct_9fa48("4296") ? account.currency !== 'USD' : stryMutAct_9fa48("4295") ? false : stryMutAct_9fa48("4294") ? true : (stryCov_9fa48("4294", "4295", "4296"), account.currency === (stryMutAct_9fa48("4297") ? "" : (stryCov_9fa48("4297"), 'USD')))) ? stryMutAct_9fa48("4298") ? "" : (stryCov_9fa48("4298"), '🇺🇸 US Dollar') : stryMutAct_9fa48("4299") ? "" : (stryCov_9fa48("4299"), '🇳🇬 Nigerian Naira')}</span>
                            </div>
                        </div>}
                </div>

                {/* Balance Display */}
                <div className="mb-10">
                    <p className="text-xs font-semibold opacity-60 uppercase tracking-[0.2em] mb-2">Available Balance</p>
                    <h2 className="text-5xl sm:text-6xl font-black tabular-nums tracking-tight">
                        {formatCurrency(fromCents(account.balanceCents), account.currency)}
                    </h2>
                </div>

                {/* Action Buttons */}
                <AccountActionButtons account={account} onTransfer={onTransfer} onPayBill={onPayBill} />
            </div>
        </div>;
  }
};