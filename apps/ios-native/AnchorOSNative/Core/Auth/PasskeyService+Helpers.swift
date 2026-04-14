import AuthenticationServices

// MARK: - PasskeyService Helpers
// ASAuthorizationController delegation + base64url utilities.
// Split from PasskeyService.swift for ARCH-001 (≤ 200 lines).

// MARK: - Constants

extension PasskeyService {
    var rpID: String { "anchor-os.web.app" }
}

// MARK: - ASAuthorizationController Delegation

extension PasskeyService: ASAuthorizationControllerDelegate,
                           ASAuthorizationControllerPresentationContextProviding {

    func performAuthorization(request: ASAuthorizationRequest) async throws -> ASAuthorizationResult {
        try await withCheckedThrowingContinuation { cont in
            self.continuation = cont
            let controller = ASAuthorizationController(authorizationRequests: [request])
            controller.delegate = self
            controller.presentationContextProvider = self
            controller.performRequests()
        }
    }

    nonisolated func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithAuthorization authorization: ASAuthorization
    ) {
        Task { @MainActor in
            continuation?.resume(returning: authorization.credential)
            continuation = nil
        }
    }

    nonisolated func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithError error: Error
    ) {
        Task { @MainActor in
            continuation?.resume(throwing: error)
            continuation = nil
        }
    }

    nonisolated func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        ASPresentationAnchor()
    }
}

// MARK: - Passkey Errors

enum PasskeyError: LocalizedError {
    case invalidChallenge
    case unexpectedCredentialType
    case registrationFailed
    case verificationFailed

    var errorDescription: String? {
        switch self {
        case .invalidChallenge: return "Server returned an invalid challenge."
        case .unexpectedCredentialType: return "Unexpected credential type received."
        case .registrationFailed: return "Passkey registration failed."
        case .verificationFailed: return "Passkey verification failed."
        }
    }
}

// MARK: - Base64URL

extension Data {
    init?(base64URLEncoded string: String) {
        var base64 = string
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        while base64.count % 4 != 0 { base64.append("=") }
        self.init(base64Encoded: base64)
    }

    func base64URLEncodedString() -> String {
        base64EncodedString()
            .replacingOccurrences(of: "+", with: "-")
            .replacingOccurrences(of: "/", with: "_")
            .replacingOccurrences(of: "=", with: "")
    }
}

// MARK: - ASAuthorization type alias for Swift concurrency
typealias ASAuthorizationResult = ASAuthorizationCredential
