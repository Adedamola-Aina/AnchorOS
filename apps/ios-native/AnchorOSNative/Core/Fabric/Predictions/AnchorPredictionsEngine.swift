import Foundation

/// Top-level Predictions engine — mirrors src/services/fabric/PredictionsEngine.ts.
/// Phase 4b-1: only anomaly signals are wired. Remaining signal modules
/// (budget, behavior, goal, pattern) land in Phase 4b-2…4b-5.
/// Contract: deterministic output sorted by confidence desc, capped at 5.
enum AnchorPredictionsEngine {

    static let maxPredictions: Int = 5

    struct Input {
        let transactions: [AnchorTransaction]
        let commitments: [AnchorCommitment]
        let goals: [AnchorGoal]
        let patterns: [AnchorUserPattern]
        let now: Date
    }

    static func build(_ input: Input) -> [AnchorPrediction] {
        let anomaly = AnchorAnomalySignals.build(
            transactions: input.transactions,
            now: input.now
        )
        let budget = AnchorBudgetSignals.build(
            transactions: input.transactions,
            now: input.now
        )
        let behavior = AnchorBehaviorSignals.build(
            transactions: input.transactions,
            commitments: input.commitments,
            now: input.now
        )
        let goal = AnchorGoalSignals.build(
            goals: input.goals,
            transactions: input.transactions,
            now: input.now
        )
        let pattern = AnchorPatternSignals.build(
            patterns: input.patterns,
            transactions: input.transactions,
            commitments: input.commitments,
            now: input.now
        )
        let recurring = AnchorPatternSignals.buildRecurringDue(
            patterns: input.patterns,
            now: input.now
        )
        let all = anomaly + budget + behavior + goal + pattern + recurring
        return all.sorted { $0.confidence > $1.confidence }
            .prefix(maxPredictions)
            .map { $0 }
    }
}
