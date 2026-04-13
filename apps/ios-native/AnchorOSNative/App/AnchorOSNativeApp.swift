import SwiftUI

@main
struct AnchorOSNativeApp: App {
    @StateObject private var appState: AppState

    init() {
        let state = AppState()
        state.bootstrap()
        _appState = StateObject(wrappedValue: state)
    }

    var body: some Scene {
        WindowGroup {
            RootTabView()
                .environmentObject(appState)
        }
    }
}
