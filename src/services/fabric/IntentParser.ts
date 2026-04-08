import type { FabricMessage, ParsedIntent } from '../../types';
import { confidenceFor, detectAction, NAV_PAGES } from './intentDetection';
import { resolveContextualIntent } from './contextualIntent';
import { parseAmount, parseCategory, parseTimePeriod } from './intentEntityParsers';

export function parseIntent(rawInput: string, context?: FabricMessage[]): ParsedIntent {
  const input = rawInput.toLowerCase().trim();
  const action = detectAction(input);

  // If direct intent is unknown, try resolving from conversation context
  if (action === 'unknown' && context && context.length > 0) {
    const contextual = resolveContextualIntent(rawInput, context);
    if (contextual) return contextual;
  }

  const page = NAV_PAGES.find((candidate) => input.includes(candidate));

  return {
    action,
    confidence: action === 'unknown' ? 0.15 : confidenceFor(action),
    entities: {
      amount: parseAmount(input),
      category: parseCategory(input),
      timePeriod: parseTimePeriod(input),
      page,
    },
    rawInput,
  };
}
