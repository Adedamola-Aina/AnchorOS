import XCTest
@testable import AnchorOSNative

/// Verifies AppState.navigate(to:) parity with PWA route strings.
/// These are the paths emitted by Prediction.Action.navigateTo in every
/// native signal module (src/services/fabric/prediction*Signals.ts).
@MainActor
final class AppStateNavigationTests: XCTestCase {

    func test_defaultSelectedTabIsHome() {
        XCTAssertEqual(AppState().selectedTab, 0)
    }

    func test_routesFinanceToTab3() {
        let s = AppState()
        s.navigate(to: "/finance")
        XCTAssertEqual(s.selectedTab, 3)
    }

    func test_routesCommitmentsToTab1() {
        let s = AppState()
        s.navigate(to: "/commitments")
        XCTAssertEqual(s.selectedTab, 1)
    }

    func test_acceptsTasksAlias() {
        let s = AppState()
        s.navigate(to: "/tasks")
        XCTAssertEqual(s.selectedTab, 1)
    }

    func test_routesAnchorAIToTab2() {
        let s = AppState()
        s.navigate(to: "/fabric")
        XCTAssertEqual(s.selectedTab, 2)
    }

    func test_routesDashboardToTab0() {
        let s = AppState()
        s.selectedTab = 3
        s.navigate(to: "/")
        XCTAssertEqual(s.selectedTab, 0)
    }

    func test_unknownPathDoesNotChangeTab() {
        let s = AppState()
        s.selectedTab = 2
        s.navigate(to: "/nope")
        XCTAssertEqual(s.selectedTab, 2)
    }

    func test_pathWithoutLeadingSlashAlsoWorks() {
        let s = AppState()
        s.navigate(to: "finance")
        XCTAssertEqual(s.selectedTab, 3)
    }
}
