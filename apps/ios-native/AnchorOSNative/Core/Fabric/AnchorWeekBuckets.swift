import Foundation

/// Week-bucketed completion + discretionary-spending analytics. Parity
/// port of src/services/fabric/utils/correlationUtils.ts — `buildWeekBuckets`.
///
/// Each bucket contains a Monday-anchored week's completion rate and
/// total discretionary spend. Used by query_correlation to detect
/// whether high-completion weeks correlate with lower discretionary
/// spending.
enum AnchorWeekBuckets {

    private static let discretionary: Set<String> = [
        "Food", "Groceries", "Entertainment", "Shopping",
        "Transportation", "Dining", "General"
    ]

    struct Bucket: Equatable {
        let weekStart: Date
        let completionRate: Double
        let discretionaryCents: Int
    }

    static func build(transactions: [AnchorTransaction],
                      commitments: [AnchorCommitment],
                      now: Date,
                      weeksBack: Int = 12) -> [Bucket] {
        var cal = Calendar(identifier: .gregorian)
        cal.firstWeekday = 2  // Monday
        let currentDow = cal.component(.weekday, from: now)      // 1 = Sunday
        let offset = currentDow == 1 ? -6 : 2 - currentDow       // back to Monday
        let thisMonday = cal.date(byAdding: .day, value: offset,
                                  to: cal.startOfDay(for: now)) ?? now

        var out: [Bucket] = []
        for w in stride(from: weeksBack - 1, through: 0, by: -1) {
            guard let start = cal.date(byAdding: .day, value: -w * 7, to: thisMonday),
                  let end = cal.date(byAdding: .day, value: 6, to: start)
            else { continue }
            // end-of-day for end bound
            let endEod = cal.date(bySettingHour: 23, minute: 59, second: 59, of: end) ?? end

            let completed = commitments.filter { t in
                guard let ts = t.lastCompletedAt, let d = AnchorDateRange.parse(ts)
                else { return false }
                return d >= start && d <= endEod
            }
            let eligible = commitments.filter { t in
                guard let ts = t.createdAt, let d = AnchorDateRange.parse(ts)
                else { return true }
                return d <= endEod
            }
            if eligible.isEmpty { continue }

            let rate = Double(completed.count) / Double(eligible.count)
            if rate <= 0 { continue }

            let disc = transactions.filter { tx in
                tx.type == "expense" && !(tx.isSoftDeleted ?? false) &&
                discretionary.contains(tx.category ?? "") &&
                AnchorDateRange.inRange(tx.date, start: start, end: endEod)
            }
            if disc.isEmpty { continue }

            let cents = disc.reduce(0) { $0 + $1.amountCents }
            out.append(Bucket(weekStart: start, completionRate: rate,
                              discretionaryCents: cents))
        }
        return out
    }
}
