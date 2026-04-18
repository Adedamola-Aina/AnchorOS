import SwiftUI

/// Horizontal chip-row filter bar for TasksView. Extracted from TasksView
/// (ARCH-001). Two state-bound rows: type filter + priority filter, mirroring
/// PWA TaskList semantics (src/features/commitments/components/TaskList.tsx).
struct TasksFilterBar: View {
    @Binding var selectedFilter: String
    @Binding var selectedPriority: String

    let filters: [String]
    let priorityFilters: [String]

    var body: some View {
        VStack(spacing: 10) {
            typeRow
            priorityRow
        }
    }

    private var typeRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(filters, id: \.self) { f in
                    Button {
                        selectedFilter = f
                    } label: {
                        Text(f.uppercased())
                            .font(.caption).fontWeight(.bold)
                            .foregroundStyle(selectedFilter == f ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                            .padding(.horizontal, 16).padding(.vertical, 8)
                            .background(selectedFilter == f ? AnchorPalette.chipActive : AnchorPalette.chip)
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                    .anchorPressable()
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var priorityRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(priorityFilters, id: \.self) { p in
                    Button {
                        selectedPriority = p
                    } label: {
                        HStack(spacing: 4) {
                            if p != "All" {
                                Image(systemName: Self.priorityIcon(p))
                                    .font(.caption2)
                            }
                            Text(p.uppercased())
                                .font(.caption2).fontWeight(.bold)
                        }
                        .foregroundStyle(selectedPriority == p ? AnchorPalette.textPrimary : AnchorPalette.textSecondary)
                        .padding(.horizontal, 12).padding(.vertical, 6)
                        .background(selectedPriority == p ? AnchorPalette.chipActive : AnchorPalette.chip)
                        .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                    .anchorPressable()
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    /// Mirrors AnchorCommitment.priorityIcon for filter-chip display.
    static func priorityIcon(_ p: String) -> String {
        switch p.lowercased() {
        case "critical": return "exclamationmark.2"
        case "high":     return "exclamationmark"
        case "medium":   return "minus"
        case "low":      return "arrow.down"
        default:         return "circle"
        }
    }
}
