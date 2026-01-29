/**
 * OnboardingAccountStep - Step 2: Create primary account
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
}
const accountTypes: {
  value: AccountType;
  label: string;
}[] = stryMutAct_9fa48("5368") ? [] : (stryCov_9fa48("5368"), [stryMutAct_9fa48("5369") ? {} : (stryCov_9fa48("5369"), {
  value: stryMutAct_9fa48("5370") ? "" : (stryCov_9fa48("5370"), 'checking'),
  label: stryMutAct_9fa48("5371") ? "" : (stryCov_9fa48("5371"), 'Checking')
}), stryMutAct_9fa48("5372") ? {} : (stryCov_9fa48("5372"), {
  value: stryMutAct_9fa48("5373") ? "" : (stryCov_9fa48("5373"), 'savings'),
  label: stryMutAct_9fa48("5374") ? "" : (stryCov_9fa48("5374"), 'Savings')
}), stryMutAct_9fa48("5375") ? {} : (stryCov_9fa48("5375"), {
  value: stryMutAct_9fa48("5376") ? "" : (stryCov_9fa48("5376"), 'salary'),
  label: stryMutAct_9fa48("5377") ? "" : (stryCov_9fa48("5377"), 'Salary')
}), stryMutAct_9fa48("5378") ? {} : (stryCov_9fa48("5378"), {
  value: stryMutAct_9fa48("5379") ? "" : (stryCov_9fa48("5379"), 'investment'),
  label: stryMutAct_9fa48("5380") ? "" : (stryCov_9fa48("5380"), 'Investment')
})]);
export function OnboardingAccountStep({
  accName,
  setAccName,
  balance,
  setBalance,
  currency,
  setCurrency,
  accountType,
  setAccountType,
  loading,
  onSubmit,
  onSkip
}: OnboardingAccountStepProps) {
  if (stryMutAct_9fa48("5381")) {
    {}
  } else {
    stryCov_9fa48("5381");
    return <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
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
                    <input type="text" value={accName} onChange={stryMutAct_9fa48("5382") ? () => undefined : (stryCov_9fa48("5382"), e => setAccName(e.target.value))} className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g. Chase Checking" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Type</label>
                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                        {accountTypes.map(stryMutAct_9fa48("5383") ? () => undefined : (stryCov_9fa48("5383"), t => <button key={t.value} type="button" onClick={stryMutAct_9fa48("5384") ? () => undefined : (stryCov_9fa48("5384"), () => setAccountType(t.value))} className={stryMutAct_9fa48("5385") ? `` : (stryCov_9fa48("5385"), `flex-1 py-3 rounded-lg text-sm font-bold transition-all ${(stryMutAct_9fa48("5388") ? accountType !== t.value : stryMutAct_9fa48("5387") ? false : stryMutAct_9fa48("5386") ? true : (stryCov_9fa48("5386", "5387", "5388"), accountType === t.value)) ? stryMutAct_9fa48("5389") ? "" : (stryCov_9fa48("5389"), 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white') : stryMutAct_9fa48("5390") ? "" : (stryCov_9fa48("5390"), 'text-slate-400')}`)}>
                                {t.label}
                            </button>))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
                        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800">
                            <button onClick={stryMutAct_9fa48("5391") ? () => undefined : (stryCov_9fa48("5391"), () => setCurrency(stryMutAct_9fa48("5392") ? "" : (stryCov_9fa48("5392"), 'USD')))} className={stryMutAct_9fa48("5393") ? `` : (stryCov_9fa48("5393"), `flex-1 py-3 rounded-lg text-sm font-bold transition-all ${(stryMutAct_9fa48("5396") ? currency !== 'USD' : stryMutAct_9fa48("5395") ? false : stryMutAct_9fa48("5394") ? true : (stryCov_9fa48("5394", "5395", "5396"), currency === (stryMutAct_9fa48("5397") ? "" : (stryCov_9fa48("5397"), 'USD')))) ? stryMutAct_9fa48("5398") ? "" : (stryCov_9fa48("5398"), 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white') : stryMutAct_9fa48("5399") ? "" : (stryCov_9fa48("5399"), 'text-slate-400')}`)}>USD</button>
                            <button onClick={stryMutAct_9fa48("5400") ? () => undefined : (stryCov_9fa48("5400"), () => setCurrency(stryMutAct_9fa48("5401") ? "" : (stryCov_9fa48("5401"), 'NGN')))} className={stryMutAct_9fa48("5402") ? `` : (stryCov_9fa48("5402"), `flex-1 py-3 rounded-lg text-sm font-bold transition-all ${(stryMutAct_9fa48("5405") ? currency !== 'NGN' : stryMutAct_9fa48("5404") ? false : stryMutAct_9fa48("5403") ? true : (stryCov_9fa48("5403", "5404", "5405"), currency === (stryMutAct_9fa48("5406") ? "" : (stryCov_9fa48("5406"), 'NGN')))) ? stryMutAct_9fa48("5407") ? "" : (stryCov_9fa48("5407"), 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white') : stryMutAct_9fa48("5408") ? "" : (stryCov_9fa48("5408"), 'text-slate-400')}`)}>NGN</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Balance</label>
                        <input type="number" value={balance} onChange={stryMutAct_9fa48("5409") ? () => undefined : (stryCov_9fa48("5409"), e => setBalance(e.target.value))} className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="0.00" />
                    </div>
                </div>

                <button onClick={onSubmit} disabled={stryMutAct_9fa48("5412") ? (!accName || !balance) && loading : stryMutAct_9fa48("5411") ? false : stryMutAct_9fa48("5410") ? true : (stryCov_9fa48("5410", "5411", "5412"), (stryMutAct_9fa48("5414") ? !accName && !balance : stryMutAct_9fa48("5413") ? false : (stryCov_9fa48("5413", "5414"), (stryMutAct_9fa48("5415") ? accName : (stryCov_9fa48("5415"), !accName)) || (stryMutAct_9fa48("5416") ? balance : (stryCov_9fa48("5416"), !balance)))) || loading)} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
                    {loading ? stryMutAct_9fa48("5417") ? "" : (stryCov_9fa48("5417"), 'Creating...') : stryMutAct_9fa48("5418") ? "" : (stryCov_9fa48("5418"), 'Continue')}
                </button>

                <div className="text-center">
                    <button onClick={onSkip} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Skip for now →</button>
                </div>
            </div>
        </div>;
  }
}