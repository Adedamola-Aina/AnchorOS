import SwiftUI

/// Settings screen with real user profile from Firestore.
/// Data source: UserProfileStore (uid-scoped via SecureDb)
/// Card sections are split across SettingsView+*.swift extension files (ARCH-001).
struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var userProfileStore: UserProfileStore
    @EnvironmentObject var familyStore: FamilyStore
    @EnvironmentObject var financeStore: FinanceStore
    @EnvironmentObject var commitmentsStore: CommitmentsStore
    @EnvironmentObject var tabScroll: TabScrollCoordinator
    @EnvironmentObject var theme: AnchorTheme
    @EnvironmentObject var biometricLock: BiometricLockStore
    @AppStorage("anchor_font_size") var fontSize: String = "Default"
    @AppStorage("anchor_high_contrast") var highContrast: Bool = false
    @State var editingName = false
    @State var nameInput = ""
    @State var showCurrencyPicker = false
    @State var showPasswordChange = false
    @State var showEmailChange = false
    @State var showMFAEnrollment = false
    @State var showRecoveryCodes = false
    @State var showAuthHistory = false
    @State var showDangerZone = false
    @State var showPasskeyManager = false
    @State var showBiometricLock = false
    @State var showNotificationPrefs = false
    @State var showAnchorAI = false
    @State var showAuthSessions = false
    @State var showDeveloperTools = false
    @State var showReauth = false
    @State var showImportSheet = false
    @State var selectedSection: String = "Profile"

    let currencies = ["NGN", "USD", "GBP", "EUR", "CAD", "AUD", "JPY", "KES", "GHS", "ZAR"]

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
}
