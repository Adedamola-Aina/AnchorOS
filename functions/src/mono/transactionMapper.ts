/**
 * Mono Transaction Mapper
 *
 * Maps Mono bank transactions to AnchorTransaction format.
 * Includes auto-categorization based on narration keywords.
 */

import type { MonoTransaction } from './monoTypes';

export interface MappedTransaction {
  title: string;
  amountCents: number;
  type: 'income' | 'expense';
  category: string;
  accountId: string;
  currency: 'NGN' | 'USD';
  scope: 'personal';
  date: string;
  source: 'synced';
  externalTransactionId: string;
  narration: string;
}

const CATEGORY_RULES: ReadonlyArray<[RegExp, string]> = [
  [/shoprite|spar|justrite|market|chicken republic|kilimanjaro|bukka|food/i, 'Food'],
  [/interest|dividend|roi|stock|fund|piggyvest|cowrywise|risevest/i, 'Investments'],
  [/uber|bolt|taxify|danfo|brt|cowry(?!wise)|fuel|petrol/i, 'Transport'],
  [/mtn|glo|airtel|9mobile|dstv|gotv|ikedc|ekedc|nepa|phcn|lawma|waste/i, 'Utilities'],
  [/netflix|spotify|showmax|cinema|bet9ja|sporty|game/i, 'Entertainment'],
  [/pharmacy|hospital|clinic|medic|health|lab/i, 'Health'],
  [/school|tuition|course|udemy|coursera|exam/i, 'Education'],
  [/salary|pay\s?roll|wage|stipend|allowance/i, 'Salary'],
  [/rent|landlord|caution|agency/i, 'Housing'],
  [/amazon|jumia|konga|aliexpress|shein/i, 'Shopping'],
  [/gym|spa|barb|salon|haircut|cream|perfume/i, 'Personal Care'],
  [/flight|hotel|airbnb|booking|travel/i, 'Travel'],
];

/** Clean up raw bank narration into a human-readable title. */
export function cleanNarration(narration: string): string {
  return (
    narration
      .replace(/\b(NIP|FT|TRF|WEB|POS|ATM|MC|VISA)\b/gi, '')
      .replace(/\d{10,}/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim() || 'Bank Transaction'
  );
}

/** Auto-categorize based on narration keywords. */
export function autoCategorize(narration: string): string {
  const lower = narration.toLowerCase();
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(lower)) return category;
  }
  return 'General';
}

/** Map a single Mono transaction to Anchor format. */
export function mapMonoTransaction(
  monoTx: MonoTransaction,
  accountId: string,
  currency: 'NGN' | 'USD',
): MappedTransaction {
  return {
    title: cleanNarration(monoTx.narration),
    amountCents: Math.round(Math.abs(monoTx.amount) * 100),
    type: monoTx.type === 'credit' ? 'income' : 'expense',
    category: autoCategorize(monoTx.narration),
    accountId,
    currency,
    scope: 'personal',
    date: monoTx.date,
    source: 'synced',
    externalTransactionId: monoTx._id,
    narration: monoTx.narration,
  };
}

/** Map a batch, deduplicating against known external IDs. */
export function mapAndDeduplicate(
  monoTransactions: MonoTransaction[],
  accountId: string,
  currency: 'NGN' | 'USD',
  existingExternalIds: Set<string>,
): MappedTransaction[] {
  return monoTransactions
    .filter((tx) => !existingExternalIds.has(tx._id))
    .map((tx) => mapMonoTransaction(tx, accountId, currency));
}
