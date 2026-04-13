import SwiftUI

/// Edit Transaction — pre-filled bottom sheet matching AddTransactionSheet fields.
/// Writes updateTransaction through FinanceStore → TransactionService → SecureDb.
struct EditTransactionSheet: View {
    let transaction: AnchorTransaction

    @EnvironmentObject private var financeStore: FinanceStore
    @Environment(\.dismiss) private var dismiss

    @State private var title: String
    @State private var amountText: String
    @State private var type: String
    @State private var selectedCategory: String
    @State private var isSaving = false

    private let types = ["expense", "income", "transfer"]
    private let categories = [
        "General", "Food", "Transport", "Utilities", "Bills & Utilities",
        "Health", "Entertainment", "Shopping", "Salary", "Freelance", "Other"
    ]

    init(transaction: AnchorTransaction) {
        self.transaction = transaction
        _title = State(initialValue: transaction.title)
        let amount = Double(transaction.amountCents) / 100.0
        _amountText = State(initialValue: String(format: "%.2f", amount))
        _type = State(initialValue: transaction.type)
        _selectedCategory = State(initialValue: transaction.category ?? "General")
    }

    private var amountCents: Int {
        let cleaned = amountText.replacingOccurrences(of: ",", with: "")
        return Int((Double(cleaned) ?? 0) * 100)
    }

    private var formIsValid: Bool { !title.isEmpty && amountCents > 0 }

    var body: some View {
        NavigationStack {
            ZStack {
                AnchorBackground().ignoresSafeArea()
                ScrollView {
                    VStack(spacing: 16) {
                        // Type selector
                        HStack(spacing: 0) {
                            ForEach(types, id: \.self) { t in
                                Button {
                                    type = t
                                } label: {
                                    HStack(spacing: 4) {
                                        Image(systemName: t == "income" ? "arrow.down.circle" : t == "transfer" ? "arrow.left.arrow.right" : "minus.circle")
                                            .font(.caption)
                                        Text(t.capitalized)
                                            .font(.subheadline).fontWeight(.semibold)
                                    }
                                    .foregroundStyle(type == t ? .white : AnchorPalette.textSecondary)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 10)
                                    .background(type == t ? AnchorPalette.chipActive : Color.clear)
                                    .clipShape(RoundedRectangle(cornerRadius: 10))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .background(AnchorPalette.chip)
                        .clipShape(RoundedRectangle(cornerRadius: 12))

                        // Description
                        AnchorFormField(label: "Description", text: $title)

                        // Amount
                        AnchorFormField(label: "Amount (\(transaction.currency))", text: $amountText, keyboard: .decimalPad)

                        // Category chips (not shown for transfer)
                        if type != "transfer" {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("CATEGORY")
                                    .font(.caption).fontWeight(.bold)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 8) {
                                        ForEach(categories, id: \.self) { cat in
                                            Button {
                                                selectedCategory = cat
                                            } label: {
                                                Text(cat)
                                                    .font(.caption).fontWeight(.bold)
                                                    .foregroundStyle(selectedCategory == cat ? .white : AnchorPalette.textSecondary)
                                                    .padding(.horizontal, 14).padding(.vertical, 8)
                                                    .background(selectedCategory == cat ? AnchorPalette.chipActive : AnchorPalette.chip)
                                                    .clipShape(Capsule())
                                            }
                                            .buttonStyle(.plain)
                                        }
                                    }
                                }
                            }
                        }

                        // Save button
                        Button {
                            Task { await save() }
                        } label: {
                            HStack {
                                Spacer()
                                if isSaving {
                                    ProgressView().tint(.white)
                                } else {
                                    Text("Save Changes")
                                        .fontWeight(.semibold)
                                }
                                Spacer()
                            }
                            .padding(.vertical, 16)
                            .background(formIsValid ? AnchorPalette.chipActive : AnchorPalette.chip)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .foregroundStyle(formIsValid ? .white : AnchorPalette.textSecondary)
                        }
                        .disabled(!formIsValid || isSaving)
                        .buttonStyle(.plain)
                    }
                    .padding(16)
                }
            }
            .navigationTitle("Edit Transaction")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
        }
        .presentationDetents([.medium, .large])
    }

    private func save() async {
        isSaving = true
        do {
            try await financeStore.updateTransaction(
                transactionId: transaction.resolvedId,
                title: title,
                amountCents: amountCents,
                type: type,
                category: type == "transfer" ? nil : selectedCategory
            )
            ToastStore.shared.show("Transaction updated", style: .success)
            dismiss()
        } catch {
            ToastStore.shared.show("Failed to save changes", style: .error)
        }
        isSaving = false
    }
}
