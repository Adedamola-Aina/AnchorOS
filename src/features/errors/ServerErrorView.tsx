import { AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServerErrorView() {
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">Error 500</p>
        <h1 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white mb-3">Something went wrong</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          We hit an unexpected issue while loading this page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-5 h-5" />
            Reload
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
