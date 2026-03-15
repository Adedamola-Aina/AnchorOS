// @ts-nocheck
import { z } from 'zod';

const analyticsEventSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('auth_sign_in_succeeded'),
    payload: z.object({
      method: z.enum(['password', 'mfa']),
    }),
  }),
  z.object({
    name: z.literal('auth_sign_in_failed'),
    payload: z.object({
      method: z.enum(['password', 'mfa']),
      reason: z.string().min(1),
    }),
  }),
  z.object({
    name: z.literal('onboarding_started'),
    payload: z.object({
      source: z.enum(['new_user', 'resume']),
    }),
  }),
  z.object({
    name: z.literal('onboarding_completed'),
    payload: z.object({
      durationMs: z.number().int().nonnegative(),
    }),
  }),
  z.object({
    name: z.literal('finance_transaction_created'),
    payload: z.object({
      accountId: z.string().min(1),
      amountCents: z.number().int(),
      type: z.enum(['income', 'expense', 'transfer']),
    }),
  }),
  z.object({
    name: z.literal('finance_transaction_deleted'),
    payload: z.object({
      transactionId: z.string().min(1),
    }),
  }),
  z.object({
    name: z.literal('family_invite_sent'),
    payload: z.object({
      channel: z.enum(['email', 'link']),
    }),
  }),
  z.object({
    name: z.literal('notification_permission_changed'),
    payload: z.object({
      enabled: z.boolean(),
    }),
  }),
  z.object({
    name: z.literal('fabric_insight_viewed'),
    payload: z.object({
      insightId: z.string().min(1),
      category: z.string().min(1),
      severity: z.enum(['positive', 'neutral', 'attention']),
    }),
  }),
  z.object({
    name: z.literal('fabric_insight_dismissed'),
    payload: z.object({
      insightId: z.string().min(1),
      category: z.string().min(1),
    }),
  }),
  z.object({
    name: z.literal('fabric_prediction_dismissed'),
    payload: z.object({
      predictionId: z.string().min(1),
      predictionType: z.string().min(1),
    }),
  }),
  z.object({
    name: z.literal('fabric_prediction_actioned'),
    payload: z.object({
      predictionId: z.string().min(1),
      predictionType: z.string().min(1),
    }),
  }),
  z.object({
    name: z.literal('fabric_query_submitted'),
    payload: z.object({
      intentAction: z.string().min(1),
      confidence: z.number(),
      hasResult: z.boolean(),
    }),
  }),
  z.object({
    name: z.literal('fabric_nudge_received'),
    payload: z.object({
      nudgeType: z.enum(['streak_risk', 'budget_warning', 'surplus', 'weekly_report']),
    }),
  }),
  z.object({
    name: z.literal('fabric_proactive_question_dismissed'),
    payload: z.object({
      questionType: z.string().min(1),
    }),
  }),
]);

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
export type AnalyticsEventName = AnalyticsEvent['name'];

export function validateAnalyticsEvent(event: unknown): AnalyticsEvent {
  return analyticsEventSchema.parse(event);
}

export const analyticsContract = {
  version: '2026-02-14',
  schema: analyticsEventSchema,
};
