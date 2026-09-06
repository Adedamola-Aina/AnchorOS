import { Brain, CalendarCheck2, ShieldCheck, Users, WalletCards } from 'lucide-react';

const signalCards = [
  { label: 'Net position', value: '+$4,280', tone: 'text-finance-600', icon: WalletCards },
  { label: 'Commitments', value: '6 aligned', tone: 'text-task-600', icon: CalendarCheck2 },
  { label: 'Family', value: '3 shared', tone: 'text-family-600', icon: Users },
];

export default function MarketingProductFrame() {
  return (
    <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/85 dark:shadow-black/30">
      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-small uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Life at a glance</p>
            <h2 className="mt-2 text-h3 lg:text-h3-lg text-slate-950 dark:text-white">Today is stable. Friday needs attention.</h2>
          </div>
          <div className="hidden min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:flex">
            <ShieldCheck className="h-4 w-4 text-primary-600" strokeWidth={2} />
            Private by default
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {signalCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <Icon className={`h-5 w-5 ${card.tone}`} strokeWidth={2} />
                <p className="mt-5 text-small text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className={`mt-1 text-2xl font-bold ${card.tone}`}>{card.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-small font-semibold text-slate-700 dark:text-slate-200">Cash flow</p>
              <span className="rounded-full bg-finance-50 px-3 py-1 text-small text-finance-700 dark:bg-finance-900/30 dark:text-finance-300">Gaining ground</span>
            </div>
            <div className="flex h-28 items-end gap-2">
              {[42, 68, 52, 76, 61, 88, 72, 94].map((height, index) => (
                <div key={height} className="flex flex-1 items-end rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={index > 4 ? 'w-full rounded-full bg-finance-500' : 'w-full rounded-full bg-primary-500'}
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
              You are gaining ground this week. Move Friday's payment before the weekend to keep the household buffer intact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
