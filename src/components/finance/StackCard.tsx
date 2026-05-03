/**
 * StackCard — single card wrapper inside CardStack.
 *
 * Smoothness comes from three things:
 *   1. CSS `transition: top 320ms` so when the inline `top` changes
 *      (slot reshuffle on commit) the card slides to its new resting
 *      position instead of teleporting.
 *   2. Front card binds `style.y = dragY` directly so framer-motion's
 *      drag system writes into the shared MotionValue with zero React
 *      renders.
 *   3. Back cards use `useTransform(dragY, fn)` for damped follow.
 *      No re-renders during drag → spring physics never restart.
 *
 * The formerly-front card is hidden via `recentlyExited` while the
 * binding swap (raw dragY → factored) settles, so the user never sees
 * the unavoidable internal pixel jump.
 */
import React, { useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { AccountCard } from './AccountCard';
import type { AnchorAccount } from '../../types';
import { SWIPE_EXIT_DISTANCE } from './useCardCycle';

/** Easing tuned for layout reshuffle — gentle landing, no overshoot. */
const SLOT_TRANSITION = 'top 320ms cubic-bezier(0.32, 0.72, 0, 1)';

export interface StackCardProps {
  account: AnchorAccount;
  index: number;
  frontIdx: number;
  totalCards: number;
  isCollapsed: boolean;
  cardHeight: number;
  baseTop: number;
  shadow: string;
  transitionDelay: string;
  cyclingDirection: 'next' | 'previous' | null;
  /** True for the card that just left the front position — hidden so
   * the user does not see its binding swap (raw → factored dragY). */
  recentlyExited: boolean;
  /** Shared drag offset of the front card (negative = up). */
  dragY: MotionValue<number>;
  onDrag?: Parameters<typeof motion.div>[0]['onDrag'];
  onDragEnd?: Parameters<typeof motion.div>[0]['onDragEnd'];
  onTap: () => void;
  registerEl: (el: HTMLDivElement | null) => void;
}

export const StackCard: React.FC<StackCardProps> = ({
  account, index, frontIdx, totalCards, isCollapsed,
  cardHeight, baseTop, shadow, transitionDelay,
  cyclingDirection, recentlyExited, dragY,
  onDrag, onDragEnd, onTap, registerEl,
}) => {
  const isFront = isCollapsed && index === frontIdx;
  const distFromFront = Math.max(frontIdx - index, 0);

  /* Back cards: tail the front card by a damped fraction of dragY.
     Computed once via useTransform so dragging does not re-render React. */
  const backFactor = isCollapsed
    ? Math.max(0.24 - (distFromFront - 1) * 0.05, 0.08)
    : 0;
  const backY = useTransform(dragY, (v) => Math.round(v * backFactor));

  /* Pick the right motion source for this card. */
  const yMotion: MotionValue<number> | number = isFront
    ? dragY
    : (isCollapsed ? backY : 0);

  const wrapperStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${baseTop}px`,
    height: cardHeight,
    transformOrigin: 'top center',
    zIndex: index,
    /* CSS transition on `top` so the inline top change (slot reshuffle
       on commit) animates smoothly. Disabled for the recently-exited
       card so it snaps to its new slot rather than sliding through view. */
    transition: recentlyExited ? 'none' : SLOT_TRANSITION,
    transitionDelay: recentlyExited ? '0ms' : transitionDelay,
    /* Hide the formerly-front card while its y-binding swaps and dragY
       springs back. Other cards stay visible and animate smoothly. */
    visibility: recentlyExited ? 'hidden' : 'visible',
    /* `touch-action: none` on the front card lets framer own the gesture
       — without this, the browser fights for vertical scroll → input lag. */
    touchAction: isFront ? 'none' : 'pan-y',
    willChange: isFront || cyclingDirection ? 'transform' : 'auto',
  }), [
    baseTop, cardHeight, index, transitionDelay,
    isFront, cyclingDirection, recentlyExited,
  ]);

  return (
    <motion.div
      ref={registerEl}
      data-testid={`card-stack-item-${account.id}`}
      data-draggable={isFront ? 'true' : 'false'}
      style={{ ...wrapperStyle, y: yMotion }}
      drag={isFront ? 'y' : false}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={{
        top: -(cardHeight + SWIPE_EXIT_DISTANCE),
        bottom: Math.round(cardHeight * 0.5),
      }}
      onDrag={isFront ? onDrag : undefined}
      onDragEnd={isFront ? onDragEnd : undefined}
      {...(!isCollapsed
        ? {
            animate: { y: 0 },
            transition: { type: 'spring', stiffness: 320, damping: 30, mass: 1 },
          }
        : {})}
    >
      <AccountCard
        account={account}
        index={index}
        totalCards={totalCards}
        mode={isCollapsed ? 'stack' : 'expanded'}
        isActive={isFront}
        style={{ boxShadow: shadow }}
        onTap={onTap}
      />
    </motion.div>
  );
};
