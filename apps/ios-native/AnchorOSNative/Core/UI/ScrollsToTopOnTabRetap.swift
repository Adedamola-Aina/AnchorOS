import SwiftUI

/// Reusable helper that lets each root tab's `ScrollView` respond to a
/// `TabScrollCoordinator` re-tap request by scrolling to its hidden top
/// anchor. Usage:
///
///     ScrollView {
///         Color.clear.frame(height: 0).id(ScrollToTopAnchor.id)
///         // ... content ...
///     }
///     .scrollsToTopOnTabRetap(tab: 3)
///
/// The `.scrollsToTopOnTabRetap(tab:)` modifier must be applied _inside_
/// a `ScrollViewReader`, which is why the helper wraps the content.
enum ScrollToTopAnchor {
    static let id: String = "__tab_scroll_top__"
}

struct ScrollsToTopOnTabRetap: ViewModifier {
    let tab: Int
    @EnvironmentObject private var tabScroll: TabScrollCoordinator

    func body(content: Content) -> some View {
        ScrollViewReader { proxy in
            content
                .onChange(of: tabScroll.scrollRequestId) { _, _ in
                    guard tabScroll.targetTab == tab else { return }
                    withAnimation(.easeInOut(duration: 0.35)) {
                        proxy.scrollTo(ScrollToTopAnchor.id, anchor: .top)
                    }
                }
        }
    }
}

extension View {
    /// Wraps the view in a `ScrollViewReader` and scrolls to the hidden
    /// `ScrollToTopAnchor.id` anchor whenever the coordinator emits a
    /// re-tap request matching `tab`.
    func scrollsToTopOnTabRetap(tab: Int) -> some View {
        modifier(ScrollsToTopOnTabRetap(tab: tab))
    }
}
