import SwiftUI

struct EnvironmentBanner: View {
    let environment: AppEnvironment

    var body: some View {
        Text(environment.rawValue.uppercased() + " ENVIRONMENT")
            .font(.caption)
            .fontWeight(.bold)
            .tracking(1)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(backgroundColor)
            .foregroundStyle(.black)
    }

    private var backgroundColor: Color {
        switch environment {
        case .development: return DesignTokens.Primary.p500
        case .staging:     return DesignTokens.StatusLight.warning
        case .production:  return DesignTokens.Finance.f500
        }
    }
}

