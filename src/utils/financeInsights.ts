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
  if (stryMutAct_9fa48("1219")) {
    {}
  } else {
    stryCov_9fa48("1219");
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    stryMutAct_9fa48("1220") ? sevenDaysAgo.setTime(today.getDate() - 7) : (stryCov_9fa48("1220"), sevenDaysAgo.setDate(stryMutAct_9fa48("1221") ? today.getDate() + 7 : (stryCov_9fa48("1221"), today.getDate() - 7)));
    const fourteenDaysAgo = new Date(today);
    stryMutAct_9fa48("1222") ? fourteenDaysAgo.setTime(today.getDate() - 14) : (stryCov_9fa48("1222"), fourteenDaysAgo.setDate(stryMutAct_9fa48("1223") ? today.getDate() + 14 : (stryCov_9fa48("1223"), today.getDate() - 14)));
    let currentIncome = 0,
      currentExpense = 0,
      prevIncome = 0,
      prevExpense = 0;
    transactions.forEach(t => {
      if (stryMutAct_9fa48("1224")) {
        {}
      } else {
        stryCov_9fa48("1224");
        if (stryMutAct_9fa48("1227") ? (!t || !t.date) && t.isSoftDeleted : stryMutAct_9fa48("1226") ? false : stryMutAct_9fa48("1225") ? true : (stryCov_9fa48("1225", "1226", "1227"), (stryMutAct_9fa48("1229") ? !t && !t.date : stryMutAct_9fa48("1228") ? false : (stryCov_9fa48("1228", "1229"), (stryMutAct_9fa48("1230") ? t : (stryCov_9fa48("1230"), !t)) || (stryMutAct_9fa48("1231") ? t.date : (stryCov_9fa48("1231"), !t.date)))) || t.isSoftDeleted)) return;
        const d = new Date(t.date);
        const amount = fromCents(stryMutAct_9fa48("1234") ? t.amountCents && 0 : stryMutAct_9fa48("1233") ? false : stryMutAct_9fa48("1232") ? true : (stryCov_9fa48("1232", "1233", "1234"), t.amountCents || 0));
        if (stryMutAct_9fa48("1237") ? d >= sevenDaysAgo || d <= today : stryMutAct_9fa48("1236") ? false : stryMutAct_9fa48("1235") ? true : (stryCov_9fa48("1235", "1236", "1237"), (stryMutAct_9fa48("1240") ? d < sevenDaysAgo : stryMutAct_9fa48("1239") ? d > sevenDaysAgo : stryMutAct_9fa48("1238") ? true : (stryCov_9fa48("1238", "1239", "1240"), d >= sevenDaysAgo)) && (stryMutAct_9fa48("1243") ? d > today : stryMutAct_9fa48("1242") ? d < today : stryMutAct_9fa48("1241") ? true : (stryCov_9fa48("1241", "1242", "1243"), d <= today)))) {
          if (stryMutAct_9fa48("1244")) {
            {}
          } else {
            stryCov_9fa48("1244");
            if (stryMutAct_9fa48("1247") ? t.type !== 'income' : stryMutAct_9fa48("1246") ? false : stryMutAct_9fa48("1245") ? true : (stryCov_9fa48("1245", "1246", "1247"), t.type === (stryMutAct_9fa48("1248") ? "" : (stryCov_9fa48("1248"), 'income')))) stryMutAct_9fa48("1249") ? currentIncome -= amount : (stryCov_9fa48("1249"), currentIncome += amount);
            if (stryMutAct_9fa48("1252") ? t.type !== 'expense' : stryMutAct_9fa48("1251") ? false : stryMutAct_9fa48("1250") ? true : (stryCov_9fa48("1250", "1251", "1252"), t.type === (stryMutAct_9fa48("1253") ? "" : (stryCov_9fa48("1253"), 'expense')))) stryMutAct_9fa48("1254") ? currentExpense -= amount : (stryCov_9fa48("1254"), currentExpense += amount);
          }
        } else if (stryMutAct_9fa48("1257") ? d >= fourteenDaysAgo || d < sevenDaysAgo : stryMutAct_9fa48("1256") ? false : stryMutAct_9fa48("1255") ? true : (stryCov_9fa48("1255", "1256", "1257"), (stryMutAct_9fa48("1260") ? d < fourteenDaysAgo : stryMutAct_9fa48("1259") ? d > fourteenDaysAgo : stryMutAct_9fa48("1258") ? true : (stryCov_9fa48("1258", "1259", "1260"), d >= fourteenDaysAgo)) && (stryMutAct_9fa48("1263") ? d >= sevenDaysAgo : stryMutAct_9fa48("1262") ? d <= sevenDaysAgo : stryMutAct_9fa48("1261") ? true : (stryCov_9fa48("1261", "1262", "1263"), d < sevenDaysAgo)))) {
          if (stryMutAct_9fa48("1264")) {
            {}
          } else {
            stryCov_9fa48("1264");
            if (stryMutAct_9fa48("1267") ? t.type !== 'income' : stryMutAct_9fa48("1266") ? false : stryMutAct_9fa48("1265") ? true : (stryCov_9fa48("1265", "1266", "1267"), t.type === (stryMutAct_9fa48("1268") ? "" : (stryCov_9fa48("1268"), 'income')))) stryMutAct_9fa48("1269") ? prevIncome -= amount : (stryCov_9fa48("1269"), prevIncome += amount);
            if (stryMutAct_9fa48("1272") ? t.type !== 'expense' : stryMutAct_9fa48("1271") ? false : stryMutAct_9fa48("1270") ? true : (stryCov_9fa48("1270", "1271", "1272"), t.type === (stryMutAct_9fa48("1273") ? "" : (stryCov_9fa48("1273"), 'expense')))) stryMutAct_9fa48("1274") ? prevExpense -= amount : (stryCov_9fa48("1274"), prevExpense += amount);
          }
        }
      }
    });
    const currentNet = stryMutAct_9fa48("1275") ? currentIncome + currentExpense : (stryCov_9fa48("1275"), currentIncome - currentExpense);
    const prevNet = stryMutAct_9fa48("1276") ? prevIncome + prevExpense : (stryCov_9fa48("1276"), prevIncome - prevExpense);
    let trend: 'better' | 'worse' | 'neutral' = stryMutAct_9fa48("1277") ? "" : (stryCov_9fa48("1277"), 'neutral');
    if (stryMutAct_9fa48("1281") ? currentNet <= prevNet : stryMutAct_9fa48("1280") ? currentNet >= prevNet : stryMutAct_9fa48("1279") ? false : stryMutAct_9fa48("1278") ? true : (stryCov_9fa48("1278", "1279", "1280", "1281"), currentNet > prevNet)) trend = stryMutAct_9fa48("1282") ? "" : (stryCov_9fa48("1282"), 'better');else if (stryMutAct_9fa48("1286") ? currentNet >= prevNet : stryMutAct_9fa48("1285") ? currentNet <= prevNet : stryMutAct_9fa48("1284") ? false : stryMutAct_9fa48("1283") ? true : (stryCov_9fa48("1283", "1284", "1285", "1286"), currentNet < prevNet)) trend = stryMutAct_9fa48("1287") ? "" : (stryCov_9fa48("1287"), 'worse');
    const diffPercent = (stryMutAct_9fa48("1290") ? prevNet === 0 : stryMutAct_9fa48("1289") ? false : stryMutAct_9fa48("1288") ? true : (stryCov_9fa48("1288", "1289", "1290"), prevNet !== 0)) ? stryMutAct_9fa48("1291") ? (currentNet - prevNet) / Math.abs(prevNet) / 100 : (stryCov_9fa48("1291"), (stryMutAct_9fa48("1292") ? (currentNet - prevNet) * Math.abs(prevNet) : (stryCov_9fa48("1292"), (stryMutAct_9fa48("1293") ? currentNet + prevNet : (stryCov_9fa48("1293"), currentNet - prevNet)) / Math.abs(prevNet))) * 100) : 0;
    return stryMutAct_9fa48("1294") ? {} : (stryCov_9fa48("1294"), {
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
  if (stryMutAct_9fa48("1295")) {
    {}
  } else {
    stryCov_9fa48("1295");
    const active = stryMutAct_9fa48("1296") ? accounts : (stryCov_9fa48("1296"), accounts.filter(stryMutAct_9fa48("1297") ? () => undefined : (stryCov_9fa48("1297"), a => stryMutAct_9fa48("1298") ? a.isArchived : (stryCov_9fa48("1298"), !a.isArchived))));
    const total = active.reduce(stryMutAct_9fa48("1299") ? () => undefined : (stryCov_9fa48("1299"), (sum, a) => stryMutAct_9fa48("1300") ? sum - fromCents(a.balanceCents) : (stryCov_9fa48("1300"), sum + fromCents(a.balanceCents))), 0);
    if (stryMutAct_9fa48("1303") ? total !== 0 : stryMutAct_9fa48("1302") ? false : stryMutAct_9fa48("1301") ? true : (stryCov_9fa48("1301", "1302", "1303"), total === 0)) return stryMutAct_9fa48("1304") ? ["Stryker was here"] : (stryCov_9fa48("1304"), []);
    return stryMutAct_9fa48("1305") ? active.map(a => ({
      id: a.id,
      name: a.name,
      amount: fromCents(a.balanceCents),
      percent: fromCents(a.balanceCents) / total * 100,
      currency: a.currency,
      type: a.type
    })) : (stryCov_9fa48("1305"), active.map(stryMutAct_9fa48("1306") ? () => undefined : (stryCov_9fa48("1306"), a => stryMutAct_9fa48("1307") ? {} : (stryCov_9fa48("1307"), {
      id: a.id,
      name: a.name,
      amount: fromCents(a.balanceCents),
      percent: stryMutAct_9fa48("1308") ? fromCents(a.balanceCents) / total / 100 : (stryCov_9fa48("1308"), (stryMutAct_9fa48("1309") ? fromCents(a.balanceCents) * total : (stryCov_9fa48("1309"), fromCents(a.balanceCents) / total)) * 100),
      currency: a.currency,
      type: a.type
    }))).sort(stryMutAct_9fa48("1310") ? () => undefined : (stryCov_9fa48("1310"), (a, b) => stryMutAct_9fa48("1311") ? b.amount + a.amount : (stryCov_9fa48("1311"), b.amount - a.amount))));
  }
};
export const getExpenseCategoryBreakdown = (transactions: AnchorTransaction[]): CheckpointCategory[] => {
  if (stryMutAct_9fa48("1312")) {
    {}
  } else {
    stryCov_9fa48("1312");
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    stryMutAct_9fa48("1313") ? thirtyDaysAgo.setTime(today.getDate() - 30) : (stryCov_9fa48("1313"), thirtyDaysAgo.setDate(stryMutAct_9fa48("1314") ? today.getDate() + 30 : (stryCov_9fa48("1314"), today.getDate() - 30)));
    const categoryMap: Record<string, number> = {};
    let totalExpense = 0;
    transactions.forEach(t => {
      if (stryMutAct_9fa48("1315")) {
        {}
      } else {
        stryCov_9fa48("1315");
        if (stryMutAct_9fa48("1318") ? (!t || !t.date || t.isSoftDeleted) && t.type !== 'expense' : stryMutAct_9fa48("1317") ? false : stryMutAct_9fa48("1316") ? true : (stryCov_9fa48("1316", "1317", "1318"), (stryMutAct_9fa48("1320") ? (!t || !t.date) && t.isSoftDeleted : stryMutAct_9fa48("1319") ? false : (stryCov_9fa48("1319", "1320"), (stryMutAct_9fa48("1322") ? !t && !t.date : stryMutAct_9fa48("1321") ? false : (stryCov_9fa48("1321", "1322"), (stryMutAct_9fa48("1323") ? t : (stryCov_9fa48("1323"), !t)) || (stryMutAct_9fa48("1324") ? t.date : (stryCov_9fa48("1324"), !t.date)))) || t.isSoftDeleted)) || (stryMutAct_9fa48("1326") ? t.type === 'expense' : stryMutAct_9fa48("1325") ? false : (stryCov_9fa48("1325", "1326"), t.type !== (stryMutAct_9fa48("1327") ? "" : (stryCov_9fa48("1327"), 'expense')))))) return;
        const d = new Date(t.date);
        if (stryMutAct_9fa48("1330") ? d >= thirtyDaysAgo || d <= today : stryMutAct_9fa48("1329") ? false : stryMutAct_9fa48("1328") ? true : (stryCov_9fa48("1328", "1329", "1330"), (stryMutAct_9fa48("1333") ? d < thirtyDaysAgo : stryMutAct_9fa48("1332") ? d > thirtyDaysAgo : stryMutAct_9fa48("1331") ? true : (stryCov_9fa48("1331", "1332", "1333"), d >= thirtyDaysAgo)) && (stryMutAct_9fa48("1336") ? d > today : stryMutAct_9fa48("1335") ? d < today : stryMutAct_9fa48("1334") ? true : (stryCov_9fa48("1334", "1335", "1336"), d <= today)))) {
          if (stryMutAct_9fa48("1337")) {
            {}
          } else {
            stryCov_9fa48("1337");
            const amount = fromCents(stryMutAct_9fa48("1340") ? t.amountCents && 0 : stryMutAct_9fa48("1339") ? false : stryMutAct_9fa48("1338") ? true : (stryCov_9fa48("1338", "1339", "1340"), t.amountCents || 0));
            const cat = stryMutAct_9fa48("1343") ? t.category && 'Uncategorized' : stryMutAct_9fa48("1342") ? false : stryMutAct_9fa48("1341") ? true : (stryCov_9fa48("1341", "1342", "1343"), t.category || (stryMutAct_9fa48("1344") ? "" : (stryCov_9fa48("1344"), 'Uncategorized')));
            categoryMap[cat] = stryMutAct_9fa48("1345") ? (categoryMap[cat] || 0) - amount : (stryCov_9fa48("1345"), (stryMutAct_9fa48("1348") ? categoryMap[cat] && 0 : stryMutAct_9fa48("1347") ? false : stryMutAct_9fa48("1346") ? true : (stryCov_9fa48("1346", "1347", "1348"), categoryMap[cat] || 0)) + amount);
            stryMutAct_9fa48("1349") ? totalExpense -= amount : (stryCov_9fa48("1349"), totalExpense += amount);
          }
        }
      }
    });
    if (stryMutAct_9fa48("1352") ? totalExpense !== 0 : stryMutAct_9fa48("1351") ? false : stryMutAct_9fa48("1350") ? true : (stryCov_9fa48("1350", "1351", "1352"), totalExpense === 0)) return stryMutAct_9fa48("1353") ? ["Stryker was here"] : (stryCov_9fa48("1353"), []);
    return stryMutAct_9fa48("1355") ? Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percent: amount / totalExpense * 100
    })).slice(0, 5) : stryMutAct_9fa48("1354") ? Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percent: amount / totalExpense * 100
    })).sort((a, b) => b.amount - a.amount) : (stryCov_9fa48("1354", "1355"), Object.entries(categoryMap).map(stryMutAct_9fa48("1356") ? () => undefined : (stryCov_9fa48("1356"), ([category, amount]) => stryMutAct_9fa48("1357") ? {} : (stryCov_9fa48("1357"), {
      category,
      amount,
      percent: stryMutAct_9fa48("1358") ? amount / totalExpense / 100 : (stryCov_9fa48("1358"), (stryMutAct_9fa48("1359") ? amount * totalExpense : (stryCov_9fa48("1359"), amount / totalExpense)) * 100)
    }))).sort(stryMutAct_9fa48("1360") ? () => undefined : (stryCov_9fa48("1360"), (a, b) => stryMutAct_9fa48("1361") ? b.amount + a.amount : (stryCov_9fa48("1361"), b.amount - a.amount))).slice(0, 5));
  }
};