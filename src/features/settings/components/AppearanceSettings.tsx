/**
 * AppearanceSettings - Theme selection
 * DES-002: Migrated to semantic tokens and primitives
 */

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { ThemeToggle, type Theme } from '../../../components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@anchor-os/ui';
import { Text, VStack, HStack } from '../../../components/primitives';

interface AppearanceSettingsProps {
    theme: Theme;
    onSetTheme: (theme: Theme) => void;
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme, onSetTheme }) => {
    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return <Sun className="w-5 h-5 text-warning-500" strokeWidth={2} />;
            case 'dark': return <Moon className="w-5 h-5 text-primary-500" strokeWidth={2} />;
            case 'system': return <Monitor className="w-5 h-5 text-muted" strokeWidth={2} />;
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-6 border-b border-border-subtle dark:border-border-dark bg-surface-3/30 dark:bg-surface-3-dark/20">
                <CardTitle className="text-base font-bold text-foreground dark:text-foreground-dark flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-warning-500/10' : theme === 'dark' ? 'bg-primary-500/10' : 'bg-surface-3'}`}>
                        {getThemeIcon()}
                    </div>
                    Appearance
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                <HStack justify="between" align="center" className="flex-col md:flex-row gap-6">
                    <VStack gap="xs">
                        <Text variant="heading" size="xs" weight="bold" className="uppercase tracking-wider">Visual Theme</Text>
                        <Text variant="muted" size="sm">
                            Choose Light or Dark mode for your preferred viewing experience.
                        </Text>
                    </VStack>
                    <ThemeToggle theme={theme} onSetTheme={onSetTheme} />
                </HStack>
            </CardContent>
        </Card>
    );
};

