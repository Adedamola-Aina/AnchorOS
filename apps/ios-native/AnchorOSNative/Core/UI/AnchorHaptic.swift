import UIKit

/// Native parity wrapper for `src/utils/haptic.ts` + `src/hooks/useHaptic.ts`.
///
/// PWA pattern → iOS generator mapping:
///   .light    → navigator.vibrate(10)                   → UIImpactFeedbackGenerator(.light)
///   .medium   → navigator.vibrate(25)                   → UIImpactFeedbackGenerator(.medium)
///   .heavy    → navigator.vibrate(50)                   → UIImpactFeedbackGenerator(.heavy)
///   .success  → navigator.vibrate([15, 50, 15])         → UINotificationFeedbackGenerator().notificationOccurred(.success)
///   .error    → navigator.vibrate([50, 50, 50, 50, 50]) → UINotificationFeedbackGenerator().notificationOccurred(.error)
///   .selection → navigator.vibrate(10)                  → UIImpactFeedbackGenerator(.light)
///
/// Reduce Motion is honored implicitly: iOS suppresses haptics when
/// the system "Haptic Touch" / "System Haptics" toggle is off.
enum AnchorHaptic {
    case light
    case medium
    case heavy
    case success
    case error
    case selection

    /// Fire the haptic. Matches PWA `haptic.light()` / `useHaptic('success')`.
    func fire() {
        switch self {
        case .light, .selection:
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
        case .medium:
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        case .heavy:
            UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
        case .success:
            UINotificationFeedbackGenerator().notificationOccurred(.success)
        case .error:
            UINotificationFeedbackGenerator().notificationOccurred(.error)
        }
    }
}
