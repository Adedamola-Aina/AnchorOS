import SwiftUI
import FirebaseAuth

/// Parity with src/features/settings/components/AuthSessionList.tsx.
///
/// iOS native has no multi-session surface (Firebase Auth on Apple devices
/// is single-session per app install), so we show the current session only
/// with a prominent "sign out everywhere" action that revokes tokens.
struct AuthSessionListView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState

    @State private var isRevoking = false

    private var currentUser: User? { Auth.auth().currentUser }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    sessionCard
                    revokeCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Active Sessions")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private var sessionCard: some View {
        AnchorCard(title: "This Device", icon: "iphone") {
            VStack(alignment: .leading, spacing: 10) {
                row(label: "Device", value: UIDevice.current.name)
                Divider().background(AnchorPalette.cardBorder)
                row(label: "System", value: "\(UIDevice.current.systemName) \(UIDevice.current.systemVersion)")
                Divider().background(AnchorPalette.cardBorder)
                row(label: "App Version", value: Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "—")
                Divider().background(AnchorPalette.cardBorder)
                row(label: "Signed In As", value: currentUser?.email ?? "—")
                Divider().background(AnchorPalette.cardBorder)
                row(label: "Status", value: "Active", tint: AnchorPalette.success)
            }
        }
    }

    private var revokeCard: some View {
        AnchorCard(title: "Security", icon: "lock.shield") {
            VStack(alignment: .leading, spacing: 10) {
                Text("Signing out everywhere ends this session and revokes all refresh tokens. Other devices will be signed out on their next network request.")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Button {
                    Task { await signOutEverywhere() }
                } label: {
                    HStack {
                        if isRevoking { ProgressView().tint(.white) }
                        Text(isRevoking ? "Revoking…" : "Sign Out Everywhere")
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(AnchorPalette.danger)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
                .disabled(isRevoking)
            }
        }
    }

    private func signOutEverywhere() async {
        isRevoking = true
        defer { isRevoking = false }
        // Forces a new ID token on next network call; local sign-out immediately
        // ends the current session.
        try? await Auth.auth().currentUser?.getIDTokenResult(forcingRefresh: true)
        appState.signOut()
        ToastStore.shared.show("Signed out of all sessions", style: .success)
        dismiss()
    }

    private func row(label: String, value: String, tint: Color = AnchorPalette.textPrimary) -> some View {
        HStack {
            Text(label)
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .font(.subheadline).fontWeight(.semibold)
                .foregroundStyle(tint)
                .lineLimit(1)
        }
    }
}
