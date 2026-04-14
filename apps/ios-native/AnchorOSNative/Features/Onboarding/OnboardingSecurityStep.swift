import SwiftUI

// MARK: - OnboardingSecurityStep
// Step 4 (optional): Email verification + MFA prompt.
// Matches PWA's account notification badges.

struct OnboardingSecurityStep: View {
    @EnvironmentObject private var appState: AppState
    @State private var verificationSent = false
    @State private var showMFA = false

    let onComplete: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            stepHeader

            // Email verification
            emailVerificationCard

            // MFA prompt
            mfaCard

            Spacer()

            // Skip / Continue
            VStack(spacing: 12) {
                Button(action: onComplete) {
                    Text("Continue")
                        .fontWeight(.semibold)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(AnchorPalette.chipActive)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)

                Button("Skip for now", action: onComplete)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
        }
        .sheet(isPresented: $showMFA) {
            MFAEnrollmentView()
        }
    }

    // MARK: - Header

    private var stepHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("STEP 04")
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.chipActive)
            Text("Secure your account")
                .font(.title3).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text("Real people's financial data deserves real protection.")
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
    }

    // MARK: - Email Verification Card

    private var emailVerificationCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Image(systemName: AuthService.shared.isEmailVerified
                      ? "checkmark.circle.fill" : "envelope.badge")
                    .foregroundStyle(AuthService.shared.isEmailVerified
                                     ? AnchorPalette.success : AnchorPalette.warning)
                    .font(.title3)
                Text("Verify your email")
                    .font(AnchorTypography.h3)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }

            if AuthService.shared.isEmailVerified {
                Text("Email verified.")
                    .font(AnchorTypography.small)
                    .foregroundStyle(AnchorPalette.success)
            } else if verificationSent {
                Text("Verification email sent. Check your inbox.")
                    .font(AnchorTypography.small)
                    .foregroundStyle(AnchorPalette.textSecondary)
            } else {
                Button {
                    Task {
                        try? await AuthService.shared.sendEmailVerification()
                        verificationSent = true
                    }
                } label: {
                    Text("Send verification email")
                        .font(AnchorTypography.small)
                        .foregroundStyle(AnchorPalette.chipActive)
                }
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
    }

    // MARK: - MFA Card

    private var mfaCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 10) {
                Image(systemName: AuthService.shared.isMFAEnrolled
                      ? "checkmark.shield.fill" : "lock.shield")
                    .foregroundStyle(AuthService.shared.isMFAEnrolled
                                     ? AnchorPalette.success : AnchorPalette.primary)
                    .font(.title3)
                Text("Two-factor authentication")
                    .font(AnchorTypography.h3)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }

            if AuthService.shared.isMFAEnrolled {
                Text("2FA is enabled.")
                    .font(AnchorTypography.small)
                    .foregroundStyle(AnchorPalette.success)
            } else {
                Text("Add a second layer of security with an authenticator app.")
                    .font(AnchorTypography.small)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Button { showMFA = true } label: {
                    Text("Set up 2FA")
                        .font(AnchorTypography.small)
                        .foregroundStyle(AnchorPalette.chipActive)
                }
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
    }
}
