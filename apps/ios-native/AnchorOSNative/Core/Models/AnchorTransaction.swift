import Foundation
import FirebaseFirestore


/// Maps artifacts/anchor-os/users/{uid}/finance/{transactionId}
/// Schema reference: docs/FIRESTORE_SCHEMA.md §3
struct AnchorTransaction: Identifiable, Codable {
    @DocumentID var id: String?
    let title: String
    let amountCents: Int
    let type: String          // "income" | "expense" | "transfer"
    let category: String?
    let accountId: String?
    let accountName: String?
    let currency: String
    let date: String
    let isSoftDeleted: Bool?
    /// Optional "personal" | "family". Absent on older documents and treated
    /// as "personal". Matches src/types/financeTypes.ts `AnchorTransaction.scope`.
    var scope: String? = nil
    /// Optional free-text memo. Mirrors PWA `AnchorTransaction.narration`
    /// (src/types/financeTypes.ts). Absent on older documents.
    var narration: String? = nil

    var resolvedId: String { id ?? "" }

    var isActive: Bool { isSoftDeleted != true }

    var amountSign: String {
        switch type {
        case "income": return "+"
        case "transfer": return "→"
        default: return "-"
        }
    }

    var formattedAmount: String {
        let amount = Double(amountCents) / 100.0
        let symbol = currency == "USD" ? "$" : "₦"
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        let str = formatter.string(from: NSNumber(value: amount)) ?? "0.00"
        return "\(amountSign)\(symbol)\(str)"
    }

    var displayDate: String {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let d = iso.date(from: date) ?? ISO8601DateFormatter().date(from: date) {
            let rel = RelativeDateTimeFormatter()
            rel.unitsStyle = .short
            return rel.localizedString(for: d, relativeTo: Date())
        }
        return date
    }
}
