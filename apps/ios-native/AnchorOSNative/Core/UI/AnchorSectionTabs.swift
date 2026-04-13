import SwiftUI

struct AnchorSectionTabs: View {
    let labels: [String]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(labels, id: \.self) { label in
                    AnchorChip(label: label)
                }
            }
        }
    }
}

