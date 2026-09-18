import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MarketingRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger helper: seconds to postpone the reveal. */
  delay?: number;
  /** Vertical travel in px before settling into place. */
  y?: number;
}

/**
 * Scroll-triggered reveal used across the marketing site.
 *
 * Deliberately defensive: respects `prefers-reduced-motion`, and falls back to a
 * plain, fully-visible render when IntersectionObserver is unavailable (jsdom in
 * unit tests), so content is never hidden from tests or reduced-motion users.
 */
export default function MarketingReveal({ children, className, delay = 0, y = 24 }: MarketingRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const canObserve = typeof IntersectionObserver !== 'undefined';

  if (prefersReducedMotion || !canObserve) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}