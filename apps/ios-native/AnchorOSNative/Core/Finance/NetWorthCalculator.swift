import Foundation

/// Pure net-worth calculator mirroring src/utils/finance.ts → calculateNetWorth.
///
/// Parity contract:
///   • Separates NGN and USD (never sums across currencies)
///   • Returns display amounts (currency units, not cents)
///   • `total.currency` = dominant currency by absolute value
///   • Input is assumed to be already-filtered (active accounts only),
///     matching PWA's `useFinanceData` which passes `activeAccounts`.
///
/// The companion test suite (NetWorthCalculatorTests) mirrors every case
/// in src/utils/finance.test.ts. Keep them in lockstep.
enum NetWorthCalculator {

    struct Total: Equatable {
        let amount: Double
        let currency: String  // "NGN" | "USD"
    }

    struct Result: Equatable {
        let ngn: Double      // display units (e.g. ₦3,000.00 → 3000.0)
        let usd: Double
        let ngnCents: Int    // exact integer cents — for downstream math
        let usdCents: Int
        let total: Total
    }

    static func calculate(accounts: [AnchorAccount]) -> Result {
        let ngnCents = accounts
            .filter { $0.currency == "NGN" }
            .reduce(0) { $0 + $1.balanceCents }
        let usdCents = accounts
            .filter { $0.currency == "USD" }
            .reduce(0) { $0 + $1.balanceCents }

        let ngn = Double(ngnCents) / 100.0
        let usd = Double(usdCents) / 100.0

        // Dominant currency by absolute value — matches PWA F-017.
        let currency: String = abs(ngn) >= abs(usd) ? "NGN" : "USD"
        let amount: Double = currency == "NGN" ? ngn : usd

        return Result(
            ngn: ngn, usd: usd,
            ngnCents: ngnCents, usdCents: usdCents,
            total: Total(amount: amount, currency: currency)
        )
    }
}
