import SwiftUI

// MARK: - MFAEnrollmentView
// TOTP enrollment flow matching PWA MFA settings section.
// Accessed from Settings → Security → Two-Factor Authentication.
// Steps: intro → scan QR → verify code → show recovery codes → done

struct MFAEnrollmentView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var step: MFAStep = .intro
    @State private var qrURL = ""
    @State private var totpSecret: TOTPSecret?
    @State private var code = ""
    @State private var error: String?
    @State private var isLoading = false
    @State private var recoveryCodes: [String]?

    enum MFAStep { case intro, scan, verify, recoveryCodes, done }

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                switch step {
                case .intro:         introStep
                case .scan:          scanStep
                case .verify:        verifyStep
                case .recoveryCodes: recoveryStep
                case .done:          doneStep
                }
            }
            .padding(24)
            .navigationTitle("Two-Factor Auth")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
        }
    }

    // MARK: - Steps

    private var introStep: some View {
        VStack(spacing: 20) {
            Image(systemName: "lock.shield.fill")
                .font(.system(size: 48))
                .foregroundStyle(AnchorPalette.primary)
                .anchorBob()

            Text("Add Extra Security")
                .font(AnchorTypography.h2)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("Use an authenticator app (like Google Authenticator or 1Password) to add a second layer of protection.")
                .font(AnchorTypography.body)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)

            Spacer()

            actionButton("Set Up 2FA", loading: isLoading) {
                await startEnrollment()
            }
        }
    }

    private var scanStep: some View {
        VStack(spacing: 20) {
            Text("Scan QR Code")
                .font(AnchorTypography.h3)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("Open your authenticator app and scan this code, or copy the URL manually.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)

            qrCodeImage

            Button {
                UIPasteboard.general.string = qrURL
            } label: {
                Label("Copy Setup URL", systemImage: "doc.on.doc")
                    .font(AnchorTypography.small)
                    .foregroundStyle(AnchorPalette.chipActive)
            }

            Spacer()

            actionButton("Next: Enter Code", loading: false) {
                step = .verify
            }
        }
    }

    private var verifyStep: some View {
        VStack(spacing: 20) {
            Text("Enter Verification Code")
                .font(AnchorTypography.h3)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("Enter the 6-digit code from your authenticator app.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)

            TextField("000000", text: $code)
                .keyboardType(.numberPad)
                .font(.system(size: 32, weight: .bold, design: .monospaced))
                .multilineTextAlignment(.center)
                .padding(16)
                .background(AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 12))

            if let error {
                Text(error)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.danger)
            }

            Spacer()

            actionButton("Verify & Enable", loading: isLoading, disabled: code.count < 6) {
                await finalize()
            }
        }
    }

    private var recoveryStep: some View {
        Group {
            if let codes = recoveryCodes {
                RecoveryCodesView(codes: codes) {
                    step = .done
                }
            }
        }
    }

    private var doneStep: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.shield.fill")
                .font(.system(size: 48))
                .foregroundStyle(AnchorPalette.success)

            Text("2FA Enabled")
                .font(AnchorTypography.h2)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("Your account is now protected with two-factor authentication and backup recovery codes.")
                .font(AnchorTypography.body)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)

            Spacer()

            actionButton("Done", loading: false) { dismiss() }
        }
    }
}
