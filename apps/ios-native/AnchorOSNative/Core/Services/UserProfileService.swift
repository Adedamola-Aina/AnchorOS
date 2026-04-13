import FirebaseFirestore
import FirebaseFirestoreSwift

/// One-time fetch for the authenticated user's profile document.
/// All reads go through SecureDb — never bypass to Firestore directly.
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
}
