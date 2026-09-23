/**
 * SettingsHub — the grouped, searchable index that replaces the chip bar
 * (UX-ST-01, UX-ST-04, UX-ST-06).
 *
 * What was wrong: nine anchor chips in a horizontally-scrolling strip over ten
 * sections in one continuous scroll. The last chip was clipped with no overflow
 * affordance, and "search" did not exist at all.
 *
 * What this is: a grouped list (one row per section, with a one-line
 * description and a real link) plus a search field that matches the label,
 * the description **and** the synonyms in the registry. There is no horizontal
 * scrolling anywhere, and no second-level nav competing with the shell.
 */


import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import {
    SETTINGS_GROUPS,
    filterSettingsSections,
    sectionsInGroup,
    settingsSectionPath,
    type SettingsSectionDef,
} from '../sections';

const SectionRow: React.FC<{ section: SettingsSectionDef }> = ({ section }) => (
    <Link
        to={settingsSectionPath(section.id)}
        data-testid={`settings-row-${section.id}`}
        className="flex items-center gap-3 min-h-11 p-4 rounded-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
        <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{section.label}</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">{section.description}</span>
        </span>
        <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
    </Link>
);

interface SettingsHubProps {
    /** The assistant section is hidden when the Anchor AI feature flag is off. */
    hideAssistant?: boolean;
}

export const SettingsHub: React.FC<SettingsHubProps> = ({ hideAssistant = false }) => {
    const [query, setQuery] = useState('');
    const searching = query.trim().length > 0;
    const visible = useCallback(
        (sections: SettingsSectionDef[]) => (hideAssistant ? sections.filter((s) => s.id !== 'assistant') : sections),
        [hideAssistant],
    );
    const results = useMemo(() => visible(filterSettingsSections(query)), [query, visible]);

    return (
        <div data-testid="settings-hub" className="space-y-5">
            <label className="relative block">
                <span className="sr-only">Search settings</span>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search settings"
                    data-testid="settings-search"
                    className="w-full min-h-11 pl-10 pr-3 py-3 rounded-card border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </label>

            {searching ? (
                <div className="space-y-2" data-testid="settings-search-results">
                    {results.length === 0 ? (
                        <p className="text-sm text-slate-500 dark:text-slate-400" data-testid="settings-search-empty">
                            No settings match &ldquo;{query}&rdquo;.
                        </p>
                    ) : (
                        results.map((section) => <SectionRow key={section.id} section={section} />)
                    )}
                </div>
            ) : (
                SETTINGS_GROUPS.map((group) => {
                    const items = visible(sectionsInGroup(group.id));
                    if (items.length === 0) return null;
                    return (
                        <section key={group.id} className="space-y-2" data-testid={`settings-group-${group.id}`}>
                            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {group.label}
                            </h2>
                            <div className="space-y-2">
                                {items.map((section) => <SectionRow key={section.id} section={section} />)}
                            </div>
                        </section>
                    );
                })
            )}
        </div>
    );
};
