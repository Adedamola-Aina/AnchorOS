import Foundation

/// Entity parsers for NLP intent resolution. Parity port of
/// src/services/fabric/intentEntityParsers.ts.
///
/// `parseAmount` tries five regex patterns in order (currency symbols
/// first, bare numbers last). `parseCategory` checks a keyword table
/// then falls back to the first content word > 2 chars.
enum AnchorEntityParser {

    /// Canonical category keyword table — parity with PWA `CATEGORY_KEYWORDS`
    /// in src/services/fabric/heuristics.ts (subset covering the common
    /// categories we support on iOS today).
    private static let categoryKeywords: [(category: String, keywords: [String])] = [
        ("Food",          ["food", "lunch", "dinner", "breakfast", "restaurant", "groceries", "meal", "snack", "eat"]),
        ("Transport",     ["transport", "uber", "bolt", "fuel", "petrol", "gas", "taxi", "bus", "train"]),
        ("Bills",         ["bill", "electricity", "water", "rent", "internet", "nepa", "power", "dstv", "subscription"]),
        ("Airtime/Data",  ["airtime", "data", "mtn", "glo", "airtel", "9mobile"]),
        ("Shopping",      ["shopping", "clothes", "shoes", "amazon", "online", "store"]),
        ("Entertainment", ["entertainment", "movie", "netflix", "spotify", "game", "gaming"]),
        ("Health",        ["health", "medicine", "hospital", "pharmacy", "doctor", "gym"]),
        ("Savings",       ["savings", "save", "invest", "investment", "pension"]),
        ("Income",        ["salary", "wage", "bonus", "freelance", "gig", "refund"]),
    ]

    private static let stopwords: Set<String> = [
        "record", "add", "log", "track", "spent", "spend", "expense", "expenses",
        "income", "how", "much", "did", "i", "this", "month", "week",
        "today", "yesterday", "go", "to", "show", "my", "commitments", "tasks",
        "last", "the", "a", "an", "for", "on", "in", "at", "of", "and", "or",
        "what", "where", "when", "is", "was", "will", "can", "please", "just",
        "naira", "dollars", "usd", "ngn", "open", "navigate", "summarize", "summary",
    ]

    /// Parity with `parseAmount` — 5 regex patterns in priority order.
    /// Returns the parsed amount in major units (e.g. ₦500 → 500.0).
    static func parseAmount(_ input: String) -> Double? {
        let patterns: [String] = [
            #"(?:₦|NGN)\s*([\d,]+(?:\.\d{1,2})?)"#,
            #"\$([\d,]+(?:\.\d{1,2})?)"#,
            #"([\d,]+(?:\.\d{1,2})?)\s*(?:naira|ngn)"#,
            #"([\d,]+(?:\.\d{1,2})?)\s*(?:dollars?|usd)"#,
            #"(?:^|[\s(])(\d{2,}(?:[,\d]*)?(?:\.\d{1,2})?)(?:$|[\s)])"#,
        ]
        for p in patterns {
            guard let rx = try? NSRegularExpression(pattern: p, options: [.caseInsensitive]) else { continue }
            let range = NSRange(input.startIndex..., in: input)
            if let m = rx.firstMatch(in: input, range: range),
               m.numberOfRanges > 1,
               let r = Range(m.range(at: 1), in: input) {
                let raw = String(input[r]).replacingOccurrences(of: ",", with: "")
                if let n = Double(raw), n > 0 { return n }
            }
        }
        return nil
    }

    /// Keyword match first. Falls back to the first token > 2 chars
    /// that is not a stopword.
    static func parseCategory(_ input: String) -> String? {
        let lower = input.lowercased()
        for (cat, kws) in categoryKeywords where kws.contains(where: { lower.contains($0) }) {
            return cat
        }
        let cleaned = lower.replacingOccurrences(of: "[^a-z\\s]", with: " ", options: .regularExpression)
        return cleaned.split(separator: " ")
            .map(String.init)
            .first { $0.count > 2 && !stopwords.contains($0) }
    }

    /// Keyword-only (used for contextual follow-up resolution — no fallback
    /// to arbitrary tokens).
    static func extractContextCategory(_ input: String) -> String? {
        let lower = input.lowercased()
        for (cat, kws) in categoryKeywords where kws.contains(where: { lower.contains($0) }) {
            return cat
        }
        return nil
    }
}
