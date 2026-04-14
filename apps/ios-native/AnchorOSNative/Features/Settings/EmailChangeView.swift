import SwiftUI

// MARK: - EmailChangeView
// Sends verification link to new email before updating.
// Uses Firebase sendEmailVerification(beforeUpdatingEmail:).
// Matches PWA EmailChangeForm.tsx.

struct EmailChangeView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var currentPassword = ""
    @State private var newEmail = ""
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var didSendVerification = false

    private var isValidEmail: Bool {
        newEmail.contains("@") && newEmail.contains(".")
    }

    private var canSubmit: Bool {
        currentPassword.count >= 6 && isValidEmail
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    Image(systemName: "envelope.badge.shield.half.filled")
                        .font(.system(size: 44))
                        .foregroundStyle(AnchorPalette.chipActive)
                        .padding(.top, 8)

                    Text("Change email address")
                        .font(AnchorTypography.h3)
                        .foregroundStyle(AnchorPalette.textPrimary)

                    if didSendVerification {
                        verificationSentView
                    } else {
                        formSection
                    }
                }
                .padding(24)
            }
            .background(AnchorBackground())
            .navigationTitle("Change Email")
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
            infoRow("A verification link will be sent to your new email address. Your email will only change after you click the link.")

            fieldRow("New email address", text: $newEmail, icon: "envelope", keyboardType: .emailAddress)
            secureField("Current password", text: $currentPassword, icon: "lock")

            if let error = errorMessage {
                Text(error)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.danger)
                    .multilineTextAlignment(.center)
            }

            Button {
                Task { await sendVerification() }
            } label: {
                HStack {
                    Spacer()
                    if isLoading { ProgressView().tint(.white) }
                    else { Text("Send Verification Link").fontWeight(.semibold) }
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

    // MARK: — Sent State

    private var verificationSentView: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.circle.fill")
                .font(.system(size: 48))
                .foregroundStyle(AnchorPalette.success)
            Text("Verification email sent to \(newEmail).")
                .font(AnchorTypography.body)
                .foregroundStyle(AnchorPalette.textPrimary)
                .multilineTextAlignment(.center)
            Text("Click the link in that email to complete the address change.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
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

    private func sendVerification() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        do {
            try await appState.reauthenticate(password: currentPassword)
            try await AuthService.shared.updateEmail(to: newEmail)
            didSendVerification = true
            ToastStore.shared.show("Verification email sent", style: .success)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: — Field Builder

    private func fieldRow(
        _ placeholder: String, text: Binding<String>,
        icon: String, keyboardType: UIKeyboardType = .default
    ) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(width: 20)
            TextField(placeholder, text: text)
                .keyboardType(keyboardType)
                .autocapitalization(.none)
                .autocorrectionDisabled()
                .foregroundStyle(AnchorPalette.textPrimary)
        }
        .padding(14)
        .background(AnchorPalette.chip)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func secureField(_ placeholder: String, text: Binding<String>, icon: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(width: 20)
            SecureField(placeholder, text: text)
                .foregroundStyle(AnchorPalette.textPrimary)
                .autocorrectionDisabled()
        }
        .padding(14)
        .background(AnchorPalette.chip)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func infoRow(_ text: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "info.circle")
                .foregroundStyle(AnchorPalette.chipActive)
            Text(text)
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.chipActive.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
