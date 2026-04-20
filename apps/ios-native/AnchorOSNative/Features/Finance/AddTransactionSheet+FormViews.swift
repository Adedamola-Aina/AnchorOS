import SwiftUI

extension AddTransactionSheet {
    // MARK: — Computed Properties

    var activeAccounts: [AnchorAccount] { financeStore.accounts }

    var selectedAccount: AnchorAccount? {
        activeAccounts.first(where: { $0.resolvedId == selectedAccountId })
    }

    var amountCents: Int {
        Int((Double(amountText.replacingOccurrences(of: ",", with: "")) ?? 0) * 100)
    }

    var canSubmit: Bool {
        !title.trimmingCharacters(in: .whitespaces).isEmpty &&
        amountCents > 0 && !selectedAccountId.isEmpty &&
        (type != "transfer" || (!destinationAccountId.isEmpty && destinationAccountId != selectedAccountId))
    }

    /// Parity: PWA TransactionForm overdraft check (src/features/finance/TransactionForm.tsx line 105).
    var projectedBalanceCents: Int? {
        guard type == "expense", amountCents > 0, let acc = selectedAccount else { return nil }
        return acc.balanceCents - amountCents
    }

    var isOverdraft: Bool { (projectedBalanceCents ?? 0) < 0 }

    // MARK: — Form Fields Section

    var formFieldsSection: some View {
        VStack(spacing: 20) {
            typeSelector
            formSection("Description") {
                TextField("e.g. Groceries, Salary\u{2026}", text: $title)
                    .focused($focusedField, equals: .title)
                    .submitLabel(.next).onSubmit { focusedField = .amount }
                    .foregroundStyle(AnchorPalette.textPrimary).padding(14)
                    .background(AnchorPalette.chip.opacity(0.6))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            formSection("Date") {
                Button { showDatePicker.toggle() } label: {
                    HStack {
                        Image(systemName: "calendar").foregroundStyle(AnchorPalette.textSecondary)
                        Text(dateLabel).foregroundStyle(AnchorPalette.textPrimary)
                        Spacer()
                        Image(systemName: showDatePicker ? "chevron.up" : "chevron.down")
                            .font(.caption).foregroundStyle(AnchorPalette.textSecondary)
                    }
                    .padding(14).background(AnchorPalette.chip.opacity(0.6))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
                .buttonStyle(.plain)
                if showDatePicker {
                    DatePicker("Transaction Date", selection: $transactionDate, in: ...Date(), displayedComponents: [.date])
                        .datePickerStyle(.graphical).tint(AnchorPalette.chipActive).colorScheme(.dark)
                }
            }
            formSection("Recurring") {
                VStack(spacing: 10) {
                    Toggle("Mark as recurring", isOn: $isRecurring)
                        .tint(AnchorPalette.chipActive).foregroundStyle(AnchorPalette.textPrimary)
                    if isRecurring {
                        HStack(spacing: 8) {
                            ForEach(recurringOptions, id: \.self) { freq in
                                Button { recurringFrequency = freq } label: {
                                    Text(freq.capitalized).font(.caption).fontWeight(.semibold)
                                        .foregroundStyle(recurringFrequency == freq ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                        .frame(maxWidth: .infinity).padding(.vertical, 9)
                                        .background(recurringFrequency == freq ? AnchorPalette.chipActive : AnchorPalette.chip)
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                }.buttonStyle(.plain)
                            }
                        }
                    }
                }
            }
            formSection("Amount") {
                TextField("0.00", text: $amountText).keyboardType(.decimalPad)
                    .focused($focusedField, equals: .amount).submitLabel(.go)
                    .onSubmit { if canSubmit { Task { await submit() } } }
                    .foregroundStyle(AnchorPalette.textPrimary).padding(14)
                    .background(AnchorPalette.chip.opacity(0.6))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            if isOverdraft, let projected = projectedBalanceCents {
                OverdraftWarningBanner(projectedBalanceCents: projected, currency: selectedAccount?.currency ?? "NGN")
                    .animation(.easeInOut(duration: 0.25), value: isOverdraft)
            }
            formSection(type == "transfer" ? "From Account" : "Account") {
                if activeAccounts.isEmpty {
                    Text("No accounts yet. Create one first.")
                        .foregroundStyle(AnchorPalette.textSecondary).font(.subheadline)
                } else {
                    VStack(spacing: 8) { ForEach(activeAccounts) { accountRow($0) } }
                }
            }
            if type == "transfer" {
                formSection("To Account") {
                    VStack(spacing: 8) {
                        ForEach(activeAccounts.filter { $0.resolvedId != selectedAccountId }) {
                            destinationAccountRow($0)
                        }
                    }
                }
            }
            if type != "transfer" {
                formSection("Category") {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(categories, id: \.self) { cat in
                                Button { selectedCategory = cat } label: {
                                    Text(cat).font(.caption).fontWeight(.semibold)
                                        .foregroundStyle(selectedCategory == cat ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                        .padding(.horizontal, 12).padding(.vertical, 7)
                                        .background(selectedCategory == cat ? AnchorPalette.chipActive : AnchorPalette.chip)
                                        .clipShape(Capsule())
                                }.buttonStyle(.plain)
                            }
                        }
                    }
                }
            }
            // Parity: PWA TransactionForm `narration` textarea (src/features/finance/TransactionForm.tsx).
            formSection("Notes (optional)") {
                TextField("e.g. split with Tunde", text: $narration, axis: .vertical)
                    .lineLimit(2...4).foregroundStyle(AnchorPalette.textPrimary).padding(14)
                    .background(AnchorPalette.chip.opacity(0.6))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
            }
        }
    }

    // MARK: — Type Selector

    var typeSelector: some View {
        HStack(spacing: 0) {
            ForEach(types, id: \.self) { t in
                Button { type = t } label: {
                    VStack(spacing: 4) {
                        Image(systemName: t == "income" ? "arrow.down.circle" : t == "transfer" ? "arrow.left.arrow.right" : "arrow.up.circle").font(.title3)
                        Text(t.capitalized).font(.caption).fontWeight(.semibold)
                    }
                    .foregroundStyle(type == t ? (t == "income" ? AnchorPalette.success : t == "transfer" ? AnchorPalette.chipActive : AnchorPalette.danger) : AnchorPalette.textSecondary)
                    .frame(maxWidth: .infinity).padding(.vertical, 12)
                    .background(type == t ? AnchorPalette.chip : Color.clear)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }.buttonStyle(.plain)
            }
        }
        .background(AnchorPalette.card).clipShape(RoundedRectangle(cornerRadius: 12))
    }

    func formSection<Content: View>(_ label: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label.uppercased()).font(.caption).fontWeight(.bold).foregroundStyle(AnchorPalette.textSecondary)
            content()
        }
    }
}
