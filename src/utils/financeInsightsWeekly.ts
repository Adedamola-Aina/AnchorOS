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
  if (stryMutAct_9fa48("1362")) {
    {}
  } else {
    stryCov_9fa48("1362");
    const date = new Date(d);
    const day = date.getDay();
    const diff = stryMutAct_9fa48("1363") ? date.getDate() - day - (day === 0 ? -6 : 1) : (stryCov_9fa48("1363"), (stryMutAct_9fa48("1364") ? date.getDate() + day : (stryCov_9fa48("1364"), date.getDate() - day)) + ((stryMutAct_9fa48("1367") ? day !== 0 : stryMutAct_9fa48("1366") ? false : stryMutAct_9fa48("1365") ? true : (stryCov_9fa48("1365", "1366", "1367"), day === 0)) ? stryMutAct_9fa48("1368") ? +6 : (stryCov_9fa48("1368"), -6) : 1));
    stryMutAct_9fa48("1369") ? date.setTime(diff) : (stryCov_9fa48("1369"), date.setDate(diff));
    stryMutAct_9fa48("1370") ? date.setMinutes(0, 0, 0, 0) : (stryCov_9fa48("1370"), date.setHours(0, 0, 0, 0));
    return date;
  }
};
const formatDateLabel = stryMutAct_9fa48("1371") ? () => undefined : (stryCov_9fa48("1371"), (() => {
  const formatDateLabel = (d: Date) => d.toLocaleDateString(stryMutAct_9fa48("1372") ? "" : (stryCov_9fa48("1372"), 'en-US'), stryMutAct_9fa48("1373") ? {} : (stryCov_9fa48("1373"), {
    month: stryMutAct_9fa48("1374") ? "" : (stryCov_9fa48("1374"), 'short'),
    day: stryMutAct_9fa48("1375") ? "" : (stryCov_9fa48("1375"), 'numeric')
  }));
  return formatDateLabel;
})());

/**
 * F-015: Updated to accept optional month reference date.
 * When viewing past months, uses that month's date range instead of today.
 * Now shows full month weeks, not just 4 weeks from today.
 */
export const getWeeklySpending = (transactions: AnchorTransaction[], referenceDate?: Date): WeeklySpendingData[] => {
  if (stryMutAct_9fa48("1376")) {
    {}
  } else {
    stryCov_9fa48("1376");
    const weeks: WeeklySpendingData[] = stryMutAct_9fa48("1377") ? ["Stryker was here"] : (stryCov_9fa48("1377"), []);
    const ref = stryMutAct_9fa48("1380") ? referenceDate && new Date() : stryMutAct_9fa48("1379") ? false : stryMutAct_9fa48("1378") ? true : (stryCov_9fa48("1378", "1379", "1380"), referenceDate || new Date());

    // Use start and end of the reference month
    const monthStart = new Date(ref.getFullYear(), ref.getMonth(), 1);
    const monthEnd = new Date(ref.getFullYear(), stryMutAct_9fa48("1381") ? ref.getMonth() - 1 : (stryCov_9fa48("1381"), ref.getMonth() + 1), 0, 23, 59, 59, 999);

    // Generate weeks that cover the month
    let weekStart = getStartOfWeek(monthStart);
    const today = new Date();
    while (stryMutAct_9fa48("1384") ? weekStart > monthEnd : stryMutAct_9fa48("1383") ? weekStart < monthEnd : stryMutAct_9fa48("1382") ? false : (stryCov_9fa48("1382", "1383", "1384"), weekStart <= monthEnd)) {
      if (stryMutAct_9fa48("1385")) {
        {}
      } else {
        stryCov_9fa48("1385");
        const weekEnd = new Date(weekStart);
        stryMutAct_9fa48("1386") ? weekEnd.setTime(weekEnd.getDate() + 6) : (stryCov_9fa48("1386"), weekEnd.setDate(stryMutAct_9fa48("1387") ? weekEnd.getDate() - 6 : (stryCov_9fa48("1387"), weekEnd.getDate() + 6)));
        stryMutAct_9fa48("1388") ? weekEnd.setMinutes(23, 59, 59, 999) : (stryCov_9fa48("1388"), weekEnd.setHours(23, 59, 59, 999));
        const weekTxs = stryMutAct_9fa48("1389") ? transactions : (stryCov_9fa48("1389"), transactions.filter(t => {
          if (stryMutAct_9fa48("1390")) {
            {}
          } else {
            stryCov_9fa48("1390");
            if (stryMutAct_9fa48("1393") ? !t && !t.date : stryMutAct_9fa48("1392") ? false : stryMutAct_9fa48("1391") ? true : (stryCov_9fa48("1391", "1392", "1393"), (stryMutAct_9fa48("1394") ? t : (stryCov_9fa48("1394"), !t)) || (stryMutAct_9fa48("1395") ? t.date : (stryCov_9fa48("1395"), !t.date)))) return stryMutAct_9fa48("1396") ? true : (stryCov_9fa48("1396"), false);
            const date = new Date(t.date);
            return stryMutAct_9fa48("1399") ? date >= weekStart || date <= weekEnd : stryMutAct_9fa48("1398") ? false : stryMutAct_9fa48("1397") ? true : (stryCov_9fa48("1397", "1398", "1399"), (stryMutAct_9fa48("1402") ? date < weekStart : stryMutAct_9fa48("1401") ? date > weekStart : stryMutAct_9fa48("1400") ? true : (stryCov_9fa48("1400", "1401", "1402"), date >= weekStart)) && (stryMutAct_9fa48("1405") ? date > weekEnd : stryMutAct_9fa48("1404") ? date < weekEnd : stryMutAct_9fa48("1403") ? true : (stryCov_9fa48("1403", "1404", "1405"), date <= weekEnd)));
          }
        }));
        const income = stryMutAct_9fa48("1406") ? weekTxs.reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0) : (stryCov_9fa48("1406"), weekTxs.filter(stryMutAct_9fa48("1407") ? () => undefined : (stryCov_9fa48("1407"), t => stryMutAct_9fa48("1410") ? t || t.type === 'income' : stryMutAct_9fa48("1409") ? false : stryMutAct_9fa48("1408") ? true : (stryCov_9fa48("1408", "1409", "1410"), t && (stryMutAct_9fa48("1412") ? t.type !== 'income' : stryMutAct_9fa48("1411") ? true : (stryCov_9fa48("1411", "1412"), t.type === (stryMutAct_9fa48("1413") ? "" : (stryCov_9fa48("1413"), 'income'))))))).reduce(stryMutAct_9fa48("1414") ? () => undefined : (stryCov_9fa48("1414"), (sum, t) => stryMutAct_9fa48("1415") ? sum - fromCents(t.amountCents || 0) : (stryCov_9fa48("1415"), sum + fromCents(stryMutAct_9fa48("1418") ? t.amountCents && 0 : stryMutAct_9fa48("1417") ? false : stryMutAct_9fa48("1416") ? true : (stryCov_9fa48("1416", "1417", "1418"), t.amountCents || 0)))), 0));
        const expense = stryMutAct_9fa48("1419") ? weekTxs.reduce((sum, t) => sum + fromCents(t.amountCents || 0), 0) : (stryCov_9fa48("1419"), weekTxs.filter(stryMutAct_9fa48("1420") ? () => undefined : (stryCov_9fa48("1420"), t => stryMutAct_9fa48("1423") ? t || t.type === 'expense' : stryMutAct_9fa48("1422") ? false : stryMutAct_9fa48("1421") ? true : (stryCov_9fa48("1421", "1422", "1423"), t && (stryMutAct_9fa48("1425") ? t.type !== 'expense' : stryMutAct_9fa48("1424") ? true : (stryCov_9fa48("1424", "1425"), t.type === (stryMutAct_9fa48("1426") ? "" : (stryCov_9fa48("1426"), 'expense'))))))).reduce(stryMutAct_9fa48("1427") ? () => undefined : (stryCov_9fa48("1427"), (sum, t) => stryMutAct_9fa48("1428") ? sum - fromCents(t.amountCents || 0) : (stryCov_9fa48("1428"), sum + fromCents(stryMutAct_9fa48("1431") ? t.amountCents && 0 : stryMutAct_9fa48("1430") ? false : stryMutAct_9fa48("1429") ? true : (stryCov_9fa48("1429", "1430", "1431"), t.amountCents || 0)))), 0));
        const isCurrentWeek = stryMutAct_9fa48("1434") ? today >= weekStart || today <= weekEnd : stryMutAct_9fa48("1433") ? false : stryMutAct_9fa48("1432") ? true : (stryCov_9fa48("1432", "1433", "1434"), (stryMutAct_9fa48("1437") ? today < weekStart : stryMutAct_9fa48("1436") ? today > weekStart : stryMutAct_9fa48("1435") ? true : (stryCov_9fa48("1435", "1436", "1437"), today >= weekStart)) && (stryMutAct_9fa48("1440") ? today > weekEnd : stryMutAct_9fa48("1439") ? today < weekEnd : stryMutAct_9fa48("1438") ? true : (stryCov_9fa48("1438", "1439", "1440"), today <= weekEnd)));
        const label = (stryMutAct_9fa48("1443") ? isCurrentWeek || !referenceDate : stryMutAct_9fa48("1442") ? false : stryMutAct_9fa48("1441") ? true : (stryCov_9fa48("1441", "1442", "1443"), isCurrentWeek && (stryMutAct_9fa48("1444") ? referenceDate : (stryCov_9fa48("1444"), !referenceDate)))) ? stryMutAct_9fa48("1445") ? "" : (stryCov_9fa48("1445"), 'This Week') : formatDateLabel(weekStart);
        weeks.push(stryMutAct_9fa48("1446") ? {} : (stryCov_9fa48("1446"), {
          label,
          income,
          expense,
          net: stryMutAct_9fa48("1447") ? income + expense : (stryCov_9fa48("1447"), income - expense),
          weekStart: new Date(weekStart)
        }));
        weekStart = new Date(weekStart);
        stryMutAct_9fa48("1448") ? weekStart.setTime(weekStart.getDate() + 7) : (stryCov_9fa48("1448"), weekStart.setDate(stryMutAct_9fa48("1449") ? weekStart.getDate() - 7 : (stryCov_9fa48("1449"), weekStart.getDate() + 7)));
      }
    }
    return weeks;
  }
};
export const detectRecurring = (transactions: AnchorTransaction[]): RecurringTransactionGroup[] => {
  if (stryMutAct_9fa48("1450")) {
    {}
  } else {
    stryCov_9fa48("1450");
    const groups: Record<string, AnchorTransaction[]> = {};
    transactions.forEach(t => {
      if (stryMutAct_9fa48("1451")) {
        {}
      } else {
        stryCov_9fa48("1451");
        if (stryMutAct_9fa48("1454") ? (!t || t.type !== 'expense') && !t.title : stryMutAct_9fa48("1453") ? false : stryMutAct_9fa48("1452") ? true : (stryCov_9fa48("1452", "1453", "1454"), (stryMutAct_9fa48("1456") ? !t && t.type !== 'expense' : stryMutAct_9fa48("1455") ? false : (stryCov_9fa48("1455", "1456"), (stryMutAct_9fa48("1457") ? t : (stryCov_9fa48("1457"), !t)) || (stryMutAct_9fa48("1459") ? t.type === 'expense' : stryMutAct_9fa48("1458") ? false : (stryCov_9fa48("1458", "1459"), t.type !== (stryMutAct_9fa48("1460") ? "" : (stryCov_9fa48("1460"), 'expense')))))) || (stryMutAct_9fa48("1461") ? t.title : (stryCov_9fa48("1461"), !t.title)))) return;
        const key = stryMutAct_9fa48("1462") ? `` : (stryCov_9fa48("1462"), `${stryMutAct_9fa48("1464") ? t.title.toLowerCase() : stryMutAct_9fa48("1463") ? t.title.trim().toUpperCase() : (stryCov_9fa48("1463", "1464"), t.title.trim().toLowerCase())}-${stryMutAct_9fa48("1467") ? t.amountCents && 0 : stryMutAct_9fa48("1466") ? false : stryMutAct_9fa48("1465") ? true : (stryCov_9fa48("1465", "1466", "1467"), t.amountCents || 0)}`);
        if (stryMutAct_9fa48("1470") ? false : stryMutAct_9fa48("1469") ? true : stryMutAct_9fa48("1468") ? groups[key] : (stryCov_9fa48("1468", "1469", "1470"), !groups[key])) groups[key] = stryMutAct_9fa48("1471") ? ["Stryker was here"] : (stryCov_9fa48("1471"), []);
        groups[key].push(t);
      }
    });
    const recurring: RecurringTransactionGroup[] = stryMutAct_9fa48("1472") ? ["Stryker was here"] : (stryCov_9fa48("1472"), []);
    Object.values(groups).forEach(group => {
      if (stryMutAct_9fa48("1473")) {
        {}
      } else {
        stryCov_9fa48("1473");
        if (stryMutAct_9fa48("1477") ? group.length >= 2 : stryMutAct_9fa48("1476") ? group.length <= 2 : stryMutAct_9fa48("1475") ? false : stryMutAct_9fa48("1474") ? true : (stryCov_9fa48("1474", "1475", "1476", "1477"), group.length < 2)) return;
        const sorted = stryMutAct_9fa48("1478") ? group : (stryCov_9fa48("1478"), group.sort(stryMutAct_9fa48("1479") ? () => undefined : (stryCov_9fa48("1479"), (a, b) => stryMutAct_9fa48("1480") ? new Date(b.date).getTime() + new Date(a.date).getTime() : (stryCov_9fa48("1480"), new Date(b.date).getTime() - new Date(a.date).getTime()))));
        let gapSum = 0;
        for (let i = 0; stryMutAct_9fa48("1483") ? i >= sorted.length - 1 : stryMutAct_9fa48("1482") ? i <= sorted.length - 1 : stryMutAct_9fa48("1481") ? false : (stryCov_9fa48("1481", "1482", "1483"), i < (stryMutAct_9fa48("1484") ? sorted.length + 1 : (stryCov_9fa48("1484"), sorted.length - 1))); stryMutAct_9fa48("1485") ? i-- : (stryCov_9fa48("1485"), i++)) {
          if (stryMutAct_9fa48("1486")) {
            {}
          } else {
            stryCov_9fa48("1486");
            const d1 = new Date(sorted[i].date).getTime();
            const d2 = new Date(sorted[stryMutAct_9fa48("1487") ? i - 1 : (stryCov_9fa48("1487"), i + 1)].date).getTime();
            stryMutAct_9fa48("1488") ? gapSum -= (d1 - d2) / (1000 * 3600 * 24) : (stryCov_9fa48("1488"), gapSum += stryMutAct_9fa48("1489") ? (d1 - d2) * (1000 * 3600 * 24) : (stryCov_9fa48("1489"), (stryMutAct_9fa48("1490") ? d1 + d2 : (stryCov_9fa48("1490"), d1 - d2)) / (stryMutAct_9fa48("1491") ? 1000 * 3600 / 24 : (stryCov_9fa48("1491"), (stryMutAct_9fa48("1492") ? 1000 / 3600 : (stryCov_9fa48("1492"), 1000 * 3600)) * 24))));
          }
        }
        const avgGap = stryMutAct_9fa48("1493") ? gapSum * (sorted.length - 1) : (stryCov_9fa48("1493"), gapSum / (stryMutAct_9fa48("1494") ? sorted.length + 1 : (stryCov_9fa48("1494"), sorted.length - 1)));
        let frequency: 'monthly' | 'weekly' | 'irregular' = stryMutAct_9fa48("1495") ? "" : (stryCov_9fa48("1495"), 'irregular');
        if (stryMutAct_9fa48("1498") ? avgGap >= 26 || avgGap <= 32 : stryMutAct_9fa48("1497") ? false : stryMutAct_9fa48("1496") ? true : (stryCov_9fa48("1496", "1497", "1498"), (stryMutAct_9fa48("1501") ? avgGap < 26 : stryMutAct_9fa48("1500") ? avgGap > 26 : stryMutAct_9fa48("1499") ? true : (stryCov_9fa48("1499", "1500", "1501"), avgGap >= 26)) && (stryMutAct_9fa48("1504") ? avgGap > 32 : stryMutAct_9fa48("1503") ? avgGap < 32 : stryMutAct_9fa48("1502") ? true : (stryCov_9fa48("1502", "1503", "1504"), avgGap <= 32)))) frequency = stryMutAct_9fa48("1505") ? "" : (stryCov_9fa48("1505"), 'monthly');else if (stryMutAct_9fa48("1508") ? avgGap >= 6 || avgGap <= 8 : stryMutAct_9fa48("1507") ? false : stryMutAct_9fa48("1506") ? true : (stryCov_9fa48("1506", "1507", "1508"), (stryMutAct_9fa48("1511") ? avgGap < 6 : stryMutAct_9fa48("1510") ? avgGap > 6 : stryMutAct_9fa48("1509") ? true : (stryCov_9fa48("1509", "1510", "1511"), avgGap >= 6)) && (stryMutAct_9fa48("1514") ? avgGap > 8 : stryMutAct_9fa48("1513") ? avgGap < 8 : stryMutAct_9fa48("1512") ? true : (stryCov_9fa48("1512", "1513", "1514"), avgGap <= 8)))) frequency = stryMutAct_9fa48("1515") ? "" : (stryCov_9fa48("1515"), 'weekly');
        if (stryMutAct_9fa48("1518") ? frequency === 'irregular' : stryMutAct_9fa48("1517") ? false : stryMutAct_9fa48("1516") ? true : (stryCov_9fa48("1516", "1517", "1518"), frequency !== (stryMutAct_9fa48("1519") ? "" : (stryCov_9fa48("1519"), 'irregular')))) {
          if (stryMutAct_9fa48("1520")) {
            {}
          } else {
            stryCov_9fa48("1520");
            recurring.push(stryMutAct_9fa48("1521") ? {} : (stryCov_9fa48("1521"), {
              id: sorted[0].id,
              title: sorted[0].title,
              amountCents: stryMutAct_9fa48("1524") ? sorted[0].amountCents && 0 : stryMutAct_9fa48("1523") ? false : stryMutAct_9fa48("1522") ? true : (stryCov_9fa48("1522", "1523", "1524"), sorted[0].amountCents || 0),
              frequency,
              lastDate: sorted[0].date as string,
              count: group.length,
              avgGapDays: avgGap
            }));
          }
        }
      }
    });
    return stryMutAct_9fa48("1525") ? recurring : (stryCov_9fa48("1525"), recurring.sort(stryMutAct_9fa48("1526") ? () => undefined : (stryCov_9fa48("1526"), (a, b) => stryMutAct_9fa48("1527") ? (b.amountCents || 0) + (a.amountCents || 0) : (stryCov_9fa48("1527"), (stryMutAct_9fa48("1530") ? b.amountCents && 0 : stryMutAct_9fa48("1529") ? false : stryMutAct_9fa48("1528") ? true : (stryCov_9fa48("1528", "1529", "1530"), b.amountCents || 0)) - (stryMutAct_9fa48("1533") ? a.amountCents && 0 : stryMutAct_9fa48("1532") ? false : stryMutAct_9fa48("1531") ? true : (stryCov_9fa48("1531", "1532", "1533"), a.amountCents || 0))))));
  }
};