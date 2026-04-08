import type { FabricQueryResult, ParsedIntent } from '../../../types';

export function navigateQuery(intent: ParsedIntent): FabricQueryResult {
  const page = intent.entities.page as string;
  return {
    data: null,
    summary: `Opening ${page}.`,
    visualizable: false,
    actions: [{ label: `Go to ${page}`, type: 'navigate', payload: { page } }],
  };
}

export function fallbackQuery(): FabricQueryResult {
  return {
    data: null,
    summary: "That's not something I can help with yet.",
    detail: "Try asking:\n• 'How much did I spend on food this month?'\n• 'What's my savings rate?'\n• 'Which day do I spend the most?'\n• 'I bought fuel for 7000 naira'\n• 'How am I trending this week?'",
    visualizable: false,
    actions: [],
  };
}
