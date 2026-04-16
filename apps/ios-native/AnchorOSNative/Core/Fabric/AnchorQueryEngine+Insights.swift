import Foundation

/// Insight-query branches (Phase 4e-3b). Parity ports of
/// src/services/fabric/query/insightQueries.ts — dayOfWeekQuery +
/// correlationQuery. Both rely on the Phase 4e-3b utility ports:
/// `AnchorDayOfWeekUtils` and `AnchorWeekBuckets`.
extension AnchorQueryEngine {

    // MARK: — query_day_of_week

    static func dayOfWeek(_ i: Input) -> AnchorFabricQueryResult {
        let high = AnchorDayOfWeekUtils.highSpendDay(i.transactions, now: i.now)
        let best = AnchorDayOfWeekUtils.bestCompletionDay(i.commitments, now: i.now)

        if high == nil && best == nil {
            return .init(
                summary: "Not enough data yet — check back after a few months.",
                actions: []
            )
        }

        var lines: [String] = []
        if let h = high { lines.append("\(h.dayName) is your highest-spend day") }
        if let b = best { lines.append("\(b.dayName) is your strongest completion day") }
        let summary = lines.joined(separator: "; ") + "."

        let detail: String? = {
            guard let h = high, let b = best else { return nil }
            return "You spend most on \(h.dayName)s, while commitment follow-through is strongest on \(b.dayName)s."
        }()

        return .init(
            summary: summary, detail: detail,
            actions: [.init(label: "Open Dashboard", kind: .navigate(page: "dashboard"))]
        )
    }

    // MARK: — query_correlation

    static func correlation(_ i: Input) -> AnchorFabricQueryResult {
        let buckets = AnchorWeekBuckets.build(
            transactions: i.transactions,
            commitments: i.commitments,
            now: i.now,
            weeksBack: 12
        )
        if buckets.count < 8 {
            return .init(
                summary: "Need at least 8 weeks of data to find patterns.",
                actions: []
            )
        }

        let high = buckets.filter { $0.completionRate >= 0.7 }
        let low  = buckets.filter { $0.completionRate < 0.5 }

        func mean(_ xs: [Int]) -> Double {
            xs.isEmpty ? 0 : Double(xs.reduce(0, +)) / Double(xs.count)
        }

        guard high.count >= 3, low.count >= 3 else {
            return noPatternResult(buckets.count)
        }

        let avgHigh = mean(high.map(\.discretionaryCents))
        let avgLow  = mean(low.map(\.discretionaryCents))
        guard avgLow > 0 else { return noPatternResult(buckets.count) }

        let diff = (avgLow - avgHigh) / avgLow
        let overallMean = mean(buckets.map(\.discretionaryCents))
        let recent = Array(buckets.suffix(8))
        let held = recent.filter { b in
            (b.completionRate >= 0.7 && Double(b.discretionaryCents) <= overallMean) ||
            (b.completionRate <  0.5 && Double(b.discretionaryCents) >= overallMean)
        }.count

        guard diff >= 0.15, held >= 5 else { return noPatternResult(buckets.count) }

        let currency = primaryCurrency(i.transactions)
        let pct = Int((diff * 100).rounded())
        return .init(
            summary: "In high-completion weeks, discretionary spending is about \(pct)% lower.",
            detail: "High-completion weeks average \(AnchorFabricEngine.formatCents(Int(avgHigh), currency)) vs \(AnchorFabricEngine.formatCents(Int(avgLow), currency)) in low-completion weeks. Pattern held in \(held) of the last 8 weeks.",
            actions: [.init(label: "Open Dashboard", kind: .navigate(page: "dashboard"))]
        )
    }

    private static func noPatternResult(_ bucketCount: Int) -> AnchorFabricQueryResult {
        .init(
            summary: "No consistent pattern found yet between your habits and spending — check back in a few weeks.",
            actions: []
        )
    }

    // MARK: — query_family (Phase 4e-3c)

    static func familySummary(_ i: Input) -> AnchorFabricQueryResult {
        let currency = primaryCurrency(i.transactions)
        let (start, end) = dateRange(for: i.intent.entities.timePeriod ?? .thisMonth, now: i.now)
        let family = i.transactions.filter { tx in
            tx.scope == "family" && !(tx.isSoftDeleted ?? false) &&
            AnchorDateRange.inRange(tx.date, start: start, end: end)
        }
        if family.isEmpty {
            return .init(
                summary: "No shared family transactions found for that period.",
                actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
            )
        }
        let totalSpent = family.filter { $0.type == "expense" }.reduce(0) { $0 + $1.amountCents }
        let label = periodLabel(i.intent.entities.timePeriod ?? .thisMonth)
        return .init(
            summary: "\(family.count) shared transactions \(label) — \(AnchorFabricEngine.formatCents(totalSpent, currency)) in shared expenses.",
            actions: [.init(label: "Open Finance", kind: .navigate(page: "finance"))]
        )
    }
}
