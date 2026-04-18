import SwiftUI
import UIKit

// MARK: - Semantic Palette
// Auto-resolves light/dark via UIColor dynamic provider.
// All hex values sourced from DesignTokens.swift (PWA parity).
// Static properties — zero call-site changes required.

enum AnchorPalette {

    // MARK: Backgrounds

    static let background      = adaptive(light: AnchorDesignTokenCatalog.hex("surface.light.1", fallback: 0xF8FAFC), dark: AnchorDesignTokenCatalog.hex("surface.dark.1", fallback: 0x0A0F1A))
    static let surface         = adaptive(light: AnchorDesignTokenCatalog.hex("surface.light.2", fallback: 0xFFFFFF), dark: AnchorDesignTokenCatalog.hex("surface.dark.2", fallback: 0x0F172A))
    static let surfaceElevated = adaptive(light: AnchorDesignTokenCatalog.hex("surface.light.3", fallback: 0xF1F5F9), dark: AnchorDesignTokenCatalog.hex("surface.dark.3", fallback: 0x1E293B))

    // MARK: Cards

    static let card = adaptive(light: AnchorDesignTokenCatalog.hex("surface.light.2", fallback: 0xFFFFFF), dark: AnchorDesignTokenCatalog.hex("surface.dark.2", fallback: 0x0F172A))
    // PWA: border-slate-200 dark:border-slate-800
    static let cardBorder = adaptive(light: AnchorDesignTokenCatalog.hex("slate.200", fallback: 0xE2E8F0), dark: AnchorDesignTokenCatalog.hex("slate.800", fallback: 0x1E293B))

    // MARK: Chips

    static let chip      = adaptive(light: AnchorDesignTokenCatalog.hex("surface.light.3", fallback: 0xF1F5F9), dark: AnchorDesignTokenCatalog.hex("slate.700", fallback: 0x334155))
    static let chipActive = DesignTokens.Primary.p600

    // MARK: Text

    static let textPrimary   = adaptive(light: 0x0F172A, dark: 0xFFFFFF)
    static let textSecondary = adaptive(light: AnchorDesignTokenCatalog.hex("slate.500", fallback: 0x64748B), dark: AnchorDesignTokenCatalog.hex("slate.400", fallback: 0x94A3B8))

    // MARK: Status

    static let success = adaptive(light: AnchorDesignTokenCatalog.hex("status.success.light", fallback: 0x10B981), dark: AnchorDesignTokenCatalog.hex("status.success.dark", fallback: 0x34D399))
    static let warning = adaptive(light: AnchorDesignTokenCatalog.hex("status.warning.light", fallback: 0xF59E0B), dark: AnchorDesignTokenCatalog.hex("status.warning.dark", fallback: 0xFBBF24))
    static let danger  = adaptive(light: AnchorDesignTokenCatalog.hex("status.error.light", fallback: 0xF43F5E), dark: AnchorDesignTokenCatalog.hex("status.error.dark", fallback: 0xF87171))

    // MARK: Focus

    static let focusRing = adaptive(light: AnchorDesignTokenCatalog.hex("focus.light", fallback: 0x06B6D4), dark: AnchorDesignTokenCatalog.hex("focus.dark", fallback: 0x22D3EE))

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
