import SwiftUI

/// Reusable graceful error/empty state card for all main views.
/// Shows when data fails to load after timeout or on explicit error.
struct AnchorErrorBanner: View {
    let message: String
    let retryLabel: String
    let onRetry: (() -> Void)?

    init(message: String = "Couldn't load data. Check your connection.", retryLabel: String = "Retry", onRetry: (() -> Void)? = nil) {
        self.message = message
        self.retryLabel = retryLabel
        self.onRetry = onRetry
    }

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "wifi.slash")
                .font(.largeTitle)
                .foregroundStyle(AnchorPalette.textSecondary)
            Text(message)
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
            if let onRetry {
                Button(retryLabel) { onRetry() }
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(AnchorPalette.chipActive)
            }
        }
        .padding(24)
        .frame(maxWidth: .infinity)
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
    }
}
