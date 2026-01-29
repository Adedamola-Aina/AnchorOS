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
export function groupSmallValues(data: ChartDataItem[], threshold: number = 0.05): ChartDataItem[] {
  if (stryMutAct_9fa48("8743")) {
    {}
  } else {
    stryCov_9fa48("8743");
    const total = data.reduce(stryMutAct_9fa48("8744") ? () => undefined : (stryCov_9fa48("8744"), (sum, item) => stryMutAct_9fa48("8745") ? sum - item.value : (stryCov_9fa48("8745"), sum + item.value)), 0);
    if (stryMutAct_9fa48("8748") ? total !== 0 : stryMutAct_9fa48("8747") ? false : stryMutAct_9fa48("8746") ? true : (stryCov_9fa48("8746", "8747", "8748"), total === 0)) return data;
    const significant: ChartDataItem[] = stryMutAct_9fa48("8749") ? ["Stryker was here"] : (stryCov_9fa48("8749"), []);
    let otherValue = 0;
    data.forEach(item => {
      if (stryMutAct_9fa48("8750")) {
        {}
      } else {
        stryCov_9fa48("8750");
        const percentage = stryMutAct_9fa48("8751") ? item.value * total : (stryCov_9fa48("8751"), item.value / total);
        if (stryMutAct_9fa48("8755") ? percentage < threshold : stryMutAct_9fa48("8754") ? percentage > threshold : stryMutAct_9fa48("8753") ? false : stryMutAct_9fa48("8752") ? true : (stryCov_9fa48("8752", "8753", "8754", "8755"), percentage >= threshold)) {
          if (stryMutAct_9fa48("8756")) {
            {}
          } else {
            stryCov_9fa48("8756");
            significant.push(item);
          }
        } else {
          if (stryMutAct_9fa48("8757")) {
            {}
          } else {
            stryCov_9fa48("8757");
            stryMutAct_9fa48("8758") ? otherValue -= item.value : (stryCov_9fa48("8758"), otherValue += item.value);
          }
        }
      }
    });
    if (stryMutAct_9fa48("8762") ? otherValue <= 0 : stryMutAct_9fa48("8761") ? otherValue >= 0 : stryMutAct_9fa48("8760") ? false : stryMutAct_9fa48("8759") ? true : (stryCov_9fa48("8759", "8760", "8761", "8762"), otherValue > 0)) {
      if (stryMutAct_9fa48("8763")) {
        {}
      } else {
        stryCov_9fa48("8763");
        significant.push(stryMutAct_9fa48("8764") ? {} : (stryCov_9fa48("8764"), {
          name: stryMutAct_9fa48("8765") ? "" : (stryCov_9fa48("8765"), 'Other'),
          value: otherValue,
          color: stryMutAct_9fa48("8766") ? "" : (stryCov_9fa48("8766"), '#94a3b8') // slate-400
        }));
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
  if (stryMutAct_9fa48("8767")) {
    {}
  } else {
    stryCov_9fa48("8767");
    if (stryMutAct_9fa48("8770") ? !description && description.length < 2 : stryMutAct_9fa48("8769") ? false : stryMutAct_9fa48("8768") ? true : (stryCov_9fa48("8768", "8769", "8770"), (stryMutAct_9fa48("8771") ? description : (stryCov_9fa48("8771"), !description)) || (stryMutAct_9fa48("8774") ? description.length >= 2 : stryMutAct_9fa48("8773") ? description.length <= 2 : stryMutAct_9fa48("8772") ? false : (stryCov_9fa48("8772", "8773", "8774"), description.length < 2)))) return null;
    const searchTerm = stryMutAct_9fa48("8776") ? description.toUpperCase().trim() : stryMutAct_9fa48("8775") ? description.toLowerCase() : (stryCov_9fa48("8775", "8776"), description.toLowerCase().trim());
    const recent = stryMutAct_9fa48("8777") ? recentTransactions : (stryCov_9fa48("8777"), recentTransactions.slice(0, limit));

    // Find matching transaction by title
    const match = recent.find(stryMutAct_9fa48("8778") ? () => undefined : (stryCov_9fa48("8778"), tx => stryMutAct_9fa48("8781") ? tx.title.toLowerCase().includes(searchTerm) && searchTerm.includes(tx.title.toLowerCase()) : stryMutAct_9fa48("8780") ? false : stryMutAct_9fa48("8779") ? true : (stryCov_9fa48("8779", "8780", "8781"), (stryMutAct_9fa48("8782") ? tx.title.toUpperCase().includes(searchTerm) : (stryCov_9fa48("8782"), tx.title.toLowerCase().includes(searchTerm))) || searchTerm.includes(stryMutAct_9fa48("8783") ? tx.title.toUpperCase() : (stryCov_9fa48("8783"), tx.title.toLowerCase())))));
    return stryMutAct_9fa48("8786") ? match?.category && null : stryMutAct_9fa48("8785") ? false : stryMutAct_9fa48("8784") ? true : (stryCov_9fa48("8784", "8785", "8786"), (stryMutAct_9fa48("8787") ? match.category : (stryCov_9fa48("8787"), match?.category)) || null);
  }
}

/**
 * Calculate net worth from accounts
 * Separates by currency
 */
export function calculateNetWorth(accounts: AnchorAccount[]): {
  NGN: number;
  USD: number;
  total: {
    amount: number;
    currency: 'NGN';
  };
} {
  if (stryMutAct_9fa48("8788")) {
    {}
  } else {
    stryCov_9fa48("8788");
    const NGN_Cents = stryMutAct_9fa48("8789") ? accounts.reduce((sum, acc) => sum + acc.balanceCents, 0) : (stryCov_9fa48("8789"), accounts.filter(stryMutAct_9fa48("8790") ? () => undefined : (stryCov_9fa48("8790"), acc => stryMutAct_9fa48("8793") ? acc.currency !== 'NGN' : stryMutAct_9fa48("8792") ? false : stryMutAct_9fa48("8791") ? true : (stryCov_9fa48("8791", "8792", "8793"), acc.currency === (stryMutAct_9fa48("8794") ? "" : (stryCov_9fa48("8794"), 'NGN'))))).reduce(stryMutAct_9fa48("8795") ? () => undefined : (stryCov_9fa48("8795"), (sum, acc) => stryMutAct_9fa48("8796") ? sum - acc.balanceCents : (stryCov_9fa48("8796"), sum + acc.balanceCents)), 0));
    const USD_Cents = stryMutAct_9fa48("8797") ? accounts.reduce((sum, acc) => sum + acc.balanceCents, 0) : (stryCov_9fa48("8797"), accounts.filter(stryMutAct_9fa48("8798") ? () => undefined : (stryCov_9fa48("8798"), acc => stryMutAct_9fa48("8801") ? acc.currency !== 'USD' : stryMutAct_9fa48("8800") ? false : stryMutAct_9fa48("8799") ? true : (stryCov_9fa48("8799", "8800", "8801"), acc.currency === (stryMutAct_9fa48("8802") ? "" : (stryCov_9fa48("8802"), 'USD'))))).reduce(stryMutAct_9fa48("8803") ? () => undefined : (stryCov_9fa48("8803"), (sum, acc) => stryMutAct_9fa48("8804") ? sum - acc.balanceCents : (stryCov_9fa48("8804"), sum + acc.balanceCents)), 0));

    // Convert to display decimals only at the very end
    const NGN = fromCents(NGN_Cents);
    const USD = fromCents(USD_Cents);
    return stryMutAct_9fa48("8805") ? {} : (stryCov_9fa48("8805"), {
      NGN,
      USD,
      total: stryMutAct_9fa48("8806") ? {} : (stryCov_9fa48("8806"), {
        amount: NGN,
        currency: stryMutAct_9fa48("8807") ? "" : (stryCov_9fa48("8807"), 'NGN')
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
  if (stryMutAct_9fa48("8808")) {
    {}
  } else {
    stryCov_9fa48("8808");
    switch (type) {
      case stryMutAct_9fa48("8810") ? "" : (stryCov_9fa48("8810"), 'income'):
        if (stryMutAct_9fa48("8809")) {} else {
          stryCov_9fa48("8809");
          return stryMutAct_9fa48("8811") ? {} : (stryCov_9fa48("8811"), {
            header: stryMutAct_9fa48("8812") ? "" : (stryCov_9fa48("8812"), 'Record Income'),
            accountLabel: stryMutAct_9fa48("8813") ? "" : (stryCov_9fa48("8813"), 'DEPOSIT TO')
          });
        }
      case stryMutAct_9fa48("8815") ? "" : (stryCov_9fa48("8815"), 'expense'):
        if (stryMutAct_9fa48("8814")) {} else {
          stryCov_9fa48("8814");
          return stryMutAct_9fa48("8816") ? {} : (stryCov_9fa48("8816"), {
            header: stryMutAct_9fa48("8817") ? "" : (stryCov_9fa48("8817"), 'Record Expense'),
            accountLabel: stryMutAct_9fa48("8818") ? "" : (stryCov_9fa48("8818"), 'SPEND FROM')
          });
        }
      case stryMutAct_9fa48("8820") ? "" : (stryCov_9fa48("8820"), 'transfer'):
        if (stryMutAct_9fa48("8819")) {} else {
          stryCov_9fa48("8819");
          return stryMutAct_9fa48("8821") ? {} : (stryCov_9fa48("8821"), {
            header: stryMutAct_9fa48("8822") ? "" : (stryCov_9fa48("8822"), 'Record Transfer'),
            accountLabel: stryMutAct_9fa48("8823") ? "" : (stryCov_9fa48("8823"), 'TRANSFER FROM')
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
  if (stryMutAct_9fa48("8824")) {
    {}
  } else {
    stryCov_9fa48("8824");
    const cutoff = new Date();
    stryMutAct_9fa48("8825") ? cutoff.setTime(cutoff.getDate() - days) : (stryCov_9fa48("8825"), cutoff.setDate(stryMutAct_9fa48("8826") ? cutoff.getDate() + days : (stryCov_9fa48("8826"), cutoff.getDate() - days)));
    const filtered = stryMutAct_9fa48("8827") ? transactions : (stryCov_9fa48("8827"), transactions.filter(tx => {
      if (stryMutAct_9fa48("8828")) {
        {}
      } else {
        stryCov_9fa48("8828");
        const txDate = new Date(tx.date);
        return stryMutAct_9fa48("8832") ? txDate < cutoff : stryMutAct_9fa48("8831") ? txDate > cutoff : stryMutAct_9fa48("8830") ? false : stryMutAct_9fa48("8829") ? true : (stryCov_9fa48("8829", "8830", "8831", "8832"), txDate >= cutoff);
      }
    }));
    const incomeCents = stryMutAct_9fa48("8833") ? filtered.reduce((sum, tx) => sum + (tx.amountCents || 0), 0) : (stryCov_9fa48("8833"), filtered.filter(stryMutAct_9fa48("8834") ? () => undefined : (stryCov_9fa48("8834"), tx => stryMutAct_9fa48("8837") ? tx.type !== 'income' : stryMutAct_9fa48("8836") ? false : stryMutAct_9fa48("8835") ? true : (stryCov_9fa48("8835", "8836", "8837"), tx.type === (stryMutAct_9fa48("8838") ? "" : (stryCov_9fa48("8838"), 'income'))))).reduce(stryMutAct_9fa48("8839") ? () => undefined : (stryCov_9fa48("8839"), (sum, tx) => stryMutAct_9fa48("8840") ? sum - (tx.amountCents || 0) : (stryCov_9fa48("8840"), sum + (stryMutAct_9fa48("8843") ? tx.amountCents && 0 : stryMutAct_9fa48("8842") ? false : stryMutAct_9fa48("8841") ? true : (stryCov_9fa48("8841", "8842", "8843"), tx.amountCents || 0)))), 0));
    const expenseCents = stryMutAct_9fa48("8844") ? filtered.reduce((sum, tx) => sum + (tx.amountCents || 0), 0) : (stryCov_9fa48("8844"), filtered.filter(stryMutAct_9fa48("8845") ? () => undefined : (stryCov_9fa48("8845"), tx => stryMutAct_9fa48("8848") ? tx.type !== 'expense' : stryMutAct_9fa48("8847") ? false : stryMutAct_9fa48("8846") ? true : (stryCov_9fa48("8846", "8847", "8848"), tx.type === (stryMutAct_9fa48("8849") ? "" : (stryCov_9fa48("8849"), 'expense'))))).reduce(stryMutAct_9fa48("8850") ? () => undefined : (stryCov_9fa48("8850"), (sum, tx) => stryMutAct_9fa48("8851") ? sum - (tx.amountCents || 0) : (stryCov_9fa48("8851"), sum + (stryMutAct_9fa48("8854") ? tx.amountCents && 0 : stryMutAct_9fa48("8853") ? false : stryMutAct_9fa48("8852") ? true : (stryCov_9fa48("8852", "8853", "8854"), tx.amountCents || 0)))), 0));
    const income = fromCents(incomeCents);
    const expense = fromCents(expenseCents);
    return stryMutAct_9fa48("8855") ? {} : (stryCov_9fa48("8855"), {
      income,
      expense,
      net: stryMutAct_9fa48("8856") ? income + expense : (stryCov_9fa48("8856"), income - expense)
    });
  }
}

/**
 * Deduplicate account names for chart labels
 */
export function deduplicateLabels(data: ChartDataItem[]): ChartDataItem[] {
  if (stryMutAct_9fa48("8857")) {
    {}
  } else {
    stryCov_9fa48("8857");
    const nameCount: Record<string, number> = {};
    return data.map(item => {
      if (stryMutAct_9fa48("8858")) {
        {}
      } else {
        stryCov_9fa48("8858");
        if (stryMutAct_9fa48("8860") ? false : stryMutAct_9fa48("8859") ? true : (stryCov_9fa48("8859", "8860"), nameCount[item.name])) {
          if (stryMutAct_9fa48("8861")) {
            {}
          } else {
            stryCov_9fa48("8861");
            stryMutAct_9fa48("8862") ? nameCount[item.name]-- : (stryCov_9fa48("8862"), nameCount[item.name]++);
            return stryMutAct_9fa48("8863") ? {} : (stryCov_9fa48("8863"), {
              ...item,
              name: stryMutAct_9fa48("8864") ? `` : (stryCov_9fa48("8864"), `${item.name} (${nameCount[item.name]})`)
            });
          }
        }
        nameCount[item.name] = 1;
        return item;
      }
    });
  }
}