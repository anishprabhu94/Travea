import SwiftUI

// MARK: - Color Extensions (Using Built-in Colors for Immediate Preview)
extension Color {
    static let onyx = Color(red: 0.04, green: 0.04, blue: 0.04) // #0A0A0A
    static let champagneGold = Color(red: 0.8, green: 0.72, blue: 0.55) // #CBB88C
    static let textPrimary = Color(red: 0.95, green: 0.95, blue: 0.91) // #F3F1E7
    static let textSecondary = Color(red: 0.61, green: 0.58, blue: 0.55) // #9B958D
}

// MARK: - Discovery Section Main View
struct DiscoverySection: View {
    var body: some View {
        VStack(spacing: 24) {
            // 1. Section Header
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("Discovery")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(Color.textPrimary)
                    
                    Spacer()
                }
                .padding(.horizontal, 20)
                
                // Thin underline
                HStack {
                    Capsule()
                        .fill(Color.champagneGold.opacity(0.3))
                        .frame(width: 40, height: 1)
                    
                    Spacer()
                }
                .padding(.horizontal, 20)
            }
            
            // 2. Horizontal Feature Cards
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    FeatureCard(
                        title: "Experiences",
                        imageName: "feat1",
                        chips: ["2–3 hrs", "Clifftop", "Tickets"]
                    )
                    
                    FeatureCard(
                        title: "Dining",
                        imageName: "feat2", 
                        chips: ["Seafood", "€€", "Old Town"]
                    )
                    
                    FeatureCard(
                        title: "Culture",
                        imageName: "feat3",
                        chips: ["Basilica", "Museo", "10–18"]
                    )
                }
                .padding(.horizontal, 20)
            }
            
            // 3. Editor's Highlights
            EditorsHighlightsPane()
                .padding(.top, 20)
            
            // 4. Essentials Pane
            EssentialsPane()
        }
    }
}

// MARK: - Feature Card Component
private struct FeatureCard: View {
    let title: String
    let imageName: String
    let chips: [String]
    
    var body: some View {
        ZStack {
            // Background Image
            Image(imageName)
                .resizable()
                .scaledToFill()
                .frame(width: 280, height: 180)
                .clipped()
            
            // Bottom gradient for legibility
            LinearGradient(
                colors: [.clear, .black.opacity(0.65)],
                startPoint: .center,
                endPoint: .bottom
            )
            
            // Frosted text band pinned to bottom
            VStack {
                Spacer()
                
                VStack(alignment: .leading, spacing: 8) {
                    Text(title)
                        .font(.system(size: 17, weight: .bold))
                        .foregroundStyle(.white)
                        .minimumScaleFactor(0.9)
                        .lineLimit(1)
                    
                    // Info chips row
                    HStack(spacing: 8) {
                        ForEach(Array(chips.prefix(3).enumerated()), id: \.offset) { index, chip in
                            InfoChip(text: chip)
                        }
                        
                        Spacer()
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .frame(height: 60)
                .frame(maxWidth: .infinity)
                .background(.ultraThinMaterial)
            }
        }
        .frame(width: 280, height: 180)
        .clipShape(RoundedRectangle(cornerRadius: 22))
        .overlay(
            RoundedRectangle(cornerRadius: 22)
                .stroke(Color.champagneGold.opacity(0.18), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.25), radius: 24, y: 10)
    }
}

// MARK: - Info Chip Component
private struct InfoChip: View {
    let text: String
    
    var body: some View {
        Text(text)
            .font(.system(size: 12, weight: .medium))
            .foregroundStyle(Color.textPrimary)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .frame(height: 28)
            .background(Color.white.opacity(0.08))
            .clipShape(Capsule())
    }
}

// MARK: - Editor's Highlights Pane
private struct EditorsHighlightsPane: View {
    let highlights = [
        HighlightItem(
            name: "Villa Cimbrone Gardens",
            meta: "9–18 • Ravello",
            thumbName: "thumb1",
            chips: ["€€", "Viewpoint"]
        ),
        HighlightItem(
            name: "Amalfi Cathedral",
            meta: "Basilica • 9–19",
            thumbName: "thumb2",
            chips: ["Family-friendly"]
        ),
        HighlightItem(
            name: "Lemon Grove Walk",
            meta: "2 hrs • Terrace paths",
            thumbName: "thumb3",
            chips: ["Guided"]
        )
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Title row
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 14))
                        .foregroundStyle(Color.champagneGold)
                    
                    Text("Editor's Highlights")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(Color.textPrimary)
                }
                
                Spacer()
                
                HStack(spacing: 4) {
                    Text("See All")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(Color.textSecondary)
                    
                    Image(systemName: "chevron.right")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(Color.textSecondary)
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 16)
            
            // Divider
            Rectangle()
                .fill(Color.white.opacity(0.06))
                .frame(height: 1)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
            
            // Highlight rows
            VStack(spacing: 1) {
                ForEach(Array(highlights.prefix(3).enumerated()), id: \.offset) { index, highlight in
                    HighlightRow(item: highlight)
                    
                    if index < highlights.count - 1 && index < 2 {
                        Rectangle()
                            .fill(Color.white.opacity(0.04))
                            .frame(height: 1)
                            .padding(.horizontal, 16)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 16)
        }
        .frame(maxWidth: .infinity)
        .frame(width: UIScreen.main.bounds.width * 0.9)
        .background(.ultraThinMaterial)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.champagneGold.opacity(0.2), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .shadow(color: .black.opacity(0.22), radius: 18, y: 4)
    }
}

// MARK: - Highlight Item Model
private struct HighlightItem {
    let name: String
    let meta: String
    let thumbName: String
    let chips: [String]
}

// MARK: - Highlight Row Component
private struct HighlightRow: View {
    let item: HighlightItem
    
    var body: some View {
        HStack(spacing: 12) {
            // Thumbnail
            Image(item.thumbName)
                .resizable()
                .scaledToFill()
                .frame(width: 60, height: 60)
                .clipShape(RoundedRectangle(cornerRadius: 10))
            
            // Text content
            VStack(alignment: .leading, spacing: 2) {
                Text(item.name)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Color.textPrimary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.9)
                
                Text(item.meta)
                    .font(.system(size: 12, weight: .regular))
                    .foregroundStyle(Color.textSecondary)
                    .lineLimit(1)
            }
            
            Spacer()
            
            // Trailing chips (max 2)
            HStack(spacing: 6) {
                ForEach(Array(item.chips.prefix(2).enumerated()), id: \.offset) { index, chip in
                    Text(chip)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Color.textPrimary)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .frame(height: 22)
                        .background(Color.white.opacity(0.08))
                        .clipShape(Capsule())
                }
            }
        }
        .frame(height: 60)
    }
}

// MARK: - Essentials Pane Component
private struct EssentialsPane: View {
    let leftItems = [
        ("calendar", "Best Time", "Apr–Jun, Sep–Oct"),
        ("coloncurrencysign", "Currency", "Euro (EUR)"),
        ("message", "Language", "Italian (English common)"),
        ("figure.dress.line.vertical.figure", "Etiquette", "Modest in churches")
    ]
    
    let rightItems = [
        ("airplane", "Airport", "Naples Intl (NAP)"),
        ("clock", "Time Zone", "CET+1"),
        ("bus", "Getting Around", "Buses, ferries, walk"),
        ("percent", "Tipping", "~10%")
    ]
    
    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Left Column
            VStack(alignment: .leading, spacing: 10) {
                ForEach(Array(leftItems.enumerated()), id: \.offset) { index, item in
                    EssentialItem(
                        iconName: item.0,
                        label: item.1,
                        value: item.2
                    )
                }
            }
            
            // Right Column
            VStack(alignment: .leading, spacing: 10) {
                ForEach(Array(rightItems.enumerated()), id: \.offset) { index, item in
                    EssentialItem(
                        iconName: item.0,
                        label: item.1,
                        value: item.2
                    )
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 18)
        .frame(maxWidth: .infinity)
        .frame(width: UIScreen.main.bounds.width * 0.9)
        .background(.ultraThinMaterial)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.champagneGold.opacity(0.2), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .shadow(color: .black.opacity(0.22), radius: 18, y: 4)
    }
}

// MARK: - Essential Item Component
private struct EssentialItem: View {
    let iconName: String
    let label: String
    let value: String
    
    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: iconName)
                .foregroundStyle(Color.champagneGold)
                .font(.system(size: 18))
                .frame(width: 20)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Color.textPrimary)
                
                Text(value)
                    .font(.system(size: 13, weight: .regular))
                    .foregroundStyle(Color.textSecondary)
            }
            
            Spacer(minLength: 0)
        }
    }
}

// MARK: - Preview
#Preview {
    ZStack {
        Color.onyx.ignoresSafeArea()
        
        ScrollView {
            DiscoverySection()
                .padding(.top, 20)
        }
    }
}

// MARK: - Asset Setup Instructions
/*
To use this SwiftUI file, create the following assets in Assets.xcassets:

Color Sets:
- Onyx: #0A0A0A
- ChampagneGold: #CBB88C  
- TextPrimary: #F3F1E7
- TextSecondary: #9B958D

Image Sets:
- feat1: Feature card image for Experiences
- feat2: Feature card image for Dining
- feat3: Feature card image for Culture
- thumb1: Thumbnail for Villa Cimbrone Gardens
- thumb2: Thumbnail for Amalfi Cathedral  
- thumb3: Thumbnail for Lemon Grove Walk

All images should be high-resolution travel photography matching the Amalfi Coast destination theme.
*/