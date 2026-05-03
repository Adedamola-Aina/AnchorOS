/**
 * StackCard — single card wrapper inside CardStack.
 *
 * Reads the shared `dragY` MotionValue and derives its own y transform
 * via `useTransform`, so dragging the front card does NOT trigger React
 * re-renders on the back cards. Springs settle naturally and the stack
 * tracks the finger smoothly.
 *
 * Extracted from CardStack so we can call `useTransform` per-card without
 * violating the rules-of-hooks loop restriction (ARCH-001 split).
 */
import React, { useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { AccountCard } from './AccountCard';
import type { AnchorAccount } from '../../types';
import {
  STACK_SPRING_STIFFNESS, STACK_SPRING_DAMPING,
} from './cardConstants';
import { SWIPE_EXIT_DISTANCE } from './useCardCycle';

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
  /** Shared drag offset of the front card (negative = up). */
  dragY: MotionValue<number>;
  onDragStart?: () => void;
  onDrag?: Parameters<typeof motion.div>[0]['onDrag'];
  onDragEnd?: Parameters<typeof motion.div>[0]['onDragEnd'];
  onTap: () => void;
  registerEl: (el: HTMLDivElement | null) => void;
}

export const StackCard: React.FC<StackCardProps> = ({
  account, index, frontIdx, totalCards, isCollapsed,
  cardHeight, baseTop, shadow, transitionDelay,
  cyclingDirection, dragY,
  onDragStart, onDrag, onDragEnd, onTap, registerEl,
}) => {
  const isFront = isCollapsed && index === frontIdx;
  const distFromFront = Math.max(frontIdx - index, 0);

  /* Front card y: bound directly to dragY so framer's drag transform writes
     into the motion value, and any external animate(dragY, ...) call drives
     this card's exit smoothly without a state-roundtrip. */
  const frontY = dragY;

  /* Back cards: smoothly tail the front card by a damped fraction of dragY.
     useTransform avoids React re-renders during drag — the springs settle. */
  const backFactor = isCollapsed
    ? Math.max(0.24 - (distFromFront - 1) * 0.05, 0.08)
    : 0;
  const backY = useTransform(dragY, (v) => Math.round(v * backFactor));

  /* When mid-swipe-commit, the front card animates to its exit target via
     the parent's animate(dragY,...) call — no separate animate prop needed.
     Back cards need NO animate during cycle: dragY stays at the exit value
     until commit, then snaps to 0 (parent handles). */
  const yMotion = isFront ? frontY : (isCollapsed ? backY : 0);

  /* Style for the wrapping motion.div. `top` stays as a numeric pixel
     so existing tests keep asserting on it; visual movement comes via y. */
  const wrapperStyle: React.CSSProperties = useMemo(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${baseTop}px`,
    height: cardHeight,
    transformOrigin: 'top center',
    zIndex: index,
    transitionDelay,
    /* CRITICAL: tell the browser this element handles its own touch.
       Without this, `touch-pan-y` on the parent makes the browser scroll
       fight framer-motion's vertical drag → 100-200ms of input lag. */
    touchAction: isFront ? 'none' : 'pan-y',
    /* Promote to its own layer so transforms don't reflow siblings. */
    willChange: isFront || cyclingDirection ? 'transform' : 'auto',
  }), [baseTop, cardHeight, index, transitionDelay, isFront, cyclingDirection]);

  return (
    <motion.div
      ref={registerEl}
      data-testid={`card-stack-item-${account.id}`}
      data-draggable={isFront ? 'true' : 'false'}
      style={{ ...wrapperStyle, y: yMotion as MotionValue<number> | number }}
      drag={isFront ? 'y' : false}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={{
        top: -(cardHeight + SWIPE_EXIT_DISTANCE),
        bottom: Math.round(cardHeight * 0.5),
      }}
      onDragStart={onDragStart}
      onDrag={isFront ? onDrag : undefined}
      onDragEnd={isFront ? onDragEnd : undefined}
      /* No `animate` prop on collapsed cards — y is driven directly by the
         shared MotionValue. For expanded mode, fall back to spring layout. */
      {...(!isCollapsed
        ? {
            animate: { y: 0 },
            transition: {
              type: 'spring',
              stiffness: STACK_SPRING_STIFFNESS,
              damping: STACK_SPRING_DAMPING,
              mass: 1,
            },
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
