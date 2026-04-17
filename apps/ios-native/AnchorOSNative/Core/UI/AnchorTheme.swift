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

    @Published var mode: Mode {
        didSet {
            UserDefaults.standard.set(mode.rawValue, forKey: "anchor_theme_mode")
        }
    }

    init() {
        let raw = UserDefaults.standard.string(forKey: "anchor_theme_mode") ?? Mode.system.rawValue
        self.mode = Mode(rawValue: raw) ?? .system
    }

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

    func anchorDynamicType() -> some View {
        modifier(AnchorDynamicTypeModifier())
    }
}

// MARK: - Dynamic Type override from Settings

struct AnchorDynamicTypeModifier: ViewModifier {
    @AppStorage("anchor_font_size") private var fontSize: String = "Default"

    func body(content: Content) -> some View {
        content.dynamicTypeSize(resolvedSize)
    }

    private var resolvedSize: DynamicTypeSize {
        switch fontSize {
        case "Large":       return .xLarge
        case "Extra Large": return .xxLarge
        default:            return .large
        }
    }
}
