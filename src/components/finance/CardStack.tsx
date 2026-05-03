/**
 * CardStack — Apple Wallet-style card stack with spring swipe transitions.
 *
 * Smoothness architecture:
 *   - Single shared `dragY` MotionValue (in useCardCycle), no per-frame
 *     React renders during drag.
 *   - CSS `transition: top` on each StackCard handles the slot reshuffle
 *     when rotation commits — cards slide between slots, never teleport.
 *   - `recentlyExitedId` masks the unavoidable binding-swap of the
 *     formerly-front card during the brief window where it transitions
 *     from raw `dragY` binding to the factored back-card binding.
 */
import React, {
  useState, useRef, useCallback, useEffect, useMemo,
} from 'react';
import { AccountCard, CARD_ASPECT_RATIO } from './AccountCard';
import { StackCard } from './StackCard';
import { haptic } from '../../utils/haptic';
import type { AnchorAccount } from '../../types';
import {
  CARD_HEADER_REVEAL,
  STACK_STAGGER_MS,
} from './cardConstants';
import { useCardCycle } from './useCardCycle';

export const EXPANDED_STACK_GAP = 16;
const MAX_RENDERED_CARDS = 10;
/** Window during which the formerly-front card stays hidden. Should be
 *  long enough for the dragY spring to reach near-rest (≈250ms) so the
 *  visible reveal is at the new slot's resting position. */
const RECENTLY_EXITED_HIDE_MS = 280;

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
    suppressTapRef, rotationOffset, dragY, cyclingDirection,
    handleDrag, handleDragEnd, resetRotation,
  } = useCardCycle(orderedAccounts.length, cardHeight);

  const visibleAccounts = useMemo(() => {
    if (orderedAccounts.length === 0) return [];
    const off = rotationOffset % orderedAccounts.length;
    return [
      ...orderedAccounts.slice(off),
      ...orderedAccounts.slice(0, off),
    ].slice(0, MAX_RENDERED_CARDS);
  }, [orderedAccounts, rotationOffset]);

  /* Track which card just left the front so StackCard can hide it
     during the binding swap. We compare rotation across renders. */
  const prevRotationRef = useRef(rotationOffset);
  const prevFrontIdRef = useRef<string | null>(null);
  const [recentlyExitedId, setRecentlyExitedId] = useState<string | null>(null);

  useEffect(() => {
    if (prevRotationRef.current !== rotationOffset) {
      const exitedId = prevFrontIdRef.current;
      prevRotationRef.current = rotationOffset;
      if (exitedId) {
        setRecentlyExitedId(exitedId);
        const t = window.setTimeout(
          () => setRecentlyExitedId(null),
          RECENTLY_EXITED_HIDE_MS,
        );
        return () => window.clearTimeout(t);
      }
    }
    return undefined;
  }, [rotationOffset]);

  /* Always remember the current front-card id so the next rotation
     change can mark it as the freshly-exited card. */
  useEffect(() => {
    const front = visibleAccounts[visibleAccounts.length - 1];
    prevFrontIdRef.current = front ? front.id : null;
  }, [visibleAccounts]);

  useEffect(() => { setOrderedAccounts(accounts); }, [accounts]);
  useEffect(() => { resetRotation(); }, [accounts.length, resetRotation]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setCardWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const isCollapsed = mode === 'collapsed';
  const expandedStep = cardHeight + EXPANDED_STACK_GAP;
  const stackHeight = isCollapsed
    ? (visibleAccounts.length - 1) * CARD_HEADER_REVEAL + cardHeight
    : cardHeight + (visibleAccounts.length - 1) * expandedStep;

  const getBaseTop = useCallback((index: number) => (
    isCollapsed ? index * CARD_HEADER_REVEAL : index * expandedStep
  ), [expandedStep, isCollapsed]);

  const getTransitionDelay = useCallback((index: number) => (
    !isCollapsed
      ? `${index * STACK_STAGGER_MS}ms`
      : `${Math.max(visibleAccounts.length - 1 - index, 0) * 14}ms`
  ), [isCollapsed, visibleAccounts.length]);

  const getShadow = useCallback((_index: number) => (
    isCollapsed ? '0 -1px 3px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.06)'
  ), [isCollapsed]);

  const frontIdx = visibleAccounts.length - 1;

  const handleTap = useCallback((acc: AnchorAccount, i: number) => {
    if (suppressTapRef.current) { suppressTapRef.current = false; return; }
    haptic.selection();
    const el = cardEls.current[i]; if (el) onCardTap(acc, i, el);
  }, [onCardTap, suppressTapRef]);

  if (accounts.length === 0) {
    return null;
  }

  return (
    <div className="wallet-stack space-y-4">
      <div
        ref={containerRef}
        data-testid="card-stack"
        /* `touch-pan-x` (not `pan-y`): the browser only handles
           horizontal panning; vertical gestures belong to framer's drag. */
        className="relative w-full touch-pan-x overflow-visible"
        style={{ height: stackHeight }}
      >
        {visibleAccounts.map((acc, i) => (
          <StackCard
            key={acc.id}
            account={acc}
            index={i}
            frontIdx={frontIdx}
            totalCards={visibleAccounts.length}
            isCollapsed={isCollapsed}
            cardHeight={cardHeight}
            baseTop={getBaseTop(i)}
            shadow={getShadow(i)}
            transitionDelay={getTransitionDelay(i)}
            cyclingDirection={cyclingDirection}
            recentlyExited={recentlyExitedId === acc.id}
            dragY={dragY}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            onTap={() => handleTap(acc, i)}
            registerEl={(el) => { cardEls.current[i] = el; }}
          />
        ))}
      </div>
      {accounts.length > MAX_RENDERED_CARDS && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onShowAll}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium min-h-[44px]"
          >
            Show all {accounts.length} accounts →
          </button>
        </div>
      )}
    </div>
  );
};

/* Re-export for any consumer importing AccountCard from CardStack. */
export { AccountCard };
