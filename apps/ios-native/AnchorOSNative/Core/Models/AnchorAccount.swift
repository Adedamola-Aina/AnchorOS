import Foundation
import FirebaseFirestore


/// Maps artifacts/anchor-os/users/{uid}/accounts/{accountId}
/// Schema reference: docs/FIRESTORE_SCHEMA.md §2
struct AnchorAccount: Identifiable, Codable {
    @DocumentID var id: String?
    let name: String
    let type: String
    let currency: String
    let balanceCents: Int
    let color: String?
    let scope: String?
    let ownerId: String?
    let isArchived: Bool?
    let sortOrder: Int?

    var resolvedId: String { id ?? "" }

    var formattedBalance: String {
        let amount = Double(balanceCents) / 100.0
        let symbol = currency == "USD" ? "$" : "₦"
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        let str = formatter.string(from: NSNumber(value: amount)) ?? "0.00"
        return "\(symbol)\(str)"
    }

    static let cardColors: [Color] = [
        Color(red: 0.17, green: 0.31, blue: 0.78),
        Color(red: 0.15, green: 0.44, blue: 0.62),
        Color(red: 0.25, green: 0.22, blue: 0.58),
        Color(red: 0.10, green: 0.56, blue: 0.42)
    ]
}

extension AnchorAccount {
    func cardColor(at index: Int) -> Color {
        AnchorAccount.cardColors[index % AnchorAccount.cardColors.count]
    }
}
