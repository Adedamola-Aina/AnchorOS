import XCTest
@testable import AnchorOSNative

@MainActor
final class PlatformIntegrationServiceTests: XCTestCase {
    func test_extractInviteTokenFromDeepLink() {
        let url = URL(string: "anchoros://invite?token=abc123")!
        XCTAssertEqual(PlatformIntegrationService.extractInviteToken(from: url), "abc123")
    }

    func test_extractInviteTokenFromInviteQueryName() {
        let url = URL(string: "anchoros://open?familyInvite=code-789")!
        XCTAssertEqual(PlatformIntegrationService.extractInviteToken(from: url), "code-789")
    }

    func test_detectsBankCallbackURL() {
        let url = URL(string: "anchoros://finance?bank=connected")!
        XCTAssertTrue(PlatformIntegrationService.isBankCallback(url))
    }

    func test_rejectsEmptyPushToken() {
        XCTAssertFalse(PlatformIntegrationService.shouldStorePushToken("   "))
        XCTAssertTrue(PlatformIntegrationService.shouldStorePushToken("token-123"))
    }

    func test_fcmTokenPathMatchesPWAShape() {
        // WS-1: native must write to fcmTokens/{token} — same collection as
        // src/api/PushTokenApi.ts so shared dispatchers reach native devices.
        let segments = PlatformIntegrationService.fcmTokenPathSegments(forToken: "abc-123")
        XCTAssertEqual(segments, ["fcmTokens", "abc-123"])
    }

    func test_onlyFcmTokensPersist_apnsTokensAreInMemoryOnly() {
        XCTAssertTrue(PlatformIntegrationService.shouldPersistTokenToFirestore(source: "fcm"))
        XCTAssertFalse(PlatformIntegrationService.shouldPersistTokenToFirestore(source: "apns"))
        XCTAssertFalse(PlatformIntegrationService.shouldPersistTokenToFirestore(source: "unknown"))
    }

    func test_inviteTokenExpiresAfter24h() {
        let defaults = UserDefaults.standard
        defaults.set("invite-abc", forKey: "anchor_pending_invite_token")
        // Issued 48h ago:
        defaults.set(Date().timeIntervalSince1970 - 48 * 3600,
                     forKey: "anchor_pending_invite_issued_at")
        XCTAssertNil(PlatformIntegrationService.validStoredInviteToken())
        XCTAssertNil(defaults.string(forKey: "anchor_pending_invite_token"))
    }

    func test_inviteTokenValidWithin24h() {
        let defaults = UserDefaults.standard
        defaults.set("invite-fresh", forKey: "anchor_pending_invite_token")
        defaults.set(Date().timeIntervalSince1970 - 60,
                     forKey: "anchor_pending_invite_issued_at")
        XCTAssertEqual(PlatformIntegrationService.validStoredInviteToken(), "invite-fresh")
        defaults.removeObject(forKey: "anchor_pending_invite_token")
        defaults.removeObject(forKey: "anchor_pending_invite_issued_at")
    }
}
