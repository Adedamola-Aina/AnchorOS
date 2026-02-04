/**
 * Modal - Reusable modal component with Framer Motion animations
 * DES-002: Semantic tokens
 * WEB-003: Framer Motion animations with backdrop blur
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
    /** If true, modal takes full screen on mobile devices (default: true) */
    fullScreenMobile?: boolean;
}

// Animation variants
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 10,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            damping: 25,
            stiffness: 300,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: {
            duration: 0.15,
            ease: 'easeIn' as const,
        },
    },
};

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
    fullScreenMobile = true
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    const modalId = React.useId();

    // Focus trap and keyboard handling
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        e.stopPropagation();

        if (e.key === 'Escape') {
            onClose();
            return;
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
            previousActiveElement.current?.focus();
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-surface-1/60 dark:bg-surface-1-dark/60 backdrop-blur-sm ${fullScreenMobile ? 'p-0 sm:p-6' : 'p-4 sm:p-6'}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? modalId : undefined}
                >
                    {/* Backdrop - catches clicks outside modal to close */}
                    <div
                        className="fixed inset-0 z-0"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Content - Full screen on mobile, centered modal on desktop */}
                    <motion.div
                        ref={modalRef}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onKeyDown={(e) => e.stopPropagation()}
                        className={`relative z-10 pointer-events-auto bg-surface-1 dark:bg-surface-2-dark shadow-2xl flex flex-col border border-border-subtle overflow-hidden ${fullScreenMobile
                            ? `w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:${maxWidth} sm:rounded-2xl`
                            : `w-full ${maxWidth} max-h-[90vh] rounded-2xl`
                            }`}
                    >
                        {/* Header - with safe area padding on mobile */}
                        <div className={`px-6 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-2/50 dark:bg-surface-2-dark/50 shrink-0 ${fullScreenMobile ? 'pt-safe' : ''}`}>
                            <h3 id={modalId} className="text-h3 lg:text-h3-lg text-foreground dark:text-foreground-dark">{title}</h3>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-surface-3 dark:hover:bg-surface-3-dark text-muted transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Scrollable Body - with safe area padding on mobile */}
                        <div className={`p-6 overflow-y-auto flex-1 ${fullScreenMobile ? 'pb-safe' : ''}`}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
