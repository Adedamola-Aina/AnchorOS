import SwiftUI

// MARK: - ReauthenticationView
// SEC-008: Modal for re-authentication before sensitive operations.
// Matches PWA reauthenticateUser() + 5-minute auth window.
// Presented before: account deletion, MFA changes, email changes.

struct ReauthenticationView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var password = ""
    @State private var error: String?
    @State private var isLoading = false

    let onSuccess: () -> Void

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Image(systemName: "lock.fill")
                    .font(.system(size: 40))
                    .foregroundStyle(AnchorPalette.warning)

                VStack(spacing: 8) {
                    Text("Confirm your identity")
                        .font(AnchorTypography.h2)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text("Enter your password to continue with this sensitive action.")
                        .font(AnchorTypography.body)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .multilineTextAlignment(.center)
                }

                SecureField("Password", text: $password)
                    .textContentType(.password)
                    .padding(16)
                    .background(AnchorPalette.chip)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .submitLabel(.done)
                    .onSubmit { Task { await reauthenticate() } }

                if let error {
                    Text(error)
                        .font(.footnote)
                        .foregroundStyle(AnchorPalette.danger)
                }

                // Social re-auth option if applicable
                if isProviderAccount {
                    Button { Task { await reauthenticateViaProvider() } } label: {
                        Label("Re-authenticate with provider", systemImage: "arrow.right.circle")
                            .font(AnchorTypography.small)
                            .foregroundStyle(AnchorPalette.chipActive)
                    }
                }

                Spacer()

                Button { Task { await reauthenticate() } } label: {
                    HStack {
                        Spacer()
                        if isLoading { ProgressView().tint(.white) }
                        else { Text("Confirm").fontWeight(.semibold) }
                        Spacer()
                    }
                    .padding(.vertical, 16)
                    .background(!password.isEmpty ? AnchorPalette.chipActive : AnchorPalette.chip)
                    .foregroundStyle(!password.isEmpty ? .white : AnchorPalette.textSecondary)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                }
                .buttonStyle(.plain)
                .disabled(password.isEmpty || isLoading)
            }
            .padding(24)
            .navigationTitle("Re-authenticate")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
        }
    }

    private var isProviderAccount: Bool {
        guard let provider = AuthService.shared.currentUser?.providerData.first?.providerID else {
            return false
        }
        return provider == "google.com" || provider == "apple.com"
    }

    private func reauthenticate() async {
        isLoading = true; defer { isLoading = false }
        error = nil
        do {
            try await appState.reauthenticate(password: password)
            dismiss()
            onSuccess()
        } catch {
            self.error = "Incorrect password. Please try again."
        }
    }

    private func reauthenticateViaProvider() async {
        isLoading = true; defer { isLoading = false }
        error = nil
        do {
            try await appState.reauthenticateWithProvider()
            dismiss()
            onSuccess()
        } catch {
            self.error = "Re-authentication failed: \(error.localizedDescription)"
        }
    }
}
