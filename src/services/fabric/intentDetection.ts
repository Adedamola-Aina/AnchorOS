import type { IntentAction } from '../../types';

export const NAV_PAGES = ['dashboard', 'commitments', 'fabric', 'finance', 'settings'] as const;

interface IntentRule {
  action: IntentAction;
  priority: number;
  test: (input: string) => boolean;
}

const INTENT_RULES: IntentRule[] = [
  { action: 'navigate', priority: 100, test: (i) => /\b(go to|open|navigate|take me to|show me)\b/.test(i) },
  { action: 'record_expense', priority: 90, test: (i) => /\b(record|add|log|track|paid|just paid|spent|i spent)\b/.test(i) && /\b(expense|buy|bought|food|fuel|bill|transport|groceries|rent|subscription)\b/.test(i) },
  { action: 'record_expense', priority: 85, test: (i) => /\b(record|add|log|track)\b/.test(i) && /₦|\$|naira|dollars?/.test(i) },
  { action: 'record_income', priority: 90, test: (i) => /\b(record|add|log|received|got paid|salary|credited)\b/.test(i) && /\b(income|salary|credit|payment|received)\b/.test(i) },
  { action: 'summarize_week', priority: 80, test: (i) => /\b(week(ly)?\s+(summary|report|review)|how\s+(did|was)\s+my\s+week|this\s+week\s+recap)\b/.test(i) },
  { action: 'query_commitments', priority: 70, test: (i) => /\b(commitment|commitments|streak|task|tasks|habit|habits|daily|todo)\b/.test(i) && !/\b(spend|spending|money|finance|connection\s+between|correlation)\b/.test(i) },
  { action: 'query_correlation', priority: 65, test: (i) => /\b(habits?\s+and\s+(spend|money|finance)|spend\s+.*\s+habits?|connection\s+between|correlation|when\s+i\s+(do|complete|follow)\s+.*\s+(spend|money))\b/.test(i) },
  { action: 'query_savings_rate', priority: 62, test: (i) => /\b(savings?\s+rate|how\s+much\s+(am\s+i\s+saving|did\s+i\s+save)|saving\s+percentage|am\s+i\s+saving\s+enough|what\s+percentage\s+(am|did)\s+i\s+save)\b/.test(i) },
  { action: 'query_momentum', priority: 62, test: (i) => /\b(momentum|trending|how\s+am\s+i\s+trending|better\s+or\s+worse|improving|getting\s+better|this\s+week\s+vs|compared\s+to\s+last\s+week)\b/.test(i) },
  { action: 'query_day_of_week', priority: 60, test: (i) => /\b(which\s+day|what\s+day|best\s+day|worst\s+day|when\s+do\s+i\s+spend\s+most|most\s+expensive\s+day|highest\s+spend\s+day)\b/.test(i) },
  { action: 'query_spending', priority: 60, test: (i) => /\b(how\s+much|spent|spending|expense|expenses|cost|budget|what\s+did\s+i\s+(spend|pay))\b/.test(i) },
  { action: 'query_income', priority: 60, test: (i) => /\b(income|earned|earning|salary|how\s+much\s+(did\s+i\s+)?(earn|make|receive|get\s+paid))\b/.test(i) },
  { action: 'query_accounts', priority: 55, test: (i) => /\b(account|accounts|balance|balances|how\s+much\s+(do\s+i\s+have|is\s+in))\b/.test(i) },
  { action: 'query_recurring', priority: 55, test: (i) => /\b(recurring|subscriptions?|subscription|automatic|auto.?pay|bills?\s+due|scheduled\s+payment)\b/.test(i) },
  { action: 'query_family', priority: 55, test: (i) => /\b(family|shared|household|partner|spouse)\b/.test(i) },
  { action: 'query_net_worth', priority: 55, test: (i) => /\b(net\s+worth|total\s+wealth|overall\s+balance|financial\s+position)\b/.test(i) },
  { action: 'query_today', priority: 75, test: (i) => /\b(what\s+(do\s+i\s+have|is\s+on|should\s+i\s+do)\s+today|today's?\s+(schedule|plan|tasks?|agenda)|what's?\s+today)\b/.test(i) },
  { action: 'query_upcoming', priority: 65, test: (i) => /\b(what's?\s+coming\s+up|upcoming\s+(bills?|payments?|expenses?)|due\s+soon|next\s+(bill|payment)|what\s+do\s+i\s+owe|remind\s+me)\b/.test(i) },
  { action: 'plan_week', priority: 78, test: (i) => /\b(plan\s+(my\s+)?week|week\s+(ahead|plan|overview|preview)|help\s+me\s+plan|what's?\s+(this|next)\s+week)\b/.test(i) },
];

export function detectAction(input: string): IntentAction {
  const sorted = [...INTENT_RULES].sort((a, b) => b.priority - a.priority);
  for (const rule of sorted) {
    if (rule.test(input)) return rule.action;
  }
  return 'unknown';
}

export function confidenceFor(action: IntentAction): number {
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
    case 'plan_week': return 0.8;
    default: return 0.2;
  }
}
