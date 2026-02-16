// @ts-nocheck
import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

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
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full shrink-0 ${isDestructive ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="pt-1">
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 ${isDestructive
                                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
