import SwiftUI

// MARK: - Skeleton Page Layouts
// Full-page loading shimmer placeholders matching PWA SkeletonPages.tsx.
// Split from SkeletonView.swift for ARCH-001 (≤ 200 lines).

struct SkeletonDashboard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 6) {
                    SkeletonShape(width: 180, height: 18)
                    SkeletonShape(width: 96, height: 12)
                }
                Spacer()
                SkeletonCircle(size: 48)
            }
            SkeletonCard(height: 120)
            HStack(spacing: 12) {
                SkeletonCard()
                SkeletonCard()
            }
            VStack(alignment: .leading, spacing: 4) {
                SkeletonShape(width: 120, height: 14).padding(.bottom, 8)
                SkeletonListItem()
                SkeletonListItem()
                SkeletonListItem()
            }
        }
        .padding(16)
    }
}

struct SkeletonFinance: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                SkeletonShape(width: 96, height: 22)
                Spacer()
                SkeletonShape(width: 80, height: 32, radius: 12)
            }
            ForEach(0..<3, id: \.self) { i in
                SkeletonCard(height: 140)
                    .opacity(1.0 - Double(i) * 0.15)
            }
            VStack(alignment: .leading, spacing: 4) {
                SkeletonShape(width: 112, height: 14).padding(.bottom, 8)
                ForEach(0..<5, id: \.self) { _ in
                    SkeletonListItem(hasAvatar: true)
                }
            }
        }
        .padding(16)
    }
}

struct SkeletonCommitments: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                SkeletonShape(width: 128, height: 22)
                Spacer()
                SkeletonShape(width: 40, height: 40, radius: 12)
            }
            HStack(spacing: 8) {
                ForEach(0..<4, id: \.self) { _ in
                    SkeletonShape(width: 64, height: 32, radius: 16)
                }
            }
            ForEach(0..<5, id: \.self) { _ in
                HStack(spacing: 12) {
                    SkeletonCircle(size: 24)
                    VStack(alignment: .leading, spacing: 4) {
                        SkeletonShape(width: 180, height: 14)
                        SkeletonShape(width: 80, height: 12)
                    }
                    Spacer()
                    SkeletonShape(width: 64, height: 24, radius: 12)
                }
                .padding(12)
                .background(AnchorPalette.card)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
        .padding(16)
    }
}

struct SkeletonSettings: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            HStack(spacing: 16) {
                SkeletonCircle(size: 64)
                VStack(alignment: .leading, spacing: 6) {
                    SkeletonShape(width: 128, height: 18)
                    SkeletonShape(width: 192, height: 14)
                }
            }
            ForEach(0..<3, id: \.self) { _ in
                VStack(alignment: .leading, spacing: 8) {
                    SkeletonShape(width: 96, height: 14)
                    VStack(spacing: 0) {
                        ForEach(0..<3, id: \.self) { _ in
                            HStack {
                                HStack(spacing: 12) {
                                    SkeletonShape(width: 32, height: 32, radius: 8)
                                    SkeletonShape(width: 128, height: 14)
                                }
                                Spacer()
                                SkeletonShape(width: 48, height: 24, radius: 12)
                            }
                            .padding(16)
                        }
                    }
                    .background(AnchorPalette.card)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                }
            }
        }
        .padding(16)
    }
}

struct SkeletonFinanceCards: View {
    var count = 3

    var body: some View {
        VStack(spacing: 12) {
            ForEach(0..<count, id: \.self) { _ in
                RoundedRectangle(cornerRadius: DesignTokens.cardCornerRadius)
                    .fill(AnchorPalette.chip.opacity(0.4))
                    .aspectRatio(DesignTokens.cardAspectRatio, contentMode: .fit)
                    .overlay(alignment: .topLeading) {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                SkeletonShape(width: 96, height: 14)
                                Spacer()
                                SkeletonShape(width: 64, height: 12)
                            }
                            Spacer()
                            SkeletonShape(width: 128, height: 24)
                            HStack {
                                SkeletonShape(width: 80, height: 12)
                                Spacer()
                                SkeletonShape(width: 56, height: 20, radius: 10)
                            }
                        }
                        .padding(20)
                    }
                    .pulseSlow()
            }
        }
    }
}
