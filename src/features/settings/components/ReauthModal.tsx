/**
 * Reauthentication Modal
 * Extracted from SettingsView.tsx per CLAUDE.md §3.2
 */

import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface ReauthModalProps {
    show: boolean;
    password: string;
    isLoading: boolean;
    onPasswordChange: (value: string) => void;
    onConfirm: () => void;
    onClose: () => void;
}

export const ReauthModal: React.FC<ReauthModalProps> = ({
    show, password, isLoading, onPasswordChange, onConfirm, onClose
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200 shadow-2xl">
                <div>
                    <h3 className="text-h3 lg:text-h3-lg text-slate-900 dark:text-white">Verify Identity</h3>
                    <p className="text-slate-500 text-sm mt-1">Please enter your password to confirm this security change.</p>
                </div>
                <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onConfirm()}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                />
                <div className="flex gap-3 pt-2">
                    <Button variant="secondary" onClick={onClose} className="flex-1 h-12 font-bold">
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={!password}
                        className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        Confirm
                    </Button>
                </div>
            </Card>
        </div>
    );
};
