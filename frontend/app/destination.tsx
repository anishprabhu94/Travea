import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StyleSheet,
} from 'react-native'
import { router } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'

// Static destination data for Amalfi Coast
const destinationData = {
  name: 'Amalfi Coast',
  subtitle: 'Where azure meets ancient stone',
  heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
  essenceTags: ['Azure Air', 'Lemon Calm', 'Cliff Light'],
  travelInfo: [
    { icon: 'calendar-outline', label: 'Apr–Jun', sublabel: 'Best Time' },
    { icon: 'card-outline', label: 'EUR', sublabel: 'Currency' },
    { icon: 'airplane-outline', label: 'NAP', sublabel: 'Airport' },
    { icon: 'time-outline', label: 'CET+1', sublabel: 'Time Zone' }
  ],
  poeticLine: 'Where time slows, and the sea hums in gold.',
  discoveryCards: [
    {
      id: 'experiences',
      title: 'Experiences',
      subtext: 'Lemon groves · Cathedral echoes',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    },
    {
      id: 'dining',
      title: 'Dining',
      subtext: 'Coastal flavors · Limoncello',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
    },
    {
      id: 'culture',
      title: 'Culture',
      subtext: 'Maritime heritage · Artisan craft',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
    },
    {
      id: 'nature',
      title: 'Nature',
      subtext: 'Hidden coves · Clifftop gardens',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    }
  ],
  detailsExpansion: [
    { name: 'Villa Cimbrone Gardens', info: '9 AM–6 PM', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
    { name: 'Lemon Farm Tour', info: '€35, 2 hrs', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' }
  ],
  essentials: {
    left: [
      { icon: 'calendar-outline', label: 'Best Time', value: 'Apr–Jun, Sep–Oct' },
      { icon: 'card-outline', label: 'Currency', value: 'Euro (EUR)' },
      { icon: 'chatbubble-outline', label: 'Language', value: 'Italian (English common)' },
      { icon: 'shirt-outline', label: 'Etiquette', value: 'Modest dress in churches' }
    ],
    right: [
      { icon: 'airplane-outline', label: 'Airport', value: 'Naples Intl (NAP)' },
      { icon: 'time-outline', label: 'Time Zone', value: 'CET+1' },
      { icon: 'bus-outline', label: 'Getting Around', value: 'Buses, ferries, walk' },
      { icon: 'restaurant-outline', label: 'Tipping', value: '10% common' }
    ]
  },
  insights: [
    { quote: 'Lemons here grow as large as grapefruits.', attribution: null },
    { quote: 'Every evening, church bells echo over the cliffs.', attribution: null },
    { quote: 'Paper has been made by hand here since 1220.', attribution: null }
  ]
}

export default function DestinationInfo() {
  const [isSaved, setIsSaved] = useState(false)

  return (
    <View style={styles.container}>
      {/* Faint gold grain overlay for texture depth */}
      <View style={styles.grainOverlay} />
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero Gallery Header */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: destinationData.heroImage }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            {/* Dark gradient overlay */}
            <View style={styles.heroOverlay} />
            
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity 
                style={styles.circularButton}
                onPress={() => router.back()}
              >
                <BlurView intensity={25} tint="light" style={styles.buttonBlur}>
                  <Ionicons name="arrow-back" size={18} color="#F3F1E7" />
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.circularButton}
                onPress={() => setIsSaved(!isSaved)}
              >
                <BlurView intensity={25} tint="light" style={styles.buttonBlur}>
                  <Ionicons 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={18} 
                    color={isSaved ? "#CBB88C" : "#F3F1E7"} 
                  />
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Hero Text Overlay */}
            <View style={styles.heroTextOverlay}>
              <Text style={styles.heroTitle}>{destinationData.name}</Text>
              <Text style={styles.heroSubtitle}>{destinationData.subtitle}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* 2. Essence Capsule */}
        <View style={styles.essenceCapsule}>
          <View style={styles.essenceBlur}>
            <View style={styles.essenceContent}>
              {/* Row 1: Golden Tags */}
              <View style={styles.essenceTagsRow}>
                {destinationData.essenceTags.map((tag, index) => (
                  <View key={index} style={styles.essenceTag}>
                    <Text style={styles.essenceTagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Row 2: Travel Icons */}
              <View style={styles.travelIconsRow}>
                {destinationData.travelInfo.map((info, index) => (
                  <View key={index} style={styles.travelIconContainer}>
                    <View style={styles.travelIcon}>
                      <Ionicons name={info.icon as any} size={20} color="#F3F1E7" />
                    </View>
                    <Text style={styles.travelIconLabel}>{info.label}</Text>
                  </View>
                ))}
              </View>

              {/* Row 3: Poetic Line */}
              <Text style={styles.poeticLine}>{destinationData.poeticLine}</Text>
            </View>
          </BlurView>
        </View>

        {/* 3. Discovery Grid */}
        <View style={styles.discoverySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Discovery</Text>
            <View style={styles.sectionDivider} />
          </View>

          <View style={styles.discoveryGrid}>
            {destinationData.discoveryCards.map((card, index) => (
              <TouchableOpacity key={card.id} style={styles.discoveryCard}>
                <ImageBackground
                  source={{ uri: card.image }}
                  style={styles.discoveryCardImage}
                  imageStyle={styles.discoveryCardImageStyle}
                >
                  <View style={styles.discoveryCardOverlay} />
                  <View style={styles.discoveryCardContent}>
                    <Text style={styles.discoveryCardTitle}>{card.title}</Text>
                    <Text style={styles.discoveryCardSubtext}>{card.subtext}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>

          {/* Discovery Expansion Panel */}
          <View style={styles.discoveryExpansion}>
            <View style={styles.expansionBlur}>
              <View style={styles.expansionContent}>
                {destinationData.detailsExpansion.map((detail, index) => (
                  <View key={index} style={styles.expansionItem}>
                    <ImageBackground
                      source={{ uri: detail.image }}
                      style={styles.expansionThumbnail}
                      imageStyle={styles.expansionThumbnailStyle}
                    />
                    <View style={styles.expansionText}>
                      <Text style={styles.expansionName}>{detail.name}</Text>
                      <Text style={styles.expansionInfo}>{detail.info}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </BlurView>
          </View>
        </View>

        {/* 4. Essentials Panel */}
        <View style={styles.essentialsPanel}>
          <View style={styles.essentialsBlur}>
            <View style={styles.essentialsContent}>
              <View style={styles.essentialsColumns}>
                {/* Left Column */}
                <View style={styles.essentialsColumn}>
                  {destinationData.essentials.left.map((item, index) => (
                    <View key={index} style={styles.essentialItem}>
                      <Ionicons name={item.icon as any} size={18} color="#CBB88C" />
                      <View style={styles.essentialText}>
                        <Text style={styles.essentialLabel}>{item.label}</Text>
                        <Text style={styles.essentialValue}>{item.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Right Column */}
                <View style={styles.essentialsColumn}>
                  {destinationData.essentials.right.map((item, index) => (
                    <View key={index} style={styles.essentialItem}>
                      <Ionicons name={item.icon as any} size={18} color="#CBB88C" />
                      <View style={styles.essentialText}>
                        <Text style={styles.essentialLabel}>{item.label}</Text>
                        <Text style={styles.essentialValue}>{item.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        {/* 5. Local Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Local Insights</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScroll}
          >
            {destinationData.insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <ImageBackground
                  source={{ uri: destinationData.heroImage }}
                  style={styles.insightCardImage}
                  imageStyle={styles.insightCardImageStyle}
                >
                  <View style={styles.insightCardOverlay} />
                  <View style={styles.insightCardContent}>
                    <Text style={styles.insightQuote}>{insight.quote}</Text>
                    {insight.attribution && (
                      <Text style={styles.insightAttribution}>{insight.attribution}</Text>
                    )}
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing for fixed footer */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 6. Footer Action Bar */}
      <View style={styles.footerActionBar}>
        <View style={styles.footerBlur}>
          <View style={styles.footerContent}>
            <TouchableOpacity style={styles.addToTripsButton}>
              <Text style={styles.addToTripsText}>Add to My Trips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.planTripButton}>
              <Text style={styles.planTripText}>Plan This Trip</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  )

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Cinematic gradient background */}
      <View style={styles.backgroundGradient} />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Header - Minimal */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <BlurView intensity={20} tint="dark" style={styles.backBlur}>
              <Ionicons name="arrow-back" size={20} color="#F8F8F8" />
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => setIsSaved(!isSaved)}
          >
            <BlurView intensity={20} tint="dark" style={styles.saveBlur}>
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={20} 
                color={isSaved ? "#CBB88C" : "#F8F8F8"} 
              />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Parallax Gallery */}
        <ParallaxGallery />

        {/* Action Pills */}
        <ActionPills />

        {/* Essence Glass Poetry */}
        <EssenceModule />

        {/* Discovery Memory Fragments */}
        <DiscoveryCarousel />

        {/* Footer CTA */}
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.exploreButton}>
            <BlurView intensity={15} tint="dark" style={styles.exploreBlur}>
              <Text style={styles.exploreText}>Explore More Destinations</Text>
              <Ionicons name="arrow-forward" size={16} color="#CBB88C" />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for dock */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Global Navigation - Fixed */}
      <View style={styles.bottomDock}>
        <BlurView intensity={20} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity 
              style={styles.dockItem} 
              onPress={() => router.push('/landing')}
              activeOpacity={0.8}
            >
              <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              onPress={() => router.push('/canvas')}
              activeOpacity={0.8}
            >
              <Ionicons name="brush-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              onPress={() => router.push('/trips')}
              activeOpacity={0.8}
            >
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Primary background
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(203,184,140,0.03)', // Faint gold grain overlay
    pointerEvents: 'none',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 104, // Space for fixed footer
  },

  // 1. Hero Gallery Header (300px tall, rounded bottom corners 40px)
  heroSection: {
    height: 300,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
    }),
  },

  // Top Controls (24px from edge, 48px from top)
  topControls: {
    position: 'absolute',
    top: 48,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  circularButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden', // Critical for iOS rounded corners
  },
  buttonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)', // Frosted glass
  },

  // Hero Text Overlay (bottom-left aligned)
  heroTextOverlay: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '600', // Neue Montreal SemiBold
    color: '#F3F1E7', // Text white
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '300', // SF Pro Display Light Italic
    fontStyle: 'italic',
    color: 'rgba(243,241,231,0.85)', // 85% opacity white
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // 2. Essence Capsule (90% width, overlapping hero by -40px)
  essenceCapsule: {
    width: '90%',
    alignSelf: 'center',
    height: 180,
    borderRadius: 28,
    overflow: 'hidden', // Critical for iOS rounded corners
    marginTop: -40, // Overlap with hero
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  essenceBlur: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)', // Frosted overlay
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)', // Divider gold line
    // Remove borderRadius from BlurView - let container handle it
  },
  essenceContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-around',
  },

  // Essence Row 1: Golden Tags
  essenceTagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  essenceTag: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(203,184,140,0.15)',
  },
  essenceTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#CBB88C', // Gold accent
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Essence Row 2: Travel Icons
  travelIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  travelIconContainer: {
    alignItems: 'center',
  },
  travelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelIconLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9B958D', // Muted gray
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Essence Row 3: Poetic Line
  poeticLine: {
    fontSize: 13,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#CBB88C', // Gold accent
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  saveBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // 3. Discovery Grid
  discoverySection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600', // Neue Montreal SemiBold
    color: '#F3F1E7', // Text white
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  sectionDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.25)', // Faint gold divider
  },

  // Discovery Grid Layout (2 cards per row)
  discoveryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  discoveryCard: {
    width: 165,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden', // Critical for iOS rounded corners
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  discoveryCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  discoveryCardImageStyle: {
    // Remove borderRadius from image - let container handle it
  },
  discoveryCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.3)',
      },
    }),
  },
  discoveryCardContent: {
    padding: 16,
  },
  discoveryCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F3F1E7', // White
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  discoveryCardSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#CBB88C', // Gold
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Discovery Expansion Panel
  discoveryExpansion: {
    height: 120,
    borderRadius: 28,
    overflow: 'hidden', // Critical for iOS rounded corners
    ...Platform.select({
      web: {
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  expansionBlur: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)',
    // Remove borderRadius from BlurView - let container handle it
  },
  expansionContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-around',
  },
  expansionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expansionThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden', // Critical for iOS rounded corners
  },
  expansionThumbnailStyle: {
    // Remove borderRadius from image - let container handle it
  },
  expansionText: {
    flex: 1,
  },
  expansionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F3F1E7', // White
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  expansionInfo: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9B958D', // Muted gray
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // 4. Essentials Panel
  essentialsPanel: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden', // Critical for iOS rounded corners
    marginTop: 28,
    marginBottom: 28,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  essentialsBlur: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)',
    // Remove borderRadius from BlurView - let container handle it
  },
  essentialsContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  essentialsColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  essentialsColumn: {
    flex: 1,
    gap: 16,
  },
  essentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  essentialText: {
    flex: 1,
  },
  essentialLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F3F1E7', // White
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  essentialValue: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9B958D', // Muted gray
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // 5. Local Insights
  insightsSection: {
    paddingLeft: 20,
    marginBottom: 28,
  },
  insightsScroll: {
    paddingRight: 20,
  },
  insightCard: {
    width: 280,
    height: 140,
    borderRadius: 22,
    overflow: 'hidden', // Critical for iOS rounded corners
    marginRight: 16,
  },
  insightCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  insightCardImageStyle: {
    // Remove borderRadius from image - let container handle it
  },
  insightCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
    }),
  },
  insightCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  insightQuote: {
    fontSize: 16,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#F3F1E7', // White
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  insightAttribution: {
    fontSize: 12,
    fontWeight: '400',
    color: '#CBB88C', // Gold
    marginTop: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom spacing for fixed footer
  bottomSpacing: {
    height: 104,
  },

  // 6. Footer Action Bar (Fixed at bottom)
  footerActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopWidth: 1,
    borderTopColor: 'rgba(203,184,140,0.2)',
  },
  footerBlur: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.6)',
  },
  footerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  addToTripsButton: {
    width: 155,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(203,184,140,0.18)',
    borderWidth: 1,
    borderColor: '#CBB88C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToTripsText: {
    fontSize: 15,
    fontWeight: '500', // Medium
    color: '#CBB88C', // Gold
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  planTripButton: {
    width: 155,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBB88C', // Gold background
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTripText: {
    fontSize: 15,
    fontWeight: '600', // SemiBold
    color: '#0A0A0A', // Dark background color
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
})

// End of Practical Beauty design