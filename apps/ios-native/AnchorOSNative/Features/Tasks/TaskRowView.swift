import SwiftUI
import UIKit

/// Single task row extracted from TasksView (ARCH-001).
/// Now surfaces streak milestone/nudge copy to match PWA TaskItem parity
/// (src/features/commitments/components/TaskItem.tsx + streakUtils).
struct TaskRowView: View {
    let task: AnchorCommitment
    let onToggle: () -> Void
    let onTap: () -> Void

    /// Drives the `completionPop` micro-motion (src/animations/microInteractions.ts).
    /// Set true on a tap that completes the task, cleared 0.5s later — matches the
    /// PWA TaskItem `isAnimating` handshake + 500ms timeout.
    @State private var isAnimating: Bool = false

    var body: some View {
        HStack(spacing: 12) {
            Button(action: handleToggle) {
                Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(task.completed ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
                    .completionPop(trigger: isAnimating)
            }
            .buttonStyle(.plain)
            .disabled(isAnimating)

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
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(AnchorPalette.warning.opacity(0.15))
                        .clipShape(Capsule())
                        .fadeInOnAppear(duration: 0.5)
                        .id("streak-\(streak)-milestone")
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

    /// Mirrors PWA TaskItem.handleToggle — animates the checkbox pop + haptic
    /// only when transitioning incomplete → complete; unchecking is silent.
    private func handleToggle() {
        if !task.completed {
            isAnimating = true
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            onToggle()
            if (task.domain ?? "").lowercased() == "financial" {
                ToastStore.shared.show("Financial task done — you can log the matching transaction in Finance", style: .info)
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                isAnimating = false
            }
        } else {
            onToggle()
        }
    }
}
