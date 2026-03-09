/**
 * NavIconAnimations - Micro-animations for bottom navigation icons
 * 
 * Per DESIGN_PHILOSOPHY.md: "Remain visually stable and emotionally calm"
 * These are subtle, delightful tap animations that bring joy without being intrusive.
 * 
 * Animations:
 * - Home: Grid squares pulse with user's account colors (or stacking fallback)
 * - Tasks: Checkmark celebration with random accent colors
 * - Finance: Credit card swipe motion
 * - Settings: Subtle gear rotation
 */
// @ts-nocheck


// CSS Keyframes for nav icon animations
export const navAnimationStyles = `
@keyframes nav-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
}

@keyframes nav-bounce {
    0%, 100% { transform: translateY(0); }
    40% { transform: translateY(-3px); }
    60% { transform: translateY(-1px); }
}

@keyframes nav-swipe {
    0% { transform: translateX(-4px); opacity: 0.7; }
    50% { transform: translateX(4px); opacity: 1; }
    100% { transform: translateX(0); opacity: 1; }
}

@keyframes nav-rotate {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(20deg); }
}

@keyframes nav-glow {
    0% { box-shadow: 0 0 0 0 currentColor; opacity: 0.6; }
    100% { box-shadow: 0 0 0 8px transparent; opacity: 0; }
}

@keyframes fabric-breathe {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
}
`;

// Celebration colors for Tasks icon (design system colors)
export const CELEBRATION_COLORS = [
    { light: 'text-emerald-500', dark: 'dark:text-emerald-400' },
    { light: 'text-blue-500', dark: 'dark:text-blue-400' },
    { light: 'text-violet-500', dark: 'dark:text-violet-400' },
    { light: 'text-amber-500', dark: 'dark:text-amber-400' },
    { light: 'text-rose-500', dark: 'dark:text-rose-400' },
    { light: 'text-teal-500', dark: 'dark:text-teal-400' },
];

// Get random celebration color
export const getRandomColor = () => {
    return CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];
};

// Animation class mappings by route
export const getAnimationClass = (route: string): string => {
    switch (route) {
        case '/dashboard':
            return 'animate-[nav-pulse_200ms_ease-out]';
        case '/commitments':
            return 'animate-[nav-bounce_200ms_ease-out]';
        case '/finance':
            return 'animate-[nav-swipe_200ms_ease-out]';
        case '/fabric':
            return 'animate-[fabric-breathe_3s_ease-in-out_infinite]';
        case '/settings':
            return 'animate-[nav-rotate_200ms_ease-out]';
        default:
            return '';
    }
};
