import SwiftUI

@main
struct AnchorOSNativeApp: App {
    @StateObject private var appState: AppState
    @StateObject private var projectStateStore = ProjectStateStore()
    @StateObject private var financeStore = FinanceStore()
    @StateObject private var commitmentsStore = CommitmentsStore()
    @StateObject private var userProfileStore = UserProfileStore()

    init() {
        let state = AppState()
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
                .onChange(of: appState.isAuthenticated) { _, authenticated in
                    if authenticated, let uid = appState.currentUID {
                        financeStore.start(uid: uid)
                        commitmentsStore.start(uid: uid)
                        Task { await userProfileStore.start(uid: uid) }
                    } else {
                        financeStore.stop()
                        commitmentsStore.stop()
                        userProfileStore.stop()
                    }
                }
                // Bootstrap stores if already authenticated at launch
                .task {
                    if appState.isAuthenticated, let uid = appState.currentUID {
                        financeStore.start(uid: uid)
                        commitmentsStore.start(uid: uid)
                        await userProfileStore.start(uid: uid)
                    }
                }
        }
    }
}
