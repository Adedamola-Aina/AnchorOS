import type { AnchorGoal, AnchorTask, AnchorTransaction, UserPattern } from '../../types';

export interface PredictionInput {
  patterns: UserPattern[];
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  goals?: AnchorGoal[];
  now: Date;
}
