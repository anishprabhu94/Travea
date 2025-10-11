import SwiftUI

// MARK: - Color Extensions
extension Color {
    static let onyx = Color("Onyx")
    static let champagneGold = Color("ChampagneGold")
    static let textPrimary = Color("TextPrimary")
    static let textSecondary = Color("TextSecondary")
}

// MARK: - Main Destination View
struct DestinationView: View {
    @State private var isSaved = false
    
    var body: some View {
        ZStack {
            Color.onyx.ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 24) {
                    HeroGallery(isSaved: $isSaved)
                        .zIndex(1)
                    
                    EssenceCapsule()
                        .offset(y: -40)
                        .zIndex(2)
                    
                    VStack(spacing: 24) {
                        DiscoveryGrid()
                        EssentialsPanel()
                        LocalInsights()
                    }
                    .padding(.top, -16) // Adjust for overlapping essence capsule
                    
                    // Bottom padding for footer
                    Spacer(minLength: 104)
                }
            }
            
            VStack {
                Spacer()
                FooterActionBar()
            }
            .ignoresSafeArea(edges: .bottom)
        }
    }
}

// MARK: - Hero Gallery Component
private struct HeroGallery: View {
    @Binding var isSaved: Bool
    
    var body: some View {
        ZStack {
            // Hero Image with rounded bottom corners
            Image("hero1")
                .resizable()
                .scaledToFill()
                .frame(height: 300)
                .clipShape(
                    .rect(
                        topLeadingRadius: 0,
                        bottomLeadingRadius: 40,
                        bottomTrailingRadius: 40,
                        topTrailingRadius: 0
                    )
                )
            
            // Gradient overlay
            LinearGradient(
                colors: [.clear, .black.opacity(0.65)],
                startPoint: .center,
                endPoint: .bottom
            )
            .clipShape(
                .rect(
                    topLeadingRadius: 0,
                    bottomLeadingRadius: 40,
                    bottomTrailingRadius: 40,
                    topTrailingRadius: 0
                )
            )
            
            // Top Controls
            VStack {
                HStack {
                    Button(action: {}) {
                        Image(systemName: "chevron.left")
                            .foregroundStyle(.white)
                            .font(.system(size: 18, weight: .medium))
                            .frame(width: 40, height: 40)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                    }
                    
                    Spacer()
                    
                    Button(action: { isSaved.toggle() }) {
                        Image(systemName: isSaved ? "bookmark.fill" : "bookmark")
                            .foregroundStyle(isSaved ? Color.champagneGold : .white)
                            .font(.system(size: 18, weight: .medium))
                            .frame(width: 40, height: 40)
                            .background(.ultraThinMaterial)
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 48)
                
                Spacer()
            }
            
            // Bottom Text Overlay
            VStack {
                Spacer()
                
                HStack {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Amalfi Coast")
                            .font(.system(size: 32, weight: .semibold))
                            .foregroundStyle(.white)
                        
                        Text("Where azure meets ancient stone")
                            .font(.system(size: 16, weight: .regular))
                            .foregroundStyle(.white.opacity(0.85))
                    }
                    
                    Spacer()
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
        }
        .frame(height: 300)
    }
}

// MARK: - Essence Capsule Component
private struct EssenceCapsule: View {
    var body: some View {
        VStack(spacing: 16) {
            // Row A: Tags
            HStack(spacing: 8) {
                ForEach(["Azure Air", "Lemon Calm", "Cliff Light"], id: \.self) { tag in
                    Text(tag)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(Color.champagneGold)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 7)
                        .background(Color.champagneGold.opacity(0.15))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
            }
            
            // Row B: Travel Facts
            HStack {
                Spacer()
                
                VStack(spacing: 4) {
                    Image(systemName: "calendar")
                        .foregroundStyle(Color.textPrimary)
                        .font(.system(size: 20))
                        .frame(width: 44, height: 44)
                        .background(Color.white.opacity(0.06))
                        .clipShape(Circle())
                    
                    Text("Apr–Jun")
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(Color.textSecondary)
                }
                
                Spacer()
                
                VStack(spacing: 4) {
                    Image(systemName: "coloncurrencysign")
                        .foregroundStyle(Color.textPrimary)
                        .font(.system(size: 20))
                        .frame(width: 44, height: 44)
                        .background(Color.white.opacity(0.06))
                        .clipShape(Circle())
                    
                    Text("EUR")
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(Color.textSecondary)
                }
                
                Spacer()
                
                VStack(spacing: 4) {
                    Image(systemName: "airplane")
                        .foregroundStyle(Color.textPrimary)
                        .font(.system(size: 20))
                        .frame(width: 44, height: 44)
                        .background(Color.white.opacity(0.06))
                        .clipShape(Circle())
                    
                    Text("NAP")
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(Color.textSecondary)
                }
                
                Spacer()
                
                VStack(spacing: 4) {
                    Image(systemName: "clock")
                        .foregroundStyle(Color.textPrimary)
                        .font(.system(size: 20))
                        .frame(width: 44, height: 44)
                        .background(Color.white.opacity(0.06))
                        .clipShape(Circle())
                    
                    Text("CET+1")
                        .font(.system(size: 12, weight: .regular))
                        .foregroundStyle(Color.textSecondary)
                }
                
                Spacer()
            }
            
            // Row C: Poetic Line
            Text("Where time slows, and the sea hums in gold.")
                .font(.system(size: 13, weight: .light))
                .italic()
                .foregroundStyle(Color.champagneGold)
                .multilineTextAlignment(.center)
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .frame(maxWidth: .infinity)
        .background(.ultraThinMaterial)
        .background(Color.white.opacity(0.05))
        .overlay(
            RoundedRectangle(cornerRadius: 28)
                .stroke(Color.champagneGold.opacity(0.25), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 28))
        .shadow(color: .black.opacity(0.35), radius: 40, y: 8)
        .padding(.horizontal, 20)
    }
}

// MARK: - Discovery Grid Component
private struct DiscoveryGrid: View {
    let discoveryItems = [
        ("Experiences", "Lemon groves · Cathedral echoes", "card1"),
        ("Dining", "Coastal flavors · Limoncello", "card2"),
        ("Culture", "Maritime heritage · Artisan craft", "card3"),
        ("Nature", "Hidden coves · Clifftop gardens", "card4")
    ]
    
    let expansionItems = [
        ("Villa Cimbrone Gardens", "9 AM–6 PM", "thumb1"),
        ("Lemon Farm Tour", "€35, 2 hrs", "thumb2"),
        ("Cathedral Visit", "Free, 8 AM–7 PM", "thumb3")
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Section Title with Underline
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Discovery")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(Color.textPrimary)
                    
                    Spacer()
                }
                
                Capsule()
                    .fill(Color.champagneGold.opacity(0.3))
                    .frame(width: 40, height: 1)
            }
            
            // Discovery Cards Grid
            LazyVGrid(columns: [
                GridItem(.flexible(), spacing: 10),
                GridItem(.flexible(), spacing: 10)
            ], spacing: 16) {
                ForEach(Array(discoveryItems.enumerated()), id: \.offset) { index, item in
                    DiscoveryCard(
                        title: item.0,
                        subtitle: item.1,
                        imageName: item.2
                    )
                }
            }
            
            // Static Expansion Panel
            VStack(spacing: 12) {
                ForEach(Array(expansionItems.enumerated()), id: \.offset) { index, item in
                    HStack(spacing: 12) {
                        Image(item.2)
                            .resizable()
                            .scaledToFill()
                            .frame(width: 60, height: 60)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                        
                        VStack(alignment: .leading, spacing: 2) {
                            Text(item.0)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(Color.textPrimary)
                            
                            Text(item.1)
                                .font(.system(size: 12, weight: .regular))
                                .foregroundStyle(Color.textSecondary)
                        }
                        
                        Spacer()
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .frame(maxWidth: .infinity)
            .background(.ultraThinMaterial)
            .background(Color.white.opacity(0.05))
            .overlay(
                RoundedRectangle(cornerRadius: 28)
                    .stroke(Color.champagneGold.opacity(0.25), lineWidth: 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 28))
            .shadow(color: .black.opacity(0.35), radius: 40, y: 8)
        }
        .padding(.horizontal, 20)
    }
}

// MARK: - Discovery Card Subview
private struct DiscoveryCard: View {
    let title: String
    let subtitle: String
    let imageName: String
    
    var body: some View {
        ZStack {
            Image(imageName)
                .resizable()
                .scaledToFill()
                .frame(minHeight: 220)
                .clipShape(RoundedRectangle(cornerRadius: 20))
            
            // Bottom gradient
            LinearGradient(
                colors: [.clear, .black.opacity(0.6)],
                startPoint: .center,
                endPoint: .bottom
            )
            .clipShape(RoundedRectangle(cornerRadius: 20))
            
            VStack {
                Spacer()
                
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(title)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(.white)
                        
                        Text(subtitle)
                            .font(.system(size: 13, weight: .regular))
                            .foregroundStyle(Color.champagneGold)
                    }
                    
                    Spacer()
                }
                .padding(16)
            }
        }
        .frame(minHeight: 220)
        .overlay(
            RoundedRectangle(cornerRadius: 20)
                .stroke(Color.champagneGold.opacity(0.2), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.25), radius: 20, y: 6)
    }
}

// MARK: - Essentials Panel Component
private struct EssentialsPanel: View {
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
            VStack(alignment: .leading, spacing: 16) {
                ForEach(Array(leftItems.enumerated()), id: \.offset) { index, item in
                    EssentialItem(
                        iconName: item.0,
                        label: item.1,
                        value: item.2
                    )
                }
            }
            
            // Right Column
            VStack(alignment: .leading, spacing: 16) {
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
        .background(.thinMaterial)
        .background(Color.white.opacity(0.05))
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.champagneGold.opacity(0.25), lineWidth: 1)
        )
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .shadow(color: .black.opacity(0.35), radius: 40, y: 8)
        .padding(.horizontal, 20)
    }
}

// MARK: - Essential Item Subview
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

// MARK: - Local Insights Component
private struct LocalInsights: View {
    let insights = [
        ("Lemons here grow as large as grapefruits.", nil),
        ("Every evening, church bells echo over the cliffs.", nil),
        ("Paper has been made by hand here since 1220.", nil)
    ]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Local Insights")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundStyle(Color.textPrimary)
                
                Spacer()
            }
            .padding(.horizontal, 20)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(Array(insights.enumerated()), id: \.offset) { index, insight in
                        InsightCard(
                            quote: insight.0,
                            attribution: insight.1
                        )
                    }
                }
                .padding(.horizontal, 20)
            }
        }
    }
}

// MARK: - Insight Card Subview
private struct InsightCard: View {
    let quote: String
    let attribution: String?
    
    var body: some View {
        ZStack {
            Image("hero1")
                .resizable()
                .scaledToFill()
                .frame(width: 280, height: 140)
                .clipShape(RoundedRectangle(cornerRadius: 22))
            
            // Bottom gradient
            LinearGradient(
                colors: [.clear, .black.opacity(0.7)],
                startPoint: .top,
                endPoint: .bottom
            )
            .clipShape(RoundedRectangle(cornerRadius: 22))
            
            VStack {
                Spacer()
                
                VStack(spacing: 8) {
                    Text(quote)
                        .font(.system(size: 16, weight: .light))
                        .italic()
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)
                        .lineLimit(3)
                    
                    if let attribution = attribution {
                        Text(attribution)
                            .font(.system(size: 12, weight: .regular))
                            .foregroundStyle(Color.champagneGold)
                    }
                }
                .padding(20)
            }
        }
        .frame(width: 280, height: 140)
    }
}

// MARK: - Footer Action Bar Component
private struct FooterActionBar: View {
    var body: some View {
        HStack(spacing: 16) {
            Button(action: {}) {
                Text("Add to My Trips")
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(Color.champagneGold)
                    .frame(width: 155, height: 44)
                    .background(Color.champagneGold.opacity(0.18))
                    .overlay(
                        RoundedRectangle(cornerRadius: 22)
                            .stroke(Color.champagneGold, lineWidth: 1)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 22))
            }
            
            Button(action: {}) {
                Text("Plan This Trip")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Color.onyx)
                    .frame(width: 155, height: 44)
                    .background(Color.champagneGold)
                    .clipShape(RoundedRectangle(cornerRadius: 22))
            }
        }
        .frame(maxWidth: .infinity)
        .frame(height: 80)
        .padding(.horizontal, 20)
        .background(Color.black.opacity(0.6))
        .background(.ultraThinMaterial)
        .overlay(
            Rectangle()
                .fill(Color.champagneGold.opacity(0.2))
                .frame(height: 1),
            alignment: .top
        )
    }
}

// MARK: - Preview
#Preview {
    DestinationView()
}

// MARK: - Color Assets Setup Instructions
/*
To use this SwiftUI file, create the following color assets in Assets.xcassets:

1. Create a new Color Set named "Onyx"
   - Any Appearance: #0A0A0A

2. Create a new Color Set named "ChampagneGold"
   - Any Appearance: #CBB88C

3. Create a new Color Set named "TextPrimary"
   - Any Appearance: #F3F1E7

4. Create a new Color Set named "TextSecondary"
   - Any Appearance: #9B958D

Also add placeholder images:
- hero1: Main Amalfi Coast hero image
- card1, card2, card3, card4: Discovery section images
- thumb1, thumb2, thumb3: Small thumbnail images for expansion panel
*/