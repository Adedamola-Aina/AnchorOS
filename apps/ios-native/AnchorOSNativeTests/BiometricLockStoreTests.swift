import XCTest
@testable import AnchorOSNative

@MainActor
final class BiometricLockStoreTests: XCTestCase {
    func test_lockStateStartsUnlockedWhenDisabled() {
        let store = BiometricLockStore()
        store.isEnabled = false
        store.evaluateForegroundLock()
        XCTAssertFalse(store.isLocked)
    }

    func test_foregroundLockRequiresUnlockWhenEnabled() {
        let store = BiometricLockStore()
        store.isEnabled = true
        store.evaluateForegroundLock()
        XCTAssertTrue(store.isLocked)
    }

    func test_manualUnlockClearsLockState() {
        let store = BiometricLockStore()
        store.isEnabled = true
        store.evaluateForegroundLock()
        store.markUnlockedForCurrentSession()
        XCTAssertFalse(store.isLocked)
    }
}
