import Foundation
import FirebaseAuth
import AuthenticationServices
import CryptoKit

final class AuthService {
    static let shared = AuthService()
    private init() {}

    // MARK: - Email / Password

    func signIn(email: String, password: String) async throws {
        _ = try await Auth.auth().signIn(withEmail: email, password: password)
    }

    func signUp(email: String, password: String, displayName: String) async throws -> User {
        let result = try await Auth.auth().createUser(withEmail: email, password: password)
        if !displayName.isEmpty {
            let req = result.user.createProfileChangeRequest()
            req.displayName = displayName
            try await req.commitChanges()
        }
        return result.user
    }

    func signOut() throws {
        try Auth.auth().signOut()
    }

    // MARK: - Password Reset

    func sendPasswordReset(email: String) async throws {
        try await Auth.auth().sendPasswordReset(withEmail: email)
    }

    // MARK: - Email Verification

    func sendEmailVerification() async throws {
        guard let user = Auth.auth().currentUser else { return }
        try await user.sendEmailVerification()
    }

    var isEmailVerified: Bool {
        Auth.auth().currentUser?.isEmailVerified ?? false
    }

    // MARK: - Change Email (sends verification to new address)

    func updateEmail(to newEmail: String) async throws {
        guard let user = Auth.auth().currentUser else {
            throw AuthServiceError.noCurrentUser
        }
        try await user.sendEmailVerification(beforeUpdatingEmail: newEmail)
    }

    // MARK: - Re-authentication

    func reauthenticate(password: String) async throws {
        guard let user = Auth.auth().currentUser,
              let email = user.email else {
            throw AuthServiceError.noCurrentUser
        }
        let credential = EmailAuthProvider.credential(withEmail: email, password: password)
        try await user.reauthenticate(with: credential)
    }

    // MARK: - Google Sign-In (via Firebase)

    func signInWithGoogle(idToken: String, accessToken: String) async throws {
        let credential = GoogleAuthProvider.credential(
            withIDToken: idToken,
            accessToken: accessToken
        )
        _ = try await Auth.auth().signIn(with: credential)
    }

    // MARK: - Apple Sign-In

    func signInWithApple(idToken: String, nonce: String) async throws {
        let credential = OAuthProvider.appleCredential(
            withIDToken: idToken,
            rawNonce: nonce,
            fullName: nil
        )
        _ = try await Auth.auth().signIn(with: credential)
    }

    /// Generate a random nonce for Apple Sign-In
    static func randomNonce(length: Int = 32) -> String {
        var randomBytes = [UInt8](repeating: 0, count: length)
        _ = SecRandomCopyBytes(kSecRandomDefault, length, &randomBytes)
        let charset = Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")
        return String(randomBytes.map { charset[Int($0) % charset.count] })
    }

    /// SHA256 hash for nonce
    static func sha256(_ input: String) -> String {
        let data = Data(input.utf8)
        let hash = SHA256.hash(data: data)
        return hash.compactMap { String(format: "%02x", $0) }.joined()
    }

    // MARK: - State

    func currentUserID() -> String? {
        Auth.auth().currentUser?.uid
    }

    var currentUser: User? {
        Auth.auth().currentUser
    }

    func addStateListener(_ handler: @escaping (String?) -> Void) -> AuthStateDidChangeListenerHandle {
        Auth.auth().addStateDidChangeListener { _, user in
            handler(user?.uid)
        }
    }

    func removeStateListener(_ handle: AuthStateDidChangeListenerHandle?) {
        guard let handle else { return }
        Auth.auth().removeStateDidChangeListener(handle)
    }
}

// MARK: - Errors

enum AuthServiceError: LocalizedError {
    case noCurrentUser
    case noMFAEnrolled

    var errorDescription: String? {
        switch self {
        case .noCurrentUser: return "No user is currently signed in."
        case .noMFAEnrolled: return "No MFA factor is enrolled."
        }
    }
}
