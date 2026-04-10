import { useCallback, useEffect } from 'react';
import { App } from '@capacitor/app';
import type { AnchorTask } from '../types';
import { getTodayTasks } from '../services/fabric/DailyBriefingEngine';
import { clearAppBadge, setAppBadgeCount } from '../utils/appBadge';
import { captureError } from '../utils/error';
import { isPluginAvailable } from '../utils/platform';

function getPendingCountForToday(tasks: AnchorTask[], now: Date): number {
  return getTodayTasks(tasks, now).filter((task) => !task.completed).length;
}

interface UseCommitmentBadgeOptions {
  userId?: string;
  tasks: AnchorTask[];
}

export function useCommitmentBadge({ userId, tasks }: UseCommitmentBadgeOptions): void {
  const syncBadge = useCallback(async () => {
    try {
      if (!userId) {
        await clearAppBadge();
        return;
      }

      const pendingCount = getPendingCountForToday(tasks, new Date());
      await setAppBadgeCount(pendingCount);
    } catch (error) {
      captureError(error, 'Badge.syncCommitments');
    }
  }, [tasks, userId]);

  useEffect(() => {
    void syncBadge();
  }, [syncBadge]);

  useEffect(() => {
    if (!isPluginAvailable('App')) return;

    let removeListener: (() => void) | null = null;

    void App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        void syncBadge();
      }
    }).then((listener) => {
      removeListener = () => {
        void listener.remove();
      };
    }).catch((error) => {
      captureError(error, 'Badge.appStateListener');
    });

    return () => {
      if (removeListener) {
        removeListener();
      }
    };
  }, [syncBadge]);
}

export { getPendingCountForToday };
