// @ts-nocheck
import { useAuth } from '../../../context/AuthContext';
import { useRecurringTransactions } from '../../../hooks/useRecurringQueries';
import { UpcomingBillsPanel } from './UpcomingBillsPanel';

/**
 * Self-contained bills section that fetches its own data.
 * Renders nothing when no bills are upcoming.
 */
export const FinanceBillsSection: React.FC = () => {
  const { user } = useAuth();
  const { data: bills } = useRecurringTransactions(user?.uid);

  if (!bills || bills.length === 0) return null;

  return <UpcomingBillsPanel bills={bills} />;
};
