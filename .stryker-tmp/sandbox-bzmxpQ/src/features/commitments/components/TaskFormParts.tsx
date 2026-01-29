/**
 * TaskForm Wizard Steps & Field Components
 * Extracted from TaskForm.tsx per CLAUDE.md §3.2
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
import { X, Sunrise, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import type { TaskType, TimeOfDay } from '../../../types';
interface FrequencyStepProps {
  onSelectType: (type: TaskType) => void;
  onClose: () => void;
}
export const FrequencyStep: React.FC<FrequencyStepProps> = ({
  onSelectType,
  onClose
}) => {
  if (stryMutAct_9fa48("2611")) {
    {}
  } else {
    stryCov_9fa48("2611");
    const options = stryMutAct_9fa48("2612") ? [] : (stryCov_9fa48("2612"), [stryMutAct_9fa48("2613") ? {} : (stryCov_9fa48("2613"), {
      id: stryMutAct_9fa48("2614") ? "" : (stryCov_9fa48("2614"), 'todo'),
      label: stryMutAct_9fa48("2615") ? "" : (stryCov_9fa48("2615"), 'Todo'),
      desc: stryMutAct_9fa48("2616") ? "" : (stryCov_9fa48("2616"), 'One-time task'),
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />
    }), stryMutAct_9fa48("2617") ? {} : (stryCov_9fa48("2617"), {
      id: stryMutAct_9fa48("2618") ? "" : (stryCov_9fa48("2618"), 'daily'),
      label: stryMutAct_9fa48("2619") ? "" : (stryCov_9fa48("2619"), 'Daily'),
      desc: stryMutAct_9fa48("2620") ? "" : (stryCov_9fa48("2620"), 'Every single day'),
      icon: <Sunrise className="w-6 h-6 text-task-500" />
    }), stryMutAct_9fa48("2621") ? {} : (stryCov_9fa48("2621"), {
      id: stryMutAct_9fa48("2622") ? "" : (stryCov_9fa48("2622"), 'weekly'),
      label: stryMutAct_9fa48("2623") ? "" : (stryCov_9fa48("2623"), 'Weekly'),
      desc: stryMutAct_9fa48("2624") ? "" : (stryCov_9fa48("2624"), 'On specific days'),
      icon: <Calendar className="w-6 h-6 text-purple-500" />
    }), stryMutAct_9fa48("2625") ? {} : (stryCov_9fa48("2625"), {
      id: stryMutAct_9fa48("2626") ? "" : (stryCov_9fa48("2626"), 'monthly'),
      label: stryMutAct_9fa48("2627") ? "" : (stryCov_9fa48("2627"), 'Monthly'),
      desc: stryMutAct_9fa48("2628") ? "" : (stryCov_9fa48("2628"), 'On a specific date'),
      icon: <CheckCircle2 className="w-6 h-6 text-task-500" />
    })]);
    return <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">Choose Frequency</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400"><X className="w-5 h-5" /></Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {options.map(stryMutAct_9fa48("2629") ? () => undefined : (stryCov_9fa48("2629"), option => <button key={option.id} onClick={stryMutAct_9fa48("2630") ? () => undefined : (stryCov_9fa48("2630"), () => onSelectType(option.id as TaskType))} className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-task-500/50 hover:bg-task-50/50 dark:hover:bg-task-900/10 transition-all text-center group">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">{option.icon}</div>
                        <div><h4 className="font-bold text-slate-900 dark:text-white">{option.label}</h4><p className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</p></div>
                    </button>))}
            </div>
        </div>;
  }
};
interface DetailsHeaderProps {
  taskType: TaskType;
  onBack: () => void;
  onClose: () => void;
}
export const DetailsHeader: React.FC<DetailsHeaderProps> = stryMutAct_9fa48("2631") ? () => undefined : (stryCov_9fa48("2631"), (() => {
  const DetailsHeader: React.FC<DetailsHeaderProps> = ({
    taskType,
    onBack,
    onClose
  }) => <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <Button type="button" variant="ghost" size="icon" onClick={onBack} className="text-slate-400"><ChevronDown className="w-5 h-5 rotate-90" /></Button>
            <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white capitalize">{taskType} Commitment</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400"><X className="w-5 h-5" /></Button>
    </div>;
  return DetailsHeader;
})());
interface DailyTimeFieldProps {
  value: TimeOfDay;
  onChange: (v: TimeOfDay) => void;
}
export const DailyTimeField: React.FC<DailyTimeFieldProps> = stryMutAct_9fa48("2632") ? () => undefined : (stryCov_9fa48("2632"), (() => {
  const DailyTimeField: React.FC<DailyTimeFieldProps> = ({
    value,
    onChange
  }) => <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Time</label>
        <div className="grid grid-cols-2 gap-2">
            {(stryMutAct_9fa48("2633") ? [] : (stryCov_9fa48("2633"), [stryMutAct_9fa48("2634") ? "" : (stryCov_9fa48("2634"), 'morning'), stryMutAct_9fa48("2635") ? "" : (stryCov_9fa48("2635"), 'afternoon'), stryMutAct_9fa48("2636") ? "" : (stryCov_9fa48("2636"), 'evening'), stryMutAct_9fa48("2637") ? "" : (stryCov_9fa48("2637"), 'any')])).map(stryMutAct_9fa48("2638") ? () => undefined : (stryCov_9fa48("2638"), t => <Button key={t} type="button" onClick={stryMutAct_9fa48("2639") ? () => undefined : (stryCov_9fa48("2639"), () => onChange(t as TimeOfDay))} variant={(stryMutAct_9fa48("2642") ? value !== t : stryMutAct_9fa48("2641") ? false : stryMutAct_9fa48("2640") ? true : (stryCov_9fa48("2640", "2641", "2642"), value === t)) ? stryMutAct_9fa48("2643") ? "" : (stryCov_9fa48("2643"), 'secondary') : stryMutAct_9fa48("2644") ? "" : (stryCov_9fa48("2644"), 'ghost')} className={stryMutAct_9fa48("2645") ? `` : (stryCov_9fa48("2645"), `p-2.5 capitalize ${(stryMutAct_9fa48("2648") ? value !== t : stryMutAct_9fa48("2647") ? false : stryMutAct_9fa48("2646") ? true : (stryCov_9fa48("2646", "2647", "2648"), value === t)) ? stryMutAct_9fa48("2649") ? "" : (stryCov_9fa48("2649"), 'bg-task-50 text-task-600 border-task-200 dark:bg-task-900/20 dark:border-task-800') : stryMutAct_9fa48("2650") ? "Stryker was here!" : (stryCov_9fa48("2650"), '')}`)}>{t}</Button>))}
        </div>
    </div>;
  return DailyTimeField;
})());
interface WeeklyDaysFieldProps {
  value: string[];
  onChange: (days: string[]) => void;
}
export const WeeklyDaysField: React.FC<WeeklyDaysFieldProps> = stryMutAct_9fa48("2651") ? () => undefined : (stryCov_9fa48("2651"), (() => {
  const WeeklyDaysField: React.FC<WeeklyDaysFieldProps> = ({
    value,
    onChange
  }) => <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">On which days?</label>
        <div className="flex justify-between gap-1">
            {(stryMutAct_9fa48("2652") ? [] : (stryCov_9fa48("2652"), [stryMutAct_9fa48("2653") ? "" : (stryCov_9fa48("2653"), 'Sunday'), stryMutAct_9fa48("2654") ? "" : (stryCov_9fa48("2654"), 'Monday'), stryMutAct_9fa48("2655") ? "" : (stryCov_9fa48("2655"), 'Tuesday'), stryMutAct_9fa48("2656") ? "" : (stryCov_9fa48("2656"), 'Wednesday'), stryMutAct_9fa48("2657") ? "" : (stryCov_9fa48("2657"), 'Thursday'), stryMutAct_9fa48("2658") ? "" : (stryCov_9fa48("2658"), 'Friday'), stryMutAct_9fa48("2659") ? "" : (stryCov_9fa48("2659"), 'Saturday')])).map(stryMutAct_9fa48("2660") ? () => undefined : (stryCov_9fa48("2660"), d => <button key={d} type="button" onClick={stryMutAct_9fa48("2661") ? () => undefined : (stryCov_9fa48("2661"), () => onChange(value.includes(d) ? stryMutAct_9fa48("2662") ? value : (stryCov_9fa48("2662"), value.filter(stryMutAct_9fa48("2663") ? () => undefined : (stryCov_9fa48("2663"), day => stryMutAct_9fa48("2666") ? day === d : stryMutAct_9fa48("2665") ? false : stryMutAct_9fa48("2664") ? true : (stryCov_9fa48("2664", "2665", "2666"), day !== d)))) : stryMutAct_9fa48("2667") ? [] : (stryCov_9fa48("2667"), [...value, d])))} className={stryMutAct_9fa48("2668") ? `` : (stryCov_9fa48("2668"), `w-10 h-10 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${value.includes(d) ? stryMutAct_9fa48("2669") ? "" : (stryCov_9fa48("2669"), 'bg-purple-600 text-white border-transparent') : stryMutAct_9fa48("2670") ? "" : (stryCov_9fa48("2670"), 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-purple-300')}`)}>{d[0]}</button>))}
        </div>
    </div>;
  return WeeklyDaysField;
})());
interface MonthlyDatesFieldProps {
  value: number[];
  onChange: (dates: number[]) => void;
}
export const MonthlyDatesField: React.FC<MonthlyDatesFieldProps> = stryMutAct_9fa48("2671") ? () => undefined : (stryCov_9fa48("2671"), (() => {
  const MonthlyDatesField: React.FC<MonthlyDatesFieldProps> = ({
    value,
    onChange
  }) => <div className="flex flex-col gap-1.5">
        <label className="text-[10px] uppercase font-bold text-slate-400">Which date(s)?</label>
        <div className="grid grid-cols-7 gap-1">
            {Array.from(stryMutAct_9fa48("2672") ? {} : (stryCov_9fa48("2672"), {
        length: 31
      }), stryMutAct_9fa48("2673") ? () => undefined : (stryCov_9fa48("2673"), (_, i) => stryMutAct_9fa48("2674") ? i - 1 : (stryCov_9fa48("2674"), i + 1))).map(stryMutAct_9fa48("2675") ? () => undefined : (stryCov_9fa48("2675"), d => <button key={d} type="button" onClick={stryMutAct_9fa48("2676") ? () => undefined : (stryCov_9fa48("2676"), () => onChange(value.includes(d) ? stryMutAct_9fa48("2677") ? value : (stryCov_9fa48("2677"), value.filter(stryMutAct_9fa48("2678") ? () => undefined : (stryCov_9fa48("2678"), day => stryMutAct_9fa48("2681") ? day === d : stryMutAct_9fa48("2680") ? false : stryMutAct_9fa48("2679") ? true : (stryCov_9fa48("2679", "2680", "2681"), day !== d)))) : stryMutAct_9fa48("2682") ? [] : (stryCov_9fa48("2682"), [...value, d])))} className={stryMutAct_9fa48("2683") ? `` : (stryCov_9fa48("2683"), `w-8 h-8 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center ${value.includes(d) ? stryMutAct_9fa48("2684") ? "" : (stryCov_9fa48("2684"), 'bg-task-600 text-white border-transparent') : stryMutAct_9fa48("2685") ? "" : (stryCov_9fa48("2685"), 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-task-300')}`)}>{d}</button>))}
        </div>
    </div>;
  return MonthlyDatesField;
})());