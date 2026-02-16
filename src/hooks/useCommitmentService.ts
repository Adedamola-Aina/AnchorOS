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
import { useMemo, useCallback } from 'react';
import type { User } from 'firebase/auth';
import type { AnchorTask } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { useTasksQuery, TASK_KEYS } from './queries/useTaskQueries';
import { auditCommitments } from '../services/AuditService';
import { checkRateLimit, formatRetryTime, RATE_LIMIT_CONFIGS } from '../utils/rateLimit';
import { useCommitmentResetEffect } from './useCommitmentReset';
import { createCommitment, deleteCommitment, toggleCommitmentCompletion, updateCommitment } from '../api/CommitmentApi';
export const useCommitmentService = (user: User | null) => {
  if (stryMutAct_9fa48("42")) {
    {}
  } else {
    stryCov_9fa48("42");
    const queryClient = useQueryClient();
    const {
      data: rawTasks = stryMutAct_9fa48("43") ? ["Stryker was here"] : (stryCov_9fa48("43"), []),
      isLoading
    } = useTasksQuery(stryMutAct_9fa48("44") ? user.uid : (stryCov_9fa48("44"), user?.uid));

    // Lazy reset: auto-reset completed status and break streaks when cycle changes
    useCommitmentResetEffect(user, rawTasks);
    const tasks = useMemo(() => {
      if (stryMutAct_9fa48("45")) {
        {}
      } else {
        stryCov_9fa48("45");
        const timeOrder: Record<string, number> = stryMutAct_9fa48("46") ? {} : (stryCov_9fa48("46"), {
          'morning': 1,
          'afternoon': 2,
          'evening': 3,
          'any': 4
        });
        return stryMutAct_9fa48("47") ? [...rawTasks] : (stryCov_9fa48("47"), (stryMutAct_9fa48("48") ? [] : (stryCov_9fa48("48"), [...rawTasks])).sort((a, b) => {
          if (stryMutAct_9fa48("49")) {
            {}
          } else {
            stryCov_9fa48("49");
            if (stryMutAct_9fa48("52") ? a.completed === b.completed : stryMutAct_9fa48("51") ? false : stryMutAct_9fa48("50") ? true : (stryCov_9fa48("50", "51", "52"), a.completed !== b.completed)) return a.completed ? 1 : stryMutAct_9fa48("53") ? +1 : (stryCov_9fa48("53"), -1);
            if (stryMutAct_9fa48("56") ? a.type === 'daily' || b.type === 'daily' : stryMutAct_9fa48("55") ? false : stryMutAct_9fa48("54") ? true : (stryCov_9fa48("54", "55", "56"), (stryMutAct_9fa48("58") ? a.type !== 'daily' : stryMutAct_9fa48("57") ? true : (stryCov_9fa48("57", "58"), a.type === (stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), 'daily')))) && (stryMutAct_9fa48("61") ? b.type !== 'daily' : stryMutAct_9fa48("60") ? true : (stryCov_9fa48("60", "61"), b.type === (stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), 'daily')))))) {
              if (stryMutAct_9fa48("63")) {
                {}
              } else {
                stryCov_9fa48("63");
                return stryMutAct_9fa48("64") ? (timeOrder[a.timeOfDay || 'any'] || 4) + (timeOrder[b.timeOfDay || 'any'] || 4) : (stryCov_9fa48("64"), (stryMutAct_9fa48("67") ? timeOrder[a.timeOfDay || 'any'] && 4 : stryMutAct_9fa48("66") ? false : stryMutAct_9fa48("65") ? true : (stryCov_9fa48("65", "66", "67"), timeOrder[stryMutAct_9fa48("70") ? a.timeOfDay && 'any' : stryMutAct_9fa48("69") ? false : stryMutAct_9fa48("68") ? true : (stryCov_9fa48("68", "69", "70"), a.timeOfDay || (stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), 'any')))] || 4)) - (stryMutAct_9fa48("74") ? timeOrder[b.timeOfDay || 'any'] && 4 : stryMutAct_9fa48("73") ? false : stryMutAct_9fa48("72") ? true : (stryCov_9fa48("72", "73", "74"), timeOrder[stryMutAct_9fa48("77") ? b.timeOfDay && 'any' : stryMutAct_9fa48("76") ? false : stryMutAct_9fa48("75") ? true : (stryCov_9fa48("75", "76", "77"), b.timeOfDay || (stryMutAct_9fa48("78") ? "" : (stryCov_9fa48("78"), 'any')))] || 4)));
              }
            }
            return 0;
          }
        }));
      }
    }, stryMutAct_9fa48("79") ? [] : (stryCov_9fa48("79"), [rawTasks]));
    const addTask = useCallback(async (task: Omit<AnchorTask, 'id' | 'createdAt'>) => {
      if (stryMutAct_9fa48("80")) {
        {}
      } else {
        stryCov_9fa48("80");
        if (stryMutAct_9fa48("83") ? false : stryMutAct_9fa48("82") ? true : stryMutAct_9fa48("81") ? user : (stryCov_9fa48("81", "82", "83"), !user)) return;

        // Rate limit: 20 commitments per hour
        const rateCheck = checkRateLimit(stryMutAct_9fa48("84") ? `` : (stryCov_9fa48("84"), `commitmentCreate:${user.uid}`), RATE_LIMIT_CONFIGS.commitmentCreate);
        if (stryMutAct_9fa48("86") ? false : stryMutAct_9fa48("85") ? true : (stryCov_9fa48("85", "86"), rateCheck.isLimited)) {
          if (stryMutAct_9fa48("87")) {
            {}
          } else {
            stryCov_9fa48("87");
            throw new Error(stryMutAct_9fa48("88") ? `` : (stryCov_9fa48("88"), `Too many commitments created. Please try again in ${formatRetryTime(stryMutAct_9fa48("91") ? rateCheck.retryAfterMs && 0 : stryMutAct_9fa48("90") ? false : stryMutAct_9fa48("89") ? true : (stryCov_9fa48("89", "90", "91"), rateCheck.retryAfterMs || 0))}.`));
          }
        }
        const docRef = await createCommitment(user.uid, task);
        // AUDIT: Log commitment creation
        auditCommitments.created(docRef.id, task.title);
        queryClient.invalidateQueries(stryMutAct_9fa48("92") ? {} : (stryCov_9fa48("92"), {
          queryKey: TASK_KEYS.list(user.uid)
        }));
      }
    }, stryMutAct_9fa48("93") ? [] : (stryCov_9fa48("93"), [user, queryClient]));

    /**
     * Toggle task completion with optimistic updates and atomic streak calculation.
     * 
     * BUG-023 FIX (COMPLETE): Uses optimistic updates with onSnapshot sync.
     * - Updates React Query cache immediately for instant UI feedback
     * - Executes Firestore transaction in background
     * - onSnapshot listener automatically syncs changes from Firestore
     * - Rolls back on error
     * 
     * This eliminates:
     * - Multi-click requirement (optimistic update provides instant feedback)
     * - State reversion (onSnapshot ensures sync with Firestore truth)
     * - Janky animations (smooth transitions with optimistic updates)
     */
    const toggleTask = useCallback(async (id: string, currentStatus: boolean) => {
      if (stryMutAct_9fa48("94")) {
        {}
      } else {
        stryCov_9fa48("94");
        if (stryMutAct_9fa48("97") ? false : stryMutAct_9fa48("96") ? true : stryMutAct_9fa48("95") ? user : (stryCov_9fa48("95", "96", "97"), !user)) return;

        // ✅ OPTIMISTIC UPDATE: Update cache immediately for instant UI feedback
        queryClient.setQueryData<AnchorTask[]>(TASK_KEYS.list(user.uid), old => {
          if (stryMutAct_9fa48("98")) {
            {}
          } else {
            stryCov_9fa48("98");
            if (stryMutAct_9fa48("101") ? false : stryMutAct_9fa48("100") ? true : stryMutAct_9fa48("99") ? old : (stryCov_9fa48("99", "100", "101"), !old)) return old;
            return old.map(task => {
              if (stryMutAct_9fa48("102")) {
                {}
              } else {
                stryCov_9fa48("102");
                if (stryMutAct_9fa48("105") ? task.id === id : stryMutAct_9fa48("104") ? false : stryMutAct_9fa48("103") ? true : (stryCov_9fa48("103", "104", "105"), task.id !== id)) return task;

                // Calculate updates (same logic as Firestore transaction)
                const updates: Partial<AnchorTask> = stryMutAct_9fa48("106") ? {} : (stryCov_9fa48("106"), {
                  completed: stryMutAct_9fa48("107") ? currentStatus : (stryCov_9fa48("107"), !currentStatus)
                });
                if (stryMutAct_9fa48("110") ? false : stryMutAct_9fa48("109") ? true : stryMutAct_9fa48("108") ? currentStatus : (stryCov_9fa48("108", "109", "110"), !currentStatus)) {
                  if (stryMutAct_9fa48("111")) {
                    {}
                  } else {
                    stryCov_9fa48("111");
                    // Completing
                    updates.lastCompletedAt = new Date().toISOString();
                    const currentStreak = stryMutAct_9fa48("114") ? task.currentStreak && 0 : stryMutAct_9fa48("113") ? false : stryMutAct_9fa48("112") ? true : (stryCov_9fa48("112", "113", "114"), task.currentStreak || 0);
                    const newStreak = stryMutAct_9fa48("115") ? currentStreak - 1 : (stryCov_9fa48("115"), currentStreak + 1);
                    updates.currentStreak = newStreak;
                    updates.longestStreak = stryMutAct_9fa48("116") ? Math.min(newStreak, task.longestStreak || 0) : (stryCov_9fa48("116"), Math.max(newStreak, stryMutAct_9fa48("119") ? task.longestStreak && 0 : stryMutAct_9fa48("118") ? false : stryMutAct_9fa48("117") ? true : (stryCov_9fa48("117", "118", "119"), task.longestStreak || 0)));
                  }
                } else {
                  if (stryMutAct_9fa48("120")) {
                    {}
                  } else {
                    stryCov_9fa48("120");
                    // Uncompleting
                    const currentStreak = stryMutAct_9fa48("123") ? task.currentStreak && 0 : stryMutAct_9fa48("122") ? false : stryMutAct_9fa48("121") ? true : (stryCov_9fa48("121", "122", "123"), task.currentStreak || 0);
                    if (stryMutAct_9fa48("127") ? currentStreak <= 0 : stryMutAct_9fa48("126") ? currentStreak >= 0 : stryMutAct_9fa48("125") ? false : stryMutAct_9fa48("124") ? true : (stryCov_9fa48("124", "125", "126", "127"), currentStreak > 0)) {
                      if (stryMutAct_9fa48("128")) {
                        {}
                      } else {
                        stryCov_9fa48("128");
                        updates.currentStreak = stryMutAct_9fa48("129") ? currentStreak + 1 : (stryCov_9fa48("129"), currentStreak - 1);
                      }
                    }
                  }
                }
                return stryMutAct_9fa48("130") ? {} : (stryCov_9fa48("130"), {
                  ...task,
                  ...updates
                });
              }
            });
          }
        });

        // Execute Firestore transaction
        // onSnapshot listener will automatically sync the final state from Firestore
        try {
          if (stryMutAct_9fa48("131")) {
            {}
          } else {
            stryCov_9fa48("131");
            await toggleCommitmentCompletion(user.uid, id, currentStatus);

            // ✅ NO REFETCH NEEDED: onSnapshot listener handles real-time sync automatically
            // The listener will fire when Firestore confirms the update, ensuring UI stays in sync
          }
        } catch (error) {
          if (stryMutAct_9fa48("132")) {
            {}
          } else {
            stryCov_9fa48("132");
            // ❌ ROLLBACK: If Firestore fails, invalidate cache to trigger onSnapshot refetch
            console.error(stryMutAct_9fa48("133") ? "" : (stryCov_9fa48("133"), '[toggleTask] Firestore transaction failed, rolling back optimistic update:'), error);
            queryClient.invalidateQueries(stryMutAct_9fa48("134") ? {} : (stryCov_9fa48("134"), {
              queryKey: TASK_KEYS.list(user.uid)
            }));
            throw error;
          }
        }

        // AUDIT: Log completion (only when completing, not uncompleting)
        if (stryMutAct_9fa48("137") ? false : stryMutAct_9fa48("136") ? true : stryMutAct_9fa48("135") ? currentStatus : (stryCov_9fa48("135", "136", "137"), !currentStatus)) {
          if (stryMutAct_9fa48("138")) {
            {}
          } else {
            stryCov_9fa48("138");
            auditCommitments.completed(id);
          }
        }
      }
    }, stryMutAct_9fa48("139") ? [] : (stryCov_9fa48("139"), [user, queryClient]));
    const deleteTask = useCallback(async (id: string) => {
      if (stryMutAct_9fa48("140")) {
        {}
      } else {
        stryCov_9fa48("140");
        if (stryMutAct_9fa48("143") ? false : stryMutAct_9fa48("142") ? true : stryMutAct_9fa48("141") ? user : (stryCov_9fa48("141", "142", "143"), !user)) return;
        // AUDIT: Log commitment deletion
        auditCommitments.deleted(id);
        await deleteCommitment(user.uid, id);
        queryClient.invalidateQueries(stryMutAct_9fa48("144") ? {} : (stryCov_9fa48("144"), {
          queryKey: TASK_KEYS.list(user.uid)
        }));
      }
    }, stryMutAct_9fa48("145") ? [] : (stryCov_9fa48("145"), [user, queryClient]));
    const updateTask = useCallback(async (id: string, updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => {
      if (stryMutAct_9fa48("146")) {
        {}
      } else {
        stryCov_9fa48("146");
        if (stryMutAct_9fa48("149") ? false : stryMutAct_9fa48("148") ? true : stryMutAct_9fa48("147") ? user : (stryCov_9fa48("147", "148", "149"), !user)) return;
        await updateCommitment(user.uid, id, updates);
        queryClient.invalidateQueries(stryMutAct_9fa48("150") ? {} : (stryCov_9fa48("150"), {
          queryKey: TASK_KEYS.list(user.uid)
        }));
      }
    }, stryMutAct_9fa48("151") ? [] : (stryCov_9fa48("151"), [user, queryClient]));
    return useMemo(stryMutAct_9fa48("152") ? () => undefined : (stryCov_9fa48("152"), () => stryMutAct_9fa48("153") ? {} : (stryCov_9fa48("153"), {
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      loadingTasks: isLoading
    })), stryMutAct_9fa48("154") ? [] : (stryCov_9fa48("154"), [tasks, addTask, toggleTask, deleteTask, updateTask, isLoading]));
  }
};