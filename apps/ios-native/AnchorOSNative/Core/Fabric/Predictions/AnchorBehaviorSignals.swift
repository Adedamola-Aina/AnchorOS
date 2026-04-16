import Foundation

/// Ports src/services/fabric/predictionBehaviorSignals.ts.
///
/// PWA produces up to four behavior signals:
///   1. streak_at_risk   — pending daily commitments late in the day
///   2. recurring_due    — a learned spending pattern coming due
///   3. cash_flow_alert  — month-end surplus opportunity
///   4. unusual_spending — 7-day spike vs typical weekly spend
///
/// Phase 4b-3 ports 1, 3, 4. Signal #2 depends on a Patterns infra
/// (input.patterns) that does not yet exist natively; it is intentionally
/// deferred to Phase 4b-5 (PatternSignals) where pattern input lands.
enum AnchorBehaviorSignals {

    static let streakConfidence:  Double = 0.75
    static let surplusConfidence: Double = 0.65
    static let spikeConfidence:   Double = 0.68

    static func build(
        transactions: [AnchorTransaction],
        commitments: [AnchorCommitment],
        now: Date
    ) -> [AnchorPrediction] {
        let cal = Calendar(identifier: .gregorian)
        let comps = cal.dateComponents([.year, .month, .day], from: now)
        guard let year = comps.year,
              let month = comps.month,
              let day = comps.day,
              let monthStart = cal.date(from: DateComponents(year: year, month: month, day: 1)),
              let nextMonth = cal.date(byAdding: .month, value: 1, to: monthStart),
              let lastMonthStart = cal.date(byAdding: .month, value: -1, to: monthStart)
        else { return [] }

        let mKey = String(format: "%04d-%02d", year, month)
        let isoDay: String = {
            let df = DateFormatter()
            df.dateFormat = "yyyy-MM-dd"
            df.timeZone = TimeZone(identifier: "UTC")
            return df.string(from: now)
        }()
        let currency = transactions.first?.currency ?? "NGN"

        var results: [AnchorPrediction] = []

        // (1) Streak at risk
        let pendingDaily = commitments.filter { $0.type == "daily" && !$0.completed }
        if let riskiest = pendingDaily.max(by: {
            ($0.currentStreak ?? 0) < ($1.currentStreak ?? 0)
        }) {
            let streak = riskiest.currentStreak ?? 0
            let streakInfo: String = streak > 0
                ? " Your \"\(riskiest.title)\" streak is at \(streak) day\(streak == 1 ? "" : "s")."
                : ""
            let msg: String = pendingDaily.count == 1
                ? "\"\(riskiest.title)\" is still incomplete today."
                : "\(pendingDaily.count) daily commitments are still pending."
            results.append(AnchorPrediction(
                id: "pred-streak-risk-\(isoDay)",
                kind: .streakAtRisk,
                message: msg,
                detail: "Complete before midnight to keep your streak.\(streakInfo)",
                severity: .warning,
                confidence: streakConfidence,
                actionable: true,
                action: .init(label: "Open commitments", navigateTo: "/commitments"),
                expiresAt: cal.date(byAdding: .day, value: 1, to: now) ?? now,
                createdAt: now
            ))
        }

        // Expense bucket shared by (3) and (4).
        let expenses = transactions.filter { $0.type == "expense" && $0.isActive }
        let thisMonthExp = expenses.filter {
            AnchorDateRange.inRange($0.date, start: monthStart, end: nextMonth)
        }
        let thisMonthExpTotal = thisMonthExp.reduce(0) { $0 + $1.amountCents }
        let thisMonthIncomeTotal = transactions
            .filter { $0.type == "income" && $0.isActive }
            .filter { AnchorDateRange.inRange($0.date, start: monthStart, end: nextMonth) }
            .reduce(0) { $0 + $1.amountCents }

        // (3) Cash-flow alert — surplus after mid-month.
        let surplus = thisMonthIncomeTotal - thisMonthExpTotal
        if thisMonthIncomeTotal > 0 && surplus > 0 && day >= 15 {
            results.append(AnchorPrediction(
                id: "pred-savings-opportunity-\(mKey)",
                kind: .cashFlowAlert,
                message: "You have a surplus of \(AnchorFabricEngine.formatCents(surplus, currency)) this month.",
                detail: "Consider moving the difference to a savings account.",
                severity: .info,
                confidence: surplusConfidence,
                actionable: true,
                action: .init(label: "View accounts", navigateTo: "/finance"),
                expiresAt: cal.date(byAdding: .day, value: 7, to: now) ?? now,
                createdAt: now
            ))
        }

        // (4) 7-day spike vs typical weekly spend (= lastMonth / 4).
        let sevenDaysAgo = cal.date(byAdding: .day, value: -7, to: now) ?? now
        let last7 = expenses.filter {
            AnchorDateRange.parse($0.date).map { $0 >= sevenDaysAgo } ?? false
        }
        let last7Total = last7.reduce(0) { $0 + $1.amountCents }
        let lastMonthTotal = expenses
            .filter { AnchorDateRange.inRange($0.date, start: lastMonthStart, end: monthStart) }
            .reduce(0) { $0 + $1.amountCents }
        let typical7 = Double(lastMonthTotal) / 4.0
        if typical7 > 0 && Double(last7Total) > typical7 * 1.5 && last7.count >= 3 {
            let pct = Int((Double(last7Total) / typical7 * 100.0).rounded())
            results.append(AnchorPrediction(
                id: "pred-unusual-spike-\(isoDay)",
                kind: .unusualSpending,
                message: "Higher than usual spending in the last 7 days.",
                detail: "\(AnchorFabricEngine.formatCents(last7Total, currency)) spent - about \(pct)% of your typical weekly spend.",
                severity: .warning,
                confidence: spikeConfidence,
                actionable: true,
                action: .init(label: "Review transactions", navigateTo: "/finance"),
                expiresAt: cal.date(byAdding: .day, value: 2, to: now) ?? now,
                createdAt: now
            ))
        }

        return results
    }
}

/// Shared ISO-date range helper for signal modules.
enum AnchorDateRange {
    static func parse(_ dateStr: String) -> Date? {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let d = iso.date(from: dateStr) { return d }
        let df = DateFormatter()
        df.dateFormat = "yyyy-MM-dd"
        df.timeZone = TimeZone(identifier: "UTC")
        return df.date(from: String(dateStr.prefix(10)))
    }

    static func inRange(_ dateStr: String, start: Date, end: Date) -> Bool {
        guard let d = parse(dateStr) else { return false }
        return d >= start && d < end
    }
}
