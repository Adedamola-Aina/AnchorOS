import SwiftUI

/// Settings screen with real user profile from Firestore.
/// Data source: UserProfileStore (uid-scoped via SecureDb)
struct SettingsView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var userProfileStore: UserProfileStore
    @State private var fontSize: String = "Default"
    @State private var highContrast: Bool = false
    @State private var editingName = false
    @State private var nameInput = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorSectionTabs(labels: ["Profile", "Theme", "Security", "Alerts", "AI", "Family"])
                    profileCard
                    appearanceCard
                    securityCard
                    signOutCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    // MARK: — Profile

    private var profileCard: some View {
        AnchorCard(title: "Profile", icon: "person.circle") {
            VStack(alignment: .leading, spacing: 10) {
                // Editable display name row
                HStack {
                    Text("Display Name")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.subheadline)
                    Spacer()
                    if editingName {
                        TextField("Name", text: $nameInput)
                            .multilineTextAlignment(.trailing)
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textPrimary)
                            .submitLabel(.done)
                            .onSubmit {
                                Task {
                                    try? await userProfileStore.updateDisplayName(nameInput)
                                    editingName = false
                                    ToastStore.shared.show("Name updated", style: .success)
                                }
                            }
                        Button("Save") {
                            Task {
                                try? await userProfileStore.updateDisplayName(nameInput)
                                editingName = false
                                ToastStore.shared.show("Name updated", style: .success)
                            }
                        }
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(AnchorPalette.chipActive)
                    } else {
                        Button {
                            nameInput = userProfileStore.displayName
                            editingName = true
                        } label: {
                            HStack(spacing: 4) {
                                Text(userProfileStore.displayName)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                    .font(.subheadline)
                                Image(systemName: "pencil")
                                    .font(.caption)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
                row("Email", userProfileStore.email.isEmpty ? "—" : userProfileStore.email)
                row("Sign-in Method", "Email & Password")
                row("Currency", userProfileStore.currency)
                row("MFA", userProfileStore.mfaEnabled ? "Enabled" : "Disabled")
            }
        }
    }

    // MARK: — Appearance

    private var appearanceCard: some View {
        AnchorCard(title: "Appearance", icon: "paintbrush") {
            VStack(alignment: .leading, spacing: 12) {
                Text("ENVIRONMENT")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Picker("Environment", selection: Binding(
                    get: { appState.environment },
                    set: { appState.setEnvironment($0) }
                )) {
                    ForEach(AppEnvironment.allCases, id: \.self) { env in
                        Text(env.rawValue.capitalized).tag(env)
                    }
                }
                .pickerStyle(.segmented)

                Text("ACCESSIBILITY")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Picker("Font", selection: $fontSize) {
                    Text("Default").tag("Default")
                    Text("Large").tag("Large")
                    Text("Extra Large").tag("Extra Large")
                }
                .pickerStyle(.segmented)

                Toggle("High Contrast", isOn: $highContrast)
                    .tint(AnchorPalette.chipActive)
                    .foregroundStyle(AnchorPalette.textPrimary)
            }
        }
    }

    // MARK: — Security

    private var securityCard: some View {
        AnchorCard(title: "Security", icon: "lock.shield") {
            VStack(alignment: .leading, spacing: 8) {
                row("Auth Status", appState.isAuthenticated ? "Signed in" : "Signed out")
                row("MFA", userProfileStore.mfaEnabled ? "Active" : "Not enrolled")
                row("Session", "Active")
            }
        }
    }

    // MARK: — Sign Out

    private var signOutCard: some View {
        AnchorCard(title: "Session", icon: "rectangle.portrait.and.arrow.right") {
            Button {
                appState.signOut()
            } label: {
                Text("Sign Out")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(Color.red.opacity(0.85))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: — Helpers

    private func row(_ key: String, _ value: String) -> some View {
        HStack {
            Text(key).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}
