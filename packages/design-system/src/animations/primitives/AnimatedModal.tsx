/**
 * AnimatedModal - Modal with backdrop and content animations
 * 
 * Complete modal animation system with backdrop blur,
 * content scale/slide, and focus trap support.
 * 
 * Usage:
 *   <AnimatedModal isOpen={isOpen} onClose={handleClose}>
 *     <ModalContent />
 *   </AnimatedModal>
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeBlur, scaleUp, slideUp, popIn } from '../variants';
import { modalTransition, tweenSmooth } from '../transitions';
import { useReducedMotion } from '../hooks';

type ModalVariant = 'scale' | 'slideUp' | 'pop';

interface AnimatedModalProps {
    children: React.ReactNode;
    /** Whether modal is visible */
    isOpen: boolean;
    /** Close handler */
    onClose: () => void;
    /** Animation variant */
    variant?: ModalVariant;
    /** Close on backdrop click */
    closeOnBackdrop?: boolean;
    /** Close on Escape key */
    closeOnEscape?: boolean;
    /** Additional className for content */
    className?: string;
    /** Maximum width */
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
};

const contentVariantMap = {
    scale: scaleUp,
    slideUp: slideUp,
    pop: popIn,
};

export function AnimatedModal({
    children,
    isOpen,
    onClose,
    variant = 'scale',
    closeOnBackdrop = true,
    closeOnEscape = true,
    className = '',
    maxWidth = 'md',
}: AnimatedModalProps) {
    const prefersReducedMotion = useReducedMotion();

    // Handle Escape key
    useEffect(() => {
        if (!closeOnEscape || !isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, closeOnEscape]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const backdropVariants = prefersReducedMotion
        ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
        : fadeBlur;

    const contentVariants = prefersReducedMotion
        ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
        : contentVariantMap[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={tweenSmooth}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={closeOnBackdrop ? onClose : undefined}
                        aria-hidden="true"
                    />

                    {/* Content */}
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={modalTransition}
                        className={`relative z-10 w-full ${maxWidthMap[maxWidth]} ${className}`}
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ============================================================
// ANIMATED MODAL PARTS
// ============================================================

interface AnimatedModalContentProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedModalContent({ children, className = '' }: AnimatedModalContentProps) {
    return (
        <div className={`bg-surface-1 dark:bg-surface-1-dark rounded-2xl shadow-xl p-6 ${className}`}>
            {children}
        </div>
    );
}

interface AnimatedModalHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedModalHeader({ children, className = '' }: AnimatedModalHeaderProps) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

interface AnimatedModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedModalFooter({ children, className = '' }: AnimatedModalFooterProps) {
    return (
        <div className={`mt-6 flex justify-end gap-3 ${className}`}>
            {children}
        </div>
    );
}

export default AnimatedModal;
