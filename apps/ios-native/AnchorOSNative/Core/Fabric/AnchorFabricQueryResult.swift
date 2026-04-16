import Foundation

/// Result returned by the native Fabric query engine.
/// Parity: mirrors `FabricQueryResult` in src/types (summary, detail,
/// actions). `data` is elided on native — we don't currently expose a
/// visualisation surface, so there's nothing to round-trip.
struct AnchorFabricQueryResult: Equatable {

    /// Post-query action offered in the response card. Parity: matches the
    /// PWA `{ label, type, payload }` shape, with `type` narrowed to the
    /// two cases the native surface handles today.
    enum ActionKind: Equatable {
        /// Route to a top-level tab. `page` accepts the same tokens as
        /// `AppState.navigate(to:)`.
        case navigate(page: String)
        /// Trigger a weekly-report modal / refresh. Used by the "Generate
        /// weekly report" chip.
        case generateWeeklyReport
        /// Prefill + present the Add-Transaction form. Payload mirrors
        /// the PWA `record_transaction` action payload (amount in major
        /// units, category optional, type narrows the form).
        case openAddTransaction(type: TransactionKind, amount: Double?, category: String?)

        enum TransactionKind: String, Equatable { case expense, income }
    }

    struct Action: Equatable {
        let label: String
        let kind: ActionKind
    }

    let summary: String
    var detail: String? = nil
    var actions: [Action] = []
}
