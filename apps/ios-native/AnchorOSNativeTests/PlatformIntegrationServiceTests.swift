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
}
