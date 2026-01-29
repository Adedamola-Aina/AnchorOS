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
import React, { useState } from 'react';
import { Landmark } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import type { AnchorAccount, Currency } from '../../types';
import { toCents } from '../../utils/moneyUtils';
import { validateAccount, formatValidationErrors } from '../../utils/validation';
import { useNotifications } from '../../context/NotificationContext';
interface AccountFormProps {
  onClose: () => void;
}
export const AccountForm: React.FC<AccountFormProps> = ({
  onClose
}) => {
  if (stryMutAct_9fa48("3484")) {
    {}
  } else {
    stryCov_9fa48("3484");
    const {
      addAccount
    } = useFinance();
    const {
      showToast
    } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("3485") ? true : (stryCov_9fa48("3485"), false));
    const [error, setError] = useState<string | null>(null);
    const [newAccName, setNewAccName] = useState(stryMutAct_9fa48("3486") ? "Stryker was here!" : (stryCov_9fa48("3486"), ''));
    const [newAccType, setNewAccType] = useState<AnchorAccount['type']>(stryMutAct_9fa48("3487") ? "" : (stryCov_9fa48("3487"), 'checking'));
    const [newAccCurrency, setNewAccCurrency] = useState<Currency>(stryMutAct_9fa48("3488") ? "" : (stryCov_9fa48("3488"), 'NGN'));
    const [newAccBalance, setNewAccBalance] = useState(stryMutAct_9fa48("3489") ? "Stryker was here!" : (stryCov_9fa48("3489"), ''));
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("3490")) {
        {}
      } else {
        stryCov_9fa48("3490");
        e.preventDefault();
        if (stryMutAct_9fa48("3492") ? false : stryMutAct_9fa48("3491") ? true : (stryCov_9fa48("3491", "3492"), isSubmitting)) return;
        setError(null);

        // Validate input
        const validation = validateAccount(stryMutAct_9fa48("3493") ? {} : (stryCov_9fa48("3493"), {
          name: newAccName,
          type: newAccType,
          currency: newAccCurrency,
          balanceCents: toCents(newAccBalance)
        }));
        if (stryMutAct_9fa48("3496") ? false : stryMutAct_9fa48("3495") ? true : stryMutAct_9fa48("3494") ? validation.valid : (stryCov_9fa48("3494", "3495", "3496"), !validation.valid)) {
          if (stryMutAct_9fa48("3497")) {
            {}
          } else {
            stryCov_9fa48("3497");
            const errorMsg = formatValidationErrors(validation.errors);
            setError(errorMsg);
            showToast(errorMsg, stryMutAct_9fa48("3498") ? "" : (stryCov_9fa48("3498"), 'error'));
            return;
          }
        }
        setIsSubmitting(stryMutAct_9fa48("3499") ? false : (stryCov_9fa48("3499"), true));
        try {
          if (stryMutAct_9fa48("3500")) {
            {}
          } else {
            stryCov_9fa48("3500");
            await addAccount(stryMutAct_9fa48("3501") ? {} : (stryCov_9fa48("3501"), {
              name: newAccName,
              type: newAccType,
              currency: newAccCurrency,
              balanceCents: toCents(newAccBalance),
              color: stryMutAct_9fa48("3502") ? "" : (stryCov_9fa48("3502"), 'bg-slate-500'),
              scope: stryMutAct_9fa48("3503") ? "" : (stryCov_9fa48("3503"), 'personal') // Default to personal scope
            }));
            showToast(stryMutAct_9fa48("3504") ? "" : (stryCov_9fa48("3504"), 'Account created successfully'), stryMutAct_9fa48("3505") ? "" : (stryCov_9fa48("3505"), 'success'));
            setNewAccName(stryMutAct_9fa48("3506") ? "Stryker was here!" : (stryCov_9fa48("3506"), ''));
            setNewAccBalance(stryMutAct_9fa48("3507") ? "Stryker was here!" : (stryCov_9fa48("3507"), ''));
            onClose();
          }
        } catch (err) {
          if (stryMutAct_9fa48("3508")) {
            {}
          } else {
            stryCov_9fa48("3508");
            console.error(stryMutAct_9fa48("3509") ? "" : (stryCov_9fa48("3509"), '[AccountForm] Failed to add account:'), err);
            const msg = err instanceof Error ? err.message : stryMutAct_9fa48("3510") ? "" : (stryCov_9fa48("3510"), 'Failed to create account');
            setError(msg);
            showToast(msg, stryMutAct_9fa48("3511") ? "" : (stryCov_9fa48("3511"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("3512")) {
            {}
          } else {
            stryCov_9fa48("3512");
            setIsSubmitting(stryMutAct_9fa48("3513") ? true : (stryCov_9fa48("3513"), false));
          }
        }
      }
    };
    return <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
            <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Landmark className="w-5 h-5" /> Setup New Account
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                {stryMutAct_9fa48("3516") ? error || <div className="text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
                        {error}
                    </div> : stryMutAct_9fa48("3515") ? false : stryMutAct_9fa48("3514") ? true : (stryCov_9fa48("3514", "3515", "3516"), error && <div className="text-rose-500 text-sm bg-rose-50 dark:bg-rose-900/20 p-2 rounded-lg">
                        {error}
                    </div>)}
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Account Name
                        {stryMutAct_9fa48("3519") ? newAccName.length > 255 || <span className="text-rose-500 ml-2 normal-case font-normal">
                                Must be 255 characters or fewer
                            </span> : stryMutAct_9fa48("3518") ? false : stryMutAct_9fa48("3517") ? true : (stryCov_9fa48("3517", "3518", "3519"), (stryMutAct_9fa48("3522") ? newAccName.length <= 255 : stryMutAct_9fa48("3521") ? newAccName.length >= 255 : stryMutAct_9fa48("3520") ? true : (stryCov_9fa48("3520", "3521", "3522"), newAccName.length > 255)) && <span className="text-rose-500 ml-2 normal-case font-normal">
                                Must be 255 characters or fewer
                            </span>)}
                    </label>
                    <input type="text" value={newAccName} onChange={stryMutAct_9fa48("3523") ? () => undefined : (stryCov_9fa48("3523"), e => setNewAccName(e.target.value))} placeholder="e.g. Zenith Spending, Sterling Salary" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Type</label>
                        <select value={newAccType} onChange={stryMutAct_9fa48("3524") ? () => undefined : (stryCov_9fa48("3524"), e => setNewAccType(e.target.value as AnchorAccount['type']))} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                            <option value="checking">Checking / Spending</option>
                            <option value="savings">Savings</option>
                            <option value="salary">Salary</option>
                            <option value="investment">Investment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Currency</label>
                        <select value={newAccCurrency} onChange={stryMutAct_9fa48("3525") ? () => undefined : (stryCov_9fa48("3525"), e => setNewAccCurrency(e.target.value as Currency))} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                            <option value="NGN">NGN (₦)</option>
                            <option value="USD">USD ($)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Initial Balance
                    </label>
                    <input type="text" inputMode="decimal" value={newAccBalance} onChange={e => {
            if (stryMutAct_9fa48("3526")) {
              {}
            } else {
              stryCov_9fa48("3526");
              if (stryMutAct_9fa48("3528") ? false : stryMutAct_9fa48("3527") ? true : (stryCov_9fa48("3527", "3528"), (stryMutAct_9fa48("3532") ? /^[^0-9.,]*$/ : stryMutAct_9fa48("3531") ? /^[0-9.,]$/ : stryMutAct_9fa48("3530") ? /^[0-9.,]*/ : stryMutAct_9fa48("3529") ? /[0-9.,]*$/ : (stryCov_9fa48("3529", "3530", "3531", "3532"), /^[0-9.,]*$/)).test(e.target.value))) setNewAccBalance(e.target.value);
            }
          }} placeholder="0.00" className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 text-sm hover:text-slate-700 dark:hover:text-slate-200">Cancel</button>
                    <button type="submit" disabled={stryMutAct_9fa48("3535") ? isSubmitting && !newAccName : stryMutAct_9fa48("3534") ? false : stryMutAct_9fa48("3533") ? true : (stryCov_9fa48("3533", "3534", "3535"), isSubmitting || (stryMutAct_9fa48("3536") ? newAccName : (stryCov_9fa48("3536"), !newAccName)))} className="bg-slate-800 dark:bg-slate-600 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                        {isSubmitting ? stryMutAct_9fa48("3537") ? "" : (stryCov_9fa48("3537"), 'Creating...') : stryMutAct_9fa48("3538") ? "" : (stryCov_9fa48("3538"), 'Create Account')}
                    </button>
                </div>
            </form>
        </div>;
  }
};