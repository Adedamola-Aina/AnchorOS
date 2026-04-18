import SwiftUI
import FirebaseFirestore

/// Manage recurring rules with pause/resume toggles.
struct RecurringRulesSheet: View {
    @EnvironmentObject private var recurringStore: AnchorRecurringStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    if recurringStore.recurring.isEmpty {
                        AnchorCard(title: "Recurring Rules", icon: "repeat") {
                            Text("No recurring items yet. Create one from Add Transaction.")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    } else {
                        ForEach(recurringStore.recurring) { rule in
                            AnchorCard(title: rule.title, icon: "repeat") {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(rule.frequency.capitalized)
                                            .font(.caption)
                                            .foregroundStyle(AnchorPalette.textSecondary)
                                        Text(rule.status.capitalized)
                                            .font(.caption2)
                                            .foregroundStyle(rule.isActive ? AnchorPalette.success : AnchorPalette.warning)
                                    }
                                    Spacer()
                                    Button(rule.isActive ? "Pause" : "Resume") {
                                        Task {
                                            await recurringStore.updateStatus(
                                                recurringId: rule.resolvedId,
                                                status: rule.isActive ? "paused" : "active"
                                            )
                                        }
                                    }
                                    .buttonStyle(.borderedProminent)
                                    .tint(rule.isActive ? AnchorPalette.warning : AnchorPalette.success)
                                }
                            }
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Recurring")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() } } }
        }
    }
}
