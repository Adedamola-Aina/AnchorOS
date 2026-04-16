import SwiftUI

/// Ask-Anchor-AI input + prompt chips + response card. Parity:
/// src/features/fabric/FabricQuerySection.tsx.
///
/// Contract:
///   - `text` bound to the input field
///   - `isQuerying` shows the animated "Thinking..." placeholder
///   - `result` renders the response card with optional detail + action
///     buttons
///   - `onSubmit()` fires on Send / return key; caller is responsible for
///     running the query (AnchorFabricStore does this today)
///   - `onAction` receives the already-typed `ActionKind`; the view never
///     routes directly — the owning view decides (parity with PWA where
///     FabricPage interprets payloads).
struct FabricQuerySection: View {
    @Binding var text: String
    let isQuerying: Bool
    let result: AnchorFabricQueryResult?
    var onSubmit: () -> Void
    var onPrompt: (String) -> Void
    var onGenerateWeeklyReport: () -> Void
    var onAction: (AnchorFabricQueryResult.ActionKind) -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("ASK ANCHOR AI")
                .font(.caption2.weight(.bold))
                .tracking(1.2)
                .foregroundStyle(AnchorPalette.textSecondary)

            HStack(spacing: 8) {
                TextField("What do I have today? Plan my week...", text: $text)
                    .textFieldStyle(.plain)
                    .padding(.horizontal, 12)
                    .frame(minHeight: 44)
                    .background(AnchorPalette.chip)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(AnchorPalette.cardBorder, lineWidth: 1))
                    .onSubmit(onSubmit)

                Button(action: onSubmit) {
                    Image(systemName: "paperplane.fill")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundStyle(.white)
                        .frame(width: 44, height: 44)
                        .background(AnchorPalette.chipActive)
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                        .opacity(canSubmit ? 1 : 0.4)
                }
                .buttonStyle(.plain)
                .disabled(!canSubmit)
                .accessibilityLabel("Send")
            }

            FabricPromptChips(onPrompt: onPrompt, onGenerateWeeklyReport: onGenerateWeeklyReport)

            if isQuerying || result != nil {
                responseCard
            }
        }
    }

    private var canSubmit: Bool {
        !text.trimmingCharacters(in: .whitespaces).isEmpty && !isQuerying
    }

    @ViewBuilder private var responseCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("RESPONSE")
                .font(.caption2.weight(.bold))
                .tracking(1.2)
                .foregroundStyle(AnchorPalette.textSecondary)

            if isQuerying {
                Text("Thinking...")
                    .font(.subheadline)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(16)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(RoundedRectangle(cornerRadius: 12).fill(AnchorPalette.chip))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(AnchorPalette.cardBorder, lineWidth: 1))
            } else if let r = result {
                VStack(alignment: .leading, spacing: 10) {
                    Text(r.summary)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(AnchorPalette.textPrimary)

                    if let d = r.detail {
                        Text(d)
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }

                    if !r.actions.isEmpty {
                        FlexibleHStack(spacing: 8) {
                            ForEach(Array(r.actions.enumerated()), id: \.offset) { _, action in
                                Button {
                                    onAction(action.kind)
                                } label: {
                                    Text(action.label)
                                        .font(.subheadline.weight(.medium))
                                        .foregroundStyle(.white)
                                        .padding(.horizontal, 16)
                                        .frame(minHeight: 44)
                                        .background(AnchorPalette.chipActive)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
                .padding(16)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(RoundedRectangle(cornerRadius: 12).fill(AnchorPalette.chip))
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(AnchorPalette.cardBorder, lineWidth: 1))
            }
        }
    }
}

/// Wraps action buttons. Minimal; horizontal stack that allows wrap.
private struct FlexibleHStack<Content: View>: View {
    let spacing: CGFloat
    @ViewBuilder let content: () -> Content
    var body: some View {
        HStack(spacing: spacing) { content() }
    }
}
