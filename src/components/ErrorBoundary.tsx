import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    showDetails: boolean;
}

/**
 * Error Boundary component for catching and displaying React errors gracefully.
 * This prevents white screen crashes and shows helpful debugging info.
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        // Log to console for debugging
        console.error('ErrorBoundary caught error:', error);
        console.error('Component Stack:', errorInfo.componentStack);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false
        });
    };

    handleCopyError = () => {
        const { error, errorInfo } = this.state;
        const errorText = `
Error: ${error?.message}
Stack: ${error?.stack}
Component Stack: ${errorInfo?.componentStack}
        `.trim();
        navigator.clipboard.writeText(errorText);
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { error, errorInfo, showDetails } = this.state;
            const componentName = this.props.componentName || 'Component';

            return (
                <div className="min-h-[300px] flex items-center justify-center p-6">
                    <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-rose-200 dark:border-rose-500/30 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-rose-500 to-red-600 p-4 text-white">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6" />
                                <div>
                                    <h3 className="font-bold">Something went wrong</h3>
                                    <p className="text-sm opacity-90">{componentName} encountered an error</p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg break-all">
                                {error?.message || 'Unknown error'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-4 flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={this.handleCopyError}
                                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
                                title="Copy error details"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Details Toggle */}
                        <div className="border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => this.setState({ showDetails: !showDetails })}
                                className="w-full p-3 flex items-center justify-between text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <span>Technical Details</span>
                                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showDetails && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 max-h-64 overflow-auto">
                                    <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-all">
                                        {error?.stack}
                                        {'\n\n--- Component Stack ---\n'}
                                        {errorInfo?.componentStack}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
