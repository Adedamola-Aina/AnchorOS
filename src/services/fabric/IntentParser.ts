import type { IntentAction, ParsedIntent } from '../../types';
import { CATEGORY_KEYWORDS } from './heuristics';

const NAV_PAGES = ['dashboard', 'commitments', 'fabric', 'finance', 'settings'] as const;

// ── Amount parsing ────────────────────────────────────────────────────────────

/**
 * Extract the most relevant monetary amount from natural language.
 * Handles: $150, 150 dollars, NGN 5000, 5000 naira, ₦5000.
 * Prefers explicit currency patterns over bare numbers.
 */
function parseAmount(input: string): number | undefined {
  const patterns = [
    // Explicit currency markers first (highest priority)
    /(?:₦|NGN)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /\$([\d,]+(?:\.\d{1,2})?)/,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:naira|ngn)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:dollars?|usd)/i,
    // Bare numbers — require 2+ digits to avoid matching unit counts ("5 items")
    /(?:^|[\s(])(\d{2,}(?:[,\d]*)?(?:\.\d{1,2})?)(?:$|[\s)])/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) {
      const num = Number.parseFloat(match[1].replace(/,/g, ''));
      if (!Number.isNaN(num) && num > 0) return num;
    }
  }
  return undefined;
}

// ── Time period parsing ───────────────────────────────────────────────────────

function parseTimePeriod(input: string): ParsedIntent['entities']['timePeriod'] | undefined {
  if (/\byesterday\b/.test(input)) return 'yesterday';
  if (/\btoday\b/.test(input)) return 'today';
  if (/\blast\s+week\b/.test(input)) return 'last_week';
  if (/\bthis\s+week\b|\bthis week\b/.test(input)) return 'this_week';
  if (/\blast\s+month\b/.test(input)) return 'last_month';
  if (/\bthis\s+month\b/.test(input)) return 'this_month';
  return undefined;
}

// ── Category detection ────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'record', 'add', 'log', 'track', 'spent', 'spend', 'expense', 'expenses',
  'income', 'how', 'much', 'did', 'i', 'this', 'month', 'week',
  'today', 'yesterday', 'go', 'to', 'show', 'my', 'commitments', 'tasks',
  'last', 'the', 'a', 'an', 'for', 'on', 'in', 'at', 'of', 'and', 'or',
  'what', 'where', 'when', 'is', 'was', 'will', 'can', 'please', 'just',
  'naira', 'dollars', 'usd', 'ngn', 'open', 'navigate', 'summarize', 'summary',
]);

/**
 * Extract the most likely spending category from the input.
 * Checks against known category keywords first; falls back to first non-stopword.
 */
function parseCategory(input: string): string | undefined {
  const normalized = input.toLowerCase();

  // Check known categories from heuristics
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [string, string[]][]) {
    if (keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      return category;
    }
  }

  // Fallback: first meaningful word not in stoplist
  const words = normalized.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
  return words.find((w) => w.length > 2 && !STOPWORDS.has(w));
}

// ── Intent detection ──────────────────────────────────────────────────────────

interface IntentRule {
  action: IntentAction;
  priority: number;
  test: (input: string) => boolean;
}

const INTENT_RULES: IntentRule[] = [
  // Navigation — very high priority
  {
    action: 'navigate',
    priority: 100,
    test: (i) => /\b(go to|open|navigate|take me to|show me)\b/.test(i),
  },
  // Transaction recording — explicit log/record verb required
  {
    action: 'record_expense',
    priority: 90,
    test: (i) =>
      /\b(record|add|log|track|paid|just paid|spent|i spent)\b/.test(i) &&
      /\b(expense|buy|bought|food|fuel|bill|transport|groceries|rent|subscription)\b/.test(i),
  },
  {
    action: 'record_expense',
    priority: 85,
    test: (i) =>
      /\b(record|add|log|track)\b/.test(i) &&
      /₦|\$|naira|dollars?/.test(i),
  },
  {
    action: 'record_income',
    priority: 90,
    test: (i) =>
      /\b(record|add|log|received|got paid|salary|credited)\b/.test(i) &&
      /\b(income|salary|credit|payment|received)\b/.test(i),
  },
  // Week summary
  {
    action: 'summarize_week',
    priority: 80,
    test: (i) => /\b(week(ly)?\s+(summary|report|review)|how\s+(did|was)\s+my\s+week|this\s+week\s+recap)\b/.test(i),
  },
  // Commitment queries
  {
    action: 'query_commitments',
    priority: 70,
    test: (i) => /\b(commitment|commitments|streak|task|tasks|habit|habits|daily|todo)\b/.test(i),
  },
  // Spending queries — spending keyword or explicit "how much"
  {
    action: 'query_spending',
    priority: 60,
    test: (i) =>
      /\b(how\s+much|spent|spending|expense|expenses|cost|budget|what\s+did\s+i\s+(spend|pay))\b/.test(i),
  },
];

function detectAction(input: string): IntentAction {
  const sorted = [...INTENT_RULES].sort((a, b) => b.priority - a.priority);
  for (const rule of sorted) {
    if (rule.test(input)) return rule.action;
  }
  return 'unknown';
}

function confidenceFor(action: IntentAction): number {
  switch (action) {
    case 'navigate': return 0.92;
    case 'record_expense':
    case 'record_income': return 0.88;
    case 'summarize_week': return 0.85;
    case 'query_spending':
    case 'query_commitments': return 0.80;
    default: return 0.20;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

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
