import Foundation

/// Parsed NLP intent. Parity: mirrors `ParsedIntent` in src/types + the
/// action union used by src/services/fabric/IntentParser.ts.
///
/// Native scope (Phase 4e MVP): we ship the subset of actions that can be
/// answered from already-loaded Finance + Commitments state. Extended
/// actions (`recordExpense`, `recordIncome`, `queryScenario`,
/// `queryMomentum`, `queryCorrelation`, `queryDayOfWeek`, `queryRecurring`,
/// `queryFamily`, `queryAccounts`, `queryIncome`) are parsed as
/// `.unknown` for now and will land in a follow-up phase.
struct AnchorFabricIntent: Equatable {
    enum Action: String {
        case queryToday            = "query_today"
        case queryUpcoming         = "query_upcoming"
        case planWeek              = "plan_week"
        case summarizeWeek         = "summarize_week"
        case querySpending         = "query_spending"
        case querySavingsRate      = "query_savings_rate"
        case queryNetWorth         = "query_net_worth"
        case queryCommitments      = "query_commitments"
        case navigate              = "navigate"
        case unknown               = "unknown"
    }

    /// Calendar window a query targets. Defaults to `.thisMonth` for
    /// spending queries when no explicit period is named.
    enum TimePeriod: String {
        case today
        case thisWeek     = "this_week"
        case thisMonth    = "this_month"
        case lastMonth    = "last_month"
    }

    struct Entities: Equatable {
        var timePeriod: TimePeriod?
        var page: String?
    }

    let action: Action
    let confidence: Double
    let entities: Entities
    let rawInput: String
}
