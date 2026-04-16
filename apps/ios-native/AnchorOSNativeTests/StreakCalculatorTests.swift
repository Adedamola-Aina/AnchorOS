import XCTest
@testable import AnchorOSNative

/// Parity contract with src/features/commitments/utils/streakUtils.ts.
/// Each assertion mirrors a scenario covered in streakUtils.test.ts.
final class StreakCalculatorTests: XCTestCase {

    // MARK: — milestone(for:)

    func test_milestone_returnsNilForNonMilestoneDay() {
        XCTAssertNil(StreakCalculator.milestone(for: 0))
        XCTAssertNil(StreakCalculator.milestone(for: 2))
        XCTAssertNil(StreakCalculator.milestone(for: 8))
        XCTAssertNil(StreakCalculator.milestone(for: 100))
    }

    func test_milestone_returnsExactMatch() {
        XCTAssertEqual(StreakCalculator.milestone(for: 3)?.emoji,   "🌱")
        XCTAssertEqual(StreakCalculator.milestone(for: 7)?.label,   "1 week strong!")
        XCTAssertEqual(StreakCalculator.milestone(for: 21)?.emoji,  "💪")
        XCTAssertEqual(StreakCalculator.milestone(for: 365)?.label, "1 year!")
    }

    func test_milestonesOrderedAscending() {
        let days = StreakCalculator.milestones.map(\.days)
        XCTAssertEqual(days, days.sorted())
        // Locked contract: exactly 9 milestones in the PWA constants.
        XCTAssertEqual(StreakCalculator.milestones.count, 9)
    }

    // MARK: — nudge(currentStreak:longestStreak:)

    func test_nudge_nilWhenBothZero() {
        XCTAssertNil(StreakCalculator.nudge(currentStreak: 0, longestStreak: 0))
    }

    func test_nudge_broken_referencesBest() {
        let s = StreakCalculator.nudge(currentStreak: 0, longestStreak: 12)
        XCTAssertEqual(s, "Your best was 12 days — you can get back there!")
    }

    func test_nudge_pointsToNextMilestone() {
        // current 5 → next milestone is 7 → remaining 2 days
        let s = StreakCalculator.nudge(currentStreak: 5, longestStreak: 5)
        XCTAssertEqual(s, "2 more days to ⭐ 1 week strong!")
    }

    func test_nudge_singularDayGrammar() {
        // current 6 → next is 7 → remaining 1 day (singular)
        let s = StreakCalculator.nudge(currentStreak: 6, longestStreak: 6)
        XCTAssertEqual(s, "1 more day to ⭐ 1 week strong!")
    }

    func test_nudge_beyondTopMilestoneIsCelebration() {
        let s = StreakCalculator.nudge(currentStreak: 500, longestStreak: 500)
        XCTAssertEqual(s, "Incredible 500-day streak! Keep it going!")
    }

    func test_nudge_onMilestoneDayPointsToNext() {
        // Landing on 7 should not stop encouragement; next is 14.
        let s = StreakCalculator.nudge(currentStreak: 7, longestStreak: 7)
        XCTAssertEqual(s, "7 more days to 🔥 2 weeks!")
    }
}
