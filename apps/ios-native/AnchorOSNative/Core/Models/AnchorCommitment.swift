import Foundation
import FirebaseFirestore


/// Maps artifacts/anchor-os/users/{uid}/commitments/{taskId}
/// Schema reference: docs/FIRESTORE_SCHEMA.md §5
struct AnchorCommitment: Identifiable, Codable {
    @DocumentID var id: String?
    let title: String
    let type: String          // "daily" | "weekly" | "monthly" | "todo"
    var completed: Bool
    let category: String?
    let domain: String?
    let timeOfDay: String?
    let notes: String?
    let currentStreak: Int?
    let longestStreak: Int?
    let lastCompletedAt: String?

    var resolvedId: String { id ?? "" }

    var typeIcon: String {
        switch type {
        case "daily": return "arrow.clockwise"
        case "weekly": return "calendar.badge.clock"
        case "monthly": return "calendar"
        default: return "checkmark.square"
        }
    }

    var typeLabel: String { type.uppercased() }

    var domainLabel: String? {
        guard let d = domain, !d.isEmpty else { return nil }
        return d.uppercased()
    }
}
