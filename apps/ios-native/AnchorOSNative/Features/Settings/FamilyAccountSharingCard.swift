import SwiftUI

/// Family Mode account sharing card with per-account permission picker.
/// Extracted from FamilyView to keep that file under ARCH-001 200-line budget.
///
/// Owner-only — toggles whether each account is shared with the connected
/// member, and (when shared) shows a SharePermissionPicker to set their
/// access level (View / Transact / Full).
struct FamilyAccountSharingCard: View {
    @EnvironmentObject private var familyStore: FamilyStore
    @EnvironmentObject private var financeStore: FinanceStore
    @State private var sharingAccountId: String? = nil

    var body: some View {
        AnchorCard(title: "Share Accounts", icon: "arrow.triangle.2.circlepath") {
            VStack(alignment: .leading, spacing: 4) {
                Text("Toggle sharing with \(familyStore.partnerName), then set their access level.")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(.bottom, 8)

                ForEach(financeStore.accounts) { account in
                    accountRow(account)
                    if account.id != financeStore.accounts.last?.id {
                        Divider().overlay(AnchorPalette.chip)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func accountRow(_ account: AnchorAccount) -> some View {
        let isShared = account.scope == "family"
        let memberUid = familyStore.connection?.memberUid ?? ""
        let permission = account.permission(for: memberUid) ?? "transact"

        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(account.name)
                        .foregroundStyle(AnchorPalette.textPrimary)
                        .fontWeight(.semibold)
                        .font(.subheadline)
                    Text(account.formattedBalance)
                        .foregroundStyle(AnchorPalette.textSecondary)
                        .font(.caption)
                }
                Spacer()
                Toggle("", isOn: Binding(
                    get: { isShared },
                    set: { newVal in
                        sharingAccountId = account.resolvedId
                        Task {
                            do {
                                try await familyStore.shareAccount(
                                    accountId: account.resolvedId, share: newVal
                                )
                                ToastStore.shared.show(
                                    newVal
                                        ? "Shared with \(familyStore.partnerName)"
                                        : "Sharing removed",
                                    style: .success
                                )
                            } catch {
                                ToastStore.shared.show("Failed to update sharing", style: .error)
                            }
                            sharingAccountId = nil
                        }
                    }
                ))
                .tint(AnchorPalette.chipActive)
                .disabled(sharingAccountId == account.resolvedId)
            }
            .padding(.vertical, 6)

            if isShared {
                SharePermissionPicker(
                    accountId: account.resolvedId,
                    currentPermission: permission
                )
                .padding(.bottom, 6)
            }
        }
    }
}
