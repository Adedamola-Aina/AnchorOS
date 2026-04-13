import SwiftUI

struct AnchorAIView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var projectStateStore: ProjectStateStore
    @State private var selectedPrompt: String = "How much did I save?"

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorSectionTabs(labels: ["Brief", "Insights", "Predictions", "Prompts"])

                    AnchorCard(title: "Today's Brief", icon: "sparkles") {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("You're on track this week. Spending velocity is below your 30-day average.")
                                .foregroundStyle(AnchorPalette.textPrimary)
                            Text("Next: review recurring bills before Friday.")
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }

                    AnchorCard(title: "Weekly Snapshot", icon: "chart.line.uptrend.xyaxis") {
                        VStack(alignment: .leading, spacing: 8) {
                            row("Savings trend", savingsTrendValue)
                            row("Critical pressure", "\(projectStateStore.snapshot?.criticalAlerts ?? 0)")
                            row("Commitment momentum", momentumValue)
                        }
                    }

                    AnchorCard(title: "Quick Prompts", icon: "quote.bubble") {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack(spacing: 8) {
                                promptChip("How much did I save?")
                                promptChip("Risk this month")
                            }
                            HStack(spacing: 8) {
                                promptChip("Family spending")
                                promptChip("Upcoming bills")
                            }
                            Text("Selected: \(selectedPrompt)")
                                .font(.footnote)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Anchor")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                await projectStateStore.refresh(for: appState.environment)
            }
        }
    }

    private func row(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .foregroundStyle(AnchorPalette.textPrimary)
                .fontWeight(.semibold)
        }
        .font(.subheadline)
    }

    private var savingsTrendValue: String {
        let completed = projectStateStore.snapshot?.completedThisWeek ?? 0
        return completed > 0 ? "+\(completed)" : "Flat"
    }

    private var momentumValue: String {
        let inProgress = projectStateStore.snapshot?.inProgressCount ?? 0
        return inProgress > 2 ? "Active" : "Stable"
    }

    private func promptChip(_ label: String) -> some View {
        Button {
            selectedPrompt = label
        } label: {
            Text(label)
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
                .padding(.horizontal, 14)
                .padding(.vertical, 10)
                .background(selectedPrompt == label ? AnchorPalette.chipActive : AnchorPalette.chip)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}
