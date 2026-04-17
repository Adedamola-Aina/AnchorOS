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
    @State private var selectedColorHex: String = "#3D52D5"
    @State private var isSaving = false
    @State private var showCurrencyPicker = false

    private let accountTypes = ["checking", "savings", "investment", "wallet", "cash", "credit"]

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
                        Button {
                            showCurrencyPicker = true
                        } label: {
                            HStack {
                                Text(currency)
                                    .font(.subheadline).fontWeight(.semibold)
                                    .foregroundStyle(AnchorPalette.textPrimary)
                                Text(currencySymbol(currency))
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
                        .accessibilityLabel("Currency: \(currency). Tap to change.")
                    }

                    formSection("Opening Balance") {
                        HStack {
                            Text(currencySymbol(currency))
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

                    formSection("Card Color") {
                        CardColorPicker(selectedHex: $selectedColorHex)
                    }
                }
                .padding(20)
                .createSlideIn()
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
        .sheet(isPresented: $showCurrencyPicker) {
            CurrencyPickerSheet(selection: $currency)
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
    }

    private func currencySymbol(_ code: String) -> String {
        CurrencyPickerSheet.all.first { $0.code == code }?.symbol ?? code
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
                balanceCents: balanceCents,
                color: selectedColorHex
            )
            ToastStore.shared.show("Account created", style: .success)
            dismiss()
        } catch {
            ToastStore.shared.show("Failed to create account", style: .error)
        }
    }
}
