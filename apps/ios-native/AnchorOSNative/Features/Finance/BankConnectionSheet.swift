import SwiftUI

/// Native bank-link handoff using the secure web flow already supported by Anchor.
struct BankConnectionSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL
    @AppStorage("anchor_bank_connected") private var bankConnected = false
    @AppStorage("anchor_bank_last_sync") private var bankLastSync = "Not yet synced"

    private var handoffURL: URL {
        URL(string: "https://anchor-os.web.app/finance?native=ios&returnTo=anchoros%3A%2F%2Ffinance%3Fbank%3Dconnected")!
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorCard(title: "Bank Connection", icon: "building.columns") {
                        VStack(alignment: .leading, spacing: 12) {
                            Text(bankConnected ? "Your bank connection is active and ready to sync." : "Connect your bank using the secure Anchor handoff and return automatically to the app.")
                                .font(.subheadline)
                                .foregroundStyle(AnchorPalette.textPrimary)

                            HStack(spacing: 8) {
                                Image(systemName: bankConnected ? "checkmark.seal.fill" : "lock.shield.fill")
                                    .foregroundStyle(bankConnected ? AnchorPalette.success : AnchorPalette.chipActive)
                                Text(bankConnected ? "Last sync: \(bankLastSync)" : "Your credentials stay inside the secure provider flow.")
                                    .font(.caption)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                            }

                            Button {
                                AnchorHaptics.light()
                                bankLastSync = DateFormatter.localizedString(from: Date(), dateStyle: .medium, timeStyle: .short)
                                openURL(handoffURL)
                            } label: {
                                HStack { Spacer(); Text(bankConnected ? "Manage Connection" : "Connect Bank").fontWeight(.semibold); Spacer() }
                                    .padding(.vertical, 12)
                                    .background(AnchorPalette.chipActive)
                                    .foregroundStyle(.white)
                                    .clipShape(RoundedRectangle(cornerRadius: 10))
                            }
                            .buttonStyle(.plain)

                            if bankConnected {
                                Button {
                                    AnchorHaptics.selection()
                                    bankConnected = false
                                    bankLastSync = "Disconnected"
                                } label: {
                                    HStack { Spacer(); Text("Disconnect Bank").fontWeight(.semibold); Spacer() }
                                        .padding(.vertical, 12)
                                        .background(AnchorPalette.danger.opacity(0.12))
                                        .foregroundStyle(AnchorPalette.danger)
                                        .clipShape(RoundedRectangle(cornerRadius: 10))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Banking")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() } } }
        }
    }
}
