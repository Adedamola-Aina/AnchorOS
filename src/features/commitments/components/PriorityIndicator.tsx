/**
 * Priority as a Lucide icon (UX-DS-01, UX-CM-09).
 *
 * `DESIGN_SYSTEM.md` says Lucide exclusively for functional states, and these
 * indicators used to be emoji (`🔴 High` / `🟡 Medium` / `🟢 Low`) in four
 * different files. The shapes differ per level on purpose: colour is never the
 * only signal, so priority must still read when the colour does not.
 *
 * Extracted so the four call sites cannot drift apart again.
 */
import React from 'react';
import { ChevronsUp, Minus, ChevronsDown, type LucideIcon } from 'lucide-react';

export type PriorityLevel = 'high' | 'medium' | 'low';

const PRIORITY: Record<PriorityLevel, { Icon: LucideIcon; label: string; tone: string }> = {
    high: { Icon: ChevronsUp, label: 'High', tone: 'text-rose-500' },
    medium: { Icon: Minus, label: 'Medium', tone: 'text-amber-500' },
    low: { Icon: ChevronsDown, label: 'Low', tone: 'text-emerald-500' },
};

interface PriorityIndicatorProps {
    priority?: PriorityLevel | string | null;
    /** Icons alone are ambiguous in a list; labels are the default. */
    withLabel?: boolean;
    className?: string;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({
    priority,
    withLabel = true,
    className = '',
}) => {
    if (!priority) return null;
    const entry = PRIORITY[priority as PriorityLevel];
    if (!entry) return null;

    const { Icon, label, tone } = entry;
    return (
        <span className={`inline-flex items-center gap-1 ${tone} ${className}`} data-testid={`priority-${priority}`}>
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {withLabel ? <span className="text-[10px] font-semibold">{label}</span> : <span className="sr-only">{label}</span>}
        </span>
    );
};