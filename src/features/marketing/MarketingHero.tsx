import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarketingProductFrame from './MarketingProductFrame';
import MarketingReveal from './MarketingReveal';

const trustPoints = ['Private by default', 'No public feed', 'Shared life, scoped'] as const;

export default function MarketingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
      {/* Aurora light — soft, static, cheap on the GPU. Purely decorative. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-primary-400/25 blur-[120px] dark:bg-primary-600/25" />
        <div className="absolute -right-32 top-24 h-[26rem] w-[26rem] rounded-full bg-family-300/25 blur-[110px] dark:bg-family-600/20" />
        <div className="absolute -left-32 top-40 h-[24rem] w-[24rem] rounded-full bg-finance-300/25 blur-[110px] dark:bg-finance-600/20" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/70 to-transparent dark:via-white/10" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <MarketingReveal>
          <div className="mx-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-200 bg-white/70 px-4 text-small font-semibold text-primary-700 backdrop-blur dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300">
            <LockKeyhole className="h-4 w-4" strokeWidth={2} />
            Private life infrastructure
          </div>
        </MarketingReveal>

        <MarketingReveal delay={0.05}>
          <h1 className="mt-7 text-display lg:text-display-lg text-balance text-slate-950 dark:text-white">
            A private operating system for the life you're building.
          </h1>
        </MarketingReveal>

        <MarketingReveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-body leading-8 text-slate-600 dark:text-slate-300">
            Bring your money, commitments, family coordination, and AI guidance into one calm place
            designed around trust and follow-through.
          </p>
        </MarketingReveal>

        <MarketingReveal delay={0.15}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-7 text-sm font-bold text-white shadow-lg shadow-primary-600/25 transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 sm:w-auto"
            >
              Start with AnchorOS
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
            <a
              href="#life-at-a-glance"
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-7 text-sm font-bold text-slate-900 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:w-auto"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              See how it works
            </a>
          </div>
        </MarketingReveal>

        <MarketingReveal delay={0.2}>
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-small text-slate-500 dark:text-slate-400">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-finance-500" />
                {point}
              </li>
            ))}
          </ul>
        </MarketingReveal>
      </div>

      <MarketingReveal delay={0.1} y={40} className="mt-16 lg:mt-20">
        <MarketingProductFrame />
      </MarketingReveal>
    </section>
  );
}
