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
        // Dark neutrals
        Color(hex: "#1E1E2E") ?? .black,
        Color(hex: "#2D3A4A") ?? .black,
        Color(hex: "#1A1A2E") ?? .black,
        // Blues
        Color(hex: "#3D52D5") ?? .blue,
        Color(hex: "#1E40AF") ?? .blue,
        Color(hex: "#0EA5E9") ?? .blue,
        // Teals / Greens
        Color(hex: "#1A7F6E") ?? .green,
        Color(hex: "#059669") ?? .green,
        Color(hex: "#16A34A") ?? .green,
        // Reds / Pinks
        Color(hex: "#8B1A4A") ?? .red,
        Color(hex: "#DC2626") ?? .red,
        Color(hex: "#BE185D") ?? .red,
        // Oranges / Yellows
        Color(hex: "#B45309") ?? .orange,
        Color(hex: "#EA580C") ?? .orange,
        Color(hex: "#D97706") ?? .orange,
        // Purples
        Color(hex: "#6B21A8") ?? .purple,
        Color(hex: "#7C3AED") ?? .purple,
        Color(hex: "#9333EA") ?? .purple
    ]
}

extension AnchorAccount {
    func cardColor(at index: Int) -> Color {
        AnchorAccount.cardColors[index % AnchorAccount.cardColors.count]
    }
}
