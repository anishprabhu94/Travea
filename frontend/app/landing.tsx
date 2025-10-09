import React, { useState, useEffect, useRef } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Platform, 
  Animated,
  Dimensions,
  ScrollView
} from 'react-native'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

interface DestinationCard {
  id: string
  city: string
  tagline: string
  image: string
  transport: TransportInfo[]
  category: 'inspire' | 'weekend'
}

interface TransportInfo {
  icon: keyof typeof Ionicons.glyphMap
  time: string
}

const destinationCards: DestinationCard[] = [
  // Inspire Me Cards
  {
    id: 'amalfi',
    city: 'Amalfi',
    tagline: 'Coastal drives & lemon air',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    transport: [
      { icon: 'car-outline', time: '2h 45m' },
      { icon: 'airplane-outline', time: '1h 20m' }
    ],
    category: 'inspire'
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    tagline: 'Temples, lanterns, and still mornings',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    transport: [
      { icon: 'airplane-outline', time: '11h 30m' },
      { icon: 'train-outline', time: '3h 15m' }
    ],
    category: 'inspire'
  },
  {
    id: 'iceland',
    city: 'Iceland',
    tagline: 'Where glaciers meet the sea',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg',
    transport: [
      { icon: 'airplane-outline', time: '6h 45m' }
    ],
    category: 'inspire'
  },
  // Weekend Cards
  {
    id: 'sonoma',
    city: 'Sonoma',
    tagline: 'Wine alleys & golden light',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg',
    transport: [
      { icon: 'car-outline', time: '1h 30m' },
      { icon: 'train-outline', time: '2h 10m' }
    ],
    category: 'weekend'
  },
  {
    id: 'carmel',
    city: 'Carmel-by-the-Sea',
    tagline: 'Cliffside cafés & slow tides',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg',
    transport: [
      { icon: 'car-outline', time: '2h 15m' },
      { icon: 'train-outline', time: '2h 45m' }
    ],
    category: 'weekend'
  },
  {
    id: 'bigsur',
    city: 'Big Sur',
    tagline: 'Misty cliffs & endless roads',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg',
    transport: [
      { icon: 'car-outline', time: '3h 05m' },
      { icon: 'airplane-outline', time: '1h 15m' }
    ],
    category: 'weekend'
  }
]

export default function Landing() {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState('inspire') // Default to Inspire Me
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const greetingAnim = useRef(new Animated.Value(0)).current
  const dockAnim = useRef(new Animated.Value(0)).current
  const dockGlowAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Page load animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(greetingAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dockAnim, {
          toValue: 1,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        })
      ])
    ]).start()
  }, [])

  const handleModeSwitch = (mode: string) => {
    if (mode === activeMode) return
    setActiveMode(mode)
    console.log(`Switched to mode: ${mode}`)
  }

  const handleBookmark = (itemId: string) => {
    const isBookmarked = bookmarkedItems.includes(itemId)
    
    if (isBookmarked) {
      setBookmarkedItems(prev => prev.filter(id => id !== itemId))
    } else {
      setBookmarkedItems(prev => [...prev, itemId])
      
      // Animate dock glow for "My Trips"
      Animated.sequence([
        Animated.timing(dockGlowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dockGlowAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start()
    }
  }

  const getCurrentCards = () => {
    if (activeMode === 'search') return []
    const filteredCards = destinationCards.filter(card => card.category === activeMode)
    console.log(`Active mode: ${activeMode}, Found cards:`, filteredCards.length)
    return filteredCards
  }

  const renderDestinationCard = (destination: DestinationCard, index: number) => (
    <View key={destination.id} style={styles.cardWrapper}>
      <ImageBackground
        source={{ uri: destination.image }}
        style={styles.destinationCard}
        imageStyle={styles.cardImage}
      >
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />
        
        {/* Bookmark Icon */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => handleBookmark(destination.id)}
          activeOpacity={0.8}
        >
          <View style={styles.bookmarkIcon}>
            <Ionicons
              name={bookmarkedItems.includes(destination.id) ? "bookmark" : "bookmark-outline"}
              size={20}
              color={bookmarkedItems.includes(destination.id) ? "#C9A96D" : "rgba(255,255,255,0.85)"}
            />
          </View>
        </TouchableOpacity>

        {/* Frosted Info Pane */}
        <View style={styles.infoPaneContainer}>
          <BlurView intensity={25} tint="light" style={styles.infoPane}>
            <View style={styles.infoPaneInner}>
              {/* City Name */}
              <Text style={styles.cityName}>{destination.city}</Text>
              
              {/* Tagline */}
              <Text style={styles.cityTagline}>{destination.tagline}</Text>
              
              {/* Transport Row */}
              <View style={styles.transportRow}>
                {destination.transport.map((transport, transportIndex) => (
                  <React.Fragment key={transportIndex}>
                    <View style={styles.transportItem}>
                      <Ionicons 
                        name={transport.icon} 
                        size={15} 
                        color="rgba(255,255,255,0.8)" 
                        style={styles.transportIcon}
                      />
                      <Text style={styles.transportTime}>{transport.time}</Text>
                    </View>
                    {transportIndex < destination.transport.length - 1 && (
                      <View style={styles.transportSeparator}>
                        <Text style={styles.separatorDot}>•</Text>
                      </View>
                    )}
                  </React.Fragment>
                ))}
              </View>
              
              {/* Tag Pill */}
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>Condé Nast Pick</Text>
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
  )

  return (
    <ImageBackground
      source={{
        uri: 'https://customer-assets.emergentagent.com/job_travea-app/artifacts/d1bkqar3_output%20%286%29.jpg'
      }}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      {/* Vignette Overlay */}
      <View style={styles.vignetteOverlay} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          {/* TRĀVEA Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TRĀVEA</Text>
          </View>
          
          {/* Profile Icon */}
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <View style={styles.profileIcon}>
              <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.85)" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <Animated.View 
          style={[
            styles.greetingSection, 
            {
              opacity: greetingAnim,
              transform: [{
                translateY: greetingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          <Text style={styles.greetingMain}>Hello, Anish</Text>
          <Text style={styles.greetingSub}>
            {activeMode === 'inspire' && 'Curated escapes, just for you.'}
            {activeMode === 'weekend' && 'Getaways, made for you.'}
            {activeMode === 'search' && 'Where would you like to go?'}
          </Text>
        </Animated.View>

        {/* Category Chips */}
        <View style={styles.categoryChips}>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => handleModeSwitch('inspire')}
            activeOpacity={0.8}
          >
            {activeMode === 'inspire' && <View style={styles.chipGlow} />}
            <BlurView intensity={20} tint="light" style={styles.chipBlur}>
              <View style={styles.chipContent}>
                <Ionicons name="leaf-outline" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={[styles.chipLabel, activeMode === 'inspire' && styles.chipLabelActive]}>
                  Inspire Me
                </Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            onPress={() => handleModeSwitch('weekend')}
            activeOpacity={0.8}
          >
            {activeMode === 'weekend' && <View style={styles.chipGlow} />}
            <BlurView intensity={20} tint="light" style={styles.chipBlur}>
              <View style={styles.chipContent}>
                <Ionicons name="airplane-outline" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={[styles.chipLabel, activeMode === 'weekend' && styles.chipLabelActive]}>
                  Getaways
                </Text>
              </View>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            onPress={() => handleModeSwitch('search')}
            activeOpacity={0.8}
          >
            {activeMode === 'search' && <View style={styles.chipGlow} />}
            <BlurView intensity={20} tint="light" style={styles.chipBlur}>
              <View style={styles.chipContent}>
                <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={[styles.chipLabel, activeMode === 'search' && styles.chipLabelActive]}>
                  Search
                </Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Carousel */}
        {activeMode !== 'search' && (
          <View key={activeMode} style={styles.carouselContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              contentContainerStyle={styles.carouselContent}
            >
              {getCurrentCards().map((destination, index) => 
                renderDestinationCard(destination, index)
              )}
            </ScrollView>
          </View>
        )}

        {/* Search Pane */}
        {activeMode === 'search' && (
          <View style={styles.searchContainer}>
            <BlurView intensity={25} tint="light" style={styles.searchPane}>
              <View style={styles.searchPaneContent}>
                {/* Title */}
                <Text style={styles.searchTitle}>Where to?</Text>
                
                {/* Search Bar */}
                <BlurView intensity={15} tint="light" style={styles.searchBarContainer}>
                  <View style={styles.searchBarContent}>
                    <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.75)" style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>By city or country</Text>
                  </View>
                </BlurView>
                
                {/* Trending Section */}
                <View style={styles.trendingSection}>
                  <Text style={styles.trendingLabel}>Trending</Text>
                  <View style={styles.trendingGrid}>
                    {['Lisbon', 'Kyoto', 'Marrakech', 'Reykjavík'].map((destination, index) => (
                      <TouchableOpacity key={index} activeOpacity={0.8}>
                        <BlurView intensity={20} tint="light" style={styles.trendingPill}>
                          <View style={styles.trendingPillInner}>
                            <Text style={styles.trendingPillText}>{destination}</Text>
                          </View>
                        </BlurView>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </BlurView>
          </View>
        )}
      </Animated.View>

      {/* Bottom Dock */}
      <Animated.View 
        style={[
          styles.bottomDock,
          {
            opacity: dockAnim,
            transform: [{
              translateY: dockAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })
            }]
          }
        ]}
      >
        <BlurView intensity={20} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="home" size={22} color="#F8F8F8" />
              <Text style={styles.dockLabel}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="map-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Animated.View style={[styles.dockGlowContainer, { opacity: dockGlowAnim }]}>
                <View style={styles.dockGlow} />
              </Animated.View>
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    // No overlay here - applied in separate view
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.3) 100%)',
      },
      default: {
        // For mobile, we'll use a subtle dark overlay
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
    }),
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#F8F8F8',
    letterSpacing: 4.8,
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 0 20px rgba(201,169,109,0.25)',
      },
    }),
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(60,60,60,0.55)', // Lighter for better visibility
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 0 15px rgba(0,0,0,0.3)',
      },
    }),
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  greetingMain: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 0 20px rgba(201,169,109,0.25)',
      },
    }),
  },
  greetingSub: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  categoryChips: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20, // Added spacing from greeting/tagline
    marginBottom: 36, // More spacing to carousel
    gap: 10,
  },
  chip: {
    position: 'relative',
    borderRadius: 30,
    overflow: 'hidden',
  },
  chipBlur: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  chipContent: {
    backgroundColor: 'rgba(25,25,25,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chipLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  chipLabelActive: {
    color: '#F8F8F8',
  },
  chipActive: {
    // Active state handled by glow
  },
  chipGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: 42,
    backgroundColor: 'rgba(201,169,109,0.4)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 25px rgba(201,169,109,0.6)',
      },
    }),
    zIndex: -1,
  },
  taglineContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'left',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  carouselContainer: {
    flex: 1,
    minHeight: 300, // Ensure minimum height for cards to be visible
    marginBottom: 100, // Space for bottom dock
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingLeft: 16,
  },
  cardWrapper: {
    width: width - 32,
    marginRight: 16,
  },
  destinationCard: {
    height: height * 0.45, // Further reduced for better spacing
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    borderRadius: 26,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%)',
      },
      default: {
        // For mobile platforms, use a simple overlay
        backgroundColor: 'rgba(0,0,0,0.15)',
      },
    }),
  },
  bookmarkButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    zIndex: 10,
  },
  bookmarkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(25,25,25,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoPaneContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoPane: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '95%', // Increased from 85% to 95%
  },
  infoPaneInner: {
    backgroundColor: 'rgba(25,25,25,0.35)',
    padding: 20,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  cityTagline: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 14,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  transportItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportSeparator: {
    marginHorizontal: 8,
  },
  separatorDot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
  },
  transportIcon: {
    marginRight: 8,
  },
  transportTime: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#000000', // Black background for Conde Nast branding
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(0,0,0,0.4)', // Subtle glow
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  tagPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF', // White text
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 120, // Space from dock
  },
  searchPane: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
      },
    }),
  },
  searchPaneContent: {
    backgroundColor: 'rgba(25,25,25,0.4)',
    padding: 28,
    alignItems: 'center',
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  searchBarContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 24,
  },
  searchBarContent: {
    backgroundColor: 'rgba(40,40,40,0.3)', // Lighter shade for search bar
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#FFFFFF', // White text
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  trendingContainer: {
    marginTop: 4,
  },
  trendingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  trendingChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  trendingChipPill: {
    backgroundColor: '#000000', // Black like other pills
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 0 6px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  trendingChipText: {
    fontSize: 13,
    color: '#FFFFFF', // White text
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bottomDock: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100, // Ensure dock is always visible on top
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
    position: 'relative',
  },
  dockGlowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockGlow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(201,169,109,0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(201,169,109,0.4)',
      },
    }),
  },
  dockLabel: {
    fontSize: 14,
    color: '#F8F8F8',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
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
});