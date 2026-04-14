import FirebaseAuth

// MARK: - GoogleSignInCoordinator
// Manages Google Sign-In via Firebase.
// Requires GoogleSignIn SDK (added via SPM).
// Matches PWA Google OAuth flow.

final class GoogleSignInCoordinator {

    func signIn() async throws {
        // Google Sign-In requires presenting a UI controller.
        // The GoogleSignIn SDK handles the OAuth flow natively.
        guard let windowScene = await UIApplication.shared.connectedScenes
            .compactMap({ $0 as? UIWindowScene }).first,
              let rootVC = await windowScene.windows.first?.rootViewController else {
            throw GoogleSignInError.noRootViewController
        }

        let result = try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<(String, String), Error>) in
            Task { @MainActor in
                // GIDSignIn is provided by GoogleSignIn SPM package.
                // If not installed yet, this will fail at compile time.
                // Add: https://github.com/google/GoogleSignIn-iOS via SPM.
                //
                // GIDSignIn.sharedInstance.signIn(withPresenting: rootVC) { result, error in
                //     if let error { continuation.resume(throwing: error); return }
                //     guard let user = result?.user,
                //           let idToken = user.idToken?.tokenString else {
                //         continuation.resume(throwing: GoogleSignInError.missingToken)
                //         return
                //     }
                //     continuation.resume(returning: (idToken, user.accessToken.tokenString))
                // }
                //
                // Placeholder until GoogleSignIn SDK is added to project.yml:
                continuation.resume(throwing: GoogleSignInError.sdkNotConfigured)
            }
        }
        try await AuthService.shared.signInWithGoogle(
            idToken: result.0,
            accessToken: result.1
        )
    }
}

enum GoogleSignInError: LocalizedError {
    case noRootViewController
    case missingToken
    case sdkNotConfigured

    var errorDescription: String? {
        switch self {
        case .noRootViewController: return "Cannot present Google Sign-In."
        case .missingToken: return "Google Sign-In did not return a token."
        case .sdkNotConfigured: return "Google Sign-In SDK not yet added to project."
        }
    }
}
