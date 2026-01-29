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
import { useEffect, useRef } from 'react';
import type { AnchorTask } from '../types';
import { useNotifications } from '../context/NotificationContext';
export const useTaskReminders = (tasks: AnchorTask[]) => {
  if (stryMutAct_9fa48("7830")) {
    {}
  } else {
    stryCov_9fa48("7830");
    const {
      showToast
    } = useNotifications();
    const lastNotifiedRef = useRef<Record<string, string>>({});
    useEffect(() => {
      if (stryMutAct_9fa48("7831")) {
        {}
      } else {
        stryCov_9fa48("7831");
        const checkReminders = () => {
          if (stryMutAct_9fa48("7832")) {
            {}
          } else {
            stryCov_9fa48("7832");
            const now = new Date();
            const currentHours = now.getHours().toString().padStart(2, stryMutAct_9fa48("7833") ? "" : (stryCov_9fa48("7833"), '0'));
            const currentMinutes = now.getMinutes().toString().padStart(2, stryMutAct_9fa48("7834") ? "" : (stryCov_9fa48("7834"), '0'));
            const currentTime = stryMutAct_9fa48("7835") ? `` : (stryCov_9fa48("7835"), `${currentHours}:${currentMinutes}`);
            const todayDate = now.toDateString();
            tasks.forEach(task => {
              if (stryMutAct_9fa48("7836")) {
                {}
              } else {
                stryCov_9fa48("7836");
                if (stryMutAct_9fa48("7839") ? !task.reminderTime && task.completed : stryMutAct_9fa48("7838") ? false : stryMutAct_9fa48("7837") ? true : (stryCov_9fa48("7837", "7838", "7839"), (stryMutAct_9fa48("7840") ? task.reminderTime : (stryCov_9fa48("7840"), !task.reminderTime)) || task.completed)) return;

                // Check if already notified today
                const lastNotified = lastNotifiedRef.current[task.id];
                if (stryMutAct_9fa48("7843") ? lastNotified !== todayDate : stryMutAct_9fa48("7842") ? false : stryMutAct_9fa48("7841") ? true : (stryCov_9fa48("7841", "7842", "7843"), lastNotified === todayDate)) return;

                // Check time match (simple exact match)
                if (stryMutAct_9fa48("7846") ? task.reminderTime !== currentTime : stryMutAct_9fa48("7845") ? false : stryMutAct_9fa48("7844") ? true : (stryCov_9fa48("7844", "7845", "7846"), task.reminderTime === currentTime)) {
                  if (stryMutAct_9fa48("7847")) {
                    {}
                  } else {
                    stryCov_9fa48("7847");
                    showToast(stryMutAct_9fa48("7848") ? `` : (stryCov_9fa48("7848"), `Reminder: Time for "${task.title}"`), stryMutAct_9fa48("7849") ? "" : (stryCov_9fa48("7849"), 'info'));

                    // Browser Notification (if supported/granted)
                    if (stryMutAct_9fa48("7852") ? 'Notification' in window || Notification.permission === 'granted' : stryMutAct_9fa48("7851") ? false : stryMutAct_9fa48("7850") ? true : (stryCov_9fa48("7850", "7851", "7852"), (stryMutAct_9fa48("7853") ? "" : (stryCov_9fa48("7853"), 'Notification')) in window && (stryMutAct_9fa48("7855") ? Notification.permission !== 'granted' : stryMutAct_9fa48("7854") ? true : (stryCov_9fa48("7854", "7855"), Notification.permission === (stryMutAct_9fa48("7856") ? "" : (stryCov_9fa48("7856"), 'granted')))))) {
                      if (stryMutAct_9fa48("7857")) {
                        {}
                      } else {
                        stryCov_9fa48("7857");
                        new Notification(stryMutAct_9fa48("7858") ? `` : (stryCov_9fa48("7858"), `Anchor: ${task.title}`), stryMutAct_9fa48("7859") ? {} : (stryCov_9fa48("7859"), {
                          body: stryMutAct_9fa48("7860") ? `` : (stryCov_9fa48("7860"), `It's time for your commitment: ${task.title}`),
                          icon: stryMutAct_9fa48("7861") ? "" : (stryCov_9fa48("7861"), '/icon-192.png')
                        }));
                      }
                    }

                    // Mark notified
                    lastNotifiedRef.current[task.id] = todayDate;
                  }
                }
              }
            });
          }
        };

        // Request permission on mount
        if (stryMutAct_9fa48("7864") ? 'Notification' in window || Notification.permission === 'default' : stryMutAct_9fa48("7863") ? false : stryMutAct_9fa48("7862") ? true : (stryCov_9fa48("7862", "7863", "7864"), (stryMutAct_9fa48("7865") ? "" : (stryCov_9fa48("7865"), 'Notification')) in window && (stryMutAct_9fa48("7867") ? Notification.permission !== 'default' : stryMutAct_9fa48("7866") ? true : (stryCov_9fa48("7866", "7867"), Notification.permission === (stryMutAct_9fa48("7868") ? "" : (stryCov_9fa48("7868"), 'default')))))) {
          if (stryMutAct_9fa48("7869")) {
            {}
          } else {
            stryCov_9fa48("7869");
            Notification.requestPermission();
          }
        }
        const intervalId = setInterval(checkReminders, 60000); // Check every minute
        checkReminders(); // Initial check

        return stryMutAct_9fa48("7870") ? () => undefined : (stryCov_9fa48("7870"), () => clearInterval(intervalId));
      }
    }, stryMutAct_9fa48("7871") ? [] : (stryCov_9fa48("7871"), [tasks, showToast]));
  }
};