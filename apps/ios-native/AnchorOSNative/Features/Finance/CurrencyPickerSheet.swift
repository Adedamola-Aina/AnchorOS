import SwiftUI

/// Searchable currency picker sheet. Parity:
/// PWA `AccountForm.tsx` ships a `SegmentedControl` limited to NGN/USD
/// today; Settings profile offers the full 10-currency list. Matrix
/// row `finance/AccountForm/currency picker` asks for 10-currency
/// parity + search on native — this component is the single source of
/// truth used by AddAccountSheet, EditAccountSheet, and SettingsView.
///
/// Each row is 44pt-min tappable, shows symbol + code + full name, and
/// has a trailing checkmark on the selected value.
struct CurrencyPickerSheet: View {
    @Binding var selection: String
    @Environment(\.dismiss) private var dismiss
    @State private var query: String = ""
    @FocusState private var searchFocused: Bool

    struct Currency: Identifiable, Hashable {
        let code: String
        let name: String
        let symbol: String
        var id: String { code }
    }

    static let all: [Currency] = [
        .init(code: "NGN", name: "Nigerian Naira",       symbol: "\u{20A6}"),
        .init(code: "USD", name: "US Dollar",            symbol: "$"),
        .init(code: "GBP", name: "British Pound",        symbol: "\u{00A3}"),
        .init(code: "EUR", name: "Euro",                 symbol: "\u{20AC}"),
        .init(code: "CAD", name: "Canadian Dollar",      symbol: "$"),
        .init(code: "AUD", name: "Australian Dollar",    symbol: "$"),
        .init(code: "JPY", name: "Japanese Yen",         symbol: "\u{00A5}"),
        .init(code: "KES", name: "Kenyan Shilling",      symbol: "KSh"),
        .init(code: "GHS", name: "Ghanaian Cedi",        symbol: "\u{20B5}"),
        .init(code: "ZAR", name: "South African Rand",   symbol: "R"),
    ]

    private var results: [Currency] {
        let q = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !q.isEmpty else { return Self.all }
        return Self.all.filter {
            $0.code.lowercased().contains(q) || $0.name.lowercased().contains(q)
        }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 12) {
                searchBar
                ScrollView {
                    LazyVStack(spacing: 6) {
                        ForEach(results) { currency in
                            row(currency)
                        }
                    }
                    .padding(.horizontal, 16)
                }
            }
            .padding(.top, 4)
            .background(AnchorBackground())
            .navigationTitle("Currency")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(AnchorPalette.chipActive)
                        .fontWeight(.semibold)
                }
            }
            .onAppear { searchFocused = true }
        }
    }

    private var searchBar: some View {
        HStack(spacing: 10) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(AnchorPalette.textSecondary)
            TextField("Search currencies", text: $query)
                .focused($searchFocused)
                .textFieldStyle(.plain)
                .autocorrectionDisabled(true)
                .textInputAutocapitalization(.characters)
                .submitLabel(.done)
            if !query.isEmpty {
                Button { query = "" } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Clear search")
            }
        }
        .padding(.horizontal, 14)
        .frame(minHeight: 44)
        .background(AnchorPalette.chip)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(searchFocused ? AnchorPalette.chipActive : AnchorPalette.cardBorder, lineWidth: 1)
        )
        .padding(.horizontal, 16)
        .animation(.easeInOut(duration: 0.2), value: searchFocused)
    }

    private func row(_ currency: Currency) -> some View {
        Button {
            UIImpactFeedbackGenerator(style: .light).impactOccurred()
            selection = currency.code
            dismiss()
        } label: {
            HStack(spacing: 12) {
                Text(currency.symbol)
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(AnchorPalette.textPrimary)
                    .frame(width: 32, alignment: .center)
                VStack(alignment: .leading, spacing: 2) {
                    Text(currency.code)
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(AnchorPalette.textPrimary)
                    Text(currency.name)
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
                Spacer()
                if selection == currency.code {
                    Image(systemName: "checkmark")
                        .foregroundStyle(AnchorPalette.chipActive)
                        .fontWeight(.semibold)
                }
            }
            .padding(.horizontal, 14)
            .frame(minHeight: 52)
            .background(
                selection == currency.code
                    ? AnchorPalette.chipActive.opacity(0.15)
                    : AnchorPalette.chip
            )
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(selection == currency.code ? AnchorPalette.chipActive : AnchorPalette.cardBorder, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
        .accessibilityLabel("\(currency.code) \(currency.name)")
    }
}
