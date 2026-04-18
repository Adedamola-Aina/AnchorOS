import Foundation

/// WS-8 — offline mutation queue that mirrors the PWA's
/// `useFinanceOfflineSync` / `useCommitmentOfflineSync` behavior. Pending
/// writes are persisted to `UserDefaults` so the app can replay them on
/// the next successful network cycle.
///
/// The queue is intentionally simple: FIFO, at-most-once semantics per
/// mutation id, optimistic UI handled by the caller. Firestore's own
/// offline cache still runs — this queue is about app-specific writes
/// that must remain intact across launches.
@MainActor
final class AnchorMutationQueue: ObservableObject {
    static let shared = AnchorMutationQueue()

    @Published private(set) var pending: [PendingMutation] = []

    private let key = "anchor_offline_mutation_queue_v1"

    struct PendingMutation: Codable, Identifiable, Equatable {
        let id: String
        let collection: String
        let action: String           // "create" | "update" | "delete"
        let payload: [String: String]
        let createdAt: Date
    }

    private init() {
        load()
    }

    func enqueue(_ mutation: PendingMutation) {
        if pending.contains(where: { $0.id == mutation.id }) { return }
        pending.append(mutation)
        persist()
    }

    func remove(id: String) {
        pending.removeAll { $0.id == id }
        persist()
    }

    func clear() {
        pending.removeAll()
        persist()
    }

    private func persist() {
        if let data = try? JSONEncoder().encode(pending) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: key),
              let decoded = try? JSONDecoder().decode([PendingMutation].self, from: data)
        else { return }
        pending = decoded
    }
}
