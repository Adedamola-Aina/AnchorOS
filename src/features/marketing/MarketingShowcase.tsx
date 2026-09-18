import { BarChart3, CheckCircle2, Layers, ShieldCheck, Users, WalletCards } from 'lucide-react';
import MarketingReveal from './MarketingReveal';

const features = [
  {
    id: 'product-finance',
    eyebrow: 'Finance',
    title: 'See your whole position, not a spreadsheet.',
    copy: 'Accounts, flow, and pressure points resolve into one clear financial position — so decisions stop depending on how recently you opened a tab.',
    icon: WalletCards,
    tone: 'text-finance-600 dark:text-finance-400',
    accent: 'from-finance-500/20',
    points: ['One net position', 'Cash-flow pressure, surfaced early', 'No budgeting theatre'],
  },
  {
    id: 'product-commitments',
    eyebrow: 'Commitments',
    title: 'Follow-through without the manipulation.',
    copy: 'Daily, weekly, and monthly commitments stay visible without celebratory loops or shame-driven streaks. Progress is reflected, never weaponised.',
    icon: CheckCircle2,
    tone: 'text-task-600 dark:text-task-400',
    accent: 'from-task-500/20',
    points: ['Calm daily view', 'Weekly and monthly rhythm', 'Meaning over metrics'],
  },
  {
    id: 'product-family',
    eyebrow: 'Family',
    title: 'Shared life, with boundaries that hold.',
    copy: 'Coordinate household context while keeping personal information personal. Every shared surface is explicit, scoped, and permission-aware.',
    icon: Users,
    tone: 'text-family-600 dark:text-family-400',
    accent: 'from-family-500/20',
    points: ['Explicit sharing', 'Scoped access', 'Personal stays personal'],
  },
];

function FinancePanel() {
  return (
    <div aria-hidden className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
        <p className="text-small text-slate-500 dark:text-slate-400">Household net position</p>
        <p className="mt-1 text-3xl font-extrabold text-finance-600 dark:text-finance-400">+$4,280</p>
        <div className="mt-5 flex h-16 items-end gap-1.5">
          {[38, 54, 44, 62, 50, 72, 58, 82, 70, 92].map((h, i) => (
            <div key={`${h}-${i}`} className="flex-1 rounded-full bg-gradient-to-t from-finance-500/40 to-finance-500" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" strokeWidth={2} />
          <p className="mt-3 text-small text-slate-500 dark:text-slate-400">Buffer</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">6 weeks</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <Layers className="h-5 w-5 text-family-600 dark:text-family-400" strokeWidth={2} />
          <p className="mt-3 text-small text-slate-500 dark:text-slate-400">Account groups</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">Personal + Joint</p>
        </div>
      </div>
    </div>
  );
}

function CommitmentsPanel() {
  const items = [
    { label: 'Move Friday payment', meta: 'Today', done: false },
    { label: 'Weekly review', meta: 'Sun', done: true },
    { label: 'Set aside savings', meta: 'Monthly', done: false },
  ];
  return (
    <div aria-hidden className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
      <p className="text-small text-slate-500 dark:text-slate-400">Today</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950">
            <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${item.done ? 'border-task-500 bg-task-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
              {item.done ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} /> : null}
            </span>
            <span className={`flex-1 text-sm font-semibold ${item.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
              {item.label}
            </span>
            <span className="text-small text-slate-400 dark:text-slate-500">{item.meta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FamilyPanel() {
  const members = [
    { name: 'You', scope: 'Owner', tone: 'bg-primary-500' },
    { name: 'Partner', scope: 'Joint account', tone: 'bg-family-500' },
    { name: 'Household', scope: 'Shared view', tone: 'bg-finance-500' },
  ];
  return (
    <div aria-hidden className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-small text-slate-500 dark:text-slate-400">Shared with</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-small font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
          <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
          Scoped
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {members.map((member) => (
          <li key={member.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950">
            <span className={`h-8 w-8 rounded-full ${member.tone}`} />
            <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{member.name}</span>
            <span className="text-small text-slate-400 dark:text-slate-500">{member.scope}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const panels = [FinancePanel, CommitmentsPanel, FamilyPanel];

export default function MarketingShowcase() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-20 lg:space-y-28">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const Panel = panels[index];
          const flip = index % 2 === 1;
          return (
            <div key={feature.id} id={feature.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <MarketingReveal className={flip ? 'lg:order-2' : undefined}>
                <div className={`mb-7 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} to-transparent`}>
                  <Icon className={`h-6 w-6 ${feature.tone}`} strokeWidth={2} />
                </div>
                <p className="text-small font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{feature.eyebrow}</p>
                <h2 className="mt-4 text-h1 lg:text-h1-lg tracking-tight text-balance text-slate-950 dark:text-white">{feature.title}</h2>
                <p className="mt-5 text-body leading-8 text-slate-600 dark:text-slate-300">{feature.copy}</p>
                <ul className="mt-7 space-y-3">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <CheckCircle2 className={`h-4 w-4 ${feature.tone}`} strokeWidth={2.5} />
                      {point}
                    </li>
                  ))}
                </ul>
              </MarketingReveal>

              <MarketingReveal delay={0.1} className={flip ? 'lg:order-1' : undefined}>
                <div className="relative">
                  <div aria-hidden className={`absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br ${feature.accent} to-transparent blur-2xl`} />
                  <Panel />
                </div>
              </MarketingReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
