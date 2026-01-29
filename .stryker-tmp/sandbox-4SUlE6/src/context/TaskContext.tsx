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
import React, { useContext, useCallback } from 'react';
import { useCommitmentService } from '../hooks/useCommitmentService';
import { useAuth } from './AuthContext';
import { useApp } from './AnchorContext';
import { useHaptic } from '../hooks/useHaptic';
import { TaskContext } from './TaskContextDefinition';
export { TaskContext };
import { useTaskReminders } from '../hooks/useTaskReminders';
import { useFabricSuggestions } from '../hooks/useFabricSuggestions';
export const TaskProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  if (stryMutAct_9fa48("1812")) {
    {}
  } else {
    stryCov_9fa48("1812");
    // We need the user from the AuthContext
    const {
      user
    } = useAuth();
    const {
      navigateTo
    } = useApp();
    const haptic = useHaptic();

    // Use the existing hook
    const commitmentService = useCommitmentService(user);

    // Enable system-wide reminders
    useTaskReminders(commitmentService.tasks);

    // Fabric v1.5: Smart suggestions
    const {
      suggestions,
      onCommitmentCompleted,
      dismissSuggestion
    } = useFabricSuggestions();

    // Wrap toggleTask to trigger suggestions when completing tasks
    const toggleTaskWithSuggestion = useCallback(async (id: string, currentStatus: boolean) => {
      if (stryMutAct_9fa48("1813")) {
        {}
      } else {
        stryCov_9fa48("1813");
        // IMPORTANT: Capture task data BEFORE toggle to avoid stale closure
        const task = commitmentService.tasks.find(stryMutAct_9fa48("1814") ? () => undefined : (stryCov_9fa48("1814"), t => stryMutAct_9fa48("1817") ? t.id !== id : stryMutAct_9fa48("1816") ? false : stryMutAct_9fa48("1815") ? true : (stryCov_9fa48("1815", "1816", "1817"), t.id === id)));

        // Execute the toggle
        await commitmentService.toggleTask(id, currentStatus);

        // Haptic feedback: heavy for completion, light for uncomplete
        haptic.trigger(currentStatus ? stryMutAct_9fa48("1818") ? "" : (stryCov_9fa48("1818"), 'light') : stryMutAct_9fa48("1819") ? "" : (stryCov_9fa48("1819"), 'heavy'));

        // If completing a task (currentStatus was false, now true)
        // Trigger suggestion with pre-toggle task data
        if (stryMutAct_9fa48("1822") ? !currentStatus || task : stryMutAct_9fa48("1821") ? false : stryMutAct_9fa48("1820") ? true : (stryCov_9fa48("1820", "1821", "1822"), (stryMutAct_9fa48("1823") ? currentStatus : (stryCov_9fa48("1823"), !currentStatus)) && task)) {
          if (stryMutAct_9fa48("1824")) {
            {}
          } else {
            stryCov_9fa48("1824");
            try {
              if (stryMutAct_9fa48("1825")) {
                {}
              } else {
                stryCov_9fa48("1825");
                onCommitmentCompleted(task, navigateTo);
              }
            } catch (err) {
              if (stryMutAct_9fa48("1826")) {
                {}
              } else {
                stryCov_9fa48("1826");
                // Non-critical: suggestion failure shouldn't break task completion
                console.warn(stryMutAct_9fa48("1827") ? "" : (stryCov_9fa48("1827"), '[Fabric] Suggestion trigger failed:'), err);
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("1828") ? [] : (stryCov_9fa48("1828"), [commitmentService, onCommitmentCompleted, navigateTo, haptic]));
    return <TaskContext.Provider value={stryMutAct_9fa48("1829") ? {} : (stryCov_9fa48("1829"), {
      ...commitmentService,
      toggleTask: toggleTaskWithSuggestion,
      loadingTasks: stryMutAct_9fa48("1830") ? true : (stryCov_9fa48("1830"), false),
      // Fabric v1.5
      fabricSuggestions: suggestions,
      dismissFabricSuggestion: dismissSuggestion
    })}>
            {children}
        </TaskContext.Provider>;
  }
};
export const useTasks = () => {
  if (stryMutAct_9fa48("1831")) {
    {}
  } else {
    stryCov_9fa48("1831");
    const context = useContext(TaskContext);
    if (stryMutAct_9fa48("1834") ? context !== undefined : stryMutAct_9fa48("1833") ? false : stryMutAct_9fa48("1832") ? true : (stryCov_9fa48("1832", "1833", "1834"), context === undefined)) {
      if (stryMutAct_9fa48("1835")) {
        {}
      } else {
        stryCov_9fa48("1835");
        throw new Error(stryMutAct_9fa48("1836") ? "" : (stryCov_9fa48("1836"), 'useTasks must be used within a TaskProvider'));
      }
    }
    return context;
  }
};