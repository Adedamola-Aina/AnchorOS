import React, { useState } from 'react';

export type LoadingVariant = 'anchor' | 'compass' | 'helm' | 'radar';

interface LoadingScreenProps {
    /** Force a specific variant for testing or consistency */
    variant?: LoadingVariant;
    /** Custom text to display below the spinner */
    text?: string;
    /** Size of the spinner (default: md) */
    size?: 'sm' | 'md' | 'lg';
    /** Full screen overlay mode */
    fullScreen?: boolean;
}

const sizes = { sm: 40, md: 56, lg: 72 } as const;

/** Anchor: Gentle bobbing motion */
const Anchor = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none" style={{ animation: 'anchor-bob 2.4s ease-in-out infinite' }}>
        <circle cx="40" cy="20" r="7" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" />
        <line x1="40" y1="27" x2="40" y2="62" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 45 C18 65 62 65 62 45" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" fill="none" />
        <line x1="18" y1="45" x2="18" y2="38" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" />
        <line x1="62" y1="45" x2="62" y2="38" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

/** Compass: Needle spinning and settling */
const Compass = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Outer Ring */}
        <circle cx="40" cy="40" r="36" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" />
        <path d="M40 4 L40 8 M40 72 L40 76 M4 40 L8 40 M72 40 L76 40" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />

        {/* Spinning Needle */}
        <g style={{ transformOrigin: 'center', animation: 'compass-spin 3s ease-in-out infinite alternate' }}>
            <polygon points="40,15 45,40 35,40" className="fill-red-500" />
            <polygon points="40,65 45,40 35,40" className="fill-slate-400 dark:fill-slate-500" />
            <circle cx="40" cy="40" r="2" className="fill-white" />
        </g>
    </svg>
);

/** Helm: Ship's wheel rotating */
const Helm = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none" style={{ animation: 'spin-slow 4s linear infinite' }}>
        {/* Outer Wheel */}
        <circle cx="40" cy="40" r="25" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="4" />
        {/* Hub */}
        <circle cx="40" cy="40" r="6" className="fill-primary-600 dark:fill-primary-400" />
        {/* Spokes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <g key={deg} style={{ transformOrigin: 'center', transform: `rotate(${deg}deg)` }}>
                <line x1="40" y1="15" x2="40" y2="65" className="stroke-primary-600 dark:stroke-primary-400" strokeWidth="3" />
                <rect x="38" y="8" width="4" height="6" rx="1" className="fill-primary-600 dark:fill-primary-400" />
            </g>
        ))}
    </svg>
);

/** Radar: Sweeping scan line */
const Radar = ({ s }: { s: number }) => (
    <svg width={s} height={s} viewBox="0 0 80 80" fill="none">
        {/* Grid Circles */}
        <circle cx="40" cy="40" r="35" className="stroke-emerald-500/30" strokeWidth="1" />
        <circle cx="40" cy="40" r="20" className="stroke-emerald-500/30" strokeWidth="1" />
        <circle cx="40" cy="40" r="4" className="fill-emerald-500/50" />

        {/* Crosshairs */}
        <line x1="40" y1="5" x2="40" y2="75" className="stroke-emerald-500/20" strokeWidth="1" />
        <line x1="5" y1="40" x2="75" y2="40" className="stroke-emerald-500/20" strokeWidth="1" />

        {/* Blips */}
        <circle cx="55" cy="25" r="2" className="fill-emerald-400" style={{ animation: 'pulse-fast 2s infinite' }} />
        <circle cx="25" cy="55" r="2" className="fill-emerald-400" style={{ animation: 'pulse-fast 2s infinite 1s' }} />

        {/* Sweep */}
        <path d="M40 40 L40 5 A35 35 0 0 1 75 40 Z" className="fill-emerald-500/20" style={{ transformOrigin: 'center', animation: 'spin 2s linear infinite' }} />
    </svg>
);

const variants = {
    anchor: Anchor,
    compass: Compass,
    helm: Helm,
    radar: Radar,
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    variant,
    text,
    size = 'md',
    fullScreen = false,
}) => {
    // Randomly select variant on mount if not provided
    // Randomly select variant on mount if not provided
    const [randomVariant] = useState<LoadingVariant>(() => {
        const keys = Object.keys(variants) as LoadingVariant[];
        return keys[Math.floor(Math.random() * keys.length)];
    });

    const activeVariant = variant || randomVariant;

    const SelectedIcon = variants[activeVariant];
    const s = sizes[size];

    const Content = (
        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
            <SelectedIcon s={s} />
            {text && (
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {Content}
            </div>
        );
    }

    return Content;
};
