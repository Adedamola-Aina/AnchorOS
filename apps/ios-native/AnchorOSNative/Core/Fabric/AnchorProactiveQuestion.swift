import Foundation

/// Parity with PWA src/types/fabric.ts ProactiveQuestionType + Card props.
struct AnchorProactiveQuestion: Equatable {
    enum Kind: String, Equatable, CaseIterable {
        case missedHabit     = "missed_habit"
        case completionDrop  = "completion_drop"
        case categorySpike   = "category_spike"
        case surplusIdle     = "surplus_idle"
    }
    let question: String
    let kind: Kind
}
