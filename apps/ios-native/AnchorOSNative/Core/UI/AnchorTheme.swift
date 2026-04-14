import SwiftUI

// MARK: - AnchorTheme
// Observable theme state for the app. Injected as @EnvironmentObject.
// Coordinates dark mode preference, system override, and reduced motion.

@MainActor
final class AnchorTheme: ObservableObject {

    enum Mode: String, CaseIterable, Identifiable {
        case system, light, dark
        var id: String { rawValue }
    }

    @AppStorage("anchor_theme_mode") var mode: Mode = .system

    var resolvedColorScheme: ColorScheme? {
        switch mode {
        case .system: return nil
        case .light:  return .light
        case .dark:   return .dark
        }
    }
}

// MARK: - View modifier for injecting preferred color scheme

struct AnchorThemeModifier: ViewModifier {
    @EnvironmentObject private var theme: AnchorTheme

    func body(content: Content) -> some View {
        content
            .preferredColorScheme(theme.resolvedColorScheme)
    }
}

extension View {
    func anchorTheme() -> some View {
        modifier(AnchorThemeModifier())
    }
}
