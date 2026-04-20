import SwiftUI
import UIKit
/// Add Transaction — bottom sheet form matching PWA TransactionForm fields.
/// Writes through FinanceStore → TransactionService → SecureDb.
/// Form fields split to AddTransactionSheet+FormViews.swift (ARCH-001).
struct AddTransactionSheet: View {
    @EnvironmentObject var financeStore: FinanceStore
    @Environment(\.dismiss) var dismiss

    @State var title: String = ""
    @State var amountText: String = ""
    @State var type: String = "expense"   // expense | income | transfer
    @State var selectedAccountId: String = ""
    @State var destinationAccountId: String = ""
    @State var selectedCategory: String = "General"
    @State var transactionDate: Date = Date()
    @State var showDatePicker: Bool = false
    @State var isRecurring: Bool = false
    @State var recurringFrequency: String = "monthly"  // weekly | monthly | yearly
    @State var narration: String = ""
    @State var isSaving = false
    /// Drives `.savePulse` modifier on the save button. PWA parity:
    /// microMotion.savePulse — `saving` = scale 1→1.02→1 loop; `done` = 1→1.08→1 once.
    @State var saveState: AnchorMicroMotion.SaveState = .idle

    let recurringOptions = ["weekly", "monthly", "yearly"]
    let types = ["expense", "income", "transfer"]
    let categories = [
        "General", "Food", "Transport", "Utilities", "Bills & Utilities",
        "Health", "Entertainment", "Shopping", "Salary", "Freelance", "Other"
    ]

    /// Parity: PWA TransactionForm return-key chains title → amount → submit.
    enum FocusedField: Hashable { case title, amount }
    @FocusState var focusedField: FocusedField?

    var body: some View {
        NavigationStack {
            ScrollView {
                formFieldsSection
                    .padding(20)
            }
            .background(AnchorBackground())
            .navigationTitle("Add Transaction")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }.foregroundStyle(AnchorPalette.textSecondary)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button {
                        Task { await submit() }
                    } label: {
                        if isSaving {
                            ProgressView().tint(.white).scaleEffect(0.8)
                        } else {
                            Text(submitLabel)
                                .fontWeight(.semibold)
                                .foregroundStyle(canSubmit ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
                        }
                    }
                    .disabled(!canSubmit || isSaving)
                    .savePulse(state: saveState)
                }
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
        .scrollDismissesKeyboard(.interactively) // Parity: PWA TransactionForm dismisses keyboard on scroll.
        .onAppear {
            if selectedAccountId.isEmpty, let first = activeAccounts.first {
                selectedAccountId = first.resolvedId
            }
        }
    }
}
