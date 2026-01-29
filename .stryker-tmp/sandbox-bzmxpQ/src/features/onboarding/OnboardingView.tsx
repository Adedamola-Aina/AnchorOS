/**
 * OnboardingView - Multi-step onboarding experience
 * 
 * Refactored per CLAUDE.md 200-line rule.
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { toCents } from '../../utils/moneyUtils';
import { OnboardingWelcome } from './components/OnboardingWelcome';
import { OnboardingAccountStep } from './components/OnboardingAccountStep';
import { OnboardingHabitStep } from './components/OnboardingHabitStep';
type AccountType = 'checking' | 'savings' | 'salary' | 'investment';
export const OnboardingView = () => {
  if (stryMutAct_9fa48("5250")) {
    {}
  } else {
    stryCov_9fa48("5250");
    const {
      profile,
      updateProfile
    } = useAuth();
    const {
      addAccount
    } = useFinance();
    const {
      addTask
    } = useTasks();
    const {
      showToast
    } = useNotifications();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(stryMutAct_9fa48("5251") ? true : (stryCov_9fa48("5251"), false));

    // Account form state
    const [accName, setAccName] = useState(stryMutAct_9fa48("5252") ? "" : (stryCov_9fa48("5252"), 'Main Checking'));
    const [balance, setBalance] = useState(stryMutAct_9fa48("5253") ? "Stryker was here!" : (stryCov_9fa48("5253"), ''));
    const [currency, setCurrency] = useState<'USD' | 'NGN'>(stryMutAct_9fa48("5254") ? "" : (stryCov_9fa48("5254"), 'USD'));
    const [accountType, setAccountType] = useState<AccountType>(stryMutAct_9fa48("5255") ? "" : (stryCov_9fa48("5255"), 'checking'));

    // Task form state
    const [taskTitle, setTaskTitle] = useState(stryMutAct_9fa48("5256") ? "" : (stryCov_9fa48("5256"), 'Read for 15 mins'));
    const handleStart = async () => {
      if (stryMutAct_9fa48("5257")) {
        {}
      } else {
        stryCov_9fa48("5257");
        await updateProfile(stryMutAct_9fa48("5258") ? {} : (stryCov_9fa48("5258"), {
          onboardingComplete: stryMutAct_9fa48("5259") ? true : (stryCov_9fa48("5259"), false)
        }));
        setStep(2);
      }
    };
    const handleSkip = async () => {
      if (stryMutAct_9fa48("5260")) {
        {}
      } else {
        stryCov_9fa48("5260");
        await updateProfile(stryMutAct_9fa48("5261") ? {} : (stryCov_9fa48("5261"), {
          onboardingComplete: stryMutAct_9fa48("5262") ? false : (stryCov_9fa48("5262"), true)
        }));
      }
    };
    const handleCreateAccount = async () => {
      if (stryMutAct_9fa48("5263")) {
        {}
      } else {
        stryCov_9fa48("5263");
        setLoading(stryMutAct_9fa48("5264") ? false : (stryCov_9fa48("5264"), true));
        try {
          if (stryMutAct_9fa48("5265")) {
            {}
          } else {
            stryCov_9fa48("5265");
            await addAccount(stryMutAct_9fa48("5266") ? {} : (stryCov_9fa48("5266"), {
              name: accName,
              type: accountType,
              currency,
              balanceCents: toCents(balance),
              color: stryMutAct_9fa48("5267") ? "" : (stryCov_9fa48("5267"), 'bg-blue-500'),
              scope: profile.familyMode ? stryMutAct_9fa48("5268") ? "" : (stryCov_9fa48("5268"), 'family') : stryMutAct_9fa48("5269") ? "" : (stryCov_9fa48("5269"), 'personal')
            }));
            setStep(3);
          }
        } catch (e) {
          if (stryMutAct_9fa48("5270")) {
            {}
          } else {
            stryCov_9fa48("5270");
            console.error(e);
            showToast(stryMutAct_9fa48("5271") ? "" : (stryCov_9fa48("5271"), 'Failed to create account.'), stryMutAct_9fa48("5272") ? "" : (stryCov_9fa48("5272"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("5273")) {
            {}
          } else {
            stryCov_9fa48("5273");
            setLoading(stryMutAct_9fa48("5274") ? true : (stryCov_9fa48("5274"), false));
          }
        }
      }
    };
    const handleCreateTask = async () => {
      if (stryMutAct_9fa48("5275")) {
        {}
      } else {
        stryCov_9fa48("5275");
        setLoading(stryMutAct_9fa48("5276") ? false : (stryCov_9fa48("5276"), true));
        try {
          if (stryMutAct_9fa48("5277")) {
            {}
          } else {
            stryCov_9fa48("5277");
            await addTask(stryMutAct_9fa48("5278") ? {} : (stryCov_9fa48("5278"), {
              title: taskTitle,
              type: stryMutAct_9fa48("5279") ? "" : (stryCov_9fa48("5279"), 'daily'),
              completed: stryMutAct_9fa48("5280") ? true : (stryCov_9fa48("5280"), false),
              category: stryMutAct_9fa48("5281") ? "" : (stryCov_9fa48("5281"), 'personal'),
              timeOfDay: stryMutAct_9fa48("5282") ? "" : (stryCov_9fa48("5282"), 'morning')
            }));
            await updateProfile(stryMutAct_9fa48("5283") ? {} : (stryCov_9fa48("5283"), {
              onboardingComplete: stryMutAct_9fa48("5284") ? false : (stryCov_9fa48("5284"), true)
            }));
          }
        } catch (e) {
          if (stryMutAct_9fa48("5285")) {
            {}
          } else {
            stryCov_9fa48("5285");
            console.error(e);
            showToast(stryMutAct_9fa48("5286") ? "" : (stryCov_9fa48("5286"), 'Failed to create task.'), stryMutAct_9fa48("5287") ? "" : (stryCov_9fa48("5287"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("5288")) {
            {}
          } else {
            stryCov_9fa48("5288");
            setLoading(stryMutAct_9fa48("5289") ? true : (stryCov_9fa48("5289"), false));
          }
        }
      }
    };
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
            <div className="w-full max-w-lg">
                {/* Progress Indicator */}
                <div className="text-center mb-6">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Step {step} of 3
                    </span>
                    <div className="flex justify-center gap-2 mt-2">
                        {(stryMutAct_9fa48("5290") ? [] : (stryCov_9fa48("5290"), [1, 2, 3])).map(stryMutAct_9fa48("5291") ? () => undefined : (stryCov_9fa48("5291"), s => <div key={s} className={stryMutAct_9fa48("5292") ? `` : (stryCov_9fa48("5292"), `h-1.5 w-12 rounded-full transition-all ${(stryMutAct_9fa48("5296") ? s > step : stryMutAct_9fa48("5295") ? s < step : stryMutAct_9fa48("5294") ? false : stryMutAct_9fa48("5293") ? true : (stryCov_9fa48("5293", "5294", "5295", "5296"), s <= step)) ? stryMutAct_9fa48("5297") ? "" : (stryCov_9fa48("5297"), 'bg-blue-500') : stryMutAct_9fa48("5298") ? "" : (stryCov_9fa48("5298"), 'bg-slate-200 dark:bg-slate-800')}`)} />))}
                    </div>
                </div>

                {stryMutAct_9fa48("5301") ? step === 1 || <OnboardingWelcome userName={profile.name || 'User'} onStart={handleStart} onSkip={handleSkip} /> : stryMutAct_9fa48("5300") ? false : stryMutAct_9fa48("5299") ? true : (stryCov_9fa48("5299", "5300", "5301"), (stryMutAct_9fa48("5303") ? step !== 1 : stryMutAct_9fa48("5302") ? true : (stryCov_9fa48("5302", "5303"), step === 1)) && <OnboardingWelcome userName={stryMutAct_9fa48("5306") ? profile.name && 'User' : stryMutAct_9fa48("5305") ? false : stryMutAct_9fa48("5304") ? true : (stryCov_9fa48("5304", "5305", "5306"), profile.name || (stryMutAct_9fa48("5307") ? "" : (stryCov_9fa48("5307"), 'User')))} onStart={handleStart} onSkip={handleSkip} />)}

                {stryMutAct_9fa48("5310") ? step === 2 || <OnboardingAccountStep accName={accName} setAccName={setAccName} balance={balance} setBalance={setBalance} currency={currency} setCurrency={setCurrency} accountType={accountType} setAccountType={setAccountType} loading={loading} onSubmit={handleCreateAccount} onSkip={handleSkip} /> : stryMutAct_9fa48("5309") ? false : stryMutAct_9fa48("5308") ? true : (stryCov_9fa48("5308", "5309", "5310"), (stryMutAct_9fa48("5312") ? step !== 2 : stryMutAct_9fa48("5311") ? true : (stryCov_9fa48("5311", "5312"), step === 2)) && <OnboardingAccountStep accName={accName} setAccName={setAccName} balance={balance} setBalance={setBalance} currency={currency} setCurrency={setCurrency} accountType={accountType} setAccountType={setAccountType} loading={loading} onSubmit={handleCreateAccount} onSkip={handleSkip} />)}

                {stryMutAct_9fa48("5315") ? step === 3 || <OnboardingHabitStep taskTitle={taskTitle} setTaskTitle={setTaskTitle} loading={loading} onSubmit={handleCreateTask} onSkip={handleSkip} /> : stryMutAct_9fa48("5314") ? false : stryMutAct_9fa48("5313") ? true : (stryCov_9fa48("5313", "5314", "5315"), (stryMutAct_9fa48("5317") ? step !== 3 : stryMutAct_9fa48("5316") ? true : (stryCov_9fa48("5316", "5317"), step === 3)) && <OnboardingHabitStep taskTitle={taskTitle} setTaskTitle={setTaskTitle} loading={loading} onSubmit={handleCreateTask} onSkip={handleSkip} />)}
            </div>
        </div>;
  }
};