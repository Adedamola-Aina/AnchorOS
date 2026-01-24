/**
 * InviteDetails - Shows invitation details and join button
 * 
 * Displays owner info and allows logged-in users to proceed.
 */

import { Users, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import type { User } from 'firebase/auth';

interface InviteDetailsProps {
    user: User | null;
    ownerName: string;
    isVerifying: boolean;
    hasVerificationCode: boolean;
    onProceed: () => void;
}

export function InviteDetails({ user, ownerName, isVerifying, hasVerificationCode, onProceed }: InviteDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Family Invitation</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{ownerName}</strong> invited you to join their household.
                </p>
            </div>

            {!user ? (
                <div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-sm rounded-xl mb-4 text-center font-medium border border-slate-100 dark:border-slate-800">
                        Please log in or create an account to accept.
                    </div>
                    <button
                        onClick={() => {
                            sessionStorage.setItem('returnAfterAuth', window.location.href);
                            window.location.href = '/';
                        }}
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        Log In or Create Account <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div>
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Logged in as {user.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={onProceed}
                        disabled={isVerifying}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                Join Family <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                    {hasVerificationCode && (
                        <p className="text-xs text-center text-slate-400 mt-3">
                            <CheckCircle className="w-3 h-3 inline mr-1 text-emerald-500" />
                            Secure code verified from invite link
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
