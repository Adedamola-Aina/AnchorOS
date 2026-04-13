import Foundation
import FirebaseFirestore

/// Live finance state: accounts + transactions with computed net worth.
/// Started and stopped by AnchorOSNativeApp based on auth state.
@MainActor
final class FinanceStore: ObservableObject {
    @Published private(set) var accounts: [AnchorAccount] = []
    @Published private(set) var transactions: [AnchorTransaction] = []
    @Published private(set) var isLoading = true

    private var uid: String?
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
        self.uid = uid
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
        uid = nil
        accounts = []
        transactions = []
        isLoading = true
    }

    // MARK: — Write: Accounts

    func addAccount(name: String, type: String, currency: String, balanceCents: Int) async throws {
        guard let uid else { return }
        try await accountService.addAccount(uid: uid, name: name, type: type, currency: currency, balanceCents: balanceCents)
    }

    func deleteAccount(accountId: String) async throws {
        guard let uid else { return }
        try await accountService.deleteAccount(uid: uid, accountId: accountId)
    }

    // MARK: — Write: Transactions

    func addTransaction(
        title: String,
        amountCents: Int,
        type: String,
        category: String?,
        accountId: String,
        currency: String
    ) async throws {
        guard let uid else { return }
        let accountName = accounts.first(where: { $0.resolvedId == accountId })?.name
        try await transactionService.addTransaction(
            uid: uid, title: title, amountCents: amountCents, type: type,
            category: category, accountId: accountId, accountName: accountName, currency: currency
        )
    }

    func deleteTransaction(transactionId: String) async throws {
        guard let uid else { return }
        try await transactionService.deleteTransaction(uid: uid, transactionId: transactionId)
    }

    func updateAccount(accountId: String, name: String, type: String, currency: String, balanceCents: Int) async throws {
        guard let uid else { return }
        try await accountService.updateAccount(uid: uid, accountId: accountId, name: name, type: type, currency: currency, balanceCents: balanceCents)
    }

    func updateTransaction(transactionId: String, title: String, amountCents: Int, type: String, category: String?) async throws {
        guard let uid else { return }
        try await transactionService.updateTransaction(uid: uid, transactionId: transactionId, title: title, amountCents: amountCents, type: type, category: category)
    }
}
