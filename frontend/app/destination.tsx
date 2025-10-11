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
          <BlurView intensity={25} tint="dark" style={styles.essenceBlur}>
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
            <BlurView intensity={30} tint="dark" style={styles.expansionBlur}>
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
          <BlurView intensity={30} tint="dark" style={styles.essentialsBlur}>
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
        <BlurView intensity={20} tint="dark" style={styles.footerBlur}>
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
    paddingBottom: 20,
  },

  // Header - Minimal floating controls
  header: {
    position: 'absolute',
    top: 50,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
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

  // Parallax Gallery
  galleryContainer: {
    height: height * 0.6,
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: '100%',
  },
  parallaxWrapper: {
    width: '110%', // Slightly wider for parallax effect
    height: '100%',
    marginLeft: '-5%',
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    ...Platform.select({
      web: {
        filter: 'brightness(0.8) contrast(1.1) saturate(1.2)',
      },
    }),
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.3)',
      },
    }),
  },

  // Destination Name Overlay
  nameOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 24,
    right: 24,
  },
  destinationName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Neue Montreal',
      web: 'SF Pro Display, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 2px 20px rgba(0,0,0,0.7)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
      },
    }),
  },
  destinationTagline: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Neue Montreal',
      web: 'SF Pro, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Gallery Indicators
  indicators: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeIndicator: {
    backgroundColor: '#CBB88C',
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(203,184,140,0.6)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
      },
    }),
  },

  // Action Pills - New design
  actionPillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: -40, // Overlap with gallery
    marginBottom: 40,
    gap: 16,
    zIndex: 50,
  },
  actionPill: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  primaryPill: {
    backgroundColor: 'rgba(203,184,140,0.15)',
  },
  pillBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pillText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  primaryPillText: {
    color: '#CBB88C',
    fontWeight: '600',
  },

  // Essence Glass Poetry - Floating Capsule
  essenceCapsule: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 60,
    marginBottom: 50,
    borderRadius: 50,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.4))',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 16,
      },
    }),
  },
  essenceGlass: {
    backgroundColor: 'rgba(10,10,10,0.7)',
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)', // Gold rim glow
  },
  essenceGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 0 20px rgba(203,184,140,0.4)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
    }),
  },

  // Layer 1: Poetic Tokens
  poeticLayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  poeticPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(203,184,140,0.15)',
  },
  poeticText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#D6C7A1', // Sand Beige
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  poeticSeparator: {
    fontSize: 16,
    color: 'rgba(214,199,161,0.6)',
    fontWeight: '300',
  },

  // Layer 2: Icon Arc
  iconArc: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    gap: 20,
  },
  iconDisc: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Layer 3: Sensory Line
  sensoryLayer: {
    alignItems: 'center',
  },
  sensoryText: {
    fontSize: 16,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Neue Montreal',
      web: 'SF Pro Display, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Discovery Memory Fragments - Frosted Ribbon
  discoveryRibbon: {
    width: '92%',
    alignSelf: 'center',
    marginBottom: 60,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  ribbonGlass: {
    backgroundColor: 'rgba(11,11,11,0.8)',
    paddingVertical: 20,
  },
  ribbonEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#CBB88C',
    opacity: 0.4,
  },
  memoryScroll: {
    paddingHorizontal: 20,
  },
  memoryTile: {
    width: 160,
    height: 200, // 4:5 ratio
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  firstTile: {
    marginLeft: 0,
  },
  tileImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tileImageStyle: {
    borderRadius: 12,
    ...Platform.select({
      web: {
        filter: 'brightness(0.75) contrast(1.15) saturate(1.1)',
      },
    }),
  },
  tileOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  tileContent: {
    padding: 16,
    position: 'relative',
    zIndex: 2,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tileCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Neue Montreal',
      web: 'SF Pro Display, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  tileIcon: {
    fontSize: 16,
    opacity: 0.8,
  },
  tilePoetry: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  tileGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#D6C7A1',
    opacity: 0.3,
  },

  // Insights Strip
  insightsContainer: {
    marginBottom: 40,
  },
  insightsScroll: {
    paddingLeft: 24,
  },
  insightCapsule: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: 'rgba(15,15,15,0.6)',
    minWidth: 140,
  },
  insightText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Neue Montreal',
      web: 'SF Pro, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Footer CTA
  footerContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  exploreButton: {
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  exploreBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,15,15,0.6)',
    gap: 8,
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CBB88C',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Action Pills - Legacy styles
  actionPillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionPill: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.08)',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
      },
    }),
  },
  addToTripsActive: {
    backgroundColor: 'rgba(201,169,109,0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(201,169,109,0.4), inset 0 1px 2px rgba(255,255,255,0.2)',
        border: '1px solid rgba(201,169,109,0.4)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  actionPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.7)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  actionPillTextActive: {
    color: '#CBB88C',
    fontWeight: '600',
  },

  // Info Section
  infoSection: {
    paddingHorizontal: 24,
  },
  infoCardContainer: {
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  infoCardInner: {
    backgroundColor: 'rgba(20,20,20,0.4)',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.05)',
      },
    }),
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.3,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  infoText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(248,248,248,0.75)',
    letterSpacing: 0.2,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Neue Montreal',
      web: 'SF Pro, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // List Styles
  listContainer: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  listBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBB88C',
    marginRight: 12,
    marginTop: 9,
    ...Platform.select({
      web: {
        boxShadow: '0 0 6px rgba(203,184,140,0.5)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
    }),
  },
  listText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(248,248,248,0.7)',
    letterSpacing: 0.2,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Neue Montreal',
      web: 'SF Pro, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom Navigation - Exactly matches landing.tsx
  bottomDock: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dockContainer: {
    width: '92%',
    height: 60,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
    }),
  },
  dockContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dockLabelInactive: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bottomPadding: {
    height: 120,
  },
})