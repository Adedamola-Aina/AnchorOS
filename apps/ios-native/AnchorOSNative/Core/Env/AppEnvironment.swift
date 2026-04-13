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

    private var authStateHandle: AuthStateDidChangeListenerHandle?

    deinit {
        if FirebaseApp.app() != nil {
            AuthService.shared.removeStateListener(authStateHandle)
        }
    }

    func bootstrap() {
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
        guard FirebaseApp.app() != nil else {
            statusMessage = "Firebase not configured. Check GoogleService plist files."
            return
        }
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
        } catch {
            statusMessage = "Sign in failed: \(error.localizedDescription)"
        }
    }

    func signOut() {
        guard FirebaseApp.app() != nil else {
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

    func setEnvironment(_ newEnvironment: AppEnvironment) {
        environment = newEnvironment
        statusMessage = "Environment set to \(newEnvironment.rawValue). Restart app to reload Firebase config."
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
