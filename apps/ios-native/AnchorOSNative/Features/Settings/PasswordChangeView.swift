import SwiftUI

// MARK: - PasswordChangeView
// Allows signed-in user to change their password.
// Requires reauthentication first (SEC-008 pattern).
// Matches PWA PasswordChange.tsx.

struct PasswordChangeView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var currentPassword = ""
    @State private var newPassword = ""
    @State private var confirmPassword = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var didSucceed = false
    @State private var showPasswords = false

    private var canSubmit: Bool {
        currentPassword.count >= 6 &&
        newPassword.count >= 8 &&
        newPassword == confirmPassword
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Icon
                    Image(systemName: "lock.rotation")
                        .font(.system(size: 44))
                        .foregroundStyle(AnchorPalette.chipActive)
                        .padding(.top, 8)

                    Text("Change your password")
                        .font(AnchorTypography.h3)
                        .foregroundStyle(AnchorPalette.textPrimary)

                    if didSucceed {
                        successBanner
                    } else {
                        formSection
                    }
                }
                .padding(24)
            }
            .background(AnchorBackground())
            .navigationTitle("Change Password")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
        }
    }

    // MARK: — Form

    private var formSection: some View {
        VStack(spacing: 14) {
            secureField("Current password", text: $currentPassword, icon: "lock")
            secureField("New password (min 8 chars)", text: $newPassword, icon: "lock.open")
            if !newPassword.isEmpty {
                PasswordStrengthMeter(password: newPassword)
            }
            secureField("Confirm new password", text: $confirmPassword, icon: "checkmark.shield")

            if let error = errorMessage {
                Text(error)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.danger)
                    .multilineTextAlignment(.center)
            }

            Button {
                Task { await changePassword() }
            } label: {
                HStack {
                    Spacer()
                    if isLoading { ProgressView().tint(.white) }
                    else { Text("Update Password").fontWeight(.semibold) }
                    Spacer()
                }
                .padding(.vertical, 16)
                .background(canSubmit ? AnchorPalette.chipActive : AnchorPalette.chip)
                .foregroundStyle(canSubmit ? .white : AnchorPalette.textSecondary)
                .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
            .disabled(!canSubmit || isLoading)
        }
    }

    // MARK: — Success

    private var successBanner: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 48))
                .foregroundStyle(AnchorPalette.success)
            Text("Password updated successfully.")
                .font(AnchorTypography.body)
                .foregroundStyle(AnchorPalette.textPrimary)
                .multilineTextAlignment(.center)
            Button("Done") { dismiss() }
                .fontWeight(.semibold)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(AnchorPalette.chipActive)
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .buttonStyle(.plain)
        }
    }

    // MARK: — Action

    private func changePassword() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            // Reauthenticate first (SEC-008)
            try await appState.reauthenticate(password: currentPassword)
            // Update password via Firebase
            guard let user = AuthService.shared.currentUser else { return }
            try await user.updatePassword(to: newPassword)
            didSucceed = true
            ToastStore.shared.show("Password updated", style: .success)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: — Field Builder

    private func secureField(_ placeholder: String, text: Binding<String>, icon: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(width: 20)
            // Parity: PWA PasswordChange eye toggle — @State showPasswords
            // swaps SecureField ⇄ TextField across all three password fields.
            if showPasswords {
                TextField(placeholder, text: text)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .autocorrectionDisabled()
                    .autocapitalization(.none)
            } else {
                SecureField(placeholder, text: text)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .autocorrectionDisabled()
            }
            Button {
                showPasswords.toggle()
            } label: {
                Image(systemName: showPasswords ? "eye.slash" : "eye")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .frame(width: 44, height: 44) // 44pt touch target
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(showPasswords ? "Hide password" : "Show password")
        }
        .padding(.leading, 14)
        .padding(.trailing, 4)
        .padding(.vertical, 4)
        .background(AnchorPalette.chip)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
