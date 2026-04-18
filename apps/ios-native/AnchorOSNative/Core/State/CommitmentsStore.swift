import Foundation
import FirebaseFirestore

/// Live commitments state with completion tracking + write operations.
/// Started and stopped by AnchorOSNativeApp based on auth state.
@MainActor
final class CommitmentsStore: ObservableObject {
    @Published private(set) var commitments: [AnchorCommitment] = []
    @Published private(set) var isLoading = true

    private var uid: String?
    private let service = CommitmentService()
    private var listener: ListenerRegistration?

    // MARK: — Computed

    var activeCount: Int { commitments.filter { !$0.completed }.count }
    var completedCount: Int { commitments.filter { $0.completed }.count }
    var totalCount: Int { commitments.count }

    var completionPercent: Double {
        guard totalCount > 0 else { return 0 }
        return Double(completedCount) / Double(totalCount)
    }

    // MARK: — Lifecycle

    func start(uid: String) {
        self.uid = uid
        isLoading = true
        listener = service.listen(uid: uid) { [weak self] items in
            Task { @MainActor in
                self?.commitments = items
                self?.isLoading = false
            }
        }
    }

    func stop() {
        listener?.remove()
        listener = nil
        uid = nil
        commitments = []
        isLoading = true
    }

    // MARK: — Write

    func toggleCompleted(taskId: String) async {
        guard let uid else { return }
        guard let index = commitments.firstIndex(where: { $0.resolvedId == taskId }) else { return }
        let newValue = !commitments[index].completed
        do {
            try await service.toggleCompleted(uid: uid, taskId: taskId, completed: newValue)
        } catch {
            // Listener will reconcile state on failure
        }
    }

    func addCommitment(title: String, type: String, domain: String, timeOfDay: String?, notes: String?, priority: String? = nil, scope: String? = nil, reminderTime: String? = nil) async throws {
        guard let uid else { return }
        try await service.addCommitment(uid: uid, title: title, type: type, domain: domain, timeOfDay: timeOfDay, notes: notes, priority: priority, scope: scope, reminderTime: reminderTime)
    }

    func deleteCommitment(taskId: String) async throws {
        guard let uid else { return }
        try await service.deleteCommitment(uid: uid, taskId: taskId)
    }

    func updateCommitment(taskId: String, title: String, type: String, domain: String, timeOfDay: String?, notes: String?, priority: String? = nil, scope: String? = nil, reminderTime: String? = nil) async throws {
        guard let uid else { return }
        try await service.updateCommitment(uid: uid, taskId: taskId, title: title, type: type, domain: domain, timeOfDay: timeOfDay, notes: notes, priority: priority, scope: scope, reminderTime: reminderTime)
    }

    // MARK: — Refresh (pull-to-refresh)

    func refresh() async {
        guard let uid else { return }
        isLoading = true
        stop()
        start(uid: uid)
    }
}
