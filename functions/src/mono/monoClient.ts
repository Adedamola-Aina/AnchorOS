/**
 * Mono API Client
 *
 * Server-side client for Mono Open Banking API.
 * Handles auth exchange, balance fetch, and transaction retrieval.
 * Uses Node 20 native fetch — no extra dependencies.
 */

import type {
  MonoAccountAuth,
  MonoAccountDetails,
  MonoTransaction,
  MonoTransactionsResponse,
} from './monoTypes';

const MONO_BASE_URL = 'https://api.withmono.com/v2';

function getSecretKey(): string {
  const key = process.env.MONO_SECRET_KEY;
  if (!key) throw new Error('MONO_SECRET_KEY is not configured');
  return key;
}

async function monoFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${MONO_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'mono-sec-key': getSecretKey(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Mono API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

/** Exchange auth code from Mono Connect widget for an account ID. */
export async function exchangeAuthCode(
  code: string,
): Promise<MonoAccountAuth> {
  return monoFetch<MonoAccountAuth>('/accounts/auth', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

/** Fetch account details (balance, institution, account number). */
export async function getAccountDetails(
  accountId: string,
): Promise<MonoAccountDetails> {
  return monoFetch<MonoAccountDetails>(
    `/accounts/${encodeURIComponent(accountId)}`,
  );
}

/** Fetch transaction history for an account. */
export async function getTransactions(
  accountId: string,
  options: { start?: string; end?: string; paginate?: boolean } = {},
): Promise<MonoTransactionsResponse> {
  const params = new URLSearchParams();
  if (options.start) params.set('start', options.start);
  if (options.end) params.set('end', options.end);
  if (options.paginate) params.set('paginate', 'true');

  const qs = params.toString();
  const path = `/accounts/${encodeURIComponent(accountId)}/transactions${qs ? `?${qs}` : ''}`;
  return monoFetch<MonoTransactionsResponse>(path);
}

/**
 * Bounds for cursor-following: a provider that keeps answering with a `next`
 * cursor must not be able to hold a sync open indefinitely.
 */
export const MAX_TRANSACTION_PAGES = 50;

/** Hard ceiling on pages a caller may request. */
const HARD_PAGE_LIMIT = 500;

/**
 * Re-base a provider-supplied `paging.next` onto our own API host.
 *
 * The value is provider-controlled, so the host is *discarded* rather than
 * followed: our secret key must never be sent to a host we did not choose.
 */
function nextPagePath(next: string): string {
  if (/^https?:\/\//i.test(next)) {
    const url = new URL(next);
    return `${url.pathname}${url.search}`;
  }
  return next.startsWith('/') ? next : `/${next}`;
}

export interface TransactionHistory {
  transactions: MonoTransaction[];
  /** Provider-reported total for the whole result set, when it supplies one. */
  total: number;
  pages: number;
  /** True when we stopped early or received fewer rows than the provider counted. */
  truncated: boolean;
}

/**
 * FI-03: fetch the WHOLE transaction history by following `paging.next`.
 *
 * Previously callers requested a single page and passed `paginate: false`, so any
 * account with more than one page of history silently lost its older transactions
 * — on the initial link and on every webhook refresh alike.
 */
export async function getAllTransactions(
  accountId: string,
  options: { start?: string; end?: string; maxPages?: number } = {},
): Promise<TransactionHistory> {
  const maxPages = Math.min(Math.max(options.maxPages ?? MAX_TRANSACTION_PAGES, 1), HARD_PAGE_LIMIT);

  const first = await getTransactions(accountId, { start: options.start, end: options.end });
  const transactions: MonoTransaction[] = [...first.data];
  const total = typeof first.paging?.total === 'number' ? first.paging.total : transactions.length;

  let next = first.paging?.next ?? null;
  let pages = 1;

  while (next && pages < maxPages) {
    const page = await monoFetch<MonoTransactionsResponse>(nextPagePath(next));
    transactions.push(...page.data);
    pages += 1;
    next = page.paging?.next ?? null;
  }

  // Truncated when the page budget ran out with a cursor still pending, or when
  // the provider counted more rows than we actually received.
  const truncated = Boolean(next) || transactions.length < total;

  return { transactions, total, pages, truncated };
}

/** Manually trigger a data sync on Mono's side. */
export async function triggerSync(accountId: string): Promise<void> {
  await monoFetch(
    `/accounts/${encodeURIComponent(accountId)}/sync`,
    { method: 'POST' },
  );
}

/** Revoke Mono's access to the account. */
export async function unlinkAccount(accountId: string): Promise<void> {
  await monoFetch(
    `/accounts/${encodeURIComponent(accountId)}/unlink`,
    { method: 'POST' },
  );
}
