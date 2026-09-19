import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@anchor-os/ui';

/**
 * The single empty-state pattern (UX-DS-07, doc 24 §5).
 *
 * Why this exists: we had at least six bespoke empty states and two of them were
 * dead ends (an empty month that looked like "no data", a dashboard card whose
 * sentence described an action with no control). Apple's award write-ups praise
 * apps that have "nothing extraneous" and answer the user immediately, and the
 * aesthetic-usability research is explicit that beauty does not excuse a dead end.
 *
 * The contract every empty state must satisfy:
 *   1. say what this is,
 *   2. say why it is empty,
 *   3. offer the action the sentence names.
 *
 * `action` is therefore not optional in spirit: if there is something the user
 * could do, pass it. If genuinely nothing can be done, omit it and keep the copy
 * honest ("Nothing due today") rather than promising a control that isn't there.
 */
export interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    /** The action the copy names. One primary action, per doc 24 §6. */
    action?: { label: string; onClick: () => void };
    /** Optional quieter route (e.g. "Learn more"). Never a second primary. */
    secondaryAction?: { label: string; onClick: () => void };
    className?: string;
    testId?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action,
    secondaryAction,
    className = '',
    testId = 'empty-state',
}) => (
    <div
        className={`flex flex-col items-center justify-center gap-3 px-6 py-10 text-center ${className}`}
        data-testid={testId}
    >
        <Icon className="w-8 h-8 text-text-muted" aria-hidden="true" />
        <div className="space-y-1">
            <p className="text-base font-semibold text-text-primary">{title}</p>
            {description && <p className="text-sm text-text-secondary">{description}</p>}
        </div>
        {action && (
            <Button variant="primary" onClick={action.onClick} className="mt-1">
                {action.label}
            </Button>
        )}
        {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
            </Button>
        )}
    </div>
);
