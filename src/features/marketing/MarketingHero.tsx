import { ArrowRight, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnchorLogo } from '../../components/shared';
import MarketingProductFrame from './MarketingProductFrame';

export default function MarketingHero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex min-h-11 items-center gap-3 text-slate-950 dark:text-white" aria-label="AnchorOS home">
          <AnchorLogo className="h-8 w-8" strokeWidth={8} />
          <span className="text-lg font-bold tracking-tight">AnchorOS</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex" aria-label="Marketing">
          <a href="#finance" className="hover:text-slate-950 dark:hover:text-white">Finance</a>
          <a href="#commitments" className="hover:text-slate-950 dark:hover:text-white">Commitments</a>
          <a href="#family" className="hover:text-slate-950 dark:hover:text-white">Family</a>
          <a href="#ai" className="hover:text-slate-950 dark:hover:text-white">AnchorAI</a>
        </nav>
        <Link to="/login" className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
          Sign in
        </Link>
      </div>

      <div className="mx-auto max-w-5xl py-16 text-center sm:py-20 lg:py-24">
        <div className="mx-auto mb-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 text-small text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
          <LockKeyhole className="h-4 w-4" strokeWidth={2} />
          Private life infrastructure
        </div>
        <p className="mb-5 text-small font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">AnchorOS</p>
        <h1 className="text-display lg:text-display-lg mx-auto max-w-4xl text-balance text-slate-950 dark:text-white">
          A private operating system for the life you're building.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-body leading-8 text-slate-600 dark:text-slate-300">
          Bring your money, commitments, family coordination, and AI guidance into one calm place designed around trust and follow-through.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/login" className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-7 text-sm font-bold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 sm:w-auto">
            Start with AnchorOS
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
          <a href="#life-at-a-glance" className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-slate-200 bg-white px-7 text-sm font-bold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 sm:w-auto">
            See how it works
          </a>
        </div>
      </div>

      <MarketingProductFrame />
    </section>
  );
}
