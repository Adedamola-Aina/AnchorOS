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
import { CARD_HEADER_REVEAL, STACK_SPRING_CURVE, STACK_STAGGER_MS } from './cardConstants';

export const EXPANDED_STACK_GAP = 16;
const MAX_RENDERED_CARDS = 10;

export interface CardStackProps {
  accounts: AnchorAccount[];
  mode: 'collapsed' | 'expanded';
  onCardTap: (account: AnchorAccount, index: number, el: HTMLElement) => void;
  onReorder?: (reordered: AnchorAccount[]) => void;
  onShowAll?: () => void;
}

export const CardStack: React.FC<CardStackProps> = ({
  accounts, mode, onCardTap, onReorder, onShowAll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(343);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [orderedAccounts, setOrderedAccounts] = useState(accounts);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const reorderTargetIndexRef = useRef(0);
  const isReorderingRef = useRef(false);
  const cardHeight = Math.round(cardWidth / CARD_ASPECT_RATIO);

  const visibleAccounts = useMemo(() => {
    if (orderedAccounts.length === 0) return [];
    const off = rotationOffset % orderedAccounts.length;
    return [...orderedAccounts.slice(off), ...orderedAccounts.slice(0, off)].slice(0, MAX_RENDERED_CARDS);
  }, [orderedAccounts, rotationOffset]);

  useEffect(() => {
    setOrderedAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => { if (entry) setCardWidth(entry.contentRect.width); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const collapsedTop = useCallback((index: number) => {
    if (index === 0) {
      return 0;
    }

    return cardHeight - CARD_HEADER_REVEAL + (index - 1) * CARD_HEADER_REVEAL;
  }, [cardHeight]);

  const expandedStep = cardHeight + EXPANDED_STACK_GAP;
  const stackHeight = mode === 'collapsed'
    ? cardHeight + (visibleAccounts.length - 1) * CARD_HEADER_REVEAL
    : cardHeight + (visibleAccounts.length - 1) * expandedStep;

  const getCardWrapperStyle = useCallback((i: number): React.CSSProperties => {
    const isExpanded = mode === 'expanded';
    const restY = isExpanded ? i * expandedStep : collapsedTop(i);
    const isPeekCard = !isExpanded && i > 0;
    return {
      position: 'absolute', top: 0, left: 0, right: 0,
      height: isPeekCard ? CARD_HEADER_REVEAL : cardHeight,
      overflow: isPeekCard ? 'hidden' : 'visible',
      transform: `translateY(${restY}px)`,
      transformOrigin: 'top center',
      zIndex: isExpanded ? visibleAccounts.length - i : i + 1,
      transition: `transform 480ms ${STACK_SPRING_CURVE}, height 480ms ${STACK_SPRING_CURVE}`,
      transitionDelay: isExpanded ? `${i * STACK_STAGGER_MS}ms` : `${Math.max(visibleAccounts.length - 1 - i, 0) * 14}ms`,
      willChange: 'transform',
    };
  }, [cardHeight, collapsedTop, expandedStep, mode, visibleAccounts.length]);

  const getCardSurfaceStyle = useCallback((i: number): React.CSSProperties => {
    const isExpanded = mode === 'expanded';
    const scale = isExpanded ? 1 : Math.max(1 - i * 0.015, 0.955);
    const shiftX = isExpanded ? 0 : i * 2;
    return {
      transform: `translateX(${shiftX}px) scale(${scale})`,
      transformOrigin: 'top center',
      transition: `transform 480ms ${STACK_SPRING_CURVE}`,
      transitionDelay: isExpanded ? `${i * STACK_STAGGER_MS}ms` : `${Math.max(visibleAccounts.length - 1 - i, 0) * 14}ms`,
    };
  }, [mode, visibleAccounts.length]);

  const springBack = useCallback(() => {
    isReorderingRef.current = false;
    visibleAccounts.forEach((_, i) => {
      const el = cardEls.current[i]; if (!el) return;
      const restY = collapsedTop(i);
      el.style.transition = `transform 500ms ${STACK_SPRING_CURVE}`;
      el.style.transform = `translateY(${restY}px)`;
      setTimeout(() => { el.style.transition = ''; }, 520);
    });
  }, [collapsedTop, visibleAccounts]);

  const updateReorderStyles = useCallback((offset: number) => {
    if (mode !== 'collapsed') return;
    const targetIndex = Math.min(
      Math.max(Math.round(offset / CARD_HEADER_REVEAL), 0),
      Math.max(visibleAccounts.length - 1, 0),
    );
    reorderTargetIndexRef.current = targetIndex;

    visibleAccounts.forEach((_, i) => {
      const el = cardEls.current[i];
      if (!el) return;
      const restY = collapsedTop(i);
      el.style.transition = `transform 220ms ${STACK_SPRING_CURVE}`;

      if (i === 0) {
        el.style.transform = `translateY(${offset}px)`;
        el.style.zIndex = `${visibleAccounts.length + 1}`;
        return;
      }

      const translateY = i <= targetIndex ? restY - CARD_HEADER_REVEAL : restY;
      el.style.transform = `translateY(${translateY}px)`;
    });
  }, [collapsedTop, mode, visibleAccounts]);

  const startReorder = useCallback(() => {
    isReorderingRef.current = true;
    reorderTargetIndexRef.current = 0;
  }, []);

  const finishReorder = useCallback((offset: number) => {
    if (!isReorderingRef.current) return;
    const targetIndex = Math.min(
      Math.max(Math.round(offset / CARD_HEADER_REVEAL), 0),
      Math.max(visibleAccounts.length - 1, 0),
    );
    isReorderingRef.current = false;

    if (targetIndex <= 0 || orderedAccounts.length === 0) {
      springBack();
      return;
    }

    const off = rotationOffset % orderedAccounts.length;
    const displayOrder = [...orderedAccounts.slice(off), ...orderedAccounts.slice(0, off)];
    const [movedAccount] = displayOrder.splice(0, 1);
    if (!movedAccount) {
      springBack();
      return;
    }
    displayOrder.splice(targetIndex, 0, movedAccount);

    setOrderedAccounts(displayOrder);
    setRotationOffset(0);
    onReorder?.(displayOrder);
  }, [onReorder, orderedAccounts, rotationOffset, springBack, visibleAccounts.length]);

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
      if (i === 0) { el.style.transform = `translateY(${-offset}px)`; return; }
      const restY = collapsedTop(i);
      const attenuation = Math.max(0, 0.7 - (i - 1) * 0.15);
      el.style.transform = `translateY(${restY - offset * attenuation}px)`;
    });
  }, [collapsedTop, mode, visibleAccounts]);

  const handleTap = useCallback(() => {
    const topAcc = visibleAccounts[0]; const topEl = cardEls.current[0];
    if (topAcc && topEl) onCardTap(topAcc, 0, topEl);
  }, [visibleAccounts, onCardTap]);

  const { onPointerDown, onPointerMove, onPointerUp } = useCardDrag({
    cardHeight, commitThresholdRatio: 0.4, enabled: mode === 'collapsed',
    onTap: handleTap,
    onCommit: commitDismiss,
    onSpringBack: springBack,
    onDragUpdate,
    onReorderStart: startReorder,
    onReorderMove: updateReorderStyles,
    onReorderEnd: finishReorder,
  });

  const handleExpandedTap = useCallback((acc: AnchorAccount, i: number) => {
    haptic.selection();
    const el = cardEls.current[i]; if (el) onCardTap(acc, i, el);
  }, [onCardTap]);

  if (accounts.length === 0) return null;

  return (
    <div className="wallet-stack space-y-4">
      <div ref={containerRef} data-testid="card-stack"
        className="relative w-full touch-pan-y" style={{ height: stackHeight, perspective: 1600 }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      >
        {visibleAccounts.map((acc, i) => (
          <div key={acc.id} ref={el => { cardEls.current[i] = el; }} style={getCardWrapperStyle(i)}>
            <AccountCard account={acc} index={i} totalCards={visibleAccounts.length}
              mode={mode === 'collapsed' ? 'stack' : 'expanded'}
              isActive={i === 0 && mode === 'collapsed'}
              isDragging={false} dragOffset={0}
              style={getCardSurfaceStyle(i)}
              onTap={() => mode === 'expanded' ? handleExpandedTap(acc, i) : undefined}
              onDragStart={() => {}} />
          </div>
        ))}
      </div>
      {accounts.length > MAX_RENDERED_CARDS && (
        <div className="text-center pt-1">
          <button type="button" onClick={onShowAll} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium min-h-[44px]">
            Show all {accounts.length} accounts →
          </button>
        </div>
      )}
    </div>
  );
};
