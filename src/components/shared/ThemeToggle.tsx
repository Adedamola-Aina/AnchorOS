/**
 * ThemeToggle - Light/Dark/System theme switcher
 * DES-002: Migrated to semantic tokens
 */

import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeToggleProps {
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
    variant?: 'full' | 'minimal';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onSetTheme, variant = 'full' }) => {
    const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'system', icon: Monitor, label: 'Auto' },
        { value: 'dark', icon: Moon, label: 'Dark' },
    ];

    return (
        <div className={`flex items-center gap-1 p-1 bg-surface-3 dark:bg-surface-3-dark rounded-xl border border-border-subtle dark:border-border-dark shadow-inner transition-all duration-300 ${variant === 'minimal' ? 'scale-90' : ''}`}>
            {themes.map(({ value, icon: Icon, label }) => {
                const isActive = theme === value;

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => onSetTheme(value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-[10px] font-black uppercase tracking-widest ${isActive
                            ? value === 'light'
                                ? 'bg-white text-foreground shadow-md ring-1 ring-slate-200'
                                : 'bg-surface-2-dark text-foreground-dark shadow-md'
                            : 'text-muted hover:text-foreground dark:hover:text-foreground-dark'
                            }`}
                        aria-label={`${label} theme`}
                        aria-pressed={isActive}
                    >
                        <Icon
                            className={`w-3.5 h-3.5 ${isActive
                                ? value === 'light'
                                    ? 'text-amber-500'
                                    : 'text-blue-400'
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

