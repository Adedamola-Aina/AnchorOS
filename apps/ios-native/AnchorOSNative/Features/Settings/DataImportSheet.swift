import SwiftUI
import UIKit

/// Codable backup format used by Settings export/import.
struct AnchorDataTransferSnapshot: Codable {
    struct User: Codable {
        let displayName: String
        let email: String
        let currency: String
    }

    struct Account: Codable {
        let name: String
        let type: String
        let currency: String
        let balanceCents: Int
        let color: String?
    }

    struct Transaction: Codable {
        let title: String
        let amountCents: Int
        let type: String
        let category: String?
        let accountName: String?
        let currency: String
        let date: String?
        let narration: String?
    }

    struct Commitment: Codable {
        let title: String
        let type: String
        let domain: String
        let timeOfDay: String?
        let notes: String?
        let priority: String?
        let scope: String?
    }

    let exportedAt: String
    let user: User
    let accounts: [Account]
    let transactions: [Transaction]
    let commitments: [Commitment]
}

/// Restore a previously exported Anchor JSON snapshot from the clipboard.
struct DataImportSheet: View {
    @EnvironmentObject private var userProfileStore: UserProfileStore
    @EnvironmentObject private var financeStore: FinanceStore
    @EnvironmentObject private var commitmentsStore: CommitmentsStore
    @Environment(\.dismiss) private var dismiss

    @State private var snapshot: AnchorDataTransferSnapshot?
    @State private var error: String?
    @State private var isImporting = false

    private let accountService = AccountService()
    private let transactionService = TransactionService()
    private let commitmentService = CommitmentService()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    if let snapshot {
                        previewCard(snapshot)
                    } else {
                        emptyState
                    }

                    if let error {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(AnchorPalette.danger)
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("Import Data")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
            .task { loadPreview() }
        }
    }

    @ViewBuilder
    private func previewCard(_ snapshot: AnchorDataTransferSnapshot) -> some View {
        AnchorCard(title: "Clipboard Backup Found", icon: "square.and.arrow.down") {
            VStack(alignment: .leading, spacing: 12) {
                statRow("User", snapshot.user.displayName)
                statRow("Accounts", "\(snapshot.accounts.count)")
                statRow("Transactions", "\(snapshot.transactions.count)")
                statRow("Commitments", "\(snapshot.commitments.count)")

                Button {
                    Task { await importSnapshot(snapshot) }
                } label: {
                    HStack {
                        Spacer()
                        if isImporting {
                            ProgressView().tint(.white)
                        } else {
                            Label("Import from Clipboard", systemImage: "arrow.down.doc.fill")
                                .fontWeight(.semibold)
                        }
                        Spacer()
                    }
                    .padding(.vertical, 12)
                    .background(AnchorPalette.chipActive)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
                .disabled(isImporting)
            }
        }
    }

    private var emptyState: some View {
        AnchorCard(title: "No Backup Found", icon: "doc.text.magnifyingglass") {
            Text("Copy an Anchor export JSON to your clipboard, then reopen this screen.")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
    }

    private func statRow(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label)
                .foregroundStyle(AnchorPalette.textSecondary)
            Spacer()
            Text(value)
                .fontWeight(.semibold)
                .foregroundStyle(AnchorPalette.textPrimary)
        }
    }

    private func loadPreview() {
        error = nil
        guard let raw = UIPasteboard.general.string, let data = raw.data(using: .utf8) else {
            snapshot = nil
            return
        }
        do {
            snapshot = try JSONDecoder().decode(AnchorDataTransferSnapshot.self, from: data)
        } catch {
            snapshot = nil
            error = "Clipboard does not contain a valid Anchor export."
        }
    }

    private func importSnapshot(_ snapshot: AnchorDataTransferSnapshot) async {
        guard let uid = AuthService.shared.currentUserID() else {
            error = "You need to be signed in to import data."
            return
        }

        isImporting = true
        defer { isImporting = false }

        do {
            try? await userProfileStore.updateDisplayName(snapshot.user.displayName)
            try? await userProfileStore.updateCurrency(snapshot.user.currency)

            for account in snapshot.accounts {
                let exists = financeStore.accounts.contains {
                    $0.name == account.name && $0.type == account.type && $0.currency == account.currency
                }
                if !exists {
                    try await accountService.addAccount(
                        uid: uid,
                        name: account.name,
                        type: account.type,
                        currency: account.currency,
                        balanceCents: account.balanceCents,
                        color: account.color ?? "#3D52D5"
                    )
                }
            }

            await financeStore.refresh()

            for tx in snapshot.transactions {
                let exists = financeStore.transactions.contains {
                    $0.title == tx.title && $0.amountCents == tx.amountCents && $0.type == tx.type && $0.date == tx.date
                }
                guard !exists else { continue }
                guard let accountName = tx.accountName,
                      let account = financeStore.accounts.first(where: { $0.name == accountName }) else { continue }
                try await transactionService.addTransaction(
                    uid: uid,
                    title: tx.title,
                    amountCents: tx.amountCents,
                    type: tx.type,
                    category: tx.category,
                    accountId: account.resolvedId,
                    accountName: account.name,
                    currency: tx.currency,
                    date: tx.date,
                    narration: tx.narration
                )
            }

            for item in snapshot.commitments {
                let exists = commitmentsStore.commitments.contains {
                    $0.title == item.title && $0.type == item.type && ($0.domain ?? "") == item.domain
                }
                if !exists {
                    try await commitmentService.addCommitment(
                        uid: uid,
                        title: item.title,
                        type: item.type,
                        domain: item.domain,
                        timeOfDay: item.timeOfDay,
                        notes: item.notes,
                        priority: item.priority,
                        scope: item.scope
                    )
                }
            }

            await commitmentsStore.refresh()
            ToastStore.shared.show("Data imported successfully", style: .success)
            dismiss()
        } catch {
            self.error = "Import failed. Check the JSON and try again."
        }
    }
}
