]633;E;cat /tmp/FinanceView_computed.swift;7d13ca06-2a20-4ae8-8b1b-3c9d416a2e3e]633;Cimport SwiftUI

extension FinanceView {

    var monthLabel: String {
        guard let date = Calendar.current.date(byAdding: .month, value: monthOffset, to: Date()) else { return "" }
        let fmt = DateFormatter()
        fmt.dateFormat = "MMMM yyyy"
        return fmt.string(from: date)
    }

    /// Per-currency balance totals for the TOTAL ASSETS bar.
    /// Sourced from NetWorthCalculator so PWA parity is enforced centrally.
    var currencyTotals: [(currency: String, symbol: String, formatted: String)] {
        let nw = financeStore.netWorth
        let numFmt = NumberFormatter()
        numFmt.numberStyle = .decimal
        numFmt.minimumFractionDigits = 2
        numFmt.maximumFractionDigits = 2
        var rows: [(String, String, String)] = []
        if nw.ngnCents != 0 || nw.usdCents == 0 {
            let s = numFmt.string(from: NSNumber(value: nw.ngn)) ?? "0.00"
            rows.append(("NGN", "₦", "₦\(s)"))
        }
        if nw.usdCents != 0 {
            let s = numFmt.string(from: NSNumber(value: nw.usd)) ?? "0.00"
            rows.append(("USD", "$", "$\(s)"))
        }
        return rows
    }



    var sharedAccountsSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(spacing: 6) {
                Image(systemName: "person.2.fill")
                    .font(.caption2)
                    .foregroundStyle(AnchorPalette.chipActive)
                Text("SHARED WITH \(familyStore.partnerName.uppercased())")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)
            }
            .padding(.horizontal, 20).padding(.top, 16).padding(.bottom, 8)

            let shared = financeStore.accounts.filter { $0.scope == "shared" }
            if shared.isEmpty {
                Text("No shared accounts yet.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .font(.caption)
                    .padding(.horizontal, 20).padding(.bottom, 12)
            } else {
                ForEach(Array(shared.enumerated()), id: \.element.resolvedId) { index, account in
                    NavigationLink(destination:
                        AccountDetailView(account: account, accountIndex: index + financeStore.accounts.count)
                            .environmentObject(financeStore)
                    ) {
                        fullWidthAccountCard(account, at: index + financeStore.accounts.count)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: — Total Assets

    var totalAssetsBar: some View {
        ZStack {
            // PWA parity: microMotion.netWorthRise shimmer when total > 0.
            LinearGradient(
                colors: [Color.clear, AnchorPalette.finance.opacity(0.3), Color.clear],
                startPoint: .leading, endPoint: .trailing
            )
            .clipShape(RoundedRectangle(cornerRadius: 24, style: .continuous))
            .allowsHitTesting(false)
            .netWorthRise(trigger: !currencyTotals.isEmpty, valueHash: currencyTotals.map { "\($0.currency):\($0.formatted)" }.joined().hashValue)

            VStack(alignment: .leading, spacing: 4) {
                Text("TOTAL ASSETS")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)
                if financeStore.isLoading {
                    ProgressView().tint(.white)
                } else if currencyTotals.isEmpty {
                    Text("—").foregroundStyle(AnchorPalette.textPrimary).font(.title3)
                } else {
                    HStack(spacing: 16) {
                        ForEach(currencyTotals, id: \.currency) { entry in
                            Text(entry.formatted)
                                .font(.title3).fontWeight(.bold)
                                .foregroundStyle(AnchorPalette.textPrimary)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(.horizontal, 20).padding(.top, 16).padding(.bottom, 12)
    }

    // MARK: — Account Card Stack (full-width vertical)

    var accountStack: some View {
        VStack(spacing: 1) {
            if financeStore.accounts.isEmpty && !financeStore.isLoading {
                Text("No accounts yet.")
                    .foregroundStyle(AnchorPalette.textSecondary)
                    .padding(20)
            } else {
                ForEach(Array(financeStore.accounts.enumerated()), id: \.element.resolvedId) { index, account in
                    NavigationLink(destination:
                        AccountDetailView(account: account, accountIndex: index)
                            .environmentObject(financeStore)
                    ) {
                        fullWidthAccountCard(account, at: index)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    func fullWidthAccountCard(_ account: AnchorAccount, at index: Int) -> some View {
        HStack(alignment: .center, spacing: 0) {
            VStack(alignment: .leading, spacing: 4) {
                Text(account.name)
                    .font(.body).fontWeight(.semibold)
                    .foregroundStyle(.white)
                Text(account.type.uppercased())
                    .font(.caption2).fontWeight(.bold)
                    .foregroundStyle(.white.opacity(0.65))
            }
            Spacer()
            Text(account.formattedBalance)
                .font(.body).fontWeight(.bold)
                .foregroundStyle(.white)
        }
        .padding(.horizontal, 20).padding(.vertical, 16)
        .background(account.cardColor(at: index))
        .contextMenu {
            Button(role: .destructive) {
                accountToDelete = account
                showDeleteAccountAlert = true
            } label: {
                Label("Remove Account", systemImage: "trash")
            }
        }
    }

}
