/**
 * KeyboardShortcutsHelp
 * 
 * Modal component showing all available keyboard shortcuts.
 * Accessible via Settings or pressing "?" key.
 * 
 * @example
 * <KeyboardShortcutsHelp isOpen={isOpen} onClose={() => setIsOpen(false)} />
 */

import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { Modal } from './Modal';

interface Shortcut {
    keys: string[];
    description: string;
    category: 'Navigation' | 'Actions' | 'Views';
}

const SHORTCUTS: Shortcut[] = [
    // Navigation
    { keys: ['⌘/Ctrl', 'K'], description: 'Open Command Palette', category: 'Navigation' },
    { keys: ['Esc'], description: 'Close modal / Cancel', category: 'Navigation' },

    // Actions
    { keys: ['/'], description: 'Focus search (in Finance)', category: 'Actions' },
    { keys: ['N'], description: 'New transaction (in Finance)', category: 'Actions' },
    { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Actions' },

    // Views
    { keys: ['G', 'D'], description: 'Go to Dashboard', category: 'Views' },
    { keys: ['G', 'F'], description: 'Go to Finance', category: 'Views' },
    { keys: ['G', 'C'], description: 'Go to Commitments', category: 'Views' },
    { keys: ['G', 'S'], description: 'Go to Settings', category: 'Views' },
];

interface KeyboardShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const KeyBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-sm">
        {children}
    </kbd>
);

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose }) => {
    const categories = ['Navigation', 'Actions', 'Views'] as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                            <Keyboard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            Keyboard Shortcuts
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {categories.map(category => (
                        <div key={category} className="mb-6 last:mb-0">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {SHORTCUTS.filter(s => s.category === category).map((shortcut, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {shortcut.description}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, ki) => (
                                                <React.Fragment key={ki}>
                                                    <KeyBadge>{key}</KeyBadge>
                                                    {ki < shortcut.keys.length - 1 && (
                                                        <span className="text-slate-400 text-xs">+</span>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        Press <KeyBadge>?</KeyBadge> anytime to show this help
                    </p>
                </div>
            </div>
        </Modal>
    );
};
