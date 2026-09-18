import { Brain, CalendarCheck2, ShieldCheck, TrendingUp, Users, WalletCards } from 'lucide-react';

const signalCards = [
  { label: 'Net position', value: '+$4,280', tone: 'text-finance-600 dark:text-finance-400', icon: WalletCards },
  { label: 'Commitments', value: '6 aligned', tone: 'text-task-600 dark:text-task-400', icon: CalendarCheck2 },
  { label: 'Family', value: '3 shared', tone: 'text-family-600 dark:text-family-400', icon: Users },
];

const bars = [42, 68, 52, 76, 61, 88, 72, 94];

/**
 * Decorative product preview. Marked aria-hidden because every string here is
 * illustrative, not a real account — screen readers get the surrounding copy.
 */
export default function MarketingProductFrame() {
  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-2.5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/40"
    >
      <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/30" />
      <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950 sm:p-6">
        {/* Window chrome */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-family-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-task-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-finance-400" />
          </div>
          <div className="ml-1 hidden min-h-8 flex-1 items-center rounded-lg border border-slate-200 bg-white px-3 text-small text-slate-400 dark:border-white/10 dark:bg-slate-900 sm:flex">
            anchoros.app / dashboard
          </div>
          <div className="ml-auto hidden min-h-8 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-small font-semibold text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
            Private by default
          </div>
        </div>

        <div className="mb-6">
          <p className="text-small uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Life at a glance</p>
          <h2 className="mt-2 text-h3 lg:text-h3-lg text-slate-950 dark:text-white">
            Today is stable. Friday needs attention.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {signalCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
                <Icon className={`h-5 w-5 ${card.tone}`} strokeWidth={2} />
                <p className="mt-4 text-small text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className={`mt-1 text-2xl font-bold ${card.tone}`}>{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-small font-semibold text-slate-700 dark:text-slate-200">Cash flow</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-finance-50 px-3 py-1 text-small font-semibold text-finance-700 dark:bg-finance-900/30 dark:text-finance-300">
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                Gaining ground
              </span>
            </div>
            <div className="flex h-28 items-end gap-2">
              {bars.map((height, index) => (
                <div key={`${height}-${index}`} className="flex flex-1 items-end rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={index > 4 ? 'w-full rounded-full bg-finance-500' : 'w-full rounded-full bg-primary-500'}
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                <Brain className="h-5 w-5" strokeWidth={2} />
              </div>
              <div>
                <p className="text-small text-slate-500 dark:text-slate-400">AnchorAI</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Next useful action</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              You&rsquo;re gaining ground this week. Move Friday&rsquo;s payment before the weekend to keep the
              household buffer intact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
