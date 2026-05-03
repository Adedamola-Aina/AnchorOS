/**
 * SectionNav - Mobile quick-jump strip for grouped Settings sections
 */
// @ts-nocheck

import React from 'react';

interface Section { id: string; label: string; }

const baseSections: Section[] = [
    { id: 'profile',       label: 'Profile' },
    { id: 'security',      label: 'Security' },
    { id: 'appearance',    label: 'Preferences' },
    { id: 'notifications', label: 'Alerts' },
    { id: 'family',        label: 'Family' },
    { id: 'data',          label: 'Data' },
    { id: 'support',       label: 'Support' },
    { id: 'danger',        label: 'Account' },
];

interface SectionNavProps { includeAnchorAI?: boolean; }

export const SectionNav: React.FC<SectionNavProps> = ({ includeAnchorAI = false }) => {
    const sections: Section[] = includeAnchorAI
        ? [...baseSections.slice(0, 4), { id: 'anchor-ai', label: 'AI' }, ...baseSections.slice(4)]
        : baseSections;

    const scrollToSection = (id: string) => {
        document.getElementById(`settings-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 md:hidden">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors min-h-[32px] touch-manipulation"
                    >
                        {section.label}
                    </button>
                ))}
            </div>
        </nav>
    );
};
