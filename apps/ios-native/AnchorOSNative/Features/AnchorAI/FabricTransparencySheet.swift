import SwiftUI

/// Trust and explainability sheet for Anchor AI.
struct FabricTransparencySheet: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorCard(title: "How Anchor AI Works", icon: "sparkles") {
                        VStack(alignment: .leading, spacing: 10) {
                            bullet("Uses only your existing accounts, transactions, commitments, and recurring items.")
                            bullet("Predictions are generated on-device from recent patterns and can be dismissed at any time.")
                            bullet("Family insights respect sharing rules and only surface shared data.")
                            bullet("No hidden scoring or dark patterns — recommendations are explainable and optional.")
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("AI Transparency")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() } } }
        }
    }

    private func bullet(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(AnchorPalette.success)
            Text(text)
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textPrimary)
            Spacer()
        }
    }
}
