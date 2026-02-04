/**
 * Stack - Semantic layout primitive for spacing
 * 
 * Replaces raw gap-* and flex/grid Tailwind classes with semantic spacing.
 * Provides consistent vertical and horizontal stacking.
 * 
 * Usage:
 *   <Stack>Vertical items with default gap</Stack>
 *   <Stack direction="horizontal">Horizontal row</Stack>
 *   <Stack gap="lg">Larger spacing</Stack>
 */
import React from 'react';

type StackDirection = 'vertical' | 'horizontal';
type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface StackProps {
    children: React.ReactNode;
    direction?: StackDirection;
    gap?: StackGap;
    align?: StackAlign;
    justify?: StackJustify;
    wrap?: boolean;
    as?: 'div' | 'section' | 'article' | 'ul' | 'ol' | 'nav';
    className?: string;
    fullWidth?: boolean;
    fullHeight?: boolean;
}

const gapClasses: Record<StackGap, string> = {
    none: 'gap-0',
    xs: 'gap-1',    // 4px
    sm: 'gap-2',    // 8px
    md: 'gap-4',    // 16px
    lg: 'gap-6',    // 24px
    xl: 'gap-8',    // 32px
    '2xl': 'gap-12', // 48px
};

const alignClasses: Record<StackAlign, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
};

const justifyClasses: Record<StackJustify, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
};

export const Stack: React.FC<StackProps> = ({
    children,
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    as: Component = 'div',
    className = '',
    fullWidth = false,
    fullHeight = false,
}) => {
    const classes = [
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        fullWidth && 'w-full',
        fullHeight && 'h-full',
        className,
    ].filter(Boolean).join(' ');

    return <Component className={classes}>{children}</Component>;
};

// Convenience components
export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
    <Stack {...props} direction="horizontal" />
);

export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
    <Stack {...props} direction="vertical" />
);

export default Stack;
