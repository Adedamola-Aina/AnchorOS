import SwiftUI
import Network

@MainActor
final class NetworkStatus: ObservableObject {
    @Published var isOnline = true
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "anchor.network")

    init() {
        monitor.pathUpdateHandler = { [weak self] path in
            Task { @MainActor in self?.isOnline = path.status == .satisfied }
        }
        monitor.start(queue: queue)
    }

    deinit { monitor.cancel() }
}

struct OfflineIndicator: View {
    @StateObject private var status = NetworkStatus()

    var body: some View {
        if !status.isOnline {
            HStack(spacing: 8) {
                Image(systemName: "wifi.slash")
                Text("Offline mode — changes will sync when connection returns")
                    .font(.caption)
                    .fontWeight(.semibold)
            }
            .foregroundStyle(AnchorPalette.warning)
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .frame(maxWidth: .infinity)
            .background(AnchorPalette.warning.opacity(0.12))
            .overlay(
                Rectangle()
                    .fill(AnchorPalette.warning.opacity(0.25))
                    .frame(height: 1),
                alignment: .bottom
            )
        }
    }
}
