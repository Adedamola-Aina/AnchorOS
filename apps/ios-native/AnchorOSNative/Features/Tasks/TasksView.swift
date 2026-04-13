import SwiftUI

struct TasksView: View {
    private let tasks: [TaskItem] = [
        .init(title: "Morning review", subtitle: "Daily • 07:00", completed: true),
        .init(title: "Budget check", subtitle: "Daily • 19:00", completed: false),
        .init(title: "Family sync", subtitle: "Weekly • Sunday", completed: false)
    ]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
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
                                    }
                                    Spacer()
                                }
                            }
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorPalette.background.ignoresSafeArea())
            .navigationTitle("Tasks")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

private struct TaskItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let completed: Bool
}

