import Foundation

/// Pure streak math mirroring src/features/commitments/utils/streakUtils.ts.
/// Parity contract: for any (currentStreak, longestStreak) the milestone and
/// nudge strings must exactly match the PWA helpers. No Firestore, no state.
enum StreakCalculator {

    struct Milestone: Equatable {
        let days: Int
        let emoji: String
        let label: String
    }

    /// Ordered lowest → highest (matches PWA MILESTONES order).
    static let milestones: [Milestone] = [
        .init(days: 3,   emoji: "🌱", label: "Getting started!"),
        .init(days: 7,   emoji: "⭐", label: "1 week strong!"),
        .init(days: 14,  emoji: "🔥", label: "2 weeks!"),
        .init(days: 21,  emoji: "💪", label: "21-day habit!"),
        .init(days: 30,  emoji: "🏆", label: "1 month!"),
        .init(days: 60,  emoji: "💎", label: "2 months!"),
        .init(days: 90,  emoji: "👑", label: "90-day master!"),
        .init(days: 180, emoji: "🌟", label: "6 months!"),
        .init(days: 365, emoji: "🎯", label: "1 year!"),
    ]

    /// Exact-match milestone (nil if streak doesn't land on a milestone day).
    /// PWA: `getStreakMilestone(streak)`
    static func milestone(for streak: Int) -> Milestone? {
        milestones.first { $0.days == streak }
    }

    /// Encouragement copy given a (current, longest) pair.
    /// PWA: `getStreakNudge(currentStreak, longestStreak)`
    /// Returns nil when there is nothing useful to say (both zero).
    static func nudge(currentStreak: Int, longestStreak: Int) -> String? {
        if currentStreak == 0 && longestStreak == 0 { return nil }

        if currentStreak == 0 && longestStreak > 0 {
            return "Your best was \(longestStreak) days — you can get back there!"
        }

        if let next = milestones.first(where: { $0.days > currentStreak }) {
            let remaining = next.days - currentStreak
            let daysWord = remaining == 1 ? "day" : "days"
            return "\(remaining) more \(daysWord) to \(next.emoji) \(next.label)"
        }

        return "Incredible \(currentStreak)-day streak! Keep it going!"
    }
}
