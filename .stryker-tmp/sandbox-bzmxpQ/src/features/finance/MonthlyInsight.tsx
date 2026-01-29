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
import React, { useMemo } from 'react';
import { TrendingDown, TrendingUp, Target, PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import type { AnchorTransaction, Currency } from '../../types';
interface MonthlyInsightProps {
  transactions: AnchorTransaction[];
  currency: Currency;
}
export const MonthlyInsight: React.FC<MonthlyInsightProps> = ({
  transactions,
  currency
}) => {
  if (stryMutAct_9fa48("3827")) {
    {}
  } else {
    stryCov_9fa48("3827");
    const summary = useMemo(() => {
      if (stryMutAct_9fa48("3828")) {
        {}
      } else {
        stryCov_9fa48("3828");
        let income = 0;
        let expense = 0;
        const categories: Record<string, number> = {};
        transactions.forEach(tx => {
          if (stryMutAct_9fa48("3829")) {
            {}
          } else {
            stryCov_9fa48("3829");
            if (stryMutAct_9fa48("3832") ? !tx && tx.isSoftDeleted : stryMutAct_9fa48("3831") ? false : stryMutAct_9fa48("3830") ? true : (stryCov_9fa48("3830", "3831", "3832"), (stryMutAct_9fa48("3833") ? tx : (stryCov_9fa48("3833"), !tx)) || tx.isSoftDeleted)) return;
            const amount = stryMutAct_9fa48("3836") ? tx.amountCents && 0 : stryMutAct_9fa48("3835") ? false : stryMutAct_9fa48("3834") ? true : (stryCov_9fa48("3834", "3835", "3836"), tx.amountCents || 0);
            if (stryMutAct_9fa48("3839") ? tx.type !== 'income' : stryMutAct_9fa48("3838") ? false : stryMutAct_9fa48("3837") ? true : (stryCov_9fa48("3837", "3838", "3839"), tx.type === (stryMutAct_9fa48("3840") ? "" : (stryCov_9fa48("3840"), 'income')))) {
              if (stryMutAct_9fa48("3841")) {
                {}
              } else {
                stryCov_9fa48("3841");
                stryMutAct_9fa48("3842") ? income -= amount : (stryCov_9fa48("3842"), income += amount);
              }
            } else if (stryMutAct_9fa48("3845") ? tx.type !== 'expense' : stryMutAct_9fa48("3844") ? false : stryMutAct_9fa48("3843") ? true : (stryCov_9fa48("3843", "3844", "3845"), tx.type === (stryMutAct_9fa48("3846") ? "" : (stryCov_9fa48("3846"), 'expense')))) {
              if (stryMutAct_9fa48("3847")) {
                {}
              } else {
                stryCov_9fa48("3847");
                stryMutAct_9fa48("3848") ? expense -= amount : (stryCov_9fa48("3848"), expense += amount);
                const cat = stryMutAct_9fa48("3851") ? tx.category && 'Other' : stryMutAct_9fa48("3850") ? false : stryMutAct_9fa48("3849") ? true : (stryCov_9fa48("3849", "3850", "3851"), tx.category || (stryMutAct_9fa48("3852") ? "" : (stryCov_9fa48("3852"), 'Other')));
                categories[cat] = stryMutAct_9fa48("3853") ? (categories[cat] || 0) - amount : (stryCov_9fa48("3853"), (stryMutAct_9fa48("3856") ? categories[cat] && 0 : stryMutAct_9fa48("3855") ? false : stryMutAct_9fa48("3854") ? true : (stryCov_9fa48("3854", "3855", "3856"), categories[cat] || 0)) + amount);
              }
            }
          }
        });
        const topCategory = stryMutAct_9fa48("3857") ? Object.entries(categories)[0] : (stryCov_9fa48("3857"), Object.entries(categories).sort(stryMutAct_9fa48("3858") ? () => undefined : (stryCov_9fa48("3858"), (a, b) => stryMutAct_9fa48("3859") ? b[1] + a[1] : (stryCov_9fa48("3859"), b[1] - a[1])))[0]);
        const savings = stryMutAct_9fa48("3860") ? income + expense : (stryCov_9fa48("3860"), income - expense);
        return stryMutAct_9fa48("3861") ? {} : (stryCov_9fa48("3861"), {
          income,
          expense,
          topCategory: topCategory ? stryMutAct_9fa48("3862") ? {} : (stryCov_9fa48("3862"), {
            name: topCategory[0],
            amount: topCategory[1]
          }) : null,
          savings
        });
      }
    }, stryMutAct_9fa48("3863") ? [] : (stryCov_9fa48("3863"), [transactions]));
    if (stryMutAct_9fa48("3866") ? transactions.length !== 0 : stryMutAct_9fa48("3865") ? false : stryMutAct_9fa48("3864") ? true : (stryCov_9fa48("3864", "3865", "3866"), transactions.length === 0)) return null;
    const isOverspending = stryMutAct_9fa48("3870") ? summary.savings >= 0 : stryMutAct_9fa48("3869") ? summary.savings <= 0 : stryMutAct_9fa48("3868") ? false : stryMutAct_9fa48("3867") ? true : (stryCov_9fa48("3867", "3868", "3869", "3870"), summary.savings < 0);
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Income</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(fromCents(summary.income), currency)}
                    </p>
                </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4">
                <div className="p-3 bg-rose-100 dark:bg-rose-900/20 rounded-2xl text-rose-600">
                    <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Spent</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrency(fromCents(summary.expense), currency)}
                    </p>
                </div>
            </div>

            <div className="glass-card p-4 flex items-center gap-4">
                <div className={stryMutAct_9fa48("3871") ? `` : (stryCov_9fa48("3871"), `p-3 rounded-2xl ${isOverspending ? stryMutAct_9fa48("3872") ? "" : (stryCov_9fa48("3872"), 'bg-rose-100 dark:bg-rose-900/20 text-rose-600') : stryMutAct_9fa48("3873") ? "" : (stryCov_9fa48("3873"), 'bg-blue-100 dark:bg-blue-900/20 text-blue-600')}`)}>
                    {isOverspending ? <TrendingDown className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                        {isOverspending ? stryMutAct_9fa48("3874") ? "" : (stryCov_9fa48("3874"), 'Overspending') : stryMutAct_9fa48("3875") ? "" : (stryCov_9fa48("3875"), 'Potential Savings')}
                    </p>
                    <p className={stryMutAct_9fa48("3876") ? `` : (stryCov_9fa48("3876"), `text-lg font-bold ${isOverspending ? stryMutAct_9fa48("3877") ? "" : (stryCov_9fa48("3877"), 'text-rose-600 dark:text-rose-400') : stryMutAct_9fa48("3878") ? "" : (stryCov_9fa48("3878"), 'text-slate-900 dark:text-white')}`)}>
                        {formatCurrency(fromCents(Math.abs(summary.savings)), currency)}
                    </p>
                </div>
            </div>

            {stryMutAct_9fa48("3881") ? summary.topCategory || <div className="glass-card p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-2xl text-primary-600">
                        <PieChart className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Top: {summary.topCategory.name}</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                            {formatCurrency(fromCents(summary.topCategory.amount), currency)}
                        </p>
                    </div>
                </div> : stryMutAct_9fa48("3880") ? false : stryMutAct_9fa48("3879") ? true : (stryCov_9fa48("3879", "3880", "3881"), summary.topCategory && <div className="glass-card p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-2xl text-primary-600">
                        <PieChart className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Top: {summary.topCategory.name}</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
                            {formatCurrency(fromCents(summary.topCategory.amount), currency)}
                        </p>
                    </div>
                </div>)}
        </div>;
  }
};