import SwiftUI

// MARK: - FinanceSearchSheet
// SwiftUI port of src/features/finance/components/FinanceSearchSheet.tsx.
// Searches title / category / accountName / formatted amount using a
// case-insensitive substring match. Empty query returns the 8 most
// recent transactions. Tapping a result dismisses the sheet.
struct FinanceSearchSheet: View {
    let accounts: [AnchorAccount]
    let transactions: [AnchorTransaction]
    let onOpenAccount: (String) -> Void

    @Environment(\.dismiss) private var dismiss
    @State private var query: String = ""
    @FocusState private var searchFocused: Bool

    private var accountNames: [String: String] {
        Dictionary(uniqueKeysWithValues: accounts.compactMap { acc -> (String, String)? in
            guard let id = acc.id else { return nil }
            return (id, acc.name)
        })
    }

    private var results: [AnchorTransaction] {
        let normalized = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        let sorted = transactions.sorted { $0.date > $1.date }
        if normalized.isEmpty { return Array(sorted.prefix(8)) }
        return sorted.filter { tx in
            let account = tx.accountId.flatMap { accountNames[$0] } ?? tx.accountName ?? ""
            let amount = tx.formattedAmount
            let haystack = [tx.title, tx.category ?? "", account, amount]
                .map { $0.lowercased() }
            return haystack.contains { $0.contains(normalized) }
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Search Transactions")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(AnchorPalette.textPrimary)
                        HStack(spacing: 10) {
                            Image(systemName: "magnifyingglass")
                                .foregroundStyle(AnchorPalette.textSecondary)
                            TextField("Search transactions, categories, or accounts", text: $query)
                                .focused($searchFocused)
                                .submitLabel(.search)
                                .autocorrectionDisabled()
                                .textInputAutocapitalization(.never)
                                .foregroundStyle(AnchorPalette.textPrimary)
                            if !query.isEmpty {
                                Button { query = "" } label: {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundStyle(AnchorPalette.textSecondary)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(14)
                        .background(AnchorPalette.chip.opacity(0.6))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(searchFocused ? AnchorPalette.chipActive : AnchorPalette.chip, lineWidth: 1)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .animation(.easeInOut(duration: 0.2), value: searchFocused)
                    }

                    if results.isEmpty {
                        Text("No transactions matched that search.")
                            .font(.subheadline)
                            .foregroundStyle(AnchorPalette.textSecondary)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .stroke(AnchorPalette.chip, style: StrokeStyle(lineWidth: 1, dash: [5, 4]))
                            )
                    } else {
                        VStack(spacing: 8) {
                            ForEach(results) { tx in
                                Button {
                                    if let accId = tx.accountId { onOpenAccount(accId) }
                                    dismiss()
                                } label: {
                                    resultRow(tx)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
                .padding(20)
            }
            .background(AnchorBackground())
            .navigationTitle("Search")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }.foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .onAppear { searchFocused = true } // Interaction matrix row 46: autofocus first field
        }
    }

    private func resultRow(_ tx: AnchorTransaction) -> some View {
        let accountName = tx.accountId.flatMap { accountNames[$0] } ?? tx.accountName ?? "Unknown account"
        return HStack(alignment: .top, spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(tx.title)
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .lineLimit(1)
                Text("\(accountName) · \(tx.category ?? "Uncategorized")")
                    .font(.caption)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .lineLimit(1)
            }
            Spacer(minLength: 8)
            Text(tx.formattedAmount)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(AnchorPalette.textPrimary)
        }
        .padding(14)
        .background(AnchorPalette.chip.opacity(0.3))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(AnchorPalette.chip, lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}
