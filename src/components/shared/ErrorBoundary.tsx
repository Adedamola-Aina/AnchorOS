/**
 * ErrorBoundary - Global error handler
 * DES-002: Migrated to semantic tokens
 */

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
                <div className="h-screen w-full flex flex-col items-center justify-center bg-surface-2 dark:bg-surface-1-dark p-6 text-center">
                    <div className="p-4 bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 rounded-full mb-6">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-h2 lg:text-h2-lg text-foreground dark:text-foreground-dark mb-2">Something went wrong</h1>
                    <p className="text-muted max-w-md mb-8">
                        We encountered an unexpected error. Please try reloading the application.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-6 py-3 bg-foreground dark:bg-foreground-dark text-surface-1 dark:text-surface-1-dark rounded-xl font-bold hover:scale-105 transition-transform"
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
                            className="flex items-center gap-2 px-6 py-3 border border-danger-200 dark:border-danger-800 text-danger-600 dark:text-danger-400 rounded-xl font-bold hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                        >
                            <AlertCircle className="w-5 h-5" />
                            Reset App Data
                        </button>
                    </div>
                    {import.meta.env.DEV && this.state.error && (
                        <pre className="mt-8 p-4 bg-surface-3 dark:bg-surface-2-dark rounded-lg text-xs text-left overflow-auto max-w-lg text-muted">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

