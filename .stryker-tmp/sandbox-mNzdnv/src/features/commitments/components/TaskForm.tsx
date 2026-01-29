/**
 * TaskForm - Multi-step commitment creation form
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Wizard steps and field components extracted to TaskFormParts.tsx
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
import React, { useState } from 'react';
import type { TaskType, TimeOfDay, AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
import { Card } from '@anchor-os/ui';
import { FrequencyStep, DetailsHeader, DailyTimeField, WeeklyDaysField, MonthlyDatesField } from './TaskFormParts';
interface TaskFormProps {
  onClose: () => void;
  onAdd: (task: Omit<AnchorTask, 'id' | 'createdAt'>) => Promise<void>;
  hasFamilyActive: boolean;
}
export const TaskForm: React.FC<TaskFormProps> = ({
  onClose,
  onAdd,
  hasFamilyActive
}) => {
  if (stryMutAct_9fa48("2526")) {
    {}
  } else {
    stryCov_9fa48("2526");
    const [creationStep, setCreationStep] = useState<'frequency' | 'details'>(stryMutAct_9fa48("2527") ? "" : (stryCov_9fa48("2527"), 'frequency'));
    const [newTaskTitle, setNewTaskTitle] = useState(stryMutAct_9fa48("2528") ? "Stryker was here!" : (stryCov_9fa48("2528"), ''));
    const [newTaskType, setNewTaskType] = useState<TaskType>(stryMutAct_9fa48("2529") ? "" : (stryCov_9fa48("2529"), 'daily'));
    const [newTaskScope, setNewTaskScope] = useState<'personal' | 'family'>(stryMutAct_9fa48("2530") ? "" : (stryCov_9fa48("2530"), 'personal'));
    const [newTaskTime, setNewTaskTime] = useState<TimeOfDay>(stryMutAct_9fa48("2531") ? "" : (stryCov_9fa48("2531"), 'morning'));
    const [newTaskDays, setNewTaskDays] = useState<string[]>(stryMutAct_9fa48("2532") ? ["Stryker was here"] : (stryCov_9fa48("2532"), []));
    const [newTaskDates, setNewTaskDates] = useState<number[]>(stryMutAct_9fa48("2533") ? ["Stryker was here"] : (stryCov_9fa48("2533"), []));
    const [newTaskDomain, setNewTaskDomain] = useState(stryMutAct_9fa48("2534") ? "" : (stryCov_9fa48("2534"), 'Personal Development'));
    const [newTaskReminder, setNewTaskReminder] = useState(stryMutAct_9fa48("2535") ? "Stryker was here!" : (stryCov_9fa48("2535"), ''));
    const [isSaving, setIsSaving] = useState(stryMutAct_9fa48("2536") ? true : (stryCov_9fa48("2536"), false));
    const domains = stryMutAct_9fa48("2537") ? [] : (stryCov_9fa48("2537"), [stryMutAct_9fa48("2538") ? "" : (stryCov_9fa48("2538"), 'Health'), stryMutAct_9fa48("2539") ? "" : (stryCov_9fa48("2539"), 'Fitness'), stryMutAct_9fa48("2540") ? "" : (stryCov_9fa48("2540"), 'Work'), stryMutAct_9fa48("2541") ? "" : (stryCov_9fa48("2541"), 'Bible'), stryMutAct_9fa48("2542") ? "" : (stryCov_9fa48("2542"), 'Personal Development'), stryMutAct_9fa48("2543") ? "" : (stryCov_9fa48("2543"), 'Financial')]);
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("2544")) {
        {}
      } else {
        stryCov_9fa48("2544");
        e.preventDefault();
        if (stryMutAct_9fa48("2547") ? !newTaskTitle.trim() && isSaving : stryMutAct_9fa48("2546") ? false : stryMutAct_9fa48("2545") ? true : (stryCov_9fa48("2545", "2546", "2547"), (stryMutAct_9fa48("2548") ? newTaskTitle.trim() : (stryCov_9fa48("2548"), !(stryMutAct_9fa48("2549") ? newTaskTitle : (stryCov_9fa48("2549"), newTaskTitle.trim())))) || isSaving)) return;
        setIsSaving(stryMutAct_9fa48("2550") ? false : (stryCov_9fa48("2550"), true));
        try {
          if (stryMutAct_9fa48("2551")) {
            {}
          } else {
            stryCov_9fa48("2551");
            const taskPayload = {
              title: newTaskTitle,
              type: newTaskType,
              completed: false,
              category: newTaskScope,
              domain: newTaskDomain,
              reminderTime: newTaskReminder || null
            } as any;
            if (stryMutAct_9fa48("2554") ? newTaskType !== 'daily' : stryMutAct_9fa48("2553") ? false : stryMutAct_9fa48("2552") ? true : (stryCov_9fa48("2552", "2553", "2554"), newTaskType === (stryMutAct_9fa48("2555") ? "" : (stryCov_9fa48("2555"), 'daily')))) taskPayload.timeOfDay = newTaskTime;
            if (stryMutAct_9fa48("2558") ? newTaskType !== 'weekly' : stryMutAct_9fa48("2557") ? false : stryMutAct_9fa48("2556") ? true : (stryCov_9fa48("2556", "2557", "2558"), newTaskType === (stryMutAct_9fa48("2559") ? "" : (stryCov_9fa48("2559"), 'weekly')))) taskPayload.daysOfWeek = newTaskDays;
            if (stryMutAct_9fa48("2562") ? newTaskType !== 'monthly' : stryMutAct_9fa48("2561") ? false : stryMutAct_9fa48("2560") ? true : (stryCov_9fa48("2560", "2561", "2562"), newTaskType === (stryMutAct_9fa48("2563") ? "" : (stryCov_9fa48("2563"), 'monthly')))) taskPayload.daysOfMonth = newTaskDates;
            await onAdd(taskPayload);
          }
        } finally {
          if (stryMutAct_9fa48("2564")) {
            {}
          } else {
            stryCov_9fa48("2564");
            setIsSaving(stryMutAct_9fa48("2565") ? true : (stryCov_9fa48("2565"), false));
          }
        }
      }
    };
    const handleSelectType = (type: TaskType) => {
      if (stryMutAct_9fa48("2566")) {
        {}
      } else {
        stryCov_9fa48("2566");
        setNewTaskType(type);
        setCreationStep(stryMutAct_9fa48("2567") ? "" : (stryCov_9fa48("2567"), 'details'));
      }
    };
    return <Card className="p-6 mb-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {(stryMutAct_9fa48("2570") ? creationStep !== 'frequency' : stryMutAct_9fa48("2569") ? false : stryMutAct_9fa48("2568") ? true : (stryCov_9fa48("2568", "2569", "2570"), creationStep === (stryMutAct_9fa48("2571") ? "" : (stryCov_9fa48("2571"), 'frequency')))) ? <FrequencyStep onSelectType={handleSelectType} onClose={onClose} /> : <form onSubmit={handleSubmit} className="space-y-6">
                    <DetailsHeader taskType={newTaskType} onBack={stryMutAct_9fa48("2572") ? () => undefined : (stryCov_9fa48("2572"), () => setCreationStep(stryMutAct_9fa48("2573") ? "" : (stryCov_9fa48("2573"), 'frequency')))} onClose={onClose} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Name</label>
                                <input autoFocus type="text" placeholder="e.g. Morning Prayer, Gym, Rent Payment" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all placeholder:text-slate-400" value={newTaskTitle} onChange={stryMutAct_9fa48("2574") ? () => undefined : (stryCov_9fa48("2574"), e => setNewTaskTitle(e.target.value))} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Domain</label>
                                <select value={newTaskDomain} onChange={stryMutAct_9fa48("2575") ? () => undefined : (stryCov_9fa48("2575"), e => setNewTaskDomain(e.target.value))} className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 focus:border-task-500 transition-all appearance-none">
                                    {domains.map(stryMutAct_9fa48("2576") ? () => undefined : (stryCov_9fa48("2576"), d => <option key={d} value={d}>{d}</option>))}
                                </select>
                            </div>
                            {stryMutAct_9fa48("2579") ? hasFamilyActive || <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Context</label>
                                    <div className="flex gap-2">
                                        {['personal', 'family'].map(s => <Button key={s} type="button" onClick={() => setNewTaskScope(s as 'personal' | 'family')} variant={newTaskScope === s ? 'primary' : 'secondary'} className="flex-1 capitalize">{s}</Button>)}
                                    </div>
                                </div> : stryMutAct_9fa48("2578") ? false : stryMutAct_9fa48("2577") ? true : (stryCov_9fa48("2577", "2578", "2579"), hasFamilyActive && <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-400">Context</label>
                                    <div className="flex gap-2">
                                        {(stryMutAct_9fa48("2580") ? [] : (stryCov_9fa48("2580"), [stryMutAct_9fa48("2581") ? "" : (stryCov_9fa48("2581"), 'personal'), stryMutAct_9fa48("2582") ? "" : (stryCov_9fa48("2582"), 'family')])).map(stryMutAct_9fa48("2583") ? () => undefined : (stryCov_9fa48("2583"), s => <Button key={s} type="button" onClick={stryMutAct_9fa48("2584") ? () => undefined : (stryCov_9fa48("2584"), () => setNewTaskScope(s as 'personal' | 'family'))} variant={(stryMutAct_9fa48("2587") ? newTaskScope !== s : stryMutAct_9fa48("2586") ? false : stryMutAct_9fa48("2585") ? true : (stryCov_9fa48("2585", "2586", "2587"), newTaskScope === s)) ? stryMutAct_9fa48("2588") ? "" : (stryCov_9fa48("2588"), 'primary') : stryMutAct_9fa48("2589") ? "" : (stryCov_9fa48("2589"), 'secondary')} className="flex-1 capitalize">{s}</Button>))}
                                    </div>
                                </div>)}
                        </div>
                        <div className="space-y-4">
                            {stryMutAct_9fa48("2592") ? newTaskType === 'daily' || <DailyTimeField value={newTaskTime} onChange={setNewTaskTime} /> : stryMutAct_9fa48("2591") ? false : stryMutAct_9fa48("2590") ? true : (stryCov_9fa48("2590", "2591", "2592"), (stryMutAct_9fa48("2594") ? newTaskType !== 'daily' : stryMutAct_9fa48("2593") ? true : (stryCov_9fa48("2593", "2594"), newTaskType === (stryMutAct_9fa48("2595") ? "" : (stryCov_9fa48("2595"), 'daily')))) && <DailyTimeField value={newTaskTime} onChange={setNewTaskTime} />)}
                            {stryMutAct_9fa48("2598") ? newTaskType === 'weekly' || <WeeklyDaysField value={newTaskDays} onChange={setNewTaskDays} /> : stryMutAct_9fa48("2597") ? false : stryMutAct_9fa48("2596") ? true : (stryCov_9fa48("2596", "2597", "2598"), (stryMutAct_9fa48("2600") ? newTaskType !== 'weekly' : stryMutAct_9fa48("2599") ? true : (stryCov_9fa48("2599", "2600"), newTaskType === (stryMutAct_9fa48("2601") ? "" : (stryCov_9fa48("2601"), 'weekly')))) && <WeeklyDaysField value={newTaskDays} onChange={setNewTaskDays} />)}
                            {stryMutAct_9fa48("2604") ? newTaskType === 'monthly' || <MonthlyDatesField value={newTaskDates} onChange={setNewTaskDates} /> : stryMutAct_9fa48("2603") ? false : stryMutAct_9fa48("2602") ? true : (stryCov_9fa48("2602", "2603", "2604"), (stryMutAct_9fa48("2606") ? newTaskType !== 'monthly' : stryMutAct_9fa48("2605") ? true : (stryCov_9fa48("2605", "2606"), newTaskType === (stryMutAct_9fa48("2607") ? "" : (stryCov_9fa48("2607"), 'monthly')))) && <MonthlyDatesField value={newTaskDates} onChange={setNewTaskDates} />)}
                            <div className="flex flex-col gap-1.5 pt-2">
                                <label className="text-[10px] uppercase font-bold text-slate-400">Reminder (Optional)</label>
                                <input type="time" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-task-500/20 transition-all" value={newTaskReminder} onChange={stryMutAct_9fa48("2608") ? () => undefined : (stryCov_9fa48("2608"), e => setNewTaskReminder(e.target.value))} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={stryMutAct_9fa48("2609") ? () => undefined : (stryCov_9fa48("2609"), () => setCreationStep(stryMutAct_9fa48("2610") ? "" : (stryCov_9fa48("2610"), 'frequency')))}>Back</Button>
                        <Button type="submit" isLoading={isSaving} className="px-8">Save Commitment</Button>
                    </div>
                </form>}
        </Card>;
  }
};