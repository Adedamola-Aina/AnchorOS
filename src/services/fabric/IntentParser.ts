import type { IntentAction, ParsedIntent } from '../../types';

const NAV_PAGES = ['dashboard', 'commitments', 'fabric', 'finance', 'settings'] as const;

function parseAmount(input: string): number | undefined {
  const match = input.match(/(\d+(?:\.\d+)?)/);
  if (!match) return undefined;
  return Number.parseFloat(match[1]);
}

function parseTimePeriod(input: string): ParsedIntent['entities']['timePeriod'] | undefined {
  if (input.includes('today')) return 'today';
  if (input.includes('this week')) return 'this_week';
  if (input.includes('last week')) return 'last_week';
  if (input.includes('this month')) return 'this_month';
  if (input.includes('last month')) return 'last_month';
  return undefined;
}

function parseCategory(input: string): string | undefined {
  const cleaned = input.replace(/[^a-z\s]/g, ' ').trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  const stopWords = new Set(['record', 'add', 'expense', 'income', 'spent', 'spend', 'how', 'much', 'did', 'i', 'this', 'month', 'week', 'today', 'go', 'to', 'show', 'my', 'commitments']);
  const candidate = words.find((word) => !stopWords.has(word));
  return candidate;
}

function detectAction(input: string): IntentAction {
  if (/\b(go to|open|navigate)\b/.test(input)) return 'navigate';
  if (/\b(record|add|log)\b/.test(input) && /\bexpense|spent\b/.test(input)) return 'record_expense';
  if (/\b(record|add|log)\b/.test(input) && /\bincome|salary\b/.test(input)) return 'record_income';
  if (/\b(spend|spent|expense|expenses)\b/.test(input)) return 'query_spending';
  if (/\b(commitment|commitments|streak|task|tasks)\b/.test(input)) return 'query_commitments';
  return 'unknown';
}

function confidenceFor(action: IntentAction): number {
  switch (action) {
    case 'navigate':
      return 0.9;
    case 'record_expense':
    case 'record_income':
      return 0.85;
    case 'query_spending':
    case 'query_commitments':
      return 0.8;
    default:
      return 0.2;
  }
}

export function parseIntent(rawInput: string): ParsedIntent {
  const input = rawInput.toLowerCase().trim();
  const action = detectAction(input);

  const page = NAV_PAGES.find((candidate) => input.includes(candidate));

  return {
    action,
    confidence: confidenceFor(action),
    entities: {
      amount: parseAmount(input),
      category: parseCategory(input),
      timePeriod: parseTimePeriod(input),
      page,
    },
    rawInput,
  };
}
