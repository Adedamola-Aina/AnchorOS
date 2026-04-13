import Foundation
import FirebaseFirestore

/// Live finance state: accounts + transactions with computed net worth.
/// Started and stopped by AnchorOSNativeApp based on auth state.
@MainActor
final class FinanceStore: ObservableObject {
    @Published private(set) var accounts: [AnchorAccount] = []
    @Published private(set) var transactions: [AnchorTransaction] = []
    @Published private(set) var isLoading = true

    private let accountService = AccountService()
    private let transactionService = TransactionService()
    private var accountsListener: ListenerRegistration?
    private var transactionsListener: ListenerRegistration?

    // MARK: — Computed

    var netWorthCents: Int { accounts.reduce(0) { $0 + $1.balanceCents } }

    var netWorthFormatted: String {
        let primaryCurrency = accounts.first?.currency ?? "NGN"
        let amount = Double(netWorthCents) / 100.0
        let symbol = primaryCurrency == "USD" ? "$" : "₦"
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return "\(symbol)\(formatter.string(from: NSNumber(value: amount)) ?? "0.00")"
    }

    var recentTransactions: [AnchorTransaction] {
        Array(transactions.prefix(5))
    }

    // MARK: — Lifecycle

    func start(uid: String) {
        isLoading = true
        accountsListener = accountService.listen(uid: uid) { [weak self] accounts in
            Task { @MainActor in
                self?.accounts = accounts
                self?.isLoading = false
            }
        }
        transactionsListener = transactionService.listen(uid: uid) { [weak self] txs in
            Task { @MainActor in
                self?.transactions = txs
            }
        }
    }

    func stop() {
        accountsListener?.remove()
        transactionsListener?.remove()
        accountsListener = nil
        transactionsListener = nil
        accounts = []
        transactions = []
        isLoading = true
    }
}
