import Foundation

/// Day-of-week spending + completion analytics. Parity port of
/// src/services/fabric/utils/dayOfWeekUtils.ts.
///
/// Used by query_day_of_week to surface "Friday is your highest-spend
/// day / Monday is your strongest completion day" style insights.
/// Both signals require ≥28d data spans; high-spend also requires ≥56d
/// and a ≥35% lift vs the 7-day mean.
enum AnchorDayOfWeekUtils {

    static let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
                           "Thursday", "Friday", "Saturday"]

    struct Signal: Equatable {
        let day: Int            // 0-6, Sunday = 0
        let dayName: String
        let value: Double
        let vsAverage: Double   // 0.35 = 35% above mean
    }

    private static func dayOfWeek(_ d: Date) -> Int {
        Calendar(identifier: .gregorian).component(.weekday, from: d) - 1
    }

    /// Returns a [dayOfWeek: averageCentsPerOccurrence] map over the last 90d.
    static func spendingByDayOfWeek(_ txs: [AnchorTransaction],
                                    now: Date) -> [Int: Double] {
        let cal = Calendar(identifier: .gregorian)
        let cutoff = cal.date(byAdding: .day, value: -90, to: cal.startOfDay(for: now)) ?? now
        let expenses = txs.filter {
            $0.type == "expense" && !($0.isSoftDeleted ?? false) &&
            AnchorDateRange.inRange($0.date, start: cutoff, end: now)
        }
        guard !expenses.isEmpty else { return [:] }

        // Count unique calendar days per DOW in the window so we can
        // normalise totals to an "average day" rate.
        var perDayDates: [Int: Set<String>] = [:]
        var cur = cutoff
        let df = DateFormatter(); df.dateFormat = "yyyy-MM-dd"
        while cur <= now {
            let dow = dayOfWeek(cur)
            perDayDates[dow, default: []].insert(df.string(from: cur))
            cur = cal.date(byAdding: .day, value: 1, to: cur) ?? now.addingTimeInterval(86_400)
        }

        // Require ≥28d data span before reporting anything.
        let earliest = expenses.compactMap { AnchorDateRange.parse($0.date) }.min() ?? now
        let span = now.timeIntervalSince(earliest) / 86_400
        if span < 28 { return [:] }

        var sums: [Int: Int] = [:]
        for tx in expenses {
            guard let d = AnchorDateRange.parse(tx.date) else { continue }
            sums[dayOfWeek(d), default: 0] += tx.amountCents
        }
        var out: [Int: Double] = [:]
        for (dow, total) in sums {
            let count = max(perDayDates[dow]?.count ?? 1, 1)
            out[dow] = Double(total) / Double(count)
        }
        return out
    }

    /// Completion rate per DOW for daily-type commitments over the last 90d.
    static func completionByDayOfWeek(_ tasks: [AnchorCommitment],
                                      now: Date) -> [Int: Double] {
        let cal = Calendar(identifier: .gregorian)
        let cutoff = cal.date(byAdding: .day, value: -90, to: cal.startOfDay(for: now)) ?? now
        let completions = tasks.compactMap { t -> Date? in
            guard let ts = t.lastCompletedAt, let d = AnchorDateRange.parse(ts),
                  d >= cutoff && d <= now else { return nil }
            return d
        }
        guard let earliest = completions.min(), let latest = completions.max() else { return [:] }
        let span = latest.timeIntervalSince(earliest) / 86_400
        if span < 14 { return [:] }

        var perDayDates: [Int: Int] = [:]
        var cur = cutoff
        while cur <= now {
            perDayDates[dayOfWeek(cur), default: 0] += 1
            cur = cal.date(byAdding: .day, value: 1, to: cur) ?? now.addingTimeInterval(86_400)
        }

        var counts: [Int: Int] = [:]
        for d in completions { counts[dayOfWeek(d), default: 0] += 1 }
        var out: [Int: Double] = [:]
        for (dow, n) in counts {
            let total = max(perDayDates[dow] ?? 1, 1)
            out[dow] = min(Double(n) / Double(total), 1.0)
        }
        return out
    }

    static func highSpendDay(_ txs: [AnchorTransaction], now: Date) -> Signal? {
        let earliest = txs
            .filter { $0.type == "expense" && !($0.isSoftDeleted ?? false) }
            .compactMap { AnchorDateRange.parse($0.date) }.min()
        guard let e = earliest,
              now.timeIntervalSince(e) / 86_400 >= 56 else { return nil }

        let byDay = spendingByDayOfWeek(txs, now: now)
        guard !byDay.isEmpty else { return nil }
        let mean = byDay.values.reduce(0, +) / Double(byDay.count)
        guard mean > 0, let best = byDay.max(by: { $0.value < $1.value }) else { return nil }
        let vs = (best.value - mean) / mean
        if vs < 0.35 { return nil }
        return Signal(day: best.key, dayName: dayNames[best.key],
                      value: best.value,
                      vsAverage: (vs * 100).rounded() / 100)
    }

    static func bestCompletionDay(_ tasks: [AnchorCommitment], now: Date) -> Signal? {
        let dailies = tasks.filter { $0.type == "daily" && $0.lastCompletedAt != nil }
        let dates = dailies.compactMap { AnchorDateRange.parse($0.lastCompletedAt ?? "") }.sorted()
        guard let first = dates.first, let last = dates.last,
              last.timeIntervalSince(first) / 86_400 >= 28 else { return nil }

        let byDay = completionByDayOfWeek(dailies, now: now)
        guard !byDay.isEmpty else { return nil }
        let all: [(Int, Double)] = (0...6).map { ($0, byDay[$0] ?? 0) }
        let best = all.max { $0.1 < $1.1 }!
        let worst = all.min { $0.1 < $1.1 }!
        if best.1 - worst.1 < 0.15 { return nil }

        let mean = all.map(\.1).reduce(0, +) / Double(all.count)
        let vs = mean == 0 ? 0 : (best.1 - mean) / mean
        return Signal(day: best.0, dayName: dayNames[best.0],
                      value: best.1, vsAverage: (vs * 100).rounded() / 100)
    }
}
