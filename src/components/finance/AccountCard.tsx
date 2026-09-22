/**
 * AccountCard — Clean finance panel (Apple Wallet style).
 * UX-041 Phase 2 §4. Name left, balance right. Minimal decoration.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import type { AnchorAccount } from '../../types';
import { getFinanceViewTransitionName } from '../../features/finance/financeViewTransition';
import { accountArtworkPresetId, artworkPresetCss } from './cardArtwork';
import { resolveAccountArtworkUrl, revokeAccountArtworkUrl } from '../../services/accountArtworkStorage';
import { accountTypeLabel } from '../../utils/accountTypes';
import {
  CARD_ASPECT_RATIO, CARD_BALANCE_FONT_SIZE, CARD_CORNER_RADIUS,
  CARD_HEADER_FONT_SIZE, CARD_HEADER_LETTER_SPACING, CARD_HEADER_REVEAL,
  TYPE_COLORS, DEFAULT_CARD_COLORS, SHADOW_ACTIVE, SHADOW_DEFAULT,
} from './cardConstants';

export { CARD_ASPECT_RATIO } from './cardConstants';

interface AccountCardProps {
  account: AnchorAccount;
  index: number;
  totalCards: number;
  mode: 'stack' | 'expanded';
  isActive: boolean;
  onTap: () => void;
  style?: React.CSSProperties;
  /** Skip view-transition-name when a parent already owns the same name */
  skipViewTransition?: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = React.memo(({
  account, index, mode, isActive, onTap, style, skipViewTransition,
}) => {
  const cardColor = account.cardColor
    ?? TYPE_COLORS[account.type]
    ?? DEFAULT_CARD_COLORS[index % DEFAULT_CARD_COLORS.length];
  const balance = fromCents(account.balanceCents);
  const last4 = account.externalConnection?.maskedAccountNumber?.slice(-4) ?? '';
  const institution = account.externalConnection?.institutionName;
  const instName = institution ?? account.name;
  const [artworkUrl, setArtworkUrl] = useState<string | undefined>(account.cardArtwork || undefined);
  /**
   * UX-FN-04: the pattern the account is wearing. Until now the picker wrote
   * `cardArtworkPreset` and nothing read it, so choosing artwork changed the account
   * document and nothing on screen.
   */
  const presetCss = artworkPresetCss(accountArtworkPresetId(account));
  const showSecondaryName = (mode === 'expanded' || isActive) && account.name !== instName;
  const showFooter = mode === 'expanded' || isActive;
  /**
   * UX-FN-04: identity must not rest on colour alone, and two accounts may share
   * a name. The footer line therefore carries the *meaningful* identity the
   * domain model actually has — account type (from the real `type` field, never
   * invented), currency, and the masked account number when the account is
   * linked — so "Investment Portfolio" × 2 is distinguishable without relying on
   * the card's colour.
   */
  const identity = [
    accountTypeLabel(account.type),
    account.currency,
    last4 ? `•••• ${last4}` : null,
  ].filter(Boolean).join(' · ');

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); }
  }, [onTap]);

  /**
   * UX-FN-07: in a collapsed stack only the visible peek strip is reachable.
   * A non-front card used to expose its ENTIRE box as the hit area, but that box
   * is painted underneath the front card — so a real pointer click landed on the
   * front card and was swallowed (elementFromPoint intercepted; taps timed out).
   * Fix: for non-front stacked cards the body ignores pointer events and a
   * genuinely tappable strip (CARD_HEADER_REVEAL tall, ≥44px) sits on top.
   */
  const isStackedNonActive = mode === 'stack' && !isActive;

  useEffect(() => {
    let active = true;
    let resolvedUrl: string | undefined;
    void resolveAccountArtworkUrl({
      cardArtwork: account.cardArtwork,
      cardArtworkPath: account.cardArtworkPath,
    }).then((nextUrl) => {
      if (!active) { revokeAccountArtworkUrl(nextUrl); return; }
      resolvedUrl = nextUrl;
      setArtworkUrl(nextUrl);
    }).catch(() => {
      if (active) setArtworkUrl(account.cardArtwork || undefined);
    });
    return () => { active = false; revokeAccountArtworkUrl(resolvedUrl); };
  }, [account.cardArtwork, account.cardArtworkPath]);

  return (
    <div
      role={isStackedNonActive ? 'presentation' : 'button'}
      tabIndex={isStackedNonActive ? -1 : 0}
      aria-label={isStackedNonActive ? undefined : `Open ${instName} account`}
      data-testid={isStackedNonActive ? undefined : `account-card-${account.id}`}
      onClick={isStackedNonActive ? undefined : onTap}
      onKeyDown={isStackedNonActive ? undefined : handleKeyDown}
      className="account-card relative w-full overflow-hidden select-none cursor-pointer"
      style={{
        aspectRatio: `${CARD_ASPECT_RATIO}`,
        backgroundColor: cardColor,
        borderRadius: CARD_CORNER_RADIUS,
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: style?.boxShadow ?? (isActive ? SHADOW_ACTIVE : SHADOW_DEFAULT),
        viewTransitionName: skipViewTransition ? undefined : getFinanceViewTransitionName(account.id),
        transition: 'box-shadow 240ms ease',
        ...style,
        // Must win over any caller style: a non-front card body is not a hit target.
        pointerEvents: isStackedNonActive ? 'none' : undefined,
      }}
    >
      {/* UX-FN-07: the only pointer target for a non-front stacked card. */}
      {isStackedNonActive && (
        <button
          type="button"
          data-testid={`account-card-${account.id}`}
          data-account-card-strip="true"
          aria-label={`Open ${instName} account`}
          onClick={onTap}
          className="absolute inset-x-0 top-0 z-[3] cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          style={{ height: CARD_HEADER_REVEAL, pointerEvents: 'auto', borderRadius: `${CARD_CORNER_RADIUS}px ${CARD_CORNER_RADIUS}px 0 0` }}
        />
      )}

      {/* Subtle top highlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%)',
        borderRadius: 'inherit',
      }} />
      {/* Custom artwork: an uploaded image, or a preset pattern (UX-FN-04). */}
      {artworkUrl && (<>
        <div className="absolute inset-0" style={{
          backgroundImage: `url(${artworkUrl})`, backgroundSize: 'cover',
          backgroundPosition: 'center', borderRadius: 'inherit',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'rgba(0,0,0,0.35)', borderRadius: 'inherit',
        }} />
      </>)}
      {presetCss && (
        /*
         * A pattern is CSS, not a URL — painting it through `url()` was the reason
         * chosen artwork never appeared. It needs no darkening overlay: the patterns
         * are low-alpha white over the card's own colour, which is also what the
         * picker's preview shows, so what the user chose is what they get.
         */
        <div className="absolute inset-0 pointer-events-none" data-testid={`account-artwork-${account.id}`} style={{ background: presetCss, borderRadius: 'inherit' }} />
      )}
      {/* Content — header at top fits within peek strip */}
      <div className="relative z-[2] flex h-full flex-col justify-between px-5 py-4">
        <div className="card-header flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate" style={{
              fontFamily: '-apple-system, SF Pro Display, system-ui, sans-serif',
              fontSize: CARD_HEADER_FONT_SIZE, fontWeight: 600,
              letterSpacing: CARD_HEADER_LETTER_SPACING,
              color: '#fff', lineHeight: 1.2,
            }}>
              {instName}
            </p>
            {showSecondaryName && (
              <p className="truncate mt-0.5" style={{
                fontSize: 12, fontWeight: 500,
                color: 'rgba(255,255,255,0.65)', lineHeight: 1.3,
              }}>
                {account.name}
              </p>
            )}
          </div>
          <span className="whitespace-nowrap" style={{
            fontFamily: '-apple-system, SF Pro Display, system-ui, sans-serif',
            fontSize: CARD_BALANCE_FONT_SIZE, fontWeight: 500,
            letterSpacing: CARD_HEADER_LETTER_SPACING,
            color: '#fff', lineHeight: 1.2,
          }}>
            {formatCurrency(balance, account.currency)}
          </span>
        </div>
        {showFooter && (
          <div className="flex items-end justify-between gap-2">
            <span
              data-testid={`account-card-identity-${account.id}`}
              className="truncate"
              style={{
                fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.62)',
                letterSpacing: '0.01em',
              }}
            >
              {identity}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

AccountCard.displayName = 'AccountCard';
