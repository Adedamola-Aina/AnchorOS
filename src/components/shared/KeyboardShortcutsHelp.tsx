/**
 * KeyboardShortcutsHelp
 * DES-002: Migrated to semantic tokens
 * WEB-003: Framer Motion hover animations
 * 
 * Modal component showing all available keyboard shortcuts.
 * Accessible via Settings or pressing "?" key.
 * 
 * @example
 * <KeyboardShortcutsHelp isOpen={isOpen} onClose={() => setIsOpen(false)} />
 */

import React from 'react';
import { motion } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';
import { Modal } from './Modal';
import { Text, VStack, HStack } from '../primitives';

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
    <kbd className="px-2 py-1 bg-surface-3 dark:bg-surface-3-dark border border-border-subtle rounded-md text-xs font-mono font-bold text-muted dark:text-muted-dark shadow-sm">
        {children}
    </kbd>
);

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({ isOpen, onClose }) => {
    const categories = ['Navigation', 'Actions', 'Views'] as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <VStack gap="none" className="bg-surface-1 dark:bg-surface-2-dark rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <HStack justify="between" align="center" className="p-4 border-b border-border-subtle">
                    <HStack gap="sm" align="center">
                        <div className="p-2 bg-surface-3 dark:bg-surface-3-dark rounded-xl">
                            <Keyboard className="w-5 h-5 text-muted" />
                        </div>
                        <Text size="lg" weight="bold" className="text-foreground dark:text-foreground-dark">
                            Keyboard Shortcuts
                        </Text>
                    </HStack>
                    <motion.button
                        onClick={onClose}
                        className="p-2 hover:bg-surface-3 dark:hover:bg-surface-3-dark rounded-lg transition-colors"
                        aria-label="Close"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-5 h-5 text-muted" />
                    </motion.button>
                </HStack>

                {/* Content */}
                <div className="p-4 overflow-y-auto max-h-[60vh]">
                    {categories.map(category => (
                        <VStack key={category} gap="sm" className="mb-6 last:mb-0">
                            <Text size="xs" weight="bold" variant="muted" className="uppercase tracking-wider">
                                {category}
                            </Text>
                            <VStack gap="xs">
                                {SHORTCUTS.filter(s => s.category === category).map((shortcut, i) => (
                                    <HStack
                                        key={i}
                                        justify="between"
                                        align="center"
                                        className="py-2 px-3 rounded-lg hover:bg-surface-3/50 dark:hover:bg-surface-3-dark/50 transition-colors"
                                    >
                                        <Text size="sm" className="text-muted dark:text-muted-dark">
                                            {shortcut.description}
                                        </Text>
                                        <HStack gap="xs" align="center">
                                            {shortcut.keys.map((key, ki) => (
                                                <React.Fragment key={ki}>
                                                    <KeyBadge>{key}</KeyBadge>
                                                    {ki < shortcut.keys.length - 1 && (
                                                        <Text size="xs" variant="muted">+</Text>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </HStack>
                                    </HStack>
                                ))}
                            </VStack>
                        </VStack>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border-subtle bg-surface-2 dark:bg-surface-1-dark">
                    <Text size="xs" variant="muted" className="text-center">
                        Press <KeyBadge>?</KeyBadge> anytime to show this help
                    </Text>
                </div>
            </VStack>
        </Modal>
    );
};

