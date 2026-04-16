import SwiftUI

/// Settings screen with real user profile from Firestore.
/// Data source: UserProfileStore (uid-scoped via SecureDb)
struct SettingsView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var userProfileStore: UserProfileStore
    @EnvironmentObject private var familyStore: FamilyStore
    @EnvironmentObject private var financeStore: FinanceStore
    @State private var fontSize: String = "Default"
    @State private var highContrast: Bool = false
    @State private var editingName = false
    @State private var nameInput = ""
    @State private var showCurrencyPicker = false
    @State private var showPasswordChange = false
    @State private var showEmailChange = false
    @State private var showMFAEnrollment = false
    @State private var showRecoveryCodes = false
    @State private var showAuthHistory = false
    @State private var showDangerZone = false
    @State private var showPasskeyManager = false

    private let currencies = ["NGN", "USD", "GBP", "EUR", "CAD", "AUD", "JPY", "KES", "GHS", "ZAR"]

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorSectionTabs(labels: ["Profile", "Theme", "Security", "Alerts", "AI", "Family"])
                    profileCard
                    familyNavCard
                    appearanceCard
                    securityCard
                    dangerZoneCard
                    signOutCard
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
        }
        .fadeInOnAppear(duration: 0.3) // Parity: PWA SettingsView `animate-in fade-in` 300ms ease.
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
                // Currency picker
                HStack {
                    Text("Currency")
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.subheadline)
                    Spacer()
                    Menu {
                        ForEach(currencies, id: \.self) { c in
                            Button {
                                Task {
                                    try? await userProfileStore.updateCurrency(c)
                                    ToastStore.shared.show("Currency updated to \(c)", style: .success)
                                }
                            } label: {
                                HStack {
                                    Text(c)
                                    if c == userProfileStore.currency {
                                        Spacer()
                                        Image(systemName: "checkmark")
                                    }
                                }
                            }
                        }
                    } label: {
                        HStack(spacing: 4) {
                            Text(userProfileStore.currency)
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .fontWeight(.semibold)
                                .font(.subheadline)
                            Image(systemName: "chevron.up.chevron.down")
                                .font(.caption2)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                    }
                }
                row("MFA", userProfileStore.mfaEnabled ? "Enabled" : "Disabled")
            }
        }
    }

    // MARK: — Family Nav

    private var familyNavCard: some View {
        NavigationLink(destination: FamilyView()
            .environmentObject(familyStore)
            .environmentObject(userProfileStore)
            .environmentObject(financeStore)
        ) {
            HStack(spacing: 14) {
                ZStack {
                    Circle()
                        .fill(AnchorPalette.chipActive.opacity(0.15))
                        .frame(width: 40, height: 40)
                    Image(systemName: "person.2.fill")
                        .font(.subheadline)
                        .foregroundStyle(AnchorPalette.chipActive)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text("Family Mode")
                        .fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(familyStore.hasConnection
                         ? "Connected with \(familyStore.partnerName)"
                         : "Invite a family member")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }

                Spacer()

                if familyStore.hasConnection {
                    HStack(spacing: 4) {
                        Circle().fill(AnchorPalette.success).frame(width: 8, height: 8)
                        Text("Active")
                            .font(.caption2).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.success)
                    }
                }

                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            .padding(16)
            .background(AnchorPalette.chip.opacity(0.5))
            .clipShape(RoundedRectangle(cornerRadius: 16))
        }
        .buttonStyle(.plain)
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
            VStack(alignment: .leading, spacing: 4) {
                securityNavRow(
                    icon: "key.fill",
                    label: "Change Password",
                    subtitle: "Update your account password"
                ) { showPasswordChange = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "envelope.badge.shield.half.filled",
                    label: "Change Email",
                    subtitle: userProfileStore.email.isEmpty ? "Not set" : userProfileStore.email
                ) { showEmailChange = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "lock.shield.fill",
                    label: "Two-Factor Authentication",
                    subtitle: userProfileStore.mfaEnabled ? "Enabled" : "Not enrolled"
                ) { showMFAEnrollment = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "key.2.on.ring.fill",
                    label: "Recovery Codes",
                    subtitle: "View or regenerate backup codes"
                ) { showRecoveryCodes = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "faceid",
                    label: "Passkeys",
                    subtitle: "Manage your passkey devices"
                ) { showPasskeyManager = true }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "clock.arrow.circlepath",
                    label: "Login History",
                    subtitle: "View recent sign-in activity"
                ) { showAuthHistory = true }
            }
        }
        .sheet(isPresented: $showPasswordChange) {
            PasswordChangeView().environmentObject(appState)
        }
        .sheet(isPresented: $showEmailChange) {
            EmailChangeView().environmentObject(appState)
        }
        .sheet(isPresented: $showMFAEnrollment) {
            MFAEnrollmentView().environmentObject(appState)
        }
        .sheet(isPresented: $showRecoveryCodes) {
            RecoveryCodesSettingsView()
        }
        .sheet(isPresented: $showPasskeyManager) {
            PasskeyManagerView()
        }
        .sheet(isPresented: $showAuthHistory) {
            AuthEventHistoryView()
        }
    }

    private func securityNavRow(icon: String, label: String, subtitle: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.chipActive)
                    .frame(width: 24)
                VStack(alignment: .leading, spacing: 2) {
                    Text(label)
                        .font(.subheadline).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(subtitle)
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            .padding(.vertical, 10)
        }
        .buttonStyle(.plain)
    }

    // MARK: — Danger Zone

    private var dangerZoneCard: some View {
        AnchorCard(title: "Account", icon: "exclamationmark.triangle") {
            Button {
                showDangerZone = true
            } label: {
                HStack {
                    Image(systemName: "person.crop.circle.badge.minus")
                        .foregroundStyle(AnchorPalette.danger)
                    Text("Delete Account")
                        .fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.danger)
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .buttonStyle(.plain)
        }
        .sheet(isPresented: $showDangerZone) {
            DangerZoneView().environmentObject(appState)
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
