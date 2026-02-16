// @ts-nocheck
import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
    variant?: 'full' | 'minimal';
    /** Filter which options to show. Defaults to all three. */
    options?: Theme[];
}

const allThemes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'Auto' },
    { value: 'dark', icon: Moon, label: 'Dark' },
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onSetTheme, variant = 'full', options }) => {
    const themes = options ? allThemes.filter(t => options.includes(t.value)) : allThemes;

    return (
        <div className={`flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner transition-all duration-300 ${variant === 'minimal' ? 'scale-90' : ''}`}>
            {themes.map(({ value, icon: Icon, label }) => {
                const isActive = theme === value;

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => onSetTheme(value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-[10px] font-black uppercase tracking-widest ${isActive
                            ? value === 'light'
                                ? 'bg-white text-slate-900 shadow-md'
                                : 'bg-slate-700 dark:bg-slate-700 text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        aria-label={`${label} theme`}
                        aria-pressed={isActive}
                    >
                        <Icon
                            className={`w-3.5 h-3.5 ${isActive
                                ? value === 'light'
                                    ? 'text-amber-500'
                                    : 'text-primary-400'
                                : ''
                                }`}
                            strokeWidth={2}
                        />
                        {variant === 'full' && <span>{label}</span>}
                    </button>
                );
            })}
        </div>
    );
};

