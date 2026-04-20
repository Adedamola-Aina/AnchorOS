import SwiftUI

extension SettingsView {
    // MARK: — Appearance

    var appearanceCard: some View {
        AnchorCard(title: "Appearance", icon: "paintbrush") {
            VStack(alignment: .leading, spacing: 12) {
                Text("ENVIRONMENT")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Picker("Environment", selection: Binding(
                    get: { appState.environment },
                    set: { appState.setEnvironment($0) }
                )) {
                    ForEach(AppEnvironment.allCases, id: \.self) { env in
                        Text(env.rawValue.capitalized).tag(env)
                    }
                }
                .pickerStyle(.segmented)

                Text("THEME")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Picker("Theme", selection: $theme.mode) {
                    Text("System").tag(AnchorTheme.Mode.system)
                    Text("Light").tag(AnchorTheme.Mode.light)
                    Text("Dark").tag(AnchorTheme.Mode.dark)
                }
                .pickerStyle(.segmented)

                Text("ACCESSIBILITY")
                    .font(.caption).fontWeight(.bold)
                    .foregroundStyle(AnchorPalette.textSecondary)

                Picker("Font", selection: $fontSize) {
                    Text("Default").tag("Default")
                    Text("Large").tag("Large")
                    Text("Extra Large").tag("Extra Large")
                }
                .pickerStyle(.segmented)

                Toggle("High Contrast", isOn: $highContrast)
                    .tint(AnchorPalette.chipActive)
                    .foregroundStyle(AnchorPalette.textPrimary)

                Button {
                    if let url = URL(string: UIApplication.openSettingsURLString) {
                        UIApplication.shared.open(url)
                    }
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "figure.walk.motion")
                            .foregroundStyle(AnchorPalette.chipActive)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Reduce Motion")
                                .font(.subheadline).fontWeight(.semibold)
                                .foregroundStyle(AnchorPalette.textPrimary)
                            Text("Managed in iOS Settings › Accessibility")
                                .font(.caption)
                                .foregroundStyle(AnchorPalette.textSecondary)
                        }
                        Spacer()
                        Image(systemName: "arrow.up.right.square")
                            .foregroundStyle(AnchorPalette.textSecondary)
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
        }
    }
}
