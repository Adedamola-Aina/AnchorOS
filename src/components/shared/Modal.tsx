
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { lockDocument, unlockDocument } from '../../hooks/useOverlayBehavior';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: string;
    /** If true, modal takes full screen on mobile devices (default: true) */
    fullScreenMobile?: boolean;
    /**
     * Pinned action bar, rendered OUTSIDE the scrollable body.
     *
     * A `sticky bottom-0` bar inside the body scrolls *over* the fields it is
     * submitting, and with a translucent background it reads as a floating pill
     * covering NOTES / REMINDER / STARTS. A footer in the modal's own flex column
     * cannot overlap anything, and it stays reachable without scrolling.
     *
     * A submit button placed here must name its form (`form="<form-id>"`).
     */
    footer?: React.ReactNode;
}

/**
 * The open-modal contract the shell reads is `body[data-modal-open]`, published by
 * `lockDocument` in useOverlayBehavior — shared with every other overlay, so a sheet
 * opened from a modal and the modal itself cannot disagree about whether the page is
 * locked or whether the contextual FAB should stand down.
 */

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
    fullScreenMobile = true,
    footer
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);
    // Use React.useId for stable SSR-compatible unique IDs
    const modalId = React.useId();

    // Focus trap and keyboard handling.
    // Shared by the document-level listener (focus outside modal content) and the
    // React onKeyDown handler on the modal content (focus inside modal content).
    // The content-level React handler is required: the content div stops native
    // propagation, so the document listener never receives keys typed inside the
    // modal — Escape/Tab must be handled there directly.
    const FOCUSABLE_SELECTOR = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Stop propagation to prevent global handlers (CommandPalette, search shortcuts) from intercepting modal input
        e.stopPropagation();

        if (e.key === 'Escape') {
            onClose();
            return;
        }

        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                FOCUSABLE_SELECTOR
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            /*
             * `activeElement` is frequently `<body>` when a modal opens: the trigger
             * (the contextual FAB, a row's action button) unmounts as the modal takes
             * over, and focus falls back to the document. Without this branch the trap
             * only reacted to being AT the first/last element, so the first Tab did
             * nothing and focus stayed outside the dialog entirely.
             */
            const activeIsInside = modalRef.current.contains(document.activeElement);

            if (e.shiftKey && (!activeIsInside || document.activeElement === firstElement)) {
                e.preventDefault();
                lastElement?.focus();
            } else if (!e.shiftKey && (!activeIsInside || document.activeElement === lastElement)) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return undefined;
        // Store previous active element
        previousActiveElement.current = document.activeElement as HTMLElement;
        // Shared, reference-counted lock: it also publishes `data-modal-open`, the
        // marker the shell's FAB and app-shell.css read. The previous unconditional
        // `overflow = 'unset'` handed scrolling back to the page while a sheet opened
        // on top of the modal was still up.
        lockDocument();
        document.addEventListener('keydown', handleKeyDown);

        // NOTE: no auto-focus here - child components with an `autoFocus` attribute
        // (like DescriptionField) handle their own, and doing it here stole focus
        // from those inputs.

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            unlockDocument();
            // Restore focus to the previous element, but only when it is still
            // mounted and can meaningfully hold focus. Trigger elements often
            // unmount with the action sheet that opened the modal (activeElement
            // falls back to <body>); restoring focus to <body> would steal focus
            // from any control the close handler focused.
            const previous = previousActiveElement.current;
            if (previous && previous !== document.body && previous.isConnected) {
                previous.focus();
            }
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
            {/* Backdrop - catches clicks outside modal to close */}
            <div
                className="fixed inset-0 z-0"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Content - Full screen on mobile, centered modal on desktop */}
            <div
                ref={modalRef}
                onKeyDown={(e) => handleKeyDown(e.nativeEvent)}
                className={`relative z-10 pointer-events-auto bg-white dark:bg-slate-800 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 overflow-hidden ${fullScreenMobile
                    ? `w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:${maxWidth} sm:rounded-2xl`
                    : `w-full ${maxWidth} max-h-[90vh] rounded-2xl`
                    }`}
            >
                {/* Header - with safe area padding on mobile */}
                <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0 ${fullScreenMobile ? 'pt-[calc(1rem+env(safe-area-inset-top,0px))]' : ''
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
                <div className={`p-6 overflow-y-auto flex-1 overscroll-contain ${fullScreenMobile && !footer ? 'pb-[calc(1rem+env(safe-area-inset-bottom,0px))]' : ''
                    }`} style={{ WebkitOverflowScrolling: 'touch' }}>
                    {children}
                </div>

                {/*
                  * Pinned action bar. Solid, opaque, and outside the scroll area, so
                  * it can never sit on top of a field or a field label — and it
                  * carries the bottom safe-area inset itself.
                  */}
                {footer && (
                    <div
                        data-testid="modal-footer"
                        className="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
                    >
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
