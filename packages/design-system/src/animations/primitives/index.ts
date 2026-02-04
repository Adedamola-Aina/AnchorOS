/**
 * Animation Primitives - Anchor OS Design System
 * 
 * Pre-built animated components for consistent motion.
 */

// Page transitions
export { AnimatedPage } from './AnimatedPage';

// List animations
export {
    AnimatedList,
    AnimatedListItem,
    VirtualizedAnimatedItem
} from './AnimatedList';

// Modal animations
export {
    AnimatedModal,
    AnimatedModalContent,
    AnimatedModalHeader,
    AnimatedModalFooter,
} from './AnimatedModal';

// Button animations
export { AnimatedButton, AnimatedIconButton } from './AnimatedButton';

// Card animations
export {
    AnimatedCard,
    AnimatedRevealCard,
    AnimatedExpandCard
} from './AnimatedCard';

// Skeleton/Loading animations
export {
    AnimatedSkeleton,
    SkeletonList,
    SkeletonCardGrid
} from './AnimatedSkeleton';

// Tab animations
export { AnimatedTabs, AnimatedTabContent } from './AnimatedTabs';

// Feedback animations
export {
    AnimatedCheckmark,
    AnimatedShake,
    AnimatedPulse,
    AnimatedCounter,
} from './AnimatedFeedback';

// Checkbox animations (WEB-003 Phase 5)
export {
    AnimatedCheckbox,
    AnimatedCheckboxPath
} from './AnimatedCheckbox';

// Toggle animations (WEB-003 Phase 5)
export {
    AnimatedToggle,
    AnimatedIconToggle
} from './AnimatedToggle';

// Badge animations (WEB-003 Phase 5)
export {
    AnimatedBadge,
    NotificationBadge
} from './AnimatedBadge';

// Progress animations (WEB-003 Phase 7)
export {
    AnimatedProgressBar,
    AnimatedProgressCircle,
    AnimatedSpinner,
    AnimatedCopyConfirmation
} from './AnimatedProgress';
