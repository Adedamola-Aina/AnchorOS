/**
 * TransactionForm
 * 
 * Main form component for creating/editing transactions.
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
import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useNotifications } from '../../context/NotificationContext';
import { useHaptic } from '../../hooks/useHaptic';
import { getTransactionLabel } from '../../utils/finance';
import { toCents, fromCents } from '../../utils/moneyUtils';
import { mapFirebaseError } from '../../utils/errorUtils';
import { containsDangerousPatterns } from '../../utils/validation';
import type { TransactionType, AnchorTransaction } from '../../types';
import { AccountSelector, CategorySelector, OverdraftWarning, TransactionTypeSelector, TransferDetails } from './components';
import { useTransactionFormState, NoAccountsMessage, SingleAccountTransferMessage, DescriptionField, AmountField, DateField } from './components/transactionForm';
interface TransactionFormProps {
  onClose: () => void;
  defaultAccountId?: string;
  defaultType?: TransactionType;
  initialData?: AnchorTransaction;
  prefillData?: {
    amount?: number;
    title?: string;
    category?: string;
  };
}
export const TransactionForm: React.FC<TransactionFormProps> = ({
  onClose,
  defaultAccountId,
  defaultType = stryMutAct_9fa48("3943") ? "" : (stryCov_9fa48("3943"), 'expense'),
  initialData,
  prefillData
}) => {
  if (stryMutAct_9fa48("3944")) {
    {}
  } else {
    stryCov_9fa48("3944");
    const haptic = useHaptic();
    const {
      transactions,
      accounts,
      addTransaction,
      updateTransaction,
      refetch
    } = useFinance();
    const {
      showToast
    } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("3945") ? true : (stryCov_9fa48("3945"), false));
    const [errors, setErrors] = useState<{
      title?: string;
      amount?: string;
      destination?: string;
      category?: string;
    }>({});

    // Initial values
    const initialAmount = initialData ? fromCents(stryMutAct_9fa48("3948") ? initialData.amountCents && 0 : stryMutAct_9fa48("3947") ? false : stryMutAct_9fa48("3946") ? true : (stryCov_9fa48("3946", "3947", "3948"), initialData.amountCents || 0)).toLocaleString(stryMutAct_9fa48("3949") ? "" : (stryCov_9fa48("3949"), 'en-US'), stryMutAct_9fa48("3950") ? {} : (stryCov_9fa48("3950"), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })) : (stryMutAct_9fa48("3951") ? prefillData.amount : (stryCov_9fa48("3951"), prefillData?.amount)) ? prefillData.amount.toLocaleString(stryMutAct_9fa48("3952") ? "" : (stryCov_9fa48("3952"), 'en-US'), stryMutAct_9fa48("3953") ? {} : (stryCov_9fa48("3953"), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })) : stryMutAct_9fa48("3954") ? "Stryker was here!" : (stryCov_9fa48("3954"), '');
    const initialDate = (stryMutAct_9fa48("3955") ? initialData.date : (stryCov_9fa48("3955"), initialData?.date)) ? new Date(initialData.date).toISOString().split(stryMutAct_9fa48("3956") ? "" : (stryCov_9fa48("3956"), 'T'))[0] : new Date().toISOString().split(stryMutAct_9fa48("3957") ? "" : (stryCov_9fa48("3957"), 'T'))[0];
    const [amount, setAmount] = useState(initialAmount);
    const [transactionDate, setTransactionDate] = useState(initialDate);

    // Use extracted hook for complex state management
    const formState = useTransactionFormState(stryMutAct_9fa48("3958") ? {} : (stryCov_9fa48("3958"), {
      accounts,
      transactions,
      initialData,
      defaultAccountId,
      defaultType,
      prefillData
    }));

    // Derived state
    const sourceAccount = accounts.find(stryMutAct_9fa48("3959") ? () => undefined : (stryCov_9fa48("3959"), a => stryMutAct_9fa48("3962") ? a.id !== formState.selectedAccId : stryMutAct_9fa48("3961") ? false : stryMutAct_9fa48("3960") ? true : (stryCov_9fa48("3960", "3961", "3962"), a.id === formState.selectedAccId)));
    const destAccount = accounts.find(stryMutAct_9fa48("3963") ? () => undefined : (stryCov_9fa48("3963"), a => stryMutAct_9fa48("3966") ? a.id !== formState.destinationAccId : stryMutAct_9fa48("3965") ? false : stryMutAct_9fa48("3964") ? true : (stryCov_9fa48("3964", "3965", "3966"), a.id === formState.destinationAccId)));
    const isDifferentCurrency = stryMutAct_9fa48("3969") ? formState.type === 'transfer' && sourceAccount && destAccount || sourceAccount.currency !== destAccount.currency : stryMutAct_9fa48("3968") ? false : stryMutAct_9fa48("3967") ? true : (stryCov_9fa48("3967", "3968", "3969"), (stryMutAct_9fa48("3971") ? formState.type === 'transfer' && sourceAccount || destAccount : stryMutAct_9fa48("3970") ? true : (stryCov_9fa48("3970", "3971"), (stryMutAct_9fa48("3973") ? formState.type === 'transfer' || sourceAccount : stryMutAct_9fa48("3972") ? true : (stryCov_9fa48("3972", "3973"), (stryMutAct_9fa48("3975") ? formState.type !== 'transfer' : stryMutAct_9fa48("3974") ? true : (stryCov_9fa48("3974", "3975"), formState.type === (stryMutAct_9fa48("3976") ? "" : (stryCov_9fa48("3976"), 'transfer')))) && sourceAccount)) && destAccount)) && (stryMutAct_9fa48("3978") ? sourceAccount.currency === destAccount.currency : stryMutAct_9fa48("3977") ? true : (stryCov_9fa48("3977", "3978"), sourceAccount.currency !== destAccount.currency)));
    const currentBalance = stryMutAct_9fa48("3981") ? sourceAccount?.balanceCents && 0 : stryMutAct_9fa48("3980") ? false : stryMutAct_9fa48("3979") ? true : (stryCov_9fa48("3979", "3980", "3981"), (stryMutAct_9fa48("3982") ? sourceAccount.balanceCents : (stryCov_9fa48("3982"), sourceAccount?.balanceCents)) || 0);
    const expenseAmount = toCents(amount);
    const projectedBalance = (stryMutAct_9fa48("3985") ? formState.type === 'expense' && formState.type === 'transfer' : stryMutAct_9fa48("3984") ? false : stryMutAct_9fa48("3983") ? true : (stryCov_9fa48("3983", "3984", "3985"), (stryMutAct_9fa48("3987") ? formState.type !== 'expense' : stryMutAct_9fa48("3986") ? false : (stryCov_9fa48("3986", "3987"), formState.type === (stryMutAct_9fa48("3988") ? "" : (stryCov_9fa48("3988"), 'expense')))) || (stryMutAct_9fa48("3990") ? formState.type !== 'transfer' : stryMutAct_9fa48("3989") ? false : (stryCov_9fa48("3989", "3990"), formState.type === (stryMutAct_9fa48("3991") ? "" : (stryCov_9fa48("3991"), 'transfer')))))) ? stryMutAct_9fa48("3992") ? currentBalance + expenseAmount : (stryCov_9fa48("3992"), currentBalance - expenseAmount) : stryMutAct_9fa48("3993") ? currentBalance - expenseAmount : (stryCov_9fa48("3993"), currentBalance + expenseAmount);
    const isOverdraft = stryMutAct_9fa48("3996") ? formState.type === 'expense' || formState.type === 'transfer' || projectedBalance < 0 : stryMutAct_9fa48("3995") ? false : stryMutAct_9fa48("3994") ? true : (stryCov_9fa48("3994", "3995", "3996"), (stryMutAct_9fa48("3998") ? formState.type === 'expense' && formState.type === 'transfer' : stryMutAct_9fa48("3997") ? true : (stryCov_9fa48("3997", "3998"), (stryMutAct_9fa48("4000") ? formState.type !== 'expense' : stryMutAct_9fa48("3999") ? false : (stryCov_9fa48("3999", "4000"), formState.type === (stryMutAct_9fa48("4001") ? "" : (stryCov_9fa48("4001"), 'expense')))) || (stryMutAct_9fa48("4003") ? formState.type !== 'transfer' : stryMutAct_9fa48("4002") ? false : (stryCov_9fa48("4002", "4003"), formState.type === (stryMutAct_9fa48("4004") ? "" : (stryCov_9fa48("4004"), 'transfer')))))) && (stryMutAct_9fa48("4007") ? projectedBalance >= 0 : stryMutAct_9fa48("4006") ? projectedBalance <= 0 : stryMutAct_9fa48("4005") ? true : (stryCov_9fa48("4005", "4006", "4007"), projectedBalance < 0)));
    const validate = () => {
      if (stryMutAct_9fa48("4008")) {
        {}
      } else {
        stryCov_9fa48("4008");
        const newErrors: typeof errors = {};
        if (stryMutAct_9fa48("4011") ? false : stryMutAct_9fa48("4010") ? true : stryMutAct_9fa48("4009") ? formState.title.trim() : (stryCov_9fa48("4009", "4010", "4011"), !(stryMutAct_9fa48("4012") ? formState.title : (stryCov_9fa48("4012"), formState.title.trim())))) newErrors.title = stryMutAct_9fa48("4013") ? "" : (stryCov_9fa48("4013"), 'Description is required');
        if (stryMutAct_9fa48("4016") ? formState.title || containsDangerousPatterns(formState.title) : stryMutAct_9fa48("4015") ? false : stryMutAct_9fa48("4014") ? true : (stryCov_9fa48("4014", "4015", "4016"), formState.title && containsDangerousPatterns(formState.title))) newErrors.title = stryMutAct_9fa48("4017") ? "" : (stryCov_9fa48("4017"), 'Description contains invalid content');
        if (stryMutAct_9fa48("4020") ? !amount && toCents(amount) <= 0 : stryMutAct_9fa48("4019") ? false : stryMutAct_9fa48("4018") ? true : (stryCov_9fa48("4018", "4019", "4020"), (stryMutAct_9fa48("4021") ? amount : (stryCov_9fa48("4021"), !amount)) || (stryMutAct_9fa48("4024") ? toCents(amount) > 0 : stryMutAct_9fa48("4023") ? toCents(amount) < 0 : stryMutAct_9fa48("4022") ? false : (stryCov_9fa48("4022", "4023", "4024"), toCents(amount) <= 0)))) newErrors.amount = stryMutAct_9fa48("4025") ? "" : (stryCov_9fa48("4025"), 'Valid amount required');
        if (stryMutAct_9fa48("4028") ? false : stryMutAct_9fa48("4027") ? true : stryMutAct_9fa48("4026") ? formState.category.trim() : (stryCov_9fa48("4026", "4027", "4028"), !(stryMutAct_9fa48("4029") ? formState.category : (stryCov_9fa48("4029"), formState.category.trim())))) newErrors.category = stryMutAct_9fa48("4030") ? "" : (stryCov_9fa48("4030"), 'Category is required');
        if (stryMutAct_9fa48("4033") ? formState.type === 'transfer' || !formState.destinationAccId || formState.destinationAccId === formState.selectedAccId : stryMutAct_9fa48("4032") ? false : stryMutAct_9fa48("4031") ? true : (stryCov_9fa48("4031", "4032", "4033"), (stryMutAct_9fa48("4035") ? formState.type !== 'transfer' : stryMutAct_9fa48("4034") ? true : (stryCov_9fa48("4034", "4035"), formState.type === (stryMutAct_9fa48("4036") ? "" : (stryCov_9fa48("4036"), 'transfer')))) && (stryMutAct_9fa48("4038") ? !formState.destinationAccId && formState.destinationAccId === formState.selectedAccId : stryMutAct_9fa48("4037") ? true : (stryCov_9fa48("4037", "4038"), (stryMutAct_9fa48("4039") ? formState.destinationAccId : (stryCov_9fa48("4039"), !formState.destinationAccId)) || (stryMutAct_9fa48("4041") ? formState.destinationAccId !== formState.selectedAccId : stryMutAct_9fa48("4040") ? false : (stryCov_9fa48("4040", "4041"), formState.destinationAccId === formState.selectedAccId)))))) {
          if (stryMutAct_9fa48("4042")) {
            {}
          } else {
            stryCov_9fa48("4042");
            newErrors.destination = stryMutAct_9fa48("4043") ? "" : (stryCov_9fa48("4043"), 'Select a different destination account');
          }
        }
        setErrors(newErrors);
        return stryMutAct_9fa48("4046") ? Object.keys(newErrors).length !== 0 : stryMutAct_9fa48("4045") ? false : stryMutAct_9fa48("4044") ? true : (stryCov_9fa48("4044", "4045", "4046"), Object.keys(newErrors).length === 0);
      }
    };
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("4047")) {
        {}
      } else {
        stryCov_9fa48("4047");
        e.preventDefault();
        if (stryMutAct_9fa48("4050") ? (isSubmitting || !validate()) && !sourceAccount : stryMutAct_9fa48("4049") ? false : stryMutAct_9fa48("4048") ? true : (stryCov_9fa48("4048", "4049", "4050"), (stryMutAct_9fa48("4052") ? isSubmitting && !validate() : stryMutAct_9fa48("4051") ? false : (stryCov_9fa48("4051", "4052"), isSubmitting || (stryMutAct_9fa48("4053") ? validate() : (stryCov_9fa48("4053"), !validate())))) || (stryMutAct_9fa48("4054") ? sourceAccount : (stryCov_9fa48("4054"), !sourceAccount)))) return;
        const amountCents = Math.abs(toCents(amount));
        if (stryMutAct_9fa48("4057") ? false : stryMutAct_9fa48("4056") ? true : stryMutAct_9fa48("4055") ? amountCents : (stryCov_9fa48("4055", "4056", "4057"), !amountCents)) return;
        setIsSubmitting(stryMutAct_9fa48("4058") ? false : (stryCov_9fa48("4058"), true));
        try {
          if (stryMutAct_9fa48("4059")) {
            {}
          } else {
            stryCov_9fa48("4059");
            const finalCategory = (stryMutAct_9fa48("4062") ? formState.type !== 'transfer' : stryMutAct_9fa48("4061") ? false : stryMutAct_9fa48("4060") ? true : (stryCov_9fa48("4060", "4061", "4062"), formState.type === (stryMutAct_9fa48("4063") ? "" : (stryCov_9fa48("4063"), 'transfer')))) ? stryMutAct_9fa48("4064") ? "" : (stryCov_9fa48("4064"), 'Transfer') : formState.category;
            let destinationAmountCents = amountCents;
            if (stryMutAct_9fa48("4066") ? false : stryMutAct_9fa48("4065") ? true : (stryCov_9fa48("4065", "4066"), isDifferentCurrency)) {
              if (stryMutAct_9fa48("4067")) {
                {}
              } else {
                stryCov_9fa48("4067");
                const rate = parseFloat(formState.exchangeRate);
                if (stryMutAct_9fa48("4070") ? isNaN(rate) && rate <= 0 : stryMutAct_9fa48("4069") ? false : stryMutAct_9fa48("4068") ? true : (stryCov_9fa48("4068", "4069", "4070"), isNaN(rate) || (stryMutAct_9fa48("4073") ? rate > 0 : stryMutAct_9fa48("4072") ? rate < 0 : stryMutAct_9fa48("4071") ? false : (stryCov_9fa48("4071", "4072", "4073"), rate <= 0)))) throw new Error(stryMutAct_9fa48("4074") ? "" : (stryCov_9fa48("4074"), 'Invalid exchange rate'));
                destinationAmountCents = Math.round(stryMutAct_9fa48("4075") ? amountCents / rate : (stryCov_9fa48("4075"), amountCents * rate));
              }
            }
            if (stryMutAct_9fa48("4077") ? false : stryMutAct_9fa48("4076") ? true : (stryCov_9fa48("4076", "4077"), initialData)) {
              if (stryMutAct_9fa48("4078")) {
                {}
              } else {
                stryCov_9fa48("4078");
                await updateTransaction(initialData.id, initialData.accountId, stryMutAct_9fa48("4079") ? {} : (stryCov_9fa48("4079"), {
                  title: formState.title,
                  amountCents,
                  type: formState.type,
                  category: finalCategory,
                  date: transactionDate
                }));
                await refetch(); // Force UI update
                haptic.trigger(stryMutAct_9fa48("4080") ? "" : (stryCov_9fa48("4080"), 'success'));
                showToast(stryMutAct_9fa48("4081") ? "" : (stryCov_9fa48("4081"), 'Transaction updated successfully'), stryMutAct_9fa48("4082") ? "" : (stryCov_9fa48("4082"), 'success'));
              }
            } else {
              if (stryMutAct_9fa48("4083")) {
                {}
              } else {
                stryCov_9fa48("4083");
                const isoDate = new Date(transactionDate + (stryMutAct_9fa48("4084") ? "" : (stryCov_9fa48("4084"), 'T12:00:00'))).toISOString();
                await addTransaction({
                  title: formState.title,
                  amountCents,
                  type: formState.type,
                  category: finalCategory,
                  accountId: formState.selectedAccId,
                  accountName: sourceAccount.name,
                  currency: sourceAccount.currency,
                  date: isoDate,
                  destinationAccountId: formState.type === 'transfer' ? formState.destinationAccId : undefined,
                  ...(isDifferentCurrency && {
                    destinationAmountCents,
                    exchangeRate: parseFloat(formState.exchangeRate)
                  })
                } as any);
                await refetch(); // Force UI update
                haptic.trigger(stryMutAct_9fa48("4085") ? "" : (stryCov_9fa48("4085"), 'success'));
                showToast(stryMutAct_9fa48("4086") ? "" : (stryCov_9fa48("4086"), 'Transaction recorded successfully'), stryMutAct_9fa48("4087") ? "" : (stryCov_9fa48("4087"), 'success'));
              }
            }
            if (stryMutAct_9fa48("4090") ? false : stryMutAct_9fa48("4089") ? true : stryMutAct_9fa48("4088") ? initialData : (stryCov_9fa48("4088", "4089", "4090"), !initialData)) {
              if (stryMutAct_9fa48("4091")) {
                {}
              } else {
                stryCov_9fa48("4091");
                formState.setTitle(stryMutAct_9fa48("4092") ? "Stryker was here!" : (stryCov_9fa48("4092"), ''));
                setAmount(stryMutAct_9fa48("4093") ? "Stryker was here!" : (stryCov_9fa48("4093"), ''));
                setTransactionDate(new Date().toISOString().split(stryMutAct_9fa48("4094") ? "" : (stryCov_9fa48("4094"), 'T'))[0]);
              }
            }
            onClose();
          }
        } catch (error) {
          if (stryMutAct_9fa48("4095")) {
            {}
          } else {
            stryCov_9fa48("4095");
            console.error(stryMutAct_9fa48("4096") ? "" : (stryCov_9fa48("4096"), '[TransactionForm] Failed to save transaction:'), error);
            haptic.trigger(stryMutAct_9fa48("4097") ? "" : (stryCov_9fa48("4097"), 'error'));
            showToast(mapFirebaseError(error), stryMutAct_9fa48("4098") ? "" : (stryCov_9fa48("4098"), 'error'));
          }
        } finally {
          if (stryMutAct_9fa48("4099")) {
            {}
          } else {
            stryCov_9fa48("4099");
            setIsSubmitting(stryMutAct_9fa48("4100") ? true : (stryCov_9fa48("4100"), false));
          }
        }
      }
    };

    // Early returns for empty states
    if (stryMutAct_9fa48("4103") ? accounts.length !== 0 : stryMutAct_9fa48("4102") ? false : stryMutAct_9fa48("4101") ? true : (stryCov_9fa48("4101", "4102", "4103"), accounts.length === 0)) return <NoAccountsMessage />;
    if (stryMutAct_9fa48("4106") ? formState.type === 'transfer' || accounts.length === 1 : stryMutAct_9fa48("4105") ? false : stryMutAct_9fa48("4104") ? true : (stryCov_9fa48("4104", "4105", "4106"), (stryMutAct_9fa48("4108") ? formState.type !== 'transfer' : stryMutAct_9fa48("4107") ? true : (stryCov_9fa48("4107", "4108"), formState.type === (stryMutAct_9fa48("4109") ? "" : (stryCov_9fa48("4109"), 'transfer')))) && (stryMutAct_9fa48("4111") ? accounts.length !== 1 : stryMutAct_9fa48("4110") ? true : (stryCov_9fa48("4110", "4111"), accounts.length === 1)))) return <SingleAccountTransferMessage onClose={onClose} />;
    return <div className="bg-white dark:bg-slate-800 p-1 rounded-xl">
            <h3 className="text-h3 lg:text-h3-lg text-slate-800 dark:text-white mb-4">{getTransactionLabel(formState.type).header}</h3>
            {stryMutAct_9fa48("4114") ? isOverdraft || <OverdraftWarning projectedBalance={projectedBalance} amountCents={toCents(amount)} /> : stryMutAct_9fa48("4113") ? false : stryMutAct_9fa48("4112") ? true : (stryCov_9fa48("4112", "4113", "4114"), isOverdraft && <OverdraftWarning projectedBalance={projectedBalance} amountCents={toCents(amount)} />)}

            <form onSubmit={handleSubmit} className="space-y-4">
                {stryMutAct_9fa48("4117") ? !defaultAccountId || <AccountSelector accounts={accounts} selectedId={formState.selectedAccId} onSelect={formState.setSelectedAccId} label={getTransactionLabel(formState.type).accountLabel} /> : stryMutAct_9fa48("4116") ? false : stryMutAct_9fa48("4115") ? true : (stryCov_9fa48("4115", "4116", "4117"), (stryMutAct_9fa48("4118") ? defaultAccountId : (stryCov_9fa48("4118"), !defaultAccountId)) && <AccountSelector accounts={accounts} selectedId={formState.selectedAccId} onSelect={formState.setSelectedAccId} label={getTransactionLabel(formState.type).accountLabel} />)}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DescriptionField value={formState.title} onChange={formState.setTitle} error={errors.title} onClearError={stryMutAct_9fa48("4119") ? () => undefined : (stryCov_9fa48("4119"), () => setErrors(stryMutAct_9fa48("4120") ? {} : (stryCov_9fa48("4120"), {
            ...errors,
            title: undefined
          })))} />
                    <AmountField value={amount} onChange={setAmount} error={errors.amount} onClearError={stryMutAct_9fa48("4121") ? () => undefined : (stryCov_9fa48("4121"), () => setErrors(stryMutAct_9fa48("4122") ? {} : (stryCov_9fa48("4122"), {
            ...errors,
            amount: undefined
          })))} currency={stryMutAct_9fa48("4123") ? sourceAccount.currency : (stryCov_9fa48("4123"), sourceAccount?.currency)} />
                </div>

                <TransactionTypeSelector type={formState.type} onChange={formState.setType} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        {(stryMutAct_9fa48("4126") ? formState.type !== 'transfer' : stryMutAct_9fa48("4125") ? false : stryMutAct_9fa48("4124") ? true : (stryCov_9fa48("4124", "4125", "4126"), formState.type === (stryMutAct_9fa48("4127") ? "" : (stryCov_9fa48("4127"), 'transfer')))) ? <TransferDetails accounts={accounts} sourceAccount={sourceAccount} destinationAccId={formState.destinationAccId} onDestinationChange={id => {
              if (stryMutAct_9fa48("4128")) {
                {}
              } else {
                stryCov_9fa48("4128");
                formState.setDestinationAccId(id);
                if (stryMutAct_9fa48("4130") ? false : stryMutAct_9fa48("4129") ? true : (stryCov_9fa48("4129", "4130"), errors.destination)) setErrors(stryMutAct_9fa48("4131") ? {} : (stryCov_9fa48("4131"), {
                  ...errors,
                  destination: undefined
                }));
              }
            }} exchangeRate={formState.exchangeRate} onExchangeRateChange={formState.setExchangeRate} amount={amount} error={errors.destination} /> : <CategorySelector category={formState.category} onChange={c => {
              if (stryMutAct_9fa48("4132")) {
                {}
              } else {
                stryCov_9fa48("4132");
                formState.setCategory(c);
                formState.setSuggestedCategory(null);
              }
            }} suggestedCategory={formState.suggestedCategory} onAcceptSuggestion={() => {
              if (stryMutAct_9fa48("4133")) {
                {}
              } else {
                stryCov_9fa48("4133");
                formState.setCategory(formState.suggestedCategory!);
                formState.setSuggestedCategory(null);
              }
            }} error={errors.category} />}
                    </div>
                    <DateField value={transactionDate} onChange={setTransactionDate} />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? stryMutAct_9fa48("4134") ? "" : (stryCov_9fa48("4134"), 'Saving...') : initialData ? stryMutAct_9fa48("4135") ? "" : (stryCov_9fa48("4135"), 'Update Transaction') : (stryMutAct_9fa48("4138") ? formState.type !== 'transfer' : stryMutAct_9fa48("4137") ? false : stryMutAct_9fa48("4136") ? true : (stryCov_9fa48("4136", "4137", "4138"), formState.type === (stryMutAct_9fa48("4139") ? "" : (stryCov_9fa48("4139"), 'transfer')))) ? stryMutAct_9fa48("4140") ? "" : (stryCov_9fa48("4140"), 'Record Transfer') : stryMutAct_9fa48("4141") ? "" : (stryCov_9fa48("4141"), 'Record Transaction')}
                    </button>
                </div>
            </form>
        </div>;
  }
};