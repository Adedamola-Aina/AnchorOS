import SwiftUI

/// Parity with src/features/settings/components/PendingInviteCard.tsx.
/// iOS receives invites via universal links into FamilyStore.acceptInvitation,
/// but users also need a manual-paste fallback when the link path fails
/// (Mail/Messages app quirks). This card provides that fallback.
struct PendingInviteCard: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @State private var token: String = ""
    @State private var isBusy: Bool = false
    @State private var error: String? = nil

    var body: some View {
        AnchorCard(title: "Have an Invite Code?", icon: "envelope.badge") {
            VStack(alignment: .leading, spacing: 12) {
                Text("Paste the code from your partner's invite link to connect finances.")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)

                TextField("Invite code", text: $token)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .padding(12)
                    .background(AnchorPalette.chip.opacity(0.5))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(AnchorPalette.cardBorder, lineWidth: 1)
                    )

                if let err = error {
                    Text(err)
                        .font(.caption).fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.danger)
                }

                Button { Task { await accept() } } label: {
                    HStack {
                        if isBusy { ProgressView().tint(.white) }
                        Text(isBusy ? "Connecting…" : "Connect")
                            .fontWeight(.semibold)
                            .foregroundStyle(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(token.isEmpty ? AnchorPalette.chipActive.opacity(0.4) : AnchorPalette.chipActive)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
                .disabled(token.isEmpty || isBusy)
            }
        }
    }

    private func accept() async {
        isBusy = true
        error = nil
        defer { isBusy = false }
        do {
            try await familyStore.acceptInvitation(token: token.trimmingCharacters(in: .whitespaces))
            ToastStore.shared.show("Connected", style: .success)
            token = ""
        } catch {
            self.error = "Couldn't connect. Check the code and try again."
        }
    }
}
