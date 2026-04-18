import Foundation

/// WS-7 — `query_streak` intent handler. Finishes the 18/18 Fabric query
/// surface previously flagged as deferred in docs/NATIVE_PARITY_AUDIT.md §6.3.
///
/// Contract:
///   - Returns top 3 current streaks + longest streak ever seen.
///   - Falls back to `StreakCalculator.nudge(...)` copy when no active streak.
///   - Pure over commitments; no Firestore calls.
extension AnchorQueryEngine {
    static func streakSummary(_ i: Input) -> AnchorFabricQueryResult {
        let scored = i.commitments.compactMap { c -> (name: String, current: Int, longest: Int)? in
            let cur = c.currentStreak ?? 0
            let long = c.longestStreak ?? 0
            if cur == 0 && long == 0 { return nil }
            return (c.title, cur, long)
        }

        guard !scored.isEmpty else {
            return .init(
                summary: "No active streaks yet — complete a daily task to start one today.",
                actions: [.init(label: "Open Tasks", kind: .navigate(page: "commitments"))]
            )
        }

        let top = scored.sorted { $0.current > $1.current }.prefix(3)
        let longestPair = scored.max(by: { $0.longest < $1.longest })

        var lines: [String] = top.map { "\($0.name): \($0.current)-day streak" }
        if let longest = longestPair, longest.longest > 0 {
            lines.append("Longest streak ever: \(longest.longest) days (\(longest.name)).")
        }

        let summary = lines.joined(separator: " · ")
        let bestCurrent = top.first.map { $0.current } ?? 0
        let bestLongest = longestPair.map { $0.longest } ?? 0
        let nudge = StreakCalculator.nudge(currentStreak: bestCurrent, longestStreak: bestLongest)

        return .init(
            summary: summary,
            detail: nudge,
            actions: [.init(label: "Open Tasks", kind: .navigate(page: "commitments"))]
        )
    }
}
