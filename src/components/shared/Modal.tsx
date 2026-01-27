import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
    /** If true, modal takes full screen on mobile devices (default: true) */
    fullScreenMobile?: boolean;
}

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
    // Use React.useId for stable SSR-compatible unique IDs
    const modalId = React.useId();

    // Focus trap and keyboard handling
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
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
            // Store previous active element
            previousActiveElement.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);

            // Focus first focusable element in modal
            setTimeout(() => {
                const firstFocusable = modalRef.current?.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ) as HTMLElement;
                firstFocusable?.focus();
            }, 0);
        } else {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);

            // Restore focus to previous element
            previousActiveElement.current?.focus();
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 ${fullScreenMobile ? 'p-0 sm:p-6' : 'p-4 sm:p-6'
                }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? modalId : undefined}
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Content - Full screen on mobile, centered modal on desktop */}
            <div
                ref={modalRef}
                className={`relative z-10 bg-white dark:bg-slate-800 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden ${fullScreenMobile
                    ? `w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:${maxWidth} sm:rounded-2xl`
                    : `w-full ${maxWidth} max-h-[90vh] rounded-2xl`
                    }`}
            >
                {/* Header - with safe area padding on mobile */}
                <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0 ${fullScreenMobile ? 'pt-safe' : ''
                    }`}>
                    <h3 id={modalId} className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body - with safe area padding on mobile */}
                <div className={`p-6 overflow-y-auto flex-1 ${fullScreenMobile ? 'pb-safe' : ''
                    }`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
