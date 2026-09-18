/**
 * Mono API Types
 *
 * Type definitions for Mono Open Banking API responses.
 * Reference: https://docs.mono.co/reference
 */

export interface MonoAccountAuth {
  id: string;
}

export interface MonoInstitution {
  name: string;
  bankCode: string;
  type: string;
}

export interface MonoAccountData {
  _id: string;
  institution: MonoInstitution;
  name: string;
  accountNumber: string;
  type: string;
  balance: number;
  currency: string;
  bvn: string;
}

export interface MonoAccountDetails {
  account: MonoAccountData;
  meta: {
    data_status: string;
    auth_method: string;
  };
}

export interface MonoTransaction {
  _id: string;
  type: 'debit' | 'credit';
  amount: number;
  narration: string;
  date: string;
  balance: number;
  currency: string;
  category?: string;
}

export interface MonoTransactionsResponse {
  data: MonoTransaction[];
  paging: {
    total: number;
    page: number;
    previous: string | null;
    next: string | null;
  };
}

export interface MonoWebhookEvent {
  event: string;
  /** Mono's documented unique event identifier — used for deduplication. */
  event_id?: string;
  /** ISO timestamp Mono includes with the event. */
  timestamp?: string;
  data: {
    account: { _id: string };
    [key: string]: unknown;
  };
}

export interface BankConnectionDoc {
  provider: 'mono';
  monoAccountId: string;
  anchorAccountId: string;
  userId: string;
  institutionName: string;
  linkedAt: string;
  status: 'active' | 'reconnect_required' | 'revoked';
  lastSyncAt?: string;
  /** Mono `event_id` of the most recently applied webhook — idempotency guard so
   *  a retry after a successful-but-unrecorded completion cannot reapply work. */
  lastProcessedEventId?: string;
}
