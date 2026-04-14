import SwiftUI

// MARK: - Skeleton Views — Base Shapes
// Loading shimmer placeholders matching PWA Skeleton.tsx.
// Page-level skeletons live in SkeletonPages.swift.

// MARK: - Base Skeleton Shape

struct SkeletonShape: View {
    var width: CGFloat?
    var height: CGFloat
    var radius: CGFloat = 8

    var body: some View {
        RoundedRectangle(cornerRadius: radius)
            .fill(AnchorPalette.chip.opacity(0.6))
            .frame(width: width, height: height)
            .pulseSlow()
    }
}

struct SkeletonCircle: View {
    var size: CGFloat

    var body: some View {
        Circle()
            .fill(AnchorPalette.chip.opacity(0.6))
            .frame(width: size, height: size)
            .pulseSlow()
    }
}

// MARK: - Skeleton Card

struct SkeletonCard: View {
    var height: CGFloat = 80

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            SkeletonShape(width: 96, height: 14)
            SkeletonShape(height: 28)
            SkeletonShape(width: 160, height: 12)
        }
        .padding(16)
        .frame(maxWidth: .infinity, minHeight: height, alignment: .topLeading)
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(AnchorPalette.cardBorder, lineWidth: 1)
        )
    }
}

// MARK: - Skeleton List Item

struct SkeletonListItem: View {
    var hasAvatar = false

    var body: some View {
        HStack(spacing: 12) {
            if hasAvatar {
                SkeletonCircle(size: 40)
            }
            VStack(alignment: .leading, spacing: 6) {
                SkeletonShape(width: 160, height: 14)
                SkeletonShape(width: 100, height: 12)
            }
            Spacer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }
}
