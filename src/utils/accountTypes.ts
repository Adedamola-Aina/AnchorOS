/**
 * Account type vocabulary (UX-FN-04).
 *
 * `AnchorAccount.type` is the only source of truth for an account's type:
 *   'checking' | 'savings' | 'salary' | 'investment'
 *
 * This module exists because the UI used to print the raw stored value
 * (`checking`) in some places and a generic label in others, which made every
 * account read as the same thing. Presentation must never invent a type the
 * domain model cannot represent — there is no 'credit', 'cash' or 'wallet' in
 * `financeTypes.ts`, so none is offered here. If those types are added to the
 * model, add them to this map in the same change.
 */
import type { AnchorAccount } from '../types';

const ACCOUNT_TYPE_LABELS: Record<AnchorAccount['type'], string> = {
  checking: 'Checking',
  savings: 'Savings',
  salary: 'Salary',
  investment: 'Investment',
};

/** Human label for a stored account type. Unknown values fall back to the raw value. */
export const accountTypeLabel = (type: AnchorAccount['type'] | string | undefined): string => {
  if (!type) return 'Account';
  return ACCOUNT_TYPE_LABELS[type as AnchorAccount['type']] ?? type;
};
