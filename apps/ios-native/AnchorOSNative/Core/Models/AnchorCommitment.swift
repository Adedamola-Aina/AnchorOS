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
    let reminderTime: String?
    let currentStreak: Int?
    let longestStreak: Int?
    let lastCompletedAt: String?
    let createdAt: String?
    let priority: String?     // "low" | "medium" | "high" | "critical"
    let scope: String?        // "personal" | "family"

    var resolvedId: String { id ?? "" }
    var isFamilyShared: Bool { (scope ?? "personal") == "family" }

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

    var priorityColor: Color {
        switch priority?.lowercased() {
        case "critical": return Color(hex: "#DC2626") ?? .red
        case "high":     return Color(hex: "#EA580C") ?? .orange
        case "medium":   return Color(hex: "#D97706") ?? .yellow
        default:         return Color(hex: "#059669") ?? .green   // low
        }
    }

    var priorityIcon: String {
        switch priority?.lowercased() {
        case "critical": return "exclamationmark.2"
        case "high":     return "exclamationmark"
        case "medium":   return "minus"
        default:         return "arrow.down"
        }
    }
}
