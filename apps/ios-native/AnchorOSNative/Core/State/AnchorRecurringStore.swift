import Foundation
import FirebaseFirestore

/// Live recurring-transactions state for the current user.
///
/// Source collection: `artifacts/anchor-os/recurring_transactions` (top-level,
/// filtered by `userId` field) — mirrors `loadRecurringRules` in
/// src/services/fabric/fabricPersistence.ts. This is NOT a uid-scoped
/// subcollection in the PWA schema, so we query it directly and scope by
/// userId field the same way.
///
/// Feeds `AnchorDailyBriefingEngine.upcoming` via `AnchorFabricStore`. Closes
/// the matrix partial on FabricUpcomingCard.tsx (row 68) whose only remaining
/// gap was "Data source (RecurringStore) still not wired natively".
@MainActor
final class AnchorRecurringStore: ObservableObject {
    @Published private(set) var recurring: [AnchorRecurringTransaction] = []
    @Published private(set) var isLoading: Bool = false

    private var listener: ListenerRegistration?
    private let db = Firestore.firestore()

    func start(uid: String) {
        stop()
        guard SecureDbPath.isValidUid(uid) else { return }
        isLoading = true
        let query = db.collection("\(SecureDb.root)/recurring_transactions")
            .whereField("userId", isEqualTo: uid)
        listener = query.addSnapshotListener { [weak self] snap, _ in
            guard let self else { return }
            let rules = snap?.documents.compactMap {
                try? $0.data(as: AnchorRecurringTransaction.self)
            } ?? []
            Task { @MainActor in
                self.recurring = rules
                self.isLoading = false
            }
        }
    }

    func stop() {
        listener?.remove()
        listener = nil
        recurring = []
        isLoading = false
    }
}
