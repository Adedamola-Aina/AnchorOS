import React from 'react';

export const FabricOnboarding: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hey! I&apos;m Anchor AI.</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        I&apos;m still learning about your patterns and preferences. The more you use Anchor,
        the better I get at helping with timing, spending, and priorities.
      </p>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400">Right now I can help with</p>
        <ul className="text-sm text-slate-700 dark:text-slate-200 space-y-1">
          <li>Quick transaction guidance from your recent history</li>
          <li>Commitment timing patterns I can infer today</li>
          <li>Simple monthly spending summaries</li>
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400">As I learn more, I&apos;ll add</p>
        <ul className="text-sm text-slate-700 dark:text-slate-200 space-y-1">
          <li>Personalized expense and streak risk alerts</li>
          <li>Weekly summaries that reflect your real habits</li>
          <li>Cross-feature insights across commitments and finance</li>
        </ul>
      </div>
    </div>
  );
};
