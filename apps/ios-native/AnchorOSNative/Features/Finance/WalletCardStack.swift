import SwiftUI

// MARK: - WalletCardStack
// Apple Wallet-inspired interactive card stack carousel.
// Replaces the flat account list in FinanceView.
// Matches PWA CardStack / WalletCard / WalletStack (UX-041).

struct WalletCardStack: View {
    let accounts: [AnchorAccount]
    let onAdd: () -> Void
    let onEdit: (AnchorAccount) -> Void
    let onDelete: (AnchorAccount) -> Void

    @State private var currentIndex: Int = 0
    @State private var dragOffset: CGFloat = 0
    @State private var isDragging = false

    private let cardHeight: CGFloat = 180
    private let peekOffset: CGFloat = 20

    var body: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .bottom) {
                ForEach(Array(accounts.enumerated().reversed()), id: \.element.resolvedId) { index, account in
                    walletCard(account, at: index)
                }

                if accounts.isEmpty {
                    emptyCard
                }
            }
            .frame(height: cardHeight + peekOffset * CGFloat(min(accounts.count - 1, 3)))
            .clipped()
            .contentShape(Rectangle())
            .gesture(dragGesture)

            // Dots indicator
            if accounts.count > 1 {
                HStack(spacing: 6) {
                    ForEach(0..<accounts.count, id: \.self) { i in
                        Circle()
                            .fill(i == currentIndex ? AnchorPalette.chipActive : AnchorPalette.chip)
                            .frame(width: i == currentIndex ? 8 : 5, height: i == currentIndex ? 8 : 5)
                            .animation(.spring(response: 0.3), value: currentIndex)
                    }
                }
                .padding(.top, 12)
            }

            // Add account button
            Button(action: onAdd) {
                Label("Add Account", systemImage: "plus.circle")
                    .font(.subheadline).fontWeight(.semibold)
                    .foregroundStyle(AnchorPalette.chipActive)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
            }
            .buttonStyle(.plain)
            .padding(.top, 8)
        }
        .padding(.horizontal, 20)
        .padding(.top, 16)
        .padding(.bottom, 8)
    }

    // MARK: — Card

    private func walletCard(_ account: AnchorAccount, at index: Int) -> some View {
        let offset = cardOffset(for: index)
        let scale = cardScale(for: index)
        let isTop = index == currentIndex

        return VStack(alignment: .leading, spacing: 0) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(account.name)
                        .font(.title3).fontWeight(.bold)
                        .foregroundStyle(.white)
                    Text(account.type.uppercased())
                        .font(.caption2).fontWeight(.bold)
                        .foregroundStyle(.white.opacity(0.65))
                        .tracking(1)
                    if let institution = account.institution, !institution.isEmpty {
                        Text(institution)
                            .font(.caption2)
                            .foregroundStyle(.white.opacity(0.75))
                    }
                }
                Spacer()
                if isTop {
                    Menu {
                        Button { onEdit(account) } label: {
                            Label("Edit Account", systemImage: "pencil")
                        }
                        Button(role: .destructive) { onDelete(account) } label: {
                            Label("Remove Account", systemImage: "trash")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .font(.title3)
                            .foregroundStyle(.white.opacity(0.85))
                    }
                }
            }
            .padding(.horizontal, 20).padding(.top, 20)

            Spacer()

            VStack(alignment: .leading, spacing: 4) {
                Text("BALANCE")
                    .font(.caption2).fontWeight(.bold)
                    .foregroundStyle(.white.opacity(0.6)).tracking(1)
                Text(account.formattedBalance)
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
            }
            .padding(.horizontal, 20).padding(.bottom, 20)
        }
        .frame(maxWidth: .infinity)
        .frame(height: cardHeight)
        .background(cardBackground(account, at: index))
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .shadow(color: .black.opacity(0.25), radius: 12, x: 0, y: 6)
        .offset(y: offset)
        .scaleEffect(x: scale, y: scale)
        .zIndex(Double(index == currentIndex ? 100 : index))
        .animation(.spring(response: 0.4, dampingFraction: 0.8), value: currentIndex)
        .animation(isDragging ? .none : .spring(response: 0.4, dampingFraction: 0.8), value: dragOffset)
        .contentShape(Rectangle())
        .onTapGesture {
            // Parity: PWA useFinanceCardInteraction fires haptic.selection on expand.
            // Native stack: tapping a background card brings it to the top.
            guard !isTop else { return }
            AnchorHaptics.selection()
            withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                currentIndex = index
            }
        }
    }

    // MARK: — Empty Card

    private var emptyCard: some View {
        VStack(spacing: 12) {
            Image(systemName: "creditcard.fill")
                .font(.system(size: 32))
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("No accounts yet")
                .font(.subheadline).fontWeight(.semibold)
                .foregroundStyle(AnchorPalette.textSecondary)
            Text("Tap \"Add Account\" to get started")
                .font(.caption)
                .foregroundStyle(AnchorPalette.textSecondary.opacity(0.7))
        }
        .frame(maxWidth: .infinity)
        .frame(height: cardHeight)
        .background(AnchorPalette.card)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .overlay(RoundedRectangle(cornerRadius: 20).stroke(AnchorPalette.cardBorder, lineWidth: 1))
    }

    // MARK: — Background

    private func cardBackground(_ account: AnchorAccount, at index: Int) -> some View {
        let userColor = resolvedColor(account.color, fallbackIndex: index)
        return ZStack {
            LinearGradient(
                colors: [userColor, userColor.opacity(0.7)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            CardArtworkOverlay(style: account.artwork ?? CardArtworkStyle.stripes.rawValue)
        }
    }

    // MARK: — Layout Math

    private func cardOffset(for index: Int) -> CGFloat {
        let relativeIndex = index - currentIndex
        // Cards below current card stack upward with peeking
        if relativeIndex < 0 {
            return CGFloat(relativeIndex) * peekOffset + dragOffset * 0.3
        } else if relativeIndex == 0 {
            return isDragging ? dragOffset * 0.5 : 0
        } else {
            return CGFloat(relativeIndex) * peekOffset
        }
    }

    private func cardScale(for index: Int) -> CGFloat {
        let relativeIndex = abs(index - currentIndex)
        return max(0.85, 1.0 - CGFloat(relativeIndex) * 0.04)
    }

    // MARK: — Gesture

    private var dragGesture: some Gesture {
        DragGesture()
            .onChanged { value in
                isDragging = true
                dragOffset = value.translation.width
            }
            .onEnded { value in
                isDragging = false
                let threshold: CGFloat = 60
                if value.translation.width < -threshold && currentIndex < accounts.count - 1 {
                    haptic()
                    currentIndex += 1
                } else if value.translation.width > threshold && currentIndex > 0 {
                    haptic()
                    currentIndex -= 1
                }
                withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                    dragOffset = 0
                }
            }
    }

    private func haptic() {
        AnchorHaptics.selection()
    }

    // MARK: — Color Resolution

    private func resolvedColor(_ colorHex: String?, fallbackIndex: Int) -> Color {
        if let hex = colorHex, !hex.isEmpty, let color = Color(hex: hex) {
            return color
        }
        return AnchorAccount.cardColors[fallbackIndex % AnchorAccount.cardColors.count]
    }
}

// MARK: - Color hex init

extension Color {
    init?(hex: String) {
        var h = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if h.hasPrefix("#") { h.removeFirst() }
        guard h.count == 6, let value = UInt64(h, radix: 16) else { return nil }
        self.init(
            red: Double((value >> 16) & 0xFF) / 255,
            green: Double((value >> 8) & 0xFF) / 255,
            blue: Double(value & 0xFF) / 255
        )
    }
}
