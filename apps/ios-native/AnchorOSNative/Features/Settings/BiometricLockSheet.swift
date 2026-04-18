import SwiftUI

struct BiometricLockSheet: View {
    @EnvironmentObject private var biometricLock: BiometricLockStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    AnchorCard(title: "Biometric Lock", icon: "faceid") {
                        VStack(alignment: .leading, spacing: 12) {
                            Toggle(
                                "Require \(biometricLock.biometryLabel) when opening Anchor",
                                isOn: Binding(
                                    get: { biometricLock.isEnabled },
                                    set: { biometricLock.isEnabled = $0 }
                                )
                            )
                            .tint(AnchorPalette.chipActive)

                            Text(biometricLock.isAvailable
                                 ? "Protect your finance and family data with a native unlock challenge."
                                 : "Biometric authentication is currently unavailable on this device.")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)

                            if let lastError = biometricLock.lastError, !lastError.isEmpty {
                                Text(lastError)
                                    .font(.caption)
                                    .foregroundStyle(AnchorPalette.warning)
                            }

                            if biometricLock.isEnabled && biometricLock.isAvailable {
                                Button {
                                    Task { await biometricLock.unlock() }
                                } label: {
                                    HStack {
                                        Spacer()
                                        Label("Test Unlock", systemImage: "lock.open.fill")
                                            .fontWeight(.semibold)
                                        Spacer()
                                    }
                                    .padding(.vertical, 12)
                                    .background(AnchorPalette.chipActive)
                                    .foregroundStyle(.white)
                                    .clipShape(RoundedRectangle(cornerRadius: 12))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
                .padding(16)
            }
            .background(AnchorBackground())
            .navigationTitle("App Lock")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") { dismiss() }
                }
            }
        }
    }
}

struct BiometricLockOverlay: View {
    @EnvironmentObject private var biometricLock: BiometricLockStore

    var body: some View {
        ZStack {
            Color.black.opacity(0.45)
                .ignoresSafeArea()

            VStack(spacing: 16) {
                ZStack {
                    Circle()
                        .fill(AnchorPalette.chip.opacity(0.92))
                        .frame(width: 82, height: 82)
                        .ringGlow(color: AnchorPalette.focusRing)
                    Image(systemName: "lock.shield.fill")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundStyle(AnchorPalette.chipActive)
                        .anchorBob()
                }

                Text("Anchor is locked")
                    .font(.title3.weight(.bold))
                    .foregroundStyle(AnchorPalette.textPrimary)

                Text("Use \(biometricLock.biometryLabel) to unlock your financial workspace.")
                    .font(.subheadline)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Button {
                    Task { await biometricLock.unlock() }
                } label: {
                    HStack {
                        Spacer()
                        Label("Unlock", systemImage: "faceid")
                            .fontWeight(.semibold)
                        Spacer()
                    }
                    .padding(.vertical, 12)
                    .background(AnchorPalette.chipActive)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .buttonStyle(.plain)
            }
            .padding(20)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .stroke(AnchorPalette.glassBorder, lineWidth: 1)
            )
            .padding(24)
        }
    }
}
