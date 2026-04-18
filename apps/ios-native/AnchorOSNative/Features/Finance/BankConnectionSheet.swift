import SwiftUI

/// Native bank-link handoff using the secure web flow already supported by Anchor.
struct BankConnectionSheet: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL
    @AppStorage("anchor_bank_connected") private var bankConnected = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorCard(title: "Bank Connection", icon: "building.columns") {
                        VStack(alignment: .leading, spacing: 12) {
                            Text(bankConnected ? "Your bank connection is active." : "Connect your bank using the secure Anchor web handoff.")
                                .font(.subheadline)
                                .foregroundStyle(AnchorPalette.textPrimary)

                            Button {
                                bankConnected = true
                                openURL(URL(string: "https://anchor-os.web.app/finance")!)
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
                                    bankConnected = false
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
