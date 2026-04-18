import Foundation

enum AnchorDesignTokenCatalog {
    private static let values: [String: String] = {
        guard let url = Bundle.main.url(forResource: "AnchorDesignTokens", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let decoded = try? JSONDecoder().decode([String: String].self, from: data) else {
            return [:]
        }
        return decoded
    }()

    static func hex(_ key: String, fallback: UInt) -> UInt {
        guard let raw = values[key]?.replacingOccurrences(of: "#", with: ""),
              let parsed = UInt(raw, radix: 16) else {
            return fallback
        }
        return parsed
    }
}
