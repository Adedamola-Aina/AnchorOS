/**
 * Skeleton - Semantic loading placeholder primitive
 * 
 * Replaces inline loading state styling with consistent skeletons.
 * 
 * Usage:
 *   <Skeleton width={200} height={20} />
 *   <Skeleton variant="circle" size={40} />
 *   <Skeleton variant="text" lines={3} />
 */
import React from 'react';

type SkeletonVariant = 'rect' | 'circle' | 'text';

interface SkeletonProps {
    variant?: SkeletonVariant;
    width?: number | string;
    height?: number | string;
    size?: number; // For circle variant
    lines?: number; // For text variant
    className?: string;
    animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rect',
    width,
    height,
    size,
    lines = 1,
    className = '',
    animate = true,
}) => {
    const baseClasses = [
        'bg-surface-3 dark:bg-surface-3-dark',
        animate && 'animate-pulse',
    ].filter(Boolean).join(' ');

    if (variant === 'circle') {
        const dimension = size || 40;
        return (
            <div
                className={`${baseClasses} rounded-full ${className}`}
                style={{ width: dimension, height: dimension }}
            />
        );
    }

    if (variant === 'text') {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`${baseClasses} rounded h-4`}
                        style={{
                            width: i === lines - 1 && lines > 1 ? '75%' : '100%',
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} rounded ${className}`}
            style={{
                width: width || '100%',
                height: height || 20,
            }}
        />
    );
};

export default Skeleton;
