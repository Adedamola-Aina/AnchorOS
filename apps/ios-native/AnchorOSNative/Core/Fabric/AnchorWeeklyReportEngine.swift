import Foundation

/// Pure calculator — parity port of src/services/fabric/WeeklyReportEngine.ts.
/// Produces a 7-day rolling weekly report (weekEnd = now, weekStart = now-6d).
///
/// Contract (matches PWA):
///   - totalSpent / totalIncome: sum of expense / income tx inside the week
///   - topCategory: category with highest expense total this week;
///     tiebreak = first encountered (matches PWA Object.entries order)
///   - vsLastWeek: percentage delta vs previous 7d window, rounded to 1 dp.
///     0 when prior-week total was 0 (parity with PWA `? ... : 0`)
///   - commitmentSummary.completed/missed: counted over commitments CREATED in the week
///     (same filter as PWA: `withinRange(task.createdAt ?? null, weekStart, weekEnd)`)
///   - completionRatePct: round(completed/total × 100); 0 when no commitments
///   - bestCategory / worstCategory: ranked by per-category completion rate
///   - longestStreak: max currentStreak across week-created commitments
enum AnchorWeeklyReportEngine {

    static func build(
        transactions: [AnchorTransaction],
        commitments: [AnchorCommitment],
        now: Date
    ) -> AnchorWeeklyReport {
        let cal = Calendar(identifier: .gregorian)
        // weekStart = 6 days before "now" at 00:00 local
        let startOfToday = cal.startOfDay(for: now)
        let weekStart = cal.date(byAdding: .day, value: -6, to: startOfToday) ?? startOfToday
        // weekEnd = now at 23:59:59.999 — but for half-open range we use startOfToday + 1d
        let weekEndExclusive = cal.date(byAdding: .day, value: 1, to: startOfToday) ?? now

        let weekTx = transactions.filter {
            AnchorDateRange.inRange($0.date, start: weekStart, end: weekEndExclusive)
                && $0.isActive
        }
        let expenses = weekTx.filter { $0.type == "expense" }
        let incomes = weekTx.filter { $0.type == "income" }

        let totalSpent = expenses.reduce(0) { $0 + $1.amountCents }
        let totalIncome = incomes.reduce(0) { $0 + $1.amountCents }

        // topCategory: preserve first-seen ordering for tiebreak parity
        var categoryOrder: [String] = []
        var categoryTotals: [String: Int] = [:]
        for tx in expenses {
            let cat = tx.category ?? "General"
            if categoryTotals[cat] == nil { categoryOrder.append(cat) }
            categoryTotals[cat, default: 0] += tx.amountCents
        }
        let topCategory: AnchorWeeklyReport.Category = {
            guard !categoryOrder.isEmpty else {
                return .init(name: "General", amountCents: 0)
            }
            let winner = categoryOrder.max { a, b in
                (categoryTotals[a] ?? 0) < (categoryTotals[b] ?? 0)
            } ?? "General"
            return .init(name: winner, amountCents: categoryTotals[winner] ?? 0)
        }()

        // vsLastWeek
        let prevStart = cal.date(byAdding: .day, value: -7, to: weekStart) ?? weekStart
        let lastWeekSpent = transactions.filter {
            $0.type == "expense" && $0.isActive &&
                AnchorDateRange.inRange($0.date, start: prevStart, end: weekStart)
        }.reduce(0) { $0 + $1.amountCents }
        let vsLastWeek: Double = {
            guard lastWeekSpent > 0 else { return 0 }
            let pct = (Double(totalSpent - lastWeekSpent) / Double(lastWeekSpent)) * 100.0
            return (pct * 10).rounded() / 10.0
        }()

        // Commitments created this week
        let weekCommitments = commitments.filter { c in
            guard let created = c.createdAt else { return false }
            return AnchorDateRange.inRange(created, start: weekStart, end: weekEndExclusive)
        }
        let completed = weekCommitments.filter { $0.completed }.count
        let missed = weekCommitments.filter { !$0.completed }.count
        let completionRate: Int = {
            guard !weekCommitments.isEmpty else { return 0 }
            return Int((Double(completed) / Double(weekCommitments.count) * 100).rounded())
        }()

        // Per-category completion ranking — preserve first-seen order for stable tiebreaks
        var catOrder: [String] = []
        var catScores: [String: (total: Int, done: Int)] = [:]
        for c in weekCommitments {
            let key = c.category ?? "general"
            if catScores[key] == nil { catOrder.append(key) }
            var s = catScores[key] ?? (0, 0)
            s.total += 1
            s.done += c.completed ? 1 : 0
            catScores[key] = s
        }
        let ranked = catOrder.map { name -> (name: String, rate: Double) in
            let s = catScores[name] ?? (0, 0)
            return (name, s.total > 0 ? Double(s.done) / Double(s.total) : 0)
        }.sorted { $0.rate > $1.rate }

        let bestCategory = ranked.first?.name ?? "N/A"
        let worstCategory = ranked.last?.name ?? "N/A"

        // Longest streak among week-created commitments
        let longest = weekCommitments.reduce(
            (name: "N/A", days: 0)
        ) { best, c in
            let s = c.currentStreak ?? 0
            return s > best.days ? (c.title, s) : best
        }

        let currency = transactions.first?.currency ?? "NGN"

        return AnchorWeeklyReport(
            weekStart: weekStart,
            weekEnd: cal.date(byAdding: .second, value: -1, to: weekEndExclusive) ?? now,
            currency: currency,
            totalSpentCents: totalSpent,
            totalIncomeCents: totalIncome,
            netCashFlowCents: totalIncome - totalSpent,
            topCategory: topCategory,
            vsLastWeekPct: vsLastWeek,
            commitmentSummary: .init(
                completed: completed,
                missed: missed,
                completionRatePct: completionRate,
                bestCategory: bestCategory,
                worstCategory: worstCategory,
                longestStreak: .init(name: longest.name, days: longest.days)
            )
        )
    }
}
