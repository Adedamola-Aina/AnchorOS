import SwiftUI
import FirebaseFunctions

// MARK: - DangerZoneView
// Account deletion with reauthentication gate.
// Calls deleteAccount Cloud Function, then signs out.
// Matches PWA DangerZone.tsx.

struct DangerZoneView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var password = ""
    @State private var confirmText = ""
    @State private var isDeleting = false
    @State private var errorMessage: String?
    @State private var showFinalConfirm = false

    private let requiredPhrase = "delete my account"

    private var canProceed: Bool {
        password.count >= 6 && confirmText.lowercased() == requiredPhrase
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    warningHeader

                    whatGetsDeleted

                    formSection

                    if let error = errorMessage {
                        Text(error)
                            .font(.footnote)
                            .foregroundStyle(AnchorPalette.danger)
                            .multilineTextAlignment(.center)
                    }

                    deleteButton
                }
                .padding(24)
            }
            .background(AnchorBackground())
            .navigationTitle("Delete Account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .alert("Permanently Delete Account?", isPresented: $showFinalConfirm) {
                Button("Cancel", role: .cancel) {}
                Button("Delete Forever", role: .destructive) {
                    Task { await deleteAccount() }
                }
            } message: {
                Text("This cannot be undone. All your data will be permanently erased.")
            }
        }
    }

    // MARK: — Sections

    private var warningHeader: some View {
        VStack(spacing: 12) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 48))
                .foregroundStyle(AnchorPalette.danger)

            Text("Delete your account")
                .font(AnchorTypography.h2)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("This action is permanent and cannot be undone. All of your data will be erased immediately.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
    }

    private var whatGetsDeleted: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("WHAT GETS DELETED")
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.danger)

            ForEach([
                "All accounts and transactions",
                "All commitments and tasks",
                "Family connections",
                "Anchor AI data and insights",
                "Your profile and settings"
            ], id: \.self) { item in
                HStack(spacing: 8) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.danger)
                    Text(item)
                        .font(.subheadline)
                        .foregroundStyle(AnchorPalette.textPrimary)
                }
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.danger.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private var formSection: some View {
        VStack(spacing: 12) {
            secureField("Confirm your password", text: $password, icon: "lock")

            VStack(alignment: .leading, spacing: 4) {
                Text("Type \"\(requiredPhrase)\" to confirm:")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                plainField("delete my account", text: $confirmText, icon: "text.cursor")
            }
        }
    }

    private var deleteButton: some View {
        Button {
            showFinalConfirm = true
        } label: {
            HStack {
                Spacer()
                if isDeleting { ProgressView().tint(.white) }
                else { Text("Delete My Account").fontWeight(.semibold) }
                Spacer()
            }
            .padding(.vertical, 16)
            .background(canProceed ? AnchorPalette.danger : AnchorPalette.chip)
            .foregroundStyle(canProceed ? .white : AnchorPalette.textSecondary)
            .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
        .disabled(!canProceed || isDeleting)
    }

    // MARK: — Action

    private func deleteAccount() async {
        isDeleting = true
        errorMessage = nil
        defer { isDeleting = false }
        do {
            try await appState.reauthenticate(password: password)
            _ = try await Functions.functions().httpsCallable("deleteAccount").call([:])
            appState.signOut()
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    // MARK: — Field Builders

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

    private func plainField(_ placeholder: String, text: Binding<String>, icon: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(width: 20)
            TextField(placeholder, text: text)
                .autocapitalization(.none)
                .autocorrectionDisabled()
                .foregroundStyle(AnchorPalette.textPrimary)
        }
        .padding(14)
        .background(AnchorPalette.chip)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
