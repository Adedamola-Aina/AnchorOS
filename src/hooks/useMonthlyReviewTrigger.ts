import { useEffect, useState } from 'react';
import { loadMonthlyReflection } from '../services/fabric/fabricPersistence';

/**
 * Returns whether the monthly review prompt should be shown.
 * Eligible: days 1–5 of the month, and user has not already saved a reflection for last month.
 */
export function useMonthlyReviewTrigger(userId: string | undefined): {
  shouldShow: boolean;
  reviewMonth: string;
} {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const reviewMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

  const eligible = Boolean(userId) && dayOfMonth <= 5;
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!eligible || !userId) return;
    let cancelled = false;
    loadMonthlyReflection(userId, reviewMonth).then((existing) => {
      if (!cancelled) setConfirmed(!existing);
    }).catch(() => { /* no-op: keep confirmed false */ });
    return () => { cancelled = true; };
  }, [eligible, userId, reviewMonth]);

  return { shouldShow: eligible && confirmed, reviewMonth };
}
