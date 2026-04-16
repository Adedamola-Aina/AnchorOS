import Foundation

/// Keyword-based intent classifier. Parity: mirrors the priority-sorted
/// rule table in src/services/fabric/intentDetection.ts for the Phase 4e
/// MVP subset. No LLM, no contextual history — deterministic regex match
/// over lowercased input.
///
/// Anything outside the native action set (record_expense, record_income,
/// scenarios, momentum, correlation, etc.) resolves to `.unknown` here;
/// the UI then shows the "I'm not sure" fallback identical to PWA.
enum AnchorIntentParser {

    private struct Rule {
        let action: AnchorFabricIntent.Action
        let priority: Int
        let pattern: String
    }

    // Ordered by priority. Matches PWA rule priorities for the subset we
    // support. When extending, keep the ordering in lockstep.
    private static let rules: [Rule] = [
        .init(action: .navigate,       priority: 100,
              pattern: #"\b(go to|open|navigate|take me to|show me)\b"#),
        .init(action: .summarizeWeek,  priority: 80,
              pattern: #"\b(week(ly)? (summary|report|review)|how (did|was) my week|this week recap|generate weekly report)\b"#),
        .init(action: .planWeek,       priority: 78,
              pattern: #"\b(plan (my )?week|week (ahead|plan|overview|preview)|help me plan|what's? (this|next) week)\b"#),
        .init(action: .queryToday,     priority: 75,
              pattern: #"\b(what (do i have|is on|should i do) today|today'?s? (schedule|plan|tasks?|agenda)|what'?s? today)\b"#),
        .init(action: .queryCommitments, priority: 70,
              pattern: #"\b(commitment|commitments|streak|habit|habits|daily|todo)\b"#),
        .init(action: .queryUpcoming,  priority: 65,
              pattern: #"\b(what'?s? coming up|upcoming (bills?|payments?|expenses?)|due soon|next (bill|payment)|what do i owe|remind me)\b"#),
        .init(action: .querySavingsRate, priority: 62,
              pattern: #"\b(savings? rate|how much (am i saving|did i save)|saving percentage|am i saving enough|what percentage (am|did) i save)\b"#),
        .init(action: .querySpending,  priority: 60,
              pattern: #"\b(how much|spent|spending|expense|expenses|cost|budget|what did i (spend|pay))\b"#),
        .init(action: .queryNetWorth,  priority: 55,
              pattern: #"\b(net worth|total wealth|overall balance|financial position)\b"#),
    ]

    static let navPages: Set<String> = [
        "dashboard", "commitments", "fabric", "finance", "settings"
    ]

    /// Parity with src/services/fabric/intentDetection.ts `confidenceFor`.
    private static func confidence(_ action: AnchorFabricIntent.Action) -> Double {
        switch action {
        case .navigate: return 0.92
        case .summarizeWeek: return 0.85
        case .unknown: return 0.15
        default: return 0.8
        }
    }

    private static func detectTimePeriod(_ input: String) -> AnchorFabricIntent.TimePeriod? {
        if input.contains("today") { return .today }
        if input.contains("this week") || input.contains("week") { return .thisWeek }
        if input.contains("last month") { return .lastMonth }
        if input.contains("this month") || input.contains("month") { return .thisMonth }
        return nil
    }

    static func parse(_ raw: String) -> AnchorFabricIntent {
        let input = raw.lowercased().trimmingCharacters(in: .whitespacesAndNewlines)

        // Sort rules high→low priority, return first match
        let sorted = rules.sorted { $0.priority > $1.priority }
        var action: AnchorFabricIntent.Action = .unknown
        for rule in sorted {
            if (try? NSRegularExpression(pattern: rule.pattern))?
                .firstMatch(in: input, range: NSRange(input.startIndex..., in: input)) != nil {
                action = rule.action
                break
            }
        }

        let page = navPages.first { input.contains($0) }

        return AnchorFabricIntent(
            action: action,
            confidence: confidence(action),
            entities: .init(
                timePeriod: detectTimePeriod(input),
                page: page
            ),
            rawInput: raw
        )
    }
}
