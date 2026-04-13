import Foundation

struct HealthResponse: Codable {
    let ok: Bool
}

struct DashboardSnapshot {
    let alertsCount: Int
    let criticalAlerts: Int
    let completedThisWeek: Int
    let inProgressCount: Int
    let functionCoveragePct: Double?
}

enum APIError: Error {
    case invalidResponse
    case invalidPayload
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

    func fetchDashboardSnapshot(baseURL: URL) async throws -> DashboardSnapshot {
        let url = baseURL.appendingPathComponent("api/command-center")
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.timeoutInterval = 12

        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, (200...299).contains(http.statusCode) else {
            throw APIError.invalidResponse
        }

        guard
            let object = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            let alerts = object["alerts"] as? [String: Any],
            let work = object["work"] as? [String: Any],
            let codeIntegrity = object["codeIntegrity"] as? [String: Any],
            let functionsCoverage = codeIntegrity["functionsCoverage"] as? [String: Any]
        else {
            throw APIError.invalidPayload
        }

        let alertsCount = alerts["count"] as? Int ?? 0
        let criticalAlerts = alerts["critical"] as? Int ?? 0
        let completedThisWeek = work["completedThisWeek"] as? Int ?? 0
        let inProgressCount = work["inProgress"] as? Int ?? 0
        let functionCoveragePct = functionsCoverage["functions"] as? Double

        return DashboardSnapshot(
            alertsCount: alertsCount,
            criticalAlerts: criticalAlerts,
            completedThisWeek: completedThisWeek,
            inProgressCount: inProgressCount,
            functionCoveragePct: functionCoveragePct
        )
    }
}
