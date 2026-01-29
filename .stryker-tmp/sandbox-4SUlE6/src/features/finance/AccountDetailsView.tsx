/**
 * AccountDetailsView - Account detail page with insights and transactions
 * Refactored per CLAUDE.md §3.2 (200-line rule).
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
import { useState, useMemo } from 'react';
import type { AnchorAccount, AnchorTransaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { getWeeklySpending, detectRecurring } from '../../utils/financeInsights';
import { NotificationBanner } from './NotificationBanner';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { useAccountActivity } from '../../hooks/useAccountActivity';
import { AccountHeader, RecurringTransactionsList, SpendingTrendsChart } from './components';
import { SharedActivitySection } from './components/SharedActivitySection';
import { VirtualTransactionList } from './components/VirtualTransactionList';
import { TransactionFilterHeader } from './components/TransactionListParts';
interface AccountDetailsViewProps {
  account: AnchorAccount;
  onBack: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  onTransfer?: () => void;
  onPayBill?: () => void;
  onEdit?: (tx: AnchorTransaction) => void;
  familyMemberId?: string | null;
}
export const AccountDetailsView = ({
  account,
  onBack,
  onDelete,
  onShare,
  onTransfer,
  onPayBill,
  onEdit,
  familyMemberId
}: AccountDetailsViewProps) => {
  if (stryMutAct_9fa48("3328")) {
    {}
  } else {
    stryCov_9fa48("3328");
    const {
      transactions,
      deleteTransaction,
      renameAccount
    } = useFinance();
    const {
      user
    } = useAuth();
    const [searchQuery, setSearchQuery] = useState(stryMutAct_9fa48("3329") ? "Stryker was here!" : (stryCov_9fa48("3329"), ''));
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(stryMutAct_9fa48("3330") ? "" : (stryCov_9fa48("3330"), 'all'));
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
    const [isEditingName, setIsEditingName] = useState(stryMutAct_9fa48("3331") ? true : (stryCov_9fa48("3331"), false));
    const [newName, setNewName] = useState(account.name);
    const [isRenaming, setIsRenaming] = useState(stryMutAct_9fa48("3332") ? true : (stryCov_9fa48("3332"), false));
    const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
    const isOwner = stryMutAct_9fa48("3335") ? !account.ownerId && account.ownerId === user?.uid : stryMutAct_9fa48("3334") ? false : stryMutAct_9fa48("3333") ? true : (stryCov_9fa48("3333", "3334", "3335"), (stryMutAct_9fa48("3336") ? account.ownerId : (stryCov_9fa48("3336"), !account.ownerId)) || (stryMutAct_9fa48("3338") ? account.ownerId !== user?.uid : stryMutAct_9fa48("3337") ? false : (stryCov_9fa48("3337", "3338"), account.ownerId === (stryMutAct_9fa48("3339") ? user.uid : (stryCov_9fa48("3339"), user?.uid)))));
    const isSharedAccount = Boolean(stryMutAct_9fa48("3342") ? account.sharedWith && Object.keys(account.sharedWith).length > 0 && account.ownerId && account.ownerId !== user?.uid : stryMutAct_9fa48("3341") ? false : stryMutAct_9fa48("3340") ? true : (stryCov_9fa48("3340", "3341", "3342"), (stryMutAct_9fa48("3344") ? account.sharedWith || Object.keys(account.sharedWith).length > 0 : stryMutAct_9fa48("3343") ? false : (stryCov_9fa48("3343", "3344"), account.sharedWith && (stryMutAct_9fa48("3347") ? Object.keys(account.sharedWith).length <= 0 : stryMutAct_9fa48("3346") ? Object.keys(account.sharedWith).length >= 0 : stryMutAct_9fa48("3345") ? true : (stryCov_9fa48("3345", "3346", "3347"), Object.keys(account.sharedWith).length > 0)))) || (stryMutAct_9fa48("3349") ? account.ownerId || account.ownerId !== user?.uid : stryMutAct_9fa48("3348") ? false : (stryCov_9fa48("3348", "3349"), account.ownerId && (stryMutAct_9fa48("3351") ? account.ownerId === user?.uid : stryMutAct_9fa48("3350") ? true : (stryCov_9fa48("3350", "3351"), account.ownerId !== (stryMutAct_9fa48("3352") ? user.uid : (stryCov_9fa48("3352"), user?.uid))))))));
    const {
      activities,
      loading: loadingActivities
    } = useAccountActivity(stryMutAct_9fa48("3353") ? {} : (stryCov_9fa48("3353"), {
      accountId: account.id,
      accountOwnerId: stryMutAct_9fa48("3356") ? (account.ownerId || user?.uid) && '' : stryMutAct_9fa48("3355") ? false : stryMutAct_9fa48("3354") ? true : (stryCov_9fa48("3354", "3355", "3356"), (stryMutAct_9fa48("3358") ? account.ownerId && user?.uid : stryMutAct_9fa48("3357") ? false : (stryCov_9fa48("3357", "3358"), account.ownerId || (stryMutAct_9fa48("3359") ? user.uid : (stryCov_9fa48("3359"), user?.uid)))) || (stryMutAct_9fa48("3360") ? "Stryker was here!" : (stryCov_9fa48("3360"), ''))),
      enabled: isSharedAccount
    }));
    const accountTransactions = useMemo(stryMutAct_9fa48("3361") ? () => undefined : (stryCov_9fa48("3361"), () => stryMutAct_9fa48("3362") ? transactions || [] : (stryCov_9fa48("3362"), (stryMutAct_9fa48("3365") ? transactions && [] : stryMutAct_9fa48("3364") ? false : stryMutAct_9fa48("3363") ? true : (stryCov_9fa48("3363", "3364", "3365"), transactions || (stryMutAct_9fa48("3366") ? ["Stryker was here"] : (stryCov_9fa48("3366"), [])))).filter(stryMutAct_9fa48("3367") ? () => undefined : (stryCov_9fa48("3367"), t => stryMutAct_9fa48("3370") ? t?.accountId !== account.id : stryMutAct_9fa48("3369") ? false : stryMutAct_9fa48("3368") ? true : (stryCov_9fa48("3368", "3369", "3370"), (stryMutAct_9fa48("3371") ? t.accountId : (stryCov_9fa48("3371"), t?.accountId)) === account.id))))), stryMutAct_9fa48("3372") ? [] : (stryCov_9fa48("3372"), [transactions, account.id]));
    const weeklyData = useMemo(stryMutAct_9fa48("3373") ? () => undefined : (stryCov_9fa48("3373"), () => getWeeklySpending(accountTransactions)), stryMutAct_9fa48("3374") ? [] : (stryCov_9fa48("3374"), [accountTransactions]));
    const recurring = useMemo(stryMutAct_9fa48("3375") ? () => undefined : (stryCov_9fa48("3375"), () => detectRecurring(accountTransactions)), stryMutAct_9fa48("3376") ? [] : (stryCov_9fa48("3376"), [accountTransactions]));
    const maxWeeklyAmount = useMemo(stryMutAct_9fa48("3377") ? () => undefined : (stryCov_9fa48("3377"), () => stryMutAct_9fa48("3378") ? Math.min(...weeklyData.flatMap(d => [d.income, d.expense]), 1) : (stryCov_9fa48("3378"), Math.max(...weeklyData.flatMap(stryMutAct_9fa48("3379") ? () => undefined : (stryCov_9fa48("3379"), d => stryMutAct_9fa48("3380") ? [] : (stryCov_9fa48("3380"), [d.income, d.expense]))), 1))), stryMutAct_9fa48("3381") ? [] : (stryCov_9fa48("3381"), [weeklyData]));
    const filteredList = useMemo(() => {
      if (stryMutAct_9fa48("3382")) {
        {}
      } else {
        stryCov_9fa48("3382");
        return stryMutAct_9fa48("3384") ? accountTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : stryMutAct_9fa48("3383") ? accountTransactions.filter(t => {
          if (!t || filterType !== 'all' && t.type !== filterType) return false;
          if (selectedWeekStart && t.date) {
            const d = new Date(t.date);
            const end = new Date(selectedWeekStart);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            if (d < selectedWeekStart || d > end) return false;
          }
          if (!searchQuery) return true;
          return (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (t.category || '').toLowerCase().includes(searchQuery.toLowerCase());
        }) : (stryCov_9fa48("3383", "3384"), accountTransactions.filter(t => {
          if (stryMutAct_9fa48("3385")) {
            {}
          } else {
            stryCov_9fa48("3385");
            if (stryMutAct_9fa48("3388") ? !t && filterType !== 'all' && t.type !== filterType : stryMutAct_9fa48("3387") ? false : stryMutAct_9fa48("3386") ? true : (stryCov_9fa48("3386", "3387", "3388"), (stryMutAct_9fa48("3389") ? t : (stryCov_9fa48("3389"), !t)) || (stryMutAct_9fa48("3391") ? filterType !== 'all' || t.type !== filterType : stryMutAct_9fa48("3390") ? false : (stryCov_9fa48("3390", "3391"), (stryMutAct_9fa48("3393") ? filterType === 'all' : stryMutAct_9fa48("3392") ? true : (stryCov_9fa48("3392", "3393"), filterType !== (stryMutAct_9fa48("3394") ? "" : (stryCov_9fa48("3394"), 'all')))) && (stryMutAct_9fa48("3396") ? t.type === filterType : stryMutAct_9fa48("3395") ? true : (stryCov_9fa48("3395", "3396"), t.type !== filterType)))))) return stryMutAct_9fa48("3397") ? true : (stryCov_9fa48("3397"), false);
            if (stryMutAct_9fa48("3400") ? selectedWeekStart || t.date : stryMutAct_9fa48("3399") ? false : stryMutAct_9fa48("3398") ? true : (stryCov_9fa48("3398", "3399", "3400"), selectedWeekStart && t.date)) {
              if (stryMutAct_9fa48("3401")) {
                {}
              } else {
                stryCov_9fa48("3401");
                const d = new Date(t.date);
                const end = new Date(selectedWeekStart);
                stryMutAct_9fa48("3402") ? end.setTime(end.getDate() + 6) : (stryCov_9fa48("3402"), end.setDate(stryMutAct_9fa48("3403") ? end.getDate() - 6 : (stryCov_9fa48("3403"), end.getDate() + 6)));
                stryMutAct_9fa48("3404") ? end.setMinutes(23, 59, 59, 999) : (stryCov_9fa48("3404"), end.setHours(23, 59, 59, 999));
                if (stryMutAct_9fa48("3407") ? d < selectedWeekStart && d > end : stryMutAct_9fa48("3406") ? false : stryMutAct_9fa48("3405") ? true : (stryCov_9fa48("3405", "3406", "3407"), (stryMutAct_9fa48("3410") ? d >= selectedWeekStart : stryMutAct_9fa48("3409") ? d <= selectedWeekStart : stryMutAct_9fa48("3408") ? false : (stryCov_9fa48("3408", "3409", "3410"), d < selectedWeekStart)) || (stryMutAct_9fa48("3413") ? d <= end : stryMutAct_9fa48("3412") ? d >= end : stryMutAct_9fa48("3411") ? false : (stryCov_9fa48("3411", "3412", "3413"), d > end)))) return stryMutAct_9fa48("3414") ? true : (stryCov_9fa48("3414"), false);
              }
            }
            if (stryMutAct_9fa48("3417") ? false : stryMutAct_9fa48("3416") ? true : stryMutAct_9fa48("3415") ? searchQuery : (stryCov_9fa48("3415", "3416", "3417"), !searchQuery)) return stryMutAct_9fa48("3418") ? false : (stryCov_9fa48("3418"), true);
            return stryMutAct_9fa48("3421") ? (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) && (t.category || '').toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("3420") ? false : stryMutAct_9fa48("3419") ? true : (stryCov_9fa48("3419", "3420", "3421"), (stryMutAct_9fa48("3422") ? (t.title || '').toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("3422"), (stryMutAct_9fa48("3425") ? t.title && '' : stryMutAct_9fa48("3424") ? false : stryMutAct_9fa48("3423") ? true : (stryCov_9fa48("3423", "3424", "3425"), t.title || (stryMutAct_9fa48("3426") ? "Stryker was here!" : (stryCov_9fa48("3426"), '')))).toLowerCase().includes(stryMutAct_9fa48("3427") ? searchQuery.toUpperCase() : (stryCov_9fa48("3427"), searchQuery.toLowerCase())))) || (stryMutAct_9fa48("3428") ? (t.category || '').toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("3428"), (stryMutAct_9fa48("3431") ? t.category && '' : stryMutAct_9fa48("3430") ? false : stryMutAct_9fa48("3429") ? true : (stryCov_9fa48("3429", "3430", "3431"), t.category || (stryMutAct_9fa48("3432") ? "Stryker was here!" : (stryCov_9fa48("3432"), '')))).toLowerCase().includes(stryMutAct_9fa48("3433") ? searchQuery.toUpperCase() : (stryCov_9fa48("3433"), searchQuery.toLowerCase())))));
          }
        }).sort(stryMutAct_9fa48("3434") ? () => undefined : (stryCov_9fa48("3434"), (a, b) => stryMutAct_9fa48("3435") ? new Date(b.date).getTime() + new Date(a.date).getTime() : (stryCov_9fa48("3435"), new Date(b.date).getTime() - new Date(a.date).getTime()))));
      }
    }, stryMutAct_9fa48("3436") ? [] : (stryCov_9fa48("3436"), [accountTransactions, filterType, selectedWeekStart, searchQuery]));
    const handleRename = async () => {
      if (stryMutAct_9fa48("3437")) {
        {}
      } else {
        stryCov_9fa48("3437");
        if (stryMutAct_9fa48("3440") ? !newName.trim() && newName === account.name : stryMutAct_9fa48("3439") ? false : stryMutAct_9fa48("3438") ? true : (stryCov_9fa48("3438", "3439", "3440"), (stryMutAct_9fa48("3441") ? newName.trim() : (stryCov_9fa48("3441"), !(stryMutAct_9fa48("3442") ? newName : (stryCov_9fa48("3442"), newName.trim())))) || (stryMutAct_9fa48("3444") ? newName !== account.name : stryMutAct_9fa48("3443") ? false : (stryCov_9fa48("3443", "3444"), newName === account.name)))) {
          if (stryMutAct_9fa48("3445")) {
            {}
          } else {
            stryCov_9fa48("3445");
            setIsEditingName(stryMutAct_9fa48("3446") ? true : (stryCov_9fa48("3446"), false));
            return;
          }
        }
        setIsRenaming(stryMutAct_9fa48("3447") ? false : (stryCov_9fa48("3447"), true));
        try {
          if (stryMutAct_9fa48("3448")) {
            {}
          } else {
            stryCov_9fa48("3448");
            await renameAccount(account.id, newName);
            setIsEditingName(stryMutAct_9fa48("3449") ? true : (stryCov_9fa48("3449"), false));
          }
        } catch (err) {
          if (stryMutAct_9fa48("3450")) {
            {}
          } else {
            stryCov_9fa48("3450");
            console.error(stryMutAct_9fa48("3451") ? "" : (stryCov_9fa48("3451"), 'Failed to rename:'), err);
          }
        } finally {
          if (stryMutAct_9fa48("3452")) {
            {}
          } else {
            stryCov_9fa48("3452");
            setIsRenaming(stryMutAct_9fa48("3453") ? true : (stryCov_9fa48("3453"), false));
          }
        }
      }
    };
    return <>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
                <NotificationBanner accountId={account.id} />
                <AccountHeader account={account} isOwner={isOwner} familyMemberId={familyMemberId} isEditingName={isEditingName} newName={newName} isRenaming={isRenaming} onBack={onBack} onDelete={onDelete} onShare={onShare} onTransfer={onTransfer} onPayBill={onPayBill} onStartRename={stryMutAct_9fa48("3454") ? () => undefined : (stryCov_9fa48("3454"), () => setIsEditingName(stryMutAct_9fa48("3455") ? false : (stryCov_9fa48("3455"), true)))} onCancelRename={() => {
          if (stryMutAct_9fa48("3456")) {
            {}
          } else {
            stryCov_9fa48("3456");
            setIsEditingName(stryMutAct_9fa48("3457") ? true : (stryCov_9fa48("3457"), false));
            setNewName(account.name);
          }
        }} onConfirmRename={handleRename} onNameChange={setNewName} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {stryMutAct_9fa48("3460") ? accountTransactions.length > 0 || <SpendingTrendsChart weeklyData={weeklyData} currency={account.currency} selectedWeekStart={selectedWeekStart} onSelectWeek={setSelectedWeekStart} maxAmount={maxWeeklyAmount} /> : stryMutAct_9fa48("3459") ? false : stryMutAct_9fa48("3458") ? true : (stryCov_9fa48("3458", "3459", "3460"), (stryMutAct_9fa48("3463") ? accountTransactions.length <= 0 : stryMutAct_9fa48("3462") ? accountTransactions.length >= 0 : stryMutAct_9fa48("3461") ? true : (stryCov_9fa48("3461", "3462", "3463"), accountTransactions.length > 0)) && <SpendingTrendsChart weeklyData={weeklyData} currency={account.currency} selectedWeekStart={selectedWeekStart} onSelectWeek={setSelectedWeekStart} maxAmount={maxWeeklyAmount} />)}
                    <RecurringTransactionsList recurring={recurring} currency={account.currency} />
                </div>
                {stryMutAct_9fa48("3466") ? isSharedAccount || <SharedActivitySection activities={activities} currentUserId={user?.uid} loading={loadingActivities} /> : stryMutAct_9fa48("3465") ? false : stryMutAct_9fa48("3464") ? true : (stryCov_9fa48("3464", "3465", "3466"), isSharedAccount && <SharedActivitySection activities={activities} currentUserId={stryMutAct_9fa48("3467") ? user.uid : (stryCov_9fa48("3467"), user?.uid)} loading={loadingActivities} />)}
                {/* Standardized VirtualTransactionList used in FinanceView for consistency */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
                    <TransactionFilterHeader searchQuery={searchQuery} filterType={filterType} hasWeekFilter={stryMutAct_9fa48("3468") ? !selectedWeekStart : (stryCov_9fa48("3468"), !(stryMutAct_9fa48("3469") ? selectedWeekStart : (stryCov_9fa48("3469"), !selectedWeekStart)))} onSearchChange={setSearchQuery} onFilterChange={setFilterType} />
                    <div className="pt-0">
                        <VirtualTransactionList transactions={filteredList} onEdit={stryMutAct_9fa48("3472") ? onEdit && (() => {}) : stryMutAct_9fa48("3471") ? false : stryMutAct_9fa48("3470") ? true : (stryCov_9fa48("3470", "3471", "3472"), onEdit || (() => {}))} onDelete={setTransactionToDelete} loading={loadingActivities} searchQuery={searchQuery} onClearSearch={stryMutAct_9fa48("3473") ? () => undefined : (stryCov_9fa48("3473"), () => setSearchQuery(stryMutAct_9fa48("3474") ? "Stryker was here!" : (stryCov_9fa48("3474"), '')))} />
                    </div>
                </div>
            </div>
            <ConfirmationModal isOpen={stryMutAct_9fa48("3475") ? !transactionToDelete : (stryCov_9fa48("3475"), !(stryMutAct_9fa48("3476") ? transactionToDelete : (stryCov_9fa48("3476"), !transactionToDelete)))} onClose={stryMutAct_9fa48("3477") ? () => undefined : (stryCov_9fa48("3477"), () => setTransactionToDelete(null))} onConfirm={() => {
        if (stryMutAct_9fa48("3478")) {
          {}
        } else {
          stryCov_9fa48("3478");
          if (stryMutAct_9fa48("3480") ? false : stryMutAct_9fa48("3479") ? true : (stryCov_9fa48("3479", "3480"), transactionToDelete)) {
            if (stryMutAct_9fa48("3481")) {
              {}
            } else {
              stryCov_9fa48("3481");
              deleteTransaction(transactionToDelete.id, transactionToDelete.accountId);
              setTransactionToDelete(null);
            }
          }
        }
      }} title="Delete Transaction" message={stryMutAct_9fa48("3482") ? `` : (stryCov_9fa48("3482"), `Are you sure you want to delete "${stryMutAct_9fa48("3483") ? transactionToDelete.title : (stryCov_9fa48("3483"), transactionToDelete?.title)}"? This action cannot be undone.`)} confirmLabel="Delete Transaction" isDestructive />
        </>;
  }
};