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
        .background(AnchorPalette.card)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

