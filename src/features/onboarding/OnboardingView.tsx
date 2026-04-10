/**
 * OnboardingView - 4-step "Getting Started" onboarding experience
 *
 * Part 1 of the two-part onboarding system.
 * Steps: Welcome → Account → Commitment → Security
 * Refactored per CLAUDE.md 200-line rule.
 */
// @ts-nocheck


import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { captureError } from '../../utils/error';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { useKeyboardAvoidance } from '../../hooks/useKeyboardAvoidance';
import { toCents } from '../../utils/moneyUtils';
import { secureDb } from '../../utils/secureDb';
import { GettingStartedWelcome } from './components/GettingStartedWelcome';
import { OnboardingAccountStep } from './components/OnboardingAccountStep';
import { OnboardingGoalStep } from './components/OnboardingGoalStep';
import { OnboardingHabitStep } from './components/OnboardingHabitStep';
import { GettingStartedSecurity } from './components/GettingStartedSecurity';
import { OnboardingProgress } from './components/OnboardingProgress';
import { StateIllustration } from '../../components/illustrations';

const TOTAL_STEPS = 5;
type AccountType = 'checking' | 'savings' | 'salary' | 'investment';
type GoalType = 'savings' | 'debt_payoff' | 'investment' | 'emergency_fund' | 'other';

export const OnboardingView = () => {
  useKeyboardAvoidance();

  const { profile, updateProfile, sendVerificationEmail, user } = useAuth();
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

  // Goal form state (PRD-007)
  const [goalTitle, setGoalTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('savings');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('Read for 15 mins');

  const handleStart = async (name: string) => {
    await updateProfile({ name, onboardingComplete: false });
    setStep(2);
  };

  const handleSkip = async () => {
    await updateProfile({
      onboardingComplete: true,
      onboardingProgress: { gettingStartedStep: step, securityStepSeen: step >= 5, beyondBasicsComplete: false, completedItems: [] },
    });
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
        scope: profile.familyMode ? 'family' : 'personal',
      });
      setStep(3);
    } catch (e) {
      captureError(e, 'Onboarding.createAccount');
      showToast('Failed to create account.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    setLoading(true);
    try {
      const uid = user?.uid;
      if (!uid) throw new Error('User not authenticated');
      await secureDb.addDocument(uid, 'goals', {
        title: goalTitle,
        targetAmountCents: toCents(goalAmount),
        currentAmountCents: 0,
        currency,
        goalType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setStep(4);
    } catch (e) {
      captureError(e, 'Onboarding.createGoal');
      showToast('Failed to save goal.', 'error');
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
        timeOfDay: 'morning',
      });
      setStep(5);
    } catch (e) {
      captureError(e, 'Onboarding.createTask');
      showToast('Failed to create task.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityComplete = async () => {
    await updateProfile({
      onboardingComplete: true,
      onboardingProgress: { gettingStartedStep: 5, securityStepSeen: true, beyondBasicsComplete: false, completedItems: [] },
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-lg">
        <div className="mb-2 flex justify-center">
          <StateIllustration kind="onboarding" className="w-52 h-32" testId="onboarding-illustration" />
        </div>
        <OnboardingProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <GettingStartedWelcome
            userName={profile.name || 'User'}
            onStart={handleStart}
            onSkip={handleSkip}
          />
        )}

        {step === 2 && (
          <OnboardingAccountStep
            accName={accName} setAccName={setAccName}
            balance={balance} setBalance={setBalance}
            currency={currency} setCurrency={setCurrency}
            accountType={accountType} setAccountType={setAccountType}
            loading={loading} onSubmit={handleCreateAccount}
            onSkip={handleSkip} onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <OnboardingGoalStep
            goalTitle={goalTitle} setGoalTitle={setGoalTitle}
            goalAmount={goalAmount} setGoalAmount={setGoalAmount}
            goalType={goalType} setGoalType={setGoalType}
            loading={loading} onSubmit={handleCreateGoal}
            onSkip={() => setStep(4)} onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <OnboardingHabitStep
            taskTitle={taskTitle} setTaskTitle={setTaskTitle}
            loading={loading} onSubmit={handleCreateTask}
            onSkip={handleSkip} onBack={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <GettingStartedSecurity
            emailVerified={user?.emailVerified ?? false}
            mfaEnabled={profile.mfaEnabled ?? false}
            onVerifyEmail={sendVerificationEmail}
            onEnableMfa={() => showToast('MFA setup will open in Settings after onboarding.', 'info')}
            onFinish={handleSecurityComplete}
            onSkip={handleSecurityComplete}
            onBack={() => setStep(4)}
          />
        )}
      </div>
    </div>
  );
};
