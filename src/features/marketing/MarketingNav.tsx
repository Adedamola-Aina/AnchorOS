import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AnchorLogo } from '../../components/shared';

const navLinks = [
  { href: '#finance', label: 'Finance' },
  { href: '#commitments', label: 'Commitments' },
  { href: '#family', label: 'Family' },
  { href: '#ai', label: 'AnchorAI' },
];

export default function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-h-11 items-center gap-3" aria-label="AnchorOS home">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-sm shadow-primary-600/30">
            <AnchorLogo className="h-5 w-5" strokeWidth={9} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">AnchorOS</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex" aria-label="Marketing">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md transition-colors hover:text-slate-950 focus-visible:text-slate-950 dark:hover:text-white dark:focus-visible:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:inline-flex"
          >
            Get started
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}