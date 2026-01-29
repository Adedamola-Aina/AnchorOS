/**
 * SpendingTrendsChart - 30-day spending trends visualization
 * 
 * CLAUDE.md Design Philosophy:
 * - Clarity over cleverness: Clear income vs expense comparison
 * - Quiet over loud: Minimal visual noise
 * - Useful over impressive: Actionable insights at a glance
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
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../../utils/format';
import type { Currency } from '../../../types';
interface WeeklyData {
  weekStart: Date;
  income: number;
  expense: number;
  net: number;
}
interface SpendingTrendsChartProps {
  weeklyData: WeeklyData[];
  currency: Currency;
  selectedWeekStart: Date | null;
  onSelectWeek: (weekStart: Date | null) => void;
  maxAmount: number;
}
export const SpendingTrendsChart = ({
  weeklyData,
  currency,
  selectedWeekStart,
  onSelectWeek,
  maxAmount
}: SpendingTrendsChartProps) => {
  if (stryMutAct_9fa48("4503")) {
    {}
  } else {
    stryCov_9fa48("4503");
    // Calculate 30-day totals
    const totals = weeklyData.reduce(stryMutAct_9fa48("4504") ? () => undefined : (stryCov_9fa48("4504"), (acc, d) => stryMutAct_9fa48("4505") ? {} : (stryCov_9fa48("4505"), {
      income: stryMutAct_9fa48("4506") ? acc.income - d.income : (stryCov_9fa48("4506"), acc.income + d.income),
      expense: stryMutAct_9fa48("4507") ? acc.expense - d.expense : (stryCov_9fa48("4507"), acc.expense + d.expense)
    })), stryMutAct_9fa48("4508") ? {} : (stryCov_9fa48("4508"), {
      income: 0,
      expense: 0
    }));
    const net = stryMutAct_9fa48("4509") ? totals.income + totals.expense : (stryCov_9fa48("4509"), totals.income - totals.expense);
    return <div className="glass-card p-5">
            {/* Header with Summary */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    30 Day Summary
                </h3>
                {stryMutAct_9fa48("4512") ? selectedWeekStart || <button onClick={() => onSelectWeek(null)} className="text-[10px] font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400">
                        Clear Filter
                    </button> : stryMutAct_9fa48("4511") ? false : stryMutAct_9fa48("4510") ? true : (stryCov_9fa48("4510", "4511", "4512"), selectedWeekStart && <button onClick={stryMutAct_9fa48("4513") ? () => undefined : (stryCov_9fa48("4513"), () => onSelectWeek(null))} className="text-[10px] font-bold text-primary-500 hover:text-primary-600 dark:text-primary-400">
                        Clear Filter
                    </button>)}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center p-3 rounded-xl bg-finance-50 dark:bg-finance-900/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <ArrowUpRight className="w-3 h-3 text-finance-500" />
                        <span className="text-[9px] font-bold text-finance-600 dark:text-finance-400 uppercase">In</span>
                    </div>
                    <p className="font-bold text-sm text-finance-600 dark:text-finance-400 tabular-nums">
                        {formatCurrency(totals.income, currency)}
                    </p>
                </div>
                <div className="text-center p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <ArrowDownRight className="w-3 h-3 text-rose-500" />
                        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase">Out</span>
                    </div>
                    <p className="font-bold text-sm text-rose-600 dark:text-rose-400 tabular-nums">
                        {formatCurrency(totals.expense, currency)}
                    </p>
                </div>
                <div className={stryMutAct_9fa48("4514") ? `` : (stryCov_9fa48("4514"), `text-center p-3 rounded-xl ${(stryMutAct_9fa48("4518") ? net < 0 : stryMutAct_9fa48("4517") ? net > 0 : stryMutAct_9fa48("4516") ? false : stryMutAct_9fa48("4515") ? true : (stryCov_9fa48("4515", "4516", "4517", "4518"), net >= 0)) ? stryMutAct_9fa48("4519") ? "" : (stryCov_9fa48("4519"), 'bg-blue-50 dark:bg-blue-900/20') : stryMutAct_9fa48("4520") ? "" : (stryCov_9fa48("4520"), 'bg-amber-50 dark:bg-amber-900/20')}`)}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        {(stryMutAct_9fa48("4524") ? net < 0 : stryMutAct_9fa48("4523") ? net > 0 : stryMutAct_9fa48("4522") ? false : stryMutAct_9fa48("4521") ? true : (stryCov_9fa48("4521", "4522", "4523", "4524"), net >= 0)) ? <TrendingUp className="w-3 h-3 text-blue-500" /> : <TrendingDown className="w-3 h-3 text-amber-500" />}
                        <span className={stryMutAct_9fa48("4525") ? `` : (stryCov_9fa48("4525"), `text-[9px] font-bold uppercase ${(stryMutAct_9fa48("4529") ? net < 0 : stryMutAct_9fa48("4528") ? net > 0 : stryMutAct_9fa48("4527") ? false : stryMutAct_9fa48("4526") ? true : (stryCov_9fa48("4526", "4527", "4528", "4529"), net >= 0)) ? stryMutAct_9fa48("4530") ? "" : (stryCov_9fa48("4530"), 'text-blue-600 dark:text-blue-400') : stryMutAct_9fa48("4531") ? "" : (stryCov_9fa48("4531"), 'text-amber-600 dark:text-amber-400')}`)}>Net</span>
                    </div>
                    <p className={stryMutAct_9fa48("4532") ? `` : (stryCov_9fa48("4532"), `font-bold text-sm tabular-nums ${(stryMutAct_9fa48("4536") ? net < 0 : stryMutAct_9fa48("4535") ? net > 0 : stryMutAct_9fa48("4534") ? false : stryMutAct_9fa48("4533") ? true : (stryCov_9fa48("4533", "4534", "4535", "4536"), net >= 0)) ? stryMutAct_9fa48("4537") ? "" : (stryCov_9fa48("4537"), 'text-blue-600 dark:text-blue-400') : stryMutAct_9fa48("4538") ? "" : (stryCov_9fa48("4538"), 'text-amber-600 dark:text-amber-400')}`)}>
                        {(stryMutAct_9fa48("4542") ? net <= 0 : stryMutAct_9fa48("4541") ? net >= 0 : stryMutAct_9fa48("4540") ? false : stryMutAct_9fa48("4539") ? true : (stryCov_9fa48("4539", "4540", "4541", "4542"), net > 0)) ? stryMutAct_9fa48("4543") ? "" : (stryCov_9fa48("4543"), '+') : stryMutAct_9fa48("4544") ? "Stryker was here!" : (stryCov_9fa48("4544"), '')}{formatCurrency(net, currency)}
                    </p>
                </div>
            </div>

            {/* Weekly Chart with clear label */}
            <div className="mt-1">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mb-2 text-center">
                    Week by week breakdown
                </p>
                <div className="h-20 flex items-end gap-1">
                    {weeklyData.map((d, i) => {
            if (stryMutAct_9fa48("4545")) {
              {}
            } else {
              stryCov_9fa48("4545");
              const isSelected = stryMutAct_9fa48("4548") ? selectedWeekStart || d.weekStart.getTime() === selectedWeekStart.getTime() : stryMutAct_9fa48("4547") ? false : stryMutAct_9fa48("4546") ? true : (stryCov_9fa48("4546", "4547", "4548"), selectedWeekStart && (stryMutAct_9fa48("4550") ? d.weekStart.getTime() !== selectedWeekStart.getTime() : stryMutAct_9fa48("4549") ? true : (stryCov_9fa48("4549", "4550"), d.weekStart.getTime() === selectedWeekStart.getTime())));
              const isDimmed = stryMutAct_9fa48("4553") ? selectedWeekStart || !isSelected : stryMutAct_9fa48("4552") ? false : stryMutAct_9fa48("4551") ? true : (stryCov_9fa48("4551", "4552", "4553"), selectedWeekStart && (stryMutAct_9fa48("4554") ? isSelected : (stryCov_9fa48("4554"), !isSelected)));
              const incomeHeight = stryMutAct_9fa48("4555") ? d.income / maxAmount / 100 : (stryCov_9fa48("4555"), (stryMutAct_9fa48("4556") ? d.income * maxAmount : (stryCov_9fa48("4556"), d.income / maxAmount)) * 100);
              const expenseHeight = stryMutAct_9fa48("4557") ? d.expense / maxAmount / 100 : (stryCov_9fa48("4557"), (stryMutAct_9fa48("4558") ? d.expense * maxAmount : (stryCov_9fa48("4558"), d.expense / maxAmount)) * 100);
              const weekNum = stryMutAct_9fa48("4559") ? i - 1 : (stryCov_9fa48("4559"), i + 1);
              const weekEnd = new Date(d.weekStart);
              stryMutAct_9fa48("4560") ? weekEnd.setTime(weekEnd.getDate() + 6) : (stryCov_9fa48("4560"), weekEnd.setDate(stryMutAct_9fa48("4561") ? weekEnd.getDate() - 6 : (stryCov_9fa48("4561"), weekEnd.getDate() + 6)));
              return <button key={i} onClick={stryMutAct_9fa48("4562") ? () => undefined : (stryCov_9fa48("4562"), () => onSelectWeek(isSelected ? null : d.weekStart))} className={stryMutAct_9fa48("4563") ? `` : (stryCov_9fa48("4563"), `flex-1 flex flex-col items-center gap-1 group transition-all ${isDimmed ? stryMutAct_9fa48("4564") ? "" : (stryCov_9fa48("4564"), 'opacity-20') : stryMutAct_9fa48("4565") ? "" : (stryCov_9fa48("4565"), 'opacity-100')}`)} title={stryMutAct_9fa48("4566") ? `` : (stryCov_9fa48("4566"), `${d.weekStart.toLocaleDateString(stryMutAct_9fa48("4567") ? "" : (stryCov_9fa48("4567"), 'en-US'), stryMutAct_9fa48("4568") ? {} : (stryCov_9fa48("4568"), {
                month: stryMutAct_9fa48("4569") ? "" : (stryCov_9fa48("4569"), 'short'),
                day: stryMutAct_9fa48("4570") ? "" : (stryCov_9fa48("4570"), 'numeric')
              }))} - ${weekEnd.toLocaleDateString(stryMutAct_9fa48("4571") ? "" : (stryCov_9fa48("4571"), 'en-US'), stryMutAct_9fa48("4572") ? {} : (stryCov_9fa48("4572"), {
                month: stryMutAct_9fa48("4573") ? "" : (stryCov_9fa48("4573"), 'short'),
                day: stryMutAct_9fa48("4574") ? "" : (stryCov_9fa48("4574"), 'numeric')
              }))}`)}>
                                <div className="w-full flex gap-0.5 items-end h-14">
                                    {/* Income Bar */}
                                    <div className="flex-1 h-full flex items-end">
                                        <div style={stryMutAct_9fa48("4575") ? {} : (stryCov_9fa48("4575"), {
                      height: stryMutAct_9fa48("4576") ? `` : (stryCov_9fa48("4576"), `${stryMutAct_9fa48("4577") ? Math.min(incomeHeight, 4) : (stryCov_9fa48("4577"), Math.max(incomeHeight, 4))}%`)
                    })} className={stryMutAct_9fa48("4578") ? `` : (stryCov_9fa48("4578"), `w-full rounded-t transition-colors ${isSelected ? stryMutAct_9fa48("4579") ? "" : (stryCov_9fa48("4579"), 'bg-finance-400') : stryMutAct_9fa48("4580") ? "" : (stryCov_9fa48("4580"), 'bg-finance-500/70 group-hover:bg-finance-500')}`)} />
                                    </div>
                                    {/* Expense Bar */}
                                    <div className="flex-1 h-full flex items-end">
                                        <div style={stryMutAct_9fa48("4581") ? {} : (stryCov_9fa48("4581"), {
                      height: stryMutAct_9fa48("4582") ? `` : (stryCov_9fa48("4582"), `${stryMutAct_9fa48("4583") ? Math.min(expenseHeight, 4) : (stryCov_9fa48("4583"), Math.max(expenseHeight, 4))}%`)
                    })} className={stryMutAct_9fa48("4584") ? `` : (stryCov_9fa48("4584"), `w-full rounded-t transition-colors ${isSelected ? stryMutAct_9fa48("4585") ? "" : (stryCov_9fa48("4585"), 'bg-rose-400') : stryMutAct_9fa48("4586") ? "" : (stryCov_9fa48("4586"), 'bg-rose-500/70 group-hover:bg-rose-500')}`)} />
                                    </div>
                                </div>
                                <span className={stryMutAct_9fa48("4587") ? `` : (stryCov_9fa48("4587"), `text-[9px] font-bold ${isSelected ? stryMutAct_9fa48("4588") ? "" : (stryCov_9fa48("4588"), 'text-primary-500') : stryMutAct_9fa48("4589") ? "" : (stryCov_9fa48("4589"), 'text-slate-400')}`)}>
                                    W{weekNum}
                                </span>
                            </button>;
            }
          })}
                </div>
            </div>

            {/* Compact Legend */}
            <div className="flex justify-center gap-4 mt-3 text-[9px] font-bold text-slate-400">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-finance-500 rounded-sm" />
                    <span>Income</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-rose-500 rounded-sm" />
                    <span>Expenses</span>
                </div>
            </div>
        </div>;
  }
};