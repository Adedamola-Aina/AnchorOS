import Foundation

/// A single message in the Fabric conversation history, used to resolve
/// follow-up queries ("what about food?" after "how much did I spend?").
/// Parity: src/types FabricMessage.
///
/// History is ephemeral — we keep it in memory only, matching the PWA
/// pattern where `messages` lives in FabricPage component state. A new
/// session starts with an empty history.
struct AnchorFabricMessage: Equatable {
    enum Role: String { case user, assistant }
    let role: Role
    let content: String
    let timestamp: Date
}
