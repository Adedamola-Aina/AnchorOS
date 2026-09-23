import { useCallback, useEffect } from 'react';
import type { AnchorTask } from '../types';
import { getTodayTasks } from '../services/fabric/DailyBriefingEngine';
import { clearAppBadge, setAppBadgeCount } from '../utils/appBadge';
import { captureError } from '../utils/error';

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

  // Refresh the badge whenever the installed app regains focus.
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void syncBadge();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [syncBadge]);
}

export { getPendingCountForToday };
