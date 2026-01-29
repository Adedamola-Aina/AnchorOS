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
import { Sunrise, Sun, Moon, Calendar } from 'lucide-react';
import type { AnchorTask } from '../../types';
export { ThemeToggle } from './ThemeToggle';
export { CategoryIcon } from './CategoryIcon';
export { FabricSuggestionToast, FabricSuggestionContainer } from './FabricSuggestionToast';
export { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

// formatCurrency moved to ../../utils/format.ts

export const SectionHeader = stryMutAct_9fa48("1385") ? () => undefined : (stryCov_9fa48("1385"), (() => {
  const SectionHeader = ({
    title,
    subtitle,
    action
  }: {
    title: string;
    subtitle: string;
    action?: React.ReactNode;
  }) => <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
    <div>
      <h2 className="text-h2 lg:text-h2-lg tracking-tight text-slate-900 dark:text-white">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>
    </div>
    {action}
  </div>;
  return SectionHeader;
})());
export const Badge = ({
  children,
  type,
  variant = stryMutAct_9fa48("1386") ? "" : (stryCov_9fa48("1386"), 'solid')
}: {
  children: React.ReactNode;
  type: string;
  variant?: 'solid' | 'outline';
}) => {
  if (stryMutAct_9fa48("1387")) {
    {}
  } else {
    stryCov_9fa48("1387");
    const styles: Record<string, string> = stryMutAct_9fa48("1388") ? {} : (stryCov_9fa48("1388"), {
      personal: stryMutAct_9fa48("1389") ? "" : (stryCov_9fa48("1389"), 'bg-anchor-personal-light text-anchor-personal dark:bg-anchor-personal-dark/30 dark:text-anchor-personal-light'),
      family: stryMutAct_9fa48("1390") ? "" : (stryCov_9fa48("1390"), 'bg-anchor-family-light text-anchor-family dark:bg-anchor-family-dark/30 dark:text-anchor-family-light'),
      checking: stryMutAct_9fa48("1391") ? "" : (stryCov_9fa48("1391"), 'bg-anchor-success-light text-anchor-success dark:bg-anchor-success-dark/30 dark:text-anchor-success-light'),
      savings: stryMutAct_9fa48("1392") ? "" : (stryCov_9fa48("1392"), 'bg-anchor-finance-light text-anchor-finance dark:bg-anchor-finance-dark/30 dark:text-anchor-finance-light'),
      todo: stryMutAct_9fa48("1393") ? "" : (stryCov_9fa48("1393"), 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300')
    });
    const baseStyle = stryMutAct_9fa48("1396") ? styles[type] && styles.todo : stryMutAct_9fa48("1395") ? false : stryMutAct_9fa48("1394") ? true : (stryCov_9fa48("1394", "1395", "1396"), styles[type] || styles.todo);
    const finalStyle = (stryMutAct_9fa48("1399") ? variant !== 'outline' : stryMutAct_9fa48("1398") ? false : stryMutAct_9fa48("1397") ? true : (stryCov_9fa48("1397", "1398", "1399"), variant === (stryMutAct_9fa48("1400") ? "" : (stryCov_9fa48("1400"), 'outline')))) ? stryMutAct_9fa48("1401") ? `` : (stryCov_9fa48("1401"), `border ${baseStyle.replace(stryMutAct_9fa48("1402") ? "" : (stryCov_9fa48("1402"), 'bg-'), stryMutAct_9fa48("1403") ? "" : (stryCov_9fa48("1403"), 'border-')).replace(stryMutAct_9fa48("1404") ? "" : (stryCov_9fa48("1404"), 'text-'), stryMutAct_9fa48("1405") ? "" : (stryCov_9fa48("1405"), 'text-'))} bg-transparent`) : baseStyle;
    return <span className={stryMutAct_9fa48("1406") ? `` : (stryCov_9fa48("1406"), `px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${finalStyle}`)}>{children}</span>;
  }
};
export const TaskContextBadge = ({
  task
}: {
  task: AnchorTask;
}) => {
  if (stryMutAct_9fa48("1407")) {
    {}
  } else {
    stryCov_9fa48("1407");
    const commonStyles = stryMutAct_9fa48("1408") ? "" : (stryCov_9fa48("1408"), "flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md capitalize");
    const content = (() => {
      if (stryMutAct_9fa48("1409")) {
        {}
      } else {
        stryCov_9fa48("1409");
        if (stryMutAct_9fa48("1412") ? task.type === 'daily' && task.timeOfDay || task.timeOfDay !== 'any' : stryMutAct_9fa48("1411") ? false : stryMutAct_9fa48("1410") ? true : (stryCov_9fa48("1410", "1411", "1412"), (stryMutAct_9fa48("1414") ? task.type === 'daily' || task.timeOfDay : stryMutAct_9fa48("1413") ? true : (stryCov_9fa48("1413", "1414"), (stryMutAct_9fa48("1416") ? task.type !== 'daily' : stryMutAct_9fa48("1415") ? true : (stryCov_9fa48("1415", "1416"), task.type === (stryMutAct_9fa48("1417") ? "" : (stryCov_9fa48("1417"), 'daily')))) && task.timeOfDay)) && (stryMutAct_9fa48("1419") ? task.timeOfDay === 'any' : stryMutAct_9fa48("1418") ? true : (stryCov_9fa48("1418", "1419"), task.timeOfDay !== (stryMutAct_9fa48("1420") ? "" : (stryCov_9fa48("1420"), 'any')))))) {
          if (stryMutAct_9fa48("1421")) {
            {}
          } else {
            stryCov_9fa48("1421");
            const icons = stryMutAct_9fa48("1422") ? {} : (stryCov_9fa48("1422"), {
              morning: <Sunrise className="w-3 h-3" />,
              afternoon: <Sun className="w-3 h-3" />,
              evening: <Moon className="w-3 h-3" />
            });
            return <span className={stryMutAct_9fa48("1423") ? `` : (stryCov_9fa48("1423"), `${commonStyles} text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800`)}>{icons[task.timeOfDay]} {task.timeOfDay}</span>;
          }
        }
        if (stryMutAct_9fa48("1426") ? task.type === 'weekly' && task.daysOfWeek || task.daysOfWeek.length > 0 : stryMutAct_9fa48("1425") ? false : stryMutAct_9fa48("1424") ? true : (stryCov_9fa48("1424", "1425", "1426"), (stryMutAct_9fa48("1428") ? task.type === 'weekly' || task.daysOfWeek : stryMutAct_9fa48("1427") ? true : (stryCov_9fa48("1427", "1428"), (stryMutAct_9fa48("1430") ? task.type !== 'weekly' : stryMutAct_9fa48("1429") ? true : (stryCov_9fa48("1429", "1430"), task.type === (stryMutAct_9fa48("1431") ? "" : (stryCov_9fa48("1431"), 'weekly')))) && task.daysOfWeek)) && (stryMutAct_9fa48("1434") ? task.daysOfWeek.length <= 0 : stryMutAct_9fa48("1433") ? task.daysOfWeek.length >= 0 : stryMutAct_9fa48("1432") ? true : (stryCov_9fa48("1432", "1433", "1434"), task.daysOfWeek.length > 0)))) {
          if (stryMutAct_9fa48("1435")) {
            {}
          } else {
            stryCov_9fa48("1435");
            const dayShortnames = stryMutAct_9fa48("1436") ? {} : (stryCov_9fa48("1436"), {
              'Sunday': stryMutAct_9fa48("1437") ? "" : (stryCov_9fa48("1437"), 'Sun'),
              'Monday': stryMutAct_9fa48("1438") ? "" : (stryCov_9fa48("1438"), 'Mon'),
              'Tuesday': stryMutAct_9fa48("1439") ? "" : (stryCov_9fa48("1439"), 'Tue'),
              'Wednesday': stryMutAct_9fa48("1440") ? "" : (stryCov_9fa48("1440"), 'Wed'),
              'Thursday': stryMutAct_9fa48("1441") ? "" : (stryCov_9fa48("1441"), 'Thu'),
              'Friday': stryMutAct_9fa48("1442") ? "" : (stryCov_9fa48("1442"), 'Fri'),
              'Saturday': stryMutAct_9fa48("1443") ? "" : (stryCov_9fa48("1443"), 'Sat')
            });
            const formattedDays = task.daysOfWeek.map(stryMutAct_9fa48("1444") ? () => undefined : (stryCov_9fa48("1444"), d => stryMutAct_9fa48("1447") ? dayShortnames[d as keyof typeof dayShortnames] && d : stryMutAct_9fa48("1446") ? false : stryMutAct_9fa48("1445") ? true : (stryCov_9fa48("1445", "1446", "1447"), dayShortnames[d as keyof typeof dayShortnames] || d))).join(stryMutAct_9fa48("1448") ? "" : (stryCov_9fa48("1448"), ', '));
            return <span className={stryMutAct_9fa48("1449") ? `` : (stryCov_9fa48("1449"), `${commonStyles} text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20`)}><Calendar className="w-3 h-3" /> {formattedDays}</span>;
          }
        }
        if (stryMutAct_9fa48("1452") ? task.type === 'monthly' || task.daysOfMonth?.length || task.dayOfMonth : stryMutAct_9fa48("1451") ? false : stryMutAct_9fa48("1450") ? true : (stryCov_9fa48("1450", "1451", "1452"), (stryMutAct_9fa48("1454") ? task.type !== 'monthly' : stryMutAct_9fa48("1453") ? true : (stryCov_9fa48("1453", "1454"), task.type === (stryMutAct_9fa48("1455") ? "" : (stryCov_9fa48("1455"), 'monthly')))) && (stryMutAct_9fa48("1457") ? task.daysOfMonth?.length && task.dayOfMonth : stryMutAct_9fa48("1456") ? true : (stryCov_9fa48("1456", "1457"), (stryMutAct_9fa48("1458") ? task.daysOfMonth.length : (stryCov_9fa48("1458"), task.daysOfMonth?.length)) || task.dayOfMonth)))) {
          if (stryMutAct_9fa48("1459")) {
            {}
          } else {
            stryCov_9fa48("1459");
            const dates = (stryMutAct_9fa48("1460") ? task.daysOfMonth.length : (stryCov_9fa48("1460"), task.daysOfMonth?.length)) ? task.daysOfMonth : task.dayOfMonth ? stryMutAct_9fa48("1461") ? [] : (stryCov_9fa48("1461"), [task.dayOfMonth]) : stryMutAct_9fa48("1462") ? ["Stryker was here"] : (stryCov_9fa48("1462"), []);
            const formatted = stryMutAct_9fa48("1463") ? [...dates].join(', ') : (stryCov_9fa48("1463"), (stryMutAct_9fa48("1464") ? [] : (stryCov_9fa48("1464"), [...dates])).sort(stryMutAct_9fa48("1465") ? () => undefined : (stryCov_9fa48("1465"), (a, b) => stryMutAct_9fa48("1466") ? a + b : (stryCov_9fa48("1466"), a - b))).join(stryMutAct_9fa48("1467") ? "" : (stryCov_9fa48("1467"), ', ')));
            return <span className={stryMutAct_9fa48("1468") ? `` : (stryCov_9fa48("1468"), `${commonStyles} text-task-600 dark:text-task-400 bg-task-50 dark:bg-task-900/20`)}><Calendar className="w-3 h-3" /> {(stryMutAct_9fa48("1472") ? dates.length <= 1 : stryMutAct_9fa48("1471") ? dates.length >= 1 : stryMutAct_9fa48("1470") ? false : stryMutAct_9fa48("1469") ? true : (stryCov_9fa48("1469", "1470", "1471", "1472"), dates.length > 1)) ? stryMutAct_9fa48("1473") ? "" : (stryCov_9fa48("1473"), 'Days') : stryMutAct_9fa48("1474") ? "" : (stryCov_9fa48("1474"), 'Day')} {formatted}</span>;
          }
        }
        return null;
      }
    })();
    return <div className="flex items-center gap-2">
      {stryMutAct_9fa48("1477") ? task.domain || <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          {task.domain}
        </span> : stryMutAct_9fa48("1476") ? false : stryMutAct_9fa48("1475") ? true : (stryCov_9fa48("1475", "1476", "1477"), task.domain && <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          {task.domain}
        </span>)}
      {content}
    </div>;
  }
};
export const AnchorLogo = stryMutAct_9fa48("1478") ? () => undefined : (stryCov_9fa48("1478"), (() => {
  const AnchorLogo = ({
    className = stryMutAct_9fa48("1479") ? "" : (stryCov_9fa48("1479"), "w-8 h-8"),
    strokeWidth = 8
  }: {
    className?: string;
    strokeWidth?: number;
  }) => <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="22" r="10" stroke="currentColor" strokeWidth={strokeWidth} />
    <line x1="50" y1="32" x2="50" y2="85" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M20 58 C20 85 80 85 80 58" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
    <line x1="20" y1="58" x2="20" y2="48" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="80" y1="58" x2="80" y2="48" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>;
  return AnchorLogo;
})());