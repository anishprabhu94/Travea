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
import { useBookmarks } from '../contexts/BookmarkContext'

const { width, height } = Dimensions.get('window')

interface TransportInfo {
  icon: keyof typeof Ionicons.glyphMap
  time: string
}

interface DestinationCard {
  id: string
  city: string
  region: string
  tagline: string
  image: string
  transport: TransportInfo[]
  category: 'inspire' | 'weekend'
}

const destinationCards: DestinationCard[] = [
  // Inspire Me Cards (Vacations)
  {
    id: 'amalfi1',
    city: 'Amalfi 1',
    region: 'Italy',
    tagline: 'Coastal drives & lemon air',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    transport: [
      { icon: 'car-outline', time: '2h 45m' },
      { icon: 'airplane-outline', time: '1h 20m' }
    ],
    category: 'inspire'
  },
  {
    id: 'kyoto1',
    city: 'Kyoto 1',
    region: 'Japan',
    tagline: 'Temples, lanterns & still mornings',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    transport: [
      { icon: 'airplane-outline', time: '11h 30m' },
      { icon: 'train-outline', time: '3h 15m' }
    ],
    category: 'inspire'
  },
  {
    id: 'reykjavik1',
    city: 'Reykjavík 1',
    region: 'Iceland',
    tagline: 'Nordic calm & aurora skies',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg',
    transport: [
      { icon: 'airplane-outline', time: '6h 45m' }
    ],
    category: 'inspire'
  },
  // Weekend Cards (Discover)
  {
    id: 'sonoma1',
    city: 'Sonoma 1',
    region: 'USA',
    tagline: 'Wine alleys & golden light',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg',
    transport: [
      { icon: 'car-outline', time: '1h 30m' },
      { icon: 'train-outline', time: '2h 10m' }
    ],
    category: 'weekend'
  },
  {
    id: 'carmel1',
    city: 'Carmel 1',
    region: 'USA',
    tagline: 'Cliffside cafés & slow tides',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg',
    transport: [
      { icon: 'car-outline', time: '2h 15m' },
      { icon: 'train-outline', time: '2h 45m' }
    ],
    category: 'weekend'
  },
  {
    id: 'bigsur1',
    city: 'Big Sur 1',
    region: 'USA',
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
  const { bookmarkedItems, addBookmark, removeBookmark } = useBookmarks()
  const [activeMode, setActiveMode] = useState('inspire') // Default to Inspire Me
  const [bookmarkAnimations, setBookmarkAnimations] = useState<{[key: string]: Animated.Value}>({})
  
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
    // Reset city counters when switching modes
    cityCounters.current = {}
    setActiveMode(mode)
    console.log(`Switched to mode: ${mode}`)
    
    // Reset scroll to top when switching tabs
    setTimeout(() => {
      if (Platform.OS === 'web') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  const getBookmarkAnimation = (itemId: string) => {
    if (!bookmarkAnimations[itemId]) {
      setBookmarkAnimations(prev => ({
        ...prev,
        [itemId]: new Animated.Value(1)
      }))
    }
    return bookmarkAnimations[itemId] || new Animated.Value(1)
  }

  const handleBookmark = (itemId: string) => {
    const isBookmarked = bookmarkedItems.includes(itemId)
    
    if (isBookmarked) {
      removeBookmark(itemId)
    } else {
      addBookmark(itemId)
      
      // Get individual animation for this specific bookmark
      const bookmarkAnim = getBookmarkAnimation(itemId)
      
      // Elegant bookmark animation sequence for this item only
      Animated.sequence([
        // 1. Pulse the specific bookmark icon
        Animated.timing(bookmarkAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bookmarkAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        // 2. Gentle glow on dock after a slight delay
        Animated.timing(dockGlowAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dockGlowAnim, {
          toValue: 0,
          duration: 600,
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

  // Get 4 cards for each carousel (using existing cards + placeholder)
  const get4Cards = (cards: DestinationCard[], carouselId: string) => {
    const result = cards.map((card, index) => ({
      ...card,
      id: `${carouselId}_${card.id}_${index}` // Unique ID per carousel
    }))
    // If we have fewer than 4 cards, use the first card as placeholder for the 4th
    while (result.length < 4) {
      const originalCard = cards[0]
      result.push({
        ...originalCard, 
        id: `${carouselId}_${originalCard.id}_placeholder_${result.length}`
      })
    }
    return result.slice(0, 4)
  }

  // Carousel configurations
  const getCarouselConfig = () => {
    const baseCards = getCurrentCards()
    if (activeMode === 'inspire') {
      return [
        { title: 'Curated for You', cards: get4Cards(baseCards, 'inspire_curated') },
        { title: 'Trending', cards: get4Cards(baseCards, 'inspire_trending') },
        { title: 'Seasonal Highlights', cards: get4Cards(baseCards, 'inspire_seasonal') },
      ]
    } else if (activeMode === 'weekend') {
      return [
        { title: 'Quick Getaways', cards: get4Cards(baseCards, 'weekend_quick') },
        { title: 'Slow Living', cards: get4Cards(baseCards, 'weekend_slow') },
        { title: 'Escape Themes', cards: get4Cards(baseCards, 'weekend_escape') },
      ]
    }
    return []
  }

  const renderDestinationCard = (destination: DestinationCard, index: number) => (
    <View key={destination.id} style={styles.cardWrapper}>
      <ImageBackground
        source={{ uri: destination.image }}
        style={styles.destinationCard}
        imageStyle={styles.cardImage}
      >
        {/* Light Vignette */}
        <View style={styles.cardVignetteOverlay} />
        
        {/* Bookmark Icon with Frosted Container */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => {
            console.log('=== BOOKMARK BUTTON CLICKED ===')
            console.log('City:', destination.city)
            console.log('ID:', destination.id)
            
            // Use the unique city name as bookmark ID (e.g., "Amalfi 2", "Kyoto 1")
            const bookmarkId = destination.city.toLowerCase().replace(/\s+/g, '')
            console.log('Using bookmark ID:', bookmarkId)
            
            handleBookmark(bookmarkId)
          }}
          activeOpacity={0.8}
        >
          <Animated.View style={[{ transform: [{ scale: getBookmarkAnimation(destination.id) }] }]}>
            <BlurView intensity={18} tint="light" style={styles.bookmarkContainer}>
              <View style={styles.bookmarkInner}>
                <Ionicons
                  name={bookmarkedItems.includes(destination.city.toLowerCase().replace(/\s+/g, '')) ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={bookmarkedItems.includes(destination.city.toLowerCase().replace(/\s+/g, '')) ? "#C9A96D" : "rgba(201,169,109,0.8)"}
                />
              </View>
            </BlurView>
          </Animated.View>
        </TouchableOpacity>

        {/* Luxury Frosted Info Pane */}
        <View style={styles.luxuryInfoContainer}>
          <BlurView intensity={25} tint="light" style={styles.luxuryInfoPane}>
            <View style={styles.luxuryInfoInner}>
              {/* Refined Destination Header: "City, Country" */}
              <View style={styles.destinationHeader}>
                <Text style={styles.destinationCity}>{destination.city}, </Text>
                <Text style={styles.destinationRegion}>{destination.region}</Text>
              </View>
              
              {/* Editorial Tagline */}
              <Text style={styles.editorialTagline}>{destination.tagline}</Text>
              
              {/* Transport Info Row - Inline */}
              <View style={styles.luxuryTransportRow}>
                {destination.transport.map((transport, transportIndex) => (
                  <React.Fragment key={transportIndex}>
                    <View style={styles.luxuryTransportItem}>
                      <Ionicons 
                        name={transport.icon} 
                        size={16} 
                        color="rgba(255,255,255,0.7)" 
                        style={styles.luxuryTransportIcon}
                      />
                      <Text style={styles.luxuryTransportTime}>{transport.time}</Text>
                    </View>
                    {transportIndex < destination.transport.length - 1 && (
                      <Text style={styles.luxuryTransportSeparator}> • </Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
              
              {/* Editorial Badge - Condé Nast */}
              <View style={styles.editorialBadge}>
                <BlurView intensity={18} tint="light" style={styles.editorialBadgeBlur}>
                  <View style={styles.editorialBadgeInner}>
                    <Text style={styles.editorialBadgeText}>Condé Nast</Text>
                  </View>
                </BlurView>
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
            {activeMode === 'inspire' && 'Curated vacations, just for you.'}
            {activeMode === 'weekend' && 'Hidden gems, waiting to be found.'}
            {activeMode === 'search' && 'Where would you like to go?'}
          </Text>
        </Animated.View>

        {/* Sticky Category Chips */}
        <View style={styles.stickyChipsContainer}>
          <View style={styles.categoryChips}>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleModeSwitch('inspire')}
                activeOpacity={0.8}
              >
                {activeMode === 'inspire' && <View style={styles.chipGlow} />}
                <BlurView intensity={20} tint="light" style={styles.chipBlur}>
                  <View style={styles.chipContent}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.9)" />
                    <Text style={[styles.chipLabel, activeMode === 'inspire' && styles.chipLabelActive]}>
                      Vacations
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
                    <Ionicons name="compass-outline" size={16} color="rgba(255,255,255,0.9)" />
                    <Text style={[styles.chipLabel, activeMode === 'weekend' && styles.chipLabelActive]}>
                      Discover
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
        </View>

        {/* Multi-Carousel Content */}
        {activeMode !== 'search' && (
          <ScrollView 
            style={styles.scrollableContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollableContentContainer}
          >
            {getCarouselConfig().map((carousel, carouselIndex) => (
              <View key={`${activeMode}-${carouselIndex}`} style={styles.carouselSection}>
                {/* Carousel Title with Frosted Button */}
                <View style={styles.carouselHeader}>
                  <Text style={styles.carouselTitle}>{carousel.title}</Text>
                  <View style={styles.titleArrowSpacing} />
                  <TouchableOpacity style={styles.frostedButton} activeOpacity={0.8}>
                    <BlurView intensity={12} tint="light" style={styles.frostedButtonBlur}>
                      <View style={styles.frostedButtonInner}>
                        <Ionicons name="chevron-forward" size={14} color="rgba(201,169,109,0.8)" />
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </View>

                {/* Horizontal Carousel */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.carousel}
                  contentContainerStyle={styles.carouselContent}
                >
                  {carousel.cards.map((destination, cardIndex) => 
                    renderDestinationCard(destination, cardIndex)
                  )}
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Search Pane */}
        {activeMode === 'search' && (
          <View style={styles.searchContainer}>
            <BlurView intensity={25} tint="light" style={styles.searchPane}>
              <View style={styles.searchPaneContent}>
                {/* Title */}
                <View style={styles.titleContainer}>
                  <Text style={styles.searchTitle}>Where to?</Text>
                  <View style={styles.titleAccent} />
                </View>
                
                {/* Search Bar */}
                <BlurView intensity={25} tint="light" style={styles.searchBarContainer}>
                  <View style={styles.searchBarContent}>
                    <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.75)" style={styles.searchIcon} />
                    <Text style={styles.searchPlaceholder}>By city or country</Text>
                  </View>
                </BlurView>
                
                {/* Trending Section */}
                <View style={styles.trendingSection}>
                  <Text style={styles.trendingLabel}>Trending now</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.trendingScrollView}
                    contentContainerStyle={styles.trendingContent}
                  >
                    {['Lisbon', 'Kyoto', 'Marrakech', 'Reykjavík', 'Venice', 'Santorini'].map((destination, index) => (
                      <TouchableOpacity key={index} activeOpacity={0.7} style={styles.trendingPillWrapper}>
                        <BlurView intensity={20} tint="light" style={styles.trendingPill}>
                          <View style={styles.trendingPillInner}>
                            <Text style={styles.trendingPillText}>{destination}</Text>
                          </View>
                        </BlurView>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
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
              <Ionicons name="home" size={22} color="#C9A96D" />
              <Text style={styles.dockLabelActive}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="map-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/trips')}
            >
              <Animated.View style={[styles.dockGlowContainer, { opacity: dockGlowAnim }]}>
                <View style={styles.dockGlow} />
              </Animated.View>
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
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
    margin: 0,
    padding: 0,
    // Edge-to-edge "infinity-pool" effect
    ...Platform.select({
      web: {
        minHeight: '100vh',
        margin: 0,
        padding: 0,
      },
    }),
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
    paddingTop: Platform.select({
      ios: 50, // Account for status bar on iOS
      android: 30, // Account for status bar on Android
      web: 20,
    }),
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
    marginBottom: 24, // Increased for better spacing from tabs
    marginTop: -8, // Moved up for better spacing
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
  stickyChipsContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    ...Platform.select({
      web: {
        position: 'sticky',
      },
    }),
  },
  categoryChips: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    // Removed background color to fix weird pane behind tabs
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
  scrollableContent: {
    flex: 1,
    marginTop: 32, // Add elegant spacing between tabs and carousel content
  },
  scrollableContentContainer: {
    paddingBottom: 120, // Space for bottom dock
  },
  carouselSection: {
    marginBottom: 32,
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center', // This ensures vertical center alignment
    paddingHorizontal: 20,
    marginBottom: 16,
    justifyContent: 'flex-start', // Align items to the start
  },
  carouselTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  titleArrowSpacing: {
    width: 12, // Elegant spacing between title and arrow
  },
  frostedButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  frostedButtonBlur: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  frostedButtonInner: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      },
    }),
  },
  carouselContainer: {
    marginBottom: 100, // Space for bottom dock (legacy - can remove)
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingLeft: 16,
  },
  cardWrapper: {
    width: width - 80, // Reduced from 32 to 80 for cleaner, more compact cards
    marginRight: 16,
  },
  destinationCard: {
    height: height * 0.38, // 3:2 aspect ratio portrait mobile
    borderRadius: 32, // Updated to luxury specs
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    borderRadius: 32,
  },
  cardVignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.2) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
    }),
  },
  bookmarkButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  bookmarkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bookmarkInner: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.65)', // Darker frosted background for better visibility
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(201,169,109,0.6)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 0 16px rgba(201,169,109,0.5), inset 0 0 12px rgba(255,255,255,0.08)', // Elegant bronze glow
      },
    }),
  },
  luxuryInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%', // Smaller footprint - more refined
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  luxuryInfoPane: {
    borderRadius: 28,
    overflow: 'hidden',
    width: '100%',
  },
  luxuryInfoInner: {
    backgroundColor: 'rgba(30,30,30,0.25)', // Lighter and airier - more transparent
    borderWidth: 0, // Remove hard border
    padding: 14, // Reduced padding for smaller footprint  
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 0 20px rgba(255,255,255,0.08)', // Soft inner glow instead of border
      },
      default: {
        // Add soft inner glow for mobile
        shadowColor: 'rgba(255,255,255,0.08)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  destinationCity: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.3,
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  destinationSeparator: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  destinationRegion: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    lineHeight: 26,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  editorialTagline: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8, // Reduced margin for tighter layout
    lineHeight: 20,
    letterSpacing: 0.1,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  luxuryTransportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin for tighter layout
  },
  luxuryTransportItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  luxuryTransportSeparator: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  luxuryTransportIcon: {
    marginRight: 6,
  },
  luxuryTransportTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  editorialBadge: {
    alignSelf: 'flex-start',
    borderRadius: 18,
    overflow: 'hidden',
  },
  editorialBadgeBlur: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  editorialBadgeInner: {
    backgroundColor: 'rgba(0,0,0,0.6)', // Matte black semi-transparent background
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', // Subtle border
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 6px rgba(0,0,0,0.3)', // Subtle glow
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  editorialBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(30px)', // Higher blur for weightless feeling
      },
    }),
  },
  searchPaneContent: {
    backgroundColor: 'rgba(25,25,25,0.35)', // Slightly lighter for airiness
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'flex-start', // Left align everything
  },
  titleContainer: {
    alignSelf: 'flex-start',
    marginBottom: 28,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '500', // Poise, not bold
    color: '#F8F8F8',
    marginBottom: 6,
    textAlign: 'left',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 0 15px rgba(201,169,109,0.25)', // Faint bronze glow
      },
    }),
  },
  titleAccent: {
    width: 32, // Increased width to be more prominent
    height: 2, // Increased height for better visibility
    backgroundColor: 'rgba(201,169,109,0.6)', // More opaque bronze for prominence
    alignSelf: 'flex-start', // Ensure it aligns to the left edge of the text
    marginLeft: 0, // Start at the very beginning of the "W"
    ...Platform.select({
      web: {
        boxShadow: '0 0 4px rgba(201,169,109,0.4)', // Subtle glow for elegance
      },
    }),
  },
  searchBarContainer: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 32, // More breathing space
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  searchBarContent: {
    backgroundColor: 'rgba(255,255,255,0.04)', // Much lighter for elegant frosted appearance
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', // More visible but still subtle frosted border
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 6px rgba(255,255,255,0.08), 0 0 16px rgba(0,0,0,0.12)', // Lighter, more elegant shadows
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.15)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
    opacity: 0.85, // Reduced opacity for elegance
  },
  searchPlaceholder: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.65)', // Lighter for elegance
    letterSpacing: 0.5, // Elegant spacing
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  trendingSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  trendingLabel: {
    fontSize: 22, // Consistent with carousel titles
    fontWeight: '600', // Consistent with carousel titles
    color: '#F8F8F8', // Consistent with carousel titles
    marginBottom: 18, // More breathing space
    textTransform: 'none', // Remove uppercase for consistency
    letterSpacing: 0, // Reset letter spacing for consistency
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  trendingScrollView: {
    width: '100%',
  },
  trendingContent: {
    paddingHorizontal: 0,
    gap: 12,
  },
  trendingPillWrapper: {
    marginRight: 12,
  },
  trendingPill: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  trendingPillInner: {
    backgroundColor: 'rgba(255,255,255,0.06)', // Much lighter and more elegant frosted appearance
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // Slightly more visible border
    paddingHorizontal: 20,
    paddingVertical: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)', // Increased blur for elegant frosted effect
        boxShadow: '0 3px 12px rgba(0,0,0,0.2), inset 0 1px 4px rgba(255,255,255,0.08)', // Lighter, more elegant shadows
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  trendingPillText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)', // White 90% opacity
    fontWeight: '600', // Semi-bold
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
  dockLabelActive: {
    fontSize: 14,
    color: '#C9A96D',
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