import Foundation

/// Pure NLP → answer router for the Anchor AI chat surface. Native MVP
/// (Phase 4e) that mirrors the subset of src/services/fabric/QueryEngine.ts
/// routed from the PromptChip surface in src/features/fabric/FabricPromptChips.tsx.
///
/// Supported actions (subset of PWA's 18):
///   queryToday · queryUpcoming · planWeek · summarizeWeek ·
///   querySpending · querySavingsRate · queryNetWorth · queryCommitments ·
///   navigate
///
/// Deferred to a follow-up phase: record_expense / record_income (needs
/// form integration), scenario / momentum / correlation / day_of_week /
/// recurring / family / accounts-deep, contextual intent from history.
///
/// Branch implementations live in AnchorQueryEngine+Today.swift,
/// +Finance.swift, +Planning.swift.
enum AnchorQueryEngine {

    struct Input {
        let intent: AnchorFabricIntent
        let transactions: [AnchorTransaction]
        let commitments: [AnchorCommitment]
        let accounts: [AnchorAccount]
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
        case .querySavingsRate:  return savingsRate(input)
        case .queryNetWorth:     return netWorth(input)
        case .queryCommitments:  return commitmentsSummary(input)
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
        case .thisWeek:
            return weekRange(now)
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
        case .thisWeek: return "this week"
        case .thisMonth: return "this month"
        case .lastMonth: return "last month"
        }
    }
}
