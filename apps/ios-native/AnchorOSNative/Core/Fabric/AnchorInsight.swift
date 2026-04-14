import Foundation

/// A computed financial or behavioral insight shown in AnchorAI.
/// Mirrors the PWA Insight type from src/types/index.ts
struct AnchorInsight: Identifiable {
    enum Severity { case positive, neutral, attention }
    enum Trend { case up, down, stable }

    let id: String
    let category: String
    let headline: String
    let detail: String
    let severity: Severity
    let trend: Trend

    var icon: String {
        switch category {
        case "spending":  return "cart.fill"
        case "savings":   return "banknote.fill"
        case "networth":  return "chart.pie.fill"
        case "streak":    return "flame.fill"
        default:          return "lightbulb.fill"
        }
    }

    var trendArrow: String {
        switch trend {
        case .up:     return "↑"
        case .down:   return "↓"
        case .stable: return "≈"
        }
    }
}
