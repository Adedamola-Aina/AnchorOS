import SwiftUI

/// Settings screen with real user profile from Firestore.
/// Data source: UserProfileStore (uid-scoped via SecureDb)
struct SettingsView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var userProfileStore: UserProfileStore
    @EnvironmentObject private var familyStore: FamilyStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @EnvironmentObject private var tabScroll: TabScrollCoordinator
    @EnvironmentObject private var theme: AnchorTheme
    @AppStorage("anchor_font_size") private var fontSize: String = "Default"
    @AppStorage("anchor_high_contrast") private var highContrast: Bool = false
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
    @State private var showNotificationPrefs = false
    @State private var showAnchorAI = false
    @State private var showAuthSessions = false
    @State private var showDeveloperTools = false
    @State private var showReauth = false
    @State private var showImportSheet = false
    @State private var selectedSection: String = "Profile"

    private let currencies = ["NGN", "USD", "GBP", "EUR", "CAD", "AUD", "JPY", "KES", "GHS", "ZAR"]

    var body: some View {
        NavigationStack {
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(spacing: 16) {
                        AnchorSectionTabs(
                            labels: ["Profile", "Theme", "Security", "Alerts", "AI", "Family"],
                            selected: selectedSection,
                            onSelect: { label in
                                selectedSection = label
                                UIImpactFeedbackGenerator(style: .light).impactOccurred()
                                withAnimation(.easeInOut(duration: 0.35)) {
                                    proxy.scrollTo(label, anchor: .top)
                                }
                            }
                        )
                        profileCard.id("Profile")
                        familyNavCard.id("Family")
                        AwaitingConfirmationCard()
                        PendingInviteCard()
                        appearanceCard.id("Theme")
                        securityCard.id("Security")
                        alertsCard.id("Alerts")
                        aiCard.id("AI")
                        dataManagementCard
                        supportCard
                        dangerZoneCard
                        signOutCard
                    }
                    .padding(16)
                }
                .onChange(of: tabScroll.scrollRequestId) { _, _ in
                    guard tabScroll.targetTab == 4 else { return }
                    withAnimation(.easeInOut(duration: 0.35)) {
                        proxy.scrollTo("Profile", anchor: .top)
                    }
                }
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
                // Avatar row — PWA ProfileSettings Avatar parity (initials-based, no upload).
                HStack(spacing: 14) {
                    ZStack {
                        Circle()
                            .fill(AnchorPalette.chipActive.opacity(0.18))
                            .frame(width: 56, height: 56)
                        Text(avatarInitials)
                            .font(.title3).fontWeight(.bold)
                            .foregroundStyle(AnchorPalette.chipActive)
                    }
                    .accessibilityLabel("Avatar for \(userProfileStore.displayName)")

                    VStack(alignment: .leading, spacing: 2) {
                        Text(userProfileStore.displayName)
                            .font(.headline)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text(userProfileStore.email.isEmpty ? "No email" : userProfileStore.email)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                }
                .padding(.bottom, 4)

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

                Text("THEME")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Picker("Theme", selection: $theme.mode) {
                    Text("System").tag(AnchorTheme.Mode.system)
                    Text("Light").tag(AnchorTheme.Mode.light)
                    Text("Dark").tag(AnchorTheme.Mode.dark)
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

                Button {
                    if let url = URL(string: UIApplication.openSettingsURLString) {
                        UIApplication.shared.open(url)
                    }
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "figure.walk.motion")
                            .foregroundStyle(AnchorPalette.chipActive)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Reduce Motion")
                                .font(.subheadline).fontWeight(.semibold)
                                .foregroundStyle(AnchorPalette.textPrimary)
                            Text("Managed in iOS Settings \u203A Accessibility")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                        Spacer()
                        Image(systemName: "arrow.up.right.square")
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
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

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "laptopcomputer.and.iphone",
                    label: "Active Sessions",
                    subtitle: "Manage and revoke signed-in devices"
                ) { showAuthSessions = true }
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
        .sheet(isPresented: $showAuthSessions) {
            AuthSessionListView().environmentObject(appState)
        }
        .sheet(isPresented: $showNotificationPrefs) {
            NotificationPreferencesView()
        }
        .sheet(isPresented: $showAnchorAI) {
            AnchorAISettingsView()
        }
        .sheet(isPresented: $showDeveloperTools) {
            DeveloperToolsView()
                .environmentObject(appState)
                .environmentObject(financeStore)
        }
        .sheet(isPresented: $showImportSheet) {
            DataImportSheet()
                .environmentObject(userProfileStore)
                .environmentObject(financeStore)
                .environmentObject(commitmentsStore)
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

    // MARK: — Data Management

    private var alertsCard: some View {
        AnchorCard(title: "Alerts", icon: "bell") {
            Button { showNotificationPrefs = true } label: {
                HStack(spacing: 12) {
                    Image(systemName: "bell.badge.fill")
                        .foregroundStyle(AnchorPalette.chipActive)
                        .frame(width: 24)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Notification Preferences")
                            .font(.subheadline).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text("Push, categories, quiet hours")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .buttonStyle(.plain)
        }
    }

    // MARK: — Anchor AI

    private var aiCard: some View {
        AnchorCard(title: "Anchor AI", icon: "sparkles") {
            Button { showAnchorAI = true } label: {
                HStack(spacing: 12) {
                    Image(systemName: "brain.head.profile")
                        .foregroundStyle(AnchorPalette.chipActive)
                        .frame(width: 24)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Fabric Preferences & Knowledge")
                            .font(.subheadline).fontWeight(.semibold)
                            .foregroundStyle(AnchorPalette.textPrimary)
                        Text("Tune briefings, proactive nudges, and inspect learned patterns")
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .buttonStyle(.plain)
        }
    }

    private var dataManagementCard: some View {        AnchorCard(title: "Data", icon: "square.and.arrow.up") {
            VStack(alignment: .leading, spacing: 4) {
                securityNavRow(
                    icon: "square.and.arrow.up",
                    label: "Export Data",
                    subtitle: "Download a JSON snapshot of your accounts, transactions, and commitments"
                ) {
                    Task { await exportData() }
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "icloud.and.arrow.down",
                    label: "Import from Clipboard",
                    subtitle: "Restore a JSON backup you previously exported"
                ) {
                    showImportSheet = true
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "hammer.fill",
                    label: "Developer Tools",
                    subtitle: "Environment, store counts, diagnostics"
                ) { showDeveloperTools = true }
            }
        }
    }

    private func exportData() async {
        let snapshot = AnchorDataTransferSnapshot(
            exportedAt: ISO8601DateFormatter().string(from: Date()),
            user: .init(
                displayName: userProfileStore.displayName,
                email: userProfileStore.email,
                currency: userProfileStore.currency
            ),
            accounts: financeStore.accounts.map {
                .init(
                    name: $0.name,
                    type: $0.type,
                    currency: $0.currency,
                    balanceCents: $0.balanceCents,
                    color: $0.color
                )
            },
            transactions: financeStore.transactions.map {
                .init(
                    title: $0.title,
                    amountCents: $0.amountCents,
                    type: $0.type,
                    category: $0.category,
                    accountName: $0.accountName,
                    currency: $0.currency,
                    date: $0.date,
                    narration: $0.narration
                )
            },
            commitments: commitmentsStore.commitments.map {
                .init(
                    title: $0.title,
                    type: $0.type,
                    domain: $0.domain ?? "General",
                    timeOfDay: $0.timeOfDay,
                    notes: $0.notes,
                    priority: $0.priority,
                    scope: $0.scope
                )
            }
        )
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        guard let data = try? encoder.encode(snapshot),
              let json = String(data: data, encoding: .utf8) else {
            ToastStore.shared.show("Export failed", style: .error)
            return
        }
        UIPasteboard.general.string = json
        ToastStore.shared.show("Full backup copied to clipboard", style: .success)
    }

    // MARK: — Support

    private var supportCard: some View {
        AnchorCard(title: "Support", icon: "questionmark.circle") {
            VStack(alignment: .leading, spacing: 4) {
                securityNavRow(
                    icon: "envelope.fill",
                    label: "Contact Support",
                    subtitle: "Email the Anchor team"
                ) {
                    if let url = URL(string: "mailto:support@anchor-os.app") {
                        UIApplication.shared.open(url)
                    }
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "doc.text.fill",
                    label: "Privacy Policy",
                    subtitle: "How we handle your data"
                ) {
                    if let url = URL(string: "https://anchor-os.app/privacy") {
                        UIApplication.shared.open(url)
                    }
                }

                Divider().background(AnchorPalette.cardBorder)

                securityNavRow(
                    icon: "info.circle.fill",
                    label: "About Anchor",
                    subtitle: "Version \(Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "—")"
                ) {
                    ToastStore.shared.show("Anchor OS Native", style: .info)
                }
            }
        }
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

    private var avatarInitials: String {
        let name = userProfileStore.displayName.trimmingCharacters(in: .whitespaces)
        if name.isEmpty { return "?" }
        let parts = name.split(separator: " ")
        if parts.count >= 2, let f = parts.first?.first, let l = parts.last?.first {
            return "\(f)\(l)".uppercased()
        }
        return String(name.prefix(2)).uppercased()
    }

    private func row(_ key: String, _ value: String) -> some View {
        HStack {
            Text(key).foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value).foregroundStyle(AnchorPalette.textPrimary).fontWeight(.semibold)
        }
        .font(.subheadline)
    }
}
