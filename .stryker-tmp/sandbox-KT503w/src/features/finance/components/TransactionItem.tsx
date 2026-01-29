/**
 * TransactionItem - Individual transaction row in the transaction list
 * 
 * Follows the Calm Computing design philosophy:
 * - Clarity over cleverness: obvious purpose for each element
 * - Quiet over loud: minimal decoration, semantic colors only
 * - Progressive disclosure: edit/delete appear on hover (desktop)
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
import { Pencil, Trash2 } from 'lucide-react';
import { CategoryIcon } from '../../../components/shared';
import { formatCurrency } from '../../../utils/format';
import { fromCents } from '../../../utils/moneyUtils';
import type { AnchorTransaction } from '../../../types';
import { Card } from '@anchor-os/ui';
interface TransactionItemProps {
  transaction: AnchorTransaction;
  accountName?: string;
  onEdit: (tx: AnchorTransaction) => void;
  onDelete: (tx: AnchorTransaction) => void;
  currentUserId?: string;
}
export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onEdit,
  onDelete,
  currentUserId
}) => {
  if (stryMutAct_9fa48("4602")) {
    {}
  } else {
    stryCov_9fa48("4602");
    // Guard against undefined transaction
    if (stryMutAct_9fa48("4605") ? false : stryMutAct_9fa48("4604") ? true : stryMutAct_9fa48("4603") ? transaction : (stryCov_9fa48("4603", "4604", "4605"), !transaction)) return null;

    // Use the isBackdated flag if available (new transactions), otherwise calculate for legacy
    const isBackdated = stryMutAct_9fa48("4606") ? transaction.isBackdated && (() => {
      if (!transaction.transactionDate) return false;
      const entryDate = new Date(transaction.date).getTime();
      const txDate = new Date(transaction.transactionDate).getTime();
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      return entryDate - txDate > ONE_DAY_MS;
    })() : (stryCov_9fa48("4606"), transaction.isBackdated ?? (() => {
      if (stryMutAct_9fa48("4607")) {
        {}
      } else {
        stryCov_9fa48("4607");
        if (stryMutAct_9fa48("4610") ? false : stryMutAct_9fa48("4609") ? true : stryMutAct_9fa48("4608") ? transaction.transactionDate : (stryCov_9fa48("4608", "4609", "4610"), !transaction.transactionDate)) return stryMutAct_9fa48("4611") ? true : (stryCov_9fa48("4611"), false);
        const entryDate = new Date(transaction.date).getTime();
        const txDate = new Date(transaction.transactionDate).getTime();
        const ONE_DAY_MS = stryMutAct_9fa48("4612") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("4612"), (stryMutAct_9fa48("4613") ? 24 * 60 / 60 : (stryCov_9fa48("4613"), (stryMutAct_9fa48("4614") ? 24 / 60 : (stryCov_9fa48("4614"), 24 * 60)) * 60)) * 1000);
        return stryMutAct_9fa48("4618") ? entryDate - txDate <= ONE_DAY_MS : stryMutAct_9fa48("4617") ? entryDate - txDate >= ONE_DAY_MS : stryMutAct_9fa48("4616") ? false : stryMutAct_9fa48("4615") ? true : (stryCov_9fa48("4615", "4616", "4617", "4618"), (stryMutAct_9fa48("4619") ? entryDate + txDate : (stryCov_9fa48("4619"), entryDate - txDate)) > ONE_DAY_MS);
      }
    })());

    // Display date - use transactionDate if available, otherwise use entry date
    const displayDate = stryMutAct_9fa48("4622") ? transaction.transactionDate && transaction.date : stryMutAct_9fa48("4621") ? false : stryMutAct_9fa48("4620") ? true : (stryCov_9fa48("4620", "4621", "4622"), transaction.transactionDate || transaction.date);

    // Determine amount color based on transaction type
    const amountColor = (stryMutAct_9fa48("4625") ? transaction.type !== 'income' : stryMutAct_9fa48("4624") ? false : stryMutAct_9fa48("4623") ? true : (stryCov_9fa48("4623", "4624", "4625"), transaction.type === (stryMutAct_9fa48("4626") ? "" : (stryCov_9fa48("4626"), 'income')))) ? stryMutAct_9fa48("4627") ? "" : (stryCov_9fa48("4627"), 'text-finance-600 dark:text-finance-400') : (stryMutAct_9fa48("4630") ? transaction.type !== 'transfer' : stryMutAct_9fa48("4629") ? false : stryMutAct_9fa48("4628") ? true : (stryCov_9fa48("4628", "4629", "4630"), transaction.type === (stryMutAct_9fa48("4631") ? "" : (stryCov_9fa48("4631"), 'transfer')))) ? stryMutAct_9fa48("4632") ? "" : (stryCov_9fa48("4632"), 'text-primary-600 dark:text-primary-400') : stryMutAct_9fa48("4633") ? "" : (stryCov_9fa48("4633"), 'text-slate-900 dark:text-white');
    const amountPrefix = (stryMutAct_9fa48("4636") ? transaction.type !== 'expense' : stryMutAct_9fa48("4635") ? false : stryMutAct_9fa48("4634") ? true : (stryCov_9fa48("4634", "4635", "4636"), transaction.type === (stryMutAct_9fa48("4637") ? "" : (stryCov_9fa48("4637"), 'expense')))) ? stryMutAct_9fa48("4638") ? "" : (stryCov_9fa48("4638"), '-') : (stryMutAct_9fa48("4641") ? transaction.type !== 'income' : stryMutAct_9fa48("4640") ? false : stryMutAct_9fa48("4639") ? true : (stryCov_9fa48("4639", "4640", "4641"), transaction.type === (stryMutAct_9fa48("4642") ? "" : (stryCov_9fa48("4642"), 'income')))) ? stryMutAct_9fa48("4643") ? "" : (stryCov_9fa48("4643"), '+') : stryMutAct_9fa48("4644") ? "Stryker was here!" : (stryCov_9fa48("4644"), '');
    return <Card className="group p-3 sm:p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700">
            {/* Mobile: Horizontal layout with amount on right */}
            <div className="flex items-center gap-3">
                {/* Icon */}
                <CategoryIcon category={transaction.category} className="shrink-0" />

                {/* Title + Meta */}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate leading-tight">
                            {transaction.title}
                        </h4>
                        {/* Amount - centered with title line */}
                        <p className={stryMutAct_9fa48("4645") ? `` : (stryCov_9fa48("4645"), `font-bold text-sm tabular-nums shrink-0 ${amountColor}`)}>
                            {amountPrefix}
                            {formatCurrency(fromCents(stryMutAct_9fa48("4648") ? transaction.amountCents && 0 : stryMutAct_9fa48("4647") ? false : stryMutAct_9fa48("4646") ? true : (stryCov_9fa48("4646", "4647", "4648"), transaction.amountCents || 0)), stryMutAct_9fa48("4651") ? transaction.currency && 'USD' : stryMutAct_9fa48("4650") ? false : stryMutAct_9fa48("4649") ? true : (stryCov_9fa48("4649", "4650", "4651"), transaction.currency || (stryMutAct_9fa48("4652") ? "" : (stryCov_9fa48("4652"), 'USD'))))}
                        </p>
                    </div>

                    {/* Metadata row - badges/pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5 min-w-0">
                        <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
                            {new Date(displayDate).toLocaleDateString(stryMutAct_9fa48("4653") ? "" : (stryCov_9fa48("4653"), 'en-US'), stryMutAct_9fa48("4654") ? {} : (stryCov_9fa48("4654"), {
                month: stryMutAct_9fa48("4655") ? "" : (stryCov_9fa48("4655"), 'short'),
                day: stryMutAct_9fa48("4656") ? "" : (stryCov_9fa48("4656"), 'numeric')
              }))}
                        </span>

                        {/* Category Pill */}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 truncate max-w-[120px]">
                            {transaction.category}
                        </span>

                        {/* Family Member Pill */}
                        {stryMutAct_9fa48("4659") ? transaction.createdBy && currentUserId && transaction.createdBy !== currentUserId || <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 truncate max-w-[100px]">
                                {transaction.createdByName || 'Family'}
                            </span> : stryMutAct_9fa48("4658") ? false : stryMutAct_9fa48("4657") ? true : (stryCov_9fa48("4657", "4658", "4659"), (stryMutAct_9fa48("4661") ? transaction.createdBy && currentUserId || transaction.createdBy !== currentUserId : stryMutAct_9fa48("4660") ? true : (stryCov_9fa48("4660", "4661"), (stryMutAct_9fa48("4663") ? transaction.createdBy || currentUserId : stryMutAct_9fa48("4662") ? true : (stryCov_9fa48("4662", "4663"), transaction.createdBy && currentUserId)) && (stryMutAct_9fa48("4665") ? transaction.createdBy === currentUserId : stryMutAct_9fa48("4664") ? true : (stryCov_9fa48("4664", "4665"), transaction.createdBy !== currentUserId)))) && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 truncate max-w-[100px]">
                                {stryMutAct_9fa48("4668") ? transaction.createdByName && 'Family' : stryMutAct_9fa48("4667") ? false : stryMutAct_9fa48("4666") ? true : (stryCov_9fa48("4666", "4667", "4668"), transaction.createdByName || (stryMutAct_9fa48("4669") ? "" : (stryCov_9fa48("4669"), 'Family')))}
                            </span>)}

                        {/* Backdated Pill */}
                        {stryMutAct_9fa48("4672") ? isBackdated || <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border border-amber-100 dark:border-amber-800/50">
                                Backdated
                            </span> : stryMutAct_9fa48("4671") ? false : stryMutAct_9fa48("4670") ? true : (stryCov_9fa48("4670", "4671", "4672"), isBackdated && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border border-amber-100 dark:border-amber-800/50">
                                Backdated
                            </span>)}
                    </div>
                </div>

                {/* Actions - hidden on mobile (swipe gestures), hover-only on desktop */}
                <div className="hidden sm:flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={stryMutAct_9fa48("4673") ? () => undefined : (stryCov_9fa48("4673"), () => onEdit(transaction))} className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" aria-label="Edit transaction">
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={stryMutAct_9fa48("4674") ? () => undefined : (stryCov_9fa48("4674"), () => onDelete(transaction))} className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" aria-label="Delete transaction">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </Card>;
  }
};