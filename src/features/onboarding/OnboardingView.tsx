import { useState } from 'react';
import { ArrowRight, Wallet, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnchorLogo } from '../../components/shared';
import { toCents } from '../../utils/moneyUtils';

export const OnboardingView = () => {
    const { profile, updateProfile } = useAuth();
    const { addAccount } = useFinance();
    const { addTask } = useTasks();
    const { showToast } = useNotifications();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        await updateProfile({ onboardingComplete: false });
        setStep(2);
    };

    const [accName, setAccName] = useState('Main Checking');
    const [balance, setBalance] = useState('');
    const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');

    const [taskTitle, setTaskTitle] = useState('Read for 15 mins');

    const handleCreateAccount = async () => {
        setLoading(true);
        try {
            await addAccount({
                name: accName,
                type: 'checking',
                currency,
                balanceCents: toCents(balance),
                color: 'bg-blue-500',
                scope: profile.familyMode ? 'family' : 'personal'
            });
            setStep(3);
        } catch (e) {
            console.error(e);
            showToast('Failed to create account.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        setLoading(true);
        try {
            await addTask({
                title: taskTitle,
                type: 'daily',
                completed: false,
                category: 'personal',
                timeOfDay: 'morning'
            });
            await updateProfile({ onboardingComplete: true });
        } catch (e) {
            console.error(e);
            showToast('Failed to create task.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
            <div className="w-full max-w-lg">
                {step === 1 && (
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex justify-center mb-6">
                            <AnchorLogo className="w-20 h-20 text-slate-900 dark:text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Welcome aboard, <span className="text-blue-500">{profile.name}</span>.
                        </h1>
                        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed">
                            Anchor OS is designed to organize your financial life and daily commitments in one unified system.
                        </p>
                        <button
                            onClick={handleStart}
                            className="group bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                        >
                            Start Setup
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Primary Account</h2>
                                <p className="text-slate-500 text-sm">Where does your money live?</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={accName}
                                    onChange={(e) => setAccName(e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="e.g. Chase Checking"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
                                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                                        <button
                                            onClick={() => setCurrency('USD')}
                                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currency === 'USD' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}
                                        >
                                            USD
                                        </button>
                                        <button
                                            onClick={() => setCurrency('NGN')}
                                            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${currency === 'NGN' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}
                                        >
                                            NGN
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Balance</label>
                                    <input
                                        type="number"
                                        value={balance}
                                        onChange={(e) => setBalance(e.target.value)}
                                        className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreateAccount}
                                disabled={!accName || !balance || loading}
                                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? 'Creating...' : 'Continue'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">One Small Habit</h2>
                                <p className="text-slate-500 text-sm">Consistency starts with one daily action.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">I commit to...</label>
                                <input
                                    type="text"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    placeholder="e.g. Drink water, Read pages, Exercise"
                                />
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {['Drink 2L Water', 'Read 15 Mins', 'Walk 5000 Steps', 'Review Finances'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setTaskTitle(s)}
                                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleCreateTask}
                                disabled={!taskTitle || loading}
                                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? 'Committing...' : 'Finish Setup'} <Sparkles className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
