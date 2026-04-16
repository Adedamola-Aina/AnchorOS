import SwiftUI

/// Single task row extracted from TasksView (ARCH-001).
/// Now surfaces streak milestone/nudge copy to match PWA TaskItem parity
/// (src/features/commitments/components/TaskItem.tsx + streakUtils).
struct TaskRowView: View {
    let task: AnchorCommitment
    let onToggle: () -> Void
    let onTap: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            Button(action: onToggle) {
                Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(task.completed ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 3) {
                Text(task.title)
                    .foregroundStyle(task.completed ? AnchorPalette.textSecondary : AnchorPalette.textPrimary)
                    .fontWeight(.semibold)
                    .strikethrough(task.completed, color: AnchorPalette.textSecondary)

                chipRow

                if let nudge = streakNudge {
                    Text(nudge)
                        .font(.caption2)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
            .onTapGesture(perform: onTap)
            Spacer(minLength: 0)
        }
    }

    private var chipRow: some View {
        HStack(spacing: 6) {
            Text(task.typeLabel)
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
                .padding(.horizontal, 8).padding(.vertical, 3)
                .background(AnchorPalette.chip)
                .clipShape(Capsule())

            if let domain = task.domainLabel {
                Text(domain)
                    .font(.caption2).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.chipActive)
                    .padding(.horizontal, 8).padding(.vertical, 3)
                    .background(AnchorPalette.chipActive.opacity(0.15))
                    .clipShape(Capsule())
            }

            if let streak = task.currentStreak, streak > 1 {
                if let milestone = StreakCalculator.milestone(for: streak) {
                    Label("\(streak) \(milestone.emoji)", systemImage: "flame.fill")
                        .font(.caption2).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.warning)
                } else {
                    Label("\(streak)", systemImage: "flame.fill")
                        .font(.caption2).fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.warning)
                }
            }

            if let p = task.priority, p != "low" {
                Image(systemName: task.priorityIcon)
                    .font(.caption2).fontWeight(.bold)
                    .foregroundStyle(task.priorityColor)
            }
        }
    }

    private var streakNudge: String? {
        guard !task.completed else { return nil }
        let current = task.currentStreak ?? 0
        let longest = task.longestStreak ?? 0
        return StreakCalculator.nudge(currentStreak: current, longestStreak: longest)
    }
}
