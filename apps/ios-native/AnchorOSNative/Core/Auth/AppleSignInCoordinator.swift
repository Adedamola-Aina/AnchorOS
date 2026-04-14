import AuthenticationServices
import CryptoKit
import FirebaseAuth

// MARK: - AppleSignInCoordinator
// Handles ASAuthorizationController flow for Sign in with Apple.
// Matches PWA socialAuth.ts Apple integration.

@MainActor
final class AppleSignInCoordinator: NSObject, ObservableObject,
    ASAuthorizationControllerDelegate,
    ASAuthorizationControllerPresentationContextProviding
{
    @Published var error: String?
    @Published var isLoading = false

    private var currentNonce: String?
    private var continuation: CheckedContinuation<Void, Error>?

    func signIn() async throws {
        isLoading = true
        error = nil
        defer { isLoading = false }

        let nonce = AuthService.randomNonce()
        currentNonce = nonce

        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName, .email]
        request.nonce = AuthService.sha256(nonce)

        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.presentationContextProvider = self

        try await withCheckedThrowingContinuation { (cont: CheckedContinuation<Void, Error>) in
            self.continuation = cont
            controller.performRequests()
        }
    }

    // MARK: - ASAuthorizationControllerDelegate

    nonisolated func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithAuthorization authorization: ASAuthorization
    ) {
        Task { @MainActor in
            guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential,
                  let tokenData = credential.identityToken,
                  let idToken = String(data: tokenData, encoding: .utf8),
                  let nonce = currentNonce else {
                continuation?.resume(throwing: AppleSignInError.missingCredential)
                continuation = nil
                return
            }

            do {
                try await AuthService.shared.signInWithApple(idToken: idToken, nonce: nonce)
                AuthEventService.recordEvent(method: "apple")
                continuation?.resume()
            } catch {
                self.error = error.localizedDescription
                continuation?.resume(throwing: error)
            }
            continuation = nil
        }
    }

    nonisolated func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithError error: Error
    ) {
        Task { @MainActor in
            let nsError = error as NSError
            if nsError.code == ASAuthorizationError.canceled.rawValue {
                // User cancelled — silent dismiss
                continuation?.resume()
            } else {
                self.error = error.localizedDescription
                continuation?.resume(throwing: error)
            }
            continuation = nil
        }
    }

    // MARK: - Presentation Context

    nonisolated func presentationAnchor(
        for controller: ASAuthorizationController
    ) -> ASPresentationAnchor {
        // Use the key window's scene
        let scene = UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first
        return scene?.windows.first(where: \.isKeyWindow) ?? ASPresentationAnchor()
    }
}

enum AppleSignInError: LocalizedError {
    case missingCredential

    var errorDescription: String? {
        switch self {
        case .missingCredential:
            return "Could not retrieve Apple ID credential."
        }
    }
}
