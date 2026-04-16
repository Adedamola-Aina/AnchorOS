import XCTest
@testable import AnchorOSNative

/// Parity contract: mirrors src/utils/taskInsights.ts → getProductivityMetrics.
/// Keep in lockstep with PWA tests. Differences flagged inline.
final class ProductivityCalculatorTests: XCTestCase {

    private func commitment(category: String? = "personal", completed: Bool = false) -> AnchorCommitment {
        AnchorCommitment(id: UUID().uuidString, title: "T", type: "daily",
                         completed: completed, category: category, domain: nil,
                         timeOfDay: nil, notes: nil, currentStreak: nil,
                         longestStreak: nil, lastCompletedAt: nil, createdAt: nil, priority: nil)
    }

    func test_emptyReturnsZero() {
        let m = ProductivityCalculator.calculate(commitments: [])
        XCTAssertEqual(m.score, 0)
        XCTAssertEqual(m.totalCount, 0)
        XCTAssertEqual(m.completedCount, 0)
        XCTAssertEqual(m.trend, .stable)
        XCTAssertNil(m.insight)
    }

    func test_scoreIsCompletionPercentageRounded() {
        // 3 of 5 = 60%
        let commits = (0..<3).map { _ in commitment(completed: true) }
                   + (0..<2).map { _ in commitment(completed: false) }
        let m = ProductivityCalculator.calculate(commitments: commits)
        XCTAssertEqual(m.score, 60)
        XCTAssertEqual(m.completedCount, 3)
        XCTAssertEqual(m.totalCount, 5)
    }

    func test_highScoreInsight() {
        // 9 of 10 = 90%
        let commits = (0..<9).map { _ in commitment(completed: true) }
                   + [commitment(completed: false)]
        let m = ProductivityCalculator.calculate(commitments: commits)
        XCTAssertEqual(m.insight, "Your consistency is outstanding this week!")
    }

    func test_midScoreInsight() {
        // 3 of 5 = 60% (>50, !>80)
        let commits = (0..<3).map { _ in commitment(completed: true) }
                   + (0..<2).map { _ in commitment(completed: false) }
        let m = ProductivityCalculator.calculate(commitments: commits)
        XCTAssertEqual(m.insight, "You're on track, keep pushing!")
    }

    func test_personalDominantInsight() {
        // Personal 100%, Family 0% → delta > 20 → personal-dominant message
        let commits = [
            commitment(category: "personal", completed: true),
            commitment(category: "personal", completed: true),
            commitment(category: "family", completed: false),
            commitment(category: "family", completed: false)
        ]
        let m = ProductivityCalculator.calculate(commitments: commits)
        XCTAssertEqual(m.insight, "Personal tasks are strong; don't forget family commitments.")
    }

    func test_familyDominantInsight() {
        let commits = [
            commitment(category: "family", completed: true),
            commitment(category: "family", completed: true),
            commitment(category: "personal", completed: false),
            commitment(category: "personal", completed: false)
        ]
        let m = ProductivityCalculator.calculate(commitments: commits)
        XCTAssertEqual(m.insight, "Great family focus! Take time for yourself too.")
    }

    func test_trendImprovingAboveFifty() {
        let commits = (0..<6).map { _ in commitment(completed: true) }
                   + (0..<4).map { _ in commitment(completed: false) }
        let m = ProductivityCalculator.calculate(commitments: commits)
        XCTAssertEqual(m.trend, .improving)
    }

    func test_domainBreakdown() {
        let commits = [
            commitment(category: "personal", completed: true),
            commitment(category: "personal", completed: false),
            commitment(category: "family", completed: true),
            commitment(category: "family", completed: true)
        ]
        let m = ProductivityCalculator.calculate(commitments: commits)
        XCTAssertEqual(m.domainBreakdown.personal, 50)
        XCTAssertEqual(m.domainBreakdown.family, 100)
    }
}
