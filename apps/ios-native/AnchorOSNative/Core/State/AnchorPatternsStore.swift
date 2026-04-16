import Foundation
import FirebaseFirestore

/// Live behavioral-patterns state for the current user.
///
/// Source document: `artifacts/anchor-os/users/{uid}/fabric_behavior/state`.
/// PWA reference: `BehavioralEngine.loadBehavior` in
/// src/services/fabric/BehavioralEngine.ts — the full behavior state is a
/// single document containing a `patterns: UserPattern[]` array plus
/// bookkeeping (confirmedPatterns, recentActions, dismissedPatterns). We only
/// consume `patterns` here because that is what
/// `AnchorProactiveQuestionEngine` requires.
///
/// Feeds `AnchorProactiveQuestionEngine` via `AnchorFabricStore`. Closes the
/// matrix partial on FabricProactiveQuestionCard.tsx (row 72) whose only
/// remaining gap was "Patterns feed empty until PatternsStore lands".
@MainActor
final class AnchorPatternsStore: ObservableObject {
    @Published private(set) var patterns: [AnchorUserPattern] = []
    @Published private(set) var isLoading: Bool = false

    private var listener: ListenerRegistration?
    private let db = Firestore.firestore()

    func start(uid: String) {
        stop()
        guard SecureDbPath.isValidUid(uid) else { return }
        isLoading = true
        let ref = db.document("\(SecureDb.root)/users/\(uid)/fabric_behavior/state")
        listener = ref.addSnapshotListener { [weak self] snap, _ in
            guard let self else { return }
            let raw = (snap?.data()?["patterns"] as? [[String: Any]]) ?? []
            let parsed = raw.compactMap(Self.decodePattern)
            Task { @MainActor in
                self.patterns = parsed
                self.isLoading = false
            }
        }
    }

    func stop() {
        listener?.remove()
        listener = nil
        patterns = []
        isLoading = false
    }

    /// Decode a PWA-shape UserPattern JSON dict (nested `trigger`/`followUpAction`
    /// discriminated unions) into the flat `AnchorUserPattern`. Returns nil when
    /// required fields are missing or types don't match. Public for unit testing.
    static func decodePattern(_ dict: [String: Any]) -> AnchorUserPattern? {
        guard let id = dict["id"] as? String,
              let triggerDict = dict["trigger"] as? [String: Any],
              let triggerType = triggerDict["type"] as? String,
              let triggerKind = AnchorUserPattern.TriggerKind(rawValue: triggerType),
              let actionDict = dict["followUpAction"] as? [String: Any],
              let actionType = actionDict["type"] as? String,
              let actionKind = AnchorUserPattern.ActionKind(rawValue: actionType) else {
            return nil
        }
        let frequency = (dict["frequency"] as? Int) ?? 0
        let confidence = (dict["confidence"] as? Double) ?? 0
        let lastOccurred = (dict["lastOccurred"] as? String) ?? ""
        let triggerHour = triggerDict["hour"] as? Int
        let triggerCategory = triggerDict["category"] as? String
        let triggerCommitmentId = triggerDict["commitmentId"] as? String
        let actionCategory: String? = {
            if let prefill = actionDict["prefill"] as? [String: Any] {
                return prefill["category"] as? String
            }
            return actionDict["category"] as? String
        }()
        let actionCommitmentId = actionDict["commitmentId"] as? String
        return AnchorUserPattern(
            id: id,
            triggerKind: triggerKind,
            triggerHour: triggerHour,
            triggerCategory: triggerCategory,
            triggerCommitmentId: triggerCommitmentId,
            actionKind: actionKind,
            actionCategory: actionCategory,
            actionCommitmentId: actionCommitmentId,
            frequency: frequency,
            confidence: confidence,
            lastOccurred: lastOccurred
        )
    }
}
