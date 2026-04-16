import Foundation

/// Ports src/services/fabric/predictionBudgetSignals.ts.
///
/// Produces up to two predictions per month:
/// 1. `budget_overage` (overall) when current-month expenses exceed last
///    month's by more than 20%.
/// 2. `budget_overage` (per-category burn rate) surfaced for the FIRST
///    category that is on pace for >130% of last month's total, gated
///    on monthProgress > 0.1 and a non-zero prior baseline.
///
/// Parity: the PWA uses a `break` after the first burn-rate hit, so only
/// one category burn-rate prediction is ever emitted. We match that.
enum AnchorBudgetSignals {

    static let overageThreshold: Double = 1.2
    static let burnProjectionThreshold: Double = 1.3
    static let monthProgressFloor: Double = 0.1
    static let overageConfidence: Double = 0.82
    static let burnConfidence: Double = 0.72

    static func build(
        transactions: [AnchorTransaction],
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

        let daysInMonth = cal.dateComponents([.day], from: monthStart, to: nextMonth).day ?? 30
        let monthProgress = Double(day) / Double(max(daysInMonth, 1))
        let mKey = String(format: "%04d-%02d", year, month)
        let currency = transactions.first?.currency ?? "NGN"

        let expenses = transactions.filter { $0.type == "expense" && $0.isActive }
        let thisMonthExpenses = expenses.filter {
            inRange($0.date, start: monthStart, end: nextMonth)
        }
        let lastMonthExpenses = expenses.filter {
            inRange($0.date, start: lastMonthStart, end: monthStart)
        }
        let thisMonth = thisMonthExpenses.reduce(0) { $0 + $1.amountCents }
        let lastMonth = lastMonthExpenses.reduce(0) { $0 + $1.amountCents }

        var results: [AnchorPrediction] = []

        // Overall overage
        if lastMonth > 0 && Double(thisMonth) > Double(lastMonth) * overageThreshold {
            let pct = Int((Double(thisMonth - lastMonth) / Double(lastMonth) * 100.0).rounded())
            results.append(AnchorPrediction(
                id: "pred-budget-overage-\(mKey)",
                kind: .budgetOverage,
                message: "Spending is \(pct)% above last month.",
                detail: "This month: \(AnchorFabricEngine.formatCents(thisMonth, currency)) vs last month: \(AnchorFabricEngine.formatCents(lastMonth, currency)).",
                severity: .warning,
                confidence: overageConfidence,
                actionable: true,
                action: .init(label: "Review spending", navigateTo: "/finance"),
                expiresAt: cal.date(byAdding: .day, value: 3, to: now) ?? now,
                createdAt: now
            ))
        }

        // Per-category burn rate (first match only — matches PWA `break`).
        if monthProgress > monthProgressFloor && lastMonth > 0 {
            let thisByCat = sumByCategory(thisMonthExpenses)
            let lastByCat = sumByCategory(lastMonthExpenses)
            // Deterministic iteration order — PWA uses object key order which
            // is insertion order for string keys. We sort for stability.
            for category in thisByCat.keys.sorted() {
                let spent = thisByCat[category] ?? 0
                let typical = lastByCat[category] ?? 0
                guard typical > 0 else { continue }
                let projected = Double(spent) / monthProgress
                guard projected > Double(typical) * burnProjectionThreshold else { continue }

                let slug = category.lowercased()
                    .replacingOccurrences(of: " ", with: "-", options: .regularExpression)
                results.append(AnchorPrediction(
                    id: "pred-burn-rate-\(slug)-\(mKey)",
                    kind: .budgetOverage,
                    message: "\(category) spend is running high.",
                    detail: "On pace for \(AnchorFabricEngine.formatCents(Int(projected.rounded()), currency)) vs typical \(AnchorFabricEngine.formatCents(typical, currency)) last month.",
                    severity: .warning,
                    confidence: burnConfidence,
                    actionable: true,
                    action: .init(label: "View transactions", navigateTo: "/finance"),
                    expiresAt: cal.date(byAdding: .day, value: 2, to: now) ?? now,
                    createdAt: now
                ))
                break
            }
        }

        return results
    }

    // MARK: — Helpers

    private static func sumByCategory(_ txs: [AnchorTransaction]) -> [String: Int] {
        var out: [String: Int] = [:]
        for tx in txs {
            let cat = tx.category ?? "Other"
            out[cat, default: 0] += tx.amountCents
        }
        return out
    }

    private static func inRange(_ dateStr: String, start: Date, end: Date) -> Bool {
        let fmt = ISO8601DateFormatter()
        fmt.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let alt = DateFormatter()
        alt.dateFormat = "yyyy-MM-dd"
        alt.timeZone = TimeZone(identifier: "UTC")
        guard let d = fmt.date(from: dateStr) ?? alt.date(from: String(dateStr.prefix(10))) else { return false }
        return d >= start && d < end
    }
}
