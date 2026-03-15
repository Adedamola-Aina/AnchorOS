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

const MONTH_INDEX: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, september: 9, oct: 10, october: 10,
  nov: 11, november: 11, dec: 12, december: 12,
};
const MONTH_PATTERN = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';

function parseTimePeriod(input: string): string | undefined {
  // Named relative periods (highest priority — most specific first)
  if (/\byesterday\b/.test(input)) return 'yesterday';
  if (/\btoday\b/.test(input)) return 'today';
  if (/\blast\s+week\b/.test(input)) return 'last_week';
  if (/\bthis\s+week\b/.test(input)) return 'this_week';
  if (/\blast\s+month\b/.test(input)) return 'last_month';
  if (/\bthis\s+month\b/.test(input)) return 'this_month';
  if (/\bthis\s+year\b/.test(input)) return 'this_year';
  if (/\blast\s+year\b/.test(input)) return 'last_year';

  // Rolling N months: "last 3 months", "past 3 months", "3 months ago"
  const nMonths = input.match(/\b(?:last|past|(?:in the last)|(?:over the last))\s+(\d+)\s+months?\b|\b(\d+)\s+months?\s+ago\b/i);
  if (nMonths) return `last_${nMonths[1] ?? nMonths[2]}_months`;

  // Rolling N weeks: "last 2 weeks", "past 4 weeks"
  const nWeeks = input.match(/\b(?:last|past|(?:in the last)|(?:over the last))\s+(\d+)\s+weeks?\b|\b(\d+)\s+weeks?\s+ago\b/i);
  if (nWeeks) return `last_${nWeeks[1] ?? nWeeks[2]}_weeks`;

  // Rolling N days: "last 90 days", "past 30 days"
  const nDays = input.match(/\b(?:last|past|(?:in the last)|(?:over the last))\s+(\d+)\s+days?\b|\b(\d+)\s+days?\s+ago\b/i);
  if (nDays) return `last_${nDays[1] ?? nDays[2]}_days`;

  // Specific month + year: "january 2026", "jan 2025"
  const monthYear = new RegExp(`\\b(${MONTH_PATTERN})\\s+(20\\d{2})\\b`, 'i').exec(input);
  if (monthYear) {
    const key = monthYear[1].toLowerCase().slice(0, 3);
    const idx = MONTH_INDEX[key] ?? MONTH_INDEX[monthYear[1].toLowerCase()];
    if (idx) return `month_${monthYear[2]}_${String(idx).padStart(2, '0')}`;
  }

  // "in january" or "last january" (no year — nearest past occurrence)
  const monthOnly = new RegExp(`\\b(?:in|last)\\s+(${MONTH_PATTERN})\\b`, 'i').exec(input);
  if (monthOnly) {
    const key = monthOnly[1].toLowerCase().slice(0, 3);
    const idx = MONTH_INDEX[key] ?? MONTH_INDEX[monthOnly[1].toLowerCase()];
    if (idx) {
      const now = new Date();
      let year = now.getFullYear();
      if (idx > now.getMonth() + 1) year -= 1; // month hasn't occurred yet this year
      return `month_${year}_${String(idx).padStart(2, '0')}`;
    }
  }

  // Specific 4-digit year: "in 2025", "during 2024"
  const yearMatch = input.match(/\b(?:in|during|for)?\s*(20\d{2})\b/);
  if (yearMatch) return `year_${yearMatch[1]}`;

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
    test: (i) =>
      /\b(commitment|commitments|streak|task|tasks|habit|habits|daily|todo)\b/.test(i) &&
      !/\b(spend|spending|money|finance|connection\s+between|correlation)\b/.test(i),
  },
  {
    action: 'query_correlation',
    priority: 65,
    test: (i) => /\b(habits?\s+and\s+(spend|money|finance)|spend\s+.*\s+habits?|connection\s+between|correlation|when\s+i\s+(do|complete|follow)\s+.*\s+(spend|money))\b/.test(i),
  },
  {
    action: 'query_savings_rate',
    priority: 62,
    test: (i) => /\b(savings?\s+rate|how\s+much\s+(am\s+i\s+saving|did\s+i\s+save)|saving\s+percentage|am\s+i\s+saving\s+enough|what\s+percentage\s+(am|did)\s+i\s+save)\b/.test(i),
  },
  {
    action: 'query_momentum',
    priority: 62,
    test: (i) => /\b(momentum|trending|how\s+am\s+i\s+trending|better\s+or\s+worse|improving|getting\s+better|this\s+week\s+vs|compared\s+to\s+last\s+week)\b/.test(i),
  },
  {
    action: 'query_day_of_week',
    priority: 60,
    test: (i) => /\b(which\s+day|what\s+day|best\s+day|worst\s+day|when\s+do\s+i\s+spend\s+most|most\s+expensive\s+day|highest\s+spend\s+day)\b/.test(i),
  },
  // Spending queries — spending keyword or explicit "how much"
  {
    action: 'query_spending',
    priority: 60,
    test: (i) =>
      /\b(how\s+much|spent|spending|expense|expenses|cost|budget|what\s+did\s+i\s+(spend|pay))\b/.test(i),
  },
  // Income queries
  {
    action: 'query_income',
    priority: 60,
    test: (i) => /\b(income|earned|earning|salary|how\s+much\s+(did\s+i\s+)?(earn|make|receive|get\s+paid))\b/.test(i),
  },
  // Account balance queries
  {
    action: 'query_accounts',
    priority: 55,
    test: (i) => /\b(account|accounts|balance|balances|how\s+much\s+(do\s+i\s+have|is\s+in))\b/.test(i),
  },
  // Recurring transaction queries
  {
    action: 'query_recurring',
    priority: 55,
    test: (i) => /\b(recurring|subscriptions?|subscription|automatic|auto.?pay|bills?\s+due|scheduled\s+payment)\b/.test(i),
  },
  // Family spending queries
  {
    action: 'query_family',
    priority: 55,
    test: (i) => /\b(family|shared|household|partner|spouse)\b/.test(i),
  },
  // Net worth queries
  {
    action: 'query_net_worth',
    priority: 55,
    test: (i) => /\b(net\s+worth|total\s+wealth|overall\s+balance|financial\s+position)\b/.test(i),
  },
  // Today's schedule
  {
    action: 'query_today',
    priority: 75,
    test: (i) => /\b(what\s+(do\s+i\s+have|is\s+on|should\s+i\s+do)\s+today|today's?\s+(schedule|plan|tasks?|agenda)|what's?\s+today)\b/.test(i),
  },
  // Upcoming / what's coming
  {
    action: 'query_upcoming',
    priority: 65,
    test: (i) => /\b(what's?\s+coming\s+up|upcoming\s+(bills?|payments?|expenses?)|due\s+soon|next\s+(bill|payment)|what\s+do\s+i\s+owe|remind\s+me)\b/.test(i),
  },
  // Week planning
  {
    action: 'plan_week',
    priority: 78,
    test: (i) => /\b(plan\s+(my\s+)?week|week\s+(ahead|plan|overview|preview)|help\s+me\s+plan|what's?\s+(this|next)\s+week)\b/.test(i),
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
    case 'query_income':
    case 'query_commitments':
    case 'query_savings_rate':
    case 'query_day_of_week':
    case 'query_correlation':
    case 'query_momentum':
    case 'query_accounts':
    case 'query_recurring':
    case 'query_family':
    case 'query_net_worth':
    case 'query_today':
    case 'query_upcoming':
    case 'plan_week': return 0.80;
    default: return 0.20;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function parseIntent(rawInput: string): ParsedIntent {
  const input = rawInput.toLowerCase().trim();
  const action = detectAction(input);
  const confidence = action === 'unknown' ? 0.15 : confidenceFor(action);

  const page = NAV_PAGES.find((candidate) => input.includes(candidate));

  return {
    action,
    confidence,
    entities: {
      amount: parseAmount(input),
      category: parseCategory(input),
      timePeriod: parseTimePeriod(input),
      page,
    },
    rawInput,
  };
}
