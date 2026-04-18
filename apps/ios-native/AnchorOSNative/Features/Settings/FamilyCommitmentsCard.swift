import SwiftUI

/// Shared household commitments summary.
/// Shows the current family-scoped tasks so the Family section has a clear,
/// dedicated place for collaborative commitments.
struct FamilyCommitmentsCard: View {
    @EnvironmentObject private var commitmentsStore: CommitmentsStore

    private var familyTasks: [AnchorCommitment] {
        commitmentsStore.commitments.filter { $0.isFamilyShared }
    }

    var body: some View {
        AnchorCard(title: "Family Commitments", icon: "checklist") {
            if familyTasks.isEmpty {
                Text("No shared commitments yet. Create one in Tasks and choose the Family scope.")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            } else {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(familyTasks.prefix(4)) { task in
                        HStack(spacing: 10) {
                            Image(systemName: task.completed ? "checkmark.circle.fill" : task.priorityIcon)
                                .foregroundStyle(task.completed ? AnchorPalette.success : task.priorityColor)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(task.title)
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                Text(task.typeLabel)
                                    .font(.caption2)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                            }
                            Spacer()
                        }
                    }
                }
            }
        }
    }
}
