import Foundation

/// Anchor AI Prediction — mirrors PWA `Prediction` from src/types/index.ts.
/// Only the fields the native UI currently surfaces; additional fields can be
/// added as they're ported.
struct AnchorPrediction: Identifiable, Equatable {
    enum Severity: String, Equatable { case info, warning, critical }
    enum Kind: String, Equatable {
        case unusualSpending   = "unusual_spending"
        case budgetOverage     = "budget_overage"
        case budgetRisk        = "budget_risk"
        case goalAtRisk        = "goal_at_risk"
        case behaviorNudge     = "behavior_nudge"
        case patternSignal     = "pattern_signal"
        case streakAtRisk      = "streak_at_risk"
        case cashFlowAlert     = "cash_flow_alert"
        case recurringDue      = "recurring_due"
        case goalOnTrack       = "goal_on_track"
    }

    struct Action: Equatable {
        let label: String
        let navigateTo: String
    }

    let id: String
    let kind: Kind
    let message: String
    let detail: String
    let severity: Severity
    /// 0.0 … 1.0 — used to rank across signal sources.
    let confidence: Double
    let actionable: Bool
    let action: Action?
    let expiresAt: Date
    let createdAt: Date
}
