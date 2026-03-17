import React from 'react';
import { Skeleton, SkeletonCard, SkeletonListItem } from './Skeleton';

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-4 p-4 animate-in fade-in duration-300">
    {/* Greeting */}
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-2">
        <Skeleton variant="text" className="w-48 h-5" />
        <Skeleton variant="text" className="w-24 h-3" />
      </div>
      <Skeleton variant="circular" className="w-12 h-12" />
    </div>

    {/* Portfolio widget */}
    <SkeletonCard className="h-32" />

    {/* Grid widgets */}
    <div className="grid grid-cols-2 gap-4">
      <SkeletonCard />
      <SkeletonCard />
    </div>

    {/* Activity list */}
    <div className="space-y-1">
      <Skeleton variant="text" className="w-32 h-4 mb-3" />
      <SkeletonListItem />
      <SkeletonListItem />
      <SkeletonListItem />
    </div>
  </div>
);

export const SkeletonFinance: React.FC = () => (
  <div className="space-y-4 p-4 animate-in fade-in duration-300">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-24 h-6" />
      <Skeleton variant="rounded" className="w-20 h-8" />
    </div>

    {/* Account cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SkeletonCard className="h-40" />
      <SkeletonCard className="h-40" />
      <SkeletonCard className="h-40" />
    </div>

    {/* Transaction list */}
    <div className="space-y-2 mt-6">
      <Skeleton variant="text" className="w-28 h-4" />
      {[1, 2, 3, 4, 5].map(i => (
        <SkeletonListItem key={i} hasAvatar />
      ))}
    </div>
  </div>
);

export const SkeletonCommitments: React.FC = () => (
  <div className="space-y-4 p-4 animate-in fade-in duration-300">
    {/* Header with add button */}
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-32 h-6" />
      <Skeleton variant="rounded" className="w-10 h-10" />
    </div>

    {/* Filter bar */}
    <div className="flex gap-2">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} variant="rounded" className="w-16 h-8" />
      ))}
    </div>

    {/* Task list */}
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <Skeleton variant="circular" className="w-6 h-6" />
          <div className="flex-1 space-y-1">
            <Skeleton variant="text" className="w-3/4 h-4" />
            <Skeleton variant="text" className="w-1/3 h-3" />
          </div>
          <Skeleton variant="rounded" className="w-16 h-6" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonSettings: React.FC = () => (
  <div className="space-y-6 p-4 animate-in fade-in duration-300">
    {/* Profile section */}
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" className="w-16 h-16" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-32 h-5" />
        <Skeleton variant="text" className="w-48 h-4" />
      </div>
    </div>

    {/* Settings sections */}
    {[1, 2, 3].map(section => (
      <div key={section} className="space-y-3">
        <Skeleton variant="text" className="w-24 h-4" />
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
          {[1, 2, 3].map(item => (
            <div key={item} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="rounded" className="w-8 h-8" />
                <Skeleton variant="text" className="w-32 h-4" />
              </div>
              <Skeleton variant="rounded" className="w-12 h-6" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
