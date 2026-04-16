import Foundation

/// Keyword-based intent classifier. Parity: priority-sorted regex table
/// mirroring src/services/fabric/intentDetection.ts. Extended in Phase
/// 4e-2/3 to cover record_expense / record_income and the remaining
/// query surfaces (income, accounts, recurring, momentum, scenario).
///
/// Phase 4e-4 adds conversation-context resolution via
/// `parse(_:history:)` — when a raw input returns `.unknown` but looks
/// like a follow-up, inherit the last user message's action.
enum AnchorIntentParser {

    private struct Rule {
        let action: AnchorFabricIntent.Action
        let priority: Int
        let pattern: String
    }

    /// Ordered by priority. High priority wins on first match.
    private static let rules: [Rule] = [
        .init(action: .navigate,        priority: 100,
              pattern: #"\b(go to|open|navigate|take me to|show me)\b"#),
        .init(action: .recordExpense,   priority: 90,
              pattern: #"\b(record|add|log|track|paid|just paid|spent|i spent|bought|purchased|got|used|charged)\b.*\b(expense|buy|bought|food|fuel|bill|transport|groceries|rent|subscription|airtime|data|electricity|water)\b"#),
        .init(action: .recordExpense,   priority: 85,
              pattern: #"\b(record|add|log|track)\b.*(₦|\$|naira|dollars?)"#),
        .init(action: .recordExpense,   priority: 82,
              pattern: #"\b(bought|purchased|got|used|charged|paid for)\b.*(₦|\$|naira|dollars?|\d{3,})"#),
        .init(action: .recordIncome,    priority: 90,
              pattern: #"\b(record|add|log|received|got paid|salary|credited)\b.*\b(income|salary|credit|payment|received)\b"#),
        .init(action: .summarizeWeek,   priority: 80,
              pattern: #"\b(week(ly)? (summary|report|review)|how (did|was) my week|this week recap|generate weekly report)\b"#),
        .init(action: .planWeek,        priority: 78,
              pattern: #"\b(plan (my )?week|week (ahead|plan|overview|preview)|help me plan|what'?s? (this|next) week)\b"#),
        .init(action: .queryToday,      priority: 75,
              pattern: #"\b(what (do i have|is on|should i do) today|today'?s? (schedule|plan|tasks?|agenda)|what'?s? today)\b"#),
        .init(action: .queryScenario,   priority: 72,
              pattern: #"\b(what if|what would happen|if i (cut|reduce|stop|save|spend less)|scenario|simulate|hypothetical)\b"#),
        .init(action: .queryCorrelation, priority: 68,
              pattern: #"\b(habits?\s+and\s+(spend|money|finance)|spend\s+.*\s+habits?|connection\s+between|correlation|when\s+i\s+(do|complete|follow)\s+.*\s+(spend|money))\b"#),
        .init(action: .queryDayOfWeek,   priority: 67,
              pattern: #"\b(which\s+day|what\s+day|best\s+day|worst\s+day|when\s+do\s+i\s+spend\s+most|most\s+expensive\s+day|highest\s+spend\s+day)\b"#),
        .init(action: .queryCommitments, priority: 70,
              pattern: #"\b(commitment|commitments|streak|habit|habits|daily|todo)\b"#),
        .init(action: .queryUpcoming,   priority: 65,
              pattern: #"\b(what'?s? coming up|upcoming (bills?|payments?|expenses?)|due soon|next (bill|payment)|what do i owe|remind me)\b"#),
        .init(action: .queryMomentum,   priority: 63,
              pattern: #"\b(momentum|trending|how am i trending|better or worse|improving|getting better|this week vs|compared to last week|how am i doing)\b"#),
        .init(action: .querySavingsRate, priority: 62,
              pattern: #"\b(savings? rate|how much (am i saving|did i save)|saving percentage|am i saving enough|what percentage (am|did) i save)\b"#),
        .init(action: .querySpending,   priority: 60,
              pattern: #"\b(how much|spent|spending|expense|expenses|cost|budget|what did i (spend|pay))\b"#),
        .init(action: .queryIncome,     priority: 60,
              pattern: #"\b(income|earned|earning|salary|how much (did i )?(earn|make|receive|get paid))\b"#),
        .init(action: .queryAccounts,   priority: 55,
              pattern: #"\b(account|accounts|balance|balances|how much (do i have|is in))\b"#),
        .init(action: .queryRecurring,  priority: 55,
              pattern: #"\b(recurring|subscriptions?|subscription|automatic|auto.?pay|bills? due|scheduled payment)\b"#),
        .init(action: .queryFamily,     priority: 55,
              pattern: #"\b(family|shared|household|partner|spouse)\b"#),
        .init(action: .queryNetWorth,   priority: 55,
              pattern: #"\b(net worth|total wealth|overall balance|financial position)\b"#),
    ]

    static let navPages: Set<String> = [
        "dashboard", "commitments", "fabric", "finance", "settings"
    ]

    private static let followUpPattern = #"\b(what about|and|how about|same for|compare|also|but)\b"#

    private static func confidence(_ action: AnchorFabricIntent.Action) -> Double {
        switch action {
        case .navigate: return 0.92
        case .recordExpense, .recordIncome: return 0.88
        case .summarizeWeek: return 0.85
        case .unknown: return 0.15
        default: return 0.8
        }
    }

    private static func detectAction(_ input: String) -> AnchorFabricIntent.Action {
        let sorted = rules.sorted { $0.priority > $1.priority }
        for rule in sorted {
            guard let rx = try? NSRegularExpression(pattern: rule.pattern, options: [.caseInsensitive])
            else { continue }
            let r = NSRange(input.startIndex..., in: input)
            if rx.firstMatch(in: input, range: r) != nil { return rule.action }
        }
        return .unknown
    }

    private static func detectTimePeriod(_ input: String) -> AnchorFabricIntent.TimePeriod? {
        if input.range(of: #"\byesterday\b"#, options: .regularExpression) != nil { return .yesterday }
        if input.range(of: #"\btoday\b"#, options: .regularExpression) != nil { return .today }
        if input.range(of: #"\blast\s+week\b"#, options: .regularExpression) != nil { return .lastWeek }
        if input.range(of: #"\blast\s+month\b"#, options: .regularExpression) != nil { return .lastMonth }
        if input.range(of: #"\bthis\s+week\b|\bweek\b"#, options: .regularExpression) != nil { return .thisWeek }
        if input.range(of: #"\bthis\s+month\b|\bmonth\b"#, options: .regularExpression) != nil { return .thisMonth }
        return nil
    }

    static func parse(_ raw: String,
                      history: [AnchorFabricMessage]? = nil) -> AnchorFabricIntent {
        let input = raw.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)
        let action = detectAction(input)

        // Contextual follow-up resolution (Phase 4e-4). Parity with
        // src/services/fabric/contextualIntent.ts → resolveContextualIntent.
        if action == .unknown,
           let history, !history.isEmpty,
           input.range(of: followUpPattern, options: .regularExpression) != nil,
           let lastUser = history.reversed().first(where: { $0.role == .user }) {
            let priorInput = lastUser.content.lowercased()
            let priorAction = detectAction(priorInput)
            if priorAction != .unknown {
                let ents = AnchorFabricIntent.Entities(
                    amount: AnchorEntityParser.parseAmount(input) ?? AnchorEntityParser.parseAmount(priorInput),
                    category: AnchorEntityParser.extractContextCategory(input)
                        ?? AnchorEntityParser.extractContextCategory(priorInput),
                    timePeriod: detectTimePeriod(input) ?? detectTimePeriod(priorInput),
                    page: nil
                )
                return AnchorFabricIntent(
                    action: priorAction,
                    confidence: confidence(priorAction) * 0.85,
                    entities: ents,
                    rawInput: raw
                )
            }
        }

        let page = navPages.first { input.contains($0) }
        let ents = AnchorFabricIntent.Entities(
            amount: AnchorEntityParser.parseAmount(input),
            category: AnchorEntityParser.parseCategory(input),
            timePeriod: detectTimePeriod(input),
            page: page
        )
        return AnchorFabricIntent(
            action: action,
            confidence: confidence(action),
            entities: ents,
            rawInput: raw
        )
    }
}
