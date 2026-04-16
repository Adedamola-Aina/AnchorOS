import Foundation
@testable import AnchorOSNative

/// Shared fixture builders for Predictions test suites.
enum AnchorPredictionsFixtures {

    static func pattern(
        id: String = "p1",
        triggerKind: AnchorUserPattern.TriggerKind,
        hour: Int? = nil,
        category: String? = nil,
        commitmentId: String? = nil,
        actionKind: AnchorUserPattern.ActionKind,
        actionCategory: String? = nil,
        confidence: Double = 0.8
    ) -> AnchorUserPattern {
        AnchorUserPattern(
            id: id, triggerKind: triggerKind,
            triggerHour: hour, triggerCategory: category,
            triggerCommitmentId: commitmentId,
            actionKind: actionKind,
            actionCategory: actionCategory,
            actionCommitmentId: nil,
            frequency: 5, confidence: confidence,
            lastOccurred: "2026-03-01T00:00:00Z"
        )
    }

    static func tx(
        _ amount: Int, _ category: String = "Food",
        date: String, type: String = "expense"
    ) -> AnchorTransaction {
        AnchorTransaction(
            id: UUID().uuidString, title: "t", amountCents: amount,
            type: type, category: category, accountId: nil, accountName: nil,
            currency: "USD", date: date, isSoftDeleted: false
        )
    }

    static func daily(
        id: String, title: String = "Walk",
        completed: Bool = false, streak: Int? = 3
    ) -> AnchorCommitment {
        AnchorCommitment(
            id: id, title: title, type: "daily", completed: completed,
            category: nil, domain: nil, timeOfDay: nil, notes: nil,
            currentStreak: streak, longestStreak: streak,
            lastCompletedAt: nil, priority: nil
        )
    }
}
