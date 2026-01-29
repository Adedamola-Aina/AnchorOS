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
import type { AnchorTask } from '../../../types';
import { Circle, CheckCircle2 } from 'lucide-react';
interface WeeklyViewProps {
  tasks: AnchorTask[];
  onToggle: (id: string, status: boolean) => void;
}
export const WeeklyView: React.FC<WeeklyViewProps> = ({
  tasks,
  onToggle
}) => {
  if (stryMutAct_9fa48("2765")) {
    {}
  } else {
    stryCov_9fa48("2765");
    // Generate next 7 days
    const days = Array.from(stryMutAct_9fa48("2766") ? {} : (stryCov_9fa48("2766"), {
      length: 7
    }), (_, i) => {
      if (stryMutAct_9fa48("2767")) {
        {}
      } else {
        stryCov_9fa48("2767");
        const d = new Date();
        stryMutAct_9fa48("2768") ? d.setTime(d.getDate() + i) : (stryCov_9fa48("2768"), d.setDate(stryMutAct_9fa48("2769") ? d.getDate() - i : (stryCov_9fa48("2769"), d.getDate() + i)));
        return d;
      }
    });
    return <div className="overflow-x-auto pb-4">
            <div className="grid grid-cols-7 gap-2 min-w-[800px]">
                {days.map((date, idx) => {
          if (stryMutAct_9fa48("2770")) {
            {}
          } else {
            stryCov_9fa48("2770");
            const dayName = date.toLocaleDateString(stryMutAct_9fa48("2771") ? "" : (stryCov_9fa48("2771"), 'en-US'), stryMutAct_9fa48("2772") ? {} : (stryCov_9fa48("2772"), {
              weekday: stryMutAct_9fa48("2773") ? "" : (stryCov_9fa48("2773"), 'short')
            }));
            const fullDayName = date.toLocaleDateString(stryMutAct_9fa48("2774") ? "" : (stryCov_9fa48("2774"), 'en-US'), stryMutAct_9fa48("2775") ? {} : (stryCov_9fa48("2775"), {
              weekday: stryMutAct_9fa48("2776") ? "" : (stryCov_9fa48("2776"), 'long')
            }));
            const dayNum = date.getDate();
            const isToday = stryMutAct_9fa48("2779") ? idx !== 0 : stryMutAct_9fa48("2778") ? false : stryMutAct_9fa48("2777") ? true : (stryCov_9fa48("2777", "2778", "2779"), idx === 0);

            // Filter tasks for this day
            const dayTasks = stryMutAct_9fa48("2780") ? tasks : (stryCov_9fa48("2780"), tasks.filter(t => {
              if (stryMutAct_9fa48("2781")) {
                {}
              } else {
                stryCov_9fa48("2781");
                if (stryMutAct_9fa48("2784") ? t.type !== 'daily' : stryMutAct_9fa48("2783") ? false : stryMutAct_9fa48("2782") ? true : (stryCov_9fa48("2782", "2783", "2784"), t.type === (stryMutAct_9fa48("2785") ? "" : (stryCov_9fa48("2785"), 'daily')))) return stryMutAct_9fa48("2786") ? false : (stryCov_9fa48("2786"), true);
                if (stryMutAct_9fa48("2789") ? t.type !== 'weekly' : stryMutAct_9fa48("2788") ? false : stryMutAct_9fa48("2787") ? true : (stryCov_9fa48("2787", "2788", "2789"), t.type === (stryMutAct_9fa48("2790") ? "" : (stryCov_9fa48("2790"), 'weekly')))) return stryMutAct_9fa48("2791") ? t.daysOfWeek.includes(fullDayName) : (stryCov_9fa48("2791"), t.daysOfWeek?.includes(fullDayName));
                if (stryMutAct_9fa48("2794") ? t.type !== 'monthly' : stryMutAct_9fa48("2793") ? false : stryMutAct_9fa48("2792") ? true : (stryCov_9fa48("2792", "2793", "2794"), t.type === (stryMutAct_9fa48("2795") ? "" : (stryCov_9fa48("2795"), 'monthly')))) return stryMutAct_9fa48("2798") ? t.daysOfMonth?.includes(dayNum) && t.dayOfMonth === dayNum : stryMutAct_9fa48("2797") ? false : stryMutAct_9fa48("2796") ? true : (stryCov_9fa48("2796", "2797", "2798"), (stryMutAct_9fa48("2799") ? t.daysOfMonth.includes(dayNum) : (stryCov_9fa48("2799"), t.daysOfMonth?.includes(dayNum))) || (stryMutAct_9fa48("2801") ? t.dayOfMonth !== dayNum : stryMutAct_9fa48("2800") ? false : (stryCov_9fa48("2800", "2801"), t.dayOfMonth === dayNum)));
                return stryMutAct_9fa48("2802") ? true : (stryCov_9fa48("2802"), false);
              }
            }));
            return <div key={idx} className={stryMutAct_9fa48("2803") ? `` : (stryCov_9fa48("2803"), `flex flex-col gap-2 rounded-xl border transition-colors ${isToday ? stryMutAct_9fa48("2804") ? "" : (stryCov_9fa48("2804"), 'bg-task-50/50 border-task-100 dark:bg-task-900/10 dark:border-task-900/30 p-2') : stryMutAct_9fa48("2805") ? "" : (stryCov_9fa48("2805"), 'border-transparent p-2')}`)}>
                            <div className="text-center mb-1">
                                <div className={stryMutAct_9fa48("2806") ? `` : (stryCov_9fa48("2806"), `text-[10px] font-bold uppercase tracking-wider ${isToday ? stryMutAct_9fa48("2807") ? "" : (stryCov_9fa48("2807"), 'text-task-600 dark:text-task-400') : stryMutAct_9fa48("2808") ? "" : (stryCov_9fa48("2808"), 'text-slate-400')}`)}>{dayName}</div>
                                <div className={stryMutAct_9fa48("2809") ? `` : (stryCov_9fa48("2809"), `text-xl font-bold ${isToday ? stryMutAct_9fa48("2810") ? "" : (stryCov_9fa48("2810"), 'text-task-700 dark:text-task-300') : stryMutAct_9fa48("2811") ? "" : (stryCov_9fa48("2811"), 'text-slate-700 dark:text-slate-300')}`)}>{dayNum}</div>
                            </div>

                            <div className="space-y-2 flex-1">
                                {dayTasks.map(stryMutAct_9fa48("2812") ? () => undefined : (stryCov_9fa48("2812"), task => <div key={task.id} className={stryMutAct_9fa48("2813") ? `` : (stryCov_9fa48("2813"), `p-2 rounded-lg border shadow-sm flex flex-col items-center text-center gap-1 transition-all ${isToday ? stryMutAct_9fa48("2814") ? "" : (stryCov_9fa48("2814"), 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700') : stryMutAct_9fa48("2815") ? "" : (stryCov_9fa48("2815"), 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-70')}`)}>
                                        <div className="text-xs font-medium truncate w-full" title={task.title}>
                                            {task.title}
                                        </div>

                                        {isToday ? <button onClick={stryMutAct_9fa48("2816") ? () => undefined : (stryCov_9fa48("2816"), () => onToggle(task.id, task.completed))} className={stryMutAct_9fa48("2817") ? `` : (stryCov_9fa48("2817"), `mt-1 p-1 rounded-full transition-colors ${task.completed ? stryMutAct_9fa48("2818") ? "" : (stryCov_9fa48("2818"), 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20') : stryMutAct_9fa48("2819") ? "" : (stryCov_9fa48("2819"), 'text-slate-300 hover:text-emerald-500')}`)}>
                                                {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                            </button> : <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />}
                                    </div>))}
                                {stryMutAct_9fa48("2822") ? dayTasks.length === 0 || <div className="h-full flex items-center justify-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    </div> : stryMutAct_9fa48("2821") ? false : stryMutAct_9fa48("2820") ? true : (stryCov_9fa48("2820", "2821", "2822"), (stryMutAct_9fa48("2824") ? dayTasks.length !== 0 : stryMutAct_9fa48("2823") ? true : (stryCov_9fa48("2823", "2824"), dayTasks.length === 0)) && <div className="h-full flex items-center justify-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                    </div>)}
                            </div>
                        </div>;
          }
        })}
            </div>
        </div>;
  }
};