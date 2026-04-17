import SwiftUI

struct AnchorChip: View {
    let label: String
    var isActive: Bool = false

    var body: some View {
        Text(label)
            .font(.subheadline)
            .foregroundStyle(isActive ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(isActive ? AnchorPalette.chipActive : AnchorPalette.chip)
            .clipShape(Capsule())
    }
}

