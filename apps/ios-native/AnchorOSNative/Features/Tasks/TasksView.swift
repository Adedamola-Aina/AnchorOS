import SwiftUI

struct TasksView: View {
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
            .background(AnchorPalette.background.ignoresSafeArea())
            .navigationTitle("Tasks")
            .navigationBarTitleDisplayMode(.inline)
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
                    Text("2 of 4 completed")
                        .foregroundStyle(AnchorPalette.textPrimary)
                        .fontWeight(.semibold)
                    Text("Solid consistency this week.")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.footnote)
                }
                Spacer()
                Text("50%")
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
}

private struct TaskItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let completed: Bool
    let category: String
}
