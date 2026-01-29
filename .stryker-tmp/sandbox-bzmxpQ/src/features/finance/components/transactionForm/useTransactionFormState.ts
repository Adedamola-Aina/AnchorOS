/**
 * TransactionForm Hooks
 * Extracted from TransactionForm.tsx per CLAUDE.md §3.2
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
import { useState, useEffect, useRef } from 'react';
import { suggestCategory } from '../../../../utils/finance';
import type { TransactionType, AnchorTransaction, AnchorAccount } from '../../../../types';
interface UseTransactionFormStateProps {
  accounts: AnchorAccount[];
  transactions: AnchorTransaction[];
  initialData?: AnchorTransaction;
  defaultAccountId?: string;
  defaultType: TransactionType;
  prefillData?: {
    amount?: number;
    title?: string;
    category?: string;
  };
}
export function useTransactionFormState({
  accounts,
  transactions,
  initialData,
  defaultAccountId,
  defaultType,
  prefillData
}: UseTransactionFormStateProps) {
  if (stryMutAct_9fa48("4912")) {
    {}
  } else {
    stryCov_9fa48("4912");
    const [selectedAccId, setSelectedAccId] = useState(stryMutAct_9fa48("4915") ? (initialData?.accountId || defaultAccountId) && '' : stryMutAct_9fa48("4914") ? false : stryMutAct_9fa48("4913") ? true : (stryCov_9fa48("4913", "4914", "4915"), (stryMutAct_9fa48("4917") ? initialData?.accountId && defaultAccountId : stryMutAct_9fa48("4916") ? false : (stryCov_9fa48("4916", "4917"), (stryMutAct_9fa48("4918") ? initialData.accountId : (stryCov_9fa48("4918"), initialData?.accountId)) || defaultAccountId)) || (stryMutAct_9fa48("4919") ? "Stryker was here!" : (stryCov_9fa48("4919"), ''))));
    const [destinationAccId, setDestinationAccId] = useState(stryMutAct_9fa48("4922") ? initialData?.destinationAccountId && '' : stryMutAct_9fa48("4921") ? false : stryMutAct_9fa48("4920") ? true : (stryCov_9fa48("4920", "4921", "4922"), (stryMutAct_9fa48("4923") ? initialData.destinationAccountId : (stryCov_9fa48("4923"), initialData?.destinationAccountId)) || (stryMutAct_9fa48("4924") ? "Stryker was here!" : (stryCov_9fa48("4924"), ''))));
    const [type, setType] = useState<TransactionType>(stryMutAct_9fa48("4927") ? initialData?.type && defaultType : stryMutAct_9fa48("4926") ? false : stryMutAct_9fa48("4925") ? true : (stryCov_9fa48("4925", "4926", "4927"), (stryMutAct_9fa48("4928") ? initialData.type : (stryCov_9fa48("4928"), initialData?.type)) || defaultType));
    const [category, setCategory] = useState(stryMutAct_9fa48("4931") ? (initialData?.category || prefillData?.category) && 'General' : stryMutAct_9fa48("4930") ? false : stryMutAct_9fa48("4929") ? true : (stryCov_9fa48("4929", "4930", "4931"), (stryMutAct_9fa48("4933") ? initialData?.category && prefillData?.category : stryMutAct_9fa48("4932") ? false : (stryCov_9fa48("4932", "4933"), (stryMutAct_9fa48("4934") ? initialData.category : (stryCov_9fa48("4934"), initialData?.category)) || (stryMutAct_9fa48("4935") ? prefillData.category : (stryCov_9fa48("4935"), prefillData?.category)))) || (stryMutAct_9fa48("4936") ? "" : (stryCov_9fa48("4936"), 'General'))));
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
    const [exchangeRate, setExchangeRate] = useState(stryMutAct_9fa48("4937") ? "" : (stryCov_9fa48("4937"), '1.0'));
    const [title, setTitle] = useState(stryMutAct_9fa48("4940") ? (initialData?.title || prefillData?.title) && '' : stryMutAct_9fa48("4939") ? false : stryMutAct_9fa48("4938") ? true : (stryCov_9fa48("4938", "4939", "4940"), (stryMutAct_9fa48("4942") ? initialData?.title && prefillData?.title : stryMutAct_9fa48("4941") ? false : (stryCov_9fa48("4941", "4942"), (stryMutAct_9fa48("4943") ? initialData.title : (stryCov_9fa48("4943"), initialData?.title)) || (stryMutAct_9fa48("4944") ? prefillData.title : (stryCov_9fa48("4944"), prefillData?.title)))) || (stryMutAct_9fa48("4945") ? "Stryker was here!" : (stryCov_9fa48("4945"), ''))));

    // Smart defaults effect
    useEffect(() => {
      if (stryMutAct_9fa48("4946")) {
        {}
      } else {
        stryCov_9fa48("4946");
        if (stryMutAct_9fa48("4948") ? false : stryMutAct_9fa48("4947") ? true : (stryCov_9fa48("4947", "4948"), initialData)) return;
        if (stryMutAct_9fa48("4950") ? false : stryMutAct_9fa48("4949") ? true : (stryCov_9fa48("4949", "4950"), defaultAccountId)) {
          if (stryMutAct_9fa48("4951")) {
            {}
          } else {
            stryCov_9fa48("4951");
            setSelectedAccId(defaultAccountId);
            return;
          }
        }
        const lastAccId = localStorage.getItem(stryMutAct_9fa48("4952") ? "" : (stryCov_9fa48("4952"), 'anchor_last_account_id'));
        if (stryMutAct_9fa48("4955") ? lastAccId || accounts.find(a => a.id === lastAccId) : stryMutAct_9fa48("4954") ? false : stryMutAct_9fa48("4953") ? true : (stryCov_9fa48("4953", "4954", "4955"), lastAccId && accounts.find(stryMutAct_9fa48("4956") ? () => undefined : (stryCov_9fa48("4956"), a => stryMutAct_9fa48("4959") ? a.id !== lastAccId : stryMutAct_9fa48("4958") ? false : stryMutAct_9fa48("4957") ? true : (stryCov_9fa48("4957", "4958", "4959"), a.id === lastAccId))))) {
          if (stryMutAct_9fa48("4960")) {
            {}
          } else {
            stryCov_9fa48("4960");
            setSelectedAccId(lastAccId);
          }
        } else if (stryMutAct_9fa48("4963") ? accounts.length > 0 || !selectedAccId : stryMutAct_9fa48("4962") ? false : stryMutAct_9fa48("4961") ? true : (stryCov_9fa48("4961", "4962", "4963"), (stryMutAct_9fa48("4966") ? accounts.length <= 0 : stryMutAct_9fa48("4965") ? accounts.length >= 0 : stryMutAct_9fa48("4964") ? true : (stryCov_9fa48("4964", "4965", "4966"), accounts.length > 0)) && (stryMutAct_9fa48("4967") ? selectedAccId : (stryCov_9fa48("4967"), !selectedAccId)))) {
          if (stryMutAct_9fa48("4968")) {
            {}
          } else {
            stryCov_9fa48("4968");
            setSelectedAccId(accounts[0].id);
          }
        }
        if (stryMutAct_9fa48("4971") ? accounts.length > 1 || !destinationAccId : stryMutAct_9fa48("4970") ? false : stryMutAct_9fa48("4969") ? true : (stryCov_9fa48("4969", "4970", "4971"), (stryMutAct_9fa48("4974") ? accounts.length <= 1 : stryMutAct_9fa48("4973") ? accounts.length >= 1 : stryMutAct_9fa48("4972") ? true : (stryCov_9fa48("4972", "4973", "4974"), accounts.length > 1)) && (stryMutAct_9fa48("4975") ? destinationAccId : (stryCov_9fa48("4975"), !destinationAccId)))) {
          if (stryMutAct_9fa48("4976")) {
            {}
          } else {
            stryCov_9fa48("4976");
            const dest = accounts.find(stryMutAct_9fa48("4977") ? () => undefined : (stryCov_9fa48("4977"), a => stryMutAct_9fa48("4980") ? a.id !== selectedAccId || a.id !== lastAccId : stryMutAct_9fa48("4979") ? false : stryMutAct_9fa48("4978") ? true : (stryCov_9fa48("4978", "4979", "4980"), (stryMutAct_9fa48("4982") ? a.id === selectedAccId : stryMutAct_9fa48("4981") ? true : (stryCov_9fa48("4981", "4982"), a.id !== selectedAccId)) && (stryMutAct_9fa48("4984") ? a.id === lastAccId : stryMutAct_9fa48("4983") ? true : (stryCov_9fa48("4983", "4984"), a.id !== lastAccId)))));
            setDestinationAccId(stryMutAct_9fa48("4987") ? dest?.id && accounts[1].id : stryMutAct_9fa48("4986") ? false : stryMutAct_9fa48("4985") ? true : (stryCov_9fa48("4985", "4986", "4987"), (stryMutAct_9fa48("4988") ? dest.id : (stryCov_9fa48("4988"), dest?.id)) || accounts[1].id));
          }
        }
      }
    }, stryMutAct_9fa48("4989") ? [] : (stryCov_9fa48("4989"), [accounts, defaultAccountId, initialData, selectedAccId, destinationAccId]));

    // Prevent same-account transfer
    useEffect(() => {
      if (stryMutAct_9fa48("4990")) {
        {}
      } else {
        stryCov_9fa48("4990");
        if (stryMutAct_9fa48("4993") ? selectedAccId === destinationAccId || accounts.length > 1 : stryMutAct_9fa48("4992") ? false : stryMutAct_9fa48("4991") ? true : (stryCov_9fa48("4991", "4992", "4993"), (stryMutAct_9fa48("4995") ? selectedAccId !== destinationAccId : stryMutAct_9fa48("4994") ? true : (stryCov_9fa48("4994", "4995"), selectedAccId === destinationAccId)) && (stryMutAct_9fa48("4998") ? accounts.length <= 1 : stryMutAct_9fa48("4997") ? accounts.length >= 1 : stryMutAct_9fa48("4996") ? true : (stryCov_9fa48("4996", "4997", "4998"), accounts.length > 1)))) {
          if (stryMutAct_9fa48("4999")) {
            {}
          } else {
            stryCov_9fa48("4999");
            const next = accounts.find(stryMutAct_9fa48("5000") ? () => undefined : (stryCov_9fa48("5000"), a => stryMutAct_9fa48("5003") ? a.id === selectedAccId : stryMutAct_9fa48("5002") ? false : stryMutAct_9fa48("5001") ? true : (stryCov_9fa48("5001", "5002", "5003"), a.id !== selectedAccId)));
            if (stryMutAct_9fa48("5005") ? false : stryMutAct_9fa48("5004") ? true : (stryCov_9fa48("5004", "5005"), next)) setDestinationAccId(next.id);
          }
        }
      }
    }, stryMutAct_9fa48("5006") ? [] : (stryCov_9fa48("5006"), [selectedAccId, destinationAccId, accounts]));

    // Reset exchange rate on account change
    useEffect(() => {
      if (stryMutAct_9fa48("5007")) {
        {}
      } else {
        stryCov_9fa48("5007");
        setExchangeRate(stryMutAct_9fa48("5008") ? "" : (stryCov_9fa48("5008"), '1.0'));
      }
    }, stryMutAct_9fa48("5009") ? [] : (stryCov_9fa48("5009"), [selectedAccId, destinationAccId]));

    // Smart categorization with debounce
    const suggestionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("5010")) {
        {}
      } else {
        stryCov_9fa48("5010");
        if (stryMutAct_9fa48("5012") ? false : stryMutAct_9fa48("5011") ? true : (stryCov_9fa48("5011", "5012"), suggestionTimeoutRef.current)) clearTimeout(suggestionTimeoutRef.current);
        if (stryMutAct_9fa48("5015") ? title.length >= 2 || type !== 'transfer' : stryMutAct_9fa48("5014") ? false : stryMutAct_9fa48("5013") ? true : (stryCov_9fa48("5013", "5014", "5015"), (stryMutAct_9fa48("5018") ? title.length < 2 : stryMutAct_9fa48("5017") ? title.length > 2 : stryMutAct_9fa48("5016") ? true : (stryCov_9fa48("5016", "5017", "5018"), title.length >= 2)) && (stryMutAct_9fa48("5020") ? type === 'transfer' : stryMutAct_9fa48("5019") ? true : (stryCov_9fa48("5019", "5020"), type !== (stryMutAct_9fa48("5021") ? "" : (stryCov_9fa48("5021"), 'transfer')))))) {
          if (stryMutAct_9fa48("5022")) {
            {}
          } else {
            stryCov_9fa48("5022");
            suggestionTimeoutRef.current = setTimeout(() => {
              if (stryMutAct_9fa48("5023")) {
                {}
              } else {
                stryCov_9fa48("5023");
                const suggestion = suggestCategory(title, transactions);
                if (stryMutAct_9fa48("5026") ? suggestion || suggestion !== category : stryMutAct_9fa48("5025") ? false : stryMutAct_9fa48("5024") ? true : (stryCov_9fa48("5024", "5025", "5026"), suggestion && (stryMutAct_9fa48("5028") ? suggestion === category : stryMutAct_9fa48("5027") ? true : (stryCov_9fa48("5027", "5028"), suggestion !== category)))) {
                  if (stryMutAct_9fa48("5029")) {
                    {}
                  } else {
                    stryCov_9fa48("5029");
                    setSuggestedCategory(suggestion);
                  }
                } else {
                  if (stryMutAct_9fa48("5030")) {
                    {}
                  } else {
                    stryCov_9fa48("5030");
                    setSuggestedCategory(null);
                  }
                }
              }
            }, 300);
          }
        } else {
          if (stryMutAct_9fa48("5031")) {
            {}
          } else {
            stryCov_9fa48("5031");
            setSuggestedCategory(null);
          }
        }
        return () => {
          if (stryMutAct_9fa48("5032")) {
            {}
          } else {
            stryCov_9fa48("5032");
            if (stryMutAct_9fa48("5034") ? false : stryMutAct_9fa48("5033") ? true : (stryCov_9fa48("5033", "5034"), suggestionTimeoutRef.current)) clearTimeout(suggestionTimeoutRef.current);
          }
        };
      }
    }, stryMutAct_9fa48("5035") ? [] : (stryCov_9fa48("5035"), [title, transactions, category, type]));
    const handleSetAccount = (id: string) => {
      if (stryMutAct_9fa48("5036")) {
        {}
      } else {
        stryCov_9fa48("5036");
        setSelectedAccId(id);
        localStorage.setItem(stryMutAct_9fa48("5037") ? "" : (stryCov_9fa48("5037"), 'anchor_last_account_id'), id);
      }
    };
    return stryMutAct_9fa48("5038") ? {} : (stryCov_9fa48("5038"), {
      selectedAccId,
      setSelectedAccId: handleSetAccount,
      destinationAccId,
      setDestinationAccId,
      type,
      setType,
      category,
      setCategory,
      suggestedCategory,
      setSuggestedCategory,
      exchangeRate,
      setExchangeRate,
      title,
      setTitle
    });
  }
}