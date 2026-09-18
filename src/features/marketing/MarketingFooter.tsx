import { Link } from 'react-router-dom';
import { AnchorLogo } from '../../components/shared';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Finance', href: '#finance' },
      { label: 'Commitments', href: '#commitments' },
      { label: 'Family', href: '#family' },
      { label: 'AnchorAI', href: '#ai' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { label: 'Sign in', href: '/login' },
      { label: 'Start with AnchorOS', href: '/login' },
      { label: 'Open dashboard', href: '/dashboard' },
    ],
  },
];

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 pb-12 pt-14 dark:border-white/10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-600 text-white">
                <AnchorLogo className="h-5 w-5" strokeWidth={9} />
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">AnchorOS</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-300">
              A private operating system for the life you&rsquo;re building. Money, commitments, family, and
              guidance — held together by trust.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-small font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) =>
                  link.href.startsWith('#') ? (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm font-semibold text-slate-700 transition-colors hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-300">
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm font-semibold text-slate-700 transition-colors hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-300">
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-small text-slate-500 dark:border-white/10 dark:text-slate-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} AnchorOS. Private by default.</p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-finance-500" />
            Built for intentionality
          </p>
        </div>
      </div>
    </footer>
  );
}