/**
 * Finance Utility Functions
 * Separates business logic from view components
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
import type { AnchorTransaction, AnchorAccount } from '../types';
import { fromCents } from './moneyUtils';
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

/**
 * Groups small values (< threshold %) into an "Other" category
 * Prevents chart legend clutter
 */
export function groupSmallValues<T extends ChartDataItem>(data: T[], threshold: number = 0.05): T[] {
  if (stryMutAct_9fa48("1091")) {
    {}
  } else {
    stryCov_9fa48("1091");
    const total = data.reduce(stryMutAct_9fa48("1092") ? () => undefined : (stryCov_9fa48("1092"), (sum, item) => stryMutAct_9fa48("1093") ? sum - item.value : (stryCov_9fa48("1093"), sum + item.value)), 0);
    if (stryMutAct_9fa48("1096") ? total !== 0 : stryMutAct_9fa48("1095") ? false : stryMutAct_9fa48("1094") ? true : (stryCov_9fa48("1094", "1095", "1096"), total === 0)) return data;
    const significant: T[] = stryMutAct_9fa48("1097") ? ["Stryker was here"] : (stryCov_9fa48("1097"), []);
    let otherValue = 0;
    data.forEach(item => {
      if (stryMutAct_9fa48("1098")) {
        {}
      } else {
        stryCov_9fa48("1098");
        const percentage = stryMutAct_9fa48("1099") ? item.value * total : (stryCov_9fa48("1099"), item.value / total);
        if (stryMutAct_9fa48("1103") ? percentage < threshold : stryMutAct_9fa48("1102") ? percentage > threshold : stryMutAct_9fa48("1101") ? false : stryMutAct_9fa48("1100") ? true : (stryCov_9fa48("1100", "1101", "1102", "1103"), percentage >= threshold)) {
          if (stryMutAct_9fa48("1104")) {
            {}
          } else {
            stryCov_9fa48("1104");
            significant.push(item);
          }
        } else {
          if (stryMutAct_9fa48("1105")) {
            {}
          } else {
            stryCov_9fa48("1105");
            stryMutAct_9fa48("1106") ? otherValue -= item.value : (stryCov_9fa48("1106"), otherValue += item.value);
          }
        }
      }
    });
    if (stryMutAct_9fa48("1110") ? otherValue <= 0 : stryMutAct_9fa48("1109") ? otherValue >= 0 : stryMutAct_9fa48("1108") ? false : stryMutAct_9fa48("1107") ? true : (stryCov_9fa48("1107", "1108", "1109", "1110"), otherValue > 0)) {
      if (stryMutAct_9fa48("1111")) {
        {}
      } else {
        stryCov_9fa48("1111");
        significant.push({
          name: 'Other',
          value: otherValue,
          color: '#94a3b8' // slate-400
        } as T);
      }
    }
    return significant;
  }
}

/**
 * Smart category suggestion based on transaction history
 * Queries recent transactions to auto-suggest category
 */
export function suggestCategory(description: string, recentTransactions: AnchorTransaction[], limit: number = 50): string | null {
  if (stryMutAct_9fa48("1112")) {
    {}
  } else {
    stryCov_9fa48("1112");
    if (stryMutAct_9fa48("1115") ? !description && description.length < 2 : stryMutAct_9fa48("1114") ? false : stryMutAct_9fa48("1113") ? true : (stryCov_9fa48("1113", "1114", "1115"), (stryMutAct_9fa48("1116") ? description : (stryCov_9fa48("1116"), !description)) || (stryMutAct_9fa48("1119") ? description.length >= 2 : stryMutAct_9fa48("1118") ? description.length <= 2 : stryMutAct_9fa48("1117") ? false : (stryCov_9fa48("1117", "1118", "1119"), description.length < 2)))) return null;
    const searchTerm = stryMutAct_9fa48("1121") ? description.toUpperCase().trim() : stryMutAct_9fa48("1120") ? description.toLowerCase() : (stryCov_9fa48("1120", "1121"), description.toLowerCase().trim());
    const recent = stryMutAct_9fa48("1122") ? recentTransactions : (stryCov_9fa48("1122"), recentTransactions.slice(0, limit));

    // Find matching transaction by title
    const match = recent.find(stryMutAct_9fa48("1123") ? () => undefined : (stryCov_9fa48("1123"), tx => stryMutAct_9fa48("1126") ? tx.title.toLowerCase().includes(searchTerm) && searchTerm.includes(tx.title.toLowerCase()) : stryMutAct_9fa48("1125") ? false : stryMutAct_9fa48("1124") ? true : (stryCov_9fa48("1124", "1125", "1126"), (stryMutAct_9fa48("1127") ? tx.title.toUpperCase().includes(searchTerm) : (stryCov_9fa48("1127"), tx.title.toLowerCase().includes(searchTerm))) || searchTerm.includes(stryMutAct_9fa48("1128") ? tx.title.toUpperCase() : (stryCov_9fa48("1128"), tx.title.toLowerCase())))));
    return stryMutAct_9fa48("1131") ? match?.category && null : stryMutAct_9fa48("1130") ? false : stryMutAct_9fa48("1129") ? true : (stryCov_9fa48("1129", "1130", "1131"), (stryMutAct_9fa48("1132") ? match.category : (stryCov_9fa48("1132"), match?.category)) || null);
  }
}

/**
 * Calculate net worth from accounts
 * Separates by currency
 * F-017: Fixed to properly handle multi-currency totals
 */
export function calculateNetWorth(accounts: AnchorAccount[]): {
  NGN: number;
  USD: number;
  total: {
    amount: number;
    currency: 'NGN' | 'USD';
  };
} {
  if (stryMutAct_9fa48("1133")) {
    {}
  } else {
    stryCov_9fa48("1133");
    const NGN_Cents = stryMutAct_9fa48("1134") ? accounts.reduce((sum, acc) => sum + acc.balanceCents, 0) : (stryCov_9fa48("1134"), accounts.filter(stryMutAct_9fa48("1135") ? () => undefined : (stryCov_9fa48("1135"), acc => stryMutAct_9fa48("1138") ? acc.currency !== 'NGN' : stryMutAct_9fa48("1137") ? false : stryMutAct_9fa48("1136") ? true : (stryCov_9fa48("1136", "1137", "1138"), acc.currency === (stryMutAct_9fa48("1139") ? "" : (stryCov_9fa48("1139"), 'NGN'))))).reduce(stryMutAct_9fa48("1140") ? () => undefined : (stryCov_9fa48("1140"), (sum, acc) => stryMutAct_9fa48("1141") ? sum - acc.balanceCents : (stryCov_9fa48("1141"), sum + acc.balanceCents)), 0));
    const USD_Cents = stryMutAct_9fa48("1142") ? accounts.reduce((sum, acc) => sum + acc.balanceCents, 0) : (stryCov_9fa48("1142"), accounts.filter(stryMutAct_9fa48("1143") ? () => undefined : (stryCov_9fa48("1143"), acc => stryMutAct_9fa48("1146") ? acc.currency !== 'USD' : stryMutAct_9fa48("1145") ? false : stryMutAct_9fa48("1144") ? true : (stryCov_9fa48("1144", "1145", "1146"), acc.currency === (stryMutAct_9fa48("1147") ? "" : (stryCov_9fa48("1147"), 'USD'))))).reduce(stryMutAct_9fa48("1148") ? () => undefined : (stryCov_9fa48("1148"), (sum, acc) => stryMutAct_9fa48("1149") ? sum - acc.balanceCents : (stryCov_9fa48("1149"), sum + acc.balanceCents)), 0));

    // Convert to display decimals only at the very end
    const NGN = fromCents(NGN_Cents);
    const USD = fromCents(USD_Cents);

    // F-017: Total uses the dominant currency (higher absolute value)
    // This provides a reasonable primary display when user has mixed currencies
    const primaryCurrency = (stryMutAct_9fa48("1153") ? Math.abs(NGN) < Math.abs(USD) : stryMutAct_9fa48("1152") ? Math.abs(NGN) > Math.abs(USD) : stryMutAct_9fa48("1151") ? false : stryMutAct_9fa48("1150") ? true : (stryCov_9fa48("1150", "1151", "1152", "1153"), Math.abs(NGN) >= Math.abs(USD))) ? stryMutAct_9fa48("1154") ? "" : (stryCov_9fa48("1154"), 'NGN') : stryMutAct_9fa48("1155") ? "" : (stryCov_9fa48("1155"), 'USD');
    const primaryAmount = (stryMutAct_9fa48("1158") ? primaryCurrency !== 'NGN' : stryMutAct_9fa48("1157") ? false : stryMutAct_9fa48("1156") ? true : (stryCov_9fa48("1156", "1157", "1158"), primaryCurrency === (stryMutAct_9fa48("1159") ? "" : (stryCov_9fa48("1159"), 'NGN')))) ? NGN : USD;
    return stryMutAct_9fa48("1160") ? {} : (stryCov_9fa48("1160"), {
      NGN,
      USD,
      total: stryMutAct_9fa48("1161") ? {} : (stryCov_9fa48("1161"), {
        amount: primaryAmount,
        currency: primaryCurrency
      })
    });
  }
}

/**
 * Get transaction label based on type
 */
export function getTransactionLabel(type: 'income' | 'expense' | 'transfer'): {
  header: string;
  accountLabel: string;
} {
  if (stryMutAct_9fa48("1162")) {
    {}
  } else {
    stryCov_9fa48("1162");
    switch (type) {
      case stryMutAct_9fa48("1164") ? "" : (stryCov_9fa48("1164"), 'income'):
        if (stryMutAct_9fa48("1163")) {} else {
          stryCov_9fa48("1163");
          return stryMutAct_9fa48("1165") ? {} : (stryCov_9fa48("1165"), {
            header: stryMutAct_9fa48("1166") ? "" : (stryCov_9fa48("1166"), 'Record Income'),
            accountLabel: stryMutAct_9fa48("1167") ? "" : (stryCov_9fa48("1167"), 'DEPOSIT TO')
          });
        }
      case stryMutAct_9fa48("1169") ? "" : (stryCov_9fa48("1169"), 'expense'):
        if (stryMutAct_9fa48("1168")) {} else {
          stryCov_9fa48("1168");
          return stryMutAct_9fa48("1170") ? {} : (stryCov_9fa48("1170"), {
            header: stryMutAct_9fa48("1171") ? "" : (stryCov_9fa48("1171"), 'Record Expense'),
            accountLabel: stryMutAct_9fa48("1172") ? "" : (stryCov_9fa48("1172"), 'SPEND FROM')
          });
        }
      case stryMutAct_9fa48("1174") ? "" : (stryCov_9fa48("1174"), 'transfer'):
        if (stryMutAct_9fa48("1173")) {} else {
          stryCov_9fa48("1173");
          return stryMutAct_9fa48("1175") ? {} : (stryCov_9fa48("1175"), {
            header: stryMutAct_9fa48("1176") ? "" : (stryCov_9fa48("1176"), 'Record Transfer'),
            accountLabel: stryMutAct_9fa48("1177") ? "" : (stryCov_9fa48("1177"), 'TRANSFER FROM')
          });
        }
    }
  }
}

/**
 * Calculate cash flow summary for a time period
 */
export function calculateCashFlow(transactions: AnchorTransaction[], days: number = 30): {
  income: number;
  expense: number;
  net: number;
} {
  if (stryMutAct_9fa48("1178")) {
    {}
  } else {
    stryCov_9fa48("1178");
    const cutoff = new Date();
    stryMutAct_9fa48("1179") ? cutoff.setTime(cutoff.getDate() - days) : (stryCov_9fa48("1179"), cutoff.setDate(stryMutAct_9fa48("1180") ? cutoff.getDate() + days : (stryCov_9fa48("1180"), cutoff.getDate() - days)));
    const filtered = stryMutAct_9fa48("1181") ? transactions : (stryCov_9fa48("1181"), transactions.filter(tx => {
      if (stryMutAct_9fa48("1182")) {
        {}
      } else {
        stryCov_9fa48("1182");
        const txDate = new Date(tx.date);
        return stryMutAct_9fa48("1186") ? txDate < cutoff : stryMutAct_9fa48("1185") ? txDate > cutoff : stryMutAct_9fa48("1184") ? false : stryMutAct_9fa48("1183") ? true : (stryCov_9fa48("1183", "1184", "1185", "1186"), txDate >= cutoff);
      }
    }));
    const incomeCents = stryMutAct_9fa48("1187") ? filtered.reduce((sum, tx) => sum + (tx.amountCents || 0), 0) : (stryCov_9fa48("1187"), filtered.filter(stryMutAct_9fa48("1188") ? () => undefined : (stryCov_9fa48("1188"), tx => stryMutAct_9fa48("1191") ? tx.type !== 'income' : stryMutAct_9fa48("1190") ? false : stryMutAct_9fa48("1189") ? true : (stryCov_9fa48("1189", "1190", "1191"), tx.type === (stryMutAct_9fa48("1192") ? "" : (stryCov_9fa48("1192"), 'income'))))).reduce(stryMutAct_9fa48("1193") ? () => undefined : (stryCov_9fa48("1193"), (sum, tx) => stryMutAct_9fa48("1194") ? sum - (tx.amountCents || 0) : (stryCov_9fa48("1194"), sum + (stryMutAct_9fa48("1197") ? tx.amountCents && 0 : stryMutAct_9fa48("1196") ? false : stryMutAct_9fa48("1195") ? true : (stryCov_9fa48("1195", "1196", "1197"), tx.amountCents || 0)))), 0));
    const expenseCents = stryMutAct_9fa48("1198") ? filtered.reduce((sum, tx) => sum + (tx.amountCents || 0), 0) : (stryCov_9fa48("1198"), filtered.filter(stryMutAct_9fa48("1199") ? () => undefined : (stryCov_9fa48("1199"), tx => stryMutAct_9fa48("1202") ? tx.type !== 'expense' : stryMutAct_9fa48("1201") ? false : stryMutAct_9fa48("1200") ? true : (stryCov_9fa48("1200", "1201", "1202"), tx.type === (stryMutAct_9fa48("1203") ? "" : (stryCov_9fa48("1203"), 'expense'))))).reduce(stryMutAct_9fa48("1204") ? () => undefined : (stryCov_9fa48("1204"), (sum, tx) => stryMutAct_9fa48("1205") ? sum - (tx.amountCents || 0) : (stryCov_9fa48("1205"), sum + (stryMutAct_9fa48("1208") ? tx.amountCents && 0 : stryMutAct_9fa48("1207") ? false : stryMutAct_9fa48("1206") ? true : (stryCov_9fa48("1206", "1207", "1208"), tx.amountCents || 0)))), 0));
    const income = fromCents(incomeCents);
    const expense = fromCents(expenseCents);
    return stryMutAct_9fa48("1209") ? {} : (stryCov_9fa48("1209"), {
      income,
      expense,
      net: stryMutAct_9fa48("1210") ? income + expense : (stryCov_9fa48("1210"), income - expense)
    });
  }
}

/**
 * Deduplicate account names for chart labels
 */
export function deduplicateLabels<T extends ChartDataItem>(data: T[]): T[] {
  if (stryMutAct_9fa48("1211")) {
    {}
  } else {
    stryCov_9fa48("1211");
    const nameCount: Record<string, number> = {};
    return data.map(item => {
      if (stryMutAct_9fa48("1212")) {
        {}
      } else {
        stryCov_9fa48("1212");
        if (stryMutAct_9fa48("1214") ? false : stryMutAct_9fa48("1213") ? true : (stryCov_9fa48("1213", "1214"), nameCount[item.name])) {
          if (stryMutAct_9fa48("1215")) {
            {}
          } else {
            stryCov_9fa48("1215");
            stryMutAct_9fa48("1216") ? nameCount[item.name]-- : (stryCov_9fa48("1216"), nameCount[item.name]++);
            return stryMutAct_9fa48("1217") ? {} : (stryCov_9fa48("1217"), {
              ...item,
              name: stryMutAct_9fa48("1218") ? `` : (stryCov_9fa48("1218"), `${item.name} (${nameCount[item.name]})`)
            });
          }
        }
        nameCount[item.name] = 1;
        return item;
      }
    });
  }
}