/**
 * Finance Insights - Weekly & Recurring Analysis
 * Extracted from financeInsights.ts per CLAUDE.md §3.2
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
export interface WeeklySpendingData {
  label: string;
  income: number;
  expense: number;
  net: number;
  weekStart: Date;
}
export interface RecurringTransactionGroup {
  id: string;
  title: string;
  amountCents: number;
  frequency: 'monthly' | 'weekly' | 'irregular';
  lastDate: string;
  count: number;
  avgGapDays: number;
}
const getStartOfWeek = (d: Date) => {
  if (stryMutAct_9fa48("9005")) {
    {}
  } else {
    stryCov_9fa48("9005");
    const date = new Date(d);
    const day = date.getDay();
    const diff = stryMutAct_9fa48("9006") ? date.getDate() - day - (day === 0 ? -6 : 1) : (stryCov_9fa48("9006"), (stryMutAct_9fa48("9007") ? date.getDate() + day : (stryCov_9fa48("9007"), date.getDate() - day)) + ((stryMutAct_9fa48("9010") ? day !== 0 : stryMutAct_9fa48("9009") ? false : stryMutAct_9fa48("9008") ? true : (stryCov_9fa48("9008", "9009", "9010"), day === 0)) ? stryMutAct_9fa48("9011") ? +6 : (stryCov_9fa48("9011"), -6) : 1));
    stryMutAct_9fa48("9012") ? date.setTime(diff) : (stryCov_9fa48("9012"), date.setDate(diff));
    stryMutAct_9fa48("9013") ? date.setMinutes(0, 0, 0, 0) : (stryCov_9fa48("9013"), date.setHours(0, 0, 0, 0));
    return date;
  }
};
const formatDateLabel = stryMutAct_9fa48("9014") ? () => undefined : (stryCov_9fa48("9014"), (() => {
  const formatDateLabel = (d: Date) => d.toLocaleDateString(stryMutAct_9fa48("9015") ? "" : (stryCov_9fa48("9015"), 'en-US'), stryMutAct_9fa48("9016") ? {} : (stryCov_9fa48("9016"), {
    month: stryMutAct_9fa48("9017") ? "" : (stryCov_9fa48("9017"), 'short'),
    day: stryMutAct_9fa48("9018") ? "" : (stryCov_9fa48("9018"), 'numeric')
  }));
  return formatDateLabel;
})());
export const getWeeklySpending = (transactions: AnchorTransaction[]): WeeklySpendingData[] => {
  if (stryMutAct_9fa48("9019")) {
    {}
  } else {
    stryCov_9fa48("9019");
    const weeks: WeeklySpendingData[] = stryMutAct_9fa48("9020") ? ["Stryker was here"] : (stryCov_9fa48("9020"), []);
    const today = new Date();
    const currentWeekStart = getStartOfWeek(today);
    for (let i = 3; stryMutAct_9fa48("9023") ? i < 0 : stryMutAct_9fa48("9022") ? i > 0 : stryMutAct_9fa48("9021") ? false : (stryCov_9fa48("9021", "9022", "9023"), i >= 0); stryMutAct_9fa48("9024") ? i++ : (stryCov_9fa48("9024"), i--)) {
      if (stryMutAct_9fa48("9025")) {
        {}
      } else {
        stryCov_9fa48("9025");
        const weekStart = new Date(currentWeekStart);
        stryMutAct_9fa48("9026") ? weekStart.setTime(weekStart.getDate() - i * 7) : (stryCov_9fa48("9026"), weekStart.setDate(stryMutAct_9fa48("9027") ? weekStart.getDate() + i * 7 : (stryCov_9fa48("9027"), weekStart.getDate() - (stryMutAct_9fa48("9028") ? i / 7 : (stryCov_9fa48("9028"), i * 7)))));
        const weekEnd = new Date(weekStart);
        stryMutAct_9fa48("9029") ? weekEnd.setTime(weekEnd.getDate() + 6) : (stryCov_9fa48("9029"), weekEnd.setDate(stryMutAct_9fa48("9030") ? weekEnd.getDate() - 6 : (stryCov_9fa48("9030"), weekEnd.getDate() + 6)));
        stryMutAct_9fa48("9031") ? weekEnd.setMinutes(23, 59, 59, 999) : (stryCov_9fa48("9031"), weekEnd.setHours(23, 59, 59, 999));
        const weekTxs = stryMutAct_9fa48("9032") ? transactions : (stryCov_9fa48("9032"), transactions.filter(t => {
          if (stryMutAct_9fa48("9033")) {
            {}
          } else {
            stryCov_9fa48("9033");
            if (stryMutAct_9fa48("9036") ? !t && !t.date : stryMutAct_9fa48("9035") ? false : stryMutAct_9fa48("9034") ? true : (stryCov_9fa48("9034", "9035", "9036"), (stryMutAct_9fa48("9037") ? t : (stryCov_9fa48("9037"), !t)) || (stryMutAct_9fa48("9038") ? t.date : (stryCov_9fa48("9038"), !t.date)))) return stryMutAct_9fa48("9039") ? true : (stryCov_9fa48("9039"), false);
            const date = new Date(t.date);
            return stryMutAct_9fa48("9042") ? date >= weekStart || date <= weekEnd : stryMutAct_9fa48("9041") ? false : stryMutAct_9fa48("9040") ? true : (stryCov_9fa48("9040", "9041", "9042"), (stryMutAct_9fa48("9045") ? date < weekStart : stryMutAct_9fa48("9044") ? date > weekStart : stryMutAct_9fa48("9043") ? true : (stryCov_9fa48("9043", "9044", "9045"), date >= weekStart)) && (stryMutAct_9fa48("9048") ? date > weekEnd : stryMutAct_9fa48("9047") ? date < weekEnd : stryMutAct_9fa48("9046") ? true : (stryCov_9fa48("9046", "9047", "9048"), date <= weekEnd)));
          }
        }));
        const income = stryMutAct_9fa48("9049") ? weekTxs.reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0) : (stryCov_9fa48("9049"), weekTxs.filter(stryMutAct_9fa48("9050") ? () => undefined : (stryCov_9fa48("9050"), t => stryMutAct_9fa48("9053") ? t || t.type === 'income' : stryMutAct_9fa48("9052") ? false : stryMutAct_9fa48("9051") ? true : (stryCov_9fa48("9051", "9052", "9053"), t && (stryMutAct_9fa48("9055") ? t.type !== 'income' : stryMutAct_9fa48("9054") ? true : (stryCov_9fa48("9054", "9055"), t.type === (stryMutAct_9fa48("9056") ? "" : (stryCov_9fa48("9056"), 'income'))))))).reduce(stryMutAct_9fa48("9057") ? () => undefined : (stryCov_9fa48("9057"), (sum, t) => stryMutAct_9fa48("9058") ? sum - fromCents(t.amountCents || 0) : (stryCov_9fa48("9058"), sum + fromCents(stryMutAct_9fa48("9061") ? t.amountCents && 0 : stryMutAct_9fa48("9060") ? false : stryMutAct_9fa48("9059") ? true : (stryCov_9fa48("9059", "9060", "9061"), t.amountCents || 0)))), 0));
        const expense = stryMutAct_9fa48("9062") ? weekTxs.reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0) : (stryCov_9fa48("9062"), weekTxs.filter(stryMutAct_9fa48("9063") ? () => undefined : (stryCov_9fa48("9063"), t => stryMutAct_9fa48("9066") ? t || t.type === 'expense' : stryMutAct_9fa48("9065") ? false : stryMutAct_9fa48("9064") ? true : (stryCov_9fa48("9064", "9065", "9066"), t && (stryMutAct_9fa48("9068") ? t.type !== 'expense' : stryMutAct_9fa48("9067") ? true : (stryCov_9fa48("9067", "9068"), t.type === (stryMutAct_9fa48("9069") ? "" : (stryCov_9fa48("9069"), 'expense'))))))).reduce(stryMutAct_9fa48("9070") ? () => undefined : (stryCov_9fa48("9070"), (sum, t) => stryMutAct_9fa48("9071") ? sum - fromCents(t.amountCents || 0) : (stryCov_9fa48("9071"), sum + fromCents(stryMutAct_9fa48("9074") ? t.amountCents && 0 : stryMutAct_9fa48("9073") ? false : stryMutAct_9fa48("9072") ? true : (stryCov_9fa48("9072", "9073", "9074"), t.amountCents || 0)))), 0));
        weeks.push(stryMutAct_9fa48("9075") ? {} : (stryCov_9fa48("9075"), {
          label: (stryMutAct_9fa48("9078") ? i !== 0 : stryMutAct_9fa48("9077") ? false : stryMutAct_9fa48("9076") ? true : (stryCov_9fa48("9076", "9077", "9078"), i === 0)) ? stryMutAct_9fa48("9079") ? "" : (stryCov_9fa48("9079"), 'This Week') : formatDateLabel(weekStart),
          income,
          expense,
          net: stryMutAct_9fa48("9080") ? income + expense : (stryCov_9fa48("9080"), income - expense),
          weekStart
        }));
      }
    }
    return weeks;
  }
};
export const detectRecurring = (transactions: AnchorTransaction[]): RecurringTransactionGroup[] => {
  if (stryMutAct_9fa48("9081")) {
    {}
  } else {
    stryCov_9fa48("9081");
    const groups: Record<string, AnchorTransaction[]> = {};
    transactions.forEach(t => {
      if (stryMutAct_9fa48("9082")) {
        {}
      } else {
        stryCov_9fa48("9082");
        if (stryMutAct_9fa48("9085") ? (!t || t.type !== 'expense') && !t.title : stryMutAct_9fa48("9084") ? false : stryMutAct_9fa48("9083") ? true : (stryCov_9fa48("9083", "9084", "9085"), (stryMutAct_9fa48("9087") ? !t && t.type !== 'expense' : stryMutAct_9fa48("9086") ? false : (stryCov_9fa48("9086", "9087"), (stryMutAct_9fa48("9088") ? t : (stryCov_9fa48("9088"), !t)) || (stryMutAct_9fa48("9090") ? t.type === 'expense' : stryMutAct_9fa48("9089") ? false : (stryCov_9fa48("9089", "9090"), t.type !== (stryMutAct_9fa48("9091") ? "" : (stryCov_9fa48("9091"), 'expense')))))) || (stryMutAct_9fa48("9092") ? t.title : (stryCov_9fa48("9092"), !t.title)))) return;
        const key = stryMutAct_9fa48("9093") ? `` : (stryCov_9fa48("9093"), `${stryMutAct_9fa48("9095") ? t.title.toLowerCase() : stryMutAct_9fa48("9094") ? t.title.trim().toUpperCase() : (stryCov_9fa48("9094", "9095"), t.title.trim().toLowerCase())}-${stryMutAct_9fa48("9098") ? t.amountCents && 0 : stryMutAct_9fa48("9097") ? false : stryMutAct_9fa48("9096") ? true : (stryCov_9fa48("9096", "9097", "9098"), t.amountCents || 0)}`);
        if (stryMutAct_9fa48("9101") ? false : stryMutAct_9fa48("9100") ? true : stryMutAct_9fa48("9099") ? groups[key] : (stryCov_9fa48("9099", "9100", "9101"), !groups[key])) groups[key] = stryMutAct_9fa48("9102") ? ["Stryker was here"] : (stryCov_9fa48("9102"), []);
        groups[key].push(t);
      }
    });
    const recurring: RecurringTransactionGroup[] = stryMutAct_9fa48("9103") ? ["Stryker was here"] : (stryCov_9fa48("9103"), []);
    Object.values(groups).forEach(group => {
      if (stryMutAct_9fa48("9104")) {
        {}
      } else {
        stryCov_9fa48("9104");
        if (stryMutAct_9fa48("9108") ? group.length >= 2 : stryMutAct_9fa48("9107") ? group.length <= 2 : stryMutAct_9fa48("9106") ? false : stryMutAct_9fa48("9105") ? true : (stryCov_9fa48("9105", "9106", "9107", "9108"), group.length < 2)) return;
        const sorted = stryMutAct_9fa48("9109") ? group : (stryCov_9fa48("9109"), group.sort(stryMutAct_9fa48("9110") ? () => undefined : (stryCov_9fa48("9110"), (a, b) => stryMutAct_9fa48("9111") ? new Date(b.date).getTime() + new Date(a.date).getTime() : (stryCov_9fa48("9111"), new Date(b.date).getTime() - new Date(a.date).getTime()))));
        let gapSum = 0;
        for (let i = 0; stryMutAct_9fa48("9114") ? i >= sorted.length - 1 : stryMutAct_9fa48("9113") ? i <= sorted.length - 1 : stryMutAct_9fa48("9112") ? false : (stryCov_9fa48("9112", "9113", "9114"), i < (stryMutAct_9fa48("9115") ? sorted.length + 1 : (stryCov_9fa48("9115"), sorted.length - 1))); stryMutAct_9fa48("9116") ? i-- : (stryCov_9fa48("9116"), i++)) {
          if (stryMutAct_9fa48("9117")) {
            {}
          } else {
            stryCov_9fa48("9117");
            const d1 = new Date(sorted[i].date).getTime();
            const d2 = new Date(sorted[stryMutAct_9fa48("9118") ? i - 1 : (stryCov_9fa48("9118"), i + 1)].date).getTime();
            stryMutAct_9fa48("9119") ? gapSum -= (d1 - d2) / (1000 * 3600 * 24) : (stryCov_9fa48("9119"), gapSum += stryMutAct_9fa48("9120") ? (d1 - d2) * (1000 * 3600 * 24) : (stryCov_9fa48("9120"), (stryMutAct_9fa48("9121") ? d1 + d2 : (stryCov_9fa48("9121"), d1 - d2)) / (stryMutAct_9fa48("9122") ? 1000 * 3600 / 24 : (stryCov_9fa48("9122"), (stryMutAct_9fa48("9123") ? 1000 / 3600 : (stryCov_9fa48("9123"), 1000 * 3600)) * 24))));
          }
        }
        const avgGap = stryMutAct_9fa48("9124") ? gapSum * (sorted.length - 1) : (stryCov_9fa48("9124"), gapSum / (stryMutAct_9fa48("9125") ? sorted.length + 1 : (stryCov_9fa48("9125"), sorted.length - 1)));
        let frequency: 'monthly' | 'weekly' | 'irregular' = stryMutAct_9fa48("9126") ? "" : (stryCov_9fa48("9126"), 'irregular');
        if (stryMutAct_9fa48("9129") ? avgGap >= 26 || avgGap <= 32 : stryMutAct_9fa48("9128") ? false : stryMutAct_9fa48("9127") ? true : (stryCov_9fa48("9127", "9128", "9129"), (stryMutAct_9fa48("9132") ? avgGap < 26 : stryMutAct_9fa48("9131") ? avgGap > 26 : stryMutAct_9fa48("9130") ? true : (stryCov_9fa48("9130", "9131", "9132"), avgGap >= 26)) && (stryMutAct_9fa48("9135") ? avgGap > 32 : stryMutAct_9fa48("9134") ? avgGap < 32 : stryMutAct_9fa48("9133") ? true : (stryCov_9fa48("9133", "9134", "9135"), avgGap <= 32)))) frequency = stryMutAct_9fa48("9136") ? "" : (stryCov_9fa48("9136"), 'monthly');else if (stryMutAct_9fa48("9139") ? avgGap >= 6 || avgGap <= 8 : stryMutAct_9fa48("9138") ? false : stryMutAct_9fa48("9137") ? true : (stryCov_9fa48("9137", "9138", "9139"), (stryMutAct_9fa48("9142") ? avgGap < 6 : stryMutAct_9fa48("9141") ? avgGap > 6 : stryMutAct_9fa48("9140") ? true : (stryCov_9fa48("9140", "9141", "9142"), avgGap >= 6)) && (stryMutAct_9fa48("9145") ? avgGap > 8 : stryMutAct_9fa48("9144") ? avgGap < 8 : stryMutAct_9fa48("9143") ? true : (stryCov_9fa48("9143", "9144", "9145"), avgGap <= 8)))) frequency = stryMutAct_9fa48("9146") ? "" : (stryCov_9fa48("9146"), 'weekly');
        if (stryMutAct_9fa48("9149") ? frequency === 'irregular' : stryMutAct_9fa48("9148") ? false : stryMutAct_9fa48("9147") ? true : (stryCov_9fa48("9147", "9148", "9149"), frequency !== (stryMutAct_9fa48("9150") ? "" : (stryCov_9fa48("9150"), 'irregular')))) {
          if (stryMutAct_9fa48("9151")) {
            {}
          } else {
            stryCov_9fa48("9151");
            recurring.push(stryMutAct_9fa48("9152") ? {} : (stryCov_9fa48("9152"), {
              id: sorted[0].id,
              title: sorted[0].title,
              amountCents: stryMutAct_9fa48("9155") ? sorted[0].amountCents && 0 : stryMutAct_9fa48("9154") ? false : stryMutAct_9fa48("9153") ? true : (stryCov_9fa48("9153", "9154", "9155"), sorted[0].amountCents || 0),
              frequency,
              lastDate: sorted[0].date as string,
              count: group.length,
              avgGapDays: avgGap
            }));
          }
        }
      }
    });
    return stryMutAct_9fa48("9156") ? recurring : (stryCov_9fa48("9156"), recurring.sort(stryMutAct_9fa48("9157") ? () => undefined : (stryCov_9fa48("9157"), (a, b) => stryMutAct_9fa48("9158") ? (b.amountCents || 0) + (a.amountCents || 0) : (stryCov_9fa48("9158"), (stryMutAct_9fa48("9161") ? b.amountCents && 0 : stryMutAct_9fa48("9160") ? false : stryMutAct_9fa48("9159") ? true : (stryCov_9fa48("9159", "9160", "9161"), b.amountCents || 0)) - (stryMutAct_9fa48("9164") ? a.amountCents && 0 : stryMutAct_9fa48("9163") ? false : stryMutAct_9fa48("9162") ? true : (stryCov_9fa48("9162", "9163", "9164"), a.amountCents || 0))))));
  }
};