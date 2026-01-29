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
import { Sun, Moon } from 'lucide-react';
export type Theme = 'light' | 'dark';
interface ThemeToggleProps {
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
  variant?: 'full' | 'minimal';
}
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onSetTheme,
  variant = stryMutAct_9fa48("1341") ? "" : (stryCov_9fa48("1341"), 'full')
}) => {
  if (stryMutAct_9fa48("1342")) {
    {}
  } else {
    stryCov_9fa48("1342");
    const themes: {
      value: Theme;
      icon: typeof Sun;
      label: string;
    }[] = stryMutAct_9fa48("1343") ? [] : (stryCov_9fa48("1343"), [stryMutAct_9fa48("1344") ? {} : (stryCov_9fa48("1344"), {
      value: stryMutAct_9fa48("1345") ? "" : (stryCov_9fa48("1345"), 'light'),
      icon: Sun,
      label: stryMutAct_9fa48("1346") ? "" : (stryCov_9fa48("1346"), 'Light')
    }), stryMutAct_9fa48("1347") ? {} : (stryCov_9fa48("1347"), {
      value: stryMutAct_9fa48("1348") ? "" : (stryCov_9fa48("1348"), 'dark'),
      icon: Moon,
      label: stryMutAct_9fa48("1349") ? "" : (stryCov_9fa48("1349"), 'Dark')
    })]);
    return <div className={stryMutAct_9fa48("1350") ? `` : (stryCov_9fa48("1350"), `flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner transition-all duration-300 ${(stryMutAct_9fa48("1353") ? variant !== 'minimal' : stryMutAct_9fa48("1352") ? false : stryMutAct_9fa48("1351") ? true : (stryCov_9fa48("1351", "1352", "1353"), variant === (stryMutAct_9fa48("1354") ? "" : (stryCov_9fa48("1354"), 'minimal')))) ? stryMutAct_9fa48("1355") ? "" : (stryCov_9fa48("1355"), 'scale-90') : stryMutAct_9fa48("1356") ? "Stryker was here!" : (stryCov_9fa48("1356"), '')}`)}>
            {themes.map(({
        value,
        icon: Icon,
        label
      }) => {
        if (stryMutAct_9fa48("1357")) {
          {}
        } else {
          stryCov_9fa48("1357");
          const isActive = stryMutAct_9fa48("1360") ? theme !== value : stryMutAct_9fa48("1359") ? false : stryMutAct_9fa48("1358") ? true : (stryCov_9fa48("1358", "1359", "1360"), theme === value);
          return <button key={value} type="button" onClick={stryMutAct_9fa48("1361") ? () => undefined : (stryCov_9fa48("1361"), () => onSetTheme(value))} className={stryMutAct_9fa48("1362") ? `` : (stryCov_9fa48("1362"), `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-[10px] font-black uppercase tracking-widest ${isActive ? (stryMutAct_9fa48("1365") ? value !== 'light' : stryMutAct_9fa48("1364") ? false : stryMutAct_9fa48("1363") ? true : (stryCov_9fa48("1363", "1364", "1365"), value === (stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), 'light')))) ? stryMutAct_9fa48("1367") ? "" : (stryCov_9fa48("1367"), 'bg-white text-slate-900 shadow-md') : stryMutAct_9fa48("1368") ? "" : (stryCov_9fa48("1368"), 'bg-slate-700 dark:bg-slate-700 text-white shadow-md') : stryMutAct_9fa48("1369") ? "" : (stryCov_9fa48("1369"), 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}`)} aria-label={stryMutAct_9fa48("1370") ? `` : (stryCov_9fa48("1370"), `${label} theme`)} aria-pressed={isActive}>
                        <Icon className={stryMutAct_9fa48("1371") ? `` : (stryCov_9fa48("1371"), `w-3.5 h-3.5 ${isActive ? (stryMutAct_9fa48("1374") ? value !== 'light' : stryMutAct_9fa48("1373") ? false : stryMutAct_9fa48("1372") ? true : (stryCov_9fa48("1372", "1373", "1374"), value === (stryMutAct_9fa48("1375") ? "" : (stryCov_9fa48("1375"), 'light')))) ? stryMutAct_9fa48("1376") ? "" : (stryCov_9fa48("1376"), 'text-amber-500') : stryMutAct_9fa48("1377") ? "" : (stryCov_9fa48("1377"), 'text-primary-400') : stryMutAct_9fa48("1378") ? "Stryker was here!" : (stryCov_9fa48("1378"), '')}`)} strokeWidth={2} />
                        {stryMutAct_9fa48("1381") ? variant === 'full' || <span>{label}</span> : stryMutAct_9fa48("1380") ? false : stryMutAct_9fa48("1379") ? true : (stryCov_9fa48("1379", "1380", "1381"), (stryMutAct_9fa48("1383") ? variant !== 'full' : stryMutAct_9fa48("1382") ? true : (stryCov_9fa48("1382", "1383"), variant === (stryMutAct_9fa48("1384") ? "" : (stryCov_9fa48("1384"), 'full')))) && <span>{label}</span>)}
                    </button>;
        }
      })}
        </div>;
  }
};