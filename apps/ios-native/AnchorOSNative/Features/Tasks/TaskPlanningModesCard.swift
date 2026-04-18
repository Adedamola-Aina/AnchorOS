import SwiftUI

/// Lightweight alternate planner views for Tasks parity.
/// Gives users list, week, month, and timeline perspectives in the native app.
struct TaskPlanningModesCard: View {
    @Binding var mode: String
    let tasks: [AnchorCommitment]

    private let modes = ["List", "Week", "Month", "Timeline"]

    var body: some View {
        AnchorCard(title: "View", icon: "calendar") {
            VStack(spacing: 12) {
                Picker("View", selection: $mode) {
                    ForEach(modes, id: \.self) { Text($0).tag($0) }
                }
                .pickerStyle(.segmented)

                if mode != "List" {
                    content
                }
            }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch mode {
        case "Week": weekView
        case "Month": monthView
        default: timelineView
        }
    }

    private var weekView: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("This Week")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
            HStack(spacing: 8) {
                statPill("Daily", count: tasks.filter { $0.type == "daily" && !$0.completed }.count)
                statPill("Weekly", count: tasks.filter { $0.type == "weekly" && !$0.completed }.count)
                statPill("Todo", count: tasks.filter { $0.type == "todo" && !$0.completed }.count)
            }
        }
    }

    private var monthView: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Monthly Snapshot")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
            HStack(spacing: 8) {
                statPill("Active", count: tasks.filter { !$0.completed }.count)
                statPill("Done", count: tasks.filter { $0.completed }.count)
                statPill("Shared", count: tasks.filter { $0.isFamilyShared }.count)
            }
        }
    }

    private var timelineView: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Timeline")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
            ForEach(tasks.prefix(4)) { task in
                HStack(spacing: 8) {
                    Circle()
                        .fill(task.completed ? AnchorPalette.success : task.priorityColor)
                        .frame(width: 8, height: 8)
                    Text(task.title)
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Spacer()
                    Text(task.typeLabel)
                        .font(.caption2)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
        }
    }

    private func statPill(_ title: String, count: Int) -> some View {
        VStack(spacing: 2) {
            Text("\(count)")
                .font(.headline)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text(title)
                .font(.caption2)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .background(AnchorPalette.chip.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
