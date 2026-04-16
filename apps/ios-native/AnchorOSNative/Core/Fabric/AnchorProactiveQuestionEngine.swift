import Foundation

/// Pure calculator — parity port of src/services/fabric/ProactiveQuestionEngine.ts.
///
/// Evaluates four checks in priority order and returns the first match, or nil:
///   1. missed_habit     — confirmed pattern last occurred >3d ago
///   2. completion_drop  — recent 7d < prior 7d × 0.5 (when prior ≥ 2)
///   3. category_spike   — category spend this week > weekly-avg × 1.5
///   4. surplus_idle     — total balance ≥ 50,000 with no savings income in 14d
///
/// `wasShownRecently` is queried once per kind to suppress repeat prompts.
enum AnchorProactiveQuestionEngine {

    private static let sevenDays: TimeInterval = 7 * 24 * 3600
    private static let threeDays: TimeInterval = 3 * 24 * 3600
    private static let fourteenDays: TimeInterval = 14 * 24 * 3600
    private static let thirtyDays: TimeInterval = 30 * 24 * 3600
    private static let spikeThreshold: Double = 1.5
    private static let surplusThresholdCents: Int = 50_000_00

    struct Input {
        let patterns: [AnchorUserPattern]
        let transactions: [AnchorTransaction]
        let commitments: [AnchorCommitment]
        let accounts: [AnchorAccount]
        let now: Date
    }

    /// Predicate consumed by `build` — returns true if a question of `kind`
    /// was already shown inside the last 7 days.
    typealias WasShownRecently = (AnchorProactiveQuestion.Kind) -> Bool

    static func build(
        _ input: Input,
        wasShownRecently: WasShownRecently = { _ in false }
    ) -> AnchorProactiveQuestion? {
        if let q = missedHabit(input, wasShownRecently: wasShownRecently) { return q }
        if let q = completionDrop(input, wasShownRecently: wasShownRecently) { return q }
        if let q = categorySpike(input, wasShownRecently: wasShownRecently) { return q }
        if let q = surplusIdle(input, wasShownRecently: wasShownRecently) { return q }
        return nil
    }

    // MARK: — missed_habit

    private static func missedHabit(_ input: Input, wasShownRecently: WasShownRecently) -> AnchorProactiveQuestion? {
        if wasShownRecently(.missedHabit) { return nil }
        let confirmed = input.patterns.filter { $0.confidence >= 0.6 }
        for p in confirmed {
            guard let last = AnchorDateRange.parse(p.lastOccurred) else { continue }
            if input.now.timeIntervalSince(last) > threeDays {
                let actionLabel = p.actionKind.rawValue.replacingOccurrences(of: "_", with: " ")
                return .init(
                    question: "You usually \(actionLabel). It's been a few days — would you like to do that now?",
                    kind: .missedHabit
                )
            }
        }
        return nil
    }

    // MARK: — completion_drop

    private static func completionDrop(_ input: Input, wasShownRecently: WasShownRecently) -> AnchorProactiveQuestion? {
        if wasShownRecently(.completionDrop) { return nil }
        if input.commitments.isEmpty { return nil }
        let sevenAgo = input.now.timeIntervalSince1970 - sevenDays
        let fourteenAgo = input.now.timeIntervalSince1970 - 2 * sevenDays

        var recent = 0, prior = 0
        for c in input.commitments {
            guard let lc = c.lastCompletedAt,
                  let d = AnchorDateRange.parse(lc) else { continue }
            let ts = d.timeIntervalSince1970
            if ts >= sevenAgo { recent += 1 }
            else if ts >= fourteenAgo { prior += 1 }
        }
        if prior >= 2 && Double(recent) < Double(prior) * 0.5 {
            return .init(
                question: "Your commitment completion has dropped recently. Would you like to review them?",
                kind: .completionDrop
            )
        }
        return nil
    }

    // MARK: — category_spike

    private static func categorySpike(_ input: Input, wasShownRecently: WasShownRecently) -> AnchorProactiveQuestion? {
        if wasShownRecently(.categorySpike) { return nil }
        let expenses = input.transactions.filter { $0.type == "expense" && $0.isActive }
        if expenses.isEmpty { return nil }

        let sevenAgo = input.now.timeIntervalSince1970 - sevenDays
        let thirtyAgo = input.now.timeIntervalSince1970 - thirtyDays

        var recentByCat: [String: Int] = [:]
        var priorByCat: [String: Int] = [:]
        for tx in expenses {
            guard let d = AnchorDateRange.parse(tx.date) else { continue }
            let ts = d.timeIntervalSince1970
            let cat = tx.category ?? "Other"
            if ts >= sevenAgo {
                recentByCat[cat, default: 0] += tx.amountCents
            } else if ts >= thirtyAgo {
                priorByCat[cat, default: 0] += tx.amountCents
            }
        }

        // Preserve insertion order for deterministic first-match
        for cat in expenses.compactMap({ $0.category }) {
            guard let recentTotal = recentByCat[cat] else { continue }
            let priorTotal = priorByCat[cat] ?? 0
            let weeklyAvg = Double(priorTotal) / (23.0 / 7.0)
            if weeklyAvg > 0 && Double(recentTotal) > weeklyAvg * spikeThreshold {
                return .init(
                    question: "Spending in \(cat) is higher than usual this week. Want to take a look?",
                    kind: .categorySpike
                )
            }
        }
        return nil
    }

    // MARK: — surplus_idle

    private static func surplusIdle(_ input: Input, wasShownRecently: WasShownRecently) -> AnchorProactiveQuestion? {
        if wasShownRecently(.surplusIdle) { return nil }
        let total = input.accounts.reduce(0) { $0 + $1.balanceCents }
        if total < surplusThresholdCents { return nil }

        let fourteenAgo = input.now.timeIntervalSince1970 - fourteenDays
        let savingsRegex = try? NSRegularExpression(pattern: "saving|invest", options: .caseInsensitive)

        let hasSavingsActivity = input.transactions.contains { tx in
            guard tx.type == "income",
                  let cat = tx.category,
                  let d = AnchorDateRange.parse(tx.date),
                  d.timeIntervalSince1970 >= fourteenAgo else { return false }
            let range = NSRange(cat.startIndex..., in: cat)
            return savingsRegex?.firstMatch(in: cat, range: range) != nil
        }

        if !hasSavingsActivity {
            return .init(
                question: "You have surplus funds available. Would you like to set a savings goal?",
                kind: .surplusIdle
            )
        }
        return nil
    }
}
