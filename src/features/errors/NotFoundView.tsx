// @ts-nocheck
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { StateIllustration } from '../../components/illustrations';

export default function NotFoundView() {
  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-2 flex justify-center">
          <StateIllustration kind="not-found" className="w-44 h-28" testId="not-found-illustration" />
        </div>
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Error 404</p>
        <h1 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white mb-3">Page not found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform"
        >
          <Home className="w-5 h-5" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
