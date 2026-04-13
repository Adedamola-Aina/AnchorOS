import SwiftUI

struct AnchorChip: View {
    let label: String

    var body: some View {
        Text(label)
            .font(.subheadline)
            .foregroundStyle(AnchorPalette.textSecondary)
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(AnchorPalette.chip)
            .clipShape(Capsule())
    }
}

