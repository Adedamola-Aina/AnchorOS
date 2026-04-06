import type { RecurringTransaction } from '../../../types';

export function getUpcomingBills(
  bills: RecurringTransaction[],
  windowDays: number,
): RecurringTransaction[] {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + windowDays);

  return bills
    .filter((b) => {
      if (b.status !== 'active') return false;
      const due = new Date(b.nextRunAt);
      return due >= now && due <= cutoff;
    })
    .sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime());
}
