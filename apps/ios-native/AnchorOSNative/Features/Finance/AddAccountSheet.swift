import SwiftUI

/// Add Account — bottom sheet form matching PWA AccountForm fields.
/// Writes through FinanceStore → AccountService → SecureDb.
struct AddAccountSheet: View {
    @EnvironmentObject private var financeStore: FinanceStore
    @Environment(\.dismiss) private var dismiss

    @State private var name: String = ""
    @State private var type: String = "checking"
    @State private var currency: String = "NGN"
    @State private var balanceText: String = ""
    @State private var isSaving = false

    private let accountTypes = ["checking", "savings", "investment", "wallet", "cash", "credit"]
    private let currencies = ["NGN", "USD", "GBP", "EUR"]

    private var balanceCents: Int {
        let cleaned = balanceText.replacingOccurrences(of: ",", with: "")
        return Int((Double(cleaned) ?? 0) * 100)
    }

    private var canSubmit: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty && balanceCents >= 0
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    formSection("Account Name") {
                        AnchorFormField(placeholder: "e.g. Main Checking, Emergency Fund", text: $name)
                    }

                    formSection("Account Type") {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(accountTypes, id: \.self) { t in
                                    Button {
                                        type = t
                                    } label: {
                                        Text(t.capitalized)
                                            .font(.caption).fontWeight(.semibold)
                                            .foregroundStyle(type == t ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                            .padding(.horizontal, 14).padding(.vertical, 8)
                                            .background(type == t ? AnchorPalette.chipActive : AnchorPalette.chip)
                                            .clipShape(Capsule())
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }
                    }

                    formSection("Currency") {
                        HStack(spacing: 8) {
                            ForEach(currencies, id: \.self) { c in
                                Button {
                                    currency = c
                                } label: {
                                    Text(c)
                                        .font(.subheadline).fontWeight(.semibold)
                                        .foregroundStyle(currency == c ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 10)
                                        .background(currency == c ? AnchorPalette.chipActive : AnchorPalette.chip)
                                        .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }

                    formSection("Opening Balance") {
                        HStack {
                            Text(currency == "USD" ? "$" : "₦")
                                .foregroundStyle(AnchorPalette.textSecondary)
                                .padding(.leading, 14)
                            TextField("0.00", text: $balanceText)
                                .keyboardType(.decimalPad)
                                .foregroundStyle(AnchorPalette.textPrimary)
                                .padding(.vertical, 14).padding(.trailing, 14)
                        }
                        .background(AnchorPalette.chip.opacity(0.6))
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                    }
                }
                .padding(20)
            }
            .background(AnchorBackground())
            .navigationTitle("New Account")
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
                            Text("Create Account")
                                .fontWeight(.semibold)
                                .foregroundStyle(canSubmit ? AnchorPalette.chipActive : AnchorPalette.textSecondary)
                        }
                    }
                    .disabled(!canSubmit || isSaving)
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
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
        defer { isSaving = false }
        do {
            try await financeStore.addAccount(
                name: name.trimmingCharacters(in: .whitespaces),
                type: type,
                currency: currency,
                balanceCents: balanceCents
            )
            ToastStore.shared.show("Account created", style: .success)
            dismiss()
        } catch {
            ToastStore.shared.show("Failed to create account", style: .error)
        }
    }
}
