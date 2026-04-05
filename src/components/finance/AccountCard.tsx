/**
 * AccountCard — ISO credit card with name+balance at top (Apple Wallet peek).
 * UX-041 Phase 2 §4. Name left, balance right — visible in stacked peek strip.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import type { AnchorAccount } from '../../types';
import { useDeviceShine } from '../../hooks/useDeviceShine';
import { getFinanceViewTransitionName } from '../../features/finance/financeViewTransition';
import { resolveAccountArtworkUrl, revokeAccountArtworkUrl } from '../../services/accountArtworkStorage';
import {
  CARD_ASPECT_RATIO, CARD_BALANCE_FONT_SIZE, CARD_CORNER_RADIUS, CARD_HEADER_FONT_SIZE, CARD_HEADER_LETTER_SPACING,
  CARD_NOISE_TEXTURE,
  TYPE_COLORS, DEFAULT_CARD_COLORS, MESH_GRADIENTS,
  PATTERNS, PATTERN_SIZES, SHADOW_ACTIVE, SHADOW_DEFAULT, hashString, ARTWORK_PRESETS,
} from './cardConstants';

export { CARD_ASPECT_RATIO } from './cardConstants';

export interface AccountCardProps {
  account: AnchorAccount;
  index: number;
  totalCards: number;
  mode: 'stack' | 'expanded';
  isActive: boolean;
  isDragging: boolean;
  dragOffset: number;
  onTap: () => void;
  onDragStart: () => void;
  style?: React.CSSProperties;
}

export const AccountCard: React.FC<AccountCardProps> = React.memo(({
  account, index, mode, isActive, onTap, style,
}) => {
  const isSharedAccount = account.scope === 'family' || Boolean(account.sharedWith && Object.keys(account.sharedWith).length > 0);
  const cardColor = account.cardColor
    ?? TYPE_COLORS[account.type]
    ?? DEFAULT_CARD_COLORS[index % DEFAULT_CARD_COLORS.length];
  const patternIdx = hashString(account.id) % PATTERNS.length;
  const meshBackground = MESH_GRADIENTS[hashString(`${account.id}-${account.type}`) % MESH_GRADIENTS.length];
  const balance = fromCents(account.balanceCents);
  const last4 = account.externalConnection?.maskedAccountNumber?.slice(-4) ?? '';
  const instName = account.externalConnection?.institutionName ?? account.name;
  const [artworkUrl, setArtworkUrl] = useState<string | undefined>(account.cardArtwork || undefined);
  const artworkBg = artworkUrl ? `url(${artworkUrl})` : undefined;
  const presetArtwork = ARTWORK_PRESETS.find((preset) => preset.id === account.cardArtworkPreset)?.css;
  const surfaceMode = artworkBg
    ? 'artwork'
    : account.source === 'linked' || Boolean(account.cardColor && !account.cardArtworkPreset)
      ? 'solid'
      : isSharedAccount
        ? 'glass'
        : 'mesh';
  const showSecondaryName = mode === 'expanded' || isActive;
  const showFooter = mode === 'expanded' || isActive;
  const {
    ref: cardRef,
    handlePointerMove,
    handlePointerLeave,
    requestOrientationPermission,
  } = useDeviceShine<HTMLDivElement>({ enabled: isActive });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); }
  }, [onTap]);

  const handleClick = useCallback(async () => {
    await requestOrientationPermission();
    onTap();
  }, [onTap, requestOrientationPermission]);

  useEffect(() => {
    let isActive = true;
    let resolvedUrl: string | undefined;

    void resolveAccountArtworkUrl({
      cardArtwork: account.cardArtwork,
      cardArtworkPath: account.cardArtworkPath,
    })
      .then((nextUrl) => {
        if (!isActive) {
          revokeAccountArtworkUrl(nextUrl);
          return;
        }
        resolvedUrl = nextUrl;
        setArtworkUrl(nextUrl);
      })
      .catch(() => {
        if (isActive) {
          setArtworkUrl(account.cardArtwork || undefined);
        }
      });

    return () => {
      isActive = false;
      revokeAccountArtworkUrl(resolvedUrl);
    };
  }, [account.cardArtwork, account.cardArtworkPath]);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Open ${instName} account`}
      data-testid={`account-card-${account.id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="account-card relative w-full overflow-hidden select-none cursor-pointer"
      style={{
        aspectRatio: `${CARD_ASPECT_RATIO}`,
        backgroundColor: cardColor, borderRadius: CARD_CORNER_RADIUS,
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: style?.boxShadow ?? (isActive ? SHADOW_ACTIVE : SHADOW_DEFAULT),
        viewTransitionName: getFinanceViewTransitionName(account.id),
        transition: 'box-shadow 240ms ease, transform 240ms ease', ...style,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: surfaceMode === 'mesh' || surfaceMode === 'glass'
            ? meshBackground
            : `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 38%), ${cardColor}`,
          borderRadius: 'inherit',
        }}
      />
      {(surfaceMode === 'solid' || presetArtwork) && !artworkBg && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: presetArtwork ?? PATTERNS[patternIdx],
          backgroundSize: presetArtwork ? 'auto' : PATTERN_SIZES[patternIdx],
          opacity: presetArtwork ? 0.9 : 0.7,
          borderRadius: 'inherit',
        }} />
      )}
      {surfaceMode === 'glass' && (
        <div
          className="absolute inset-[10px] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.22)',
            borderRadius: CARD_CORNER_RADIUS - 10,
          }}
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,rgba(0,0,0,0.08) 100%)',
        borderRadius: 'inherit',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: CARD_NOISE_TEXTURE,
        backgroundSize: '140px 140px',
        borderRadius: 'inherit',
        mixBlendMode: 'soft-light',
        opacity: 0.06,
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        borderRadius: 'inherit',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 0 0 1px rgba(255,255,255,0.12)',
      }} />
      {/* Custom artwork */}
      {artworkBg && (<>
        <div className="absolute inset-0" style={{
          backgroundImage: artworkBg, backgroundSize: 'cover',
          backgroundPosition: 'center', borderRadius: 'inherit',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'rgba(0,0,0,0.35)', borderRadius: 'inherit',
        }} />
      </>)}
      {/* Shine effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at var(--shine-x,50%) var(--shine-y,30%),rgba(255,255,255,0.18) 0%,transparent 60%)',
        borderRadius: 'inherit', zIndex: 1,
      }} />
      {/* Card content */}
      <div className="relative z-[2] flex h-full flex-col justify-between px-6 py-5 sm:px-6 sm:py-5">
        {/* TOP ROW — name + balance (visible in peek strip) */}
        <div className="card-header flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate" style={{ fontFamily: 'SF Pro Display, SF Pro Text, ui-sans-serif, system-ui, sans-serif', fontSize: CARD_HEADER_FONT_SIZE, fontWeight: 600, letterSpacing: CARD_HEADER_LETTER_SPACING, color: '#fff', lineHeight: 1.12 }}>
              {instName}
            </p>
            {showSecondaryName && account.name !== instName && (
              <p className="truncate" style={{ fontFamily: 'SF Pro Text, ui-sans-serif, system-ui, sans-serif', fontSize: 12, fontWeight: 500, letterSpacing: '-0.15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.3 }}>
                {account.name}
              </p>
            )}
          </div>
          <span className="whitespace-nowrap" style={{ fontFamily: 'SF Pro Display, SF Pro Text, ui-sans-serif, system-ui, sans-serif', fontSize: CARD_BALANCE_FONT_SIZE, fontWeight: 500, letterSpacing: CARD_HEADER_LETTER_SPACING, color: '#fff', lineHeight: 1.12 }}>
            {formatCurrency(balance, account.currency)}
          </span>
        </div>
        {/* BOTTOM — chip, type badge, last4 */}
        <div className="flex items-end justify-between gap-2" style={{ opacity: showFooter ? 1 : 0, pointerEvents: showFooter ? 'auto' : 'none' }}>
          <div className="flex items-center gap-3">
            {/* Decorative credit card chip */}
            <div className="rounded-sm" style={{
              width: 36, height: 26,
              background: 'linear-gradient(135deg,#D4AF37 0%,#F5E6A3 40%,#D4AF37 60%,#B8860B 100%)',
              opacity: 0.55,
            }} />
            <span style={{
              fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.70)',
              background: 'rgba(255,255,255,0.15)', padding: '2px 8px',
              borderRadius: 999, textTransform: 'capitalize' as const,
            }}>
              {account.type}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            {last4 && (
              <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', letterSpacing: '0.15em' }}>
                •••• {last4}
              </span>
            )}
            <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
              {account.currency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

AccountCard.displayName = 'AccountCard';
