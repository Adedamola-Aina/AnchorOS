import Foundation
import SwiftUI

/// Request-counter bus for tab re-tap scroll-to-top.
///
/// Parity:
///   - PWA `BottomNavigation.tsx` observes re-tap and runs
///     `window.scrollTo({ top: 0, behavior: 'smooth' })` on the active
///     tab's scroll container.
///   - On iOS the same UX is achieved by incrementing `scrollRequestId`
///     whenever the currently-selected tab is tapped again. Each root
///     tab view (Dashboard / Tasks / Anchor AI / Finance / Settings)
///     owns a `ScrollViewReader` + hidden top anchor and listens for
///     changes to `scrollRequestId` whose `targetTab` matches its own tag.
///   - Using a tick counter instead of a bool guarantees repeated re-taps
///     trigger repeated scrolls (boolean would miss the second re-tap).
@MainActor
final class TabScrollCoordinator: ObservableObject {
    /// Incremented every time a re-tap is detected. Views observe this
    /// and scroll when their tag matches `targetTab`.
    @Published private(set) var scrollRequestId: Int = 0
    /// Tab tag that requested the scroll. `-1` means none.
    @Published private(set) var targetTab: Int = -1

    func requestScrollToTop(tab: Int) {
        targetTab = tab
        scrollRequestId &+= 1
    }
}
