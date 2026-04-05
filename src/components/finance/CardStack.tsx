/**
 * CardStack — Apple Wallet-style card stack with drag/swipe.
 * UX-041 Phase 2 §5. No framer-motion — native refs + rAF.
 */
import React, {
  useState, useRef, useCallback, useEffect, useMemo,
} from 'react';
import { AccountCard, CARD_ASPECT_RATIO } from './AccountCard';
import { haptic } from '../../utils/haptic';
import { useCardDrag } from '../../hooks/useCardDrag';
import type { AnchorAccount } from '../../types';

export const PEEK_HEIGHT = 60;
const MAX_RENDERED_CARDS = 10;

export interface CardStackProps {
  accounts: AnchorAccount[];
  mode: 'collapsed' | 'expanded';
  onCardTap: (account: AnchorAccount, index: number, el: HTMLElement) => void;
  onReorder?: (reordered: AnchorAccount[]) => void;
}

export const CardStack: React.FC<CardStackProps> = ({
  accounts, mode, onCardTap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(343);
  const [rotationOffset, setRotationOffset] = useState(0);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const cardHeight = Math.round(cardWidth / CARD_ASPECT_RATIO);

  const visibleAccounts = useMemo(() => {
    if (accounts.length === 0) return [];
    const off = rotationOffset % accounts.length;
    return [...accounts.slice(off), ...accounts.slice(0, off)].slice(0, MAX_RENDERED_CARDS);
  }, [accounts, rotationOffset]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => { if (entry) setCardWidth(entry.contentRect.width); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const stackHeight = mode === 'collapsed'
    ? cardHeight + (visibleAccounts.length - 1) * PEEK_HEIGHT
    : visibleAccounts.length * (cardHeight + 16) - 16;

  const getCardStyle = useCallback((i: number): React.CSSProperties => {
    if (mode === 'expanded') {
      return { position: 'relative', marginBottom: i < visibleAccounts.length - 1 ? 16 : 0, zIndex: visibleAccounts.length - i };
    }
    const restY = i * PEEK_HEIGHT;
    const restScale = Math.max(1 - i * 0.04, 0.88);
    return {
      position: 'absolute', top: 0, left: 0, right: 0,
      transform: `translateY(${restY}px) scale(${restScale})`,
      transformOrigin: 'top center', zIndex: visibleAccounts.length - i,
      transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
    };
  }, [mode, visibleAccounts.length]);

  const springBack = useCallback(() => {
    visibleAccounts.forEach((_, i) => {
      const el = cardEls.current[i]; if (!el) return;
      const restY = i * PEEK_HEIGHT;
      const restScale = Math.max(1 - i * 0.04, 0.88);
      el.style.transition = 'transform 500ms cubic-bezier(0.34,1.56,0.64,1)';
      el.style.transform = `translateY(${restY}px) scale(${restScale})`;
      setTimeout(() => { el.style.transition = ''; }, 520);
    });
  }, [visibleAccounts]);

  const commitDismiss = useCallback(() => {
    const el = cardEls.current[0];
    if (el) {
      el.style.transition = 'transform 380ms cubic-bezier(0.32,0,0.67,0)';
      el.style.transform = `translateY(${-(cardHeight + 100)}px) scale(1.0)`;
    }
    setTimeout(() => {
      setRotationOffset(prev => prev + 1);
      setTimeout(() => { cardEls.current.forEach(c => { if (c) c.style.transition = ''; }); }, 50);
    }, 400);
  }, [cardHeight]);

  const onDragUpdate = useCallback((offset: number) => {
    if (mode !== 'collapsed') return;
    visibleAccounts.forEach((_, i) => {
      const el = cardEls.current[i]; if (!el) return;
      if (i === 0) { el.style.transform = `translateY(${-offset}px) scale(1.0)`; return; }
      const restY = i * PEEK_HEIGHT;
      const restScale = Math.max(1 - i * 0.04, 0.88);
      const attenuation = Math.max(0, 0.7 - (i - 1) * 0.15);
      const scaleProgress = Math.min(offset / cardHeight, 1);
      const scale = restScale + (1 - restScale) * scaleProgress * (1 / i);
      el.style.transform = `translateY(${restY - offset * attenuation}px) scale(${scale})`;
    });
  }, [mode, visibleAccounts, cardHeight]);

  const handleTap = useCallback(() => {
    const topAcc = visibleAccounts[0]; const topEl = cardEls.current[0];
    if (topAcc && topEl) onCardTap(topAcc, 0, topEl);
  }, [visibleAccounts, onCardTap]);

  const { onPointerDown, onPointerMove, onPointerUp } = useCardDrag({
    cardHeight, commitThresholdRatio: 0.4, enabled: mode === 'collapsed',
    onTap: handleTap, onCommit: commitDismiss, onSpringBack: springBack, onDragUpdate,
  });

  const handleExpandedTap = useCallback((acc: AnchorAccount, i: number) => {
    haptic.selection();
    const el = cardEls.current[i]; if (el) onCardTap(acc, i, el);
  }, [onCardTap]);

  if (accounts.length === 0) return null;

  return (
    <div ref={containerRef} data-testid="card-stack"
      className="relative w-full touch-pan-y" style={{ height: stackHeight }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
    >
      {visibleAccounts.map((acc, i) => (
        <div key={acc.id} ref={el => { cardEls.current[i] = el; }} style={getCardStyle(i)}>
          <AccountCard account={acc} index={i} totalCards={visibleAccounts.length}
            mode={mode === 'collapsed' ? 'stack' : 'expanded'}
            isActive={i === 0 && mode === 'collapsed'}
            isDragging={false} dragOffset={0}
            onTap={() => mode === 'expanded' ? handleExpandedTap(acc, i) : undefined}
            onDragStart={() => {}} />
        </div>
      ))}
      {accounts.length > MAX_RENDERED_CARDS && (
        <div className="text-center mt-4 pt-2">
          <button type="button" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium min-h-[44px]">
            {/* TODO: /finance/accounts flat list route */}
            Show all {accounts.length} accounts →
          </button>
        </div>
      )}
    </div>
  );
};
