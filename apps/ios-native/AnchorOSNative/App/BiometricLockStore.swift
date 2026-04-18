import Foundation
import LocalAuthentication

@MainActor
final class BiometricLockStore: ObservableObject {
    private static let enabledKey = "anchor_biometric_lock_enabled"

    @Published var isEnabled: Bool {
        didSet {
            UserDefaults.standard.set(isEnabled, forKey: Self.enabledKey)
            if !isEnabled { isLocked = false }
        }
    }
    @Published private(set) var isLocked = false
    @Published private(set) var isAvailable = false
    /// WS-8 — raised while the app is in the inactive/background phase so
    /// the root view can overlay a privacy curtain before iOS takes the
    /// snapshot shown in the app switcher. Independent of `isLocked`
    /// because it applies even when biometric lock is disabled.
    @Published private(set) var isAppSwitcherHidden = false
    @Published var biometryLabel = "Biometric Lock"
    @Published var lastError: String?

    init() {
        self.isEnabled = UserDefaults.standard.bool(forKey: Self.enabledKey)
        refreshAvailability()
    }

    func evaluateForegroundLock() {
        refreshAvailability()
        isAppSwitcherHidden = false
        guard isEnabled else {
            isLocked = false
            return
        }
        isLocked = isAvailable
    }

    /// WS-8 — called from `.onChange(of: scenePhase)` for inactive/background
    /// transitions so the root view overlays a blur curtain before iOS takes
    /// the app-switcher snapshot.
    func setAppSwitcherHidden(_ hidden: Bool) {
        isAppSwitcherHidden = hidden
    }

    func markUnlockedForCurrentSession() {
        isLocked = false
        lastError = nil
    }

    func unlock() async {
        guard isEnabled else {
            markUnlockedForCurrentSession()
            return
        }

        let context = LAContext()
        var error: NSError?
        let canEvaluate = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
        isAvailable = canEvaluate

        guard canEvaluate else {
            lastError = error?.localizedDescription ?? "Biometric authentication is unavailable on this device."
            isLocked = false
            return
        }

        biometryLabel = Self.label(for: context.biometryType)
        let success = await withCheckedContinuation { continuation in
            context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: "Unlock Anchor OS"
            ) { ok, authError in
                if let authError {
                    continuation.resume(returning: (ok, authError.localizedDescription))
                } else {
                    continuation.resume(returning: (ok, nil))
                }
            }
        }

        if success.0 {
            AnchorHaptics.success()
            markUnlockedForCurrentSession()
        } else {
            AnchorHaptics.error()
            lastError = success.1 ?? "Authentication failed."
            isLocked = true
        }
    }

    private func refreshAvailability() {
        let context = LAContext()
        var error: NSError?
        isAvailable = context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
        biometryLabel = Self.label(for: context.biometryType)
        if !isAvailable, !isEnabled {
            lastError = nil
        }
    }

    private static func label(for biometryType: LABiometryType) -> String {
        switch biometryType {
        case .faceID: return "Face ID"
        case .touchID: return "Touch ID"
        default: return "Biometric Lock"
        }
    }
}
