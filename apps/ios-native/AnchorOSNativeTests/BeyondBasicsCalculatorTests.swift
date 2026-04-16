import XCTest
@testable import AnchorOSNative

/// Parity contract: mirrors src/features/dashboard/hooks/useBeyondBasics.ts.
/// Native previously shipped a 4-step checklist; PWA ships 6 items. This test
/// suite enforces the 6-item contract so the two stay in lockstep.
final class BeyondBasicsCalculatorTests: XCTestCase {

    private func account() -> AnchorAccount {
        AnchorAccount(id: "a", name: "A", type: "checking", currency: "NGN",
                      balanceCents: 0, color: nil, scope: "personal", ownerId: nil,
                      isArchived: false, sortOrder: 0)
    }

    private func tx() -> AnchorTransaction {
        AnchorTransaction(id: "t", title: "T", amountCents: 0, type: "expense",
                          category: nil, accountId: "a", accountName: nil,
                          currency: "NGN", date: "2026-04-15T00:00:00.000Z",
                          isSoftDeleted: false)
    }

    private func commitment(type: String) -> AnchorCommitment {
        AnchorCommitment(id: UUID().uuidString, title: "T", type: type, completed: false,
                         category: "personal", domain: nil, timeOfDay: nil, notes: nil,
                         currentStreak: nil, longestStreak: nil, lastCompletedAt: nil,
                         createdAt: nil, priority: nil)
    }

    func test_sixItemsAlwaysReturned() {
        let result = BeyondBasicsCalculator.calculate(
            accounts: [], transactions: [], commitments: [],
            themeCustomized: false, notificationsSet: false,
            emailVerified: false, mfaEnabled: false
        )
        XCTAssertEqual(result.items.count, 6)
        XCTAssertEqual(result.items.map(\.id), [
            .exploreFinance, .recurringCommitment, .reviewDashboard,
            .customizeSettings, .verifyEmail, .enableMfa
        ])
    }

    func test_exploreFinanceCompletedByFirstTransaction() {
        let r = BeyondBasicsCalculator.calculate(
            accounts: [account()], transactions: [tx()], commitments: [],
            themeCustomized: false, notificationsSet: false,
            emailVerified: false, mfaEnabled: false
        )
        XCTAssertTrue(r.items.first { $0.id == .exploreFinance }!.completed)
    }

    func test_recurringCommitmentRequiresWeeklyOrMonthly() {
        // Daily alone must NOT satisfy (parity with PWA: t.type === 'weekly' || 'monthly')
        let daily = BeyondBasicsCalculator.calculate(
            accounts: [], transactions: [], commitments: [commitment(type: "daily")],
            themeCustomized: false, notificationsSet: false,
            emailVerified: false, mfaEnabled: false
        )
        XCTAssertFalse(daily.items.first { $0.id == .recurringCommitment }!.completed)

        let weekly = BeyondBasicsCalculator.calculate(
            accounts: [], transactions: [], commitments: [commitment(type: "weekly")],
            themeCustomized: false, notificationsSet: false,
            emailVerified: false, mfaEnabled: false
        )
        XCTAssertTrue(weekly.items.first { $0.id == .recurringCommitment }!.completed)
    }

    func test_reviewDashboardCompletedByAnyCommitment() {
        let r = BeyondBasicsCalculator.calculate(
            accounts: [], transactions: [], commitments: [commitment(type: "daily")],
            themeCustomized: false, notificationsSet: false,
            emailVerified: false, mfaEnabled: false
        )
        XCTAssertTrue(r.items.first { $0.id == .reviewDashboard }!.completed)
    }

    func test_customizeSettingsCompletedByThemeOrNotifications() {
        let themeOnly = BeyondBasicsCalculator.calculate(
            accounts: [], transactions: [], commitments: [],
            themeCustomized: true, notificationsSet: false,
            emailVerified: false, mfaEnabled: false
        )
        XCTAssertTrue(themeOnly.items.first { $0.id == .customizeSettings }!.completed)

        let notifsOnly = BeyondBasicsCalculator.calculate(
            accounts: [], transactions: [], commitments: [],
            themeCustomized: false, notificationsSet: true,
            emailVerified: false, mfaEnabled: false
        )
        XCTAssertTrue(notifsOnly.items.first { $0.id == .customizeSettings }!.completed)
    }

    func test_verifyEmailAndMfaTrackedIndependently() {
        let r = BeyondBasicsCalculator.calculate(
            accounts: [], transactions: [], commitments: [],
            themeCustomized: false, notificationsSet: false,
            emailVerified: true, mfaEnabled: false
        )
        XCTAssertTrue(r.items.first { $0.id == .verifyEmail }!.completed)
        XCTAssertFalse(r.items.first { $0.id == .enableMfa }!.completed)
    }

    func test_progressAndCounts() {
        let r = BeyondBasicsCalculator.calculate(
            accounts: [account()], transactions: [tx()],
            commitments: [commitment(type: "weekly")],
            themeCustomized: true, notificationsSet: false,
            emailVerified: true, mfaEnabled: false
        )
        // explore_finance (tx) + recurring_commitment (weekly) + review_dashboard (any commitment)
        // + customize_settings (theme) + verify_email = 5 of 6
        XCTAssertEqual(r.completedCount, 5)
        XCTAssertEqual(r.totalCount, 6)
        XCTAssertEqual(r.progress, 5.0 / 6.0, accuracy: 0.0001)
        XCTAssertFalse(r.allComplete)
    }
}
