import Foundation

/// Pure NLP → answer router for the Anchor AI chat surface. Covers
/// Phase 4e (MVP) + 4e-2/3/4 (record NLP, extended queries, contextual
/// intent). Mirrors src/services/fabric/QueryEngine.ts.
///
/// Supported actions (17 of PWA's ~18):
///   queryToday · queryUpcoming · planWeek · summarizeWeek ·
///   querySpending · queryIncome · querySavingsRate · queryNetWorth ·
///   queryCommitments · queryAccounts · queryRecurring · queryMomentum ·
///   queryScenario · recordExpense · recordIncome · navigate · (unknown)
///
/// Deferred to 4e-3b:
///   - query_correlation: needs buildWeekBuckets + cross-category
///     correlation port (~150 lines of fabricUtils)
///   - query_day_of_week: needs getHighSpendDay + getBestCompletionDay
///   - query_family: needs AnchorTransaction.scope field (data model change)
///
/// Branch implementations live in AnchorQueryEngine+Today.swift,
/// +Finance.swift, +Planning.swift, +Extended.swift.
enum AnchorQueryEngine {

    struct Input {
        let intent: AnchorFabricIntent
        let transactions: [AnchorTransaction]
        let commitments: [AnchorCommitment]
        let accounts: [AnchorAccount]
        let recurring: [AnchorRecurringTransaction]
        let upcoming: [AnchorUpcomingItem]
        let weeklyReport: AnchorWeeklyReport?
        let now: Date
    }

    static func run(_ input: Input) -> AnchorFabricQueryResult {
        switch input.intent.action {
        case .queryToday:        return today(input)
        case .queryUpcoming:     return upcoming(input)
        case .planWeek:          return planWeek(input)
        case .summarizeWeek:     return summarizeWeek(input)
        case .querySpending:     return spending(input)
        case .queryIncome:       return income(input)
        case .querySavingsRate:  return savingsRate(input)
        case .queryNetWorth:     return netWorth(input)
        case .queryCommitments:  return commitmentsSummary(input)
        case .queryAccounts:     return accountsSummary(input)
        case .queryRecurring:    return recurringSummary(input)
        case .queryMomentum:     return momentum(input)
        case .queryScenario:     return scenario(input)
        case .queryCorrelation:  return correlation(input)
        case .queryDayOfWeek:    return dayOfWeek(input)
        case .queryFamily:       return familySummary(input)
        case .queryStreak:       return streakSummary(input)
        case .recordExpense:     return recordTransaction(input, type: .expense)
        case .recordIncome:      return recordTransaction(input, type: .income)
        case .navigate:          return navigate(input)
        case .unknown:           return fallback()
        }
    }

    // MARK: — shared helpers (used by the branch extensions)

    static func primaryCurrency(_ tx: [AnchorTransaction]) -> String {
        tx.first?.currency ?? "NGN"
    }

    static func weekRange(_ now: Date) -> (Date, Date) {
        var cal = Calendar(identifier: .gregorian); cal.firstWeekday = 2
        let start = cal.date(from: cal.dateComponents([.yearForWeekOfYear, .weekOfYear], from: now)) ?? now
        let end = cal.date(byAdding: .day, value: 7, to: start) ?? now
        return (start, end)
    }

    static func dateRange(for period: AnchorFabricIntent.TimePeriod, now: Date)
    -> (Date, Date) {
        let cal = Calendar(identifier: .gregorian)
        switch period {
        case .today:
            let s = cal.startOfDay(for: now)
            return (s, cal.date(byAdding: .day, value: 1, to: s) ?? now)
        case .yesterday:
            let today = cal.startOfDay(for: now)
            let s = cal.date(byAdding: .day, value: -1, to: today) ?? today
            return (s, today)
        case .thisWeek:
            return weekRange(now)
        case .lastWeek:
            let (thisStart, _) = weekRange(now)
            let s = cal.date(byAdding: .day, value: -7, to: thisStart) ?? thisStart
            return (s, thisStart)
        case .thisMonth:
            let s = cal.date(from: cal.dateComponents([.year, .month], from: now)) ?? now
            let e = cal.date(byAdding: .month, value: 1, to: s) ?? now
            return (s, e)
        case .lastMonth:
            let thisMonth = cal.date(from: cal.dateComponents([.year, .month], from: now)) ?? now
            let s = cal.date(byAdding: .month, value: -1, to: thisMonth) ?? now
            return (s, thisMonth)
        }
    }

    static func periodLabel(_ p: AnchorFabricIntent.TimePeriod) -> String {
        switch p {
        case .today: return "today"
        case .yesterday: return "yesterday"
        case .thisWeek: return "this week"
        case .lastWeek: return "last week"
        case .thisMonth: return "this month"
        case .lastMonth: return "last month"
        }
    }
}
