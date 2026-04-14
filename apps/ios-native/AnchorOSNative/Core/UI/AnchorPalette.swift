import SwiftUI
import UIKit

// MARK: - Semantic Palette
// Auto-resolves light/dark via UIColor dynamic provider.
// All hex values sourced from DesignTokens.swift (PWA parity).
// Static properties — zero call-site changes required.

enum AnchorPalette {

    // MARK: Backgrounds

    static let background       = adaptive(light: 0xF8FAFC, dark: 0x0A0F1A)
    static let surface          = adaptive(light: 0xFFFFFF, dark: 0x0F172A)
    static let surfaceElevated  = adaptive(light: 0xF1F5F9, dark: 0x1E293B)
    static let backgroundGlowTop    = DesignTokens.Primary.p800
    static let backgroundGlowBottom = Color(hex: 0x0F766E)

    // MARK: Cards

    static let card = adaptive(light: 0xFFFFFF, dark: 0x0F172A)
    static let cardBorder = Color(UIColor { traits in
        traits.userInterfaceStyle == .dark
            ? UIColor(white: 1.0, alpha: 0.05)
            : UIColor(white: 1.0, alpha: 0.3)
    })

    // MARK: Chips

    static let chip      = adaptive(light: 0xF1F5F9, dark: 0x334155)
    static let chipActive = DesignTokens.Primary.p600

    // MARK: Text

    static let textPrimary   = adaptive(light: 0x0F172A, dark: 0xFFFFFF)
    static let textSecondary = adaptive(light: 0x64748B, dark: 0x94A3B8)

    // MARK: Status

    static let success = adaptive(light: 0x10B981, dark: 0x34D399)
    static let warning = adaptive(light: 0xF59E0B, dark: 0xFBBF24)
    static let danger  = adaptive(light: 0xF43F5E, dark: 0xF87171)

    // MARK: Focus

    static let focusRing = adaptive(light: 0x06B6D4, dark: 0x22D3EE)

    // MARK: Brand (same in both modes)

    static let primary = DesignTokens.Primary.p600
    static let finance = DesignTokens.Finance.f600
    static let task    = DesignTokens.Task.t600
    static let family  = DesignTokens.Family.o600

    // MARK: Glass

    static let glassBg = Color(UIColor { traits in
        traits.userInterfaceStyle == .dark
            ? UIColor(red: 15/255, green: 23/255, blue: 42/255, alpha: 0.6)
            : UIColor(white: 1.0, alpha: 0.7)
    })

    static let glassBorder = Color(UIColor { traits in
        traits.userInterfaceStyle == .dark
            ? UIColor(white: 1.0, alpha: 0.05)
            : UIColor(white: 1.0, alpha: 0.3)
    })

    static let glassBlurRadius: CGFloat = 16

    // MARK: Border

    static let border = adaptive(light: 0xE5E7EB, dark: 0x334155)

    // MARK: - Private

    private static func adaptive(light: UInt, dark: UInt) -> Color {
        Color(UIColor { traits in
            let hex = traits.userInterfaceStyle == .dark ? dark : light
            return UIColor(
                red: CGFloat((hex >> 16) & 0xFF) / 255.0,
                green: CGFloat((hex >> 8) & 0xFF) / 255.0,
                blue: CGFloat(hex & 0xFF) / 255.0,
                alpha: 1.0
            )
        })
    }
}
