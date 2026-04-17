import SwiftUI
import FirebaseAuth

/// Parity with src/features/settings/components/ReauthModal.tsx.
/// Required before destructive account operations (delete account,
/// change email). Re-validates password via Firebase `reauthenticate`.
struct ReauthModalView: View {
    @Environment(\.dismiss) private var dismiss

    let onSuccess: () -> Void
    let message: String

    @State private var password: String = ""
    @State private var error: String? = nil
    @State private var isBusy: Bool = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    header
                    field
                    if let err = error {
                        Text(err)
                            .font(.caption).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.danger)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    }
                    confirmButton
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Confirm It's You")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private var header: some View {
        VStack(spacing: 10) {
            Image(systemName: "lock.shield.fill")
                .font(.largeTitle)
                .foregroundStyle(AnchorPalette.chipActive)
            Text(message)
                .font(.subheadline)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
    }

    private var field: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("PASSWORD")
                .font(.caption2).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            SecureField("Enter your password", text: $password)
                .padding(12)
                .background(AnchorPalette.chip.opacity(0.5))
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                )
                .textContentType(.password)
                .autocorrectionDisabled()
        }
    }

    private var confirmButton: some View {
        Button { Task { await confirm() } } label: {
            HStack {
                if isBusy { ProgressView().tint(.white) }
                Text(isBusy ? "Verifying…" : "Confirm")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(password.isEmpty ? AnchorPalette.chipActive.opacity(0.4) : AnchorPalette.chipActive)
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
        .disabled(password.isEmpty || isBusy)
    }

    private func confirm() async {
        guard let user = Auth.auth().currentUser, let email = user.email else {
            error = "No authenticated user."
            return
        }
        isBusy = true
        defer { isBusy = false }
        let credential = EmailAuthProvider.credential(withEmail: email, password: password)
        do {
            try await user.reauthenticate(with: credential)
            onSuccess()
            dismiss()
        } catch {
            self.error = "Incorrect password. Please try again."
        }
    }
}
