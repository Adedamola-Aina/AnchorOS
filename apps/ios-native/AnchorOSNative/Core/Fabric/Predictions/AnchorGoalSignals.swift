import Foundation

/// Ports src/services/fabric/predictionGoalSignals.ts.
///
/// Emits up to MAX_GOAL_SIGNALS predictions, one per eligible goal:
///   - goal_on_track (info)   — monthlySavings >= required monthly pace
///   - goal_at_risk  (warn)   — otherwise
///
/// Sort rule: goal_at_risk first, then by confidence desc. Capped at 3.
enum AnchorGoalSignals {

    static let maxSignals: Int = 3

    static func build(
        goals: [AnchorGoal],
        transactions: [AnchorTransaction],
        now: Date
    ) -> [AnchorPrediction] {
        guard !goals.isEmpty else { return [] }

        let monthlySavings = estimateMonthlySavings(transactions: transactions, now: now)
        var signals: [AnchorPrediction] = []

        for goal in goals {
            guard let targetDateStr = goal.targetDate,
                  let targetDate = AnchorDateRange.parse(targetDateStr) else { continue }
            let remaining = goal.targetAmountCents - goal.currentAmountCents
            guard remaining > 0 else { continue }

            let monthsLeft = monthsBetween(from: now, to: targetDate)
            guard monthsLeft > 0 else { continue }

            let requiredPerMonth = Double(remaining) / Double(monthsLeft)
            let onTrack = Double(monthlySavings) >= requiredPerMonth

            // PWA: Math.ceil — or Infinity when monthlySavings == 0
            let estimatedMonths: Int? = monthlySavings > 0
                ? Int(ceil(Double(remaining) / Double(monthlySavings)))
                : nil

            let confidence: Double = onTrack
                ? min(0.6 + (Double(monthlySavings) / requiredPerMonth - 1.0) * 0.2, 0.95)
                : min(0.5 + (1.0 - Double(monthlySavings) / requiredPerMonth) * 0.2, 0.9)

            signals.append(buildPrediction(
                goal: goal,
                onTrack: onTrack,
                estimatedMonths: estimatedMonths,
                confidence: confidence,
                now: now
            ))
        }

        return signals
            .sorted { a, b in
                if a.kind == .goalAtRisk && b.kind != .goalAtRisk { return true }
                if b.kind == .goalAtRisk && a.kind != .goalAtRisk { return false }
                return a.confidence > b.confidence
            }
            .prefix(maxSignals)
            .map { $0 }
    }

    // MARK: — Helpers

    private static func buildPrediction(
        goal: AnchorGoal,
        onTrack: Bool,
        estimatedMonths: Int?,
        confidence: Double,
        now: Date
    ) -> AnchorPrediction {
        let cal = Calendar(identifier: .gregorian)
        let remaining = goal.targetAmountCents - goal.currentAmountCents
        let formatted = AnchorFabricEngine.formatCents(remaining, goal.currency)

        if onTrack {
            let months = estimatedMonths ?? 0
            let plural = months == 1 ? "" : "s"
            return AnchorPrediction(
                id: "pred-goal-track-\(goal.id)",
                kind: .goalOnTrack,
                message: "\"\(goal.title)\" is on track.",
                detail: "\(formatted) remaining — estimated \(months) month\(plural) to goal.",
                severity: .info,
                confidence: confidence,
                actionable: false,
                action: nil,
                expiresAt: cal.date(byAdding: .day, value: 14, to: now) ?? now,
                createdAt: now
            )
        }

        let monthsLabel: String = {
            guard let m = estimatedMonths else { return "∞" }
            return "\(m)"
        }()
        let plural = estimatedMonths == 1 ? "" : "s"
        return AnchorPrediction(
            id: "pred-goal-risk-\(goal.id)",
            kind: .goalAtRisk,
            message: "\"\(goal.title)\" may miss its target date.",
            detail: "\(formatted) remaining — at current pace, ~\(monthsLabel) month\(plural) needed vs target.",
            severity: .warning,
            confidence: confidence,
            actionable: true,
            action: .init(label: "Review goal", navigateTo: "/finance"),
            expiresAt: cal.date(byAdding: .day, value: 7, to: now) ?? now,
            createdAt: now
        )
    }

    private static func estimateMonthlySavings(
        transactions: [AnchorTransaction],
        now: Date
    ) -> Int {
        let cal = Calendar(identifier: .gregorian)
        let comps = cal.dateComponents([.year, .month], from: now)
        guard let y = comps.year, let m = comps.month,
              let monthStart = cal.date(from: DateComponents(year: y, month: m, day: 1)),
              let lastMonthStart = cal.date(byAdding: .month, value: -1, to: monthStart)
        else { return 0 }
        // PWA uses lastMonth (inclusive) … lastMonthEnd (end of prior month, inclusive).
        // That's [lastMonthStart, monthStart) open on the right.
        let income = transactions
            .filter { $0.type == "income" && $0.isActive }
            .filter { AnchorDateRange.inRange($0.date, start: lastMonthStart, end: monthStart) }
            .reduce(0) { $0 + $1.amountCents }
        let expenses = transactions
            .filter { $0.type == "expense" && $0.isActive }
            .filter { AnchorDateRange.inRange($0.date, start: lastMonthStart, end: monthStart) }
            .reduce(0) { $0 + $1.amountCents }
        return max(income - expenses, 0)
    }

    private static func monthsBetween(from: Date, to: Date) -> Int {
        let cal = Calendar(identifier: .gregorian)
        let a = cal.dateComponents([.year, .month], from: from)
        let b = cal.dateComponents([.year, .month], from: to)
        guard let ay = a.year, let am = a.month, let by = b.year, let bm = b.month else { return 0 }
        return (by - ay) * 12 + (bm - am)
    }
}
