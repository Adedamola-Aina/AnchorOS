import SwiftUI

// MARK: - RecoveryCodesView
// Displays 8 backup codes after MFA enrollment (shown ONCE).
// Matches PWA recovery codes display in useMfaEnrollmentUI.

struct RecoveryCodesView: View {
    let codes: [String]
    let onDone: () -> Void

    @State private var copied = false

    var body: some View {
        VStack(spacing: 24) {
            headerSection

            codesGrid

            warningBanner

            actionButtons

            Spacer()
        }
        .padding(24)
    }

    // MARK: - Sections

    private var headerSection: some View {
        VStack(spacing: 8) {
            Image(systemName: "key.2.on.ring.fill")
                .font(.system(size: 40))
                .foregroundStyle(AnchorPalette.warning)

            Text("Save your recovery codes")
                .font(AnchorTypography.h2)
                .foregroundStyle(AnchorPalette.textPrimary)

            Text("These codes can be used to access your account if you lose your authenticator. Each code works only once.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
    }

    private var codesGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
            ForEach(Array(codes.enumerated()), id: \.offset) { index, code in
                HStack(spacing: 8) {
                    Text("\(index + 1).")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .frame(width: 20, alignment: .trailing)
                    Text(code)
                        .font(.system(.body, design: .monospaced))
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Spacer()
                }
                .padding(.vertical, 6)
                .padding(.horizontal, 12)
                .background(AnchorPalette.chip)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
    }

    private var warningBanner: some View {
        HStack(spacing: 10) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(AnchorPalette.danger)
            Text("These codes will not be shown again. Store them safely.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.danger)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AnchorPalette.danger.opacity(0.1))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    private var actionButtons: some View {
        VStack(spacing: 12) {
            Button {
                UIPasteboard.general.string = codes.joined(separator: "\n")
                copied = true
            } label: {
                Label(copied ? "Copied!" : "Copy codes", systemImage: copied ? "checkmark" : "doc.on.doc")
                    .font(AnchorTypography.body.weight(.semibold))
                    .foregroundStyle(AnchorPalette.chipActive)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(AnchorPalette.chip)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)

            Button(action: onDone) {
                Text("I've saved my codes")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 16)
                    .background(AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
        }
    }
}
