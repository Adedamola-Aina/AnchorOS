import SwiftUI

struct TasksView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @State private var scope: String = "Today"

    private let tasks: [TaskItem] = [
        .init(title: "Morning review", subtitle: "07:00 • Daily", completed: true, category: "Routine"),
        .init(title: "Budget check", subtitle: "19:00 • Daily", completed: false, category: "Finance"),
        .init(title: "Family sync", subtitle: "Sunday • Weekly", completed: false, category: "Family"),
        .init(title: "Workout", subtitle: "18:30 • Daily", completed: true, category: "Health")
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorSectionTabs(labels: ["Today", "Week", "Month", "Habits", "Calendar"])

                    progressCard

                    AnchorCard(title: "Commitments", icon: "checkmark.circle") {
                        VStack(alignment: .leading, spacing: 12) {
                            ForEach(tasks) { task in
                                HStack(spacing: 12) {
                                    Image(systemName: task.completed ? "checkmark.circle.fill" : "circle")
                                        .foregroundStyle(task.completed ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(task.title)
                                            .foregroundStyle(AnchorPalette.textPrimary)
                                            .fontWeight(.semibold)
                                        Text(task.subtitle)
                                            .foregroundStyle(AnchorPalette.textSecondary)
                                            .font(.caption)
                                        Text(task.category.uppercased())
                                            .font(.caption2)
                                            .fontWeight(.bold)
                                            .foregroundStyle(AnchorPalette.textSecondary)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(AnchorPalette.chip)
                                            .clipShape(Capsule())
                                    }
                                    Spacer()
                                }
                            }
                        }
                    }

                    upcomingCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Tasks")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await projectStateStore.refresh(for: appState.environment)
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Picker("Scope", selection: $scope) {
                        Text("Today").tag("Today")
                        Text("Week").tag("Week")
                        Text("Month").tag("Month")
                    }
                    .pickerStyle(.menu)
                }
            }
        }
    }

    private var progressCard: some View {
        AnchorCard(title: "Progress", icon: "chart.bar") {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(projectStateStore.snapshot?.completedThisWeek ?? 0) completed this week")
                        .foregroundStyle(AnchorPalette.textPrimary)
                        .fontWeight(.semibold)
                    Text(progressSubtitle)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.footnote)
                }
                Spacer()
                Text(progressValue)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .font(.title3)
                    .fontWeight(.bold)
            }
        }
    }

    private var upcomingCard: some View {
        AnchorCard(title: "Upcoming", icon: "calendar") {
            VStack(alignment: .leading, spacing: 10) {
                Text("Tomorrow • Pay electricity bill")
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text("Friday • Review weekly spending")
                    .foregroundStyle(AnchorPalette.textSecondary)
                Text("Sunday • Family planning check-in")
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            .font(.subheadline)
        }
    }

    private var progressSubtitle: String {
        let inProgress = projectStateStore.snapshot?.inProgressCount ?? 0
        return inProgress == 0 ? "Nothing currently blocked." : "\(inProgress) active work items remain."
    }

    private var progressValue: String {
        let completed = projectStateStore.snapshot?.completedThisWeek ?? 0
        let total = completed + max(projectStateStore.snapshot?.inProgressCount ?? 0, 1)
        let percentage = Int((Double(completed) / Double(total)) * 100)
        return "\(percentage)%"
    }
}

private struct TaskItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let completed: Bool
    let category: String
}
