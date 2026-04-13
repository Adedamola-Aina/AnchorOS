import SwiftUI

struct AnchorCard<Content: View>: View {
    let title: String
    let icon: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .foregroundStyle(AnchorPalette.textPrimary)
                Text(title)
                    .font(.headline)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }
            content
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            LinearGradient(
                colors: [
                    AnchorPalette.card.opacity(0.98),
                    AnchorPalette.card.opacity(0.92)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.18), radius: 16, x: 0, y: 10)
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}
