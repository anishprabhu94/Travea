import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Dimensions,
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import TraveaWordmark from '../components/TraveaWordmark'

const { width, height } = Dimensions.get('window')

// Enhanced destination data for modular design
const mockDestination = {
  id: 'amalfi',
  name: 'Amalfi Coast',
  tagline: 'Where azure meets ancient stone',
  images: [
    'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
  ],
  atmosphere: 'Suspended between sky and sea, the Amalfi Coast whispers stories of maritime empires and sun-soaked terraces. Here, time moves with the rhythm of gentle waves against ancient stone, where every sunset paints the cliffs in shades of golden honey.',
  essentials: {
    bestTime: 'April–June, September–October',
    currency: 'Euro (EUR)',
    airport: 'Naples International (NAP)',
    timezone: 'CET (UTC+1)'
  },
  discovery: [
    {
      id: 'experiences',
      title: 'Experiences',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      preview: 'Terrace of Infinity, Lemon grove tours, Cathedral visits'
    },
    {
      id: 'dining',
      title: 'Dining',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      preview: 'Coastal seafood, Limoncello tastings, Michelin venues'
    },
    {
      id: 'culture',
      title: 'Culture',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      preview: 'Maritime history, Byzantine architecture, Ancient traditions'
    },
    {
      id: 'nature',
      title: 'Nature',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      preview: 'Hidden coves, Clifftop gardens, Coastal walking paths'
    }
  ],
  insights: [
    'Lemons here grow as large as grapefruits',
    'Once a maritime republic rivaling Venice',
    'UNESCO World Heritage since 1997',
    'Paper made by hand since 1220',
    'Vertical gardens cascade down cliffs',
    'Ancient Roman settlement origins'
  ]
}

export default function DestinationInfo() {
  const params = useLocalSearchParams()
  const [isSaved, setIsSaved] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedDiscovery, setSelectedDiscovery] = useState(null)
  
  const parallaxValue = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scrollViewRef = useRef<ScrollView>(null)

  const destination = mockDestination

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  // Parallax Gallery Component
  const ParallaxGallery = () => (
    <View style={styles.galleryContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / width)
          setActiveImageIndex(index)
        }}
        scrollEventThrottle={16}
      >
        {destination.images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Animated.View style={[
              styles.parallaxWrapper,
              {
                transform: [{
                  translateX: parallaxValue.interpolate({
                    inputRange: [-width, 0, width],
                    outputRange: [30, 0, -30],
                    extrapolate: 'clamp'
                  })
                }]
              }
            ]}>
              <ImageBackground
                source={{ uri: image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                <View style={styles.imageOverlay} />
              </ImageBackground>
            </Animated.View>
          </View>
        ))}
      </ScrollView>
      
      {/* Destination Name Overlay */}
      <Animated.View style={[styles.nameOverlay, { opacity: fadeAnim }]}>
        <Text style={styles.destinationName}>{destination.name}</Text>
        <Text style={styles.destinationTagline}>{destination.tagline}</Text>
      </Animated.View>

      {/* Gallery Indicators */}
      <View style={styles.indicators}>
        {destination.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeImageIndex === index && styles.activeIndicator
            ]}
          />
        ))}
      </View>
    </View>
  )

  // Action Pills Component
  const ActionPills = () => (
    <View style={styles.actionPillsContainer}>
      <TouchableOpacity style={[styles.actionPill, styles.primaryPill]}>
        <BlurView intensity={20} tint="dark" style={styles.pillBlur}>
          <Text style={[styles.pillText, styles.primaryPillText]}>Add to My Trips</Text>
        </BlurView>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionPill}>
        <BlurView intensity={20} tint="dark" style={styles.pillBlur}>
          <Text style={styles.pillText}>Create a Trip</Text>
        </BlurView>
      </TouchableOpacity>
    </View>
  )

  // Essence Module Component 
  const EssenceModule = () => (
    <View style={styles.essenceContainer}>
      <BlurView intensity={15} tint="dark" style={styles.essenceBlur}>
        <View style={styles.essenceInner}>
          <View style={styles.essenceLeft}>
            <Text style={styles.essenceTitle}>Atmosphere</Text>
            <Text style={styles.essenceText}>{destination.atmosphere}</Text>
          </View>
          
          <View style={styles.essenceRight}>
            <Text style={styles.essentialsTitle}>Essentials</Text>
            <View style={styles.essentialsList}>
              <View style={styles.essentialItem}>
                <Text style={styles.essentialLabel}>Best time</Text>
                <Text style={styles.essentialValue}>{destination.essentials.bestTime}</Text>
              </View>
              <View style={styles.essentialItem}>
                <Text style={styles.essentialLabel}>Currency</Text>
                <Text style={styles.essentialValue}>{destination.essentials.currency}</Text>
              </View>
              <View style={styles.essentialItem}>
                <Text style={styles.essentialLabel}>Airport</Text>
                <Text style={styles.essentialValue}>{destination.essentials.airport}</Text>
              </View>
              <View style={styles.essentialItem}>
                <Text style={styles.essentialLabel}>Time Zone</Text>
                <Text style={styles.essentialValue}>{destination.essentials.timezone}</Text>
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  )

  // Discovery Row Component
  const DiscoveryRow = () => (
    <View style={styles.discoveryContainer}>
      <Text style={styles.sectionTitle}>Discovery</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.discoveryScroll}
      >
        {destination.discovery.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.discoveryCard, index === 0 && styles.firstCard]}
            onPress={() => setSelectedDiscovery(item)}
          >
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.discoveryImage}
              imageStyle={styles.discoveryImageStyle}
            >
              <View style={styles.discoveryOverlay} />
              <View style={styles.discoveryContent}>
                <Text style={styles.discoveryTitle}>{item.title}</Text>
                <Text style={styles.discoveryPreview}>{item.preview}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  // Insights Strip Component
  const InsightsStrip = () => (
    <View style={styles.insightsContainer}>
      <Text style={styles.sectionTitle}>Insights</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.insightsScroll}
      >
        {destination.insights.map((insight, index) => (
          <BlurView key={index} intensity={20} tint="dark" style={styles.insightCapsule}>
            <Text style={styles.insightText}>{insight}</Text>
          </BlurView>
        ))}
      </ScrollView>
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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: parallaxValue } } }],
          { useNativeDriver: true }
        )}
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

        {/* Essence Module */}
        <EssenceModule />

        {/* Discovery Row */}
        <DiscoveryRow />

        {/* Insights Strip */}
        <InsightsStrip />

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
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #0C0C0C 0%, #1A1A1A 100%)',
      },
      default: {
        backgroundColor: '#0C0C0C',
      },
    }),
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

  // Action Pills
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