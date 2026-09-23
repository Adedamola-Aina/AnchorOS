/**
 * OnboardingView - 4-step "Getting Started" onboarding experience
 *
 * Part 1 of the two-part onboarding system.
 * Steps: Welcome → Account → Commitment → Security
 * Refactored.
 */
// @ts-nocheck


import { useState, useCallback } from 'react';
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
  /** UX-OB-06: resume where the user left off; progress is persisted per step. */
  const savedStep = profile.onboardingProgress?.gettingStartedStep;
  const [step, setStep] = useState<number>(
    typeof savedStep === 'number' && savedStep >= 1 && savedStep <= TOTAL_STEPS ? savedStep : 1,
  );

  const goToStep = useCallback((next: number) => {
    setStep(next);
    void updateProfile({
      onboardingProgress: {
        gettingStartedStep: next,
        securityStepSeen: profile.onboardingProgress?.securityStepSeen ?? false,
        beyondBasicsComplete: profile.onboardingProgress?.beyondBasicsComplete ?? false,
        completedItems: profile.onboardingProgress?.completedItems ?? [],
      },
    });
  }, [profile.onboardingProgress, updateProfile]);
  const [loading, setLoading] = useState(false);

  // Account form state
  //
  // UX-OB-03: these used to start at 'Main Checking' / 'Read for 15 mins', so a
  // user tapping straight through committed the sample text as real data — the
  // product manufactured junk by default. Suggested names are now *placeholders*
  // and the suggestion chips on the habit step are opt-in, so nothing is created
  // unless the user chooses it (doc 18 §4.4.3).
  const [accName, setAccName] = useState('');
  const [balance, setBalance] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [accountType, setAccountType] = useState<AccountType>('checking');

  // Goal form state (PRD-007)
  const [goalTitle, setGoalTitle] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('savings');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');

  /**
   * UX-OB-02: every step used to persist through a different path (`addAccount`,
   * `secureDb.addDocument`, `addTask`, `updateProfile`) and only some of them
   * handled failure — two had no try/catch at all, so a failed write left the
   * user on a step that looked fine with nothing saved.
   *
   * One contract now: attempt the write, advance only if it succeeded, and on
   * failure say what happened and stay put with the answers still in the form.
   * The user can simply press the same button again.
   */
  const runStep = async (what: string, persist: () => Promise<void>, advance: () => void) => {
    setLoading(true);
    try {
      await persist();
      advance();
    } catch (e) {
      captureError(e, `Onboarding.${what}`);
      showToast(`Couldn't save ${what}. Nothing was lost — try again.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (name: string) => {
    await runStep(
      'your name',
      () => updateProfile({ name, onboardingComplete: false }),
      () => goToStep(2),
    );
  };

  const handleSkip = async () => {
    await runStep(
      'your progress',
      () => updateProfile({
        onboardingComplete: true,
        onboardingProgress: { gettingStartedStep: step, securityStepSeen: step >= 5, beyondBasicsComplete: false, completedItems: [] },
      }),
      () => { /* the app leaves onboarding once onboardingComplete is set */ },
    );
  };

  const handleCreateAccount = async () => {
    // UX-OB-03: the UI already disables this button while the name or balance
    // is empty; this guard makes "nothing is created unless chosen" a property
    // of the handler too, so a stray submit cannot manufacture a default account.
    if (!accName.trim() || !balance) {
      showToast('Add an account name and its current balance to continue.', 'error');
      return;
    }
    await runStep(
      'your account',
      () => addAccount({
        name: accName.trim(),
        type: accountType,
        currency,
        balanceCents: toCents(balance),
        color: 'bg-blue-500',
        scope: profile.familyMode ? 'family' : 'personal',
      }),
      () => goToStep(3),
    );
  };

  const handleCreateGoal = async () => {
    const uid = user?.uid;
    // RA-13 (#171): guard the write too — the rules reject non-positive targets.
    const targetAmountCents = toCents(goalAmount);
    if (!uid) {
      showToast('You need to be signed in to save a goal.', 'error');
      return;
    }
    if (targetAmountCents <= 0) {
      showToast('Enter a target amount greater than zero.', 'error');
      return;
    }
    await runStep(
      'your goal',
      () => secureDb.addDocument(uid, 'goals', {
        title: goalTitle,
        targetAmountCents,
        currentAmountCents: 0,
        currency,
        goalType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      () => goToStep(4),
    );
  };

  const handleCreateTask = async () => {
    // UX-OB-03: same contract as the account step — no default commitment.
    if (!taskTitle.trim()) {
      showToast('Name the habit you want to commit to.', 'error');
      return;
    }
    await runStep(
      'your habit',
      () => addTask({
        title: taskTitle.trim(),
        type: 'daily',
        completed: false,
        category: 'personal',
        timeOfDay: 'morning',
      }),
      () => goToStep(5),
    );
  };

  const handleSecurityComplete = async () => {
    // UX-OB-02: this had no error handling either — a failed write meant the user
    // never left onboarding and never learned why.
    await runStep(
      'your security choices',
      () => updateProfile({
        onboardingComplete: true,
        onboardingProgress: { gettingStartedStep: 5, securityStepSeen: true, beyondBasicsComplete: false, completedItems: [] },
      }),
      () => { /* the app leaves onboarding once onboardingComplete is set */ },
    );
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-lg">
        <div className="mb-2 flex justify-center">
          <StateIllustration kind="onboarding" className="w-52 h-32" testId="onboarding-illustration" />
        </div>
        <OnboardingProgress currentStep={step} totalSteps={TOTAL_STEPS} />

        {step === 1 && (
          <GettingStartedWelcome
            userName={profile.name}
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
            onSkip={() => goToStep(3)} onBack={() => goToStep(1)}
          />
        )}

        {step === 3 && (
          <OnboardingGoalStep
            goalTitle={goalTitle} setGoalTitle={setGoalTitle}
            goalAmount={goalAmount} setGoalAmount={setGoalAmount}
            goalType={goalType} setGoalType={setGoalType}
            loading={loading} onSubmit={handleCreateGoal}
            onSkip={() => goToStep(4)} onBack={() => goToStep(2)}
          />
        )}

        {step === 4 && (
          <OnboardingHabitStep
            taskTitle={taskTitle} setTaskTitle={setTaskTitle}
            loading={loading} onSubmit={handleCreateTask}
            onSkip={() => goToStep(5)} onBack={() => goToStep(3)}
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
            onBack={() => goToStep(4)}
          />
        )}
      </div>
    </div>
  );
};
