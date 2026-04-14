import SwiftUI

// MARK: - MFARecoveryView
// Allows users to enter a recovery code when they can't access their authenticator.
// Calls recoverMfaWithCode Cloud Function to disable MFA.

struct MFARecoveryView: View {
    @Environment(\.dismiss) private var dismiss

    @State private var email = ""
    @State private var code = ""
    @State private var error: String?
    @State private var isLoading = false
    @State private var result: RecoveryResult?

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                if let result {
                    successView(result)
                } else {
                    inputView
                }
            }
            .padding(24)
            .navigationTitle("Account Recovery")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
        }
    }

    private var inputView: some View {
        VStack(spacing: 20) {
            Image(systemName: "key.fill")
                .font(.system(size: 40))
                .foregroundStyle(AnchorPalette.warning)

            Text("Enter a recovery code")
                .font(AnchorTypography.h2)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("Use one of the backup codes you saved when setting up 2FA.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)

            TextField("Email address", text: $email)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .padding(16)
                .background(AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 12))

            TextField("Recovery code", text: $code)
                .font(.system(.body, design: .monospaced))
                .autocapitalization(.allCharacters)
                .padding(16)
                .background(AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 12))

            if let error {
                Text(error)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.danger)
            }

            Spacer()

            Button { Task { await recover() } } label: {
                HStack {
                    Spacer()
                    if isLoading { ProgressView().tint(.white) }
                    else { Text("Recover Account").fontWeight(.semibold) }
                    Spacer()
                }
                .padding(.vertical, 16)
                .background(formValid ? AnchorPalette.chipActive : AnchorPalette.chip)
                .foregroundStyle(formValid ? .white : AnchorPalette.textSecondary)
                .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
            .disabled(!formValid || isLoading)
        }
    }

    private func successView(_ result: RecoveryResult) -> some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 48))
                .foregroundStyle(AnchorPalette.success)

            Text("MFA Disabled")
                .font(AnchorTypography.h2)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("Two-factor authentication has been removed. You can sign in with your password and re-enable 2FA in Settings.")
                .font(AnchorTypography.body)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)

            Text("\(result.codesRemaining) recovery codes remaining.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.warning)

            Spacer()

            Button { dismiss() } label: {
                Text("Done")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
        }
    }

    private var formValid: Bool {
        !email.isEmpty && code.count >= 6
    }

    private func recover() async {
        isLoading = true; defer { isLoading = false }
        error = nil
        do {
            let res = try await RecoveryCodeService.recoverMFA(email: email, code: code)
            if res.success {
                result = res
            } else {
                error = "Invalid recovery code. Please try again."
            }
        } catch {
            self.error = error.localizedDescription
        }
    }
}
