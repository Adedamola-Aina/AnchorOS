/**
 * AccountCard — ISO credit card with name+balance at top (Apple Wallet peek).
 * UX-041 Phase 2 §4. Name left, balance right — visible in stacked peek strip.
 */
import React, { useRef, useCallback } from 'react';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import type { AnchorAccount } from '../../types';
import {
  CARD_ASPECT_RATIO, TYPE_COLORS, DEFAULT_CARD_COLORS,
  PATTERNS, PATTERN_SIZES, SHADOW_ACTIVE, SHADOW_DEFAULT, hashString,
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
  account, index, isActive, onTap, style,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardColor = account.cardColor
    ?? TYPE_COLORS[account.type]
    ?? DEFAULT_CARD_COLORS[index % DEFAULT_CARD_COLORS.length];
  const patternIdx = hashString(account.id) % PATTERNS.length;
  const balance = fromCents(account.balanceCents);
  const last4 = account.externalConnection?.maskedAccountNumber?.slice(-4) ?? '';
  const instName = account.externalConnection?.institutionName ?? account.name;
  const artworkBg = account.cardArtwork ? `url(${account.cardArtwork})` : undefined;

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isActive || !cardRef.current) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--shine-x', `${x}%`);
    cardRef.current.style.setProperty('--shine-y', `${y}%`);
  }, [isActive]);

  const handlePointerLeave = useCallback(() => {
    cardRef.current?.style.setProperty('--shine-x', '50%');
    cardRef.current?.style.setProperty('--shine-y', '30%');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); }
  }, [onTap]);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-label={`Open ${instName} account`}
      data-testid={`account-card-${account.id}`}
      onClick={onTap}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="account-card relative w-full overflow-hidden select-none cursor-pointer"
      style={{
        aspectRatio: `${CARD_ASPECT_RATIO}`,
        backgroundColor: cardColor, borderRadius: 16,
        boxShadow: isActive ? SHADOW_ACTIVE : SHADOW_DEFAULT,
        transition: 'box-shadow 200ms ease', ...style,
      }}
    >
      {/* Pattern overlay */}
      {!artworkBg && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: PATTERNS[patternIdx],
          backgroundSize: PATTERN_SIZES[patternIdx], borderRadius: 'inherit',
        }} />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,rgba(0,0,0,0.08) 100%)',
        borderRadius: 'inherit',
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
      <div className="relative z-[2] flex flex-col justify-between h-full p-4 sm:p-5">
        {/* TOP ROW — name + balance (visible in peek strip) */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate" style={{ fontSize: 16, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
              {instName}
            </p>
            {account.name !== instName && (
              <p className="truncate" style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.7)', lineHeight: 1.3 }}>
                {account.name}
              </p>
            )}
          </div>
          <span className="whitespace-nowrap" style={{ fontSize: 16, fontWeight: 600, color: '#fff' }}>
            {formatCurrency(balance, account.currency)}
          </span>
        </div>
        {/* BOTTOM — chip, type badge, last4 */}
        <div className="flex items-end justify-between gap-2">
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
