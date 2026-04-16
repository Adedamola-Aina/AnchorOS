import Foundation

/// Planning / navigation branches of AnchorQueryEngine.
extension AnchorQueryEngine {

    static func planWeek(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let (start, end) = weekRange(i.now)
        let tx = i.transactions.filter {
            !$0.isSoftDeleted && AnchorDateRange.inRange($0.date, start: start, end: end)
        }
        let spent = tx.filter { $0.type == "expense" }.reduce(0) { $0 + $1.amountCents }
        let income = tx.filter { $0.type == "income" }.reduce(0) { $0 + $1.amountCents }
        let daily = i.commitments.filter { $0.type == "daily" }
        let done = daily.filter(\.completed).count
        let rate = daily.isEmpty ? 0 : Int(round(Double(done) / Double(daily.count) * 100))

        var summary = "This week: \(AnchorFabricEngine.formatCents(spent, currency)) spent"
        if income > 0 { summary += ", \(AnchorFabricEngine.formatCents(income, currency)) earned" }
        summary += ". Daily habits: \(done)/\(daily.count) (\(rate)%)."

        let upcomingThisWeek = i.upcoming.filter { $0.daysUntil <= 6 }
        let detail: String
        if !upcomingThisWeek.isEmpty {
            let bits = upcomingThisWeek.map { u -> String in
                let when = u.isToday ? "today" : u.isTomorrow ? "tomorrow" : "in \(u.daysUntil)d"
                return "\(u.title) (\(when))"
            }
            detail = "Coming up: \(bits.joined(separator: ", "))."
        } else if rate >= 80 {
            detail = "Great momentum — keep your streaks going through the week."
        } else {
            detail = "Focus on building consistency with your daily habits this week."
        }

        return .init(summary: summary, detail: detail, actions: [
            .init(label: "View Commitments", kind: .navigate(page: "commitments")),
            .init(label: "View Finance",     kind: .navigate(page: "finance")),
        ])
    }

    static func summarizeWeek(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        if let r = i.weeklyReport {
            let done = r.commitmentSummary.completed
            let total = done + r.commitmentSummary.missed
            var summary = "This week: \(AnchorFabricEngine.formatCents(r.totalSpentCents, currency)) spent, \(AnchorFabricEngine.formatCents(r.totalIncomeCents, currency)) earned. Commitments: \(done)/\(total) done."
            if r.totalIncomeCents > r.totalSpentCents {
                summary += " You're \(AnchorFabricEngine.formatCents(r.totalIncomeCents - r.totalSpentCents, currency)) ahead — good week!"
            }
            return .init(summary: summary, actions: [
                .init(label: "View Finance",     kind: .navigate(page: "finance")),
                .init(label: "View Commitments", kind: .navigate(page: "commitments")),
                .init(label: "Full Report",      kind: .generateWeeklyReport),
            ])
        }
        return .init(
            summary: "Not enough data for a weekly summary yet.",
            actions: [.init(label: "Generate Report", kind: .generateWeeklyReport)]
        )
    }

    static func commitmentsSummary(_ i: Input) -> AnchorFabricQueryResult {
        let total = i.commitments.count
        let completed = i.commitments.filter(\.completed).count
        let rate = total > 0 ? Int(round(Double(completed) / Double(total) * 100)) : 0
        let bestStreak = i.commitments.reduce(0) { max($0, $1.currentStreak ?? 0) }
        let detail: String
        if rate >= 80 {
            detail = "Great consistency! Best streak: \(bestStreak) day\(bestStreak == 1 ? "" : "s")."
        } else if rate >= 50 {
            detail = "You can boost this by completing one pending task today."
        } else {
            detail = "Consider narrowing your active commitments to build momentum."
        }
        return .init(
            summary: "Commitment completion is \(rate)% (\(completed)/\(total)).",
            detail: detail,
            actions: [.init(label: "Open Commitments", kind: .navigate(page: "commitments"))]
        )
    }

    static func navigate(_ i: Input) -> AnchorFabricQueryResult {
        guard let page = i.intent.entities.page else { return fallback() }
        return .init(
            summary: "Opening \(page).",
            actions: [.init(label: "Go to \(page.capitalized)", kind: .navigate(page: page))]
        )
    }

    static func fallback() -> AnchorFabricQueryResult {
        .init(
            summary: "I'm not sure how to answer that yet.",
            detail: "Try one of the suggested prompts, or ask about today, spending, or your net worth."
        )
    }
}
