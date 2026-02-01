# Changelog

All notable changes to this project will be documented in this file.

## [v1.5.11] - 2026-02-01

### ⚡ Performance Hotfix
- **Heating/CPU Drain** (BUG-027): Fixed critical infinite loop in AuthContext that caused phones to get hot.

## [v1.5.10] - 2026-02-01

### 📱 Native Experience Hotfix
- **System Theme Auto-Detect** (BUG-025): Fixed auto-switching on iOS/Android (App now listens to OS changes).
- **Standardized Haptics** (BUG-026): Unified haptic feedback logic (Animation fallback on iOS).

## [v1.5.9] - 2026-02-01

### 🚀 Major Features
- **Transaction History UI** (UX-023): Complete redesign with adaptive height and scrolling.
- **System Theme Detection** (PWA-006): Initial implementation.
- **Multi-Team Sprint** (GAP-002): Support for cross-functional sprint tracking.
- **Recurring Transactions** (FIN-003): Full implementation of recurring logic.

### 🎨 UX Enhancements
- **Compact Currency** (UX-019): Overflow protection for large numbers.
- **Haptic Animations** (UX-023/020): Better feedback on interactions.
- **Button Standardization** (UX-011): Unified button styles across the app.
- **OLED Mode** (UX-002): True black theme optimizations.

### 🐛 Bug Fixes
- **Exchange Rate Inflation** (BUG-024): Fixed 100x calculation error.
- **Checkbox State** (BUG-023): Fixed optimistic update glitches.
- **Modal Interactions** (BUG-018/019/020): Fixed backdrop and click handling.
- **Currency Conversion** (BUG-016): Fixed transfer rate logic.
- **Real-time Balance** (BUG-015): Fixed optimistic UI updates.

### 🏗️ Infrastructure
- **Dashboard Parity**: Fixed environment state logic for Staging/Production.
- **Service Worker**: Improved cache invalidation (REG-003).

---
