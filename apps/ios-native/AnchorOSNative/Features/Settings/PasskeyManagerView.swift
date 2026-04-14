import SwiftUI
import AuthenticationServices

// MARK: - PasskeyManagerView
// Lists registered passkey devices and allows removal.
// Matches PWA PasskeySection.tsx.

struct PasskeyManagerView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var isRegistering = false
    @State private var isDeleting: String?
    @State private var passkeys: [PasskeyEntry] = []
    @State private var isLoading = false
    @State private var errorMessage: String?

    struct PasskeyEntry: Identifiable {
        let id: String
        let deviceName: String
        let createdAt: String
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    headerSection

                    if isLoading {
                        ProgressView().tint(.white).frame(maxWidth: .infinity).padding(.top, 32)
                    } else if passkeys.isEmpty {
                        emptyState
                    } else {
                        passkeyList
                    }

                    registerButton

                    if let error = errorMessage {
                        Text(error)
                            .font(.footnote)
                            .foregroundStyle(AnchorPalette.danger)
                            .multilineTextAlignment(.center)
                    }
                }
                .padding(24)
            }
            .background(AnchorBackground())
            .navigationTitle("Passkeys")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .task { await loadPasskeys() }
        }
    }

    // MARK: — Sections

    private var headerSection: some View {
        VStack(spacing: 8) {
            Image(systemName: "faceid")
                .font(.system(size: 40))
                .foregroundStyle(AnchorPalette.chipActive)
            Text("Passkeys")
                .font(AnchorTypography.h3)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text("Sign in faster and more securely using Face ID or Touch ID. No password required.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
    }

    private var passkeyList: some View {
        VStack(spacing: 8) {
            Text("REGISTERED DEVICES")
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

            ForEach(passkeys) { passkey in
                HStack(spacing: 14) {
                    Image(systemName: "iphone.badge.play")
                        .foregroundStyle(AnchorPalette.chipActive)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(passkey.deviceName)
                            .fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text(passkey.createdAt)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                    Button {
                        Task { await removePasskey(id: passkey.id) }
                    } label: {
                        if isDeleting == passkey.id {
                            ProgressView().tint(.white).scaleEffect(0.8)
                        } else {
                            Image(systemName: "trash")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.danger)
                        }
                    }
                    .buttonStyle(.plain)
                    .disabled(isDeleting == passkey.id)
                }
                .padding(14)
                .background(AnchorPalette.card)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(AnchorPalette.cardBorder, lineWidth: 1))
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 10) {
            Image(systemName: "faceid")
                .font(.system(size: 36))
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("No passkeys registered.")
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("Add a passkey to sign in using Face ID or Touch ID.")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 20)
    }

    private var registerButton: some View {
        Button {
            Task { await registerPasskey() }
        } label: {
            HStack {
                Spacer()
                if isRegistering { ProgressView().tint(.white) }
                else { Label("Add Passkey", systemImage: "plus.circle.fill").fontWeight(.semibold) }
                Spacer()
            }
            .padding(.vertical, 16)
            .background(AnchorPalette.chipActive)
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
        .disabled(isRegistering)
    }

    // MARK: — Actions

    private func loadPasskeys() async {
        isLoading = true
        defer { isLoading = false }
        do {
            let result = try await PasskeyService.shared.listPasskeys()
            passkeys = result.map { raw in
                let id = raw["id"] as? String ?? UUID().uuidString
                let device = raw["deviceName"] as? String ?? "Unknown Device"
                let created = raw["createdAt"] as? String ?? ""
                return PasskeyEntry(id: id, deviceName: device, createdAt: formatDate(created))
            }
        } catch {
            // Not enrolled yet — show empty state
        }
    }

    private func registerPasskey() async {
        isRegistering = true
        errorMessage = nil
        defer { isRegistering = false }
        do {
            try await PasskeyService.shared.register()
            ToastStore.shared.show("Passkey registered", style: .success)
            await loadPasskeys()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func removePasskey(id: String) async {
        isDeleting = id
        defer { isDeleting = nil }
        do {
            try await PasskeyService.shared.remove(credentialId: id)
            await loadPasskeys()
            ToastStore.shared.show("Passkey removed", style: .info)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func formatDate(_ timestamp: String) -> String {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = iso.date(from: timestamp) ?? ISO8601DateFormatter().date(from: timestamp) {
            let fmt = DateFormatter()
            fmt.dateStyle = .medium
            return fmt.string(from: date)
        }
        return timestamp
    }
}
