import type { ParsedIntent } from '../../types';
import { confidenceFor, detectAction, NAV_PAGES } from './intentDetection';
import { parseAmount, parseCategory, parseTimePeriod } from './intentEntityParsers';

export function parseIntent(rawInput: string): ParsedIntent {
  const input = rawInput.toLowerCase().trim();
  const action = detectAction(input);
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
