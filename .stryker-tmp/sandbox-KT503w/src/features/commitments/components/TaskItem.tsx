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
import { Circle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Badge, TaskContextBadge } from '../../../components/shared';
import type { AnchorTask } from '../../../types';
import { Card } from '@anchor-os/ui';
import { Button } from '@anchor-os/ui';
interface TaskItemProps {
  task: AnchorTask;
  hasFamilyActive: boolean;
  isEditing: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onStartEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onConfirmFinancial?: (title: string) => void;
}
export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  hasFamilyActive,
  isEditing,
  onToggle,
  onStartEdit,
  onDelete,
  onConfirmFinancial
}) => {
  if (stryMutAct_9fa48("2686")) {
    {}
  } else {
    stryCov_9fa48("2686");
    const handleToggle = async () => {
      if (stryMutAct_9fa48("2687")) {
        {}
      } else {
        stryCov_9fa48("2687");
        await onToggle(task.id, task.completed);
        if (stryMutAct_9fa48("2690") ? !task.completed || onConfirmFinancial : stryMutAct_9fa48("2689") ? false : stryMutAct_9fa48("2688") ? true : (stryCov_9fa48("2688", "2689", "2690"), (stryMutAct_9fa48("2691") ? task.completed : (stryCov_9fa48("2691"), !task.completed)) && onConfirmFinancial)) {
          if (stryMutAct_9fa48("2692")) {
            {}
          } else {
            stryCov_9fa48("2692");
            const keywords = stryMutAct_9fa48("2693") ? [] : (stryCov_9fa48("2693"), [stryMutAct_9fa48("2694") ? "" : (stryCov_9fa48("2694"), 'pay'), stryMutAct_9fa48("2695") ? "" : (stryCov_9fa48("2695"), 'buy'), stryMutAct_9fa48("2696") ? "" : (stryCov_9fa48("2696"), 'bill'), stryMutAct_9fa48("2697") ? "" : (stryCov_9fa48("2697"), 'rent'), stryMutAct_9fa48("2698") ? "" : (stryCov_9fa48("2698"), 'subscription'), stryMutAct_9fa48("2699") ? "" : (stryCov_9fa48("2699"), 'lease'), stryMutAct_9fa48("2700") ? "" : (stryCov_9fa48("2700"), 'insurance'), stryMutAct_9fa48("2701") ? "" : (stryCov_9fa48("2701"), 'tax')]);
            if (stryMutAct_9fa48("2704") ? keywords.every(k => task.title.toLowerCase().includes(k)) : stryMutAct_9fa48("2703") ? false : stryMutAct_9fa48("2702") ? true : (stryCov_9fa48("2702", "2703", "2704"), keywords.some(stryMutAct_9fa48("2705") ? () => undefined : (stryCov_9fa48("2705"), k => stryMutAct_9fa48("2706") ? task.title.toUpperCase().includes(k) : (stryCov_9fa48("2706"), task.title.toLowerCase().includes(k)))))) {
              if (stryMutAct_9fa48("2707")) {
                {}
              } else {
                stryCov_9fa48("2707");
                onConfirmFinancial(task.title);
              }
            }
          }
        }
      }
    };
    return <Card className={stryMutAct_9fa48("2708") ? `` : (stryCov_9fa48("2708"), `group p-3 transition-all hover:border-slate-300 dark:hover:border-slate-700 ${isEditing ? stryMutAct_9fa48("2709") ? "" : (stryCov_9fa48("2709"), 'opacity-50 pointer-events-none') : stryMutAct_9fa48("2710") ? "Stryker was here!" : (stryCov_9fa48("2710"), '')}`)}>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button onClick={handleToggle} className={stryMutAct_9fa48("2711") ? `` : (stryCov_9fa48("2711"), `p-1.5 rounded-full transition-all duration-300 shrink-0 ${task.completed ? stryMutAct_9fa48("2712") ? "" : (stryCov_9fa48("2712"), 'bg-emerald-500 text-white') : stryMutAct_9fa48("2713") ? "" : (stryCov_9fa48("2713"), 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-500')}`)}>
                        {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={stryMutAct_9fa48("2714") ? `` : (stryCov_9fa48("2714"), `font-bold text-sm tracking-tight transition-all ${task.completed ? stryMutAct_9fa48("2715") ? "" : (stryCov_9fa48("2715"), 'line-through text-slate-400 dark:text-slate-500') : stryMutAct_9fa48("2716") ? "" : (stryCov_9fa48("2716"), 'text-slate-800 dark:text-white')}`)}>
                                {task.title}
                            </h4>
                        {stryMutAct_9fa48("2719") ? !task.completed || <div className="flex gap-1.5 flex-wrap">
                                <Badge type={task.type}>{task.type}</Badge>
                                <TaskContextBadge task={task} />
                                {hasFamilyActive && task.category === 'family' && <Badge type="family">Family</Badge>}
                                {(task.currentStreak || 0) > 0 && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                        🔥 {task.currentStreak}
                                    </span>}
                            </div> : stryMutAct_9fa48("2718") ? false : stryMutAct_9fa48("2717") ? true : (stryCov_9fa48("2717", "2718", "2719"), (stryMutAct_9fa48("2720") ? task.completed : (stryCov_9fa48("2720"), !task.completed)) && <div className="flex gap-1.5 flex-wrap">
                                <Badge type={task.type}>{task.type}</Badge>
                                <TaskContextBadge task={task} />
                                {stryMutAct_9fa48("2723") ? hasFamilyActive && task.category === 'family' || <Badge type="family">Family</Badge> : stryMutAct_9fa48("2722") ? false : stryMutAct_9fa48("2721") ? true : (stryCov_9fa48("2721", "2722", "2723"), (stryMutAct_9fa48("2725") ? hasFamilyActive || task.category === 'family' : stryMutAct_9fa48("2724") ? true : (stryCov_9fa48("2724", "2725"), hasFamilyActive && (stryMutAct_9fa48("2727") ? task.category !== 'family' : stryMutAct_9fa48("2726") ? true : (stryCov_9fa48("2726", "2727"), task.category === (stryMutAct_9fa48("2728") ? "" : (stryCov_9fa48("2728"), 'family')))))) && <Badge type="family">Family</Badge>)}
                                {stryMutAct_9fa48("2731") ? (task.currentStreak || 0) > 0 || <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                        🔥 {task.currentStreak}
                                    </span> : stryMutAct_9fa48("2730") ? false : stryMutAct_9fa48("2729") ? true : (stryCov_9fa48("2729", "2730", "2731"), (stryMutAct_9fa48("2734") ? (task.currentStreak || 0) <= 0 : stryMutAct_9fa48("2733") ? (task.currentStreak || 0) >= 0 : stryMutAct_9fa48("2732") ? true : (stryCov_9fa48("2732", "2733", "2734"), (stryMutAct_9fa48("2737") ? task.currentStreak && 0 : stryMutAct_9fa48("2736") ? false : stryMutAct_9fa48("2735") ? true : (stryCov_9fa48("2735", "2736", "2737"), task.currentStreak || 0)) > 0)) && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                        🔥 {task.currentStreak}
                                    </span>)}
                            </div>)}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-0.5 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={stryMutAct_9fa48("2738") ? () => undefined : (stryCov_9fa48("2738"), () => onStartEdit(task.id))} className="text-slate-400 hover:text-task-500 hover:bg-task-50 dark:hover:bg-task-900/20">
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={stryMutAct_9fa48("2739") ? () => undefined : (stryCov_9fa48("2739"), () => onDelete(task.id))} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>;
  }
};