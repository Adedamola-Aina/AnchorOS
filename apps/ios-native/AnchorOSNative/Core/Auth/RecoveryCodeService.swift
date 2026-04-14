import Foundation
import CryptoKit
import FirebaseFunctions

// MARK: - RecoveryCodeService
// Matches PWA mfaRecoveryService.ts.
// Generates 8 backup codes shown ONCE after MFA enrollment.
// Codes are hashed client-side (SHA-256) before storage.

enum RecoveryCodeService {
    static let codeCount = 8
    static let codeLength = 8
    // No O/0/I/1 confusion chars — matches PWA CHARSET
    static let charset = Array("ABCDEFGHJKLMNPQRSTUVWXYZ23456789")

    struct GeneratedCodes {
        let plainCodes: [String]    // Show to user ONCE
        let hashedCodes: [String]   // Store in Firestore
    }

    static func generate() -> GeneratedCodes {
        var plain: [String] = []
        var hashed: [String] = []
        for _ in 0..<codeCount {
            let code = randomCode()
            plain.append(code)
            hashed.append(sha256(code))
        }
        return GeneratedCodes(plainCodes: plain, hashedCodes: hashed)
    }

    static func normalize(_ code: String) -> String {
        code.replacingOccurrences(of: "[^a-zA-Z0-9]", with: "", options: .regularExpression)
            .uppercased()
    }

    static func verify(code: String, storedHashes: [String]) -> Int {
        let normalized = normalize(code)
        let hash = sha256(normalized)
        return storedHashes.firstIndex(of: hash) ?? -1
    }

    // MARK: - Cloud Function: Recover MFA

    static func recoverMFA(email: String, code: String) async throws -> RecoveryResult {
        let functions = Functions.functions()
        let result = try await functions.httpsCallable("recoverMfaWithCode").call([
            "email": email,
            "recoveryCode": normalize(code)
        ])
        guard let data = result.data as? [String: Any],
              let success = data["success"] as? Bool else {
            throw RecoveryError.invalidResponse
        }
        return RecoveryResult(
            success: success,
            mfaReset: data["mfaReset"] as? Bool ?? false,
            codesRemaining: data["codesRemaining"] as? Int ?? 0
        )
    }

    // MARK: - Private

    private static func randomCode() -> String {
        var bytes = [UInt8](repeating: 0, count: codeLength)
        _ = SecRandomCopyBytes(kSecRandomDefault, codeLength, &bytes)
        return String(bytes.map { charset[Int($0) % charset.count] })
    }

    private static func sha256(_ input: String) -> String {
        let data = Data(input.utf8)
        let hash = SHA256.hash(data: data)
        return hash.compactMap { String(format: "%02x", $0) }.joined()
    }
}

struct RecoveryResult {
    let success: Bool
    let mfaReset: Bool
    let codesRemaining: Int
}

enum RecoveryError: LocalizedError {
    case invalidResponse

    var errorDescription: String? {
        "Recovery failed. Please try again."
    }
}
