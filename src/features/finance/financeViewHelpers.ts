/** Finance view helper utilities — extracted per ARCH-001 (200-line rule). */

export type ViewMode = 'collapsed' | 'expanded';
export const VIEW_MODE_KEY = 'anchor_finance_view_mode';

export function getStoredViewMode(): ViewMode {
  try { const v = localStorage.getItem(VIEW_MODE_KEY); return v === 'expanded' ? 'expanded' : 'collapsed'; }
  catch { return 'collapsed'; }
}

export function getAccountIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/finance\/account\/([^/]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function isAccountsListPath(pathname: string): boolean {
  return pathname === '/finance/accounts';
}
