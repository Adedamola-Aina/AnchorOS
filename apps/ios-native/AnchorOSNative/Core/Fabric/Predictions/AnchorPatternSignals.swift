import Foundation

/// Ports src/services/fabric/predictionPatternSignals.ts.
///
/// For each pattern with confidence >= 0.65, emit at most one signal
/// based on its trigger type:
///   - time_of_day          → commitment_reminder near trigger hour
///   - transaction_recorded → budget_overage when category exceeds
///                            last month's total by >20%
///   - commitment_completed → commitment_reminder when the linked
///                            daily task is still pending
/// Breaks after 2 results to mirror PWA cap.
enum AnchorPatternSignals {

    static let minConfidence: Double = 0.65
    static let maxResults: Int = 2

    static func build(
        patterns: [AnchorUserPattern],
        transactions: [AnchorTransaction],
        commitments: [AnchorCommitment],
        now: Date
    ) -> [AnchorPrediction] {
        let cal = Calendar(identifier: .gregorian)
        let comps = cal.dateComponents([.year, .month, .hour], from: now)
        guard let year = comps.year, let month = comps.month,
              let hour = comps.hour,
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

        let confirmed = patterns.filter { $0.confidence >= minConfidence }
        var results: [AnchorPrediction] = []

        for pattern in confirmed {
            switch pattern.triggerKind {
            case .timeOfDay:
                if let triggerHour = pattern.triggerHour,
                   abs(hour - triggerHour) <= 2 {
                    let isCommitment = pattern.actionKind == .checkCommitment
                    results.append(AnchorPrediction(
                        id: "pred-pattern-time-\(triggerHour)-\(mKey)",
                        kind: .commitmentReminder,
                        message: "Based on your patterns, this is when you usually check in.",
                        detail: "You tend to review your \(isCommitment ? "commitments" : "budget") around this time.",
                        severity: .info,
                        confidence: pattern.confidence,
                        actionable: true,
                        action: .init(
                            label: isCommitment ? "Open Commitments" : "Review Budget",
                            navigateTo: isCommitment ? "/commitments" : "/finance"
                        ),
                        expiresAt: cal.date(byAdding: .day, value: 1, to: now) ?? now,
                        createdAt: now
                    ))
                }

            case .transactionRecorded:
                if let cat = pattern.triggerCategory {
                    let thisMonthTotal = categoryTotal(
                        transactions, category: cat,
                        start: monthStart, end: nextMonth
                    )
                    let lastMonthTotal = categoryTotal(
                        transactions, category: cat,
                        start: lastMonthStart, end: monthStart
                    )
                    if lastMonthTotal > 0 && Double(thisMonthTotal) > Double(lastMonthTotal) * 1.2 {
                        let pct = Int((Double(thisMonthTotal - lastMonthTotal) / Double(lastMonthTotal) * 100.0).rounded())
                        let slug = cat.lowercased()
                            .replacingOccurrences(of: " ", with: "-", options: .regularExpression)
                        results.append(AnchorPrediction(
                            id: "pred-pattern-category-\(slug)-\(mKey)",
                            kind: .budgetOverage,
                            message: "You tend to review your \(cat) budget after spending here.",
                            detail: "\(cat) is up \(pct)% vs last month (\(AnchorFabricEngine.formatCents(thisMonthTotal, currency)) vs \(AnchorFabricEngine.formatCents(lastMonthTotal, currency))).",
                            severity: .info,
                            confidence: pattern.confidence * 0.9,
                            actionable: true,
                            action: .init(label: "Review spending", navigateTo: "/finance"),
                            expiresAt: cal.date(byAdding: .day, value: 3, to: now) ?? now,
                            createdAt: now
                        ))
                    }
                }

            case .commitmentCompleted:
                if let cid = pattern.triggerCommitmentId,
                   let task = commitments.first(where: { $0.resolvedId == cid }),
                   !task.completed, task.type == "daily" {
                    let streakDetail: String = {
                        if let s = task.currentStreak, s > 0 {
                            return "\(s)-day streak - don't break it."
                        }
                        return ""
                    }()
                    results.append(AnchorPrediction(
                        id: "pred-pattern-commitment-\(task.resolvedId)-\(isoDay)",
                        kind: .commitmentReminder,
                        message: "You usually complete \"\(task.title)\" around this time.",
                        detail: streakDetail,
                        severity: .info,
                        confidence: pattern.confidence,
                        actionable: true,
                        action: .init(label: "Open Commitments", navigateTo: "/commitments"),
                        expiresAt: cal.date(byAdding: .day, value: 1, to: now) ?? now,
                        createdAt: now
                    ))
                }

            default:
                continue
            }

            if results.count >= maxResults { break }
        }

        return results
    }

    // MARK: — Recurring-due (ported from predictionBehaviorSignals.ts)

    /// Emits a `recurring_due` signal when a review_budget pattern with
    /// confidence >= 0.6 exists and we're in the first 5 days of the month.
    static func buildRecurringDue(
        patterns: [AnchorUserPattern],
        now: Date
    ) -> [AnchorPrediction] {
        let cal = Calendar(identifier: .gregorian)
        let comps = cal.dateComponents([.year, .month, .day], from: now)
        guard let year = comps.year, let month = comps.month, let day = comps.day,
              day <= 5 else { return [] }
        let mKey = String(format: "%04d-%02d", year, month)

        guard let p = patterns.first(where: {
            $0.actionKind == .reviewBudget && $0.confidence >= 0.6
        }) else { return [] }

        let category = p.actionCategory
        return [AnchorPrediction(
            id: "pred-recurring-due-\(mKey)",
            kind: .recurringDue,
            message: "A regular \(category ?? "spending") pattern may be due.",
            detail: "Anchor AI has noticed a consistent pattern in your \(category ?? "monthly") spend.",
            severity: .info,
            confidence: p.confidence,
            actionable: true,
            action: .init(label: "Review spending", navigateTo: "/finance"),
            expiresAt: cal.date(byAdding: .day, value: 5, to: now) ?? now,
            createdAt: now
        )]
    }

    // MARK: — Helpers

    private static func categoryTotal(
        _ txs: [AnchorTransaction],
        category: String,
        start: Date,
        end: Date
    ) -> Int {
        txs.filter {
            $0.type == "expense"
                && $0.isActive
                && $0.category == category
                && AnchorDateRange.inRange($0.date, start: start, end: end)
        }.reduce(0) { $0 + $1.amountCents }
    }
}
