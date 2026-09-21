/**
 * Priority as a uniform dot cluster (UX-DS-01, UX-CM-09).
 *
 * `DESIGN_SYSTEM.md` says Lucide exclusively for functional states, and these
 * indicators used to be emoji (`🔴 High` / `🟡 Medium` / `🟢 Low`).
 *
 * They then became `ChevronsUp` / `Minus` / `ChevronsDown`, which read as
 * directional arrows next to a label and made the label sit off-centre inside a
 * chip (three different glyph widths). They are now three dots of a *fixed*
 * width, so every chip's text is centred identically, and the level is carried
 * by how many dots are lit — a signal that survives when colour does not.
 *
 * `tone="inherit"` uses the surrounding text colour, which is what a selected
 * chip needs: the old indicator kept its own amber on a blue chip, which was the
 * low-contrast pairing reported from iOS.
 */
import React from 'react';

export type PriorityLevel = 'high' | 'medium' | 'low';

const PRIORITY: Record<PriorityLevel, { dots: number; label: string; tone: string }> = {
    high: { dots: 3, label: 'High', tone: 'text-rose-500' },
    medium: { dots: 2, label: 'Medium', tone: 'text-amber-500' },
    low: { dots: 1, label: 'Low', tone: 'text-emerald-500' },
};

const MAX_DOTS = 3;

interface PriorityIndicatorProps {
    priority?: PriorityLevel | string | null;
    /** Icons alone are ambiguous in a list; labels are the default. */
    withLabel?: boolean;
    /** `inherit` follows the surrounding text colour (use inside a selected chip). */
    tone?: 'auto' | 'inherit';
    className?: string;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
    priority,
    withLabel = true,
    tone = 'auto',
    className = '',
}) => {
    if (!priority) return null;
    const entry = PRIORITY[priority as PriorityLevel];
    if (!entry) return null;

    const { dots, label } = entry;
    return (
        <span
            className={`inline-flex items-center gap-1.5 ${tone === 'inherit' ? 'text-current' : entry.tone} ${className}`}
            data-testid={`priority-${priority}`}
        >
            {/* Fixed width, so the label centres the same way for every level. */}
            <span className="inline-flex w-4 items-center justify-center gap-[2px]" aria-hidden="true">
                {Array.from({ length: MAX_DOTS }, (_, index) => (
                    <span
                        key={index}
                        className={`w-1 h-1 rounded-full bg-current ${index < dots ? '' : 'opacity-25'}`}
                    />
                ))}
            </span>
            {withLabel ? <span className="text-[10px] font-semibold">{label}</span> : <span className="sr-only">{label}</span>}
        </span>
    );
};