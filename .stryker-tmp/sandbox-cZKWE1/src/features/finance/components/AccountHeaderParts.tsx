/**
 * AccountHeader Sub-components
 * Split from AccountHeader.tsx per CLAUDE.md §3.2 (200-line rule)
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
import { Check, X, ArrowUpRight } from 'lucide-react';
import type { AnchorAccount } from '../../../types';
interface RenameInputProps {
  newName: string;
  isRenaming: boolean;
  onNameChange: (name: string) => void;
  onConfirmRename: () => void;
  onCancelRename: () => void;
}

/**
 * Inline rename input with save/cancel buttons
 */
export const AccountRenameInput: React.FC<RenameInputProps> = stryMutAct_9fa48("4300") ? () => undefined : (stryCov_9fa48("4300"), (() => {
  const AccountRenameInput: React.FC<RenameInputProps> = ({
    newName,
    isRenaming,
    onNameChange,
    onConfirmRename,
    onCancelRename
  }) => <div className="animate-in fade-in slide-in-from-left-2 duration-200 space-y-3">
        <input type="text" value={newName} onChange={stryMutAct_9fa48("4301") ? () => undefined : (stryCov_9fa48("4301"), e => onNameChange(e.target.value))} className="w-full bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 text-white text-2xl font-bold placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10" placeholder="Account name" autoFocus disabled={isRenaming} />
        <div className="flex gap-3">
            <button onClick={onConfirmRename} disabled={stryMutAct_9fa48("4304") ? isRenaming && !newName.trim() : stryMutAct_9fa48("4303") ? false : stryMutAct_9fa48("4302") ? true : (stryCov_9fa48("4302", "4303", "4304"), isRenaming || (stryMutAct_9fa48("4305") ? newName.trim() : (stryCov_9fa48("4305"), !(stryMutAct_9fa48("4306") ? newName : (stryCov_9fa48("4306"), newName.trim())))))} className="flex-1 bg-emerald-500 hover:bg-emerald-400 p-3 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-semibold">
                <Check className="w-5 h-5" />
                <span className="sm:hidden">Save</span>
            </button>
            <button onClick={onCancelRename} disabled={isRenaming} className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all duration-200 border border-white/10 flex items-center justify-center gap-2 font-semibold">
                <X className="w-5 h-5" />
                <span className="sm:hidden">Cancel</span>
            </button>
        </div>
    </div>;
  return AccountRenameInput;
})());
interface ActionButtonsProps {
  account: AnchorAccount;
  onTransfer?: () => void;
  onPayBill?: () => void;
}

/**
 * Transfer and Pay Bill action buttons
 */
export const AccountActionButtons: React.FC<ActionButtonsProps> = stryMutAct_9fa48("4307") ? () => undefined : (stryCov_9fa48("4307"), (() => {
  const AccountActionButtons: React.FC<ActionButtonsProps> = ({
    account,
    onTransfer,
    onPayBill
  }) => <div className="flex flex-wrap gap-3">
        <button onClick={onTransfer} className="flex-1 min-w-[140px] bg-white text-slate-900 hover:bg-white/90 px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            <ArrowUpRight className="w-5 h-5" />
            Transfer
        </button>
        <button onClick={onPayBill} className="flex-1 min-w-[140px] bg-white/15 hover:bg-white/25 backdrop-blur-xl px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/10">
            <span className="w-5 h-5 flex items-center justify-center text-lg font-bold">
                {(stryMutAct_9fa48("4310") ? account.currency !== 'USD' : stryMutAct_9fa48("4309") ? false : stryMutAct_9fa48("4308") ? true : (stryCov_9fa48("4308", "4309", "4310"), account.currency === (stryMutAct_9fa48("4311") ? "" : (stryCov_9fa48("4311"), 'USD')))) ? stryMutAct_9fa48("4312") ? "" : (stryCov_9fa48("4312"), '$') : stryMutAct_9fa48("4313") ? "" : (stryCov_9fa48("4313"), '₦')}
            </span>
            Pay Bill
        </button>
    </div>;
  return AccountActionButtons;
})());