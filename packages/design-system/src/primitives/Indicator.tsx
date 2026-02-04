/**
 * Indicator - Semantic status dot primitive
 * 
 * Small colored dots for status indicators.
 * 
 * Usage:
 *   <Indicator status="success" />
 *   <Indicator status="danger" pulse />
 */
import React from 'react';

type IndicatorStatus =
    | 'default'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'primary'
    | 'offline';

type IndicatorSize = 'xs' | 'sm' | 'md' | 'lg';

interface IndicatorProps {
    status?: IndicatorStatus;
    size?: IndicatorSize;
    pulse?: boolean;
    className?: string;
}

const statusClasses: Record<IndicatorStatus, string> = {
    default: 'bg-muted dark:bg-muted-dark',
    success: 'bg-success dark:bg-success-dark',
    danger: 'bg-danger dark:bg-danger-dark',
    warning: 'bg-warning dark:bg-warning-dark',
    info: 'bg-info dark:bg-info-dark',
    primary: 'bg-primary-500 dark:bg-primary-400',
    offline: 'bg-muted dark:bg-muted-dark',
};

const sizeClasses: Record<IndicatorSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
};

export const Indicator: React.FC<IndicatorProps> = ({
    status = 'default',
    size = 'sm',
    pulse = false,
    className = '',
}) => {
    const classes = [
        'rounded-full shrink-0',
        statusClasses[status],
        sizeClasses[size],
        pulse && 'animate-pulse',
        className,
    ].filter(Boolean).join(' ');

    return <span className={classes} aria-hidden="true" />;
};

export default Indicator;
