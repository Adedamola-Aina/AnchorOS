/**
 * OnboardingAccountStep - Step 2: Create primary account
 */

import { Wallet } from 'lucide-react';

type AccountType = 'checking' | 'savings' | 'salary' | 'investment';

interface OnboardingAccountStepProps {
    accName: string;
    setAccName: (name: string) => void;
    balance: string;
    setBalance: (balance: string) => void;
    currency: 'USD' | 'NGN';
    setCurrency: (currency: 'USD' | 'NGN') => void;
    accountType: AccountType;
    setAccountType: (type: AccountType) => void;
    loading: boolean;
    onSubmit: () => void;
    onSkip: () => void;
    onBack: () => void;
}

const accountTypes: { value: AccountType; label: string }[] = [
    { value: 'checking', label: 'Checking' },
    { value: 'savings', label: 'Savings' },
    { value: 'salary', label: 'Salary' },
    { value: 'investment', label: 'Investment' },
];

export function OnboardingAccountStep({
    accName, setAccName, balance, setBalance, currency, setCurrency,
    accountType, setAccountType, loading, onSubmit, onSkip, onBack,
}: OnboardingAccountStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Wallet className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-h2 lg:text-h2-lg text-slate-900 dark:text-white">Add Primary Account</h2>
                    <p className="text-slate-500 text-sm">Where does your money live?</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Name</label>
                    <input type="text" value={accName} onChange={(e) => setAccName(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="e.g. Chase Checking" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Type</label>
                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                        {accountTypes.map(t => (
                            <button key={t.value} type="button" onClick={() => setAccountType(t.value)}
                                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${accountType === t.value ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
                        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                            <button onClick={() => setCurrency('USD')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currency === 'USD' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}>USD</button>
                            <button onClick={() => setCurrency('NGN')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currency === 'NGN' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}>NGN</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Balance</label>
                        <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)}
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="0.00" />
                    </div>
                </div>

                <button onClick={onSubmit} disabled={!accName || !balance || loading}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    {loading ? 'Creating...' : 'Continue'}
                </button>

                <div className="text-center flex justify-center gap-4">
                    <button onClick={onBack} className="min-h-11 px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">← Back</button>
                    <button onClick={onSkip} className="min-h-11 px-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">Skip for now →</button>
                </div>
            </div>
        </div>
    );
}
