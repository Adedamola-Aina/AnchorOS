/**
 * AskAnchorRow — the conversational entry point, kept small (CM-30).
 *
 * Conversation is the *deeper* experience, not the price of admission: the dashboard
 * already shows what Anchor has noticed, so this is one row that invites a question
 * rather than a panel that occupies a third of Home.
 *
 * When Anchor AI is switched off it renders nothing at all. A disabled feature that
 * keeps asking to be enabled is nagging, and the switch lives in Settings where the user
 * turned it off.
 */
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface AskAnchorRowProps {
    onOpenAssistant: () => void;
    /** A couple of concrete starting points, not a wall of suggestion chips. */
    prompts?: string[];
}

const DEFAULT_PROMPTS = ["What's important today?", 'How am I doing financially?'];

export const AskAnchorRow: React.FC<AskAnchorRowProps> = ({ onOpenAssistant, prompts = DEFAULT_PROMPTS }) => (
    <section data-testid="home-ask-anchor" className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
            type="button"
            onClick={onOpenAssistant}
            data-testid="home-ask-anchor-open"
            className="w-full flex items-center gap-3 p-4 text-left min-h-11 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors rounded-xl"
        >
            <MessageCircle className="w-4 h-4 shrink-0 text-primary-500" aria-hidden="true" />
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800 dark:text-white">Ask Anchor anything about your life</span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {prompts.join(' · ')}
                </span>
            </span>
        </button>
    </section>
);