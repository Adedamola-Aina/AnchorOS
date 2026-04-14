import SwiftUI

// MARK: - RecoveryCodesSettingsView
// Shows existing recovery codes or option to regenerate.
// Accessed from Settings → Security → Recovery Codes.
// Matches PWA RecoveryCodesDisplay.tsx.

struct RecoveryCodesSettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var isLoading = false
    @State private var isRegenerating = false
    @State private var codes: [String] = []
    @State private var errorMessage: String?
    @State private var showRegenerateConfirm = false
    @State private var didCopy = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    headerSection

                    if isLoading {
                        ProgressView().tint(.white).frame(maxWidth: .infinity).padding(.top, 40)
                    } else if let error = errorMessage {
                        errorCard(error)
                    } else if codes.isEmpty {
                        emptyState
                    } else {
                        codesSection
                        actionButtons
                    }
                }
                .padding(24)
            }
            .background(AnchorBackground())
            .navigationTitle("Recovery Codes")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .alert("Regenerate Codes?", isPresented: $showRegenerateConfirm) {
                Button("Cancel", role: .cancel) {}
                Button("Regenerate", role: .destructive) { Task { await regenerate() } }
            } message: {
                Text("Your existing codes will stop working immediately. Save the new codes right away.")
            }
            .task { await loadCodes() }
        }
    }

    // MARK: — Sections

    private var headerSection: some View {
        VStack(spacing: 8) {
            Image(systemName: "key.2.on.ring.fill")
                .font(.system(size: 40))
                .foregroundStyle(AnchorPalette.warning)
            Text("Backup recovery codes")
                .font(AnchorTypography.h3)
                .foregroundStyle(AnchorPalette.textPrimary)
            Text("Use these if you lose access to your authenticator app. Each code works only once.")
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
    }

    private var codesSection: some View {
        VStack(spacing: 8) {
            Text("YOUR RECOVERY CODES")
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

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
                    .padding(.vertical, 6).padding(.horizontal, 12)
                    .background(AnchorPalette.chip)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
        }
    }

    private var actionButtons: some View {
        VStack(spacing: 10) {
            Button {
                UIPasteboard.general.string = codes.joined(separator: "\n")
                didCopy = true
            } label: {
                Label(didCopy ? "Copied!" : "Copy all codes", systemImage: didCopy ? "checkmark" : "doc.on.doc")
                    .font(AnchorTypography.body.weight(.semibold))
                    .foregroundStyle(AnchorPalette.chipActive)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(AnchorPalette.chip)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)

            Button { showRegenerateConfirm = true } label: {
                HStack {
                    Spacer()
                    if isRegenerating { ProgressView().tint(.white) }
                    else { Text("Regenerate Codes").fontWeight(.semibold) }
                    Spacer()
                }
                .padding(.vertical, 14)
                .background(AnchorPalette.danger.opacity(0.85))
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .buttonStyle(.plain)
            .disabled(isRegenerating)
        }
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "key.slash")
                .font(.system(size: 36))
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("No recovery codes found.")
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("Enable MFA first to generate backup codes.")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 40)
    }

    private func errorCard(_ message: String) -> some View {
        Text(message)
            .font(.footnote).foregroundStyle(AnchorPalette.danger)
            .padding(12)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AnchorPalette.danger.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: — Actions

    private func loadCodes() async {
        isLoading = true
        defer { isLoading = false }
        // Codes are stored hashed. We show plainText codes only if user just generated them.
        // For existing sessions we indicate codes exist but don't display them (security).
        do {
            let result = try await FirebaseFunctions.Functions.functions()
                .httpsCallable("getRecoveryCodes").call([:])
            let data = result.data as? [String: Any]
            let codesRemaining = data?["codesRemaining"] as? Int ?? 0
            if codesRemaining > 0 {
                codes = (0..<codesRemaining).map { _ in "••••-••••" }
            }
        } catch {
            // No codes stored yet — show empty state, not error
        }
    }

    private func regenerate() async {
        isRegenerating = true
        defer { isRegenerating = false }
        let generated = RecoveryCodeService.generate()
        codes = generated.plainCodes
        do {
            _ = try await FirebaseFunctions.Functions.functions()
                .httpsCallable("saveMfaRecoveryCodes").call([
                    "hashedCodes": generated.hashedCodes,
                    "codesRemaining": RecoveryCodeService.codeCount
                ])
            ToastStore.shared.show("Recovery codes regenerated. Save them now.", style: .info)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
