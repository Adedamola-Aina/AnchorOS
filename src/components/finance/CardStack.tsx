/**
 * CardStack — Apple Wallet-style card stack with spring swipe transitions.
 * UX-041 Phase 2 §5. Motion-driven overlap with swipe-to-advance.
 */
import React, {
  useState, useRef, useCallback, useEffect, useMemo,
} from 'react';
import { motion } from 'framer-motion';
import { AccountCard, CARD_ASPECT_RATIO } from './AccountCard';
import { haptic } from '../../utils/haptic';
import type { AnchorAccount } from '../../types';
import {
  CARD_HEADER_REVEAL,
  STACK_STAGGER_MS,
  STACK_SPRING_STIFFNESS,
  STACK_SPRING_DAMPING,
} from './cardConstants';
import { useCardCycle, SWIPE_EXIT_DISTANCE } from './useCardCycle';

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
  accounts, mode, onCardTap, onShowAll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(343);
  const [orderedAccounts, setOrderedAccounts] = useState(accounts);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const cardHeight = Math.round(cardWidth / CARD_ASPECT_RATIO);

  const {
    suppressTapRef, rotationOffset, dragPreviewOffset, cyclingDirection,
    handleDrag, handleDragEnd, resetRotation,
  } = useCardCycle(orderedAccounts.length, cardHeight);

  const visibleAccounts = useMemo(() => {
    if (orderedAccounts.length === 0) return [];
    const off = rotationOffset % orderedAccounts.length;
    return [...orderedAccounts.slice(off), ...orderedAccounts.slice(0, off)].slice(0, MAX_RENDERED_CARDS);
  }, [orderedAccounts, rotationOffset]);

  useEffect(() => { setOrderedAccounts(accounts); }, [accounts]);
  useEffect(() => { resetRotation(); }, [accounts.length, resetRotation]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => { if (entry) setCardWidth(entry.contentRect.width); });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const isCollapsed = mode === 'collapsed';
  const expandedStep = cardHeight + EXPANDED_STACK_GAP;
  /* Collapsed: each card adds one CARD_HEADER_REVEAL strip, last card shows full height.
     Total = (N-1) * CARD_HEADER_REVEAL + cardHeight */
  const stackHeight = isCollapsed
    ? (visibleAccounts.length - 1) * CARD_HEADER_REVEAL + cardHeight
    : cardHeight + (visibleAccounts.length - 1) * expandedStep;

  /* Every card positioned at index * CARD_HEADER_REVEAL.
     Each card lays ON TOP of the one above it (ascending z-index).
     Only the peek strip (top 48px) of each card is visible —
     the rest is covered by the card below it. Last card is fully visible. */
  const getBaseTop = useCallback((index: number) => (
    isCollapsed ? index * CARD_HEADER_REVEAL : index * expandedStep
  ), [expandedStep, isCollapsed]);

  const getTransitionDelay = useCallback((index: number) => (
    !isCollapsed ? `${index * STACK_STAGGER_MS}ms` : `${Math.max(visibleAccounts.length - 1 - index, 0) * 14}ms`
  ), [isCollapsed, visibleAccounts.length]);

  /* Minimal shadow — just enough depth to separate overlapping cards */
  const getShadow = useCallback((_index: number) => (
    isCollapsed ? '0 -1px 3px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.06)'
  ), [isCollapsed]);

  /* No scale in collapsed — cards are full-width like Apple Wallet */

  const frontIdx = visibleAccounts.length - 1;
  const getRelativeY = useCallback((index: number) => {
    if (!isCollapsed) return 0;
    if (cyclingDirection && index === frontIdx) {
      return cyclingDirection === 'next' ? -(cardHeight + SWIPE_EXIT_DISTANCE) : Math.round(cardHeight * 0.46);
    }
    if (index === frontIdx) return 0;
    const distFromFront = frontIdx - index;
    return Math.round(dragPreviewOffset * Math.max(0.24 - (distFromFront - 1) * 0.05, 0.08));
  }, [cardHeight, cyclingDirection, dragPreviewOffset, frontIdx, isCollapsed]);

  const getCardWrapperStyle = useCallback((i: number): React.CSSProperties => ({
    position: 'absolute', left: 0, right: 0,
    top: `${getBaseTop(i)}px`,
    height: cardHeight,
    transformOrigin: 'top center',
    /* Ascending z-index: each card lays ON TOP of the one above it.
       The last card has highest z and is fully visible. */
    zIndex: i,
    transitionDelay: getTransitionDelay(i),
  }), [cardHeight, getBaseTop, getTransitionDelay]);

  const handleTap = useCallback((acc: AnchorAccount, i: number) => {
    if (suppressTapRef.current) { suppressTapRef.current = false; return; }
    haptic.selection();
    const el = cardEls.current[i]; if (el) onCardTap(acc, i, el);
  }, [onCardTap, suppressTapRef]);

  if (accounts.length === 0) return null;

  return (
    <div className="wallet-stack space-y-4">
      <div ref={containerRef} data-testid="card-stack"
        className="relative w-full touch-pan-y overflow-visible" style={{ height: stackHeight }}
      >
        {visibleAccounts.map((acc, i) => (
          <motion.div
            key={acc.id}
            ref={el => { cardEls.current[i] = el; }}
            data-testid={`card-stack-item-${acc.id}`}
            data-draggable={isCollapsed && i === frontIdx ? 'true' : 'false'}
            style={getCardWrapperStyle(i)}
            animate={{ y: getRelativeY(i), x: 0, scale: 1 }}
            transition={{
              type: 'spring', stiffness: STACK_SPRING_STIFFNESS, damping: STACK_SPRING_DAMPING,
              mass: 1, bounce: 0, delay: isCollapsed ? 0 : i * (STACK_STAGGER_MS / 1000),
            }}
            drag={isCollapsed && i === frontIdx ? 'y' : false}
            dragMomentum={false} dragElastic={0.06}
            dragConstraints={{ top: -(cardHeight + SWIPE_EXIT_DISTANCE), bottom: Math.round(cardHeight * 0.5) }}
            onDrag={isCollapsed && i === frontIdx ? handleDrag : undefined}
            onDragEnd={isCollapsed && i === frontIdx ? handleDragEnd : undefined}
          >
            <AccountCard account={acc} index={i} totalCards={visibleAccounts.length}
              mode={mode === 'collapsed' ? 'stack' : 'expanded'}
              isActive={isCollapsed && i === frontIdx}
              style={{ boxShadow: getShadow(i) }}
              onTap={() => handleTap(acc, i)} />
          </motion.div>
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
