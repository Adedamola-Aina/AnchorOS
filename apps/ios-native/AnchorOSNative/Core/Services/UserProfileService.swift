import FirebaseFirestore
import FirebaseAuth


/// Fetch and update the authenticated user's profile document.
/// All reads/writes go through SecureDb — never bypass to Firestore directly.
final class UserProfileService {
    private let db = SecureDb.shared

    func fetch(uid: String) async -> AnchorUserProfile? {
        do {
            let snapshot = try await db.userDocument(uid: uid).getDocument()
            return try snapshot.data(as: AnchorUserProfile.self)
        } catch {
            return nil
        }
    }

    func updateDisplayName(uid: String, name: String) async throws {
        // Routes through SecureDb (merge) — audit fields added centrally.
        try await db.setDocument(uid: uid, path: [], data: ["displayName": name], merge: true)
        // Also sync to Firebase Auth profile
        let changeRequest = Auth.auth().currentUser?.createProfileChangeRequest()
        changeRequest?.displayName = name
        try await changeRequest?.commitChanges()
    }

    func updateCurrency(uid: String, currency: String) async throws {
        try await db.setDocument(uid: uid, path: [], data: ["currency": currency], merge: true)
    }
}
