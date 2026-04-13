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
        case .development:
            return Color(red: 0.16, green: 0.44, blue: 0.98)
        case .staging:
            return Color(red: 0.98, green: 0.80, blue: 0.12)
        case .production:
            return Color(red: 0.18, green: 0.80, blue: 0.45)
        }
    }
}

