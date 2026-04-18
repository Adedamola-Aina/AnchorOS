import SwiftUI
import FirebaseCore
import FirebaseFirestore

@main
struct AnchorOSNativeApp: App {
    @UIApplicationDelegateAdaptor(AnchorAppDelegate.self) private var appDelegate
    @StateObject private var appState: AppState
    @StateObject private var projectStateStore = ProjectStateStore()
    @StateObject private var financeStore = FinanceStore()
    @StateObject private var commitmentsStore = CommitmentsStore()
    @StateObject private var userProfileStore = UserProfileStore()
    @StateObject private var familyStore = FamilyStore()
    @StateObject private var fabricStore = AnchorFabricStore()
    @StateObject private var recurringStore = AnchorRecurringStore()
    @StateObject private var patternsStore = AnchorPatternsStore()
    @StateObject private var theme = AnchorTheme()
    @StateObject private var platformIntegration = PlatformIntegrationService()
    @StateObject private var biometricLock = BiometricLockStore()

    init() {
        FirebaseApp.configure()
        let state = AppState()
        // Enable Firestore offline persistence — app reads cached data when offline
        let settings = FirestoreSettings()
        settings.cacheSettings = PersistentCacheSettings()
        Firestore.firestore().settings = settings
        state.bootstrap()
        _appState = StateObject(wrappedValue: state)
    }

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .anchorTheme()
                .anchorDynamicType()
                .environmentObject(theme)
                .environmentObject(appState)
                .environmentObject(projectStateStore)
                .environmentObject(financeStore)
                .environmentObject(commitmentsStore)
                .environmentObject(userProfileStore)
                .environmentObject(familyStore)
                .environmentObject(fabricStore)
                .environmentObject(recurringStore)
                .environmentObject(patternsStore)
                .environmentObject(biometricLock)
                .onOpenURL { url in
                    platformIntegration.handleIncomingURL(url)
                }
                .task {
                    await platformIntegration.requestNotificationPermission()
                }
                .onChange(of: appState.isAuthenticated) { _, authenticated in
                    if authenticated, let uid = appState.currentUID {
                        UserDefaults.standard.set(uid, forKey: "anchor_current_uid")
                        financeStore.start(uid: uid)
                        commitmentsStore.start(uid: uid)
                        familyStore.start(uid: uid)
                        Task {
                            await userProfileStore.start(uid: uid)
                            await platformIntegration.syncPushTokenIfAvailable(uid: uid)
                        }
                        recurringStore.start(uid: uid)
                        patternsStore.start(uid: uid)
                        fabricStore.start(
                            financeStore: financeStore,
                            commitmentsStore: commitmentsStore,
                            recurringStore: recurringStore,
                            patternsStore: patternsStore
                        )
                    } else {
                        UserDefaults.standard.removeObject(forKey: "anchor_current_uid")
                        financeStore.stop()
                        commitmentsStore.stop()
                        familyStore.stop()
                        userProfileStore.stop()
                        recurringStore.stop()
                        patternsStore.stop()
                    }
                }
                // Bootstrap stores if already authenticated at launch
                .task {
                    if appState.isAuthenticated, let uid = appState.currentUID {
                        financeStore.start(uid: uid)
                        commitmentsStore.start(uid: uid)
                        familyStore.start(uid: uid)
                        await userProfileStore.start(uid: uid)
                        await platformIntegration.syncPushTokenIfAvailable(uid: uid)
                        recurringStore.start(uid: uid)
                        patternsStore.start(uid: uid)
                        fabricStore.start(
                            financeStore: financeStore,
                            commitmentsStore: commitmentsStore,
                            recurringStore: recurringStore,
                            patternsStore: patternsStore
                        )
                    }
                }
        }
    }
}
