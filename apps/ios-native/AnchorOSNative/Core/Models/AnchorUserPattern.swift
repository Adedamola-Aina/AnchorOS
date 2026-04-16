import Foundation

/// Maps artifacts/anchor-os/users/{uid}/patterns/{patternId}.
/// Mirrors PWA `UserPattern` in src/types/fabric.ts.
///
/// Note: we collapse the discriminated-union trigger/action into plain
/// stored properties rather than Swift enums-with-associated-values so
/// Codable bridging stays trivial. The four Kind enums describe the
/// `type` discriminator; the optional params travel alongside.
struct AnchorUserPattern: Identifiable, Equatable {

    enum TriggerKind: String, Equatable {
        case commitmentCompleted   = "commitment_completed"
        case timeOfDay             = "time_of_day"
        case transactionRecorded   = "transaction_recorded"
        case appOpened             = "app_opened"
        case pageVisited           = "page_visited"
        case periodStart           = "period_start"
    }

    enum ActionKind: String, Equatable {
        case recordTransaction = "record_transaction"
        case checkCommitment   = "check_commitment"
        case viewPage          = "view_page"
        case reviewBudget      = "review_budget"
        case checkAccount      = "check_account"
    }

    let id: String
    let triggerKind: TriggerKind
    let triggerHour: Int?
    let triggerCategory: String?
    let triggerCommitmentId: String?
    let actionKind: ActionKind
    let actionCategory: String?
    let actionCommitmentId: String?
    let frequency: Int
    let confidence: Double
    let lastOccurred: String
}
