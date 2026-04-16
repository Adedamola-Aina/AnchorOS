import SwiftUI

/// Mirrors src/features/fabric/FabricProactiveQuestionCard.tsx.
///
/// Primary-tinted card with a "?" badge, question text, and Dismiss pill.
/// Tap-to-answer routes to NLP query (not yet wired natively — Phase 4e);
/// for now the tap falls back to dismiss so the card doesn't linger.
struct FabricProactiveQuestionCard: View {
    let question: AnchorProactiveQuestion
    let onTap: (AnchorProactiveQuestion) -> Void
    let onDismiss: (AnchorProactiveQuestion) -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Button { onTap(question) } label: {
                HStack(alignment: .top, spacing: 10) {
                    Text("?")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundStyle(AnchorPalette.primary)
                        .frame(width: 22, height: 22)
                        .background(AnchorPalette.primary.opacity(0.15))
                        .clipShape(Circle())

                    Text(question.question)
                        .font(.subheadline)
                        .foregroundStyle(AnchorPalette.textPrimary)
                        .multilineTextAlignment(.leading)
                        .fixedSize(horizontal: false, vertical: true)

                    Spacer(minLength: 0)
                }
                .frame(minHeight: 44)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(question.question)

            Button { onDismiss(question) } label: {
                Text("Dismiss")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(.horizontal, 10)
                    .frame(minHeight: 44)
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                    )
            }
            .accessibilityLabel("Dismiss question")
        }
        .padding(14)
        .background(AnchorPalette.card.opacity(0.7))
        .overlay(
            HStack(spacing: 0) {
                Rectangle()
                    .fill(AnchorPalette.primary)
                    .frame(width: 4)
                Spacer()
            }
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
