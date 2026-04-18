import XCTest

/// WS-5 — base class that launches the app with the `ANCHOR_UI_TESTS=1`
/// environment flag. AnchorOSNativeApp reads this and swaps in a deterministic
/// fixture store (see `AppState.bootstrap`). Keeps every flow test
/// idempotent and runnable in parallel.
class AnchorUITestCase: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchEnvironment["ANCHOR_UI_TESTS"] = "1"
        app.launchEnvironment["ANCHOR_UI_TEST_NAME"] = name
        app.launch()
    }

    func tapIfExists(_ element: XCUIElement, timeout: TimeInterval = 3) {
        if element.waitForExistence(timeout: timeout) {
            element.tap()
        }
    }
}
