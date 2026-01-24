/**
 * AwaitingConfirmationCard - Shows when invitee has entered correct code
 */

import { Check, X, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface AwaitingConfirmationCardProps {
    inviteeEmail: string;
    showPasswordPrompt: boolean;
    password: string;
    setPassword: (password: string) => void;
    error: string;
    confirmingConnection: boolean;
    onPasswordSubmit: (e: React.FormEvent) => void;
    onBack: () => void;
    onConfirm: () => void;
    onReject: () => void;
}

export function AwaitingConfirmationCard({
    inviteeEmail, showPasswordPrompt, password, setPassword, error,
    confirmingConnection, onPasswordSubmit, onBack, onConfirm, onReject,
}: AwaitingConfirmationCardProps) {
    return (
        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Confirm Family Connection
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                {showPasswordPrompt ? (
                    <form onSubmit={onPasswordSubmit} className="space-y-4">
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                            <p className="text-sm text-slate-600 dark:text-slate-300">Connecting with: <span className="font-semibold">{inviteeEmail}</span></p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">✓ Verification code confirmed</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Confirm Your Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    autoFocus autoComplete="current-password" />
                            </div>
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        <div className="flex gap-3">
                            <Button type="button" variant="secondary" onClick={onBack} className="flex-1">Back</Button>
                            <Button type="submit" disabled={confirmingConnection || !password} className="flex-1 bg-emerald-600 hover:bg-emerald-700 gap-2">
                                {confirmingConnection ? <><Loader2 className="w-4 h-4 animate-spin" />Confirming...</> : <>Confirm<ArrowRight className="w-4 h-4" /></>}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                            <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-semibold">{inviteeEmail}</span> has accepted your invitation and entered the correct verification code.</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Ready to connect! Confirm to complete the family link.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={onReject} disabled={confirmingConnection} className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20">
                                <X className="w-4 h-4 mr-2" />Reject
                            </Button>
                            <Button onClick={onConfirm} disabled={confirmingConnection} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                <Check className="w-4 h-4 mr-2" />Confirm Connection
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
