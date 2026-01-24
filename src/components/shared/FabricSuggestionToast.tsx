/**
 * FabricSuggestionToast
 * 
 * Fabric v1.5: Smart suggestion toast that appears when completing financial commitments.
 * Auto-dismisses after 8 seconds with smooth exit animation.
 * 
 * @example
 * <FabricSuggestionToast suggestion={suggestion} />
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { FabricSuggestion } from '../../hooks/useFabricSuggestions';

interface FabricSuggestionToastProps {
    suggestion: FabricSuggestion;
}

export const FabricSuggestionToast: React.FC<FabricSuggestionToastProps> = ({ suggestion }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Define handleDismiss before useEffect to avoid "accessed before declared" error
    const handleDismiss = React.useCallback(() => {
        // Clear timer to prevent double-dismiss
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            suggestion.dismiss();
        }, 300);
    }, [suggestion]);

    // Auto-dismiss after 8 seconds
    useEffect(() => {
        timerRef.current = setTimeout(() => {
            handleDismiss();
        }, 8000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [handleDismiss]);

    const handleAction = () => {
        // Clear timer before action to prevent memory leak
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        suggestion.action();
    };

    if (!isVisible) return null;

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`
        fixed bottom-6 right-6 z-50 max-w-sm w-full
        bg-white dark:bg-slate-800 
        rounded-2xl shadow-2xl 
        border border-slate-200 dark:border-slate-700 
        overflow-hidden
        transform transition-all duration-300 ease-out
        ${isExiting
                    ? 'translate-x-[120%] opacity-0'
                    : 'translate-x-0 opacity-100 animate-in slide-in-from-right-8'
                }
      `}
        >
            {/* Progress bar for auto-dismiss */}
            <div className="h-1 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{
                        animation: 'shrink 8s linear forwards',
                    }}
                />
            </div>

            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {suggestion.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {suggestion.message}
                        </p>

                        {/* Amount preview if available */}
                        {suggestion.metadata?.amount && (
                            <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                                ${suggestion.metadata.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        )}
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Dismiss suggestion"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleAction}
                        className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
                    >
                        Yes, Record
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors"
                    >
                        Not now
                    </button>
                </div>
            </div>

            {/* CSS for progress bar animation */}
            <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </div>
    );
};

/**
 * FabricSuggestionContainer
 * 
 * Renders multiple suggestions stacked.
 */
interface FabricSuggestionContainerProps {
    suggestions: FabricSuggestion[];
}

export const FabricSuggestionContainer: React.FC<FabricSuggestionContainerProps> = ({ suggestions }) => {
    if (suggestions.length === 0) return null;

    // Only show the most recent suggestion to avoid clutter
    const latestSuggestion = suggestions[suggestions.length - 1];

    return <FabricSuggestionToast suggestion={latestSuggestion} />;
};
