import SwiftUI

// MARK: - Design Tokens
// Source of truth: src/index.css @theme block
// Every hex value here maps 1:1 to the PWA CSS custom properties.
// When the PWA changes a token, update it here.

enum DesignTokens {

    // MARK: Brand — Anchor Blue (primary actions, navigation, focus)
    enum Primary {
        static let p50  = Color(hex: 0xEFF6FF)
        static let p100 = Color(hex: 0xDBEAFE)
        static let p200 = Color(hex: 0xBFDBFE)
        static let p300 = Color(hex: 0x93C5FD)
        static let p400 = Color(hex: 0x60A5FA)
        static let p500 = Color(hex: 0x3B82F6)
        static let p600 = Color(hex: 0x2563EB) // main — CTAs, active nav
        static let p700 = Color(hex: 0x1D4ED8)
        static let p800 = Color(hex: 0x1E40AF)
        static let p900 = Color(hex: 0x1E3A8A)
    }

    // MARK: Brand — Money Green (income, surplus, positive trends)
    enum Finance {
        static let f50  = Color(hex: 0xF0FDF4)
        static let f100 = Color(hex: 0xDCFCE7)
        static let f200 = Color(hex: 0xBBF7D0)
        static let f300 = Color(hex: 0x86EFAC)
        static let f400 = Color(hex: 0x4ADE80)
        static let f500 = Color(hex: 0x22C55E)
        static let f600 = Color(hex: 0x16A34A) // main — income/surplus
        static let f700 = Color(hex: 0x15803D)
        static let f800 = Color(hex: 0x166534)
        static let f900 = Color(hex: 0x14532D)
    }

    // MARK: Brand — Action Purple (tasks, commitments, streaks)
    enum Task {
        static let t50  = Color(hex: 0xFAF5FF)
        static let t100 = Color(hex: 0xF3E8FF)
        static let t200 = Color(hex: 0xE9D5FF)
        static let t300 = Color(hex: 0xD8B4FE)
        static let t400 = Color(hex: 0xC084FC)
        static let t500 = Color(hex: 0xA855F7)
        static let t600 = Color(hex: 0x9333EA) // main — commitments, streaks
        static let t700 = Color(hex: 0x7E22CE)
        static let t800 = Color(hex: 0x6B21A8)
        static let t900 = Color(hex: 0x581C87)
    }

    // MARK: Brand — Warm Coral (family, shared accounts, collaboration)
    enum Family {
        static let o50  = Color(hex: 0xFFF7ED)
        static let o100 = Color(hex: 0xFFEDD5)
        static let o200 = Color(hex: 0xFED7AA)
        static let o300 = Color(hex: 0xFDBA74)
        static let o400 = Color(hex: 0xFB923C)
        static let o500 = Color(hex: 0xF97316)
        static let o600 = Color(hex: 0xEA580C) // main — shared accounts
        static let o700 = Color(hex: 0xC2410C)
        static let o800 = Color(hex: 0x9A3412)
        static let o900 = Color(hex: 0x7C2D12)
    }

    // MARK: Neutrals — Slate (primary neutral)
    enum Slate {
        static let s50  = Color(hex: 0xF8FAFC)
        static let s100 = Color(hex: 0xF1F5F9)
        static let s200 = Color(hex: 0xE2E8F0)
        static let s300 = Color(hex: 0xCBD5E1)
        static let s400 = Color(hex: 0x94A3B8)
        static let s500 = Color(hex: 0x64748B)
        static let s600 = Color(hex: 0x475569)
        static let s700 = Color(hex: 0x334155)
        static let s800 = Color(hex: 0x1E293B)
        static let s900 = Color(hex: 0x0F172A)
        static let s950 = Color(hex: 0x020617)
    }

    // MARK: Neutrals — Gray (secondary neutral)
    enum Gray {
        static let g50  = Color(hex: 0xF9FAFB)
        static let g100 = Color(hex: 0xF3F4F6)
        static let g200 = Color(hex: 0xE5E7EB)
        static let g300 = Color(hex: 0xD1D5DB)
        static let g400 = Color(hex: 0x9CA3AF)
        static let g500 = Color(hex: 0x6B7280)
        static let g600 = Color(hex: 0x4B5563)
        static let g700 = Color(hex: 0x374151)
        static let g800 = Color(hex: 0x1F2937)
        static let g900 = Color(hex: 0x111827)
        static let g950 = Color(hex: 0x030712)
    }

    // MARK: Surfaces (light mode)
    enum SurfaceLight {
        static let surface1 = Color(hex: 0xF8FAFC) // page background
        static let surface2 = Color(hex: 0xFFFFFF) // cards
        static let surface3 = Color(hex: 0xF1F5F9) // inputs, modals
    }

    // MARK: Surfaces (dark mode)
    enum SurfaceDark {
        static let surface1 = Color(hex: 0x0A0F1A) // deep navy
        static let surface2 = Color(hex: 0x0F172A) // slate-900 cards
        static let surface3 = Color(hex: 0x1E293B) // slate-800 inputs
    }

    // MARK: Status — Light mode
    enum StatusLight {
        static let success = Color(hex: 0x10B981)
        static let error   = Color(hex: 0xF43F5E)
        static let warning = Color(hex: 0xF59E0B)
    }

    // MARK: Status — Dark mode (brighter for dark backgrounds)
    enum StatusDark {
        static let success = Color(hex: 0x34D399)
        static let error   = Color(hex: 0xF87171)
        static let warning = Color(hex: 0xFBBF24)
    }

    // MARK: Focus ring
    enum Focus {
        static let light = Color(hex: 0x06B6D4) // cyan
        static let dark  = Color(hex: 0x22D3EE) // bright cyan
    }

    // MARK: Glass morphism
    enum Glass {
        // Light mode
        static let bgLight     = Color.white.opacity(0.7)
        static let borderLight = Color.white.opacity(0.3)
        static let blurLight: CGFloat = 12

        // Dark mode
        static let bgDark     = Color(hex: 0x0F172A).opacity(0.6)
        static let borderDark = Color.white.opacity(0.05)
        static let blurDark: CGFloat = 20
    }

    // Card tokens, preset colors, and Color hex initializer
    // → DesignTokens+Cards.swift (ARCH-001 split)
}
