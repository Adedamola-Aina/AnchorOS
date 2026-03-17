import type { AnchorTask, AnchorTransaction, UserPattern } from '../../types';

export interface PredictionInput {
  patterns: UserPattern[];
  transactions: AnchorTransaction[];
  commitments: AnchorTask[];
  now: Date;
}
