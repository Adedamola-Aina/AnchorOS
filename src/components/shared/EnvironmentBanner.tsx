
import React from 'react';
import { isDevSurfaceEnabled } from '../../utils/devSurface';

/**
 * EnvironmentBanner (UX-GL-06 · UX-FN-12)
 *
 * The banner told you "not production" and nothing else: the dev case was
 * handled and the non-dev case fell through to a raw yellow bar. The treatment
 * is now DEFINED per environment instead of implied by "not production":
 *
 *   development → blue,  "DEVELOPMENT ENVIRONMENT"
 *   staging     → amber, "● STAGING — TEST DATA" — staging is the one
 *                 non-production environment a real person can be pointed at by
 *                 mistake, so it states what the *data* is, not just where the
 *                 build lives
 *   production  → not rendered at all
 *   anything else (absent or unknown env) → not rendered: an unlabelled bar is
 *                 worse than no bar, so this fails closed rather than guessing
 *
 * UX-FN-12: it used to be a full-bleed 24px slab of saturated colour that
 * dominated every screenshot and pushed the app down. It is now a slim strip
 * (the shared --env-banner-height token) with a leading dot and 10px type: still
 * impossible to mistake for production, no longer the loudest thing on the
 * screen. The wording deliberately keeps the "TEST DATA" half — the strip names
 * what the data is, not just where the build lives. The height token is also
 * what the app shell offsets by, so the strip and the content beneath it can
 * never disagree.
 */
const TREATMENTS: Record<string, { className: string; label: string }> = {
  development: { className: 'bg-blue-600 text-white', label: 'DEVELOPMENT ENVIRONMENT' },
  staging: { className: 'bg-amber-400/90 text-slate-900', label: 'STAGING — TEST DATA' },
};

export const EnvironmentBanner: React.FC = () => {
  // UX-GL-07: one gate for every developer surface (see utils/devSurface).
  if (!isDevSurfaceEnabled()) return null;
  const env = import.meta.env.VITE_APP_ENV as string | undefined;
  const treatment = env ? TREATMENTS[env] : undefined;
  if (!treatment) return null;

  return (
    <div
      data-testid="environment-banner"
      data-environment={env}
      /*
       * z-30: a status strip, below every overlay.
       *
       * It was z-50, the same layer as Modal and the sheets, so on staging it
       * painted over an open sheet's header and clipped titles. A status strip is
       * not an overlay — the layer ladder is:
       *   z-30  status strips (this banner)
       *   z-40  the contextual FAB
       *   z-50  overlays (Modal, ActionSheet, date/time/month sheets, PopoverMenu)
       */
      className={`fixed top-0 left-0 right-0 ${treatment.className} flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase whitespace-nowrap overflow-hidden z-30`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', height: 'calc(var(--env-banner-height, 20px) + env(safe-area-inset-top, 0px))' }}
    >
      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {treatment.label}
    </div>
  );
};

