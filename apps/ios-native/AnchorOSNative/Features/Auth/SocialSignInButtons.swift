import SwiftUI
import AuthenticationServices

// MARK: - SocialSignInButtons
// Google + Apple OAuth matching PWA SocialSignInButtons.tsx.
// 44px minimum height per Apple HIG / ARCH-004.

struct SocialSignInButtons: View {
    let onAppleSignIn: () -> Void
    let onGoogleSignIn: () -> Void
    var isLoading = false

    var body: some View {
        VStack(spacing: 12) {
            dividerRow

            // Apple Sign-In
            Button(action: onAppleSignIn) {
                HStack(spacing: 10) {
                    Image(systemName: "apple.logo")
                        .font(.system(size: 18, weight: .semibold))
                    Text("Continue with Apple")
                        .font(AnchorTypography.small)
                }
                .frame(maxWidth: .infinity)
                .frame(minHeight: 44)
                .foregroundStyle(AnchorPalette.textPrimary)
                .background(AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .buttonStyle(.plain)
            .disabled(isLoading)

            // Google Sign-In
            Button(action: onGoogleSignIn) {
                HStack(spacing: 10) {
                    googleIcon
                    Text("Continue with Google")
                        .font(AnchorTypography.small)
                }
                .frame(maxWidth: .infinity)
                .frame(minHeight: 44)
                .foregroundStyle(AnchorPalette.textPrimary)
                .background(AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .buttonStyle(.plain)
            .disabled(isLoading)
        }
    }

    private var dividerRow: some View {
        HStack(spacing: 12) {
            Rectangle()
                .fill(AnchorPalette.border)
                .frame(height: 1)
            Text("or")
                .font(AnchorTypography.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
            Rectangle()
                .fill(AnchorPalette.border)
                .frame(height: 1)
        }
    }

    private var googleIcon: some View {
        // SF Symbols doesn't have a Google icon; using a letter G circle
        ZStack {
            Circle()
                .fill(Color.white)
                .frame(width: 20, height: 20)
            Text("G")
                .font(.system(size: 13, weight: .bold, design: .rounded))
                .foregroundStyle(Color(hex: 0x4285F4))
        }
    }
}
