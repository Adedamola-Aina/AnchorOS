import AuthenticationServices
import FirebaseAuth
import FirebaseFunctions

// MARK: - PasskeyService
// FIDO2/WebAuthn passkey registration and authentication.
// Matches PWA usePasskeyAuth.ts + passkeyUtils.ts.
// Uses ASAuthorizationController (iOS 16+) for platform authenticator.
// Server-side: Cloud Functions issuePasskeyChallenge, verifyPasskeyAssertion,
//              completePasskeyRegistration, deletePasskey.

@MainActor
final class PasskeyService: NSObject, ObservableObject {
    @Published var isSupported: Bool = false
    @Published var isLoading = false
    @Published var error: String?

    private let functions = Functions.functions()
    var continuation: CheckedContinuation<ASAuthorizationResult, Error>?

    override init() {
        super.init()
        isSupported = true // ASAuthorizationController available iOS 16+
    }

    func clearError() { error = nil }

    // MARK: - Register Passkey

    func registerPasskey(userId: String, email: String, displayName: String) async -> String? {
        isLoading = true; defer { isLoading = false }
        error = nil
        do {
            // 1. Get challenge from server
            let challengeData = try await functions.httpsCallable("issuePasskeyChallenge").call([
                "purpose": "register"
            ])
            guard let data = challengeData.data as? [String: Any],
                  let challengeId = data["challengeId"] as? String,
                  let challenge = data["challenge"] as? String,
                  let challengeBytes = Data(base64URLEncoded: challenge) else {
                throw PasskeyError.invalidChallenge
            }

            // 2. Create credential via ASAuthorizationController
            let provider = ASAuthorizationPlatformPublicKeyCredentialProvider(
                relyingPartyIdentifier: rpID
            )
            let request = provider.createCredentialRegistrationRequest(
                challenge: challengeBytes,
                name: email,
                userID: Data(userId.utf8)
            )
            let result = try await performAuthorization(request: request)
            guard let credential = result as? ASAuthorizationPlatformPublicKeyCredentialRegistration else {
                throw PasskeyError.unexpectedCredentialType
            }

            // 3. Send attestation to server
            let regResult = try await functions.httpsCallable("completePasskeyRegistration").call([
                "challengeId": challengeId,
                "credential": [
                    "id": credential.credentialID.base64URLEncodedString(),
                    "rawId": credential.credentialID.base64URLEncodedString(),
                    "response": [
                        "clientDataJSON": credential.rawClientDataJSON.base64URLEncodedString(),
                        "attestationObject": credential.rawAttestationObject?.base64URLEncodedString() ?? ""
                    ],
                    "type": "public-key"
                ]
            ])
            guard let regData = regResult.data as? [String: Any],
                  let credentialId = regData["credentialId"] as? String else {
                throw PasskeyError.registrationFailed
            }
            return credentialId
        } catch let authError as ASAuthorizationError where authError.code == .canceled {
            return nil
        } catch {
            self.error = error.localizedDescription
            return nil
        }
    }

    // MARK: - Authenticate with Passkey

    func authenticate(credentialId: String? = nil) async -> Bool {
        isLoading = true; defer { isLoading = false }
        error = nil
        do {
            let challengeData = try await functions.httpsCallable("issuePasskeyChallenge").call([
                "purpose": "authenticate"
            ])
            guard let data = challengeData.data as? [String: Any],
                  let challengeId = data["challengeId"] as? String,
                  let challenge = data["challenge"] as? String,
                  let challengeBytes = Data(base64URLEncoded: challenge) else {
                throw PasskeyError.invalidChallenge
            }

            let provider = ASAuthorizationPlatformPublicKeyCredentialProvider(
                relyingPartyIdentifier: rpID
            )
            let request = provider.createCredentialAssertionRequest(challenge: challengeBytes)
            if let credentialId, let idData = Data(base64URLEncoded: credentialId) {
                request.allowedCredentials = [
                    ASAuthorizationPlatformPublicKeyCredentialDescriptor(credentialID: idData)
                ]
            }
            let result = try await performAuthorization(request: request)
            guard let assertion = result as? ASAuthorizationPlatformPublicKeyCredentialAssertion else {
                throw PasskeyError.unexpectedCredentialType
            }

            let verifyResult = try await functions.httpsCallable("verifyPasskeyAssertion").call([
                "challengeId": challengeId,
                "credentialId": assertion.credentialID.base64URLEncodedString(),
                "response": [
                    "authenticatorData": assertion.rawAuthenticatorData.base64URLEncodedString(),
                    "clientDataJSON": assertion.rawClientDataJSON.base64URLEncodedString(),
                    "signature": assertion.signature.base64URLEncodedString(),
                    "userHandle": assertion.userID.base64URLEncodedString()
                ]
            ])
            guard let verifyData = verifyResult.data as? [String: Any],
                  let customToken = verifyData["customToken"] as? String else {
                throw PasskeyError.verificationFailed
            }
            _ = try await Auth.auth().signIn(withCustomToken: customToken)
            AuthEventService.recordEvent(method: "passkey")
            return true
        } catch let authError as ASAuthorizationError where authError.code == .canceled {
            return false
        } catch {
            self.error = error.localizedDescription
            return false
        }
    }

    // MARK: - Delete Passkey

    func removePasskey(credentialId: String) async -> Bool {
        isLoading = true; defer { isLoading = false }
        do {
            _ = try await functions.httpsCallable("deletePasskey").call([
                "credentialId": credentialId
            ])
            return true
        } catch {
            self.error = error.localizedDescription
            return false
        }
    }
}
