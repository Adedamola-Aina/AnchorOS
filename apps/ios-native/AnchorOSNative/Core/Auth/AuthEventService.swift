import Foundation
import UIKit
import FirebaseFunctions

// MARK: - AuthEventService
// Records login events matching PWA authEventService.ts.
// Calls Cloud Function to compute IP hash server-side (never stores raw IP).

enum AuthEventService {

    struct AuthEvent: Encodable {
        let timestamp: String
        let deviceInfo: DeviceInfo
        let method: String
    }

    struct DeviceInfo: Encodable {
        let os: String
        let model: String
        let systemVersion: String
    }

    static func recordEvent(method: String) {
        let event = AuthEvent(
            timestamp: ISO8601DateFormatter().string(from: Date()),
            deviceInfo: DeviceInfo(
                os: "iOS",
                model: UIDevice.current.model,
                systemVersion: UIDevice.current.systemVersion
            ),
            method: method
        )
        Task {
            do {
                try await callRecordAuthEvent(event)
            } catch {
                // Silent failure — analytics, not critical path
            }
        }
    }

    /// Fetch recent auth events for the current user
    static func getAuthEvents() async throws -> [[String: Any]] {
        let result = try await Functions.functions().httpsCallable("getAuthEvents").call([:])
        return (result.data as? [[String: Any]]) ?? []
    }

    /// Report an unrecognised sign-in ("Not me" button)
    static func reportUnrecognised(eventId: String) async throws {
        _ = try await Functions.functions().httpsCallable("reportUnrecognisedSignIn").call([
            "eventId": eventId
        ])
    }

    /// Revoke a specific session per AUTH-003
    static func revokeSession(eventId: String) async throws {
        _ = try await Functions.functions().httpsCallable("revokeSession").call([
            "eventId": eventId
        ])
    }

    private static func callRecordAuthEvent(_ event: AuthEvent) async throws {
        let data: [String: Any] = [
            "timestamp": event.timestamp,
            "deviceInfo": [
                "os": event.deviceInfo.os,
                "model": event.deviceInfo.model,
                "systemVersion": event.deviceInfo.systemVersion
            ],
            "method": event.method
        ]
        _ = try await Functions.functions().httpsCallable("recordAuthEvent").call(data)
    }
}
