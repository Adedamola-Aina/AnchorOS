import Foundation

// MARK: - AuthRateLimiter
// SEC-004: Exponential back-off on failed auth attempts.
// Matches PWA useAuthRateLimit.ts behavior.

@MainActor
final class AuthRateLimiter: ObservableObject {

    @Published private(set) var isLocked = false
    @Published private(set) var remainingSeconds = 0
    @Published private(set) var failures = 0

    private var lockoutEndsAt: Date?
    private var firstFailureAt: Date?
    private var timer: Timer?

    private let maxFreeAttempts = 5
    private let baseBackoff: TimeInterval = 2
    private let maxLockout: TimeInterval = 300 // 5 minutes
    private let attemptWindow: TimeInterval = 3600 // 1 hour

    var lockoutMessage: String? {
        guard isLocked else { return nil }
        return "Too many attempts. Try again in \(remainingSeconds)s."
    }

    /// Call on each auth submission. Returns false if rate-limited.
    func recordFailure() -> Bool {
        let now = Date()

        // Reset window if first failure was too long ago
        if let first = firstFailureAt, now.timeIntervalSince(first) > attemptWindow {
            failures = 0
            firstFailureAt = nil
        }

        if failures == 0 { firstFailureAt = now }
        failures += 1

        let excess = failures - maxFreeAttempts
        guard excess > 0 else { return true }

        let backoff = min(baseBackoff * pow(2, Double(excess - 1)), maxLockout)
        lockoutEndsAt = now.addingTimeInterval(backoff)
        isLocked = true
        startCountdown()
        return false
    }

    /// Call on successful auth.
    func recordSuccess() {
        failures = 0
        firstFailureAt = nil
        isLocked = false
        lockoutEndsAt = nil
        remainingSeconds = 0
        timer?.invalidate()
    }

    private func startCountdown() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                self?.tick()
            }
        }
        tick()
    }

    private func tick() {
        guard let end = lockoutEndsAt else { return }
        let remaining = Int(ceil(end.timeIntervalSinceNow))
        if remaining <= 0 {
            isLocked = false
            lockoutEndsAt = nil
            remainingSeconds = 0
            timer?.invalidate()
        } else {
            remainingSeconds = remaining
        }
    }
}
