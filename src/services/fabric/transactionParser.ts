import { parseAmount, parseTimePeriod, parseCategory } from './intentEntityParsers';

interface ParsedTransaction {
  amount?: number;
  category?: string;
  title?: string;
  date?: string;
}

const STOPWORDS = new Set([
  'record', 'add', 'log', 'track', 'spent', 'spend', 'expense', 'paid',
  'bought', 'for', 'on', 'the', 'a', 'an', 'to', 'my', 'i', 'just',
  'naira', 'dollars', 'usd', 'ngn', 'yesterday', 'today',
]);

function timePeriodToDate(period: string): string | undefined {
  const now = new Date();
  if (period === 'today') return now.toISOString().split('T')[0];
  if (period === 'yesterday') {
    now.setDate(now.getDate() - 1);
    return now.toISOString().split('T')[0];
  }
  return undefined;
}

function extractTitle(input: string): string | undefined {
  const words = input
    .toLowerCase()
    .replace(/[₦$,]/g, '')
    .replace(/\d+(\.\d{1,2})?/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  if (words.length === 0) return undefined;
  const title = words.slice(0, 5).join(' ');
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function parseTransaction(input: string): ParsedTransaction {
  if (!input.trim()) {
    return {};
  }

  const amount = parseAmount(input);
  const category = parseCategory(input);
  const period = parseTimePeriod(input);
  const date = period ? timePeriodToDate(period) : undefined;
  const title = extractTitle(input);

  return {
    amount,
    category: category && isKnownCategory(category) ? category : undefined,
    title,
    date,
  };
}

const KNOWN_CATEGORIES = new Set([
  'Transportation', 'Bills & Utilities', 'Rent', 'Insurance',
  'Groceries', 'Subscriptions', 'Health', 'Shopping',
]);

function isKnownCategory(cat: string): boolean {
  return KNOWN_CATEGORIES.has(cat);
}
