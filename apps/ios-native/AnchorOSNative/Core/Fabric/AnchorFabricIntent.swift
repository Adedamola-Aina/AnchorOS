import Foundation

/// Parsed NLP intent. Parity: mirrors `ParsedIntent` in src/types + the
/// action union used by src/services/fabric/IntentParser.ts.
///
/// Native scope (Phase 4e → 4e-4):
///   - 4e: MVP 9 query actions + navigate
///   - 4e-2: recordExpense / recordIncome with amount + category
///   - 4e-3: queryIncome, queryAccounts, queryRecurring, queryMomentum,
///     queryScenario
///   - 4e-3b (deferred): queryCorrelation, queryDayOfWeek, queryFamily
///     — require ports of buildWeekBuckets / getHighSpendDay /
///     AnchorTransaction.scope that aren't in scope for this phase.
///   - 4e-4: contextual follow-up resolution via
///     AnchorIntentParser.parse(_:history:).
struct AnchorFabricIntent: Equatable {
    enum Action: String {
        case queryToday            = "query_today"
        case queryUpcoming         = "query_upcoming"
        case planWeek              = "plan_week"
        case summarizeWeek         = "summarize_week"
        case querySpending         = "query_spending"
        case queryIncome           = "query_income"
        case querySavingsRate      = "query_savings_rate"
        case queryNetWorth         = "query_net_worth"
        case queryCommitments      = "query_commitments"
        case queryAccounts         = "query_accounts"
        case queryRecurring        = "query_recurring"
        case queryMomentum         = "query_momentum"
        case queryScenario         = "query_scenario"
        case queryCorrelation      = "query_correlation"
        case queryDayOfWeek        = "query_day_of_week"
        case queryFamily           = "query_family"
        case recordExpense         = "record_expense"
        case recordIncome          = "record_income"
        case navigate              = "navigate"
        case unknown               = "unknown"
    }

    /// Calendar window a query targets. Defaults to `.thisMonth` for
    /// spending queries when no explicit period is named.
    enum TimePeriod: String {
        case today
        case yesterday
        case thisWeek     = "this_week"
        case lastWeek     = "last_week"
        case thisMonth    = "this_month"
        case lastMonth    = "last_month"
    }

    struct Entities: Equatable {
        var amount: Double? = nil
        var category: String? = nil
        var timePeriod: TimePeriod? = nil
        var page: String? = nil
    }

    let action: Action
    let confidence: Double
    let entities: Entities
    let rawInput: String
}
