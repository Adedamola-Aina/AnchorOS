import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var appState: AppState
    @State private var fontSize: String = "Default"
    @State private var highContrast: Bool = false

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
            .background(AnchorPalette.background.ignoresSafeArea())
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
        }
    }

    private var profileCard: some View {
        AnchorCard(title: "Profile", icon: "person.circle") {
            VStack(alignment: .leading, spacing: 10) {
                row("Display Name", "Alex Owner")
                row("User ID", "test-owner")
                row("Sign-in Method", "Email & Password")
            }
        }
    }

    private var appearanceCard: some View {
        AnchorCard(title: "Appearance", icon: "paintbrush") {
            VStack(alignment: .leading, spacing: 12) {
                Text("VISUAL THEME")
                    .font(.caption)
                    .fontWeight(.bold)
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
                    .font(.caption)
                    .fontWeight(.bold)
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

    private var securityCard: some View {
        AnchorCard(title: "Security", icon: "lock.shield") {
            VStack(alignment: .leading, spacing: 8) {
                row("Auth Status", appState.isAuthenticated ? "Signed in" : "Signed out")
                row("Session", "Active")
                Text(appState.statusMessage)
                    .font(.footnote)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
        }
    }

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

    private func row(_ key: String, _ value: String) -> some View {
        HStack {
            Text(key)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .foregroundStyle(AnchorPalette.textPrimary)
                .fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}

