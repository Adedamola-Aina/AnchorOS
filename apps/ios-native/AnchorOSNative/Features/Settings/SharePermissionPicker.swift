import SwiftUI

/// Parity with src/features/finance/components/SharePermissionPicker.tsx.
///
/// 3-segment picker for owner to set a member's permission on a shared
/// account. Writes via FamilyStore.updateSharedPermission, which targets
/// `accounts/{id}.sharedWith.{memberUid}.permission`.
struct SharePermissionPicker: View {
    let accountId: String
    let currentPermission: String

    @EnvironmentObject private var familyStore: FamilyStore
    @State private var saving = false
    @State private var localPermission: String

    init(accountId: String, currentPermission: String) {
        self.accountId = accountId
        self.currentPermission = currentPermission
        self._localPermission = State(initialValue: currentPermission)
    }

    private struct Option {
        let value: String
        let label: String
        let icon: String
    }

    private static let options: [Option] = [
        Option(value: "read",     label: "View",    icon: "eye"),
        Option(value: "transact", label: "Transact", icon: "arrow.left.arrow.right"),
        Option(value: "manage",   label: "Full",    icon: "gearshape")
    ]

    var body: some View {
        HStack(spacing: 4) {
            ForEach(Self.options, id: \.value) { opt in
                segment(opt)
            }
        }
        .padding(4)
        .background(AnchorPalette.chip.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .opacity(saving ? 0.6 : 1)
    }

    @ViewBuilder
    private func segment(_ opt: Option) -> some View {
        let active = localPermission == opt.value
        Button {
            Task { await change(to: opt.value) }
        } label: {
            HStack(spacing: 4) {
                Image(systemName: opt.icon).font(.caption2)
                Text(opt.label).font(.caption).fontWeight(.semibold)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 6)
            .background(active ? AnchorPalette.chipActive : Color.clear)
            .foregroundStyle(active ? .white : AnchorPalette.textSecondary)
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .buttonStyle(.plain)
        .disabled(saving)
    }

    private func change(to newValue: String) async {
        guard newValue != localPermission else { return }
        let previous = localPermission
        localPermission = newValue
        saving = true
        defer { saving = false }
        do {
            try await familyStore.updateSharedPermission(
                accountId: accountId,
                permission: newValue
            )
            ToastStore.shared.show("Permission updated", style: .success)
        } catch {
            localPermission = previous
            ToastStore.shared.show("Failed to update permission", style: .error)
        }
    }
}
