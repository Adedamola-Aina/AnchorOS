import Foundation
import FirebaseFirestore

/// Maps artifacts/anchor-os/users/{uid}/recurring/{recurringId}
/// Schema reference: docs/FIRESTORE_SCHEMA.md §recurring; PWA type src/types/recurring.ts
/// NOTE (Phase 4c): native has no Firestore wiring for recurring yet. The model is
/// introduced so the Daily Briefing / Upcoming Card engines match PWA contract.
/// The upcoming feed stays empty until a RecurringStore is ported (separate phase).
struct AnchorRecurringTransaction: Identifiable, Codable {
    @DocumentID var id: String?
    let title: String
    let amountCents: Int
    let currency: String?
    let category: String?
    let type: String                // "expense" | "income"
    let frequency: String           // "daily" | "weekly" | "monthly" | "yearly"
    let nextRunAt: String           // ISO timestamp of next occurrence
    let status: String              // "active" | "paused" | "ended"

    var resolvedId: String { id ?? "" }

    var isActive: Bool { status == "active" }
}
