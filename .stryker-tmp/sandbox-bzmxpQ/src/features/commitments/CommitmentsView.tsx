/**
 * CommitmentsView - Task management page orchestrator
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * UI components extracted to CommitmentsViewParts.tsx
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
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { AnchorTask } from '../../types';
import { useApp } from '../../context/AnchorContext';
import { useAuth } from '../../context/AuthContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { SectionHeader } from '../../components/shared';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { EditTaskForm } from './components/EditTaskForm';
import { Button } from '@anchor-os/ui';
import { WeeklyView } from './components/WeeklyView';
import { CommitmentsEmptyState, CommitmentsFilterBar } from './components/CommitmentsViewParts';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
const CommitmentsView = () => {
  if (stryMutAct_9fa48("2223")) {
    {}
  } else {
    stryCov_9fa48("2223");
    const {
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      loadingTasks
    } = useTasks();
    const {
      user
    } = useAuth();
    const {
      connection
    } = useFamilySharing(stryMutAct_9fa48("2224") ? user.uid : (stryCov_9fa48("2224"), user?.uid));
    const {
      navigateTo
    } = useApp();
    const {
      confirm,
      showToast
    } = useNotifications();
    const hasFamilyActive = stryMutAct_9fa48("2225") ? !connection : (stryCov_9fa48("2225"), !(stryMutAct_9fa48("2226") ? connection : (stryCov_9fa48("2226"), !connection)));
    const [showAdd, setShowAdd] = useState(stryMutAct_9fa48("2227") ? true : (stryCov_9fa48("2227"), false));
    const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'todo'>(stryMutAct_9fa48("2228") ? "" : (stryCov_9fa48("2228"), 'all'));
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>(stryMutAct_9fa48("2229") ? "" : (stryCov_9fa48("2229"), 'list'));
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const handleAdd = async (taskPayload: Omit<AnchorTask, 'id' | 'createdAt'>) => {
      if (stryMutAct_9fa48("2230")) {
        {}
      } else {
        stryCov_9fa48("2230");
        try {
          if (stryMutAct_9fa48("2231")) {
            {}
          } else {
            stryCov_9fa48("2231");
            if (stryMutAct_9fa48("2234") ? taskPayload.title.includes('<') && taskPayload.title.includes('>') : stryMutAct_9fa48("2233") ? false : stryMutAct_9fa48("2232") ? true : (stryCov_9fa48("2232", "2233", "2234"), taskPayload.title.includes(stryMutAct_9fa48("2235") ? "" : (stryCov_9fa48("2235"), '<')) || taskPayload.title.includes(stryMutAct_9fa48("2236") ? "" : (stryCov_9fa48("2236"), '>')))) {
              if (stryMutAct_9fa48("2237")) {
                {}
              } else {
                stryCov_9fa48("2237");
                showToast(stryMutAct_9fa48("2238") ? "" : (stryCov_9fa48("2238"), 'Title contains invalid content'), stryMutAct_9fa48("2239") ? "" : (stryCov_9fa48("2239"), 'error'));
                return;
              }
            }
            await addTask(taskPayload);
            setShowAdd(stryMutAct_9fa48("2240") ? true : (stryCov_9fa48("2240"), false));
            showToast(stryMutAct_9fa48("2241") ? "" : (stryCov_9fa48("2241"), 'Commitment added successfully'), stryMutAct_9fa48("2242") ? "" : (stryCov_9fa48("2242"), 'success'));
          }
        } catch (error: unknown) {
          if (stryMutAct_9fa48("2243")) {
            {}
          } else {
            stryCov_9fa48("2243");
            showToast(stryMutAct_9fa48("2244") ? `` : (stryCov_9fa48("2244"), `Failed to add task: ${error instanceof Error ? error.message : stryMutAct_9fa48("2245") ? "" : (stryCov_9fa48("2245"), 'Unknown error')}`), stryMutAct_9fa48("2246") ? "" : (stryCov_9fa48("2246"), 'error'));
          }
        }
      }
    };
    const handleSaveEdit = async (taskId: string, updates: Partial<AnchorTask>) => {
      if (stryMutAct_9fa48("2247")) {
        {}
      } else {
        stryCov_9fa48("2247");
        try {
          if (stryMutAct_9fa48("2248")) {
            {}
          } else {
            stryCov_9fa48("2248");
            await updateTask(taskId, updates);
            setEditingTaskId(null);
            showToast(stryMutAct_9fa48("2249") ? "" : (stryCov_9fa48("2249"), 'Commitment updated!'), stryMutAct_9fa48("2250") ? "" : (stryCov_9fa48("2250"), 'success'));
          }
        } catch {
          if (stryMutAct_9fa48("2251")) {
            {}
          } else {
            stryCov_9fa48("2251");
            showToast(stryMutAct_9fa48("2252") ? "" : (stryCov_9fa48("2252"), 'Could not update commitment. Please try again.'), stryMutAct_9fa48("2253") ? "" : (stryCov_9fa48("2253"), 'error'));
          }
        }
      }
    };
    const handleConfirmFinancial = async (title: string) => {
      if (stryMutAct_9fa48("2254")) {
        {}
      } else {
        stryCov_9fa48("2254");
        setTimeout(async () => {
          if (stryMutAct_9fa48("2255")) {
            {}
          } else {
            stryCov_9fa48("2255");
            if (stryMutAct_9fa48("2257") ? false : stryMutAct_9fa48("2256") ? true : (stryCov_9fa48("2256", "2257"), await confirm(stryMutAct_9fa48("2258") ? {} : (stryCov_9fa48("2258"), {
              title: stryMutAct_9fa48("2259") ? "" : (stryCov_9fa48("2259"), 'Financial Transaction?'),
              message: stryMutAct_9fa48("2260") ? `` : (stryCov_9fa48("2260"), `You've marked '${title}' as done. Would you like to record a financial transaction for this now?`),
              confirmText: stryMutAct_9fa48("2261") ? "" : (stryCov_9fa48("2261"), 'Yes, Record'),
              cancelText: stryMutAct_9fa48("2262") ? "" : (stryCov_9fa48("2262"), 'Not now')
            })))) navigateTo(stryMutAct_9fa48("2263") ? "" : (stryCov_9fa48("2263"), 'finance'));
          }
        }, 100);
      }
    };
    const handleDeleteTask = async (taskId: string) => {
      if (stryMutAct_9fa48("2264")) {
        {}
      } else {
        stryCov_9fa48("2264");
        const task = tasks.find(stryMutAct_9fa48("2265") ? () => undefined : (stryCov_9fa48("2265"), t => stryMutAct_9fa48("2268") ? t.id !== taskId : stryMutAct_9fa48("2267") ? false : stryMutAct_9fa48("2266") ? true : (stryCov_9fa48("2266", "2267", "2268"), t.id === taskId)));
        if (stryMutAct_9fa48("2270") ? false : stryMutAct_9fa48("2269") ? true : (stryCov_9fa48("2269", "2270"), await confirm(stryMutAct_9fa48("2271") ? {} : (stryCov_9fa48("2271"), {
          title: stryMutAct_9fa48("2272") ? "" : (stryCov_9fa48("2272"), 'Delete Commitment?'),
          message: (stryMutAct_9fa48("2275") ? task?.category !== 'family' : stryMutAct_9fa48("2274") ? false : stryMutAct_9fa48("2273") ? true : (stryCov_9fa48("2273", "2274", "2275"), (stryMutAct_9fa48("2276") ? task.category : (stryCov_9fa48("2276"), task?.category)) === (stryMutAct_9fa48("2277") ? "" : (stryCov_9fa48("2277"), 'family')))) ? stryMutAct_9fa48("2278") ? `` : (stryCov_9fa48("2278"), `Are you sure you want to delete "${stryMutAct_9fa48("2279") ? task.title : (stryCov_9fa48("2279"), task?.title)}"? This is a family commitment and will no longer be tracked.`) : stryMutAct_9fa48("2280") ? `` : (stryCov_9fa48("2280"), `Are you sure you want to delete "${stryMutAct_9fa48("2281") ? task.title : (stryCov_9fa48("2281"), task?.title)}"? This action cannot be undone.`),
          confirmText: stryMutAct_9fa48("2282") ? "" : (stryCov_9fa48("2282"), 'Delete'),
          cancelText: stryMutAct_9fa48("2283") ? "" : (stryCov_9fa48("2283"), 'Keep'),
          type: stryMutAct_9fa48("2284") ? "" : (stryCov_9fa48("2284"), 'danger')
        })))) {
          if (stryMutAct_9fa48("2285")) {
            {}
          } else {
            stryCov_9fa48("2285");
            try {
              if (stryMutAct_9fa48("2286")) {
                {}
              } else {
                stryCov_9fa48("2286");
                await deleteTask(taskId);
                showToast(stryMutAct_9fa48("2287") ? "" : (stryCov_9fa48("2287"), 'Commitment deleted'), stryMutAct_9fa48("2288") ? "" : (stryCov_9fa48("2288"), 'success'));
              }
            } catch {
              if (stryMutAct_9fa48("2289")) {
                {}
              } else {
                stryCov_9fa48("2289");
                showToast(stryMutAct_9fa48("2290") ? "" : (stryCov_9fa48("2290"), 'Could not delete commitment'), stryMutAct_9fa48("2291") ? "" : (stryCov_9fa48("2291"), 'error'));
              }
            }
          }
        }
      }
    };
    const {
      activeTasks,
      completedTasks,
      totalFiltered,
      allFiltered
    } = useMemo(() => {
      if (stryMutAct_9fa48("2292")) {
        {}
      } else {
        stryCov_9fa48("2292");
        const filtered = stryMutAct_9fa48("2293") ? tasks : (stryCov_9fa48("2293"), tasks.filter(stryMutAct_9fa48("2294") ? () => undefined : (stryCov_9fa48("2294"), t => stryMutAct_9fa48("2297") ? filter === 'all' && t.type === filter : stryMutAct_9fa48("2296") ? false : stryMutAct_9fa48("2295") ? true : (stryCov_9fa48("2295", "2296", "2297"), (stryMutAct_9fa48("2299") ? filter !== 'all' : stryMutAct_9fa48("2298") ? false : (stryCov_9fa48("2298", "2299"), filter === (stryMutAct_9fa48("2300") ? "" : (stryCov_9fa48("2300"), 'all')))) || (stryMutAct_9fa48("2302") ? t.type !== filter : stryMutAct_9fa48("2301") ? false : (stryCov_9fa48("2301", "2302"), t.type === filter))))));
        return stryMutAct_9fa48("2303") ? {} : (stryCov_9fa48("2303"), {
          activeTasks: stryMutAct_9fa48("2304") ? filtered : (stryCov_9fa48("2304"), filtered.filter(stryMutAct_9fa48("2305") ? () => undefined : (stryCov_9fa48("2305"), t => stryMutAct_9fa48("2306") ? t.completed : (stryCov_9fa48("2306"), !t.completed)))),
          completedTasks: stryMutAct_9fa48("2307") ? filtered : (stryCov_9fa48("2307"), filtered.filter(stryMutAct_9fa48("2308") ? () => undefined : (stryCov_9fa48("2308"), t => t.completed))),
          totalFiltered: filtered.length,
          allFiltered: filtered
        });
      }
    }, stryMutAct_9fa48("2309") ? [] : (stryCov_9fa48("2309"), [tasks, filter]));
    const editingTask = useMemo(stryMutAct_9fa48("2310") ? () => undefined : (stryCov_9fa48("2310"), () => editingTaskId ? tasks.find(stryMutAct_9fa48("2311") ? () => undefined : (stryCov_9fa48("2311"), t => stryMutAct_9fa48("2314") ? t.id !== editingTaskId : stryMutAct_9fa48("2313") ? false : stryMutAct_9fa48("2312") ? true : (stryCov_9fa48("2312", "2313", "2314"), t.id === editingTaskId))) : null), stryMutAct_9fa48("2315") ? [] : (stryCov_9fa48("2315"), [editingTaskId, tasks]));
    return <FeatureErrorBoundary featureName="Commitments">
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
        <SectionHeader title="Commitments" subtitle={hasFamilyActive ? stryMutAct_9fa48("2316") ? "" : (stryCov_9fa48("2316"), "Manage your daily obligations, goals, and family duties.") : stryMutAct_9fa48("2317") ? "" : (stryCov_9fa48("2317"), "Manage your daily obligations and goals.")} action={<Button onClick={stryMutAct_9fa48("2318") ? () => undefined : (stryCov_9fa48("2318"), () => setShowAdd(stryMutAct_9fa48("2319") ? showAdd : (stryCov_9fa48("2319"), !showAdd)))} variant={showAdd ? stryMutAct_9fa48("2320") ? "" : (stryCov_9fa48("2320"), 'secondary') : stryMutAct_9fa48("2321") ? "" : (stryCov_9fa48("2321"), 'primary')} className="gap-2"><Plus className="w-4 h-4" /> <span>{showAdd ? stryMutAct_9fa48("2322") ? "" : (stryCov_9fa48("2322"), 'Close') : stryMutAct_9fa48("2323") ? "" : (stryCov_9fa48("2323"), 'New Commitment')}</span></Button>} />
        <CommitmentsFilterBar filter={filter} viewMode={viewMode} onFilterChange={setFilter} onViewChange={setViewMode} />
        {stryMutAct_9fa48("2326") ? showAdd || <TaskForm onClose={() => setShowAdd(false)} onAdd={handleAdd} hasFamilyActive={hasFamilyActive} /> : stryMutAct_9fa48("2325") ? false : stryMutAct_9fa48("2324") ? true : (stryCov_9fa48("2324", "2325", "2326"), showAdd && <TaskForm onClose={stryMutAct_9fa48("2327") ? () => undefined : (stryCov_9fa48("2327"), () => setShowAdd(stryMutAct_9fa48("2328") ? true : (stryCov_9fa48("2328"), false)))} onAdd={handleAdd} hasFamilyActive={hasFamilyActive} />)}
        {stryMutAct_9fa48("2331") ? editingTask || <EditTaskForm task={editingTask} hasFamilyActive={hasFamilyActive} onSave={handleSaveEdit} onCancel={() => setEditingTaskId(null)} /> : stryMutAct_9fa48("2330") ? false : stryMutAct_9fa48("2329") ? true : (stryCov_9fa48("2329", "2330", "2331"), editingTask && <EditTaskForm task={editingTask} hasFamilyActive={hasFamilyActive} onSave={handleSaveEdit} onCancel={stryMutAct_9fa48("2332") ? () => undefined : (stryCov_9fa48("2332"), () => setEditingTaskId(null))} />)}
        <div className={loadingTasks ? stryMutAct_9fa48("2333") ? "" : (stryCov_9fa48("2333"), 'opacity-50 pointer-events-none') : stryMutAct_9fa48("2334") ? "Stryker was here!" : (stryCov_9fa48("2334"), '')}>
          {(stryMutAct_9fa48("2337") ? viewMode !== 'list' : stryMutAct_9fa48("2336") ? false : stryMutAct_9fa48("2335") ? true : (stryCov_9fa48("2335", "2336", "2337"), viewMode === (stryMutAct_9fa48("2338") ? "" : (stryCov_9fa48("2338"), 'list')))) ? <TaskList activeTasks={activeTasks} completedTasks={completedTasks} hasFamilyActive={hasFamilyActive} editingTaskId={editingTaskId} onToggle={toggleTask} onStartEdit={setEditingTaskId} onDelete={handleDeleteTask} onConfirmFinancial={handleConfirmFinancial} /> : <WeeklyView tasks={allFiltered} onToggle={toggleTask} />}
        </div>
        {stryMutAct_9fa48("2341") ? totalFiltered === 0 && !showAdd || <CommitmentsEmptyState filter={filter} hasFamilyActive={hasFamilyActive} onCreateFirst={() => setShowAdd(true)} onLearnMore={() => showToast('Commitment exports will be available in the next update.', 'info')} /> : stryMutAct_9fa48("2340") ? false : stryMutAct_9fa48("2339") ? true : (stryCov_9fa48("2339", "2340", "2341"), (stryMutAct_9fa48("2343") ? totalFiltered === 0 || !showAdd : stryMutAct_9fa48("2342") ? true : (stryCov_9fa48("2342", "2343"), (stryMutAct_9fa48("2345") ? totalFiltered !== 0 : stryMutAct_9fa48("2344") ? true : (stryCov_9fa48("2344", "2345"), totalFiltered === 0)) && (stryMutAct_9fa48("2346") ? showAdd : (stryCov_9fa48("2346"), !showAdd)))) && <CommitmentsEmptyState filter={filter} hasFamilyActive={hasFamilyActive} onCreateFirst={stryMutAct_9fa48("2347") ? () => undefined : (stryCov_9fa48("2347"), () => setShowAdd(stryMutAct_9fa48("2348") ? false : (stryCov_9fa48("2348"), true)))} onLearnMore={stryMutAct_9fa48("2349") ? () => undefined : (stryCov_9fa48("2349"), () => showToast(stryMutAct_9fa48("2350") ? "" : (stryCov_9fa48("2350"), 'Commitment exports will be available in the next update.'), stryMutAct_9fa48("2351") ? "" : (stryCov_9fa48("2351"), 'info')))} />)}
      </div>
    </FeatureErrorBoundary>;
  }
};
export default CommitmentsView;