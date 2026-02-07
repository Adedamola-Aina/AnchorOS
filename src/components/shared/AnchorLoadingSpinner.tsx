/**
 * AnchorLoadingSpinner — Nautical-themed loading animations
 *
 * 4 variants randomly selected on mount, aligned with
 * Anchor OS "calm, trustworthy, nautical" design philosophy.
 * CSS-only animations for battery efficiency (ARCH-002).
 *
 * @module components/shared/AnchorLoadingSpinner
 */

import React, { useState } from 'react';

interface AnchorLoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

const sizes = { sm: 40, md: 56, lg: 72 } as const;

/** Sonar Ping — concentric rings expanding from anchor center */
const SonarPing = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="10" className="fill-primary-600 dark:fill-primary-400" opacity="0.9" />
        <circle cx="40" cy="40" r="20" className="stroke-primary-500 dark:stroke-primary-400" strokeWidth="1.5" opacity="0" style={{ animation: 'sonar-ring 2s ease-out infinite' }} />
        <circle cx="40" cy="40" r="20" className="stroke-primary-500 dark:stroke-primary-400" strokeWidth="1.5" opacity="0" style={{ animation: 'sonar-ring 2s ease-out 0.6s infinite' }} />
        <circle cx="40" cy="40" r="20" className="stroke-primary-500 dark:stroke-primary-400" strokeWidth="1.5" opacity="0" style={{ animation: 'sonar-ring 2s ease-out 1.2s infinite' }} />
    </svg>
);

/** Anchor Drop — anchor gently bobbing/breathing */
const AnchorDrop = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none" style={{ animation: 'anchor-bob 2.4s ease-in-out infinite' }}>
        <circle cx="40" cy="20" r="7" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" />
        <line x1="40" y1="27" x2="40" y2="62" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 45 C18 65 62 65 62 45" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" fill="none" />
        <line x1="18" y1="45" x2="18" y2="38" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" />
        <line x1="62" y1="45" x2="62" y2="38" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

/** Compass Rose — 4-point star rotating smoothly */
const CompassRose = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none" style={{ animation: 'compass-spin 3s linear infinite' }}>
        <polygon points="40,8 44,36 40,40 36,36" className="fill-primary-600 dark:fill-primary-400" />
        <polygon points="72,40 44,44 40,40 44,36" className="fill-primary-500 dark:fill-primary-300" opacity="0.7" />
        <polygon points="40,72 36,44 40,40 44,44" className="fill-primary-400 dark:fill-primary-500" opacity="0.5" />
        <polygon points="8,40 36,36 40,40 36,44" className="fill-primary-300 dark:fill-primary-600" opacity="0.35" />
        <circle cx="40" cy="40" r="4" className="fill-primary-700 dark:fill-primary-300" />
    </svg>
);

/** Tide Wave — 3 bars rippling in sequence */
const TideWave = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        <rect x="14" y="28" width="10" height="24" rx="5" className="fill-primary-600 dark:fill-primary-400" style={{ animation: 'tide-bar 1.2s ease-in-out infinite', transformOrigin: 'center' }} />
        <rect x="35" y="28" width="10" height="24" rx="5" className="fill-primary-500 dark:fill-primary-300" style={{ animation: 'tide-bar 1.2s ease-in-out 0.15s infinite', transformOrigin: 'center' }} />
        <rect x="56" y="28" width="10" height="24" rx="5" className="fill-primary-400 dark:fill-primary-500" style={{ animation: 'tide-bar 1.2s ease-in-out 0.3s infinite', transformOrigin: 'center' }} />
    </svg>
);

const variants = [SonarPing, AnchorDrop, CompassRose, TideWave] as const;

export const AnchorLoadingSpinner: React.FC<AnchorLoadingSpinnerProps> = ({
    size = 'md',
    message,
}) => {
    const [Variant] = useState(
        () => variants[Math.floor(Math.random() * variants.length)]
    );
    const s = sizes[size];

    return (
        <div
            role="status"
            data-testid="loading-spinner"
            className="flex flex-col items-center justify-center gap-3"
        >
            <Variant s={s} />
            <span className="sr-only">Loading</span>
            {message && (
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium tracking-wide animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
};
