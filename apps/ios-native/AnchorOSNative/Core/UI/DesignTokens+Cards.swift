import SwiftUI

// MARK: - Design Tokens — Cards & Color Utilities
// Split from DesignTokens.swift for ARCH-001 compliance (≤ 200 lines).

extension DesignTokens {

    // MARK: Card colors — account type defaults
    enum CardTypeColors {
        static let checking   = Color(hex: 0x1E293B)
        static let savings    = Color(hex: 0x047857)
        static let salary     = Color(hex: 0x6D28D9)
        static let investment = Color(hex: 0xB45309)
    }

    // MARK: Card preset colors (user-selectable)
    static let presetCardColors: [Color] = [
        Color(hex: 0x1E1E2E), Color(hex: 0x2D3A4A), Color(hex: 0x1A1A2E),
        Color(hex: 0x3D52D5), Color(hex: 0x1E40AF), Color(hex: 0x0EA5E9),
        Color(hex: 0x1A7F6E), Color(hex: 0x059669), Color(hex: 0x16A34A),
        Color(hex: 0x8B1A4A), Color(hex: 0xDC2626), Color(hex: 0xBE185D),
        Color(hex: 0xB45309), Color(hex: 0xEA580C), Color(hex: 0xD97706),
        Color(hex: 0x6B21A8), Color(hex: 0x7C3AED), Color(hex: 0x9333EA),
    ]

    // MARK: Card preset hex strings (for Firestore storage)
    static let presetCardHexStrings: [String] = [
        "#1E1E2E", "#2D3A4A", "#1A1A2E",
        "#3D52D5", "#1E40AF", "#0EA5E9",
        "#1A7F6E", "#059669", "#16A34A",
        "#8B1A4A", "#DC2626", "#BE185D",
        "#B45309", "#EA580C", "#D97706",
        "#6B21A8", "#7C3AED", "#9333EA",
    ]

    // MARK: Default card colors (fallback cycle)
    static let defaultCardColors: [Color] = [
        Color(hex: 0x3D52D5), Color(hex: 0x1A7F6E),
        Color(hex: 0x8B1A4A), Color(hex: 0x2D3A4A),
        Color(hex: 0xB45309), Color(hex: 0x6B21A8),
        Color(hex: 0x0F766E),
    ]

    // MARK: Card dimensions (UX-041)
    static let cardAspectRatio: CGFloat = 2.2
    static let cardCornerRadius: CGFloat = 20
    static let cardHeaderReveal: CGFloat = 48
}

// MARK: - Color hex initializer

extension Color {
    init(hex: UInt, opacity: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255.0,
            green: Double((hex >> 8) & 0xFF) / 255.0,
            blue: Double(hex & 0xFF) / 255.0,
            opacity: opacity
        )
    }

    init(hexString: String, opacity: Double = 1.0) {
        let hex = hexString
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: "#", with: "")
        var value: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&value)
        self.init(hex: UInt(value), opacity: opacity)
    }
}
