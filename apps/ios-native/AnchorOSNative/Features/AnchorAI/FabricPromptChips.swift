import SwiftUI

/// Horizontal scroll strip of canned prompts. Parity: mirrors
/// src/features/fabric/FabricPromptChips.tsx. Nine chips, same order.
///
/// Interaction parity:
///   - Tap → prefill the text input and submit via `onPrompt`
///   - "Generate weekly report" is the only chip that calls
///     `onGenerateWeeklyReport` instead (matches PWA hoisted action).
///   - All chips min-height 44pt (touch target).
struct FabricPromptChips: View {
    let onPrompt: (String) -> Void
    let onGenerateWeeklyReport: () -> Void

    private struct Chip: Identifiable {
        let id: String
        let label: String
        let prompt: String
        var isWeeklyReport: Bool = false
    }

    private let chips: [Chip] = [
        Chip(id: "today",           label: "What's today?",              prompt: "what do i have today"),
        Chip(id: "upcoming",        label: "What's coming up?",          prompt: "what's coming up"),
        Chip(id: "plan-week",       label: "Plan my week",               prompt: "plan my week"),
        Chip(id: "spending-month",  label: "Spending this month",        prompt: "how much did i spend this month"),
        Chip(id: "savings-rate",    label: "Am I saving enough?",        prompt: "what is my savings rate this month"),
        Chip(id: "habits-spending", label: "Habits vs spending",         prompt: "how do my habits connect to my spending"),
        Chip(id: "how-doing",       label: "How am I doing?",            prompt: "how am i doing this week"),
        Chip(id: "log-transaction", label: "Log a transaction",          prompt: "record an expense"),
        Chip(id: "weekly-report",   label: "Generate weekly report",     prompt: "generate weekly report", isWeeklyReport: true),
    ]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(chips) { chip in
                    Button {
                        if chip.isWeeklyReport { onGenerateWeeklyReport() }
                        else { onPrompt(chip.prompt) }
                    } label: {
                        Text(chip.label)
                            .font(.subheadline.weight(.medium))
                            .foregroundStyle(AnchorPalette.textPrimary)
                            .padding(.horizontal, 16)
                            .frame(minHeight: 44)
                            .background(AnchorPalette.chip)
                            .clipShape(Capsule())
                            .overlay(Capsule().stroke(AnchorPalette.cardBorder, lineWidth: 1))
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 1)
        }
    }
}
