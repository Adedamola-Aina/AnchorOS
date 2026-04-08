import type { FabricMessage, ParsedIntent } from '../../types';
import { confidenceFor, detectAction } from './intentDetection';
import { parseAmount, parseTimePeriod } from './intentEntityParsers';
import { extractContextCategory } from './intentEntityParsers';

const FOLLOW_UP_PATTERNS = /\b(what about|and|how about|same for|compare|also|but)\b/;

/**
 * Attempts to resolve a follow-up query using recent conversation context.
 * Returns null if the input is self-contained or context is unavailable.
 */
export function resolveContextualIntent(
  rawInput: string,
  context: FabricMessage[] | undefined,
): ParsedIntent | null {
  if (!context || context.length === 0) return null;

  const input = rawInput.toLowerCase().trim();

  // If the input already has a clear intent, don't override
  const directAction = detectAction(input);
  if (directAction !== 'unknown') return null;

  // Check if this looks like a follow-up
  if (!FOLLOW_UP_PATTERNS.test(input)) return null;

  // Extract the prior user query's action from context
  const lastUserMessage = [...context].reverse().find((m) => m.role === 'user');
  if (!lastUserMessage) return null;

  const priorAction = detectAction(lastUserMessage.content.toLowerCase());
  if (priorAction === 'unknown') return null;

  // Extract entities: prefer current input, fall back to prior context
  const priorInput = lastUserMessage.content.toLowerCase();

  return {
    action: priorAction,
    confidence: confidenceFor(priorAction) * 0.85, // slightly lower for inferred
    entities: {
      amount: parseAmount(input) ?? parseAmount(priorInput),
      category: extractContextCategory(input) ?? extractContextCategory(priorInput),
      timePeriod: parseTimePeriod(input) ?? parseTimePeriod(priorInput),
    },
    rawInput,
  };
}
