/**
 * useFabricSuggestions
 * 
 * Fabric v1.5: Intelligent suggestion system that bridges commitments to transactions.
 * When a user completes a financial-related commitment, suggests recording it in Finance.
 * 
 * @example
 * const { suggestions, onCommitmentCompleted, dismissSuggestion } = useFabricSuggestions();
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
import { useState, useCallback } from 'react';
import type { AnchorTask, TabView } from '../types';
export interface FabricSuggestion {
  id: string;
  type: 'financial' | 'commitment' | 'milestone' | 'warning';
  title: string;
  message: string;
  action: () => void;
  dismiss: () => void;
  metadata?: {
    amount?: number;
    category?: string;
    accountId?: string;
    taskTitle?: string;
  };
}
interface UseFabricSuggestionsResult {
  suggestions: FabricSuggestion[];
  onCommitmentCompleted: (task: AnchorTask, navigateTo: (tab: TabView, params?: Record<string, string | number | undefined>) => void) => void;
  dismissSuggestion: (id: string) => void;
  clearAllSuggestions: () => void;
}

// Financial keywords that trigger transaction suggestions
const FINANCIAL_KEYWORDS = stryMutAct_9fa48("7097") ? [] : (stryCov_9fa48("7097"), [stryMutAct_9fa48("7098") ? "" : (stryCov_9fa48("7098"), 'pay'), stryMutAct_9fa48("7099") ? "" : (stryCov_9fa48("7099"), 'buy'), stryMutAct_9fa48("7100") ? "" : (stryCov_9fa48("7100"), 'bill'), stryMutAct_9fa48("7101") ? "" : (stryCov_9fa48("7101"), 'rent'), stryMutAct_9fa48("7102") ? "" : (stryCov_9fa48("7102"), 'subscription'), stryMutAct_9fa48("7103") ? "" : (stryCov_9fa48("7103"), 'lease'), stryMutAct_9fa48("7104") ? "" : (stryCov_9fa48("7104"), 'insurance'), stryMutAct_9fa48("7105") ? "" : (stryCov_9fa48("7105"), 'tax'), stryMutAct_9fa48("7106") ? "" : (stryCov_9fa48("7106"), 'purchase'), stryMutAct_9fa48("7107") ? "" : (stryCov_9fa48("7107"), 'spent'), stryMutAct_9fa48("7108") ? "" : (stryCov_9fa48("7108"), 'grocery'), stryMutAct_9fa48("7109") ? "" : (stryCov_9fa48("7109"), 'utilities'), stryMutAct_9fa48("7110") ? "" : (stryCov_9fa48("7110"), 'electric'), stryMutAct_9fa48("7111") ? "" : (stryCov_9fa48("7111"), 'water'), stryMutAct_9fa48("7112") ? "" : (stryCov_9fa48("7112"), 'internet'), stryMutAct_9fa48("7113") ? "" : (stryCov_9fa48("7113"), 'phone'), stryMutAct_9fa48("7114") ? "" : (stryCov_9fa48("7114"), 'gas'), stryMutAct_9fa48("7115") ? "" : (stryCov_9fa48("7115"), 'fuel'), stryMutAct_9fa48("7116") ? "" : (stryCov_9fa48("7116"), 'medicine'), stryMutAct_9fa48("7117") ? "" : (stryCov_9fa48("7117"), 'doctor')]);

// Category detection keywords - ordered by specificity
const CATEGORY_KEYWORDS: Record<string, string[]> = stryMutAct_9fa48("7118") ? {} : (stryCov_9fa48("7118"), {
  'Transportation': stryMutAct_9fa48("7119") ? [] : (stryCov_9fa48("7119"), [stryMutAct_9fa48("7120") ? "" : (stryCov_9fa48("7120"), 'fuel'), stryMutAct_9fa48("7121") ? "" : (stryCov_9fa48("7121"), 'uber'), stryMutAct_9fa48("7122") ? "" : (stryCov_9fa48("7122"), 'lyft'), stryMutAct_9fa48("7123") ? "" : (stryCov_9fa48("7123"), 'transit'), stryMutAct_9fa48("7124") ? "" : (stryCov_9fa48("7124"), 'bus'), stryMutAct_9fa48("7125") ? "" : (stryCov_9fa48("7125"), 'train'), stryMutAct_9fa48("7126") ? "" : (stryCov_9fa48("7126"), 'car gas'), stryMutAct_9fa48("7127") ? "" : (stryCov_9fa48("7127"), 'gas for car'), stryMutAct_9fa48("7128") ? "" : (stryCov_9fa48("7128"), 'petrol'), stryMutAct_9fa48("7129") ? "" : (stryCov_9fa48("7129"), 'gasoline')]),
  'Bills & Utilities': stryMutAct_9fa48("7130") ? [] : (stryCov_9fa48("7130"), [stryMutAct_9fa48("7131") ? "" : (stryCov_9fa48("7131"), 'electric'), stryMutAct_9fa48("7132") ? "" : (stryCov_9fa48("7132"), 'water'), stryMutAct_9fa48("7133") ? "" : (stryCov_9fa48("7133"), 'gas bill'), stryMutAct_9fa48("7134") ? "" : (stryCov_9fa48("7134"), 'internet'), stryMutAct_9fa48("7135") ? "" : (stryCov_9fa48("7135"), 'phone'), stryMutAct_9fa48("7136") ? "" : (stryCov_9fa48("7136"), 'utility'), stryMutAct_9fa48("7137") ? "" : (stryCov_9fa48("7137"), 'bill')]),
  'Rent': stryMutAct_9fa48("7138") ? [] : (stryCov_9fa48("7138"), [stryMutAct_9fa48("7139") ? "" : (stryCov_9fa48("7139"), 'rent'), stryMutAct_9fa48("7140") ? "" : (stryCov_9fa48("7140"), 'lease'), stryMutAct_9fa48("7141") ? "" : (stryCov_9fa48("7141"), 'housing'), stryMutAct_9fa48("7142") ? "" : (stryCov_9fa48("7142"), 'mortgage')]),
  'Insurance': stryMutAct_9fa48("7143") ? [] : (stryCov_9fa48("7143"), [stryMutAct_9fa48("7144") ? "" : (stryCov_9fa48("7144"), 'insurance'), stryMutAct_9fa48("7145") ? "" : (stryCov_9fa48("7145"), 'premium'), stryMutAct_9fa48("7146") ? "" : (stryCov_9fa48("7146"), 'policy')]),
  'Groceries': stryMutAct_9fa48("7147") ? [] : (stryCov_9fa48("7147"), [stryMutAct_9fa48("7148") ? "" : (stryCov_9fa48("7148"), 'grocery'), stryMutAct_9fa48("7149") ? "" : (stryCov_9fa48("7149"), 'groceries'), stryMutAct_9fa48("7150") ? "" : (stryCov_9fa48("7150"), 'food'), stryMutAct_9fa48("7151") ? "" : (stryCov_9fa48("7151"), 'supermarket'), stryMutAct_9fa48("7152") ? "" : (stryCov_9fa48("7152"), 'market')]),
  'Subscriptions': stryMutAct_9fa48("7153") ? [] : (stryCov_9fa48("7153"), [stryMutAct_9fa48("7154") ? "" : (stryCov_9fa48("7154"), 'subscription'), stryMutAct_9fa48("7155") ? "" : (stryCov_9fa48("7155"), 'netflix'), stryMutAct_9fa48("7156") ? "" : (stryCov_9fa48("7156"), 'spotify'), stryMutAct_9fa48("7157") ? "" : (stryCov_9fa48("7157"), 'membership'), stryMutAct_9fa48("7158") ? "" : (stryCov_9fa48("7158"), 'premium')]),
  'Health': stryMutAct_9fa48("7159") ? [] : (stryCov_9fa48("7159"), [stryMutAct_9fa48("7160") ? "" : (stryCov_9fa48("7160"), 'medicine'), stryMutAct_9fa48("7161") ? "" : (stryCov_9fa48("7161"), 'doctor'), stryMutAct_9fa48("7162") ? "" : (stryCov_9fa48("7162"), 'pharmacy'), stryMutAct_9fa48("7163") ? "" : (stryCov_9fa48("7163"), 'hospital'), stryMutAct_9fa48("7164") ? "" : (stryCov_9fa48("7164"), 'clinic'), stryMutAct_9fa48("7165") ? "" : (stryCov_9fa48("7165"), 'health')]),
  'Shopping': stryMutAct_9fa48("7166") ? [] : (stryCov_9fa48("7166"), [stryMutAct_9fa48("7167") ? "" : (stryCov_9fa48("7167"), 'buy'), stryMutAct_9fa48("7168") ? "" : (stryCov_9fa48("7168"), 'purchase'), stryMutAct_9fa48("7169") ? "" : (stryCov_9fa48("7169"), 'shop'), stryMutAct_9fa48("7170") ? "" : (stryCov_9fa48("7170"), 'store')])
});

/**
 * Parse amount from text patterns like "$150", "150 dollars", "NGN 5000"
 */
export function parseAmountFromText(text: string): number | null {
  if (stryMutAct_9fa48("7171")) {
    {}
  } else {
    stryCov_9fa48("7171");
    const patterns = stryMutAct_9fa48("7172") ? [] : (stryCov_9fa48("7172"), [stryMutAct_9fa48("7180") ? /\$(\d+(?:,\d{3})*(?:\.\D{2})?)/ : stryMutAct_9fa48("7179") ? /\$(\d+(?:,\d{3})*(?:\.\d)?)/ : stryMutAct_9fa48("7178") ? /\$(\d+(?:,\d{3})*(?:\.\d{2}))/ : stryMutAct_9fa48("7177") ? /\$(\d+(?:,\D{3})*(?:\.\d{2})?)/ : stryMutAct_9fa48("7176") ? /\$(\d+(?:,\d)*(?:\.\d{2})?)/ : stryMutAct_9fa48("7175") ? /\$(\d+(?:,\d{3})(?:\.\d{2})?)/ : stryMutAct_9fa48("7174") ? /\$(\D+(?:,\d{3})*(?:\.\d{2})?)/ : stryMutAct_9fa48("7173") ? /\$(\d(?:,\d{3})*(?:\.\d{2})?)/ : (stryCov_9fa48("7173", "7174", "7175", "7176", "7177", "7178", "7179", "7180"), /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/), // $150 or $1,500.00
    stryMutAct_9fa48("7191") ? /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars|usd)/i : stryMutAct_9fa48("7190") ? /(\d+(?:,\d{3})*(?:\.\d{2})?)\S*(?:dollars?|usd)/i : stryMutAct_9fa48("7189") ? /(\d+(?:,\d{3})*(?:\.\d{2})?)\s(?:dollars?|usd)/i : stryMutAct_9fa48("7188") ? /(\d+(?:,\d{3})*(?:\.\D{2})?)\s*(?:dollars?|usd)/i : stryMutAct_9fa48("7187") ? /(\d+(?:,\d{3})*(?:\.\d)?)\s*(?:dollars?|usd)/i : stryMutAct_9fa48("7186") ? /(\d+(?:,\d{3})*(?:\.\d{2}))\s*(?:dollars?|usd)/i : stryMutAct_9fa48("7185") ? /(\d+(?:,\D{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/i : stryMutAct_9fa48("7184") ? /(\d+(?:,\d)*(?:\.\d{2})?)\s*(?:dollars?|usd)/i : stryMutAct_9fa48("7183") ? /(\d+(?:,\d{3})(?:\.\d{2})?)\s*(?:dollars?|usd)/i : stryMutAct_9fa48("7182") ? /(\D+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/i : stryMutAct_9fa48("7181") ? /(\d(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/i : (stryCov_9fa48("7181", "7182", "7183", "7184", "7185", "7186", "7187", "7188", "7189", "7190", "7191"), /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|usd)/i), // 150 dollars
    stryMutAct_9fa48("7201") ? /(?:NGN|₦)\s*(\d+(?:,\d{3})*(?:\.\D{2})?)/i : stryMutAct_9fa48("7200") ? /(?:NGN|₦)\s*(\d+(?:,\d{3})*(?:\.\d)?)/i : stryMutAct_9fa48("7199") ? /(?:NGN|₦)\s*(\d+(?:,\d{3})*(?:\.\d{2}))/i : stryMutAct_9fa48("7198") ? /(?:NGN|₦)\s*(\d+(?:,\D{3})*(?:\.\d{2})?)/i : stryMutAct_9fa48("7197") ? /(?:NGN|₦)\s*(\d+(?:,\d)*(?:\.\d{2})?)/i : stryMutAct_9fa48("7196") ? /(?:NGN|₦)\s*(\d+(?:,\d{3})(?:\.\d{2})?)/i : stryMutAct_9fa48("7195") ? /(?:NGN|₦)\s*(\D+(?:,\d{3})*(?:\.\d{2})?)/i : stryMutAct_9fa48("7194") ? /(?:NGN|₦)\s*(\d(?:,\d{3})*(?:\.\d{2})?)/i : stryMutAct_9fa48("7193") ? /(?:NGN|₦)\S*(\d+(?:,\d{3})*(?:\.\d{2})?)/i : stryMutAct_9fa48("7192") ? /(?:NGN|₦)\s(\d+(?:,\d{3})*(?:\.\d{2})?)/i : (stryCov_9fa48("7192", "7193", "7194", "7195", "7196", "7197", "7198", "7199", "7200", "7201"), /(?:NGN|₦)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i), // NGN 5000 or ₦5000
    stryMutAct_9fa48("7211") ? /(\d+(?:,\d{3})*(?:\.\d{2})?)\S*(?:naira|ngn)/i : stryMutAct_9fa48("7210") ? /(\d+(?:,\d{3})*(?:\.\d{2})?)\s(?:naira|ngn)/i : stryMutAct_9fa48("7209") ? /(\d+(?:,\d{3})*(?:\.\D{2})?)\s*(?:naira|ngn)/i : stryMutAct_9fa48("7208") ? /(\d+(?:,\d{3})*(?:\.\d)?)\s*(?:naira|ngn)/i : stryMutAct_9fa48("7207") ? /(\d+(?:,\d{3})*(?:\.\d{2}))\s*(?:naira|ngn)/i : stryMutAct_9fa48("7206") ? /(\d+(?:,\D{3})*(?:\.\d{2})?)\s*(?:naira|ngn)/i : stryMutAct_9fa48("7205") ? /(\d+(?:,\d)*(?:\.\d{2})?)\s*(?:naira|ngn)/i : stryMutAct_9fa48("7204") ? /(\d+(?:,\d{3})(?:\.\d{2})?)\s*(?:naira|ngn)/i : stryMutAct_9fa48("7203") ? /(\D+(?:,\d{3})*(?:\.\d{2})?)\s*(?:naira|ngn)/i : stryMutAct_9fa48("7202") ? /(\d(?:,\d{3})*(?:\.\d{2})?)\s*(?:naira|ngn)/i : (stryCov_9fa48("7202", "7203", "7204", "7205", "7206", "7207", "7208", "7209", "7210", "7211"), /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:naira|ngn)/i) // 5000 naira
    ]);
    for (const pattern of patterns) {
      if (stryMutAct_9fa48("7212")) {
        {}
      } else {
        stryCov_9fa48("7212");
        const match = text.match(pattern);
        if (stryMutAct_9fa48("7214") ? false : stryMutAct_9fa48("7213") ? true : (stryCov_9fa48("7213", "7214"), match)) {
          if (stryMutAct_9fa48("7215")) {
            {}
          } else {
            stryCov_9fa48("7215");
            return parseFloat(match[1].replace(/,/g, stryMutAct_9fa48("7216") ? "Stryker was here!" : (stryCov_9fa48("7216"), '')));
          }
        }
      }
    }
    return null;
  }
}

/**
 * Detect transaction category from text
 */
export function detectCategory(text: string): string {
  if (stryMutAct_9fa48("7217")) {
    {}
  } else {
    stryCov_9fa48("7217");
    const textLower = stryMutAct_9fa48("7218") ? text.toUpperCase() : (stryCov_9fa48("7218"), text.toLowerCase());
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (stryMutAct_9fa48("7219")) {
        {}
      } else {
        stryCov_9fa48("7219");
        if (stryMutAct_9fa48("7222") ? keywords.every(kw => textLower.includes(kw)) : stryMutAct_9fa48("7221") ? false : stryMutAct_9fa48("7220") ? true : (stryCov_9fa48("7220", "7221", "7222"), keywords.some(stryMutAct_9fa48("7223") ? () => undefined : (stryCov_9fa48("7223"), kw => textLower.includes(kw))))) {
          if (stryMutAct_9fa48("7224")) {
            {}
          } else {
            stryCov_9fa48("7224");
            return category;
          }
        }
      }
    }
    return stryMutAct_9fa48("7225") ? "" : (stryCov_9fa48("7225"), 'General');
  }
}

/**
 * Check if text contains financial keywords
 */
export function isFinanciallyRelevant(text: string): boolean {
  if (stryMutAct_9fa48("7226")) {
    {}
  } else {
    stryCov_9fa48("7226");
    const textLower = stryMutAct_9fa48("7227") ? text.toUpperCase() : (stryCov_9fa48("7227"), text.toLowerCase());
    return stryMutAct_9fa48("7228") ? FINANCIAL_KEYWORDS.every(kw => textLower.includes(kw)) : (stryCov_9fa48("7228"), FINANCIAL_KEYWORDS.some(stryMutAct_9fa48("7229") ? () => undefined : (stryCov_9fa48("7229"), kw => textLower.includes(kw))));
  }
}
export function useFabricSuggestions(): UseFabricSuggestionsResult {
  if (stryMutAct_9fa48("7230")) {
    {}
  } else {
    stryCov_9fa48("7230");
    const [suggestions, setSuggestions] = useState<FabricSuggestion[]>(stryMutAct_9fa48("7231") ? ["Stryker was here"] : (stryCov_9fa48("7231"), []));
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const dismissSuggestion = useCallback((id: string) => {
      if (stryMutAct_9fa48("7232")) {
        {}
      } else {
        stryCov_9fa48("7232");
        setDismissed(stryMutAct_9fa48("7233") ? () => undefined : (stryCov_9fa48("7233"), prev => new Set(prev).add(id)));
        setSuggestions(stryMutAct_9fa48("7234") ? () => undefined : (stryCov_9fa48("7234"), prev => stryMutAct_9fa48("7235") ? prev : (stryCov_9fa48("7235"), prev.filter(stryMutAct_9fa48("7236") ? () => undefined : (stryCov_9fa48("7236"), s => stryMutAct_9fa48("7239") ? s.id === id : stryMutAct_9fa48("7238") ? false : stryMutAct_9fa48("7237") ? true : (stryCov_9fa48("7237", "7238", "7239"), s.id !== id))))));
      }
    }, stryMutAct_9fa48("7240") ? ["Stryker was here"] : (stryCov_9fa48("7240"), []));
    const clearAllSuggestions = useCallback(() => {
      if (stryMutAct_9fa48("7241")) {
        {}
      } else {
        stryCov_9fa48("7241");
        setSuggestions(stryMutAct_9fa48("7242") ? ["Stryker was here"] : (stryCov_9fa48("7242"), []));
        setDismissed(new Set());
      }
    }, stryMutAct_9fa48("7243") ? ["Stryker was here"] : (stryCov_9fa48("7243"), []));
    const onCommitmentCompleted = useCallback((task: AnchorTask, navigateTo: (tab: TabView, params?: Record<string, string | number | undefined>) => void) => {
      if (stryMutAct_9fa48("7244")) {
        {}
      } else {
        stryCov_9fa48("7244");
        // Only suggest for financially relevant tasks
        if (stryMutAct_9fa48("7247") ? false : stryMutAct_9fa48("7246") ? true : stryMutAct_9fa48("7245") ? isFinanciallyRelevant(task.title) : (stryCov_9fa48("7245", "7246", "7247"), !isFinanciallyRelevant(task.title))) {
          if (stryMutAct_9fa48("7248")) {
            {}
          } else {
            stryCov_9fa48("7248");
            return;
          }
        }
        const suggestionId = stryMutAct_9fa48("7249") ? `` : (stryCov_9fa48("7249"), `tx-${task.id}-${Date.now()}`);

        // Don't suggest if already dismissed
        if (stryMutAct_9fa48("7251") ? false : stryMutAct_9fa48("7250") ? true : (stryCov_9fa48("7250", "7251"), dismissed.has(stryMutAct_9fa48("7252") ? suggestionId.split('-').join('-') : (stryCov_9fa48("7252"), suggestionId.split(stryMutAct_9fa48("7253") ? "" : (stryCov_9fa48("7253"), '-')).slice(0, 2).join(stryMutAct_9fa48("7254") ? "" : (stryCov_9fa48("7254"), '-')))))) {
          if (stryMutAct_9fa48("7255")) {
            {}
          } else {
            stryCov_9fa48("7255");
            return;
          }
        }
        const amount = parseAmountFromText(task.title);
        const category = detectCategory(task.title);
        const suggestion: FabricSuggestion = stryMutAct_9fa48("7256") ? {} : (stryCov_9fa48("7256"), {
          id: suggestionId,
          type: stryMutAct_9fa48("7257") ? "" : (stryCov_9fa48("7257"), 'financial'),
          title: stryMutAct_9fa48("7258") ? "" : (stryCov_9fa48("7258"), 'Record Transaction?'),
          message: stryMutAct_9fa48("7259") ? `` : (stryCov_9fa48("7259"), `You completed "${task.title}". Want to record this in Finance?`),
          action: () => {
            if (stryMutAct_9fa48("7260")) {
              {}
            } else {
              stryCov_9fa48("7260");
              // Navigate to finance page with prefill data
              navigateTo(stryMutAct_9fa48("7261") ? "" : (stryCov_9fa48("7261"), 'finance'), stryMutAct_9fa48("7262") ? {} : (stryCov_9fa48("7262"), {
                amount: stryMutAct_9fa48("7265") ? amount && undefined : stryMutAct_9fa48("7264") ? false : stryMutAct_9fa48("7263") ? true : (stryCov_9fa48("7263", "7264", "7265"), amount || undefined),
                category,
                description: task.title,
                action: stryMutAct_9fa48("7266") ? "" : (stryCov_9fa48("7266"), 'new') // Trigger modal open
              }));
              dismissSuggestion(suggestionId);
            }
          },
          dismiss: stryMutAct_9fa48("7267") ? () => undefined : (stryCov_9fa48("7267"), () => dismissSuggestion(suggestionId)),
          metadata: stryMutAct_9fa48("7268") ? {} : (stryCov_9fa48("7268"), {
            amount: stryMutAct_9fa48("7271") ? amount && undefined : stryMutAct_9fa48("7270") ? false : stryMutAct_9fa48("7269") ? true : (stryCov_9fa48("7269", "7270", "7271"), amount || undefined),
            category,
            taskTitle: task.title
          })
        });
        setSuggestions(stryMutAct_9fa48("7272") ? () => undefined : (stryCov_9fa48("7272"), prev => stryMutAct_9fa48("7273") ? [] : (stryCov_9fa48("7273"), [...prev, suggestion])));
      }
    }, stryMutAct_9fa48("7274") ? [] : (stryCov_9fa48("7274"), [dismissed, dismissSuggestion]));

    // Filter out dismissed suggestions
    const activeSuggestions = stryMutAct_9fa48("7275") ? suggestions : (stryCov_9fa48("7275"), suggestions.filter(stryMutAct_9fa48("7276") ? () => undefined : (stryCov_9fa48("7276"), s => stryMutAct_9fa48("7277") ? dismissed.has(s.id) : (stryCov_9fa48("7277"), !dismissed.has(s.id)))));
    return stryMutAct_9fa48("7278") ? {} : (stryCov_9fa48("7278"), {
      suggestions: activeSuggestions,
      onCommitmentCompleted,
      dismissSuggestion,
      clearAllSuggestions
    });
  }
}