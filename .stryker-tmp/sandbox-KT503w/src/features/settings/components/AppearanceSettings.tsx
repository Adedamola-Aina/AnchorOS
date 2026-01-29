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
import { Moon, Sun } from 'lucide-react';
import { ThemeToggle } from '../../../components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
export type Theme = 'light' | 'dark';
interface AppearanceSettingsProps {
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
}
export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  theme,
  onSetTheme
}) => {
  if (stryMutAct_9fa48("5635")) {
    {}
  } else {
    stryCov_9fa48("5635");
    const getThemeIcon = () => {
      if (stryMutAct_9fa48("5636")) {
        {}
      } else {
        stryCov_9fa48("5636");
        switch (theme) {
          case stryMutAct_9fa48("5638") ? "" : (stryCov_9fa48("5638"), 'light'):
            if (stryMutAct_9fa48("5637")) {} else {
              stryCov_9fa48("5637");
              return <Sun className="w-5 h-5 text-amber-500" strokeWidth={2} />;
            }
          case stryMutAct_9fa48("5640") ? "" : (stryCov_9fa48("5640"), 'dark'):
            if (stryMutAct_9fa48("5639")) {} else {
              stryCov_9fa48("5639");
              return <Moon className="w-5 h-5 text-primary-500" strokeWidth={2} />;
            }
        }
      }
    };
    return <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className={stryMutAct_9fa48("5641") ? `` : (stryCov_9fa48("5641"), `p-2 rounded-lg ${(stryMutAct_9fa48("5644") ? theme !== 'light' : stryMutAct_9fa48("5643") ? false : stryMutAct_9fa48("5642") ? true : (stryCov_9fa48("5642", "5643", "5644"), theme === (stryMutAct_9fa48("5645") ? "" : (stryCov_9fa48("5645"), 'light')))) ? stryMutAct_9fa48("5646") ? "" : (stryCov_9fa48("5646"), 'bg-amber-500/10') : stryMutAct_9fa48("5647") ? "" : (stryCov_9fa48("5647"), 'bg-primary-500/10')}`)}>
                        {getThemeIcon()}
                    </div>
                    Appearance
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Visual Theme</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Choose Light or Dark mode for your preferred viewing experience.
                        </p>
                    </div>
                    <ThemeToggle theme={theme} onSetTheme={onSetTheme} />
                </div>
            </CardContent>
        </Card>;
  }
};