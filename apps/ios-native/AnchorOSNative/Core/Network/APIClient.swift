import Foundation

struct HealthResponse: Codable {
    let ok: Bool
}

enum APIError: Error {
    case invalidResponse
}

final class APIClient {
    static let shared = APIClient()
    private init() {}

    func fetchHealth(baseURL: URL) async throws -> HealthResponse {
        let url = baseURL.appendingPathComponent("api/health")
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.timeoutInterval = 12

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw APIError.invalidResponse
        }

        return try JSONDecoder().decode(HealthResponse.self, from: data)
    }
}
