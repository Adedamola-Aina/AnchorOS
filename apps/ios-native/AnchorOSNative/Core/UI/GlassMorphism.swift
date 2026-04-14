import SwiftUI

// MARK: - Glass Morphism View Modifiers
// Matches PWA .glass, .glass-card, .glass-interactive from index.css.

struct GlassModifier: ViewModifier {
    @Environment(\.colorScheme) private var scheme

    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial)
            .background(AnchorPalette.glassBg)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(AnchorPalette.glassBorder, lineWidth: 1)
            )
    }
}

struct GlassCardModifier: ViewModifier {
    @Environment(\.colorScheme) private var scheme

    func body(content: Content) -> some View {
        content
            .background(AnchorPalette.card)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(AnchorPalette.glassBorder, lineWidth: 1)
            )
            .shadow(
                color: scheme == .dark
                    ? .black.opacity(0.3)
                    : .black.opacity(0.05),
                radius: scheme == .dark ? 8 : 2,
                y: scheme == .dark ? 4 : 1
            )
    }
}

struct GlassInteractiveModifier: ViewModifier {
    @Environment(\.colorScheme) private var scheme

    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial)
            .background(AnchorPalette.glassBg)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(AnchorPalette.glassBorder, lineWidth: 1)
            )
    }
}

// MARK: - View Extensions

extension View {
    func glass() -> some View {
        modifier(GlassModifier())
    }

    func glassCard() -> some View {
        modifier(GlassCardModifier())
    }

    func glassInteractive() -> some View {
        modifier(GlassInteractiveModifier())
    }
}
