import Foundation
import FirebaseFirestore
import FirebaseFirestoreSwift

/// Maps artifacts/anchor-os/users/{uid}
/// Schema reference: docs/FIRESTORE_SCHEMA.md §1
struct AnchorUserProfile: Codable {
    let uid: String?
    let email: String?
    let displayName: String?
    let photoURL: String?
    let mfaEnabled: Bool?
    let preferences: Preferences?

    struct Preferences: Codable {
        let theme: String?
        let currency: String?
        let notifications: Bool?
    }

    var resolvedDisplayName: String {
        if let name = displayName, !name.isEmpty { return name }
        if let mail = email { return String(mail.split(separator: "@").first ?? "") }
        return "You"
    }

    var resolvedCurrency: String {
        preferences?.currency ?? "NGN"
    }
}
