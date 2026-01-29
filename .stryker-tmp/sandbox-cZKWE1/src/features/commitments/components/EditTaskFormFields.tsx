/**
 * Edit Task Form - Type-Specific Field Components
 * 
 * Extracted from EditTaskForm.tsx to keep components under 200 lines.
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
import React from 'react';
import { Button } from '@anchor-os/ui';
import type { TimeOfDay } from '../../../types';
interface DailyFieldsProps {
  editTime: TimeOfDay;
  setEditTime: (time: TimeOfDay) => void;
}
export const DailyFields: React.FC<DailyFieldsProps> = stryMutAct_9fa48("2472") ? () => undefined : (stryCov_9fa48("2472"), (() => {
  const DailyFields: React.FC<DailyFieldsProps> = ({
    editTime,
    setEditTime
  }) => <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Time of Day</label>
        <div className="grid grid-cols-4 gap-2">
            {(['morning', 'afternoon', 'evening', 'any'] as TimeOfDay[]).map(stryMutAct_9fa48("2473") ? () => undefined : (stryCov_9fa48("2473"), t => <Button key={t} type="button" onClick={stryMutAct_9fa48("2474") ? () => undefined : (stryCov_9fa48("2474"), () => setEditTime(t))} variant={(stryMutAct_9fa48("2477") ? editTime !== t : stryMutAct_9fa48("2476") ? false : stryMutAct_9fa48("2475") ? true : (stryCov_9fa48("2475", "2476", "2477"), editTime === t)) ? stryMutAct_9fa48("2478") ? "" : (stryCov_9fa48("2478"), 'secondary') : stryMutAct_9fa48("2479") ? "" : (stryCov_9fa48("2479"), 'ghost')} className={stryMutAct_9fa48("2480") ? `` : (stryCov_9fa48("2480"), `px-0 text-[10px] capitalize h-9 ${(stryMutAct_9fa48("2483") ? editTime !== t : stryMutAct_9fa48("2482") ? false : stryMutAct_9fa48("2481") ? true : (stryCov_9fa48("2481", "2482", "2483"), editTime === t)) ? stryMutAct_9fa48("2484") ? "" : (stryCov_9fa48("2484"), 'bg-task-50 text-task-600 border-task-200 dark:bg-task-900/20 dark:border-task-800') : stryMutAct_9fa48("2485") ? "Stryker was here!" : (stryCov_9fa48("2485"), '')}`)}>
                    {t}
                </Button>))}
        </div>
    </div>;
  return DailyFields;
})());
interface WeeklyFieldsProps {
  editDays: string[];
  setEditDays: React.Dispatch<React.SetStateAction<string[]>>;
}
export const WeeklyFields: React.FC<WeeklyFieldsProps> = stryMutAct_9fa48("2486") ? () => undefined : (stryCov_9fa48("2486"), (() => {
  const WeeklyFields: React.FC<WeeklyFieldsProps> = ({
    editDays,
    setEditDays
  }) => <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Days</label>
        <div className="flex flex-wrap gap-1.5">
            {(stryMutAct_9fa48("2487") ? [] : (stryCov_9fa48("2487"), [stryMutAct_9fa48("2488") ? "" : (stryCov_9fa48("2488"), 'Monday'), stryMutAct_9fa48("2489") ? "" : (stryCov_9fa48("2489"), 'Tuesday'), stryMutAct_9fa48("2490") ? "" : (stryCov_9fa48("2490"), 'Wednesday'), stryMutAct_9fa48("2491") ? "" : (stryCov_9fa48("2491"), 'Thursday'), stryMutAct_9fa48("2492") ? "" : (stryCov_9fa48("2492"), 'Friday'), stryMutAct_9fa48("2493") ? "" : (stryCov_9fa48("2493"), 'Saturday'), stryMutAct_9fa48("2494") ? "" : (stryCov_9fa48("2494"), 'Sunday')])).map(stryMutAct_9fa48("2495") ? () => undefined : (stryCov_9fa48("2495"), day => <Button key={day} type="button" onClick={stryMutAct_9fa48("2496") ? () => undefined : (stryCov_9fa48("2496"), () => setEditDays(stryMutAct_9fa48("2497") ? () => undefined : (stryCov_9fa48("2497"), prev => prev.includes(day) ? stryMutAct_9fa48("2498") ? prev : (stryCov_9fa48("2498"), prev.filter(stryMutAct_9fa48("2499") ? () => undefined : (stryCov_9fa48("2499"), d => stryMutAct_9fa48("2502") ? d === day : stryMutAct_9fa48("2501") ? false : stryMutAct_9fa48("2500") ? true : (stryCov_9fa48("2500", "2501", "2502"), d !== day)))) : stryMutAct_9fa48("2503") ? [] : (stryCov_9fa48("2503"), [...prev, day]))))} variant={editDays.includes(day) ? stryMutAct_9fa48("2504") ? "" : (stryCov_9fa48("2504"), 'primary') : stryMutAct_9fa48("2505") ? "" : (stryCov_9fa48("2505"), 'secondary')} className={stryMutAct_9fa48("2506") ? `` : (stryCov_9fa48("2506"), `h-8 px-3 text-[10px] ${editDays.includes(day) ? stryMutAct_9fa48("2507") ? "" : (stryCov_9fa48("2507"), 'bg-purple-600') : stryMutAct_9fa48("2508") ? "Stryker was here!" : (stryCov_9fa48("2508"), '')}`)}>
                    {stryMutAct_9fa48("2509") ? day : (stryCov_9fa48("2509"), day.slice(0, 3))}
                </Button>))}
        </div>
    </div>;
  return WeeklyFields;
})());
interface MonthlyFieldsProps {
  editDaysOfMonth: number[];
  setEditDaysOfMonth: React.Dispatch<React.SetStateAction<number[]>>;
}
export const MonthlyFields: React.FC<MonthlyFieldsProps> = stryMutAct_9fa48("2510") ? () => undefined : (stryCov_9fa48("2510"), (() => {
  const MonthlyFields: React.FC<MonthlyFieldsProps> = ({
    editDaysOfMonth,
    setEditDaysOfMonth
  }) => <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Day(s) of Month</label>
        <div className="grid grid-cols-7 gap-1">
            {Array.from(stryMutAct_9fa48("2511") ? {} : (stryCov_9fa48("2511"), {
        length: 31
      }), stryMutAct_9fa48("2512") ? () => undefined : (stryCov_9fa48("2512"), (_, i) => stryMutAct_9fa48("2513") ? i - 1 : (stryCov_9fa48("2513"), i + 1))).map(stryMutAct_9fa48("2514") ? () => undefined : (stryCov_9fa48("2514"), d => <button key={d} type="button" onClick={() => {
        if (stryMutAct_9fa48("2515")) {
          {}
        } else {
          stryCov_9fa48("2515");
          setEditDaysOfMonth(stryMutAct_9fa48("2516") ? () => undefined : (stryCov_9fa48("2516"), prev => prev.includes(d) ? stryMutAct_9fa48("2517") ? prev : (stryCov_9fa48("2517"), prev.filter(stryMutAct_9fa48("2518") ? () => undefined : (stryCov_9fa48("2518"), day => stryMutAct_9fa48("2521") ? day === d : stryMutAct_9fa48("2520") ? false : stryMutAct_9fa48("2519") ? true : (stryCov_9fa48("2519", "2520", "2521"), day !== d)))) : stryMutAct_9fa48("2522") ? [] : (stryCov_9fa48("2522"), [...prev, d])));
        }
      }} className={stryMutAct_9fa48("2523") ? `` : (stryCov_9fa48("2523"), `w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${editDaysOfMonth.includes(d) ? stryMutAct_9fa48("2524") ? "" : (stryCov_9fa48("2524"), 'bg-task-600 text-white border-transparent shadow-md') : stryMutAct_9fa48("2525") ? "" : (stryCov_9fa48("2525"), 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-task-300')}`)}>
                    {d}
                </button>))}
        </div>
    </div>;
  return MonthlyFields;
})());