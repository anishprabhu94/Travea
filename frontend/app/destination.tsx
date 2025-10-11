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

  // Essence Module Component - Glass Poetry Design
  const EssenceModule = () => {
    const glowAnim = useRef(new Animated.Value(0)).current
    
    useEffect(() => {
      const startGlow = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: false,
            }),
          ])
        ).start()
      }
      startGlow()
    }, [])

    const glowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    })

    return (
      <Animated.View style={[styles.essenceCapsule, { opacity: fadeAnim }]}>
        <BlurView intensity={45} tint="dark" style={styles.essenceGlass}>
          <Animated.View 
            style={[
              styles.essenceGlow,
              { shadowOpacity: glowOpacity }
            ]}
          />
          
          {/* Layer 1: Poetic Tokens */}
          <View style={styles.poeticLayer}>
            <View style={styles.poeticPill}>
              <Text style={styles.poeticText}>Azure Air</Text>
            </View>
            <Text style={styles.poeticSeparator}>·</Text>
            <View style={styles.poeticPill}>
              <Text style={styles.poeticText}>Lemon Calm</Text>
            </View>
            <Text style={styles.poeticSeparator}>·</Text>
            <View style={styles.poeticPill}>
              <Text style={styles.poeticText}>Cliff Light</Text>
            </View>
          </View>

          {/* Layer 2: Minimalist Icons Arc */}
          <View style={styles.iconArc}>
            <View style={styles.iconDisc}>
              <Text style={styles.iconEmoji}>🗓</Text>
              <Text style={styles.iconLabel}>Apr-Jun</Text>
            </View>
            <View style={styles.iconDisc}>
              <Text style={styles.iconEmoji}>💶</Text>
              <Text style={styles.iconLabel}>EUR</Text>
            </View>
            <View style={styles.iconDisc}>
              <Text style={styles.iconEmoji}>✈️</Text>
              <Text style={styles.iconLabel}>NAP</Text>
            </View>
            <View style={styles.iconDisc}>
              <Text style={styles.iconEmoji}>🕓</Text>
              <Text style={styles.iconLabel}>CET+1</Text>
            </View>
          </View>

          {/* Layer 3: Sensory Line */}
          <Animated.View style={[styles.sensoryLayer, { opacity: fadeAnim }]}>
            <Text style={styles.sensoryText}>
              Where time slows, and the sea hums in gold.
            </Text>
          </Animated.View>
        </BlurView>
      </Animated.View>
    )
  }

  // Discovery Carousel - Memory Fragments Design
  const DiscoveryCarousel = () => {
    const [expandedCard, setExpandedCard] = useState(null)
    
    const discoveryData = [
      {
        id: 'experiences',
        title: 'Experiences',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
        descriptor: 'Lemon groves, cathedral echoes,\ncliff light',
        icon: '🏖',
        moments: ['Terrace of Infinity views', 'Byzantine cathedral doors', 'Villa Cimbrone gardens']
      },
      {
        id: 'dining',
        title: 'Dining',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
        descriptor: 'Sea salt on lips,\nlimoncello sunsets',
        icon: '🍋',
        moments: ['Coastal seafood terraces', 'Limoncello tastings', 'Michelin starred views']
      },
      {
        id: 'culture',
        title: 'Culture',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
        descriptor: 'Ancient stones whisper,\nmaritime memories',
        icon: '🎭',
        moments: ['Maritime republic history', 'Paper-making traditions', 'Byzantine architecture']
      },
      {
        id: 'nature',
        title: 'Nature',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
        descriptor: 'Clifftop gardens bloom,\nhidden coves call',
        icon: '🌿',
        moments: ['Secret coastal paths', 'Vertical gardens cascade', 'Azure hidden coves']
      }
    ]

    return (
      <View style={styles.discoveryRibbon}>
        <BlurView intensity={35} tint="dark" style={styles.ribbonGlass}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.memoryScroll}
            decelerationRate="fast"
            snapToInterval={180}
            snapToAlignment="start"
          >
            {discoveryData.map((fragment, index) => (
              <TouchableOpacity
                key={fragment.id}
                style={[styles.memoryTile, index === 0 && styles.firstTile]}
                onPress={() => setExpandedCard(fragment)}
                activeOpacity={0.9}
              >
                <ImageBackground
                  source={{ uri: fragment.image }}
                  style={styles.tileImage}
                  imageStyle={styles.tileImageStyle}
                >
                  <View style={styles.tileOverlay} />
                  
                  {/* Floating Content */}
                  <View style={styles.tileContent}>
                    <View style={styles.tileHeader}>
                      <Text style={styles.tileCategory}>{fragment.title}</Text>
                      <Text style={styles.tileIcon}>{fragment.icon}</Text>
                    </View>
                    
                    <Text style={styles.tilePoetry}>
                      {fragment.descriptor}
                    </Text>
                  </View>
                  
                  {/* Subtle edge glow */}
                  <View style={styles.tileGlow} />
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BlurView>
        
        {/* Champagne edge accent */}
        <View style={styles.ribbonEdge} />
      </View>
    )
  }

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

  // Discovery Row
  discoveryContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
    marginHorizontal: 24,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Neue Montreal',
      web: 'SF Pro Display, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  discoveryScroll: {
    paddingLeft: 24,
  },
  discoveryCard: {
    width: 160,
    height: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  firstCard: {
    marginLeft: 0,
  },
  discoveryImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  discoveryImageStyle: {
    borderRadius: 16,
    ...Platform.select({
      web: {
        filter: 'brightness(0.7) contrast(1.1)',
      },
    }),
  },
  discoveryOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
    }),
  },
  discoveryContent: {
    padding: 16,
  },
  discoveryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  discoveryPreview: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16,
    letterSpacing: 0.1,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Neue Montreal',
      web: 'SF Pro, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
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