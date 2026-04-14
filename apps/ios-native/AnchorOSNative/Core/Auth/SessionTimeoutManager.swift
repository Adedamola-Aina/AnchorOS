import Foundation
import Combine

// MARK: - SessionTimeoutManager
// SEC-009: Auto-logout on inactivity.
// Matches PWA session timeout pattern.
// Default: 30 min inactivity → sign out.

@MainActor
final class SessionTimeoutManager: ObservableObject {
    static let shared = SessionTimeoutManager()

    @Published var isWarningVisible = false

    private let timeoutInterval: TimeInterval = 30 * 60   // 30 minutes
    private let warningInterval: TimeInterval = 25 * 60   // Warn at 25 min
    private var lastActivityDate = Date()
    private var timer: Timer?
    private var onTimeout: (() -> Void)?

    private init() {}

    func start(onTimeout: @escaping () -> Void) {
        self.onTimeout = onTimeout
        recordActivity()
        startTimer()
        registerForAppLifecycle()
    }

    func stop() {
        timer?.invalidate()
        timer = nil
        isWarningVisible = false
        NotificationCenter.default.removeObserver(self)
    }

    func recordActivity() {
        lastActivityDate = Date()
        isWarningVisible = false
    }

    // MARK: - Private

    private func startTimer() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.checkTimeout() }
        }
    }

    private func checkTimeout() {
        let elapsed = Date().timeIntervalSince(lastActivityDate)
        if elapsed >= timeoutInterval {
            timer?.invalidate()
            isWarningVisible = false
            onTimeout?()
        } else if elapsed >= warningInterval {
            isWarningVisible = true
        }
    }

    private func registerForAppLifecycle() {
        NotificationCenter.default.addObserver(
            forName: UIApplication.willResignActiveNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            self?.timer?.invalidate()
        }
        NotificationCenter.default.addObserver(
            forName: UIApplication.didBecomeActiveNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            Task { @MainActor in
                self?.checkTimeout()
                self?.startTimer()
            }
        }
    }
}
