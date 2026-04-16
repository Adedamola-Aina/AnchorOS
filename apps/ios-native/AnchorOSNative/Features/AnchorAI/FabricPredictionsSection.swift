import SwiftUI

/// Mirrors src/features/fabric/FabricPredictionsSection.tsx.
///
/// Renders the "Alerts" section of Anchor AI: an amber-tinted list of
/// predictions with message, optional detail, a primary action button
/// (routing to /commitments or /finance), and a Dismiss affordance.
/// Hidden entirely when there are no predictions.
struct FabricPredictionsSection: View {
    let predictions: [AnchorPrediction]
    let onAction: (AnchorPrediction) -> Void
    let onDismiss: (AnchorPrediction) -> Void

    var body: some View {
        if !predictions.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("ALERTS")
                    .font(.caption2)
                    .fontWeight(.bold)
                    .kerning(1.1)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(.horizontal, 4)

                VStack(spacing: 8) {
                    ForEach(predictions) { p in
                        card(for: p)
                    }
                }
            }
        }
    }

    private func card(for p: AnchorPrediction) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(p.message)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundStyle(AnchorPalette.textPrimary)
                .fixedSize(horizontal: false, vertical: true)

            if !p.detail.isEmpty {
                Text(p.detail)
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            HStack(spacing: 8) {
                if let action = p.action {
                    Button {
                        onAction(p)
                    } label: {
                        Text(action.label)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundStyle(.white)
                            .frame(minHeight: 44)
                            .padding(.horizontal, 16)
                            .background(AnchorPalette.chipActive)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                    .accessibilityLabel(action.label)
                }

                Button {
                    onDismiss(p)
                } label: {
                    Text("Dismiss")
                        .font(.subheadline)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .frame(minHeight: 44)
                        .padding(.horizontal, 12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                        )
                }
                .accessibilityLabel("Dismiss prediction")
            }
        }
        .padding(16)
        .background(AnchorPalette.warning.opacity(0.08))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(AnchorPalette.warning.opacity(0.35), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
