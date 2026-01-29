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
import { useEffect, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorTask } from '../types';
import { useQueryClient } from '@tanstack/react-query';
import { useTasksQuery, TASK_KEYS } from './queries/useTaskQueries';
export const useCommitmentService = (user: User | null) => {
  if (stryMutAct_9fa48("6865")) {
    {}
  } else {
    stryCov_9fa48("6865");
    const queryClient = useQueryClient();
    const {
      data: rawTasks = stryMutAct_9fa48("6866") ? ["Stryker was here"] : (stryCov_9fa48("6866"), []),
      isLoading
    } = useTasksQuery(stryMutAct_9fa48("6867") ? user.uid : (stryCov_9fa48("6867"), user?.uid));

    // 1. Lazy Reset Logic (Effect based)
    useEffect(() => {
      if (stryMutAct_9fa48("6868")) {
        {}
      } else {
        stryCov_9fa48("6868");
        if (stryMutAct_9fa48("6871") ? !user && rawTasks.length === 0 : stryMutAct_9fa48("6870") ? false : stryMutAct_9fa48("6869") ? true : (stryCov_9fa48("6869", "6870", "6871"), (stryMutAct_9fa48("6872") ? user : (stryCov_9fa48("6872"), !user)) || (stryMutAct_9fa48("6874") ? rawTasks.length !== 0 : stryMutAct_9fa48("6873") ? false : (stryCov_9fa48("6873", "6874"), rawTasks.length === 0)))) return;
        const now = new Date();
        const today = now.toLocaleDateString(stryMutAct_9fa48("6875") ? "" : (stryCov_9fa48("6875"), 'en-CA'));
        rawTasks.forEach(t => {
          if (stryMutAct_9fa48("6876")) {
            {}
          } else {
            stryCov_9fa48("6876");
            // Logic A: Reset 'completed' status if distinct period
            if (stryMutAct_9fa48("6879") ? t.completed || t.lastCompletedAt : stryMutAct_9fa48("6878") ? false : stryMutAct_9fa48("6877") ? true : (stryCov_9fa48("6877", "6878", "6879"), t.completed && t.lastCompletedAt)) {
              if (stryMutAct_9fa48("6880")) {
                {}
              } else {
                stryCov_9fa48("6880");
                const lastDate = new Date(t.lastCompletedAt);
                const lastDateLocal = lastDate.toLocaleDateString(stryMutAct_9fa48("6881") ? "" : (stryCov_9fa48("6881"), 'en-CA'));
                let shouldReset = stryMutAct_9fa48("6882") ? true : (stryCov_9fa48("6882"), false);
                if (stryMutAct_9fa48("6885") ? lastDateLocal === today : stryMutAct_9fa48("6884") ? false : stryMutAct_9fa48("6883") ? true : (stryCov_9fa48("6883", "6884", "6885"), lastDateLocal !== today)) {
                  if (stryMutAct_9fa48("6886")) {
                    {}
                  } else {
                    stryCov_9fa48("6886");
                    if (stryMutAct_9fa48("6889") ? t.type !== 'daily' : stryMutAct_9fa48("6888") ? false : stryMutAct_9fa48("6887") ? true : (stryCov_9fa48("6887", "6888", "6889"), t.type === (stryMutAct_9fa48("6890") ? "" : (stryCov_9fa48("6890"), 'daily')))) {
                      if (stryMutAct_9fa48("6891")) {
                        {}
                      } else {
                        stryCov_9fa48("6891");
                        shouldReset = stryMutAct_9fa48("6892") ? false : (stryCov_9fa48("6892"), true);
                      }
                    } else if (stryMutAct_9fa48("6895") ? t.type !== 'weekly' : stryMutAct_9fa48("6894") ? false : stryMutAct_9fa48("6893") ? true : (stryCov_9fa48("6893", "6894", "6895"), t.type === (stryMutAct_9fa48("6896") ? "" : (stryCov_9fa48("6896"), 'weekly')))) {
                      if (stryMutAct_9fa48("6897")) {
                        {}
                      } else {
                        stryCov_9fa48("6897");
                        const dayName = now.toLocaleDateString(stryMutAct_9fa48("6898") ? "" : (stryCov_9fa48("6898"), 'en-US'), stryMutAct_9fa48("6899") ? {} : (stryCov_9fa48("6899"), {
                          weekday: stryMutAct_9fa48("6900") ? "" : (stryCov_9fa48("6900"), 'long')
                        }));
                        if (stryMutAct_9fa48("6903") ? t.daysOfWeek.includes(dayName) : stryMutAct_9fa48("6902") ? false : stryMutAct_9fa48("6901") ? true : (stryCov_9fa48("6901", "6902", "6903"), t.daysOfWeek?.includes(dayName))) {
                          if (stryMutAct_9fa48("6904")) {
                            {}
                          } else {
                            stryCov_9fa48("6904");
                            shouldReset = stryMutAct_9fa48("6905") ? false : (stryCov_9fa48("6905"), true);
                          }
                        } else {
                          if (stryMutAct_9fa48("6906")) {
                            {}
                          } else {
                            stryCov_9fa48("6906");
                            const diffTime = Math.abs(stryMutAct_9fa48("6907") ? now.getTime() + lastDate.getTime() : (stryCov_9fa48("6907"), now.getTime() - lastDate.getTime()));
                            const diffDays = Math.ceil(stryMutAct_9fa48("6908") ? diffTime * (1000 * 60 * 60 * 24) : (stryCov_9fa48("6908"), diffTime / (stryMutAct_9fa48("6909") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("6909"), (stryMutAct_9fa48("6910") ? 1000 * 60 / 60 : (stryCov_9fa48("6910"), (stryMutAct_9fa48("6911") ? 1000 / 60 : (stryCov_9fa48("6911"), 1000 * 60)) * 60)) * 24))));
                            if (stryMutAct_9fa48("6915") ? diffDays < 7 : stryMutAct_9fa48("6914") ? diffDays > 7 : stryMutAct_9fa48("6913") ? false : stryMutAct_9fa48("6912") ? true : (stryCov_9fa48("6912", "6913", "6914", "6915"), diffDays >= 7)) shouldReset = stryMutAct_9fa48("6916") ? false : (stryCov_9fa48("6916"), true);
                          }
                        }
                      }
                    } else if (stryMutAct_9fa48("6919") ? t.type !== 'monthly' : stryMutAct_9fa48("6918") ? false : stryMutAct_9fa48("6917") ? true : (stryCov_9fa48("6917", "6918", "6919"), t.type === (stryMutAct_9fa48("6920") ? "" : (stryCov_9fa48("6920"), 'monthly')))) {
                      if (stryMutAct_9fa48("6921")) {
                        {}
                      } else {
                        stryCov_9fa48("6921");
                        const todayDay = now.getDate();
                        const isCommitmentDay = stryMutAct_9fa48("6924") ? t.daysOfMonth?.includes(todayDay) && t.dayOfMonth === todayDay : stryMutAct_9fa48("6923") ? false : stryMutAct_9fa48("6922") ? true : (stryCov_9fa48("6922", "6923", "6924"), (stryMutAct_9fa48("6925") ? t.daysOfMonth.includes(todayDay) : (stryCov_9fa48("6925"), t.daysOfMonth?.includes(todayDay))) || (stryMutAct_9fa48("6927") ? t.dayOfMonth !== todayDay : stryMutAct_9fa48("6926") ? false : (stryCov_9fa48("6926", "6927"), t.dayOfMonth === todayDay)));
                        if (stryMutAct_9fa48("6930") ? isCommitmentDay && now.getMonth() !== lastDate.getMonth() : stryMutAct_9fa48("6929") ? false : stryMutAct_9fa48("6928") ? true : (stryCov_9fa48("6928", "6929", "6930"), isCommitmentDay || (stryMutAct_9fa48("6932") ? now.getMonth() === lastDate.getMonth() : stryMutAct_9fa48("6931") ? false : (stryCov_9fa48("6931", "6932"), now.getMonth() !== lastDate.getMonth())))) {
                          if (stryMutAct_9fa48("6933")) {
                            {}
                          } else {
                            stryCov_9fa48("6933");
                            shouldReset = stryMutAct_9fa48("6934") ? false : (stryCov_9fa48("6934"), true);
                          }
                        }
                      }
                    }
                  }
                }
                if (stryMutAct_9fa48("6936") ? false : stryMutAct_9fa48("6935") ? true : (stryCov_9fa48("6935", "6936"), shouldReset)) {
                  if (stryMutAct_9fa48("6937")) {
                    {}
                  } else {
                    stryCov_9fa48("6937");
                    updateDoc(doc(db, stryMutAct_9fa48("6938") ? "" : (stryCov_9fa48("6938"), 'artifacts'), APP_ID, stryMutAct_9fa48("6939") ? "" : (stryCov_9fa48("6939"), 'users'), user.uid, stryMutAct_9fa48("6940") ? "" : (stryCov_9fa48("6940"), 'commitments'), t.id), stryMutAct_9fa48("6941") ? {} : (stryCov_9fa48("6941"), {
                      completed: stryMutAct_9fa48("6942") ? true : (stryCov_9fa48("6942"), false)
                    }));
                  }
                }
              }
            }

            // Logic B: Break Streaks if missed
            // If not completed, and lastCompletedAt was too long ago, reset streak
            if (stryMutAct_9fa48("6945") ? !t.completed && (t.currentStreak || 0) > 0 || t.lastCompletedAt : stryMutAct_9fa48("6944") ? false : stryMutAct_9fa48("6943") ? true : (stryCov_9fa48("6943", "6944", "6945"), (stryMutAct_9fa48("6947") ? !t.completed || (t.currentStreak || 0) > 0 : stryMutAct_9fa48("6946") ? true : (stryCov_9fa48("6946", "6947"), (stryMutAct_9fa48("6948") ? t.completed : (stryCov_9fa48("6948"), !t.completed)) && (stryMutAct_9fa48("6951") ? (t.currentStreak || 0) <= 0 : stryMutAct_9fa48("6950") ? (t.currentStreak || 0) >= 0 : stryMutAct_9fa48("6949") ? true : (stryCov_9fa48("6949", "6950", "6951"), (stryMutAct_9fa48("6954") ? t.currentStreak && 0 : stryMutAct_9fa48("6953") ? false : stryMutAct_9fa48("6952") ? true : (stryCov_9fa48("6952", "6953", "6954"), t.currentStreak || 0)) > 0)))) && t.lastCompletedAt)) {
              if (stryMutAct_9fa48("6955")) {
                {}
              } else {
                stryCov_9fa48("6955");
                const lastDate = new Date(t.lastCompletedAt);
                const diffTime = stryMutAct_9fa48("6956") ? now.getTime() + lastDate.getTime() : (stryCov_9fa48("6956"), now.getTime() - lastDate.getTime());
                const diffDays = stryMutAct_9fa48("6957") ? diffTime * (1000 * 60 * 60 * 24) : (stryCov_9fa48("6957"), diffTime / (stryMutAct_9fa48("6958") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("6958"), (stryMutAct_9fa48("6959") ? 1000 * 60 / 60 : (stryCov_9fa48("6959"), (stryMutAct_9fa48("6960") ? 1000 / 60 : (stryCov_9fa48("6960"), 1000 * 60)) * 60)) * 24)));
                let broken = stryMutAct_9fa48("6961") ? true : (stryCov_9fa48("6961"), false);
                if (stryMutAct_9fa48("6964") ? t.type === 'daily' || diffDays > 1.5 : stryMutAct_9fa48("6963") ? false : stryMutAct_9fa48("6962") ? true : (stryCov_9fa48("6962", "6963", "6964"), (stryMutAct_9fa48("6966") ? t.type !== 'daily' : stryMutAct_9fa48("6965") ? true : (stryCov_9fa48("6965", "6966"), t.type === (stryMutAct_9fa48("6967") ? "" : (stryCov_9fa48("6967"), 'daily')))) && (stryMutAct_9fa48("6970") ? diffDays <= 1.5 : stryMutAct_9fa48("6969") ? diffDays >= 1.5 : stryMutAct_9fa48("6968") ? true : (stryCov_9fa48("6968", "6969", "6970"), diffDays > 1.5)))) broken = stryMutAct_9fa48("6971") ? false : (stryCov_9fa48("6971"), true); // Missed yesterday
                if (stryMutAct_9fa48("6974") ? t.type === 'weekly' || diffDays > 8 : stryMutAct_9fa48("6973") ? false : stryMutAct_9fa48("6972") ? true : (stryCov_9fa48("6972", "6973", "6974"), (stryMutAct_9fa48("6976") ? t.type !== 'weekly' : stryMutAct_9fa48("6975") ? true : (stryCov_9fa48("6975", "6976"), t.type === (stryMutAct_9fa48("6977") ? "" : (stryCov_9fa48("6977"), 'weekly')))) && (stryMutAct_9fa48("6980") ? diffDays <= 8 : stryMutAct_9fa48("6979") ? diffDays >= 8 : stryMutAct_9fa48("6978") ? true : (stryCov_9fa48("6978", "6979", "6980"), diffDays > 8)))) broken = stryMutAct_9fa48("6981") ? false : (stryCov_9fa48("6981"), true);
                if (stryMutAct_9fa48("6984") ? t.type === 'monthly' || diffDays > 32 : stryMutAct_9fa48("6983") ? false : stryMutAct_9fa48("6982") ? true : (stryCov_9fa48("6982", "6983", "6984"), (stryMutAct_9fa48("6986") ? t.type !== 'monthly' : stryMutAct_9fa48("6985") ? true : (stryCov_9fa48("6985", "6986"), t.type === (stryMutAct_9fa48("6987") ? "" : (stryCov_9fa48("6987"), 'monthly')))) && (stryMutAct_9fa48("6990") ? diffDays <= 32 : stryMutAct_9fa48("6989") ? diffDays >= 32 : stryMutAct_9fa48("6988") ? true : (stryCov_9fa48("6988", "6989", "6990"), diffDays > 32)))) broken = stryMutAct_9fa48("6991") ? false : (stryCov_9fa48("6991"), true);
                if (stryMutAct_9fa48("6993") ? false : stryMutAct_9fa48("6992") ? true : (stryCov_9fa48("6992", "6993"), broken)) {
                  if (stryMutAct_9fa48("6994")) {
                    {}
                  } else {
                    stryCov_9fa48("6994");
                    updateDoc(doc(db, stryMutAct_9fa48("6995") ? "" : (stryCov_9fa48("6995"), 'artifacts'), APP_ID, stryMutAct_9fa48("6996") ? "" : (stryCov_9fa48("6996"), 'users'), user.uid, stryMutAct_9fa48("6997") ? "" : (stryCov_9fa48("6997"), 'commitments'), t.id), stryMutAct_9fa48("6998") ? {} : (stryCov_9fa48("6998"), {
                      currentStreak: 0
                    }));
                  }
                }
              }
            }
          }
        });
      }
    }, stryMutAct_9fa48("6999") ? [] : (stryCov_9fa48("6999"), [user, rawTasks]));
    const tasks = useMemo(() => {
      if (stryMutAct_9fa48("7000")) {
        {}
      } else {
        stryCov_9fa48("7000");
        const timeOrder: Record<string, number> = stryMutAct_9fa48("7001") ? {} : (stryCov_9fa48("7001"), {
          'morning': 1,
          'afternoon': 2,
          'evening': 3,
          'any': 4
        });
        return stryMutAct_9fa48("7002") ? [...rawTasks] : (stryCov_9fa48("7002"), (stryMutAct_9fa48("7003") ? [] : (stryCov_9fa48("7003"), [...rawTasks])).sort((a, b) => {
          if (stryMutAct_9fa48("7004")) {
            {}
          } else {
            stryCov_9fa48("7004");
            if (stryMutAct_9fa48("7007") ? a.completed === b.completed : stryMutAct_9fa48("7006") ? false : stryMutAct_9fa48("7005") ? true : (stryCov_9fa48("7005", "7006", "7007"), a.completed !== b.completed)) return a.completed ? 1 : stryMutAct_9fa48("7008") ? +1 : (stryCov_9fa48("7008"), -1);
            if (stryMutAct_9fa48("7011") ? a.type === 'daily' || b.type === 'daily' : stryMutAct_9fa48("7010") ? false : stryMutAct_9fa48("7009") ? true : (stryCov_9fa48("7009", "7010", "7011"), (stryMutAct_9fa48("7013") ? a.type !== 'daily' : stryMutAct_9fa48("7012") ? true : (stryCov_9fa48("7012", "7013"), a.type === (stryMutAct_9fa48("7014") ? "" : (stryCov_9fa48("7014"), 'daily')))) && (stryMutAct_9fa48("7016") ? b.type !== 'daily' : stryMutAct_9fa48("7015") ? true : (stryCov_9fa48("7015", "7016"), b.type === (stryMutAct_9fa48("7017") ? "" : (stryCov_9fa48("7017"), 'daily')))))) {
              if (stryMutAct_9fa48("7018")) {
                {}
              } else {
                stryCov_9fa48("7018");
                return stryMutAct_9fa48("7019") ? (timeOrder[a.timeOfDay || 'any'] || 4) + (timeOrder[b.timeOfDay || 'any'] || 4) : (stryCov_9fa48("7019"), (stryMutAct_9fa48("7022") ? timeOrder[a.timeOfDay || 'any'] && 4 : stryMutAct_9fa48("7021") ? false : stryMutAct_9fa48("7020") ? true : (stryCov_9fa48("7020", "7021", "7022"), timeOrder[stryMutAct_9fa48("7025") ? a.timeOfDay && 'any' : stryMutAct_9fa48("7024") ? false : stryMutAct_9fa48("7023") ? true : (stryCov_9fa48("7023", "7024", "7025"), a.timeOfDay || (stryMutAct_9fa48("7026") ? "" : (stryCov_9fa48("7026"), 'any')))] || 4)) - (stryMutAct_9fa48("7029") ? timeOrder[b.timeOfDay || 'any'] && 4 : stryMutAct_9fa48("7028") ? false : stryMutAct_9fa48("7027") ? true : (stryCov_9fa48("7027", "7028", "7029"), timeOrder[stryMutAct_9fa48("7032") ? b.timeOfDay && 'any' : stryMutAct_9fa48("7031") ? false : stryMutAct_9fa48("7030") ? true : (stryCov_9fa48("7030", "7031", "7032"), b.timeOfDay || (stryMutAct_9fa48("7033") ? "" : (stryCov_9fa48("7033"), 'any')))] || 4)));
              }
            }
            return 0;
          }
        }));
      }
    }, stryMutAct_9fa48("7034") ? [] : (stryCov_9fa48("7034"), [rawTasks]));
    const addTask = async (task: Omit<AnchorTask, 'id' | 'createdAt'>) => {
      if (stryMutAct_9fa48("7035")) {
        {}
      } else {
        stryCov_9fa48("7035");
        if (stryMutAct_9fa48("7038") ? false : stryMutAct_9fa48("7037") ? true : stryMutAct_9fa48("7036") ? user : (stryCov_9fa48("7036", "7037", "7038"), !user)) return;
        await addDoc(collection(db, stryMutAct_9fa48("7039") ? "" : (stryCov_9fa48("7039"), 'artifacts'), APP_ID, stryMutAct_9fa48("7040") ? "" : (stryCov_9fa48("7040"), 'users'), user.uid, stryMutAct_9fa48("7041") ? "" : (stryCov_9fa48("7041"), 'commitments')), stryMutAct_9fa48("7042") ? {} : (stryCov_9fa48("7042"), {
          ...task,
          createdAt: serverTimestamp(),
          currentStreak: 0,
          longestStreak: 0
        }));
        queryClient.invalidateQueries(stryMutAct_9fa48("7043") ? {} : (stryCov_9fa48("7043"), {
          queryKey: TASK_KEYS.list(user.uid)
        }));
      }
    };

    /**
     * Toggle task completion with atomic streak update using Firestore transaction.
     * This prevents race conditions from rapid double-clicks.
     */
    const toggleTask = async (id: string, currentStatus: boolean) => {
      if (stryMutAct_9fa48("7044")) {
        {}
      } else {
        stryCov_9fa48("7044");
        if (stryMutAct_9fa48("7047") ? false : stryMutAct_9fa48("7046") ? true : stryMutAct_9fa48("7045") ? user : (stryCov_9fa48("7045", "7046", "7047"), !user)) return;
        const taskRef = doc(db, stryMutAct_9fa48("7048") ? "" : (stryCov_9fa48("7048"), 'artifacts'), APP_ID, stryMutAct_9fa48("7049") ? "" : (stryCov_9fa48("7049"), 'users'), user.uid, stryMutAct_9fa48("7050") ? "" : (stryCov_9fa48("7050"), 'commitments'), id);
        await runTransaction(db, async transaction => {
          if (stryMutAct_9fa48("7051")) {
            {}
          } else {
            stryCov_9fa48("7051");
            const taskDoc = await transaction.get(taskRef);
            if (stryMutAct_9fa48("7054") ? false : stryMutAct_9fa48("7053") ? true : stryMutAct_9fa48("7052") ? taskDoc.exists() : (stryCov_9fa48("7052", "7053", "7054"), !taskDoc.exists())) return;
            const task = taskDoc.data() as AnchorTask;
            const updates: Partial<AnchorTask> = stryMutAct_9fa48("7055") ? {} : (stryCov_9fa48("7055"), {
              completed: stryMutAct_9fa48("7056") ? currentStatus : (stryCov_9fa48("7056"), !currentStatus)
            });
            if (stryMutAct_9fa48("7059") ? false : stryMutAct_9fa48("7058") ? true : stryMutAct_9fa48("7057") ? currentStatus : (stryCov_9fa48("7057", "7058", "7059"), !currentStatus)) {
              if (stryMutAct_9fa48("7060")) {
                {}
              } else {
                stryCov_9fa48("7060");
                // Completing
                updates.lastCompletedAt = new Date().toISOString();
                const currentStreak = stryMutAct_9fa48("7063") ? task.currentStreak && 0 : stryMutAct_9fa48("7062") ? false : stryMutAct_9fa48("7061") ? true : (stryCov_9fa48("7061", "7062", "7063"), task.currentStreak || 0);
                const newStreak = stryMutAct_9fa48("7064") ? currentStreak - 1 : (stryCov_9fa48("7064"), currentStreak + 1);
                updates.currentStreak = newStreak;
                updates.longestStreak = stryMutAct_9fa48("7065") ? Math.min(newStreak, task.longestStreak || 0) : (stryCov_9fa48("7065"), Math.max(newStreak, stryMutAct_9fa48("7068") ? task.longestStreak && 0 : stryMutAct_9fa48("7067") ? false : stryMutAct_9fa48("7066") ? true : (stryCov_9fa48("7066", "7067", "7068"), task.longestStreak || 0)));
              }
            } else {
              if (stryMutAct_9fa48("7069")) {
                {}
              } else {
                stryCov_9fa48("7069");
                // Uncompleting
                const currentStreak = stryMutAct_9fa48("7072") ? task.currentStreak && 0 : stryMutAct_9fa48("7071") ? false : stryMutAct_9fa48("7070") ? true : (stryCov_9fa48("7070", "7071", "7072"), task.currentStreak || 0);
                if (stryMutAct_9fa48("7076") ? currentStreak <= 0 : stryMutAct_9fa48("7075") ? currentStreak >= 0 : stryMutAct_9fa48("7074") ? false : stryMutAct_9fa48("7073") ? true : (stryCov_9fa48("7073", "7074", "7075", "7076"), currentStreak > 0)) {
                  if (stryMutAct_9fa48("7077")) {
                    {}
                  } else {
                    stryCov_9fa48("7077");
                    updates.currentStreak = stryMutAct_9fa48("7078") ? currentStreak + 1 : (stryCov_9fa48("7078"), currentStreak - 1);
                  }
                }
              }
            }
            transaction.update(taskRef, updates);
          }
        });
        queryClient.invalidateQueries(stryMutAct_9fa48("7079") ? {} : (stryCov_9fa48("7079"), {
          queryKey: TASK_KEYS.list(user.uid)
        }));
      }
    };
    const deleteTask = async (id: string) => {
      if (stryMutAct_9fa48("7080")) {
        {}
      } else {
        stryCov_9fa48("7080");
        if (stryMutAct_9fa48("7083") ? false : stryMutAct_9fa48("7082") ? true : stryMutAct_9fa48("7081") ? user : (stryCov_9fa48("7081", "7082", "7083"), !user)) return;
        await deleteDoc(doc(db, stryMutAct_9fa48("7084") ? "" : (stryCov_9fa48("7084"), 'artifacts'), APP_ID, stryMutAct_9fa48("7085") ? "" : (stryCov_9fa48("7085"), 'users'), user.uid, stryMutAct_9fa48("7086") ? "" : (stryCov_9fa48("7086"), 'commitments'), id));
        queryClient.invalidateQueries(stryMutAct_9fa48("7087") ? {} : (stryCov_9fa48("7087"), {
          queryKey: TASK_KEYS.list(user.uid)
        }));
      }
    };
    const updateTask = async (id: string, updates: Partial<Omit<AnchorTask, 'id' | 'createdAt' | 'type'>>) => {
      if (stryMutAct_9fa48("7088")) {
        {}
      } else {
        stryCov_9fa48("7088");
        if (stryMutAct_9fa48("7091") ? false : stryMutAct_9fa48("7090") ? true : stryMutAct_9fa48("7089") ? user : (stryCov_9fa48("7089", "7090", "7091"), !user)) return;
        await updateDoc(doc(db, stryMutAct_9fa48("7092") ? "" : (stryCov_9fa48("7092"), 'artifacts'), APP_ID, stryMutAct_9fa48("7093") ? "" : (stryCov_9fa48("7093"), 'users'), user.uid, stryMutAct_9fa48("7094") ? "" : (stryCov_9fa48("7094"), 'commitments'), id), updates);
        queryClient.invalidateQueries(stryMutAct_9fa48("7095") ? {} : (stryCov_9fa48("7095"), {
          queryKey: TASK_KEYS.list(user.uid)
        }));
      }
    };
    return stryMutAct_9fa48("7096") ? {} : (stryCov_9fa48("7096"), {
      tasks,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      loadingTasks: isLoading
    });
  }
};