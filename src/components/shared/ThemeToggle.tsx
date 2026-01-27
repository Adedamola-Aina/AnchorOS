import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
    variant?: 'full' | 'minimal';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, variant = 'full' }) => {
    return (
        <div className={`flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-inner group transition-all duration-300 ${variant === 'minimal' ? 'scale-90' : ''}`}>
            <button
                type="button"
                onClick={() => theme !== 'light' && onToggle()}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${theme === 'light'
                        ? 'bg-white text-slate-900 shadow-md scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
            >
                <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : ''}`} />
                {variant === 'full' && <span>Light</span>}
            </button>
            <button
                type="button"
                onClick={() => theme !== 'dark' && onToggle()}
                className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${theme === 'dark'
                        ? 'bg-slate-800 text-white shadow-md scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
            >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-primary-400' : ''}`} />
                {variant === 'full' && <span>Dark</span>}
            </button>
        </div>
    );
};
