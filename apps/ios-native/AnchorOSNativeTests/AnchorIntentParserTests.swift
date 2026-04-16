import XCTest
@testable import AnchorOSNative

/// Parity tests for AnchorIntentParser vs
/// src/services/fabric/intentDetection.ts (subset MVP).
final class AnchorIntentParserTests: XCTestCase {

    private func parse(_ s: String) -> AnchorFabricIntent.Action {
        AnchorIntentParser.parse(s).action
    }

    func test_chipPromptsMapToExpectedActions() {
        XCTAssertEqual(parse("what do i have today"),                     .queryToday)
        XCTAssertEqual(parse("what's coming up"),                         .queryUpcoming)
        XCTAssertEqual(parse("plan my week"),                             .planWeek)
        XCTAssertEqual(parse("how much did i spend this month"),          .querySpending)
        XCTAssertEqual(parse("what is my savings rate this month"),       .querySavingsRate)
        XCTAssertEqual(parse("generate weekly report"),                   .summarizeWeek)
    }

    func test_navigationTriggersNavigate() {
        let p = AnchorIntentParser.parse("open finance")
        XCTAssertEqual(p.action, .navigate)
        XCTAssertEqual(p.entities.page, "finance")
    }

    func test_netWorthRecognised() {
        XCTAssertEqual(parse("what's my net worth?"), .queryNetWorth)
    }

    func test_commitmentsKeywordWithoutSpending() {
        XCTAssertEqual(parse("show me my streaks"), .queryCommitments)
    }

    func test_unknownFallsThrough() {
        XCTAssertEqual(parse("marklar marklar"), .unknown)
        XCTAssertEqual(AnchorIntentParser.parse("marklar marklar").confidence, 0.15, accuracy: 0.001)
    }

    func test_timePeriodDetection() {
        XCTAssertEqual(AnchorIntentParser.parse("spend this week").entities.timePeriod, .thisWeek)
        XCTAssertEqual(AnchorIntentParser.parse("last month").entities.timePeriod, .lastMonth)
        XCTAssertEqual(AnchorIntentParser.parse("this month").entities.timePeriod, .thisMonth)
    }
}
