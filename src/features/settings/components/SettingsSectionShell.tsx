/**
 * SettingsSectionShell — the chrome every section screen shares (UX-ST-02, UX-ST-06).
 *
 * A section is a *destination* now: it has a title, a description and a real
 * back affordance to the hub, so browser back/forward and reload behave the way
 * the URL implies. Before this, "sections" were scroll offsets.
 */
// @ts-nocheck

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { SETTINGS_ROOT, type SettingsSectionDef } from '../sections';

interface SettingsSectionShellProps {
    section: SettingsSectionDef;
    children: React.ReactNode;
}

export const SettingsSectionShell: React.FC<SettingsSectionShellProps> = ({ section, children }) => (
    <div data-testid={`settings-section-${section.id}`} className="space-y-4">
        <Link
            to={SETTINGS_ROOT}
            data-testid="settings-back"
            className="inline-flex items-center gap-1 min-h-11 px-2 -ml-2 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Settings
        </Link>

        <header className="space-y-1">
            <h1 className="text-h1 lg:text-h1-lg text-slate-900 dark:text-white tracking-tight">{section.label}</h1>
            <p className="text-slate-500 dark:text-slate-400">{section.description}</p>
        </header>

        {children}
    </div>
);
