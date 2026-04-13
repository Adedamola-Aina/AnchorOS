import SwiftUI

struct AnchorBackground: View {
    var body: some View {
        ZStack {
            AnchorPalette.background

            Circle()
                .fill(AnchorPalette.backgroundGlowTop.opacity(0.34))
                .frame(width: 240, height: 240)
                .blur(radius: 60)
                .offset(x: -120, y: -280)

            Circle()
                .fill(AnchorPalette.backgroundGlowBottom.opacity(0.22))
                .frame(width: 280, height: 280)
                .blur(radius: 70)
                .offset(x: 150, y: 340)
        }
        .ignoresSafeArea()
    }
}
