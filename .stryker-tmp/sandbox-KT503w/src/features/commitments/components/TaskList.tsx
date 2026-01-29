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
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TaskItem } from './TaskItem';
import type { AnchorTask } from '../../../types';
import { Button } from '@anchor-os/ui';
interface TaskListProps {
  activeTasks: AnchorTask[];
  completedTasks: AnchorTask[];
  hasFamilyActive: boolean;
  editingTaskId: string | null;
  onToggle: (id: string, completed: boolean) => void;
  onStartEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onConfirmFinancial: (title: string) => void;
}
export const TaskList: React.FC<TaskListProps> = ({
  activeTasks,
  completedTasks,
  hasFamilyActive,
  editingTaskId,
  onToggle,
  onStartEdit,
  onDelete,
  onConfirmFinancial
}) => {
  if (stryMutAct_9fa48("2740")) {
    {}
  } else {
    stryCov_9fa48("2740");
    const [showCompleted, setShowCompleted] = useState(stryMutAct_9fa48("2741") ? true : (stryCov_9fa48("2741"), false));
    return <div className="space-y-8">
            {/* Active Tasks */}
            <div className="space-y-4">
                {stryMutAct_9fa48("2744") ? activeTasks.length > 0 || <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Active Tasks</h3> : stryMutAct_9fa48("2743") ? false : stryMutAct_9fa48("2742") ? true : (stryCov_9fa48("2742", "2743", "2744"), (stryMutAct_9fa48("2747") ? activeTasks.length <= 0 : stryMutAct_9fa48("2746") ? activeTasks.length >= 0 : stryMutAct_9fa48("2745") ? true : (stryCov_9fa48("2745", "2746", "2747"), activeTasks.length > 0)) && <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Active Tasks</h3>)}
                <div className="space-y-3">
                    {activeTasks.map(stryMutAct_9fa48("2748") ? () => undefined : (stryCov_9fa48("2748"), task => <TaskItem key={task.id} task={task} hasFamilyActive={hasFamilyActive} isEditing={stryMutAct_9fa48("2751") ? editingTaskId !== task.id : stryMutAct_9fa48("2750") ? false : stryMutAct_9fa48("2749") ? true : (stryCov_9fa48("2749", "2750", "2751"), editingTaskId === task.id)} onToggle={onToggle} onStartEdit={onStartEdit} onDelete={onDelete} onConfirmFinancial={onConfirmFinancial} />))}
                </div>
            </div>

            {/* Completed Section */}
            {stryMutAct_9fa48("2754") ? completedTasks.length > 0 || <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
                    <Button variant="secondary" size="sm" onClick={() => setShowCompleted(!showCompleted)} className="gap-2 text-[10px] font-black uppercase tracking-[0.1em] mb-4">
                        <span>Completed ({completedTasks.length})</span>
                        {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    {showCompleted && <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            {completedTasks.map(task => <TaskItem key={task.id} task={task} hasFamilyActive={hasFamilyActive} isEditing={false} onToggle={onToggle} onStartEdit={onStartEdit} onDelete={onDelete} />)}
                        </div>}
                </div> : stryMutAct_9fa48("2753") ? false : stryMutAct_9fa48("2752") ? true : (stryCov_9fa48("2752", "2753", "2754"), (stryMutAct_9fa48("2757") ? completedTasks.length <= 0 : stryMutAct_9fa48("2756") ? completedTasks.length >= 0 : stryMutAct_9fa48("2755") ? true : (stryCov_9fa48("2755", "2756", "2757"), completedTasks.length > 0)) && <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
                    <Button variant="secondary" size="sm" onClick={stryMutAct_9fa48("2758") ? () => undefined : (stryCov_9fa48("2758"), () => setShowCompleted(stryMutAct_9fa48("2759") ? showCompleted : (stryCov_9fa48("2759"), !showCompleted)))} className="gap-2 text-[10px] font-black uppercase tracking-[0.1em] mb-4">
                        <span>Completed ({completedTasks.length})</span>
                        {showCompleted ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>

                    {stryMutAct_9fa48("2762") ? showCompleted || <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            {completedTasks.map(task => <TaskItem key={task.id} task={task} hasFamilyActive={hasFamilyActive} isEditing={false} onToggle={onToggle} onStartEdit={onStartEdit} onDelete={onDelete} />)}
                        </div> : stryMutAct_9fa48("2761") ? false : stryMutAct_9fa48("2760") ? true : (stryCov_9fa48("2760", "2761", "2762"), showCompleted && <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            {completedTasks.map(stryMutAct_9fa48("2763") ? () => undefined : (stryCov_9fa48("2763"), task => <TaskItem key={task.id} task={task} hasFamilyActive={hasFamilyActive} isEditing={stryMutAct_9fa48("2764") ? true : (stryCov_9fa48("2764"), false)} onToggle={onToggle} onStartEdit={onStartEdit} onDelete={onDelete} />))}
                        </div>)}
                </div>)}
        </div>;
  }
};