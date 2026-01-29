/**
 * FinanceView - Main finance view with accounts and transactions
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Account details section extracted to AccountDetailsContainer.tsx
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
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Landmark, Search, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { useFamilySharing } from '../../hooks/useFamilySharing';
import { useResponsive } from '../../hooks/useResponsive';
import { useTransactionSearch } from '../../hooks/useTransactionSearch';
import { useHaptic } from '../../hooks/useHaptic';
import { SectionHeader } from '../../components/shared';
import { Modal } from '../../components/shared/Modal';
import { AccountForm } from './AccountForm';
import { TransactionForm } from './TransactionForm';
import type { AnchorTransaction } from '../../types';
import { Button } from '@anchor-os/ui';
import { AccountCard, VirtualTransactionList } from './components';
import { NetWorthCards } from './components/NetWorthCards';
import { EmptyAccountsState } from './components/EmptyAccountsState';
import { FamilyNotificationBanner } from '../../components/FamilyNotificationBanner';
import { AccountDetailsContainer } from './components/AccountDetailsContainer';
import { ConfirmationModal } from '../../components/shared/ConfirmationModal';
import { MonthlyInsight } from './MonthlyInsight';
import { FeatureErrorBoundary } from '../../components/shared/FeatureErrorBoundary';
import { PullToRefresh } from '../../components/mobile/PullToRefresh';
const FinanceView = () => {
  if (stryMutAct_9fa48("3539")) {
    {}
  } else {
    stryCov_9fa48("3539");
    const {
      transactions,
      accounts,
      deleteTransaction,
      deleteAccount,
      currentMonth,
      nextMonth,
      prevMonth,
      loadingFinance,
      netWorth,
      refetch
    } = useFinance();
    const {
      user
    } = useAuth();
    const {
      isOwner: isFamilyOwner,
      familyMemberUid,
      familyMemberName,
      shareAccount: toggleShareAccount
    } = useFamilySharing(stryMutAct_9fa48("3540") ? user.uid : (stryCov_9fa48("3540"), user?.uid));
    const {
      isMobile
    } = useResponsive();
    const haptic = useHaptic();
    const [isRefreshing, setIsRefreshing] = useState(stryMutAct_9fa48("3541") ? true : (stryCov_9fa48("3541"), false));
    const [mode, setMode] = useState<'view' | 'addTx' | 'addAcc' | 'editTx'>(stryMutAct_9fa48("3542") ? "" : (stryCov_9fa48("3542"), 'view'));
    const [editingTransaction, setEditingTransaction] = useState<AnchorTransaction | undefined>(undefined);
    const [initialTransactionType, setInitialTransactionType] = useState<'expense' | 'income' | 'transfer'>(stryMutAct_9fa48("3543") ? "" : (stryCov_9fa48("3543"), 'expense'));
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
    const [accountToDelete, setAccountToDelete] = useState<typeof accounts[0] | null>(null);
    const [accountToUnshare, setAccountToUnshare] = useState<typeof accounts[0] | null>(null);
    const [transactionToDelete, setTransactionToDelete] = useState<AnchorTransaction | null>(null);
    const [searchQuery, setSearchQuery] = useState(stryMutAct_9fa48("3544") ? "Stryker was here!" : (stryCov_9fa48("3544"), ''));
    const [debouncedSearch, setDebouncedSearch] = useState(stryMutAct_9fa48("3545") ? "Stryker was here!" : (stryCov_9fa48("3545"), ''));
    const [prefillData, setPrefillData] = useState<{
      amount?: number;
      category?: string;
      title?: string;
    } | undefined>(undefined);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const activeAccounts = useMemo(stryMutAct_9fa48("3546") ? () => undefined : (stryCov_9fa48("3546"), () => stryMutAct_9fa48("3547") ? accounts : (stryCov_9fa48("3547"), accounts.filter(stryMutAct_9fa48("3548") ? () => undefined : (stryCov_9fa48("3548"), a => stryMutAct_9fa48("3549") ? a.isArchived : (stryCov_9fa48("3549"), !a.isArchived))))), stryMutAct_9fa48("3550") ? [] : (stryCov_9fa48("3550"), [accounts]));
    const selectedAccount = useMemo(stryMutAct_9fa48("3551") ? () => undefined : (stryCov_9fa48("3551"), () => selectedAccountId ? stryMutAct_9fa48("3554") ? accounts.find(a => a.id === selectedAccountId) && null : stryMutAct_9fa48("3553") ? false : stryMutAct_9fa48("3552") ? true : (stryCov_9fa48("3552", "3553", "3554"), accounts.find(stryMutAct_9fa48("3555") ? () => undefined : (stryCov_9fa48("3555"), a => stryMutAct_9fa48("3558") ? a.id !== selectedAccountId : stryMutAct_9fa48("3557") ? false : stryMutAct_9fa48("3556") ? true : (stryCov_9fa48("3556", "3557", "3558"), a.id === selectedAccountId))) || null) : null), stryMutAct_9fa48("3559") ? [] : (stryCov_9fa48("3559"), [selectedAccountId, accounts]));
    const showModal = stryMutAct_9fa48("3563") ? accounts.length < 3 : stryMutAct_9fa48("3562") ? accounts.length > 3 : stryMutAct_9fa48("3561") ? false : stryMutAct_9fa48("3560") ? true : (stryCov_9fa48("3560", "3561", "3562", "3563"), accounts.length >= 3);
    useEffect(() => {
      if (stryMutAct_9fa48("3564")) {
        {}
      } else {
        stryCov_9fa48("3564");
        const handleKeyDown = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("3565")) {
            {}
          } else {
            stryCov_9fa48("3565");
            if (stryMutAct_9fa48("3568") ? e.key === '/' && document.activeElement?.tagName !== 'INPUT' || document.activeElement?.tagName !== 'TEXTAREA' : stryMutAct_9fa48("3567") ? false : stryMutAct_9fa48("3566") ? true : (stryCov_9fa48("3566", "3567", "3568"), (stryMutAct_9fa48("3570") ? e.key === '/' || document.activeElement?.tagName !== 'INPUT' : stryMutAct_9fa48("3569") ? true : (stryCov_9fa48("3569", "3570"), (stryMutAct_9fa48("3572") ? e.key !== '/' : stryMutAct_9fa48("3571") ? true : (stryCov_9fa48("3571", "3572"), e.key === (stryMutAct_9fa48("3573") ? "" : (stryCov_9fa48("3573"), '/')))) && (stryMutAct_9fa48("3575") ? document.activeElement?.tagName === 'INPUT' : stryMutAct_9fa48("3574") ? true : (stryCov_9fa48("3574", "3575"), (stryMutAct_9fa48("3576") ? document.activeElement.tagName : (stryCov_9fa48("3576"), document.activeElement?.tagName)) !== (stryMutAct_9fa48("3577") ? "" : (stryCov_9fa48("3577"), 'INPUT')))))) && (stryMutAct_9fa48("3579") ? document.activeElement?.tagName === 'TEXTAREA' : stryMutAct_9fa48("3578") ? true : (stryCov_9fa48("3578", "3579"), (stryMutAct_9fa48("3580") ? document.activeElement.tagName : (stryCov_9fa48("3580"), document.activeElement?.tagName)) !== (stryMutAct_9fa48("3581") ? "" : (stryCov_9fa48("3581"), 'TEXTAREA')))))) {
              if (stryMutAct_9fa48("3582")) {
                {}
              } else {
                stryCov_9fa48("3582");
                e.preventDefault();
                stryMutAct_9fa48("3583") ? searchInputRef.current.focus() : (stryCov_9fa48("3583"), searchInputRef.current?.focus());
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("3584") ? "" : (stryCov_9fa48("3584"), 'keydown'), handleKeyDown);
        return stryMutAct_9fa48("3585") ? () => undefined : (stryCov_9fa48("3585"), () => window.removeEventListener(stryMutAct_9fa48("3586") ? "" : (stryCov_9fa48("3586"), 'keydown'), handleKeyDown));
      }
    }, stryMutAct_9fa48("3587") ? ["Stryker was here"] : (stryCov_9fa48("3587"), []));
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
      if (stryMutAct_9fa48("3588")) {
        {}
      } else {
        stryCov_9fa48("3588");
        const action = searchParams.get(stryMutAct_9fa48("3589") ? "" : (stryCov_9fa48("3589"), 'action'));
        if (stryMutAct_9fa48("3592") ? action !== 'new' : stryMutAct_9fa48("3591") ? false : stryMutAct_9fa48("3590") ? true : (stryCov_9fa48("3590", "3591", "3592"), action === (stryMutAct_9fa48("3593") ? "" : (stryCov_9fa48("3593"), 'new')))) {
          if (stryMutAct_9fa48("3594")) {
            {}
          } else {
            stryCov_9fa48("3594");
            const amountStr = searchParams.get(stryMutAct_9fa48("3595") ? "" : (stryCov_9fa48("3595"), 'amount'));
            const amount = amountStr ? parseFloat(amountStr) : undefined;
            const category = stryMutAct_9fa48("3598") ? searchParams.get('category') && undefined : stryMutAct_9fa48("3597") ? false : stryMutAct_9fa48("3596") ? true : (stryCov_9fa48("3596", "3597", "3598"), searchParams.get(stryMutAct_9fa48("3599") ? "" : (stryCov_9fa48("3599"), 'category')) || undefined);
            const description = stryMutAct_9fa48("3602") ? searchParams.get('description') && undefined : stryMutAct_9fa48("3601") ? false : stryMutAct_9fa48("3600") ? true : (stryCov_9fa48("3600", "3601", "3602"), searchParams.get(stryMutAct_9fa48("3603") ? "" : (stryCov_9fa48("3603"), 'description')) || undefined);
            if (stryMutAct_9fa48("3606") ? (amount || category) && description : stryMutAct_9fa48("3605") ? false : stryMutAct_9fa48("3604") ? true : (stryCov_9fa48("3604", "3605", "3606"), (stryMutAct_9fa48("3608") ? amount && category : stryMutAct_9fa48("3607") ? false : (stryCov_9fa48("3607", "3608"), amount || category)) || description)) {
              if (stryMutAct_9fa48("3609")) {
                {}
              } else {
                stryCov_9fa48("3609");
                setPrefillData(stryMutAct_9fa48("3610") ? {} : (stryCov_9fa48("3610"), {
                  amount,
                  category,
                  title: description
                }));
                setMode(stryMutAct_9fa48("3611") ? "" : (stryCov_9fa48("3611"), 'addTx'));
                setSearchParams({}, stryMutAct_9fa48("3612") ? {} : (stryCov_9fa48("3612"), {
                  replace: stryMutAct_9fa48("3613") ? false : (stryCov_9fa48("3613"), true)
                }));
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("3614") ? [] : (stryCov_9fa48("3614"), [searchParams, setSearchParams]));
    useEffect(() => {
      if (stryMutAct_9fa48("3615")) {
        {}
      } else {
        stryCov_9fa48("3615");
        const timer = setTimeout(stryMutAct_9fa48("3616") ? () => undefined : (stryCov_9fa48("3616"), () => setDebouncedSearch(searchQuery)), 300);
        return stryMutAct_9fa48("3617") ? () => undefined : (stryCov_9fa48("3617"), () => clearTimeout(timer));
      }
    }, stryMutAct_9fa48("3618") ? [] : (stryCov_9fa48("3618"), [searchQuery]));

    // Use optimized search hook (BUG-001 fix: sub-500ms for 1000+ transactions)
    const {
      filteredTransactions,
      isSearching
    } = useTransactionSearch(transactions, debouncedSearch);
    const handleCloseForm = () => {
      if (stryMutAct_9fa48("3619")) {
        {}
      } else {
        stryCov_9fa48("3619");
        setMode(stryMutAct_9fa48("3620") ? "" : (stryCov_9fa48("3620"), 'view'));
        setEditingTransaction(undefined);
        setPrefillData(undefined);
      }
    };
    const handleEdit = (tx: AnchorTransaction) => {
      if (stryMutAct_9fa48("3621")) {
        {}
      } else {
        stryCov_9fa48("3621");
        setEditingTransaction(tx);
        setMode(stryMutAct_9fa48("3622") ? "" : (stryCov_9fa48("3622"), 'editTx'));
      }
    };

    // Pull-to-refresh handler
    const handleRefresh = async () => {
      if (stryMutAct_9fa48("3623")) {
        {}
      } else {
        stryCov_9fa48("3623");
        setIsRefreshing(stryMutAct_9fa48("3624") ? false : (stryCov_9fa48("3624"), true));
        haptic.trigger(stryMutAct_9fa48("3625") ? "" : (stryCov_9fa48("3625"), 'light'));
        await refetch();
        haptic.trigger(stryMutAct_9fa48("3626") ? "" : (stryCov_9fa48("3626"), 'success'));
        setIsRefreshing(stryMutAct_9fa48("3627") ? true : (stryCov_9fa48("3627"), false));
      }
    };

    // Haptic feedback on delete confirmation
    const handleDeleteConfirm = () => {
      if (stryMutAct_9fa48("3628")) {
        {}
      } else {
        stryCov_9fa48("3628");
        if (stryMutAct_9fa48("3630") ? false : stryMutAct_9fa48("3629") ? true : (stryCov_9fa48("3629", "3630"), transactionToDelete)) {
          if (stryMutAct_9fa48("3631")) {
            {}
          } else {
            stryCov_9fa48("3631");
            haptic.trigger(stryMutAct_9fa48("3632") ? "" : (stryCov_9fa48("3632"), 'medium'));
            deleteTransaction(transactionToDelete.id, transactionToDelete.accountId);
            setTransactionToDelete(null);
          }
        }
      }
    };
    if (stryMutAct_9fa48("3634") ? false : stryMutAct_9fa48("3633") ? true : (stryCov_9fa48("3633", "3634"), selectedAccount)) {
      if (stryMutAct_9fa48("3635")) {
        {}
      } else {
        stryCov_9fa48("3635");
        return <FeatureErrorBoundary featureName="Finance">
        <AccountDetailsContainer account={selectedAccount} mode={mode} editingTransaction={editingTransaction} initialTransactionType={initialTransactionType} accountToDelete={accountToDelete} accountToUnshare={accountToUnshare} familyMemberUid={stryMutAct_9fa48("3638") ? familyMemberUid && undefined : stryMutAct_9fa48("3637") ? false : stryMutAct_9fa48("3636") ? true : (stryCov_9fa48("3636", "3637", "3638"), familyMemberUid || undefined)} familyMemberName={stryMutAct_9fa48("3641") ? familyMemberName && undefined : stryMutAct_9fa48("3640") ? false : stryMutAct_9fa48("3639") ? true : (stryCov_9fa48("3639", "3640", "3641"), familyMemberName || undefined)} onBack={stryMutAct_9fa48("3642") ? () => undefined : (stryCov_9fa48("3642"), () => setSelectedAccountId(null))} onShare={() => {
            if (stryMutAct_9fa48("3643")) {
              {}
            } else {
              stryCov_9fa48("3643");
              if (stryMutAct_9fa48("3646") ? false : stryMutAct_9fa48("3645") ? true : stryMutAct_9fa48("3644") ? familyMemberUid : (stryCov_9fa48("3644", "3645", "3646"), !familyMemberUid)) return;
              const isShared = stryMutAct_9fa48("3647") ? selectedAccount.sharedWith[familyMemberUid] : (stryCov_9fa48("3647"), selectedAccount.sharedWith?.[familyMemberUid]);
              if (stryMutAct_9fa48("3649") ? false : stryMutAct_9fa48("3648") ? true : (stryCov_9fa48("3648", "3649"), isShared)) setAccountToUnshare(selectedAccount);else toggleShareAccount(selectedAccount.id, stryMutAct_9fa48("3650") ? false : (stryCov_9fa48("3650"), true));
            }
          }} onTransfer={() => {
            if (stryMutAct_9fa48("3651")) {
              {}
            } else {
              stryCov_9fa48("3651");
              setInitialTransactionType(stryMutAct_9fa48("3652") ? "" : (stryCov_9fa48("3652"), 'transfer'));
              setMode(stryMutAct_9fa48("3653") ? "" : (stryCov_9fa48("3653"), 'addTx'));
            }
          }} onPayBill={() => {
            if (stryMutAct_9fa48("3654")) {
              {}
            } else {
              stryCov_9fa48("3654");
              setInitialTransactionType(stryMutAct_9fa48("3655") ? "" : (stryCov_9fa48("3655"), 'expense'));
              setMode(stryMutAct_9fa48("3656") ? "" : (stryCov_9fa48("3656"), 'addTx'));
            }
          }} onEdit={handleEdit} onDelete={stryMutAct_9fa48("3657") ? () => undefined : (stryCov_9fa48("3657"), () => setAccountToDelete(selectedAccount))} onCloseForm={handleCloseForm} onDeleteAccount={() => {
            if (stryMutAct_9fa48("3658")) {
              {}
            } else {
              stryCov_9fa48("3658");
              if (stryMutAct_9fa48("3660") ? false : stryMutAct_9fa48("3659") ? true : (stryCov_9fa48("3659", "3660"), accountToDelete)) {
                if (stryMutAct_9fa48("3661")) {
                  {}
                } else {
                  stryCov_9fa48("3661");
                  deleteAccount(accountToDelete.id);
                  setAccountToDelete(null);
                  setSelectedAccountId(null);
                }
              }
            }
          }} setAccountToDelete={setAccountToDelete} onUnshareAccount={() => {
            if (stryMutAct_9fa48("3662")) {
              {}
            } else {
              stryCov_9fa48("3662");
              if (stryMutAct_9fa48("3664") ? false : stryMutAct_9fa48("3663") ? true : (stryCov_9fa48("3663", "3664"), accountToUnshare)) {
                if (stryMutAct_9fa48("3665")) {
                  {}
                } else {
                  stryCov_9fa48("3665");
                  toggleShareAccount(accountToUnshare.id, stryMutAct_9fa48("3666") ? true : (stryCov_9fa48("3666"), false));
                  setAccountToUnshare(null);
                }
              }
            }
          }} setAccountToUnshare={setAccountToUnshare} />
      </FeatureErrorBoundary>;
      }
    }
    return <FeatureErrorBoundary featureName="Finance">
      <div className={stryMutAct_9fa48("3667") ? `` : (stryCov_9fa48("3667"), `animate-in fade-in slide-in-from-bottom-8 duration-500 relative ${isMobile ? stryMutAct_9fa48("3668") ? "" : (stryCov_9fa48("3668"), 'space-y-5') : stryMutAct_9fa48("3669") ? "" : (stryCov_9fa48("3669"), 'space-y-8')}`)}>
        <SectionHeader title="Finance" subtitle="Multi-account asset management and cashflow tracking." action={<Button variant="secondary" size="sm" onClick={stryMutAct_9fa48("3670") ? () => undefined : (stryCov_9fa48("3670"), () => setMode((stryMutAct_9fa48("3673") ? mode !== 'addAcc' : stryMutAct_9fa48("3672") ? false : stryMutAct_9fa48("3671") ? true : (stryCov_9fa48("3671", "3672", "3673"), mode === (stryMutAct_9fa48("3674") ? "" : (stryCov_9fa48("3674"), 'addAcc')))) ? stryMutAct_9fa48("3675") ? "" : (stryCov_9fa48("3675"), 'view') : stryMutAct_9fa48("3676") ? "" : (stryCov_9fa48("3676"), 'addAcc')))} className="gap-2"><Landmark className="w-4 h-4" /> <span>Add Account</span></Button>} />

        {stryMutAct_9fa48("3679") ? !isSearching || <><FamilyNotificationBanner /><NetWorthCards netWorth={netWorth} /><MonthlyInsight transactions={transactions} currency={activeAccounts[0]?.currency || 'NGN'} />
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isMobile ? 'gap-3' : 'gap-6'}`}>
            {activeAccounts.map(acc => <AccountCard key={acc.id} account={acc} userId={user?.uid || ''} isOwnerOfConnection={isFamilyOwner} familyMemberUid={familyMemberUid || undefined} onEdit={acc => setSelectedAccountId(acc.id)} onToggleShare={(acc, share) => share === false ? setAccountToUnshare(acc) : toggleShareAccount(acc.id, share)} />)}
            {!loadingFinance && accounts.length === 0 && <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} />}
          </div></> : stryMutAct_9fa48("3678") ? false : stryMutAct_9fa48("3677") ? true : (stryCov_9fa48("3677", "3678", "3679"), (stryMutAct_9fa48("3680") ? isSearching : (stryCov_9fa48("3680"), !isSearching)) && <><FamilyNotificationBanner /><NetWorthCards netWorth={netWorth} /><MonthlyInsight transactions={transactions} currency={stryMutAct_9fa48("3683") ? activeAccounts[0]?.currency && 'NGN' : stryMutAct_9fa48("3682") ? false : stryMutAct_9fa48("3681") ? true : (stryCov_9fa48("3681", "3682", "3683"), (stryMutAct_9fa48("3684") ? activeAccounts[0].currency : (stryCov_9fa48("3684"), activeAccounts[0]?.currency)) || (stryMutAct_9fa48("3685") ? "" : (stryCov_9fa48("3685"), 'NGN')))} />
          <div className={stryMutAct_9fa48("3686") ? `` : (stryCov_9fa48("3686"), `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isMobile ? stryMutAct_9fa48("3687") ? "" : (stryCov_9fa48("3687"), 'gap-3') : stryMutAct_9fa48("3688") ? "" : (stryCov_9fa48("3688"), 'gap-6')}`)}>
            {activeAccounts.map(stryMutAct_9fa48("3689") ? () => undefined : (stryCov_9fa48("3689"), acc => <AccountCard key={acc.id} account={acc} userId={stryMutAct_9fa48("3692") ? user?.uid && '' : stryMutAct_9fa48("3691") ? false : stryMutAct_9fa48("3690") ? true : (stryCov_9fa48("3690", "3691", "3692"), (stryMutAct_9fa48("3693") ? user.uid : (stryCov_9fa48("3693"), user?.uid)) || (stryMutAct_9fa48("3694") ? "Stryker was here!" : (stryCov_9fa48("3694"), '')))} isOwnerOfConnection={isFamilyOwner} familyMemberUid={stryMutAct_9fa48("3697") ? familyMemberUid && undefined : stryMutAct_9fa48("3696") ? false : stryMutAct_9fa48("3695") ? true : (stryCov_9fa48("3695", "3696", "3697"), familyMemberUid || undefined)} onEdit={stryMutAct_9fa48("3698") ? () => undefined : (stryCov_9fa48("3698"), acc => setSelectedAccountId(acc.id))} onToggleShare={stryMutAct_9fa48("3699") ? () => undefined : (stryCov_9fa48("3699"), (acc, share) => (stryMutAct_9fa48("3702") ? share !== false : stryMutAct_9fa48("3701") ? false : stryMutAct_9fa48("3700") ? true : (stryCov_9fa48("3700", "3701", "3702"), share === (stryMutAct_9fa48("3703") ? true : (stryCov_9fa48("3703"), false)))) ? setAccountToUnshare(acc) : toggleShareAccount(acc.id, share))} />))}
            {stryMutAct_9fa48("3706") ? !loadingFinance && accounts.length === 0 || <EmptyAccountsState onCreateAccount={() => setMode('addAcc')} /> : stryMutAct_9fa48("3705") ? false : stryMutAct_9fa48("3704") ? true : (stryCov_9fa48("3704", "3705", "3706"), (stryMutAct_9fa48("3708") ? !loadingFinance || accounts.length === 0 : stryMutAct_9fa48("3707") ? true : (stryCov_9fa48("3707", "3708"), (stryMutAct_9fa48("3709") ? loadingFinance : (stryCov_9fa48("3709"), !loadingFinance)) && (stryMutAct_9fa48("3711") ? accounts.length !== 0 : stryMutAct_9fa48("3710") ? true : (stryCov_9fa48("3710", "3711"), accounts.length === 0)))) && <EmptyAccountsState onCreateAccount={stryMutAct_9fa48("3712") ? () => undefined : (stryCov_9fa48("3712"), () => setMode(stryMutAct_9fa48("3713") ? "" : (stryCov_9fa48("3713"), 'addAcc')))} />)}
          </div></>)}

        {stryMutAct_9fa48("3716") ? !showModal && mode === 'addAcc' && !isSearching || <div className="animate-in fade-in zoom-in-95 duration-200"><AccountForm onClose={handleCloseForm} /></div> : stryMutAct_9fa48("3715") ? false : stryMutAct_9fa48("3714") ? true : (stryCov_9fa48("3714", "3715", "3716"), (stryMutAct_9fa48("3718") ? !showModal && mode === 'addAcc' || !isSearching : stryMutAct_9fa48("3717") ? true : (stryCov_9fa48("3717", "3718"), (stryMutAct_9fa48("3720") ? !showModal || mode === 'addAcc' : stryMutAct_9fa48("3719") ? true : (stryCov_9fa48("3719", "3720"), (stryMutAct_9fa48("3721") ? showModal : (stryCov_9fa48("3721"), !showModal)) && (stryMutAct_9fa48("3723") ? mode !== 'addAcc' : stryMutAct_9fa48("3722") ? true : (stryCov_9fa48("3722", "3723"), mode === (stryMutAct_9fa48("3724") ? "" : (stryCov_9fa48("3724"), 'addAcc')))))) && (stryMutAct_9fa48("3725") ? isSearching : (stryCov_9fa48("3725"), !isSearching)))) && <div className="animate-in fade-in zoom-in-95 duration-200"><AccountForm onClose={handleCloseForm} /></div>)}
        {stryMutAct_9fa48("3728") ? !showModal && (mode === 'addTx' || mode === 'editTx') && !isSearching || <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} /> : stryMutAct_9fa48("3727") ? false : stryMutAct_9fa48("3726") ? true : (stryCov_9fa48("3726", "3727", "3728"), (stryMutAct_9fa48("3730") ? !showModal && (mode === 'addTx' || mode === 'editTx') || !isSearching : stryMutAct_9fa48("3729") ? true : (stryCov_9fa48("3729", "3730"), (stryMutAct_9fa48("3732") ? !showModal || mode === 'addTx' || mode === 'editTx' : stryMutAct_9fa48("3731") ? true : (stryCov_9fa48("3731", "3732"), (stryMutAct_9fa48("3733") ? showModal : (stryCov_9fa48("3733"), !showModal)) && (stryMutAct_9fa48("3735") ? mode === 'addTx' && mode === 'editTx' : stryMutAct_9fa48("3734") ? true : (stryCov_9fa48("3734", "3735"), (stryMutAct_9fa48("3737") ? mode !== 'addTx' : stryMutAct_9fa48("3736") ? false : (stryCov_9fa48("3736", "3737"), mode === (stryMutAct_9fa48("3738") ? "" : (stryCov_9fa48("3738"), 'addTx')))) || (stryMutAct_9fa48("3740") ? mode !== 'editTx' : stryMutAct_9fa48("3739") ? false : (stryCov_9fa48("3739", "3740"), mode === (stryMutAct_9fa48("3741") ? "" : (stryCov_9fa48("3741"), 'editTx')))))))) && (stryMutAct_9fa48("3742") ? isSearching : (stryCov_9fa48("3742"), !isSearching)))) && <TransactionForm onClose={handleCloseForm} defaultAccountId={stryMutAct_9fa48("3743") ? activeAccounts[0].id : (stryCov_9fa48("3743"), activeAccounts[0]?.id)} defaultType={stryMutAct_9fa48("3746") ? editingTransaction?.type && initialTransactionType : stryMutAct_9fa48("3745") ? false : stryMutAct_9fa48("3744") ? true : (stryCov_9fa48("3744", "3745", "3746"), (stryMutAct_9fa48("3747") ? editingTransaction.type : (stryCov_9fa48("3747"), editingTransaction?.type)) || initialTransactionType)} initialData={editingTransaction} prefillData={prefillData} />)}

        {stryMutAct_9fa48("3750") ? accounts.length > 0 || <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8" aria-label="Previous month"><ChevronLeft className="w-4 h-4" /></Button>
                <div className="px-2 flex items-center gap-2 min-w-[160px] justify-center text-sm font-bold text-slate-700 dark:text-slate-200"><Calendar className="w-4 h-4 text-slate-400" /><span>{currentMonth.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}</span></div>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8" aria-label="Next month"><ChevronRight className="w-4 h-4" /></Button>
              </div>
              <div className="relative flex-1 w-full"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2.5} /><input ref={searchInputRef} type="text" placeholder={`Search in ${currentMonth.toLocaleDateString('en-US', {
                month: 'long'
              })}...`} className="w-full bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
            </div>
            {isSearching && <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"><p className="text-xs font-medium text-blue-600 dark:text-blue-400">Found {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} matching "{debouncedSearch}"</p></div>}
            {isMobile ? <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing || loadingFinance}>
                <VirtualTransactionList transactions={filteredTransactions} currentUserId={user?.uid} onEdit={handleEdit} onDelete={setTransactionToDelete} loading={loadingFinance || isRefreshing} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />
              </PullToRefresh> : <VirtualTransactionList transactions={filteredTransactions} currentUserId={user?.uid} onEdit={handleEdit} onDelete={setTransactionToDelete} loading={loadingFinance} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} />}
          </div> : stryMutAct_9fa48("3749") ? false : stryMutAct_9fa48("3748") ? true : (stryCov_9fa48("3748", "3749", "3750"), (stryMutAct_9fa48("3753") ? accounts.length <= 0 : stryMutAct_9fa48("3752") ? accounts.length >= 0 : stryMutAct_9fa48("3751") ? true : (stryCov_9fa48("3751", "3752", "3753"), accounts.length > 0)) && <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8" aria-label="Previous month"><ChevronLeft className="w-4 h-4" /></Button>
                <div className="px-2 flex items-center gap-2 min-w-[160px] justify-center text-sm font-bold text-slate-700 dark:text-slate-200"><Calendar className="w-4 h-4 text-slate-400" /><span>{currentMonth.toLocaleDateString(stryMutAct_9fa48("3754") ? "" : (stryCov_9fa48("3754"), 'en-US'), stryMutAct_9fa48("3755") ? {} : (stryCov_9fa48("3755"), {
                    month: stryMutAct_9fa48("3756") ? "" : (stryCov_9fa48("3756"), 'long'),
                    year: stryMutAct_9fa48("3757") ? "" : (stryCov_9fa48("3757"), 'numeric')
                  }))}</span></div>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8" aria-label="Next month"><ChevronRight className="w-4 h-4" /></Button>
              </div>
              <div className="relative flex-1 w-full"><Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={2.5} /><input ref={searchInputRef} type="text" placeholder={stryMutAct_9fa48("3758") ? `` : (stryCov_9fa48("3758"), `Search in ${currentMonth.toLocaleDateString(stryMutAct_9fa48("3759") ? "" : (stryCov_9fa48("3759"), 'en-US'), stryMutAct_9fa48("3760") ? {} : (stryCov_9fa48("3760"), {
                month: stryMutAct_9fa48("3761") ? "" : (stryCov_9fa48("3761"), 'long')
              }))}...`)} className="w-full bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium" value={searchQuery} onChange={stryMutAct_9fa48("3762") ? () => undefined : (stryCov_9fa48("3762"), e => setSearchQuery(e.target.value))} /></div>
            </div>
            {stryMutAct_9fa48("3765") ? isSearching || <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"><p className="text-xs font-medium text-blue-600 dark:text-blue-400">Found {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} matching "{debouncedSearch}"</p></div> : stryMutAct_9fa48("3764") ? false : stryMutAct_9fa48("3763") ? true : (stryCov_9fa48("3763", "3764", "3765"), isSearching && <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800/30"><p className="text-xs font-medium text-blue-600 dark:text-blue-400">Found {filteredTransactions.length} transaction{(stryMutAct_9fa48("3768") ? filteredTransactions.length === 1 : stryMutAct_9fa48("3767") ? false : stryMutAct_9fa48("3766") ? true : (stryCov_9fa48("3766", "3767", "3768"), filteredTransactions.length !== 1)) ? stryMutAct_9fa48("3769") ? "" : (stryCov_9fa48("3769"), 's') : stryMutAct_9fa48("3770") ? "Stryker was here!" : (stryCov_9fa48("3770"), '')} matching "{debouncedSearch}"</p></div>)}
            {isMobile ? <PullToRefresh onRefresh={handleRefresh} disabled={stryMutAct_9fa48("3773") ? isRefreshing && loadingFinance : stryMutAct_9fa48("3772") ? false : stryMutAct_9fa48("3771") ? true : (stryCov_9fa48("3771", "3772", "3773"), isRefreshing || loadingFinance)}>
                <VirtualTransactionList transactions={filteredTransactions} currentUserId={stryMutAct_9fa48("3774") ? user.uid : (stryCov_9fa48("3774"), user?.uid)} onEdit={handleEdit} onDelete={setTransactionToDelete} loading={stryMutAct_9fa48("3777") ? loadingFinance && isRefreshing : stryMutAct_9fa48("3776") ? false : stryMutAct_9fa48("3775") ? true : (stryCov_9fa48("3775", "3776", "3777"), loadingFinance || isRefreshing)} searchQuery={searchQuery} onClearSearch={stryMutAct_9fa48("3778") ? () => undefined : (stryCov_9fa48("3778"), () => setSearchQuery(stryMutAct_9fa48("3779") ? "Stryker was here!" : (stryCov_9fa48("3779"), '')))} />
              </PullToRefresh> : <VirtualTransactionList transactions={filteredTransactions} currentUserId={stryMutAct_9fa48("3780") ? user.uid : (stryCov_9fa48("3780"), user?.uid)} onEdit={handleEdit} onDelete={setTransactionToDelete} loading={loadingFinance} searchQuery={searchQuery} onClearSearch={stryMutAct_9fa48("3781") ? () => undefined : (stryCov_9fa48("3781"), () => setSearchQuery(stryMutAct_9fa48("3782") ? "Stryker was here!" : (stryCov_9fa48("3782"), '')))} />}
          </div>)}

        <Modal isOpen={stryMutAct_9fa48("3785") ? showModal || mode !== 'view' : stryMutAct_9fa48("3784") ? false : stryMutAct_9fa48("3783") ? true : (stryCov_9fa48("3783", "3784", "3785"), showModal && (stryMutAct_9fa48("3787") ? mode === 'view' : stryMutAct_9fa48("3786") ? true : (stryCov_9fa48("3786", "3787"), mode !== (stryMutAct_9fa48("3788") ? "" : (stryCov_9fa48("3788"), 'view')))))} onClose={handleCloseForm} title={(stryMutAct_9fa48("3791") ? mode !== 'addAcc' : stryMutAct_9fa48("3790") ? false : stryMutAct_9fa48("3789") ? true : (stryCov_9fa48("3789", "3790", "3791"), mode === (stryMutAct_9fa48("3792") ? "" : (stryCov_9fa48("3792"), 'addAcc')))) ? stryMutAct_9fa48("3793") ? "" : (stryCov_9fa48("3793"), 'Create Account') : (stryMutAct_9fa48("3796") ? mode !== 'editTx' : stryMutAct_9fa48("3795") ? false : stryMutAct_9fa48("3794") ? true : (stryCov_9fa48("3794", "3795", "3796"), mode === (stryMutAct_9fa48("3797") ? "" : (stryCov_9fa48("3797"), 'editTx')))) ? stryMutAct_9fa48("3798") ? "" : (stryCov_9fa48("3798"), 'Edit Transaction') : stryMutAct_9fa48("3799") ? "" : (stryCov_9fa48("3799"), 'New Transaction')} maxWidth="max-w-2xl">
          {stryMutAct_9fa48("3802") ? mode === 'addAcc' || <AccountForm onClose={handleCloseForm} /> : stryMutAct_9fa48("3801") ? false : stryMutAct_9fa48("3800") ? true : (stryCov_9fa48("3800", "3801", "3802"), (stryMutAct_9fa48("3804") ? mode !== 'addAcc' : stryMutAct_9fa48("3803") ? true : (stryCov_9fa48("3803", "3804"), mode === (stryMutAct_9fa48("3805") ? "" : (stryCov_9fa48("3805"), 'addAcc')))) && <AccountForm onClose={handleCloseForm} />)}
          {stryMutAct_9fa48("3808") ? mode === 'addTx' || mode === 'editTx' || <TransactionForm onClose={handleCloseForm} defaultAccountId={activeAccounts[0]?.id} defaultType={editingTransaction?.type || initialTransactionType} initialData={editingTransaction} prefillData={prefillData} /> : stryMutAct_9fa48("3807") ? false : stryMutAct_9fa48("3806") ? true : (stryCov_9fa48("3806", "3807", "3808"), (stryMutAct_9fa48("3810") ? mode === 'addTx' && mode === 'editTx' : stryMutAct_9fa48("3809") ? true : (stryCov_9fa48("3809", "3810"), (stryMutAct_9fa48("3812") ? mode !== 'addTx' : stryMutAct_9fa48("3811") ? false : (stryCov_9fa48("3811", "3812"), mode === (stryMutAct_9fa48("3813") ? "" : (stryCov_9fa48("3813"), 'addTx')))) || (stryMutAct_9fa48("3815") ? mode !== 'editTx' : stryMutAct_9fa48("3814") ? false : (stryCov_9fa48("3814", "3815"), mode === (stryMutAct_9fa48("3816") ? "" : (stryCov_9fa48("3816"), 'editTx')))))) && <TransactionForm onClose={handleCloseForm} defaultAccountId={stryMutAct_9fa48("3817") ? activeAccounts[0].id : (stryCov_9fa48("3817"), activeAccounts[0]?.id)} defaultType={stryMutAct_9fa48("3820") ? editingTransaction?.type && initialTransactionType : stryMutAct_9fa48("3819") ? false : stryMutAct_9fa48("3818") ? true : (stryCov_9fa48("3818", "3819", "3820"), (stryMutAct_9fa48("3821") ? editingTransaction.type : (stryCov_9fa48("3821"), editingTransaction?.type)) || initialTransactionType)} initialData={editingTransaction} prefillData={prefillData} />)}
        </Modal>
        <ConfirmationModal isOpen={stryMutAct_9fa48("3822") ? !transactionToDelete : (stryCov_9fa48("3822"), !(stryMutAct_9fa48("3823") ? transactionToDelete : (stryCov_9fa48("3823"), !transactionToDelete)))} onClose={stryMutAct_9fa48("3824") ? () => undefined : (stryCov_9fa48("3824"), () => setTransactionToDelete(null))} onConfirm={handleDeleteConfirm} title="Delete Transaction" message={stryMutAct_9fa48("3825") ? `` : (stryCov_9fa48("3825"), `Are you sure you want to delete "${stryMutAct_9fa48("3826") ? transactionToDelete.title : (stryCov_9fa48("3826"), transactionToDelete?.title)}"? This action cannot be undone.`)} confirmLabel="Delete Transaction" isDestructive />
      </div>
    </FeatureErrorBoundary>;
  }
};
export default FinanceView;