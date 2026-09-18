import { Brain, CalendarCheck2, EyeOff, Home, ShieldCheck, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingReveal from './MarketingReveal';

const pillars = [
  {
    id: 'finance',
    title: 'Finance',
    kicker: 'Money without the noise',
    copy: 'Know where you stand without turning your life into a spreadsheet. AnchorOS turns accounts, flow, and pressure points into one clear financial position.',
    icon: WalletCards,
    tone: 'text-finance-600 bg-finance-50 dark:bg-finance-900/30 dark:text-finance-300',
  },
  {
    id: 'commitments',
    title: 'Commitments',
    kicker: 'Follow-through without manipulation',
    copy: 'Track what you said matters. Daily, weekly, and monthly commitments stay visible without celebratory loops or shame-driven streak mechanics.',
    icon: CalendarCheck2,
    tone: 'text-task-600 bg-task-50 dark:bg-task-900/30 dark:text-task-300',
  },
  {
    id: 'family',
    title: 'Family',
    kicker: 'Shared life, clear boundaries',
    copy: 'Coordinate household context while keeping personal information personal. Shared accounts and family signals stay explicit, scoped, and permission-aware.',
    icon: Home,
    tone: 'text-family-600 bg-family-50 dark:bg-family-900/30 dark:text-family-300',
  },
  {
    id: 'ai',
    title: 'AnchorAI',
    kicker: 'Guidance, not chatbot theater',
    copy: 'AnchorAI reads the shape of your life inside the product and surfaces the next useful action without turning private context into public content.',
    icon: Brain,
    tone: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-300',
  },
];

export function MarketingPillars() {
  return (
    <section id="life-at-a-glance" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MarketingReveal className="max-w-3xl">
          <p className="text-small font-bold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300">Life at a glance</p>
          <h2 className="mt-4 text-h1 lg:text-h1-lg tracking-tight text-balance text-slate-950 dark:text-white">
            One calm surface for the signals that usually scatter across your life.
          </h2>
          <p className="mt-5 text-body leading-8 text-slate-600 dark:text-slate-300">
            AnchorOS gives finance, commitments, family, and AI their own language while making them work as one private system.
          </p>
        </MarketingReveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <MarketingReveal key={pillar.id} delay={index * 0.06}>
                <article
                  id={pillar.id}
                  className="group h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-white/10 dark:bg-slate-900 dark:hover:border-white/20"
                >
                  <div className={`mb-8 flex h-12 w-12 items-center justify-center rounded-2xl ${pillar.tone} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <p className="text-small font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{pillar.kicker}</p>
                  <h3 className="mt-3 text-h3 lg:text-h3-lg text-slate-950 dark:text-white">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{pillar.copy}</p>
                </article>
              </MarketingReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function MarketingPrivacy() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <MarketingReveal>
        <div className="relative mx-auto grid max-w-7xl gap-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/25 dark:border-white/10 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:p-14">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-600/25 blur-[100px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-finance-600/20 blur-[100px]" />
          <div className="relative">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <EyeOff className="h-6 w-6 text-primary-300" strokeWidth={2} />
            </div>
            <p className="text-small font-bold uppercase tracking-[0.22em] text-primary-300">Privacy posture</p>
            <h2 className="mt-4 text-h1 lg:text-h1-lg tracking-tight text-balance">Your life data is not content.</h2>
          </div>
          <div className="relative space-y-5 text-body leading-8 text-slate-300">
            <p>
              It is not an ad signal, a social feed, or training material for someone else&rsquo;s product story.
              AnchorOS treats life context as private infrastructure.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Explicit boundaries', 'Scoped sharing', 'No public exposure', 'Meaning over metrics'].map((item) => (
                <div key={item} className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-finance-400" strokeWidth={2} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </MarketingReveal>
    </section>
  );
}

export function MarketingFinalCta() {
  return (
    <section className="px-4 pb-24 pt-10 text-center sm:px-6 lg:px-8">
      <MarketingReveal className="mx-auto max-w-3xl">
        <p className="text-small font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">AnchorOS</p>
        <h2 className="mt-4 text-display lg:text-display-lg tracking-tight text-balance text-slate-950 dark:text-white">
          Build a life you can see clearly.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-body leading-8 text-slate-600 dark:text-slate-300">
          Start with a calm system for the things that keep coming back: money, promises, people, and the next
          right action.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-primary-600 px-7 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:-translate-y-0.5 hover:bg-primary-700 sm:w-auto"
          >
            Start with AnchorOS
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto"
          >
            Enter app
          </Link>
        </div>
      </MarketingReveal>
    </section>
  );
}
