import SwiftUI

/// Edit Account — pre-filled bottom sheet matching AddAccountSheet fields.
/// Writes updateAccount through FinanceStore → AccountService → SecureDb.
struct EditAccountSheet: View {
    let account: AnchorAccount

    @EnvironmentObject private var financeStore: FinanceStore
    @Environment(\.dismiss) private var dismiss

    @State private var name: String
    @State private var selectedType: String
    @State private var selectedCurrency: String
    @State private var balanceText: String
    @State private var selectedColorHex: String
    @State private var isSaving = false
    @State private var showCurrencyPicker = false

    private let accountTypes = ["checking", "savings", "investment", "wallet", "cash", "credit"]

    init(account: AnchorAccount) {
        self.account = account
        _name = State(initialValue: account.name)
        _selectedType = State(initialValue: account.type)
        _selectedCurrency = State(initialValue: account.currency)
        let bal = Double(account.balanceCents) / 100.0
        _balanceText = State(initialValue: String(format: "%.2f", bal))
        _selectedColorHex = State(initialValue: account.color ?? "#3D52D5")
    }

    private var balanceCents: Int {
        let cleaned = balanceText.replacingOccurrences(of: ",", with: "")
        return Int((Double(cleaned) ?? 0) * 100)
    }

    private var currencySymbol: String {
        CurrencyPickerSheet.all.first { $0.code == selectedCurrency }?.symbol ?? selectedCurrency
    }
    private var formIsValid: Bool { !name.isEmpty }

    var body: some View {
        NavigationStack {
            ZStack {
                AnchorBackground().ignoresSafeArea()
                ScrollView {
                    VStack(spacing: 16) {
                        // Name
                        AnchorFormField(placeholder: "Account Name", text: $name)

                        // Type chips
                        VStack(alignment: .leading, spacing: 8) {
                            Text("ACCOUNT TYPE")
                                .font(.caption).fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.textSecondary)
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(accountTypes, id: \.self) { t in
                                        Button {
                                            selectedType = t
                                        } label: {
                                            Text(t.capitalized)
                                                .font(.caption).fontWeight(.bold)
                                                .foregroundStyle(selectedType == t ? .white : AnchorPalette.textSecondary)
                                                .padding(.horizontal, 14).padding(.vertical, 8)
                                                .background(selectedType == t ? AnchorPalette.chipActive : AnchorPalette.chip)
                                                .clipShape(Capsule())
                                        }
                                        .buttonStyle(.plain)
                                    }
                                }
                            }
                        }

                        // Currency picker
                        VStack(alignment: .leading, spacing: 8) {
                            Text("CURRENCY")
                                .font(.caption).fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.textSecondary)
                            Button {
                                showCurrencyPicker = true
                            } label: {
                                HStack {
                                    Text(selectedCurrency)
                                        .font(.subheadline).fontWeight(.semibold)
                                        .foregroundStyle(AnchorPalette.textPrimary)
                                    Text(currencySymbol)
                                        .font(.subheadline)
                                        .foregroundStyle(AnchorPalette.textSecondary)
                                    Spacer()
                                    Image(systemName: "chevron.up.chevron.down")
                                        .font(.caption)
                                        .foregroundStyle(AnchorPalette.textSecondary)
                                }
                                .padding(.horizontal, 14)
                                .frame(minHeight: 44)
                                .background(AnchorPalette.chip)
                                .clipShape(RoundedRectangle(cornerRadius: 10))
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(AnchorPalette.cardBorder, lineWidth: 1))
                            }
                            .buttonStyle(.plain)
                            .anchorPressable()
                            .accessibilityLabel("Currency: \(selectedCurrency). Tap to change.")
                        }

                        // Balance
                        HStack {
                            Text(currencySymbol)
                                .foregroundStyle(AnchorPalette.textSecondary)
                                .font(.title3).fontWeight(.semibold)
                                .frame(width: 24)
                            AnchorFormField(placeholder: "Current Balance", text: $balanceText, keyboardType: .decimalPad)
                        }

                        // Color picker
                        CardColorPicker(selectedHex: $selectedColorHex)

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
            .navigationTitle("Edit Account")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
        }
        .presentationDetents([.medium, .large])
        .sheet(isPresented: $showCurrencyPicker) {
            CurrencyPickerSheet(selection: $selectedCurrency)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
    }

    private func save() async {
        isSaving = true
        do {
            try await financeStore.updateAccount(
                accountId: account.resolvedId,
                name: name,
                type: selectedType,
                currency: selectedCurrency,
                balanceCents: balanceCents,
                color: selectedColorHex
            )
            ToastStore.shared.show("Account updated", style: .success)
            dismiss()
        } catch {
            ToastStore.shared.show("Failed to save changes", style: .error)
        }
        isSaving = false
    }
}
