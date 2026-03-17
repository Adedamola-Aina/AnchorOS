import type { AnchorTask, AnchorTransaction, RecurringTransaction } from '../../../types';

export interface InsightInput {
  feature: 'dashboard' | 'commitments' | 'finance' | 'family';
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  recurring: RecurringTransaction[];
  now: Date;
}
