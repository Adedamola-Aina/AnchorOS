/**
 * EmptyState - Generic empty state component for consistent UX
 * 
 * Used when a list/section has no data. Provides:
 * - Illustrated visual cue
 * - Clear messaging
 * - Optional call-to-action
 * 
 * Mobile-first design for 75% mobile users.
 * 
 * @module components/shared/EmptyState
 */
// @ts-nocheck


import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@anchor-os/ui';
import { StateIllustration, type IllustrationKind } from '../illustrations';
import { 
  Inbox, 
  Target, 
  Wallet, 
  Bell, 
  Users, 
  Calendar,
  Search,
  FileText
} from 'lucide-react';

// Preset empty state configurations for common scenarios
export type EmptyStatePreset = 
  | 'no-data' 
  | 'no-tasks' 
  | 'no-transactions' 
  | 'no-notifications'
  | 'no-family'
  | 'no-events'
  | 'no-search-results'
  | 'no-documents';

interface EmptyStateProps {
  /** Preset configuration (optional, overrides icon/title/message) */
  preset?: EmptyStatePreset;
  /** Custom icon component */
  icon?: LucideIcon;
  /** Main heading text */
  title?: string;
  /** Description text */
  message?: string;
  /** CTA button text */
  actionLabel?: string;
  /** CTA button click handler */
  onAction?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Icon accent color (Tailwind class) */
  accentColor?: string;
  /** Optional custom illustration variant */
  illustration?: IllustrationKind;
}

const presets: Record<EmptyStatePreset, {
  icon: LucideIcon;
  title: string;
  message: string;
  accent: string;
}> = {
  'no-data': {
    icon: Inbox,
    title: 'No data yet',
    message: 'There\'s nothing here right now. Add some data to get started.',
    accent: 'text-slate-400 dark:text-slate-500',
  },
  'no-tasks': {
    icon: Target,
    title: 'No commitments',
    message: 'You haven\'t created any commitments yet. Add your first one to start tracking.',
    accent: 'text-amber-500 dark:text-amber-400',
  },
  'no-transactions': {
    icon: Wallet,
    title: 'No transactions',
    message: 'No transactions recorded for this account yet.',
    accent: 'text-emerald-500 dark:text-emerald-400',
  },
  'no-notifications': {
    icon: Bell,
    title: 'All caught up',
    message: 'You have no new notifications.',
    accent: 'text-blue-500 dark:text-blue-400',
  },
  'no-family': {
    icon: Users,
    title: 'No family connection',
    message: 'Connect with a family member to share finances and commitments.',
    accent: 'text-purple-500 dark:text-purple-400',
  },
  'no-events': {
    icon: Calendar,
    title: 'No events',
    message: 'No events scheduled for this period.',
    accent: 'text-sky-500 dark:text-sky-400',
  },
  'no-search-results': {
    icon: Search,
    title: 'No results found',
    message: 'Try adjusting your search or filters.',
    accent: 'text-slate-400 dark:text-slate-500',
  },
  'no-documents': {
    icon: FileText,
    title: 'No documents',
    message: 'No documents have been added yet.',
    accent: 'text-slate-400 dark:text-slate-500',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  preset,
  icon: CustomIcon,
  title: customTitle,
  message: customMessage,
  actionLabel,
  onAction,
  className = '',
  accentColor,
  illustration,
}) => {
  // Use preset if provided, allow overrides
  const presetConfig = preset ? presets[preset] : null;
  const Icon = CustomIcon || presetConfig?.icon || Inbox;
  const title = customTitle || presetConfig?.title || 'Nothing here';
  const message = customMessage || presetConfig?.message || '';
  const accent = accentColor || presetConfig?.accent || 'text-slate-400';

  const illustrationKind = illustration || (preset === 'no-search-results' ? 'not-found' : 'empty');

  return (
    <div 
      className={`flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in-95 duration-500 ${className}`}
      role="status"
      aria-label={title}
    >
      {/* Illustration + icon */}
      <div className="relative mb-5">
        <StateIllustration kind={illustrationKind} className="w-36 h-24 opacity-90" testId="empty-state-illustration" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white/85 dark:bg-slate-900/85 rounded-full flex items-center justify-center shadow-sm">
            <Icon className={`w-7 h-7 ${accent} opacity-90`} strokeWidth={1.7} />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
        {title}
      </h3>

      {/* Message */}
      {message && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">
          {message}
        </p>
      )}

      {/* CTA Button */}
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          onClick={onAction}
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
