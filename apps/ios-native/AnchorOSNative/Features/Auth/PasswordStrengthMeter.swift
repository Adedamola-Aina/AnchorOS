import SwiftUI

// MARK: - PasswordStrengthMeter
// Visual indicator matching PWA PasswordStrengthMeter.tsx.
// Shows strength bar + requirement badges during signup.

struct PasswordStrengthMeter: View {
    let password: String

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Header
            HStack {
                Text("SECURITY STRENGTH")
                    .font(.system(size: 10, weight: .black))
                    .tracking(1)
                    .foregroundStyle(AnchorPalette.textSecondary)
                Spacer()
                Text(strengthLabel)
                    .font(AnchorTypography.caption)
                    .foregroundStyle(strengthColor)
            }

            // Bar
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(AnchorPalette.chip)
                        .frame(height: 6)

                    RoundedRectangle(cornerRadius: 4)
                        .fill(strengthColor)
                        .frame(width: geo.size.width * barFraction, height: 6)
                        .animation(.easeOut(duration: 0.3), value: strength)
                }
            }
            .frame(height: 6)

            // Requirements
            HStack(spacing: 8) {
                ForEach(requirements, id: \.label) { req in
                    requirementBadge(req.label, met: req.check(password))
                }
            }
        }
        .padding(12)
        .background(AnchorPalette.chip.opacity(0.4))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: - Strength Calculation

    private var strength: Int {
        guard !password.isEmpty else { return 0 }
        var score = 0
        if password.count >= 8  { score += 1 }
        if password.count >= 12 { score += 1 }
        if password.range(of: "[A-Z]", options: .regularExpression) != nil { score += 1 }
        if password.range(of: "[0-9]", options: .regularExpression) != nil { score += 1 }
        if password.range(of: "[!@#$%^&*(),.?\":{}|<>]", options: .regularExpression) != nil { score += 1 }
        return score
    }

    private var strengthLabel: String {
        let labels = ["Weak", "Fair", "Good", "Strong", "Extra Secure", "Ironclad"]
        return labels[min(strength, labels.count - 1)]
    }

    private var strengthColor: Color {
        switch strength {
        case 0: return AnchorPalette.textSecondary
        case 1: return AnchorPalette.danger
        case 2: return AnchorPalette.warning
        case 3: return AnchorPalette.warning
        case 4: return AnchorPalette.success
        default: return Color(hex: 0x06B6D4) // cyan
        }
    }

    private var barFraction: CGFloat {
        CGFloat(strength) / 5.0
    }

    private struct Requirement {
        let label: String
        let check: (String) -> Bool
    }

    private var requirements: [Requirement] {
        [
            Requirement(label: "12+ chars") { $0.count >= 12 },
            Requirement(label: "Uppercase") { $0.range(of: "[A-Z]", options: .regularExpression) != nil },
            Requirement(label: "Number") { $0.range(of: "[0-9]", options: .regularExpression) != nil },
            Requirement(label: "Symbol") { $0.range(of: "[!@#$%^&*(),.?\":{}|<>]", options: .regularExpression) != nil },
        ]
    }

    @ViewBuilder
    private func requirementBadge(_ label: String, met: Bool) -> some View {
        HStack(spacing: 4) {
            Image(systemName: met ? "checkmark.circle.fill" : "circle")
                .font(.system(size: 10))
                .foregroundStyle(met ? AnchorPalette.success : AnchorPalette.textSecondary)
            Text(label)
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(met ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
        }
    }
}
