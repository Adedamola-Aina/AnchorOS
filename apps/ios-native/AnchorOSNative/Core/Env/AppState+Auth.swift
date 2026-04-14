import Foundation
import FirebaseAuth
import AuthenticationServices

// MARK: - AppState Social Auth + MFA
// Split from AppEnvironment.swift for ARCH-001 (≤ 200 lines).

extension AppState {

    // MARK: - Social Auth

    func signInWithApple() async {
        guard firebaseReady else { return }
        isBusy = true
        defer { isBusy = false }
        do {
            let coordinator = AppleSignInCoordinator()
            try await coordinator.signIn()
            statusMessage = "Signed in with Apple."
            isAuthenticated = true
            AuthEventService.recordEvent(method: "apple")
        } catch let error as ASAuthorizationError where error.code == .canceled {
            statusMessage = ""
        } catch {
            statusMessage = "Apple Sign-In failed: \(error.localizedDescription)"
        }
    }

    func signInWithGoogle() async {
        guard firebaseReady else { return }
        isBusy = true
        defer { isBusy = false }
        do {
            let coordinator = GoogleSignInCoordinator()
            try await coordinator.signIn()
            statusMessage = "Signed in with Google."
            isAuthenticated = true
            AuthEventService.recordEvent(method: "google")
        } catch {
            statusMessage = "Google Sign-In failed: \(error.localizedDescription)"
        }
    }

    // MARK: - MFA

    func verifyMFA(code: String) async {
        guard let resolver = mfaResolver else {
            statusMessage = "No MFA challenge pending."
            return
        }
        isBusy = true
        defer { isBusy = false }
        do {
            try await AuthService.shared.verifyMFA(resolver: resolver, code: code)
            mfaResolver = nil
            statusMessage = "Signed in."
            isAuthenticated = true
            AuthEventService.recordEvent(method: "password")
        } catch {
            statusMessage = "MFA verification failed: \(error.localizedDescription)"
        }
    }

    // MARK: - Reauthentication (SEC-008)

    func reauthenticate(password: String) async throws {
        try await AuthService.shared.reauthenticate(password: password)
    }

    func reauthenticateWithProvider() async throws {
        guard let user = AuthService.shared.currentUser,
              let providerId = user.providerData.first?.providerID else {
            throw AuthServiceError.noCurrentUser
        }
        switch providerId {
        case "apple.com":
            let coordinator = AppleSignInCoordinator()
            try await coordinator.signIn()
        case "google.com":
            let coordinator = GoogleSignInCoordinator()
            try await coordinator.signIn()
        default:
            throw AuthServiceError.noCurrentUser
        }
    }
}
