import Foundation
import FirebaseAuth
import FirebaseCore

enum AppEnvironment: String, CaseIterable {
    case development
    case staging
    case production

    var baseURL: URL {
        switch self {
        case .development:
            return URL(string: "https://anchor-os-dev-1c6ec.web.app")!
        case .staging:
            return URL(string: "https://anchor-os-staging.web.app")!
        case .production:
            return URL(string: "https://anchor-os.web.app")!
        }
    }

    var firebasePlistName: String {
        switch self {
        case .development:
            return "GoogleService-Info-Development"
        case .staging:
            return "GoogleService-Info-Staging"
        case .production:
            return "GoogleService-Info-Production"
        }
    }
}

@MainActor
final class AppState: ObservableObject {
    @Published var environment: AppEnvironment = .development
    @Published var isAuthenticated: Bool = false
    @Published var currentUID: String? = nil
    @Published var isBusy: Bool = false
    @Published var statusMessage: String = "Native iOS starter."
    @Published var mfaResolver: MultiFactorResolver?
    /// Top-level tab routing. 0=Home 1=Tasks 2=Anchor 3=Finance 4=Settings.
    @Published var selectedTab: Int = 0

    /// Accepts PWA-style paths ("/finance", "/commitments") and switches
    /// to the matching native tab. Unknown paths are ignored.
    func navigate(to path: String) {
        let trimmed = path.hasPrefix("/") ? String(path.dropFirst()) : path
        switch trimmed {
        case "", "home", "dashboard":      selectedTab = 0
        case "commitments", "tasks":       selectedTab = 1
        case "fabric", "anchor", "anchor-ai": selectedTab = 2
        case "finance":                    selectedTab = 3
        case "settings":                   selectedTab = 4
        default:                           break
        }
    }

    private var authStateHandle: AuthStateDidChangeListenerHandle?

    deinit {
        if FirebaseApp.app() != nil {
            AuthService.shared.removeStateListener(authStateHandle)
        }
    }

    func bootstrap() {
        // WS-5 — XCUITests launch the app with ANCHOR_UI_TESTS=1 so we can
        // short-circuit Firebase configuration and land on a deterministic UI
        // without touching real auth/Firestore.
        if ProcessInfo.processInfo.environment["ANCHOR_UI_TESTS"] == "1" {
            statusMessage = "UI Test Mode"
            isAuthenticated = ProcessInfo.processInfo.environment["ANCHOR_UI_TEST_SIGNED_IN"] == "1"
            currentUID = isAuthenticated ? "uitest-uid" : nil
            return
        }
        statusMessage = FirebaseBootstrap.configure(environment: environment)
        guard FirebaseApp.app() != nil else {
            isAuthenticated = false
            return
        }
        bindAuthListener()
        if let uid = AuthService.shared.currentUserID() {
            isAuthenticated = true
            currentUID = uid
        }
    }

    func signIn(email: String, password: String) async {
        guard firebaseReady else { return }
        guard !email.isEmpty, !password.isEmpty else {
            statusMessage = "Email and password are required."
            return
        }
        isBusy = true
        defer { isBusy = false }
        do {
            try await AuthService.shared.signIn(email: email, password: password)
            statusMessage = "Signed in."
            isAuthenticated = true
            AuthEventService.recordEvent(method: "password")
        } catch let nsError as NSError {
            if nsError.code == 17409,
               let resolver = nsError.userInfo["FIRAuthErrorUserInfoMultiFactorResolverKey"] as? MultiFactorResolver {
                mfaResolver = resolver
                statusMessage = "MFA required."
            } else {
                statusMessage = "Sign in failed: \(nsError.localizedDescription)"
            }
        }
    }

    func signOut() {
        guard firebaseReady else {
            isAuthenticated = false
            return
        }
        do {
            try AuthService.shared.signOut()
            isAuthenticated = false
            statusMessage = "Signed out."
        } catch {
            statusMessage = "Sign out failed: \(error.localizedDescription)"
        }
    }

    func signUp(email: String, password: String, displayName: String) async {
        guard firebaseReady else { return }
        guard !email.isEmpty, !password.isEmpty else {
            statusMessage = "Email and password are required."
            return
        }
        isBusy = true
        defer { isBusy = false }
        do {
            _ = try await AuthService.shared.signUp(
                email: email, password: password, displayName: displayName
            )
            statusMessage = "Account created."
            isAuthenticated = true
            AuthEventService.recordEvent(method: "password")
        } catch {
            statusMessage = "Sign up failed: \(error.localizedDescription)"
        }
    }

    // MARK: - Password Reset

    func sendPasswordReset(email: String) async {
        guard firebaseReady else { return }
        isBusy = true
        defer { isBusy = false }
        do {
            try await AuthService.shared.sendPasswordReset(email: email)
            statusMessage = "Reset link sent to \(email)."
        } catch {
            statusMessage = "Reset failed: \(error.localizedDescription)"
        }
    }

    // MARK: - Environment

    func setEnvironment(_ newEnvironment: AppEnvironment) {
        environment = newEnvironment
        statusMessage = "Environment set to \(newEnvironment.rawValue). Restart app to reload Firebase config."
    }

    // MARK: - Private

    var firebaseReady: Bool {
        guard FirebaseApp.app() != nil else {
            statusMessage = "Firebase not configured. Check GoogleService plist files."
            return false
        }
        return true
    }

    private func bindAuthListener() {
        AuthService.shared.removeStateListener(authStateHandle)
        authStateHandle = AuthService.shared.addStateListener { [weak self] userID in
            Task { @MainActor in
                self?.isAuthenticated = (userID != nil)
                self?.currentUID = userID
            }
        }
    }
}
