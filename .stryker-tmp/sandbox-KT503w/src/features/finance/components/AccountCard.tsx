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
import { DollarSign, Banknote, Users } from 'lucide-react';
import { Badge } from '../../../components/shared';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorAccount } from '../../../types';
interface AccountCardProps {
  account: AnchorAccount;
  userId: string;
  isOwnerOfConnection?: boolean; // True if current user is the owner in family connection
  familyMemberUid?: string; // The family member's UID (if connected)
  onEdit: (account: AnchorAccount) => void;
  onToggleShare?: (account: AnchorAccount, share: boolean) => void;
}
export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  userId,
  isOwnerOfConnection = stryMutAct_9fa48("4142") ? true : (stryCov_9fa48("4142"), false),
  familyMemberUid,
  onEdit,
  onToggleShare
}) => {
  if (stryMutAct_9fa48("4143")) {
    {}
  } else {
    stryCov_9fa48("4143");
    // Check if this account is shared with family member (v2)
    const isSharedWithFamily = stryMutAct_9fa48("4146") ? familyMemberUid || account.sharedWith?.[familyMemberUid] : stryMutAct_9fa48("4145") ? false : stryMutAct_9fa48("4144") ? true : (stryCov_9fa48("4144", "4145", "4146"), familyMemberUid && (stryMutAct_9fa48("4147") ? account.sharedWith[familyMemberUid] : (stryCov_9fa48("4147"), account.sharedWith?.[familyMemberUid])));

    // Check if this account was shared WITH the current user (not owner)
    const isSharedToMe = stryMutAct_9fa48("4150") ? account.ownerId || account.ownerId !== userId : stryMutAct_9fa48("4149") ? false : stryMutAct_9fa48("4148") ? true : (stryCov_9fa48("4148", "4149", "4150"), account.ownerId && (stryMutAct_9fa48("4152") ? account.ownerId === userId : stryMutAct_9fa48("4151") ? true : (stryCov_9fa48("4151", "4152"), account.ownerId !== userId)));
    const handleShareToggle = (e: React.MouseEvent) => {
      if (stryMutAct_9fa48("4153")) {
        {}
      } else {
        stryCov_9fa48("4153");
        e.stopPropagation();
        if (stryMutAct_9fa48("4156") ? onToggleShare || familyMemberUid : stryMutAct_9fa48("4155") ? false : stryMutAct_9fa48("4154") ? true : (stryCov_9fa48("4154", "4155", "4156"), onToggleShare && familyMemberUid)) {
          if (stryMutAct_9fa48("4157")) {
            {}
          } else {
            stryCov_9fa48("4157");
            onToggleShare(account, stryMutAct_9fa48("4158") ? isSharedWithFamily : (stryCov_9fa48("4158"), !isSharedWithFamily));
          }
        }
      }
    };
    return <div onClick={stryMutAct_9fa48("4159") ? () => undefined : (stryCov_9fa48("4159"), () => onEdit(account))} className={stryMutAct_9fa48("4160") ? `` : (stryCov_9fa48("4160"), `cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group overflow-hidden relative ${(stryMutAct_9fa48("4163") ? account.currency !== 'USD' : stryMutAct_9fa48("4162") ? false : stryMutAct_9fa48("4161") ? true : (stryCov_9fa48("4161", "4162", "4163"), account.currency === (stryMutAct_9fa48("4164") ? "" : (stryCov_9fa48("4164"), 'USD')))) ? stryMutAct_9fa48("4165") ? "" : (stryCov_9fa48("4165"), 'hover:border-primary-500/30') : stryMutAct_9fa48("4166") ? "" : (stryCov_9fa48("4166"), 'hover:border-finance-500/30')}`)}>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={stryMutAct_9fa48("4167") ? `` : (stryCov_9fa48("4167"), `p-2.5 rounded-xl transition-transform group-hover:scale-110 ${(stryMutAct_9fa48("4170") ? account.currency !== 'USD' : stryMutAct_9fa48("4169") ? false : stryMutAct_9fa48("4168") ? true : (stryCov_9fa48("4168", "4169", "4170"), account.currency === (stryMutAct_9fa48("4171") ? "" : (stryCov_9fa48("4171"), 'USD')))) ? stryMutAct_9fa48("4172") ? "" : (stryCov_9fa48("4172"), 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400') : stryMutAct_9fa48("4173") ? "" : (stryCov_9fa48("4173"), 'bg-finance-50 dark:bg-finance-900/30 text-finance-600 dark:text-finance-400')}`)}>
                    {(stryMutAct_9fa48("4176") ? account.currency !== 'USD' : stryMutAct_9fa48("4175") ? false : stryMutAct_9fa48("4174") ? true : (stryCov_9fa48("4174", "4175", "4176"), account.currency === (stryMutAct_9fa48("4177") ? "" : (stryCov_9fa48("4177"), 'USD')))) ? <DollarSign size={22} /> : <Banknote size={22} />}
                </div>
                {/* Share toggle button - only shown to owner with active connection */}
                {stryMutAct_9fa48("4180") ? isOwnerOfConnection && onToggleShare && familyMemberUid || <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleShareToggle} className={`p-2 rounded-full transition-all ${isSharedWithFamily ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50/50'}`} title={isSharedWithFamily ? 'Stop Sharing' : 'Share with Family'}>
                            <Users className="w-4 h-4" />
                        </button>
                    </div> : stryMutAct_9fa48("4179") ? false : stryMutAct_9fa48("4178") ? true : (stryCov_9fa48("4178", "4179", "4180"), (stryMutAct_9fa48("4182") ? isOwnerOfConnection && onToggleShare || familyMemberUid : stryMutAct_9fa48("4181") ? true : (stryCov_9fa48("4181", "4182"), (stryMutAct_9fa48("4184") ? isOwnerOfConnection || onToggleShare : stryMutAct_9fa48("4183") ? true : (stryCov_9fa48("4183", "4184"), isOwnerOfConnection && onToggleShare)) && familyMemberUid)) && <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleShareToggle} className={stryMutAct_9fa48("4185") ? `` : (stryCov_9fa48("4185"), `p-2 rounded-full transition-all ${isSharedWithFamily ? stryMutAct_9fa48("4186") ? "" : (stryCov_9fa48("4186"), 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100') : stryMutAct_9fa48("4187") ? "" : (stryCov_9fa48("4187"), 'text-slate-400 hover:text-amber-500 hover:bg-amber-50/50')}`)} title={isSharedWithFamily ? stryMutAct_9fa48("4188") ? "" : (stryCov_9fa48("4188"), 'Stop Sharing') : stryMutAct_9fa48("4189") ? "" : (stryCov_9fa48("4189"), 'Share with Family')}>
                            <Users className="w-4 h-4" />
                        </button>
                    </div>)}
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate flex-1 min-w-0">
                        {account.name}
                    </h3>
                    {/* Show 👥 emoji for shared accounts (v2) */}
                    {stryMutAct_9fa48("4192") ? isSharedWithFamily || isSharedToMe || <span className="text-base" title={isSharedToMe ? 'Shared with you' : 'Shared with family'}>
                            👥
                        </span> : stryMutAct_9fa48("4191") ? false : stryMutAct_9fa48("4190") ? true : (stryCov_9fa48("4190", "4191", "4192"), (stryMutAct_9fa48("4194") ? isSharedWithFamily && isSharedToMe : stryMutAct_9fa48("4193") ? true : (stryCov_9fa48("4193", "4194"), isSharedWithFamily || isSharedToMe)) && <span className="text-base" title={isSharedToMe ? stryMutAct_9fa48("4195") ? "" : (stryCov_9fa48("4195"), 'Shared with you') : stryMutAct_9fa48("4196") ? "" : (stryCov_9fa48("4196"), 'Shared with family')}>
                            👥
                        </span>)}
                    {/* Legacy badge for accounts shared TO current user */}
                    {stryMutAct_9fa48("4199") ? isSharedToMe && !account.sharedWith || <Badge type="family" variant="outline">Shared</Badge> : stryMutAct_9fa48("4198") ? false : stryMutAct_9fa48("4197") ? true : (stryCov_9fa48("4197", "4198", "4199"), (stryMutAct_9fa48("4201") ? isSharedToMe || !account.sharedWith : stryMutAct_9fa48("4200") ? true : (stryCov_9fa48("4200", "4201"), isSharedToMe && (stryMutAct_9fa48("4202") ? account.sharedWith : (stryCov_9fa48("4202"), !account.sharedWith)))) && <Badge type="family" variant="outline">Shared</Badge>)}
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                    {formatCurrency(fromCents(account.balanceCents), account.currency)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <Badge type={account.type} variant="outline">
                        {account.type}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{account.currency}</span>
                </div>
            </div>

            {/* Decorative accent */}
            <div className={stryMutAct_9fa48("4203") ? `` : (stryCov_9fa48("4203"), `absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none opacity-10 ${(stryMutAct_9fa48("4206") ? account.currency !== 'USD' : stryMutAct_9fa48("4205") ? false : stryMutAct_9fa48("4204") ? true : (stryCov_9fa48("4204", "4205", "4206"), account.currency === (stryMutAct_9fa48("4207") ? "" : (stryCov_9fa48("4207"), 'USD')))) ? stryMutAct_9fa48("4208") ? "" : (stryCov_9fa48("4208"), 'bg-primary-500') : stryMutAct_9fa48("4209") ? "" : (stryCov_9fa48("4209"), 'bg-finance-500')}`)} />
        </div>;
  }
};