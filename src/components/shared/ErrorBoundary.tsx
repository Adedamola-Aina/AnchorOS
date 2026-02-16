// @ts-nocheck

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center">
                    <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full mb-6">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white mb-2">Something went wrong</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                        We encountered an unexpected error. Please try reloading the application.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Reload Application
                        </button>
                        <button
                            onClick={async () => {
                                if (window.confirm('This will clear all local data and sign you out. Are you sure?')) {
                                    // Clear everything
                                    localStorage.clear();
                                    sessionStorage.clear();

                                    // Clear IndexedDB databases
                                    if (window.indexedDB && window.indexedDB.databases) {
                                        const dbs = await window.indexedDB.databases();
                                        dbs.forEach(db => {
                                            if (db.name) window.indexedDB.deleteDatabase(db.name);
                                        });
                                    }

                                    window.location.href = '/dashboard';
                                }
                            }}
                            className="flex items-center gap-2 px-6 py-3 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        >
                            <AlertCircle className="w-5 h-5" />
                            Reset App Data
                        </button>
                    </div>
                    {import.meta.env.DEV && this.state.error && (
                        <pre className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-left overflow-auto max-w-lg text-slate-600 dark:text-slate-400">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
