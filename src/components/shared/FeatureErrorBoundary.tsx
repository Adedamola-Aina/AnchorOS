import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import * as Sentry from "@sentry/react";

interface Props {
    featureName: string;
    onReset?: () => void;
    fallback?: ReactNode;
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Feature-level error boundary for graceful failure isolation.
 * Prevents errors in one feature from crashing the entire application.
 * 
 * @example
 * <FeatureErrorBoundary featureName="Finance">
 *   <FinanceView />
 * </FeatureErrorBoundary>
 */
export class FeatureErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }


    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error for debugging (dev mode only shows in console)
        console.error(`[${this.props.featureName}] Error caught by boundary:`, error);

        // Send to Sentry
        Sentry.captureException(error, {
            extra: {
                componentStack: errorInfo.componentStack,
                feature: this.props.featureName
            }
        });

        if (import.meta.env.DEV) {
            console.error('Error Info:', errorInfo);
        }
    }

    private handleReset = () => {
        // Call optional reset callback
        this.props.onReset?.();

        // Reset error state to retry rendering
        this.setState({ hasError: false, error: null });
    };

    private handleReport = () => {
        const subject = encodeURIComponent(`[Bug] ${this.props.featureName} Error`);
        const body = encodeURIComponent(
            `Error in ${this.props.featureName}:\n\n${this.state.error?.message || 'Unknown error'}\n\nPlease describe what you were doing when this happened.`
        );
        window.location.href = `mailto:workmail@adedamola.us?subject=${subject}&body=${body}`;
    };

    public render() {
        if (this.state.hasError) {
            // Use custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI - mobile-responsive
            return (
                <div className="w-full p-6 md:p-8">
                    <div className="max-w-md mx-auto bg-surface-1 dark:bg-surface-2-dark rounded-2xl border-2 border-danger-200 dark:border-danger-900/50 shadow-sm p-6">
                        {/* Error Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 rounded-full">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                        </div>

                        {/* Error Message */}
                        <h3 className="text-h3 lg:text-h3-lg text-foreground dark:text-foreground-dark text-center mb-2">
                            Unable to load {this.props.featureName}
                        </h3>
                        <p className="text-sm text-muted dark:text-muted-dark text-center mb-6">
                            Something went wrong. Try reloading this section or navigate to another page.
                        </p>

                        {/* Action Buttons - Mobile: Stacked, Desktop: Side-by-side */}
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 bg-foreground dark:bg-foreground-dark text-surface-1 dark:text-surface-1-dark rounded-xl font-medium hover:scale-105 transition-transform w-full md:flex-1 min-h-[44px] md:min-h-0"
                                aria-label={`Retry loading ${this.props.featureName}`}
                            >
                                <RefreshCw className="w-5 h-5" />
                                Try Again
                            </button>
                            <button
                                onClick={this.handleReport}
                                className="flex items-center justify-center gap-2 px-4 py-3 md:py-2.5 border border-border-subtle text-muted dark:text-muted-dark rounded-xl font-medium hover:bg-surface-2 dark:hover:bg-surface-3-dark transition-colors w-full md:flex-1 min-h-[44px] md:min-h-0"
                                aria-label="Report this issue"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Report Issue
                            </button>
                        </div>

                        {/* Dev Mode: Show Error Details */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6">
                                <summary className="text-xs text-muted cursor-pointer hover:text-foreground dark:hover:text-foreground-dark">
                                    Show error details (dev only)
                                </summary>
                                <pre className="mt-2 p-3 bg-surface-3 dark:bg-surface-1-dark rounded-lg text-xs text-muted dark:text-muted-dark overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
