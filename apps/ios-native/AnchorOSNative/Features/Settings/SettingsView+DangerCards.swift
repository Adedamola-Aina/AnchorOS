import SwiftUI

extension SettingsView {
    // MARK: — Danger Zone

    var dangerZoneCard: some View {
        AnchorCard(title: "Account", icon: "exclamationmark.triangle") {
            Button {
                showDangerZone = true
            } label: {
                HStack {
                    Image(systemName: "person.crop.circle.badge.minus")
                        .foregroundStyle(AnchorPalette.danger)
                    Text("Delete Account")
                        .fontWeight(.semibold)
                        .foregroundStyle(AnchorPalette.danger)
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(AnchorPalette.textSecondary)
                }
            }
            .buttonStyle(.plain)
        }
        .sheet(isPresented: $showDangerZone) {
            DangerZoneView().environmentObject(appState)
        }
    }

    // MARK: — Sign Out

    var signOutCard: some View {
        AnchorCard(title: "Session", icon: "rectangle.portrait.and.arrow.right") {
            Button {
                appState.signOut()
            } label: {
                Text("Sign Out")
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(Color.red.opacity(0.85))
                    .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            .buttonStyle(.plain)
        }
    }
}
