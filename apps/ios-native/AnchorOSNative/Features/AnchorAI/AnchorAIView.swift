import SwiftUI

struct AnchorAIView: View {
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
                            row("Savings trend", "+12.4%")
                            row("Budget drift", "-3.1%")
                            row("Commitment momentum", "Stable")
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
            .background(AnchorPalette.background.ignoresSafeArea())
            .navigationTitle("Anchor")
            .navigationBarTitleDisplayMode(.inline)
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
