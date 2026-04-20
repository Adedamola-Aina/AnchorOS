import SwiftUI

extension AddTransactionSheet {
    // MARK: — Labels

    var dateLabel: String {
        let fmt = DateFormatter()
        fmt.dateStyle = .medium
        return Calendar.current.isDateInToday(transactionDate) ? "Today" : fmt.string(from: transactionDate)
    }

    var submitLabel: String {
        switch type {
        case "income": return "Add Income"
        case "transfer": return "Transfer"
        default: return "Add Expense"
        }
    }

    // MARK: — Account Rows

    func accountRow(_ account: AnchorAccount) -> some View {
        Button {
            selectedAccountId = account.resolvedId
            if destinationAccountId == account.resolvedId { destinationAccountId = "" }
        } label: {
            HStack {
                Circle()
                    .fill(AnchorAccount.cardColors[financeStore.accounts.firstIndex(where: { $0.resolvedId == account.resolvedId }) ?? 0 % AnchorAccount.cardColors.count])
                    .frame(width: 10, height: 10)
                Text(account.name).foregroundStyle(AnchorPalette.textPrimary).font(.subheadline)
                Spacer()
                Text(account.formattedBalance).foregroundStyle(AnchorPalette.textSecondary).font(.caption)
                if selectedAccountId == account.resolvedId {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(AnchorPalette.chipActive)
                }
            }
            .padding(12)
            .background(selectedAccountId == account.resolvedId ? AnchorPalette.chipActive.opacity(0.12) : AnchorPalette.chip.opacity(0.4))
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }

    func destinationAccountRow(_ account: AnchorAccount) -> some View {
        Button { destinationAccountId = account.resolvedId } label: {
            HStack {
                Circle()
                    .fill(AnchorAccount.cardColors[financeStore.accounts.firstIndex(where: { $0.resolvedId == account.resolvedId }) ?? 0 % AnchorAccount.cardColors.count])
                    .frame(width: 10, height: 10)
                Text(account.name).foregroundStyle(AnchorPalette.textPrimary).font(.subheadline)
                Spacer()
                if destinationAccountId == account.resolvedId {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(AnchorPalette.success)
                }
            }
            .padding(12)
            .background(destinationAccountId == account.resolvedId ? AnchorPalette.success.opacity(0.12) : AnchorPalette.chip.opacity(0.4))
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }

    // MARK: — Submit

    func submit() async {
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
                narration: narration,
                destinationAccountId: destinationAccountId.isEmpty ? nil : destinationAccountId
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

// MARK: — AnchorFormField

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
