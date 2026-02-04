/**
 * Primitives - Anchor OS Design System
 * 
 * Core primitive components for consistent UI.
 * 
 * Usage:
 *   import { Text, Surface, Stack, Badge, Card } from '@anchor-os/design-system/primitives';
 */

// Typography
export { Text } from './Text';

// Layout
export { Surface } from './Surface';
export { Stack, HStack, VStack } from './Stack';
export { Card } from './Card';

// Indicators
export { Badge } from './Badge';
export { Indicator } from './Indicator';
export { Divider } from './Divider';

// Loading States
export { Skeleton } from './Skeleton';

// Re-export types
export type { default as TextProps } from './Text';
export type { default as SurfaceProps } from './Surface';
export type { default as StackProps } from './Stack';
export type { default as BadgeProps } from './Badge';
export type { default as CardProps } from './Card';
export type { default as DividerProps } from './Divider';
export type { default as IndicatorProps } from './Indicator';
export type { default as SkeletonProps } from './Skeleton';
