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
