import SwiftUI
import FirebaseCore
import FirebaseFirestore

@main
struct AnchorOSNativeApp: App {
    @StateObject private var appState: AppState
    @StateObject private var projectStateStore = ProjectStateStore()
    @StateObject private var financeStore = FinanceStore()
    @StateObject private var commitmentsStore = CommitmentsStore()
    @StateObject private var userProfileStore = UserProfileStore()
    @StateObject private var familyStore = FamilyStore()
    @StateObject private var fabricStore = AnchorFabricStore()

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
                .environmentObject(appState)
                .environmentObject(projectStateStore)
                .environmentObject(financeStore)
                .environmentObject(commitmentsStore)
                .environmentObject(userProfileStore)
                .environmentObject(familyStore)
                .environmentObject(fabricStore)
                .onChange(of: appState.isAuthenticated) { _, authenticated in
                    if authenticated, let uid = appState.currentUID {
                        financeStore.start(uid: uid)
                        commitmentsStore.start(uid: uid)
                        familyStore.start(uid: uid)
                        Task { await userProfileStore.start(uid: uid) }
                        fabricStore.start(financeStore: financeStore, commitmentsStore: commitmentsStore)
                    } else {
                        financeStore.stop()
                        commitmentsStore.stop()
                        familyStore.stop()
                        userProfileStore.stop()
                    }
                }
                // Bootstrap stores if already authenticated at launch
                .task {
                    if appState.isAuthenticated, let uid = appState.currentUID {
                        financeStore.start(uid: uid)
                        commitmentsStore.start(uid: uid)
                        familyStore.start(uid: uid)
                        await userProfileStore.start(uid: uid)
                        fabricStore.start(financeStore: financeStore, commitmentsStore: commitmentsStore)
                    }
                }
        }
    }
}
