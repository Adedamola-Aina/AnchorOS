import { CATEGORY_KEYWORDS } from './heuristics';

const MONTH_INDEX: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, september: 9, oct: 10, october: 10,
  nov: 11, november: 11, dec: 12, december: 12,
};
const MONTH_PATTERN = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const STOPWORDS = new Set([
  'record', 'add', 'log', 'track', 'spent', 'spend', 'expense', 'expenses',
  'income', 'how', 'much', 'did', 'i', 'this', 'month', 'week',
  'today', 'yesterday', 'go', 'to', 'show', 'my', 'commitments', 'tasks',
  'last', 'the', 'a', 'an', 'for', 'on', 'in', 'at', 'of', 'and', 'or',
  'what', 'where', 'when', 'is', 'was', 'will', 'can', 'please', 'just',
  'naira', 'dollars', 'usd', 'ngn', 'open', 'navigate', 'summarize', 'summary',
]);

export function parseAmount(input: string): number | undefined {
  const patterns = [
    /(?:₦|NGN)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /\$([\d,]+(?:\.\d{1,2})?)/,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:naira|ngn)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:dollars?|usd)/i,
    /(?:^|[\s(])(\d{2,}(?:[,\d]*)?(?:\.\d{1,2})?)(?:$|[\s)])/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (!match?.[1]) continue;
    const num = Number.parseFloat(match[1].replace(/,/g, ''));
    if (!Number.isNaN(num) && num > 0) return num;
  }
  return undefined;
}

export function parseTimePeriod(input: string): string | undefined {
  if (/\byesterday\b/.test(input)) return 'yesterday';
  if (/\btoday\b/.test(input)) return 'today';
  if (/\blast\s+week\b/.test(input)) return 'last_week';
  if (/\bthis\s+week\b/.test(input)) return 'this_week';
  if (/\blast\s+month\b/.test(input)) return 'last_month';
  if (/\bthis\s+month\b/.test(input)) return 'this_month';
  if (/\bthis\s+year\b/.test(input)) return 'this_year';
  if (/\blast\s+year\b/.test(input)) return 'last_year';

  const nMonths = input.match(/\b(?:last|past|(?:in the last)|(?:over the last))\s+(\d+)\s+months?\b|\b(\d+)\s+months?\s+ago\b/i);
  if (nMonths) return `last_${nMonths[1] ?? nMonths[2]}_months`;
  const nWeeks = input.match(/\b(?:last|past|(?:in the last)|(?:over the last))\s+(\d+)\s+weeks?\b|\b(\d+)\s+weeks?\s+ago\b/i);
  if (nWeeks) return `last_${nWeeks[1] ?? nWeeks[2]}_weeks`;
  const nDays = input.match(/\b(?:last|past|(?:in the last)|(?:over the last))\s+(\d+)\s+days?\b|\b(\d+)\s+days?\s+ago\b/i);
  if (nDays) return `last_${nDays[1] ?? nDays[2]}_days`;

  const monthYear = new RegExp(`\\b(${MONTH_PATTERN})\\s+(20\\d{2})\\b`, 'i').exec(input);
  if (monthYear) {
    const key = monthYear[1].toLowerCase().slice(0, 3);
    const idx = MONTH_INDEX[key] ?? MONTH_INDEX[monthYear[1].toLowerCase()];
    if (idx) return `month_${monthYear[2]}_${String(idx).padStart(2, '0')}`;
  }

  const monthOnly = new RegExp(`\\b(?:in|last)\\s+(${MONTH_PATTERN})\\b`, 'i').exec(input);
  if (monthOnly) {
    const key = monthOnly[1].toLowerCase().slice(0, 3);
    const idx = MONTH_INDEX[key] ?? MONTH_INDEX[monthOnly[1].toLowerCase()];
    if (idx) {
      const now = new Date();
      let year = now.getFullYear();
      if (idx > now.getMonth() + 1) year -= 1;
      return `month_${year}_${String(idx).padStart(2, '0')}`;
    }
  }

  const yearMatch = input.match(/\b(?:in|during|for)?\s*(20\d{2})\b/);
  return yearMatch ? `year_${yearMatch[1]}` : undefined;
}

export function parseCategory(input: string): string | undefined {
  const normalized = input.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [string, string[]][]) {
    if (keywords.some((kw) => normalized.includes(kw.toLowerCase()))) return category;
  }
  const words = normalized.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
  return words.find((w) => w.length > 2 && !STOPWORDS.has(w));
}
