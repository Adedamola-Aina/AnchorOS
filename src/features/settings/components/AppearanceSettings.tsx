import React from 'react';
import { Moon, Sun, Circle } from 'lucide-react';
import { ThemeToggle } from '../../../components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';

export type Theme = 'light' | 'dark' | 'oled';

interface AppearanceSettingsProps {
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, onSetTheme }) => {
    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return <Sun className="w-5 h-5 text-amber-500" strokeWidth={2} />;
            case 'dark': return <Moon className="w-5 h-5 text-primary-500" strokeWidth={2} />;
            case 'oled': return <Circle className="w-5 h-5 text-white fill-white" strokeWidth={2} />;
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-amber-500/10' :
                            theme === 'dark' ? 'bg-primary-500/10' :
                                'bg-zinc-800'
                        }`}>
                        {getThemeIcon()}
                    </div>
                    Appearance
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Visual Theme</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Choose Light, Dark, or OLED mode. OLED uses true black for battery savings on OLED screens.
                        </p>
                    </div>
                    <ThemeToggle
                        theme={theme}
                        onSetTheme={onSetTheme}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
