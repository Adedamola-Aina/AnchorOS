/**
 * ConfirmationModal - Confirmation dialog with destructive/confirmation variants
 * DES-002: Migrated to semantic tokens
 * WEB-003: Framer Motion button animations
 */

import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';
import { Text, VStack, HStack } from '../primitives';
import { motion } from 'framer-motion';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDestructive = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <VStack gap="md">
                <HStack gap="md" align="start">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
                        className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400' : 'bg-surface-3 dark:bg-surface-3-dark text-muted'}`}
                    >
                        <AlertTriangle className="w-6 h-6" />
                    </motion.div>
                    <div className="pt-1">
                        <Text size="sm" variant="muted" className="leading-relaxed">
                            {message}
                        </Text>
                    </div>
                </HStack>

                <HStack justify="end" gap="sm" className="mt-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-subtle dark:text-subtle-dark font-bold text-sm hover:bg-surface-3 dark:hover:bg-surface-3-dark transition-colors"
                    >
                        {cancelLabel}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-colors ${isDestructive
                            ? 'bg-danger-500 hover:bg-danger-600 shadow-danger-500/20'
                            : 'bg-finance-600 hover:bg-finance-700 shadow-finance-500/20'
                            }`}
                    >
                        {confirmLabel}
                    </motion.button>
                </HStack>
            </VStack>
        </Modal>
    );
};
