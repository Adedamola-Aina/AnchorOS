/**
 * AccountCard — ISO credit card ratio card with patterns, shadows, shine.
 * UX-041 Phase 2. See finance redesign spec §4.
 */
import React, { useRef, useCallback } from 'react';
import { formatCurrency } from '../../utils/format';
import { fromCents } from '../../utils/moneyUtils';
import type { AnchorAccount } from '../../types';
import {
  CARD_ASPECT_RATIO, DEFAULT_CARD_COLORS, PATTERNS, PATTERN_SIZES,
  SHADOW_ACTIVE, SHADOW_DEFAULT, hashString,
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
  const cardColor = account.cardColor ?? DEFAULT_CARD_COLORS[index % DEFAULT_CARD_COLORS.length];
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
        backgroundColor: cardColor, borderRadius: 12,
        boxShadow: isActive ? SHADOW_ACTIVE : SHADOW_DEFAULT,
        transition: 'box-shadow 200ms ease', ...style,
      }}
    >
      {!artworkBg && (
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: PATTERNS[patternIdx],
          backgroundSize: PATTERN_SIZES[patternIdx], borderRadius: 'inherit',
        }} />
      )}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,rgba(0,0,0,0.08) 100%)',
        borderRadius: 'inherit',
      }} />
      {artworkBg && (<>
        <div className="absolute inset-0" style={{
          backgroundImage: artworkBg, backgroundSize: 'cover',
          backgroundPosition: 'center', borderRadius: 'inherit',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'rgba(0,0,0,0.35)', borderRadius: 'inherit',
        }} />
      </>)}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at var(--shine-x,50%) var(--shine-y,30%),rgba(255,255,255,0.18) 0%,transparent 60%)',
        borderRadius: 'inherit', zIndex: 1,
      }} />
      <div className="relative z-[2] flex flex-col justify-between h-full p-4 sm:p-5">
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,1.0)' }}>{instName}</p>
          {account.name !== instName && (
            <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.75)' }}>{account.name}</p>
          )}
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <div className="min-w-0">
              <span style={{ fontSize: 'clamp(22px,6vw,28px)', fontWeight: 600, color: 'rgba(255,255,255,1.0)' }}>
                {formatCurrency(balance, account.currency)}
              </span>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginLeft: 6 }}>
                {account.currency}
              </span>
            </div>
            {last4 && (
              <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.60)', fontFamily: 'monospace', letterSpacing: '0.15em' }}>
                •••• {last4}
              </span>
            )}
          </div>
          <span className="inline-block mt-1.5" style={{ fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.70)', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 999, textTransform: 'capitalize' as const }}>
            {account.type}
          </span>
        </div>
      </div>
    </div>
  );
});

AccountCard.displayName = 'AccountCard';
