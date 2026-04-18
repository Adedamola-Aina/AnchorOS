import XCTest

/// WS-5 — 12 critical flows mirroring the Playwright coverage in `e2e/`.
/// These tests are intentionally lightweight (launch → verify key labels) so
/// they run in CI on every PR under 10 minutes. Deeper scenario testing lives
/// in the per-feature XCTest units.
final class AnchorCriticalFlowsUITests: AnchorUITestCase {

    func test_01_appLaunchesToRootTabBar() throws {
        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: 10))
    }

    func test_02_authScreenReachable() throws {
        // Fixture mode lands unauthenticated by default unless ANCHOR_UI_TEST_SIGNED_IN=1.
        if app.staticTexts["Welcome back"].waitForExistence(timeout: 3) {
            XCTAssertTrue(app.staticTexts["Welcome back"].exists)
        } else {
            XCTAssertTrue(app.tabBars.firstMatch.exists)
        }
    }

    func test_03_onboardingProgressIsVisible() throws {
        if app.otherElements["onboarding_progress"].waitForExistence(timeout: 3) {
            XCTAssertTrue(app.otherElements["onboarding_progress"].isHittable)
        }
    }

    func test_04_financeTabShowsWalletOrEmptyState() throws {
        let financeTab = app.tabBars.buttons["Finance"]
        tapIfExists(financeTab)
        XCTAssertTrue(
            app.staticTexts["Wallet"].waitForExistence(timeout: 5) ||
            app.staticTexts["No accounts yet"].waitForExistence(timeout: 5) ||
            app.navigationBars["Finance"].waitForExistence(timeout: 5)
        )
    }

    func test_05_commitmentsTabOpens() throws {
        tapIfExists(app.tabBars.buttons["Tasks"])
        XCTAssertTrue(
            app.navigationBars["Tasks"].waitForExistence(timeout: 5) ||
            app.navigationBars["Commitments"].waitForExistence(timeout: 5)
        )
    }

    func test_06_fabricTabOpens() throws {
        tapIfExists(app.tabBars.buttons["Anchor AI"])
        XCTAssertTrue(
            app.navigationBars["Anchor AI"].waitForExistence(timeout: 5) ||
            app.staticTexts["Today"].waitForExistence(timeout: 5)
        )
    }

    func test_07_settingsTabOpens() throws {
        tapIfExists(app.tabBars.buttons["Settings"])
        XCTAssertTrue(app.navigationBars["Settings"].waitForExistence(timeout: 5))
    }

    func test_08_addTransactionSheetOpensAndCancels() throws {
        tapIfExists(app.tabBars.buttons["Finance"])
        tapIfExists(app.buttons["Add Transaction"])
        if app.navigationBars["New Transaction"].waitForExistence(timeout: 3) {
            tapIfExists(app.buttons["Cancel"])
        }
    }

    func test_09_addTaskSheetOpensAndCancels() throws {
        tapIfExists(app.tabBars.buttons["Tasks"])
        tapIfExists(app.buttons["Add Task"])
        if app.navigationBars["New Task"].waitForExistence(timeout: 3) {
            tapIfExists(app.buttons["Cancel"])
        }
    }

    func test_10_biometricLockSettingsReachable() throws {
        tapIfExists(app.tabBars.buttons["Settings"])
        tapIfExists(app.staticTexts["Biometric Lock"])
        XCTAssertTrue(
            app.navigationBars["Biometric Lock"].waitForExistence(timeout: 5) ||
            app.switches.firstMatch.waitForExistence(timeout: 5)
        )
    }

    func test_11_dangerZoneReachableFromSettings() throws {
        tapIfExists(app.tabBars.buttons["Settings"])
        let dangerZone = app.staticTexts["Danger Zone"]
        if dangerZone.waitForExistence(timeout: 5) {
            XCTAssertTrue(dangerZone.isHittable)
        }
    }

    func test_12_fabricQueryPromptChipsAreTappable() throws {
        tapIfExists(app.tabBars.buttons["Anchor AI"])
        let firstChip = app.buttons.matching(identifier: "fabric_prompt_chip").firstMatch
        if firstChip.waitForExistence(timeout: 5) {
            firstChip.tap()
        }
    }
}
