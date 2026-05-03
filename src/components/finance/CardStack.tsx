/**
 * CardStack — Apple Wallet-style card stack.
 *
 * Slot-rank model (eliminates binding-swap stutter):
 *   - Cards never reorder. Each card keeps a stable React key by account id.
 *   - `rank = (arrayIndex + rotationOffset) mod N` drives `top` and `zIndex`.
 *   - `<motion.div layout="position">` measures each card's current visual
 *     position before a state change and its new layout position after,
 *     then animates the delta with a single Apple-tuned ease curve.
 *   - On swipe up, framer animates the just-released card from its
 *     drag-displaced position straight to slot 0 (back of stack), while
 *     every other card slides forward by one slot position — all in one
 *     coherent motion.
 *
 * No motion-value sharing, no useTransform follow chain, no setTimeout,
 * no visibility hide. The swipe lifecycle is:
 *
 *   user drags front card → framer's drag transforms it
 *     → release crosses threshold
 *       → setRotationOffset(±1)
 *       → every card's `top`/`zIndex` change in one render
 *       → framer FLIP-animates each card from its previous visual
 *         position (including the drag transform) to its new slot
 *
 *   release without crossing threshold
 *     → dragSnapToOrigin springs the card back
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
} from './cardConstants';

export const EXPANDED_STACK_GAP = 16;
const MAX_RENDERED_CARDS = 10;

const SWIPE_THRESHOLD_RATIO = 0.32;
const SWIPE_VELOCITY_THRESHOLD = 380; /* px/s — flick gesture short-circuit */
const TAP_SUPPRESSION_OFFSET = 6;

/** Apple UIKit ease-out for purposeful, predictable motion. */
const APPLE_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];
/** Slot-transition duration. Long enough to feel deliberate, short enough
 *  to feel snappy. Matches Apple Wallet's perceived ~400ms. */
const SLOT_TRANSITION_S = 0.42;

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
  const suppressTapRef = useRef(false);

  const [rotationOffset, setRotationOffset] = useState(0);

  const visibleAccounts = useMemo(
    () => orderedAccounts.slice(0, MAX_RENDERED_CARDS),
    [orderedAccounts],
  );
  const N = visibleAccounts.length;

  useEffect(() => { setOrderedAccounts(accounts); }, [accounts]);
  useEffect(() => { setRotationOffset(0); }, [accounts.length]);

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
    ? (N - 1) * CARD_HEADER_REVEAL + cardHeight
    : cardHeight + (N - 1) * expandedStep;

  /* rank = visual slot. 0 = back-most, N-1 = front.
     Increment rotationOffset → front card's rank wraps to 0 (tucks behind).
     Decrement rotationOffset → back-most card's rank wraps to N-1 (comes to front). */
  const rankFor = useCallback(
    (i: number) => (N === 0 ? 0 : (i + rotationOffset) % N),
    [N, rotationOffset],
  );

  const getTop = useCallback((rank: number) => (
    isCollapsed ? rank * CARD_HEADER_REVEAL : rank * expandedStep
  ), [isCollapsed, expandedStep]);

  const getShadow = useCallback((rank: number) => {
    if (!isCollapsed) return '0 1px 4px rgba(0,0,0,0.06)';
    /* Back-most cards: very subtle shadow to suggest depth.
       Front card: stronger shadow to lift it visually. */
    return rank === N - 1
      ? '0 4px 16px rgba(0,0,0,0.18), 0 -1px 3px rgba(0,0,0,0.06)'
      : '0 -1px 3px rgba(0,0,0,0.08)';
  }, [isCollapsed, N]);

  /* Expanded-mode stagger delay — kept for backward-compat with the
     transition-delay assertion in CardStack.test.tsx. */
  const getTransitionDelay = useCallback((arrayIndex: number) => (
    !isCollapsed
      ? `${arrayIndex * STACK_STAGGER_MS}ms`
      : '0ms'
  ), [isCollapsed]);

  const handleTap = useCallback((acc: AnchorAccount, i: number) => {
    if (suppressTapRef.current) { suppressTapRef.current = false; return; }
    haptic.selection();
    const el = cardEls.current[i];
    if (el) onCardTap(acc, i, el);
  }, [onCardTap]);

  const cycleNext = useCallback(() => {
    setRotationOffset((r) => (N === 0 ? 0 : (r + 1) % N));
  }, [N]);

  const cyclePrevious = useCallback(() => {
    setRotationOffset((r) => (N === 0 ? 0 : (r - 1 + N) % N));
  }, [N]);

  const handleDragEnd = useCallback(
    (info: { offset: { y: number }; velocity: { y: number } }) => {
      const distanceThreshold = cardHeight * SWIPE_THRESHOLD_RATIO;
      const { offset, velocity } = info;
      const flickedUp = velocity.y < -SWIPE_VELOCITY_THRESHOLD;
      const flickedDown = velocity.y > SWIPE_VELOCITY_THRESHOLD;

      if (offset.y <= -distanceThreshold || flickedUp) {
        haptic.selection();
        cycleNext();
        return;
      }
      if (offset.y >= distanceThreshold || flickedDown) {
        haptic.selection();
        cyclePrevious();
        return;
      }
      /* Cancel — dragSnapToOrigin handles the spring back to rest. */
    },
    [cardHeight, cycleNext, cyclePrevious],
  );

  if (accounts.length === 0) return null;

  return (
    <div className="wallet-stack space-y-4">
      <div
        ref={containerRef}
        data-testid="card-stack"
        /* `pan-x` only — vertical gestures belong to framer's drag system. */
        className="relative w-full touch-pan-x overflow-visible"
        style={{ height: stackHeight }}
      >
        {visibleAccounts.map((acc, i) => {
          const rank = rankFor(i);
          const isFront = isCollapsed && rank === N - 1;
          const top = getTop(rank);
          return (
            <motion.div
              key={acc.id}
              ref={(el) => { cardEls.current[i] = el; }}
              data-testid={`card-stack-item-${acc.id}`}
              data-draggable={isFront ? 'true' : 'false'}
              /* Position-only layout animation: framer measures each card's
                 visual rect before a state change and animates the delta to
                 its new layout. Includes any active drag transform — so the
                 swipe gesture flows directly into the slot transition. */
              layout="position"
              transition={{
                layout: { duration: SLOT_TRANSITION_S, ease: APPLE_EASE },
              }}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${top}px`,
                height: cardHeight,
                zIndex: rank,
                transformOrigin: 'top center',
                transitionDelay: getTransitionDelay(i),
                /* Front card owns its own touch — without this the browser
                   pulls the gesture for vertical scroll → ~150ms input lag. */
                touchAction: isFront ? 'none' : 'pan-y',
                willChange: isFront ? 'transform' : 'auto',
              }}
              drag={isFront ? 'y' : false}
              dragMomentum={false}
              dragElastic={0.08}
              dragConstraints={{
                top: -cardHeight,
                bottom: cardHeight,
              }}
              /* Cancel gesture springs back to origin via framer. */
              dragSnapToOrigin
              dragTransition={{
                bounceStiffness: 380,
                bounceDamping: 34,
              }}
              onDrag={(_, info) => {
                if (Math.abs(info.offset.y) > TAP_SUPPRESSION_OFFSET) {
                  suppressTapRef.current = true;
                }
              }}
              onDragEnd={(_, info) => handleDragEnd(info)}
            >
              <AccountCard
                account={acc}
                index={i}
                totalCards={N}
                mode={isCollapsed ? 'stack' : 'expanded'}
                isActive={isFront}
                style={{ boxShadow: getShadow(rank) }}
                onTap={() => handleTap(acc, i)}
              />
            </motion.div>
          );
        })}
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
