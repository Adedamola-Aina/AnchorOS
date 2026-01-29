/**
 * Finance Insights Utility Module
 * 
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Weekly/recurring analysis extracted to financeInsightsWeekly.ts
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
import type { AnchorTransaction } from '../types';
import { fromCents } from './moneyUtils';

// Re-export from extracted module
export { getWeeklySpending, detectRecurring } from './financeInsightsWeekly';
export type { WeeklySpendingData, RecurringTransactionGroup } from './financeInsightsWeekly';
export interface AssetClass {
  id: string;
  name: string;
  amount: number;
  percent: number;
  currency: string;
  type?: string;
}
export interface CashFlowAnalysis {
  income: number;
  expense: number;
  net: number;
  prevNet: number;
  trend: 'better' | 'worse' | 'neutral';
  diffPercent: number;
}
export interface CheckpointCategory {
  category: string;
  amount: number;
  percent: number;
}
export const getCashFlowAnalysis = (transactions: AnchorTransaction[]): CashFlowAnalysis => {
  if (stryMutAct_9fa48("8865")) {
    {}
  } else {
    stryCov_9fa48("8865");
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    stryMutAct_9fa48("8866") ? sevenDaysAgo.setTime(today.getDate() - 7) : (stryCov_9fa48("8866"), sevenDaysAgo.setDate(stryMutAct_9fa48("8867") ? today.getDate() + 7 : (stryCov_9fa48("8867"), today.getDate() - 7)));
    const fourteenDaysAgo = new Date(today);
    stryMutAct_9fa48("8868") ? fourteenDaysAgo.setTime(today.getDate() - 14) : (stryCov_9fa48("8868"), fourteenDaysAgo.setDate(stryMutAct_9fa48("8869") ? today.getDate() + 14 : (stryCov_9fa48("8869"), today.getDate() - 14)));
    let currentIncome = 0,
      currentExpense = 0,
      prevIncome = 0,
      prevExpense = 0;
    transactions.forEach(t => {
      if (stryMutAct_9fa48("8870")) {
        {}
      } else {
        stryCov_9fa48("8870");
        if (stryMutAct_9fa48("8873") ? (!t || !t.date) && t.isSoftDeleted : stryMutAct_9fa48("8872") ? false : stryMutAct_9fa48("8871") ? true : (stryCov_9fa48("8871", "8872", "8873"), (stryMutAct_9fa48("8875") ? !t && !t.date : stryMutAct_9fa48("8874") ? false : (stryCov_9fa48("8874", "8875"), (stryMutAct_9fa48("8876") ? t : (stryCov_9fa48("8876"), !t)) || (stryMutAct_9fa48("8877") ? t.date : (stryCov_9fa48("8877"), !t.date)))) || t.isSoftDeleted)) return;
        const d = new Date(t.date);
        const amount = fromCents(stryMutAct_9fa48("8880") ? t.amountCents && 0 : stryMutAct_9fa48("8879") ? false : stryMutAct_9fa48("8878") ? true : (stryCov_9fa48("8878", "8879", "8880"), t.amountCents || 0));
        if (stryMutAct_9fa48("8883") ? d >= sevenDaysAgo || d <= today : stryMutAct_9fa48("8882") ? false : stryMutAct_9fa48("8881") ? true : (stryCov_9fa48("8881", "8882", "8883"), (stryMutAct_9fa48("8886") ? d < sevenDaysAgo : stryMutAct_9fa48("8885") ? d > sevenDaysAgo : stryMutAct_9fa48("8884") ? true : (stryCov_9fa48("8884", "8885", "8886"), d >= sevenDaysAgo)) && (stryMutAct_9fa48("8889") ? d > today : stryMutAct_9fa48("8888") ? d < today : stryMutAct_9fa48("8887") ? true : (stryCov_9fa48("8887", "8888", "8889"), d <= today)))) {
          if (stryMutAct_9fa48("8890")) {
            {}
          } else {
            stryCov_9fa48("8890");
            if (stryMutAct_9fa48("8893") ? t.type !== 'income' : stryMutAct_9fa48("8892") ? false : stryMutAct_9fa48("8891") ? true : (stryCov_9fa48("8891", "8892", "8893"), t.type === (stryMutAct_9fa48("8894") ? "" : (stryCov_9fa48("8894"), 'income')))) stryMutAct_9fa48("8895") ? currentIncome -= amount : (stryCov_9fa48("8895"), currentIncome += amount);
            if (stryMutAct_9fa48("8898") ? t.type !== 'expense' : stryMutAct_9fa48("8897") ? false : stryMutAct_9fa48("8896") ? true : (stryCov_9fa48("8896", "8897", "8898"), t.type === (stryMutAct_9fa48("8899") ? "" : (stryCov_9fa48("8899"), 'expense')))) stryMutAct_9fa48("8900") ? currentExpense -= amount : (stryCov_9fa48("8900"), currentExpense += amount);
          }
        } else if (stryMutAct_9fa48("8903") ? d >= fourteenDaysAgo || d < sevenDaysAgo : stryMutAct_9fa48("8902") ? false : stryMutAct_9fa48("8901") ? true : (stryCov_9fa48("8901", "8902", "8903"), (stryMutAct_9fa48("8906") ? d < fourteenDaysAgo : stryMutAct_9fa48("8905") ? d > fourteenDaysAgo : stryMutAct_9fa48("8904") ? true : (stryCov_9fa48("8904", "8905", "8906"), d >= fourteenDaysAgo)) && (stryMutAct_9fa48("8909") ? d >= sevenDaysAgo : stryMutAct_9fa48("8908") ? d <= sevenDaysAgo : stryMutAct_9fa48("8907") ? true : (stryCov_9fa48("8907", "8908", "8909"), d < sevenDaysAgo)))) {
          if (stryMutAct_9fa48("8910")) {
            {}
          } else {
            stryCov_9fa48("8910");
            if (stryMutAct_9fa48("8913") ? t.type !== 'income' : stryMutAct_9fa48("8912") ? false : stryMutAct_9fa48("8911") ? true : (stryCov_9fa48("8911", "8912", "8913"), t.type === (stryMutAct_9fa48("8914") ? "" : (stryCov_9fa48("8914"), 'income')))) stryMutAct_9fa48("8915") ? prevIncome -= amount : (stryCov_9fa48("8915"), prevIncome += amount);
            if (stryMutAct_9fa48("8918") ? t.type !== 'expense' : stryMutAct_9fa48("8917") ? false : stryMutAct_9fa48("8916") ? true : (stryCov_9fa48("8916", "8917", "8918"), t.type === (stryMutAct_9fa48("8919") ? "" : (stryCov_9fa48("8919"), 'expense')))) stryMutAct_9fa48("8920") ? prevExpense -= amount : (stryCov_9fa48("8920"), prevExpense += amount);
          }
        }
      }
    });
    const currentNet = stryMutAct_9fa48("8921") ? currentIncome + currentExpense : (stryCov_9fa48("8921"), currentIncome - currentExpense);
    const prevNet = stryMutAct_9fa48("8922") ? prevIncome + prevExpense : (stryCov_9fa48("8922"), prevIncome - prevExpense);
    let trend: 'better' | 'worse' | 'neutral' = stryMutAct_9fa48("8923") ? "" : (stryCov_9fa48("8923"), 'neutral');
    if (stryMutAct_9fa48("8927") ? currentNet <= prevNet : stryMutAct_9fa48("8926") ? currentNet >= prevNet : stryMutAct_9fa48("8925") ? false : stryMutAct_9fa48("8924") ? true : (stryCov_9fa48("8924", "8925", "8926", "8927"), currentNet > prevNet)) trend = stryMutAct_9fa48("8928") ? "" : (stryCov_9fa48("8928"), 'better');else if (stryMutAct_9fa48("8932") ? currentNet >= prevNet : stryMutAct_9fa48("8931") ? currentNet <= prevNet : stryMutAct_9fa48("8930") ? false : stryMutAct_9fa48("8929") ? true : (stryCov_9fa48("8929", "8930", "8931", "8932"), currentNet < prevNet)) trend = stryMutAct_9fa48("8933") ? "" : (stryCov_9fa48("8933"), 'worse');
    const diffPercent = (stryMutAct_9fa48("8936") ? prevNet === 0 : stryMutAct_9fa48("8935") ? false : stryMutAct_9fa48("8934") ? true : (stryCov_9fa48("8934", "8935", "8936"), prevNet !== 0)) ? stryMutAct_9fa48("8937") ? (currentNet - prevNet) / Math.abs(prevNet) / 100 : (stryCov_9fa48("8937"), (stryMutAct_9fa48("8938") ? (currentNet - prevNet) * Math.abs(prevNet) : (stryCov_9fa48("8938"), (stryMutAct_9fa48("8939") ? currentNet + prevNet : (stryCov_9fa48("8939"), currentNet - prevNet)) / Math.abs(prevNet))) * 100) : 0;
    return stryMutAct_9fa48("8940") ? {} : (stryCov_9fa48("8940"), {
      income: currentIncome,
      expense: currentExpense,
      net: currentNet,
      prevNet,
      trend,
      diffPercent
    });
  }
};
export const getAssetDistribution = (accounts: import('../types').AnchorAccount[]): AssetClass[] => {
  if (stryMutAct_9fa48("8941")) {
    {}
  } else {
    stryCov_9fa48("8941");
    const total = accounts.reduce(stryMutAct_9fa48("8942") ? () => undefined : (stryCov_9fa48("8942"), (sum, a) => stryMutAct_9fa48("8943") ? sum - fromCents(a.balanceCents) : (stryCov_9fa48("8943"), sum + fromCents(a.balanceCents))), 0);
    if (stryMutAct_9fa48("8946") ? total !== 0 : stryMutAct_9fa48("8945") ? false : stryMutAct_9fa48("8944") ? true : (stryCov_9fa48("8944", "8945", "8946"), total === 0)) return stryMutAct_9fa48("8947") ? ["Stryker was here"] : (stryCov_9fa48("8947"), []);
    return stryMutAct_9fa48("8948") ? accounts.map(a => ({
      id: a.id,
      name: a.name,
      amount: fromCents(a.balanceCents),
      percent: fromCents(a.balanceCents) / total * 100,
      currency: a.currency,
      type: a.type
    })) : (stryCov_9fa48("8948"), accounts.map(stryMutAct_9fa48("8949") ? () => undefined : (stryCov_9fa48("8949"), a => stryMutAct_9fa48("8950") ? {} : (stryCov_9fa48("8950"), {
      id: a.id,
      name: a.name,
      amount: fromCents(a.balanceCents),
      percent: stryMutAct_9fa48("8951") ? fromCents(a.balanceCents) / total / 100 : (stryCov_9fa48("8951"), (stryMutAct_9fa48("8952") ? fromCents(a.balanceCents) * total : (stryCov_9fa48("8952"), fromCents(a.balanceCents) / total)) * 100),
      currency: a.currency,
      type: a.type
    }))).sort(stryMutAct_9fa48("8953") ? () => undefined : (stryCov_9fa48("8953"), (a, b) => stryMutAct_9fa48("8954") ? b.amount + a.amount : (stryCov_9fa48("8954"), b.amount - a.amount))));
  }
};
export const getExpenseCategoryBreakdown = (transactions: AnchorTransaction[]): CheckpointCategory[] => {
  if (stryMutAct_9fa48("8955")) {
    {}
  } else {
    stryCov_9fa48("8955");
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    stryMutAct_9fa48("8956") ? thirtyDaysAgo.setTime(today.getDate() - 30) : (stryCov_9fa48("8956"), thirtyDaysAgo.setDate(stryMutAct_9fa48("8957") ? today.getDate() + 30 : (stryCov_9fa48("8957"), today.getDate() - 30)));
    const categoryMap: Record<string, number> = {};
    let totalExpense = 0;
    transactions.forEach(t => {
      if (stryMutAct_9fa48("8958")) {
        {}
      } else {
        stryCov_9fa48("8958");
        if (stryMutAct_9fa48("8961") ? (!t || !t.date || t.isSoftDeleted) && t.type !== 'expense' : stryMutAct_9fa48("8960") ? false : stryMutAct_9fa48("8959") ? true : (stryCov_9fa48("8959", "8960", "8961"), (stryMutAct_9fa48("8963") ? (!t || !t.date) && t.isSoftDeleted : stryMutAct_9fa48("8962") ? false : (stryCov_9fa48("8962", "8963"), (stryMutAct_9fa48("8965") ? !t && !t.date : stryMutAct_9fa48("8964") ? false : (stryCov_9fa48("8964", "8965"), (stryMutAct_9fa48("8966") ? t : (stryCov_9fa48("8966"), !t)) || (stryMutAct_9fa48("8967") ? t.date : (stryCov_9fa48("8967"), !t.date)))) || t.isSoftDeleted)) || (stryMutAct_9fa48("8969") ? t.type === 'expense' : stryMutAct_9fa48("8968") ? false : (stryCov_9fa48("8968", "8969"), t.type !== (stryMutAct_9fa48("8970") ? "" : (stryCov_9fa48("8970"), 'expense')))))) return;
        const d = new Date(t.date);
        if (stryMutAct_9fa48("8973") ? d >= thirtyDaysAgo || d <= today : stryMutAct_9fa48("8972") ? false : stryMutAct_9fa48("8971") ? true : (stryCov_9fa48("8971", "8972", "8973"), (stryMutAct_9fa48("8976") ? d < thirtyDaysAgo : stryMutAct_9fa48("8975") ? d > thirtyDaysAgo : stryMutAct_9fa48("8974") ? true : (stryCov_9fa48("8974", "8975", "8976"), d >= thirtyDaysAgo)) && (stryMutAct_9fa48("8979") ? d > today : stryMutAct_9fa48("8978") ? d < today : stryMutAct_9fa48("8977") ? true : (stryCov_9fa48("8977", "8978", "8979"), d <= today)))) {
          if (stryMutAct_9fa48("8980")) {
            {}
          } else {
            stryCov_9fa48("8980");
            const amount = fromCents(stryMutAct_9fa48("8983") ? t.amountCents && 0 : stryMutAct_9fa48("8982") ? false : stryMutAct_9fa48("8981") ? true : (stryCov_9fa48("8981", "8982", "8983"), t.amountCents || 0));
            const cat = stryMutAct_9fa48("8986") ? t.category && 'Uncategorized' : stryMutAct_9fa48("8985") ? false : stryMutAct_9fa48("8984") ? true : (stryCov_9fa48("8984", "8985", "8986"), t.category || (stryMutAct_9fa48("8987") ? "" : (stryCov_9fa48("8987"), 'Uncategorized')));
            categoryMap[cat] = stryMutAct_9fa48("8988") ? (categoryMap[cat] || 0) - amount : (stryCov_9fa48("8988"), (stryMutAct_9fa48("8991") ? categoryMap[cat] && 0 : stryMutAct_9fa48("8990") ? false : stryMutAct_9fa48("8989") ? true : (stryCov_9fa48("8989", "8990", "8991"), categoryMap[cat] || 0)) + amount);
            stryMutAct_9fa48("8992") ? totalExpense -= amount : (stryCov_9fa48("8992"), totalExpense += amount);
          }
        }
      }
    });
    if (stryMutAct_9fa48("8995") ? totalExpense !== 0 : stryMutAct_9fa48("8994") ? false : stryMutAct_9fa48("8993") ? true : (stryCov_9fa48("8993", "8994", "8995"), totalExpense === 0)) return stryMutAct_9fa48("8996") ? ["Stryker was here"] : (stryCov_9fa48("8996"), []);
    return stryMutAct_9fa48("8998") ? Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percent: amount / totalExpense * 100
    })).slice(0, 5) : stryMutAct_9fa48("8997") ? Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percent: amount / totalExpense * 100
    })).sort((a, b) => b.amount - a.amount) : (stryCov_9fa48("8997", "8998"), Object.entries(categoryMap).map(stryMutAct_9fa48("8999") ? () => undefined : (stryCov_9fa48("8999"), ([category, amount]) => stryMutAct_9fa48("9000") ? {} : (stryCov_9fa48("9000"), {
      category,
      amount,
      percent: stryMutAct_9fa48("9001") ? amount / totalExpense / 100 : (stryCov_9fa48("9001"), (stryMutAct_9fa48("9002") ? amount * totalExpense : (stryCov_9fa48("9002"), amount / totalExpense)) * 100)
    }))).sort(stryMutAct_9fa48("9003") ? () => undefined : (stryCov_9fa48("9003"), (a, b) => stryMutAct_9fa48("9004") ? b.amount + a.amount : (stryCov_9fa48("9004"), b.amount - a.amount))).slice(0, 5));
  }
};