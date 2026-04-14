import SwiftUI

// MARK: - AnchorTypography
// Type scale matching PWA @utility text-* definitions from index.css.
// Uses SF Pro (system font) per Apple HIG; PWA uses system stack too.

enum AnchorTypography {

    // MARK: Scale

    /// 36pt / heavy — hero sections
    static let display = Font.system(size: 36, weight: .heavy)

    /// 30pt / bold — page titles
    static let h1 = Font.system(size: 30, weight: .bold)

    /// 24pt / bold — section headers
    static let h2 = Font.system(size: 24, weight: .bold)

    /// 20pt / semibold — subsections
    static let h3 = Font.system(size: 20, weight: .semibold)

    /// 16pt / medium — main text
    static let body = Font.system(size: 16, weight: .medium)

    /// 14pt / semibold — labels, captions
    static let small = Font.system(size: 14, weight: .semibold)

    /// 12pt / medium — fine print, timestamps
    static let caption = Font.system(size: 12, weight: .medium)

    // MARK: Financial — monospaced for vertically-aligned numbers

    /// 20pt monospaced — account balances
    static let financeLarge = Font.system(size: 20, weight: .bold).monospacedDigit()

    /// 16pt monospaced — transaction amounts
    static let financeMedium = Font.system(size: 16, weight: .semibold).monospacedDigit()

    /// 14pt monospaced — smaller financial values
    static let financeSmall = Font.system(size: 14, weight: .medium).monospacedDigit()
}

// MARK: - View Modifier for text style

struct AnchorTextStyle: ViewModifier {
    let font: Font
    let color: Color

    func body(content: Content) -> some View {
        content
            .font(font)
            .foregroundStyle(color)
    }
}

extension View {
    func anchorText(_ font: Font, color: Color = AnchorPalette.textPrimary) -> some View {
        modifier(AnchorTextStyle(font: font, color: color))
    }
}
