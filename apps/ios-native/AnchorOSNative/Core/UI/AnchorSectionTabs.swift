import SwiftUI

/// Horizontal section tabs — parity with src/components/SectionNav.tsx.
///
/// Interaction parity:
///   - Tap a label \u2192 calls `onSelect(label)`. Owners wire this to a
///     `ScrollViewReader.scrollTo(label, anchor: .top)` to jump the
///     containing ScrollView to the matching anchored section. Mirrors
///     PWA SectionNav behaviour (scrollIntoView({ behavior: 'smooth' })).
///   - Selected label renders with the active chip palette for immediate
///     feedback. Tracked state is caller-owned so re-taps still emit
///     `onSelect` (matches PWA re-tap scrolling back to section).
struct AnchorSectionTabs: View {
    let labels: [String]
    var selected: String? = nil
    var onSelect: (String) -> Void = { _ in }

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(labels, id: \.self) { label in
                    Button {
                        onSelect(label)
                    } label: {
                        AnchorChip(label: label, isActive: selected == label)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Jump to \(label) section")
                }
            }
        }
    }
}

