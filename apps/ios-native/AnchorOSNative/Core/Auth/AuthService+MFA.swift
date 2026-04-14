import FirebaseAuth

// MARK: - AuthService MFA Extension
// TOTP-only multi-factor authentication methods.
// Split from AuthService.swift for ARCH-001 (≤ 200 lines).

extension AuthService {

    // MARK: - TOTP Enrollment

    func enrollTOTP() async throws -> (secret: TOTPSecret, qrURL: String) {
        guard let user = Auth.auth().currentUser else {
            throw AuthServiceError.noCurrentUser
        }
        let session = try await user.multiFactor.session()
        let secret = try await TOTPMultiFactorGenerator.generateSecret(with: session)
        let qrURL = secret.generateQRCodeURL(
            withAccountName: user.email ?? "user",
            issuer: "Anchor OS"
        )
        return (secret, qrURL)
    }

    func finalizeTOTPEnrollment(secret: TOTPSecret, code: String) async throws {
        guard let user = Auth.auth().currentUser else {
            throw AuthServiceError.noCurrentUser
        }
        let assertion = TOTPMultiFactorGenerator.assertionForEnrollment(
            with: secret,
            oneTimePassword: code
        )
        try await user.multiFactor.enroll(with: assertion, displayName: "Authenticator App")
    }

    func unenrollMFA() async throws {
        guard let user = Auth.auth().currentUser,
              let factor = user.multiFactor.enrolledFactors.first else {
            throw AuthServiceError.noMFAEnrolled
        }
        try await user.multiFactor.unenroll(with: factor)
    }

    // MARK: - MFA Verification (TOTP only)

    func verifyMFA(resolver: MultiFactorResolver, code: String) async throws {
        guard let totpHint = resolver.hints.first(where: { $0 is TOTPMultiFactorInfo }) as? TOTPMultiFactorInfo else {
            throw AuthServiceError.noMFAEnrolled
        }
        let assertion = TOTPMultiFactorGenerator.assertionForSignIn(
            withEnrollmentID: totpHint.uid,
            oneTimePassword: code
        )
        _ = try await resolver.resolveSignIn(with: assertion)
    }

    // MARK: - MFA State

    var isMFAEnrolled: Bool {
        guard let user = Auth.auth().currentUser else { return false }
        return !user.multiFactor.enrolledFactors.isEmpty
    }
}
