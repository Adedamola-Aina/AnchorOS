/**
 * OnboardingView - Multi-step onboarding experience
 * 
 * Refactored per CLAUDE.md 200-line rule.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { useKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';
import { toCents } from '../../utils/moneyUtils';
import { OnboardingWelcome } from './components/OnboardingWelcome';
import { OnboardingAccountStep } from './components/OnboardingAccountStep';
import { OnboardingHabitStep } from './components/OnboardingHabitStep';

type AccountType = 'checking' | 'savings' | 'salary' | 'investment';

export const OnboardingView = () => {
    // KB-001: Ensure keyboard doesn't cover inputs on mobile
    useKeyboardAvoidance();
    
    const { profile, updateProfile } = useAuth();
    const { addAccount } = useFinance();
    const { addTask } = useTasks();
    const { showToast } = useNotifications();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Account form state
    const [accName, setAccName] = useState('Main Checking');
    const [balance, setBalance] = useState('');
    const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
    const [accountType, setAccountType] = useState<AccountType>('checking');

    // Task form state
    const [taskTitle, setTaskTitle] = useState('Read for 15 mins');

    const handleStart = async () => {
        await updateProfile({ onboardingComplete: false });
        setStep(2);
    };

    const handleSkip = async () => {
        await updateProfile({ onboardingComplete: true });
    };

    const handleCreateAccount = async () => {
        setLoading(true);
        try {
            await addAccount({
                name: accName,
                type: accountType,
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
                {/* Progress Indicator */}
                <div className="text-center mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Step {step} of 3
                    </span>
                    <div className="flex justify-center gap-2 mt-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 w-12 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                        ))}
                    </div>
                </div>

                {step === 1 && (
                    <OnboardingWelcome userName={profile.name || 'User'} onStart={handleStart} onSkip={handleSkip} />
                )}

                {step === 2 && (
                    <OnboardingAccountStep
                        accName={accName} setAccName={setAccName}
                        balance={balance} setBalance={setBalance}
                        currency={currency} setCurrency={setCurrency}
                        accountType={accountType} setAccountType={setAccountType}
                        loading={loading} onSubmit={handleCreateAccount} onSkip={handleSkip}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <OnboardingHabitStep
                        taskTitle={taskTitle} setTaskTitle={setTaskTitle}
                        loading={loading} onSubmit={handleCreateTask} onSkip={handleSkip}
                        onBack={() => setStep(2)}
                    />
                )}
            </div>
        </div>
    );
};
