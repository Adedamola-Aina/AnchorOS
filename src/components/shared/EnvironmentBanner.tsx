// @ts-nocheck
import React from 'react';

/**
 * EnvironmentBanner (UX-GL-06)
 *
 * The banner told you "not production" and nothing else: the dev case was
 * handled and the non-dev case fell through to a raw yellow bar. The treatment
 * is now DEFINED per environment instead of implied by "not production":
 *
 *   development → blue,  "DEVELOPMENT ENVIRONMENT"
 *   staging     → amber, "STAGING — TEST DATA" — staging is the one
 *                 non-production environment a real person can be pointed at by
 *                 mistake, so it states what the *data* is, not just where the
 *                 build lives
 *   production  → not rendered at all
 *   anything else (absent or unknown env) → not rendered: an unlabelled bar is
 *                 worse than no bar, so this fails closed rather than guessing
 *
 * The 24px height (plus safe-area inset) is mirrored by MainLayout's
 * non-production top offset, which is why both read the same expression.
 */
const TREATMENTS: Record<string, { className: string; label: string }> = {
  development: { className: 'bg-blue-600 text-white', label: 'DEVELOPMENT ENVIRONMENT' },
  staging: { className: 'bg-amber-400 text-slate-900', label: 'STAGING — TEST DATA' },
};

export const EnvironmentBanner: React.FC = () => {
  const env = import.meta.env.VITE_APP_ENV as string | undefined;
  const treatment = env ? TREATMENTS[env] : undefined;
  if (!treatment) return null;

  return (
    <div
      data-testid="environment-banner"
      data-environment={env}
      className={`fixed top-0 left-0 right-0 ${treatment.className} flex items-center justify-center text-xs font-bold tracking-widest uppercase whitespace-nowrap overflow-hidden z-50`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(24px + env(safe-area-inset-top, 0px))' }}
    >
      {treatment.label}
    </div>
  );
};

