import Foundation

/// Native Fabric engine that computes insights from live FinanceStore + CommitmentsStore data.
/// Mirrors the logic in src/services/fabric/insights/financeInsights.ts — ported to Swift.
/// No Firestore reads — works entirely from already-loaded store data.
struct AnchorFabricEngine {

    // MARK: — Public API

    /// Compute up to 4 insights from current data. Returns empty array if insufficient data.
    static func buildInsights(
        transactions: [AnchorTransaction],
        accounts: [AnchorAccount],
        commitments: [AnchorCommitment]
    ) -> [AnchorInsight] {
        let now = Date()
        var insights: [AnchorInsight] = []
        if let i = spendingInsight(transactions: transactions, now: now) { insights.append(i) }
        if let i = savingsRateInsight(transactions: transactions, now: now) { insights.append(i) }
        if let i = netWorthInsight(accounts: accounts) { insights.append(i) }
        if let i = streakInsight(commitments: commitments) { insights.append(i) }
        return insights
    }

    // MARK: — Spending Insight

    private static func spendingInsight(transactions: [AnchorTransaction], now: Date) -> AnchorInsight? {
        let (thisStart, thisEnd) = monthRange(offset: 0, from: now)
        let thisExpenses = transactions.filter {
            $0.type == "expense" && inRange($0.date, start: thisStart, end: thisEnd)
        }
        guard !thisExpenses.isEmpty else { return nil }

        // Top category
        var byCategory: [String: Int] = [:]
        for tx in thisExpenses {
            let cat = tx.category ?? "Other"
            byCategory[cat, default: 0] += tx.amountCents
        }
        guard let (topCat, topTotal) = byCategory.max(by: { $0.value < $1.value }) else { return nil }

        let (prevStart, prevEnd) = monthRange(offset: -1, from: now)
        let prevTotal = transactions.filter {
            $0.type == "expense" && ($0.category ?? "Other") == topCat && inRange($0.date, start: prevStart, end: prevEnd)
        }.reduce(0) { $0 + $1.amountCents }

        let trend: AnchorInsight.Trend = prevTotal == 0 ? .stable
            : topTotal > Int(Double(prevTotal) * 1.1) ? .up
            : topTotal < Int(Double(prevTotal) * 0.9) ? .down
            : .stable

        let currency = dominantCurrency(accounts: [], transactions: transactions)
        let detail = prevTotal > 0
            ? "\(formatCents(topTotal, currency)) in \(topCat) \(trend == .up ? "↑" : trend == .down ? "↓" : "≈") vs last month (\(formatCents(prevTotal, currency)))"
            : "\(formatCents(topTotal, currency)) in \(topCat) this month"

        return AnchorInsight(
            id: "insight-spending",
            category: "spending",
            headline: "Top spend: \(topCat)",
            detail: detail,
            severity: trend == .up ? .attention : .neutral,
            trend: trend
        )
    }

    // MARK: — Savings Rate Insight

    private static func savingsRateInsight(transactions: [AnchorTransaction], now: Date) -> AnchorInsight? {
        let (start, end) = monthRange(offset: 0, from: now)
        let income = transactions.filter {
            $0.type == "income" && inRange($0.date, start: start, end: end)
        }.reduce(0) { $0 + $1.amountCents }

        guard income > 0 else { return nil }

        let expenses = transactions.filter {
            $0.type == "expense" && inRange($0.date, start: start, end: end)
        }.reduce(0) { $0 + $1.amountCents }

        let rate = Int(Double(income - expenses) / Double(income) * 100)
        let trend: AnchorInsight.Trend = rate >= 20 ? .up : rate >= 0 ? .stable : .down
        let currency = dominantCurrency(accounts: [], transactions: transactions)
        let saved = income - expenses
        let detail = rate >= 0
            ? "Saved \(formatCents(saved, currency)) (\(rate)% of income) this month"
            : "Spending exceeds income by \(formatCents(-saved, currency)) this month"

        return AnchorInsight(
            id: "insight-savings",
            category: "savings",
            headline: rate >= 20 ? "Strong savings rate 🎯" : rate >= 0 ? "Breaking even" : "Overspending this month",
            detail: detail,
            severity: rate >= 20 ? .positive : rate >= 0 ? .neutral : .attention,
            trend: trend
        )
    }

    // MARK: — Net Worth Insight

    private static func netWorthInsight(accounts: [AnchorAccount]) -> AnchorInsight? {
        guard !accounts.isEmpty else { return nil }
        let total = accounts.reduce(0) { $0 + $1.balanceCents }
        let currency = accounts.first?.currency ?? "NGN"
        let isPositive = total >= 0
        return AnchorInsight(
            id: "insight-networth",
            category: "networth",
            headline: "Net worth snapshot",
            detail: "\(formatCents(total, currency)) across \(accounts.count) account\(accounts.count == 1 ? "" : "s")",
            severity: isPositive ? .positive : .attention,
            trend: isPositive ? .up : .down
        )
    }

    // MARK: — Streak Insight

    private static func streakInsight(commitments: [AnchorCommitment]) -> AnchorInsight? {
        let best = commitments.compactMap { $0.currentStreak }.max() ?? 0
        guard best >= 2 else { return nil }
        let task = commitments.first { $0.currentStreak == best }
        return AnchorInsight(
            id: "insight-streak",
            category: "streak",
            headline: "\(best)-day streak 🔥",
            detail: task.map { "'\($0.title)' — keep it going!" } ?? "Best current streak: \(best) days",
            severity: .positive,
            trend: .up
        )
    }

    // MARK: — Spending Trend Data (for chart)

    struct WeekBucket: Identifiable {
        let id: Int  // 0 = 3 weeks ago … 3 = this week
        let label: String
        let incomeCents: Int
        let expenseCents: Int
    }

    static func weeklyBuckets(transactions: [AnchorTransaction], now: Date = Date()) -> [WeekBucket] {
        let cal = Calendar.current
        return (0..<4).reversed().enumerated().map { (i, weeksAgo) in
            guard let weekStart = cal.date(byAdding: .weekOfYear, value: -weeksAgo, to: startOfWeek(now, cal: cal)),
                  let weekEnd = cal.date(byAdding: .day, value: 7, to: weekStart) else {
                return WeekBucket(id: i, label: "W\(i+1)", incomeCents: 0, expenseCents: 0)
            }
            let fmt = DateFormatter()
            fmt.dateFormat = "MMM d"
            let label = fmt.string(from: weekStart)
            let income = transactions.filter {
                $0.type == "income" && inRange($0.date, start: weekStart, end: weekEnd)
            }.reduce(0) { $0 + $1.amountCents }
            let expense = transactions.filter {
                $0.type == "expense" && inRange($0.date, start: weekStart, end: weekEnd)
            }.reduce(0) { $0 + $1.amountCents }
            return WeekBucket(id: i, label: label, incomeCents: income, expenseCents: expense)
        }
    }

    // MARK: — Helpers

    private static func monthRange(offset: Int, from now: Date) -> (Date, Date) {
        let cal = Calendar.current
        let comps = cal.dateComponents([.year, .month], from: now)
        guard var start = cal.date(from: comps),
              let shifted = cal.date(byAdding: .month, value: offset, to: start) else {
            return (now, now)
        }
        start = shifted
        let end = cal.date(byAdding: .month, value: 1, to: start) ?? now
        return (start, end)
    }

    private static func startOfWeek(_ date: Date, cal: Calendar) -> Date {
        let comps = cal.dateComponents([.yearForWeekOfYear, .weekOfYear], from: date)
        return cal.date(from: comps) ?? date
    }

    private static func inRange(_ dateStr: String, start: Date, end: Date) -> Bool {
        let fmt = ISO8601DateFormatter()
        fmt.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let alt = DateFormatter()
        alt.dateFormat = "yyyy-MM-dd"
        guard let d = fmt.date(from: dateStr) ?? alt.date(from: String(dateStr.prefix(10))) else { return false }
        return d >= start && d < end
    }

    static func formatCents(_ cents: Int, _ currency: String) -> String {
        let amount = Double(abs(cents)) / 100.0
        let symbol = currency == "USD" ? "$" : currency == "GBP" ? "£" : currency == "EUR" ? "€" : "₦"
        let fmt = NumberFormatter()
        fmt.numberStyle = .decimal
        fmt.minimumFractionDigits = 0
        fmt.maximumFractionDigits = 0
        let str = fmt.string(from: NSNumber(value: amount)) ?? "0"
        return (cents < 0 ? "-" : "") + symbol + str
    }

    private static func dominantCurrency(accounts: [AnchorAccount], transactions: [AnchorTransaction]) -> String {
        transactions.first?.currency ?? accounts.first?.currency ?? "NGN"
    }
}
