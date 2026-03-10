const FINANCIAL_KEYWORDS = [
  'pay',
  'buy',
  'bill',
  'rent',
  'subscription',
  'lease',
  'insurance',
  'tax',
  'purchase',
  'spent',
  'grocery',
  'utilities',
  'electric',
  'water',
  'internet',
  'phone',
  'gas',
  'fuel',
  'medicine',
  'doctor',
];

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Transportation: ['fuel', 'uber', 'lyft', 'transit', 'bus', 'train', 'car gas', 'gas for car', 'petrol', 'gasoline'],
  'Bills & Utilities': ['electric', 'water', 'gas bill', 'internet', 'phone', 'utility', 'bill'],
  Rent: ['rent', 'lease', 'housing', 'mortgage'],
  Insurance: ['insurance', 'premium', 'policy'],
  Groceries: ['grocery', 'groceries', 'food', 'supermarket', 'market'],
  Subscriptions: ['subscription', 'netflix', 'spotify', 'membership', 'premium'],
  Health: ['medicine', 'doctor', 'pharmacy', 'hospital', 'clinic', 'health'],
  Shopping: ['buy', 'purchase', 'shop', 'store'],
};

export function parseAmountFromText(text: string): number | null {
  const patterns = [
    /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/i,
    /(?:NGN|₦)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i,
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:naira|ngn)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return Number.parseFloat(match[1].replace(/,/g, ''));
    }
  }
  return null;
}

export function detectCategory(text: string): string {
  const normalized = text.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }

  return 'General';
}

export function isFinanciallyRelevant(text: string): boolean {
  const normalized = text.toLowerCase();
  return FINANCIAL_KEYWORDS.some((keyword) => normalized.includes(keyword));
}
