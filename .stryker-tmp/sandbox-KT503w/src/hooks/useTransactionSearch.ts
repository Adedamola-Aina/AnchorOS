/**
 * useTransactionSearch Hook
 * 
 * Optimized transaction search with pre-built index for sub-500ms
 * performance on 1000+ transactions. Addresses BUG-001.
 * 
 * Strategy:
 * 1. Build search index once when transactions change
 * 2. Search against index for O(n) filtering (vs O(n*m) naive approach)
 * 3. Index by lowercase words from title, category, accountName
 * 
 * @module hooks/useTransactionSearch
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
import { useMemo } from 'react';
import type { AnchorTransaction } from '../types';
interface TransactionSearchResult {
  /** Filtered transactions matching the search query */
  filteredTransactions: AnchorTransaction[];
  /** Whether a search is currently active */
  isSearching: boolean;
  /** Number of results found */
  resultCount: number;
}

/**
 * Extracts searchable words from a transaction
 * Combines title, category, and accountName into lowercase tokens
 */
const getSearchableText = (tx: AnchorTransaction): string => {
  if (stryMutAct_9fa48("7872")) {
    {}
  } else {
    stryCov_9fa48("7872");
    const parts = stryMutAct_9fa48("7873") ? [] : (stryCov_9fa48("7873"), [stryMutAct_9fa48("7876") ? tx.title && '' : stryMutAct_9fa48("7875") ? false : stryMutAct_9fa48("7874") ? true : (stryCov_9fa48("7874", "7875", "7876"), tx.title || (stryMutAct_9fa48("7877") ? "Stryker was here!" : (stryCov_9fa48("7877"), ''))), stryMutAct_9fa48("7880") ? tx.category && '' : stryMutAct_9fa48("7879") ? false : stryMutAct_9fa48("7878") ? true : (stryCov_9fa48("7878", "7879", "7880"), tx.category || (stryMutAct_9fa48("7881") ? "Stryker was here!" : (stryCov_9fa48("7881"), ''))), stryMutAct_9fa48("7884") ? tx.accountName && '' : stryMutAct_9fa48("7883") ? false : stryMutAct_9fa48("7882") ? true : (stryCov_9fa48("7882", "7883", "7884"), tx.accountName || (stryMutAct_9fa48("7885") ? "Stryker was here!" : (stryCov_9fa48("7885"), '')))]);
    return stryMutAct_9fa48("7886") ? parts.join(' ').toUpperCase() : (stryCov_9fa48("7886"), parts.join(stryMutAct_9fa48("7887") ? "" : (stryCov_9fa48("7887"), ' ')).toLowerCase());
  }
};

/**
 * Optimized transaction search hook
 * 
 * @param transactions - Array of transactions to search
 * @param query - Search query string
 * @returns Search results with filtered transactions and metadata
 * 
 * @example
 * ```tsx
 * const { filteredTransactions, isSearching, resultCount } = 
 *   useTransactionSearch(transactions, searchQuery);
 * ```
 */
export const useTransactionSearch = (transactions: AnchorTransaction[], query: string): TransactionSearchResult => {
  if (stryMutAct_9fa48("7888")) {
    {}
  } else {
    stryCov_9fa48("7888");
    // Normalize query once
    const normalizedQuery = stryMutAct_9fa48("7890") ? query.toLowerCase() : stryMutAct_9fa48("7889") ? query.trim().toUpperCase() : (stryCov_9fa48("7889", "7890"), query.trim().toLowerCase());
    const isSearching = stryMutAct_9fa48("7894") ? normalizedQuery.length <= 0 : stryMutAct_9fa48("7893") ? normalizedQuery.length >= 0 : stryMutAct_9fa48("7892") ? false : stryMutAct_9fa48("7891") ? true : (stryCov_9fa48("7891", "7892", "7893", "7894"), normalizedQuery.length > 0);

    // Pre-compute searchable text for each transaction (memoized)
    // This creates an index on the first render, avoiding repeated string operations
    const searchIndex = useMemo(() => {
      if (stryMutAct_9fa48("7895")) {
        {}
      } else {
        stryCov_9fa48("7895");
        return transactions.map(stryMutAct_9fa48("7896") ? () => undefined : (stryCov_9fa48("7896"), tx => stryMutAct_9fa48("7897") ? {} : (stryCov_9fa48("7897"), {
          transaction: tx,
          searchText: getSearchableText(tx)
        })));
      }
    }, stryMutAct_9fa48("7898") ? [] : (stryCov_9fa48("7898"), [transactions]));

    // Filter transactions using the pre-built index
    const filteredTransactions = useMemo(() => {
      if (stryMutAct_9fa48("7899")) {
        {}
      } else {
        stryCov_9fa48("7899");
        if (stryMutAct_9fa48("7902") ? false : stryMutAct_9fa48("7901") ? true : stryMutAct_9fa48("7900") ? isSearching : (stryCov_9fa48("7900", "7901", "7902"), !isSearching)) {
          if (stryMutAct_9fa48("7903")) {
            {}
          } else {
            stryCov_9fa48("7903");
            return transactions;
          }
        }

        // Split query into words for multi-word matching
        const queryWords = stryMutAct_9fa48("7904") ? normalizedQuery.split(/\s+/) : (stryCov_9fa48("7904"), normalizedQuery.split(stryMutAct_9fa48("7906") ? /\S+/ : stryMutAct_9fa48("7905") ? /\s/ : (stryCov_9fa48("7905", "7906"), /\s+/)).filter(stryMutAct_9fa48("7907") ? () => undefined : (stryCov_9fa48("7907"), w => stryMutAct_9fa48("7911") ? w.length <= 0 : stryMutAct_9fa48("7910") ? w.length >= 0 : stryMutAct_9fa48("7909") ? false : stryMutAct_9fa48("7908") ? true : (stryCov_9fa48("7908", "7909", "7910", "7911"), w.length > 0))));
        if (stryMutAct_9fa48("7914") ? queryWords.length !== 0 : stryMutAct_9fa48("7913") ? false : stryMutAct_9fa48("7912") ? true : (stryCov_9fa48("7912", "7913", "7914"), queryWords.length === 0)) {
          if (stryMutAct_9fa48("7915")) {
            {}
          } else {
            stryCov_9fa48("7915");
            return transactions;
          }
        }

        // For single word: simple includes check
        // For multiple words: all words must be present
        return stryMutAct_9fa48("7916") ? searchIndex.map(({
          transaction
        }) => transaction) : (stryCov_9fa48("7916"), searchIndex.filter(({
          searchText
        }) => {
          if (stryMutAct_9fa48("7917")) {
            {}
          } else {
            stryCov_9fa48("7917");
            return stryMutAct_9fa48("7918") ? queryWords.some(word => searchText.includes(word)) : (stryCov_9fa48("7918"), queryWords.every(stryMutAct_9fa48("7919") ? () => undefined : (stryCov_9fa48("7919"), word => searchText.includes(word))));
          }
        }).map(stryMutAct_9fa48("7920") ? () => undefined : (stryCov_9fa48("7920"), ({
          transaction
        }) => transaction)));
      }
    }, stryMutAct_9fa48("7921") ? [] : (stryCov_9fa48("7921"), [searchIndex, normalizedQuery, isSearching, transactions]));
    return stryMutAct_9fa48("7922") ? {} : (stryCov_9fa48("7922"), {
      filteredTransactions,
      isSearching,
      resultCount: filteredTransactions.length
    });
  }
};
export default useTransactionSearch;