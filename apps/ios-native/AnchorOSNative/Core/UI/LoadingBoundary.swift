import SwiftUI

// MARK: - LoadingBoundary
// Wraps content with skeleton fallback while loading.
// Matches PWA LoadingBoundary.tsx pattern.

enum LoadingSkeletonType {
    case dashboard, finance, commitments, settings, spinner, minimal
}

struct LoadingBoundary<Content: View>: View {
    let isLoading: Bool
    let skeleton: LoadingSkeletonType
    @ViewBuilder let content: () -> Content

    init(
        isLoading: Bool,
        skeleton: LoadingSkeletonType = .spinner,
        @ViewBuilder content: @escaping () -> Content
    ) {
        self.isLoading = isLoading
        self.skeleton = skeleton
        self.content = content
    }

    var body: some View {
        if isLoading {
            skeletonView
                .transition(.opacity.combined(with: .scale(scale: 0.98)))
        } else {
            content()
                .transition(.opacity)
        }
    }

    @ViewBuilder
    private var skeletonView: some View {
        switch skeleton {
        case .dashboard:   SkeletonDashboard()
        case .finance:     SkeletonFinance()
        case .commitments: SkeletonCommitments()
        case .settings:    SkeletonSettings()
        case .spinner:     LoadingSpinnerView(size: .md)
        case .minimal:     LoadingSpinnerView(size: .sm)
        }
    }
}

// MARK: - Inline Loading

struct InlineLoading: View {
    var message = "Loading..."

    var body: some View {
        HStack(spacing: 8) {
            ProgressView()
                .tint(AnchorPalette.textSecondary)
            Text(message)
                .font(AnchorTypography.small)
                .foregroundStyle(AnchorPalette.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(message)
    }
}

// MARK: - Page Loading

struct PageLoading: View {
    var message: String?

    var body: some View {
        VStack(spacing: 12) {
            Spacer()
            LoadingSpinnerView(size: .lg, message: message)
            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

// Spinner types moved to LoadingSpinners.swift for ARCH-001 compliance.
