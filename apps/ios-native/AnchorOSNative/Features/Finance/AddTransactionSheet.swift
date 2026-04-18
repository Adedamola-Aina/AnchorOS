import SwiftUI
import UIKit
/// Add Transaction — bottom sheet form matching PWA TransactionForm fields.
/// Writes through FinanceStore → TransactionService → SecureDb.
struct AddTransactionSheet: View {
    @EnvironmentObject private var financeStore: FinanceStore
    @Environment(\.dismiss) private var dismiss

    @State private var title: String = ""
    @State private var amountText: String = ""
    @State private var type: String = "expense"   // expense | income | transfer
    @State private var selectedAccountId: String = ""
    @State private var selectedCategory: String = "General"
    @State private var transactionDate: Date = Date()
    @State private var showDatePicker: Bool = false
    @State private var isRecurring: Bool = false
    @State private var recurringFrequency: String = "monthly"  // weekly | monthly | yearly
    @State private var narration: String = ""
    @State private var isSaving = false
    /// Drives `.savePulse` modifier on the save button. PWA parity:
    /// microMotion.savePulse — `saving` = scale 1→1.02→1 loop; `done` = 1→1.08→1 once.
    @State private var saveState: AnchorMicroMotion.SaveState = .idle

    private let recurringOptions = ["weekly", "monthly", "yearly"]

    private let types = ["expense", "income", "transfer"]
    private let categories = [
        "General", "Food", "Transport", "Utilities", "Bills & Utilities",
        "Health", "Entertainment", "Shopping", "Salary", "Freelance", "Other"
    ]

    private var activeAccounts: [AnchorAccount] { financeStore.accounts }

    /// Parity: PWA TransactionForm return-key chains title → amount → submit.
    private enum FocusedField: Hashable { case title, amount }
    @FocusState private var focusedField: FocusedField?

    private var selectedAccount: AnchorAccount? {
        activeAccounts.first(where: { $0.resolvedId == selectedAccountId })
    }

    private var amountCents: Int {
        let cleaned = amountText.replacingOccurrences(of: ",", with: "")
        return Int((Double(cleaned) ?? 0) * 100)
    }

    private var canSubmit: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty &&
        amountCents > 0 &&
        !selectedAccountId.isEmpty
    }

    /// Parity: PWA TransactionForm overdraft check (src/features/finance/TransactionForm.tsx line 105).
    /// Expense + selected account whose balance - amount < 0 → show OverdraftWarning.
    private var projectedBalanceCents: Int? {
        guard type == "expense", amountCents > 0, let acc = selectedAccount else { return nil }
        return acc.balanceCents - amountCents
    }
    private var isOverdraft: Bool {
        (projectedBalanceCents ?? 0) < 0
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Type selector
                    typeSelector

                    // Fields
                    formSection("Description") {
                        TextField("e.g. Groceries, Salary…", text: $title)
                            .focused($focusedField, equals: .title)
                            .submitLabel(.next)
                            .onSubmit { focusedField = .amount }
                            .foregroundStyle(AnchorPalette.textPrimary)
                            .padding(14)
                            .background(AnchorPalette.chip.opacity(0.6))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }

                    formSection("Date") {
                        Button { showDatePicker.toggle() } label: {
                            HStack {
                                Image(systemName: "calendar")
                                    .foregroundStyle(AnchorPalette.textSecondary)
                                Text(dateLabel)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                Spacer()
                                Image(systemName: showDatePicker ? "chevron.up" : "chevron.down")
                                    .font(.caption)
                                    .foregroundStyle(AnchorPalette.textSecondary)
                            }
                            .padding(14)
                            .background(AnchorPalette.chip.opacity(0.6))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                        }
                        .buttonStyle(.plain)

                        if showDatePicker {
                            DatePicker(
                                "Transaction Date",
                                selection: $transactionDate,
                                in: ...Date(),
                                displayedComponents: [.date]
                            )
                            .datePickerStyle(.graphical)
                            .tint(AnchorPalette.chipActive)
                            .colorScheme(.dark)
                        }
                    }

                    formSection("Recurring") {
                        VStack(spacing: 10) {
                            Toggle("Mark as recurring", isOn: $isRecurring)
                                .tint(AnchorPalette.chipActive)
                                .foregroundStyle(AnchorPalette.textPrimary)
                            if isRecurring {
                                HStack(spacing: 8) {
                                    ForEach(recurringOptions, id: \.self) { freq in
                                        Button { recurringFrequency = freq } label: {
                                            Text(freq.capitalized)
                                                .font(.caption).fontWeight(.semibold)
                                                .foregroundStyle(recurringFrequency == freq ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                                .frame(maxWidth: .infinity)
                                                .padding(.vertical, 9)
                                                .background(recurringFrequency == freq ? AnchorPalette.chipActive : AnchorPalette.chip)
                                                .clipShape(RoundedRectangle(cornerRadius: 8))
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                            }
                        }
                    }

                    formSection("Amount") {
                        TextField("0.00", text: $amountText)
                            .keyboardType(.decimalPad)
                            .focused($focusedField, equals: .amount)
                            .submitLabel(.go)
                            .onSubmit {
                                if canSubmit { Task { await submit() } }
                            }
                            .foregroundStyle(AnchorPalette.textPrimary)
                            .padding(14)
                            .background(AnchorPalette.chip.opacity(0.6))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }

                    if isOverdraft, let projected = projectedBalanceCents {
                        OverdraftWarningBanner(
                            projectedBalanceCents: projected,
                            currency: selectedAccount?.currency ?? "NGN"
                        )
                        .animation(.easeInOut(duration: 0.25), value: isOverdraft)
                    }

                    formSection("Account") {
                        if activeAccounts.isEmpty {
                            Text("No accounts yet. Create one first.")
                                .foregroundStyle(AnchorPalette.textSecondary)
                                .font(.subheadline)
                        } else {
                            VStack(spacing: 8) {
                                ForEach(activeAccounts) { acc in
                                    accountRow(acc)
                                }
                            }
                        }
                    }

                    if type != "transfer" {
                        formSection("Category") {
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(categories, id: \.self) { cat in
                                        Button {
                                            selectedCategory = cat
                                        } label: {
                                            Text(cat)
                                                .font(.caption).fontWeight(.semibold)
                                                .foregroundStyle(selectedCategory == cat ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                                .padding(.horizontal, 12).padding(.vertical, 7)
                                                .background(selectedCategory == cat ? AnchorPalette.chipActive : AnchorPalette.chip)
                                                .clipShape(Capsule())
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                            }
                        }
                    }

                    // Parity: PWA TransactionForm `narration` textarea
                    // (src/features/finance/TransactionForm.tsx).
                    formSection("Notes (optional)") {
                        TextField("e.g. split with Tunde", text: $narration, axis: .vertical)
                            .lineLimit(2...4)
                            .foregroundStyle(AnchorPalette.textPrimary)
                            .padding(14)
                            .background(AnchorPalette.chip.opacity(0.6))
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                }
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

    private var dateLabel: String {
        let fmt = DateFormatter()
        fmt.dateStyle = .medium
        return Calendar.current.isDateInToday(transactionDate) ? "Today" : fmt.string(from: transactionDate)
    }

    private var submitLabel: String {
        switch type {
        case "income": return "Record Income"
        case "transfer": return "Record Transfer"
        default: return "Record Expense"
        }
    }

    private var typeSelector: some View {
        HStack(spacing: 0) {
            ForEach(types, id: \.self) { t in
                Button {
                    type = t
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: t == "income" ? "arrow.down.circle" : t == "transfer" ? "arrow.left.arrow.right" : "arrow.up.circle")
                            .font(.title3)
                        Text(t.capitalized)
                            .font(.caption).fontWeight(.semibold)
                    }
                    .foregroundStyle(type == t ? (t == "income" ? AnchorPalette.success : t == "transfer" ? AnchorPalette.chipActive : AnchorPalette.danger) : AnchorPalette.textSecondary)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(type == t ? AnchorPalette.chip : Color.clear)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
            }
        }
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private func accountRow(_ account: AnchorAccount) -> some View {
        Button {
            selectedAccountId = account.resolvedId
        } label: {
            HStack {
                Circle()
                    .fill(AnchorAccount.cardColors[financeStore.accounts.firstIndex(where: { $0.resolvedId == account.resolvedId }) ?? 0 % AnchorAccount.cardColors.count])
                    .frame(width: 10, height: 10)
                Text(account.name)
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .font(.subheadline)
                Spacer()
                Text(account.formattedBalance)
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.caption)
                if selectedAccountId == account.resolvedId {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(AnchorPalette.chipActive)
                }
            }
            .padding(12)
            .background(selectedAccountId == account.resolvedId ? AnchorPalette.chipActive.opacity(0.12) : AnchorPalette.chip.opacity(0.4))
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }

    private func formSection<Content: View>(_ label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label.uppercased())
                .font(.caption).fontWeight(.bold)
                .foregroundStyle(AnchorPalette.textSecondary)
            content()
        }
    }

    private func submit() async {
        guard canSubmit, !isSaving else { return }
        isSaving = true
        saveState = .saving
        defer { isSaving = false }
        do {
            let currency = selectedAccount?.currency ?? "NGN"
            let iso = ISO8601DateFormatter()
            try await financeStore.addTransaction(
                title: title.trimmingCharacters(in: .whitespaces),
                amountCents: amountCents,
                type: type,
                category: type == "transfer" ? nil : selectedCategory,
                accountId: selectedAccountId,
                currency: currency,
                date: iso.string(from: transactionDate),
                isRecurring: isRecurring,
                recurringFrequency: isRecurring ? recurringFrequency : nil,
                narration: narration
            )
            // Parity: useHaptic('success') = vibrate([15,50,15]).
            UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            saveState = .done
            ToastStore.shared.show("\(type.capitalized) recorded", style: .success)
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) { saveState = .idle }
            dismiss()
        } catch {
            // Parity: useHaptic('error') = vibrate([50,50,50,50,50]).
            UINotificationFeedbackGenerator().notificationOccurred(.error)
            saveState = .idle
            ToastStore.shared.show("Failed to save transaction", style: .error)
        }
    }
}

/// Simple styled text field for forms
struct AnchorFormField: View {
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default

    var body: some View {
        TextField(placeholder, text: $text)
            .keyboardType(keyboardType)
            .foregroundStyle(AnchorPalette.textPrimary)
            .padding(14)
            .background(AnchorPalette.chip.opacity(0.6))
            .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
