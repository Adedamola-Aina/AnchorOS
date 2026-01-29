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
import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { AnchorTask, TimeOfDay } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { DailyFields, WeeklyFields, MonthlyFields } from './EditTaskFormFields';
interface EditTaskFormProps {
  task: AnchorTask;
  hasFamilyActive: boolean;
  onSave: (taskId: string, updates: any) => Promise<void>;
  onCancel: () => void;
}
export const EditTaskForm: React.FC<EditTaskFormProps> = ({
  task,
  hasFamilyActive,
  onSave,
  onCancel
}) => {
  if (stryMutAct_9fa48("2392")) {
    {}
  } else {
    stryCov_9fa48("2392");
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDomain, setEditDomain] = useState(stryMutAct_9fa48("2395") ? task.domain && 'Personal Development' : stryMutAct_9fa48("2394") ? false : stryMutAct_9fa48("2393") ? true : (stryCov_9fa48("2393", "2394", "2395"), task.domain || (stryMutAct_9fa48("2396") ? "" : (stryCov_9fa48("2396"), 'Personal Development'))));
    const [editScope, setEditScope] = useState<'personal' | 'family'>((stryMutAct_9fa48("2399") ? task.category !== 'family' : stryMutAct_9fa48("2398") ? false : stryMutAct_9fa48("2397") ? true : (stryCov_9fa48("2397", "2398", "2399"), task.category === (stryMutAct_9fa48("2400") ? "" : (stryCov_9fa48("2400"), 'family')))) ? stryMutAct_9fa48("2401") ? "" : (stryCov_9fa48("2401"), 'family') : stryMutAct_9fa48("2402") ? "" : (stryCov_9fa48("2402"), 'personal'));
    const [editTime, setEditTime] = useState<TimeOfDay>(stryMutAct_9fa48("2405") ? task.timeOfDay && 'morning' : stryMutAct_9fa48("2404") ? false : stryMutAct_9fa48("2403") ? true : (stryCov_9fa48("2403", "2404", "2405"), task.timeOfDay || (stryMutAct_9fa48("2406") ? "" : (stryCov_9fa48("2406"), 'morning'))));
    const [editDays, setEditDays] = useState<string[]>(stryMutAct_9fa48("2409") ? task.daysOfWeek && [] : stryMutAct_9fa48("2408") ? false : stryMutAct_9fa48("2407") ? true : (stryCov_9fa48("2407", "2408", "2409"), task.daysOfWeek || (stryMutAct_9fa48("2410") ? ["Stryker was here"] : (stryCov_9fa48("2410"), []))));
    const [editDaysOfMonth, setEditDaysOfMonth] = useState<number[]>(stryMutAct_9fa48("2413") ? task.daysOfMonth && (task.dayOfMonth ? [task.dayOfMonth] : []) : stryMutAct_9fa48("2412") ? false : stryMutAct_9fa48("2411") ? true : (stryCov_9fa48("2411", "2412", "2413"), task.daysOfMonth || (task.dayOfMonth ? stryMutAct_9fa48("2414") ? [] : (stryCov_9fa48("2414"), [task.dayOfMonth]) : stryMutAct_9fa48("2415") ? ["Stryker was here"] : (stryCov_9fa48("2415"), []))));
    const [isSaving, setIsSaving] = useState(stryMutAct_9fa48("2416") ? true : (stryCov_9fa48("2416"), false));
    const domains = stryMutAct_9fa48("2417") ? [] : (stryCov_9fa48("2417"), [stryMutAct_9fa48("2418") ? "" : (stryCov_9fa48("2418"), 'Health'), stryMutAct_9fa48("2419") ? "" : (stryCov_9fa48("2419"), 'Fitness'), stryMutAct_9fa48("2420") ? "" : (stryCov_9fa48("2420"), 'Work'), stryMutAct_9fa48("2421") ? "" : (stryCov_9fa48("2421"), 'Bible'), stryMutAct_9fa48("2422") ? "" : (stryCov_9fa48("2422"), 'Personal Development'), stryMutAct_9fa48("2423") ? "" : (stryCov_9fa48("2423"), 'Financial')]);
    const handleSave = async () => {
      if (stryMutAct_9fa48("2424")) {
        {}
      } else {
        stryCov_9fa48("2424");
        if (stryMutAct_9fa48("2426") ? false : stryMutAct_9fa48("2425") ? true : (stryCov_9fa48("2425", "2426"), isSaving)) return;
        setIsSaving(stryMutAct_9fa48("2427") ? false : (stryCov_9fa48("2427"), true));
        try {
          if (stryMutAct_9fa48("2428")) {
            {}
          } else {
            stryCov_9fa48("2428");
            const updates: any = stryMutAct_9fa48("2429") ? {} : (stryCov_9fa48("2429"), {
              title: editTitle,
              domain: editDomain,
              category: editScope
            });
            if (stryMutAct_9fa48("2432") ? task.type !== 'daily' : stryMutAct_9fa48("2431") ? false : stryMutAct_9fa48("2430") ? true : (stryCov_9fa48("2430", "2431", "2432"), task.type === (stryMutAct_9fa48("2433") ? "" : (stryCov_9fa48("2433"), 'daily')))) {
              if (stryMutAct_9fa48("2434")) {
                {}
              } else {
                stryCov_9fa48("2434");
                updates.timeOfDay = editTime;
              }
            } else if (stryMutAct_9fa48("2437") ? task.type !== 'weekly' : stryMutAct_9fa48("2436") ? false : stryMutAct_9fa48("2435") ? true : (stryCov_9fa48("2435", "2436", "2437"), task.type === (stryMutAct_9fa48("2438") ? "" : (stryCov_9fa48("2438"), 'weekly')))) {
              if (stryMutAct_9fa48("2439")) {
                {}
              } else {
                stryCov_9fa48("2439");
                updates.daysOfWeek = editDays;
              }
            } else if (stryMutAct_9fa48("2442") ? task.type !== 'monthly' : stryMutAct_9fa48("2441") ? false : stryMutAct_9fa48("2440") ? true : (stryCov_9fa48("2440", "2441", "2442"), task.type === (stryMutAct_9fa48("2443") ? "" : (stryCov_9fa48("2443"), 'monthly')))) {
              if (stryMutAct_9fa48("2444")) {
                {}
              } else {
                stryCov_9fa48("2444");
                updates.daysOfMonth = editDaysOfMonth;
              }
            }
            await onSave(task.id, updates);
          }
        } finally {
          if (stryMutAct_9fa48("2445")) {
            {}
          } else {
            stryCov_9fa48("2445");
            setIsSaving(stryMutAct_9fa48("2446") ? true : (stryCov_9fa48("2446"), false));
          }
        }
      }
    };
    return <Card className="space-y-4 p-5 border-task-500/20 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Editing {task.type} Commitment</span>
                <Button variant="ghost" size="icon" onClick={onCancel} className="text-slate-400 h-8 w-8">
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Title</label>
                    <input type="text" value={editTitle} onChange={stryMutAct_9fa48("2447") ? () => undefined : (stryCov_9fa48("2447"), e => setEditTitle(e.target.value))} placeholder="Commitment title" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all" autoFocus />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Domain</label>
                        <select value={editDomain} onChange={stryMutAct_9fa48("2448") ? () => undefined : (stryCov_9fa48("2448"), e => setEditDomain(e.target.value))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-task-500/20 appearance-none">
                            {domains.map(stryMutAct_9fa48("2449") ? () => undefined : (stryCov_9fa48("2449"), d => <option key={d} value={d}>{d}</option>))}
                        </select>
                    </div>
                    {stryMutAct_9fa48("2452") ? hasFamilyActive || <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Scope</label>
                            <select value={editScope} onChange={e => setEditScope(e.target.value as 'personal' | 'family')} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-task-500/20 appearance-none">
                                <option value="personal">Personal</option>
                                <option value="family">Family</option>
                            </select>
                        </div> : stryMutAct_9fa48("2451") ? false : stryMutAct_9fa48("2450") ? true : (stryCov_9fa48("2450", "2451", "2452"), hasFamilyActive && <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Scope</label>
                            <select value={editScope} onChange={stryMutAct_9fa48("2453") ? () => undefined : (stryCov_9fa48("2453"), e => setEditScope(e.target.value as 'personal' | 'family'))} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-task-500/20 appearance-none">
                                <option value="personal">Personal</option>
                                <option value="family">Family</option>
                            </select>
                        </div>)}
                </div>

                {/* Type-specific fields */}
                {stryMutAct_9fa48("2456") ? task.type === 'daily' || <DailyFields editTime={editTime} setEditTime={setEditTime} /> : stryMutAct_9fa48("2455") ? false : stryMutAct_9fa48("2454") ? true : (stryCov_9fa48("2454", "2455", "2456"), (stryMutAct_9fa48("2458") ? task.type !== 'daily' : stryMutAct_9fa48("2457") ? true : (stryCov_9fa48("2457", "2458"), task.type === (stryMutAct_9fa48("2459") ? "" : (stryCov_9fa48("2459"), 'daily')))) && <DailyFields editTime={editTime} setEditTime={setEditTime} />)}

                {stryMutAct_9fa48("2462") ? task.type === 'weekly' || <WeeklyFields editDays={editDays} setEditDays={setEditDays} /> : stryMutAct_9fa48("2461") ? false : stryMutAct_9fa48("2460") ? true : (stryCov_9fa48("2460", "2461", "2462"), (stryMutAct_9fa48("2464") ? task.type !== 'weekly' : stryMutAct_9fa48("2463") ? true : (stryCov_9fa48("2463", "2464"), task.type === (stryMutAct_9fa48("2465") ? "" : (stryCov_9fa48("2465"), 'weekly')))) && <WeeklyFields editDays={editDays} setEditDays={setEditDays} />)}

                {stryMutAct_9fa48("2468") ? task.type === 'monthly' || <MonthlyFields editDaysOfMonth={editDaysOfMonth} setEditDaysOfMonth={setEditDaysOfMonth} /> : stryMutAct_9fa48("2467") ? false : stryMutAct_9fa48("2466") ? true : (stryCov_9fa48("2466", "2467", "2468"), (stryMutAct_9fa48("2470") ? task.type !== 'monthly' : stryMutAct_9fa48("2469") ? true : (stryCov_9fa48("2469", "2470"), task.type === (stryMutAct_9fa48("2471") ? "" : (stryCov_9fa48("2471"), 'monthly')))) && <MonthlyFields editDaysOfMonth={editDaysOfMonth} setEditDaysOfMonth={setEditDaysOfMonth} />)}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSave} isLoading={isSaving} size="sm" className="px-6">
                    Save Changes
                </Button>
            </div>
        </Card>;
  }
};