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

interface SavedDestination {
  id: string
  city: string
  region: string
  tagline: string
  image: string
  transport?: { icon: keyof typeof Ionicons.glyphMap; time: string }[]
  sourceCarousel: string
  sourceTab: string
  isCondeNastPick?: boolean
}

// ALL 24 UNIQUE DESTINATIONS - MECE (Mutually Exclusive, Collectively Exhaustive)
const mockSavedDestinations: SavedDestination[] = [
  // VACATIONS - 12 UNIQUE CITIES
  { id: 'amalfi', city: 'Amalfi', region: 'Italy', tagline: 'Coastal drives & lemon air', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '8h 30m' }], sourceCarousel: 'Curated for You', sourceTab: 'Vacations', isCondeNastPick: true },
  { id: 'kyoto', city: 'Kyoto', region: 'Japan', tagline: 'Temples & still mornings', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '12h 15m' }], sourceCarousel: 'Curated for You', sourceTab: 'Vacations' },
  { id: 'reykjavik', city: 'Reykjavík', region: 'Iceland', tagline: 'Aurora skies & Nordic calm', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '6h 45m' }], sourceCarousel: 'Curated for You', sourceTab: 'Vacations' },
  { id: 'barcelona', city: 'Barcelona', region: 'Spain', tagline: 'Gaudi dreams & tapas nights', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '7h 20m' }], sourceCarousel: 'Curated for You', sourceTab: 'Vacations' },
  { id: 'vienna', city: 'Vienna', region: 'Austria', tagline: 'Imperial elegance & coffee', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '9h 45m' }], sourceCarousel: 'Trending Now', sourceTab: 'Vacations' },
  { id: 'lisbon', city: 'Lisbon', region: 'Portugal', tagline: 'Tram rides & golden sunsets', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '10h 15m' }], sourceCarousel: 'Trending Now', sourceTab: 'Vacations' },
  { id: 'prague', city: 'Prague', region: 'Czech Republic', tagline: 'Castle views & beer halls', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '8h 50m' }], sourceCarousel: 'Trending Now', sourceTab: 'Vacations' },
  { id: 'budapest', city: 'Budapest', region: 'Hungary', tagline: 'Thermal baths & river cruises', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '9h 30m' }], sourceCarousel: 'Trending Now', sourceTab: 'Vacations' },
  { id: 'amsterdam', city: 'Amsterdam', region: 'Netherlands', tagline: 'Canals & cycling paths', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '8h 10m' }], sourceCarousel: 'Seasonal Highlights', sourceTab: 'Vacations' },
  { id: 'stockholm', city: 'Stockholm', region: 'Sweden', tagline: 'Archipelago & midnight sun', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '10h 45m' }], sourceCarousel: 'Seasonal Highlights', sourceTab: 'Vacations' },
  { id: 'copenhagen', city: 'Copenhagen', region: 'Denmark', tagline: 'Hygge culture & harbor views', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '9h 20m' }], sourceCarousel: 'Seasonal Highlights', sourceTab: 'Vacations' },
  { id: 'dubrovnik', city: 'Dubrovnik', region: 'Croatia', tagline: 'Medieval walls & azure seas', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '11h 30m' }], sourceCarousel: 'Seasonal Highlights', sourceTab: 'Vacations' },

  // DISCOVER - 12 UNIQUE CITIES  
  { id: 'santorini', city: 'Santorini', region: 'Greece', tagline: 'Whitewashed cliffs & wine', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '12h 20m' }], sourceCarousel: 'Slow Living', sourceTab: 'Discover' },
  { id: 'provence', city: 'Provence', region: 'France', tagline: 'Lavender fields & markets', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'car-outline', time: '2h 15m' }], sourceCarousel: 'Slow Living', sourceTab: 'Discover' },
  { id: 'tuscany', city: 'Tuscany', region: 'Italy', tagline: 'Rolling hills & vineyards', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'car-outline', time: '3h 05m' }], sourceCarousel: 'Slow Living', sourceTab: 'Discover' },
  { id: 'bali', city: 'Bali', region: 'Indonesia', tagline: 'Rice terraces & temples', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '15h 30m' }], sourceCarousel: 'Slow Living', sourceTab: 'Discover' },
  { id: 'maldives', city: 'Maldives', region: 'Indian Ocean', tagline: 'Overwater luxury & reefs', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '18h 45m' }], sourceCarousel: 'Quick Getaways', sourceTab: 'Discover' },
  { id: 'patagonia', city: 'Patagonia', region: 'Chile', tagline: 'Glaciers & wild landscapes', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'airplane-outline', time: '20h 15m' }], sourceCarousel: 'Quick Getaways', sourceTab: 'Discover' },
  { id: 'marrakech', city: 'Marrakech', region: 'Morocco', tagline: 'Souks & desert sunsets', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '13h 40m' }], sourceCarousel: 'Quick Getaways', sourceTab: 'Discover' },
  { id: 'capetown', city: 'Cape Town', region: 'South Africa', tagline: 'Table Mountain & vineyards', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '17h 25m' }], sourceCarousel: 'Quick Getaways', sourceTab: 'Discover' },
  { id: 'queenstown', city: 'Queenstown', region: 'New Zealand', tagline: 'Adventure & alpine lakes', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'airplane-outline', time: '22h 10m' }], sourceCarousel: 'Escape Themes', sourceTab: 'Discover' },
  { id: 'aspen', city: 'Aspen', region: 'USA', tagline: 'Powder snow & luxury lodges', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '6h 30m' }], sourceCarousel: 'Escape Themes', sourceTab: 'Discover' },
  { id: 'gstaad', city: 'Gstaad', region: 'Switzerland', tagline: 'Alpine elegance & skiing', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '9h 45m' }], sourceCarousel: 'Escape Themes', sourceTab: 'Discover' },
  { id: 'napa', city: 'Napa Valley', region: 'USA', tagline: 'World-class wines & cuisine', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'car-outline', time: '1h 45m' }], sourceCarousel: 'Escape Themes', sourceTab: 'Discover' }
]

export default function MyTrips() {
  const router = useRouter()
  
  console.log('MyTrips: Component rendering')
  
  const { bookmarkedItems, removeBookmark } = useBookmarks()
  
  console.log('MyTrips: Hook returned bookmarkedItems:', bookmarkedItems)
  
  const [activeTab, setActiveTab] = useState('saved') // Default to Saved
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const headerAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Page load animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const handleTabSwitch = (tab: string) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    console.log(`Switched to tab: ${tab}`)
  }

  const handleRemoveBookmark = (destinationId: string) => {
    removeBookmark(destinationId)
  }

  // Get actual saved destinations from bookmarked items
  const getSavedDestinations = (): SavedDestination[] => {
    console.log('=== CONTEXT-BASED FILTERING ===')
    console.log('bookmarkedItems from context:', bookmarkedItems)
    console.log('mockSavedDestinations IDs:', mockSavedDestinations.map(d => d.id))
    
    const filtered = mockSavedDestinations.filter(dest => bookmarkedItems.includes(dest.id))
    console.log('Filtered destinations:', filtered)
    
    // If no bookmarks, return empty array (not all destinations)
    return filtered
  }

  // Group saved destinations by their source carousel
  const getGroupedDestinations = () => {
    const groups: { [key: string]: SavedDestination[] } = {}
    const savedDestinations = getSavedDestinations()
    
    savedDestinations.forEach(dest => {
      const groupKey = dest.sourceCarousel // Remove prefixes, just use carousel name
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(dest)
    })
    
    return groups
  }

  const renderSavedCard = (destination: SavedDestination, index: number, isOnlyCard: boolean) => {
    console.log('renderSavedCard: Called for destination:', destination.id)
    return (
    <View key={destination.id} style={[styles.savedCardWrapper, isOnlyCard && styles.singleCardWrapper]}>
      <ImageBackground
        source={{ uri: destination.image }}
        style={styles.savedCard}
        imageStyle={styles.savedCardImage}
      >
        {/* Light Vignette */}
        <View style={styles.cardVignette} />
        
        {/* Bookmark Icon */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => handleRemoveBookmark(destination.id)}
          activeOpacity={0.8}
        >
          <BlurView intensity={18} tint="light" style={styles.bookmarkContainer}>
            <View style={styles.bookmarkInner}>
              <Ionicons
                name="bookmark"
                size={16}
                color="#C9A96D"
              />
            </View>
          </BlurView>
        </TouchableOpacity>

        {/* Frosted Info Pane with integrated CTAs */}
        <View style={styles.cardInfoContainer}>
          <BlurView intensity={24} tint="light" style={styles.cardInfoPane}>
            <View style={styles.cardInfoInner}>
              {/* Condé Nast Pick Badge - Top Right */}
              {destination.isCondeNastPick && (
                <View style={styles.condeNastBadgeTopRight}>
                  <View style={styles.condeNastBadgeInner}>
                    <Text style={styles.condeNastBadgeText}>Condé Nast</Text>
                  </View>
                </View>
              )}
              
              {/* Destination Header: "City, Country" */}
              <View style={styles.destinationHeader}>
                <Text style={styles.destinationCity}>{destination.city}, </Text>
                <Text style={styles.destinationRegion}>{destination.region}</Text>
              </View>
              
              {/* Tagline */}
              <Text style={styles.destinationTagline}>{destination.tagline}</Text>
              
              {/* Transport Info Row */}
              {destination.transport && (
                <View style={styles.transportRow}>
                  {destination.transport.map((transport, transportIndex) => (
                    <React.Fragment key={transportIndex}>
                      <View style={styles.transportItem}>
                        <Ionicons 
                          name={transport.icon} 
                          size={14} 
                          color="rgba(255,255,255,0.8)" 
                          style={styles.transportIcon}
                        />
                        <Text style={styles.transportTime}>{transport.time}</Text>
                      </View>
                      {transportIndex < destination.transport.length - 1 && (
                        <Text style={styles.transportSeparator}> • </Text>
                      )}
                    </React.Fragment>
                  ))}
                </View>
              )}

              {/* Canvas Button - Left Aligned & Shorter */}
              <View style={styles.canvasButtonContainer}>
                <TouchableOpacity style={styles.canvasButton} activeOpacity={0.8}>
                  <View style={styles.canvasIconContainer}>
                    <Ionicons name="add" size={10} color="rgba(255,255,255,0.9)" />
                  </View>
                  <Text style={styles.canvasButtonText}>Canvas</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
    )
  }

  const renderSavedContent = () => {
    console.log('renderSavedContent: Called')
    const groupedDestinations = getGroupedDestinations()
    console.log('renderSavedContent: groupedDestinations:', groupedDestinations)
    
    if (Object.keys(groupedDestinations).length === 0) {
      console.log('renderSavedContent: No destinations found, showing empty state')
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No saved destinations yet</Text>
          <Text style={styles.emptyStateSubtext}>Bookmark places on the discover page to see them here</Text>
        </View>
      )
    }

    return (
      <ScrollView 
        style={styles.scrollableContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollableContentContainer}
      >
        {Object.entries(groupedDestinations).map(([groupTitle, destinations]) => (
          <View key={groupTitle} style={styles.carouselSection}>
            {/* Carousel Title */}
            <View style={styles.carouselHeader}>
              <Text style={styles.carouselTitle}>{groupTitle}</Text>
            </View>

            {/* Horizontal Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              contentContainerStyle={styles.carouselContent}
            >
              {destinations.map((destination, cardIndex) => 
                renderSavedCard(destination, cardIndex, destinations.length === 1)
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {/* Vignette Overlay */}
      <View style={styles.vignetteOverlay} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: headerAnim,
              transform: [{
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          {/* Back Button & TRĀVEA Logo */}
          <View style={styles.logoContainer}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
            <Text style={styles.logoText}>TRĀVEA</Text>
          </View>
          
          {/* Profile Icon */}
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <View style={styles.profileIcon}>
              <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.85)" />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Page Title - Separate and Left Aligned */}
        <View style={styles.pageTitleSection}>
          <Text style={styles.pageTitle}>MY TRIPS</Text>
        </View>

        {/* Sticky Tab Pills */}
        <View style={styles.stickyTabsContainer}>
          <View style={styles.tabChips}>
            <TouchableOpacity
              style={styles.tabChip}
              onPress={() => handleTabSwitch('ongoing')}
              activeOpacity={0.8}
            >
              {activeTab === 'ongoing' && <View style={styles.tabChipGlow} />}
              <BlurView intensity={20} tint="light" style={styles.tabChipBlur}>
                <View style={styles.tabChipContent}>
                  <Ionicons name="play-circle-outline" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={[styles.tabChipLabel, activeTab === 'ongoing' && styles.tabChipLabelActive]}>
                    Ongoing
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabChip}
              onPress={() => handleTabSwitch('upcoming')}
              activeOpacity={0.8}
            >
              {activeTab === 'upcoming' && <View style={styles.tabChipGlow} />}
              <BlurView intensity={20} tint="light" style={styles.tabChipBlur}>
                <View style={styles.tabChipContent}>
                  <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={[styles.tabChipLabel, activeTab === 'upcoming' && styles.tabChipLabelActive]}>
                    Upcoming
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabChip}
              onPress={() => handleTabSwitch('saved')}
              activeOpacity={0.8}
            >
              {activeTab === 'saved' && <View style={styles.tabChipGlow} />}
              <BlurView intensity={20} tint="light" style={styles.tabChipBlur}>
                <View style={styles.tabChipContent}>
                  <Ionicons name="bookmark-outline" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={[styles.tabChipLabel, activeTab === 'saved' && styles.tabChipLabelActive]}>
                    Saved
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        {activeTab === 'saved' && renderSavedContent()}
        
        {activeTab === 'ongoing' && (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>Ongoing Trips</Text>
            <Text style={styles.placeholderSubtext}>Your active trips will appear here</Text>
          </View>
        )}
        
        {activeTab === 'upcoming' && (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>Upcoming Trips</Text>
            <Text style={styles.placeholderSubtext}>Your planned adventures will show here</Text>
          </View>
        )}
      </Animated.View>

      {/* Bottom Dock */}
      <View style={styles.bottomDock}>
        <BlurView intensity={30} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/landing')}
            >
              <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/canvas')}
            >
              <Ionicons name="brush" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="bookmark" size={22} color="#C9A96D" />
              <Text style={styles.dockLabelActive}>My Trips</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: '#0E0E0E', // Deep charcoal base to match landing page
    ...Platform.select({
      web: {
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        background: 'linear-gradient(180deg, #0E0E0E 0%, #151515 100%)', // Same gradient as landing page
      },
      default: {
        // Gradient simulation for native using backgroundColor
        backgroundColor: '#0E0E0E',
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
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)', // Subtle vignette edge fade
      },
      default: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle vignette for native
      },
    }),
  },
  content: {
    flex: 1,
    paddingTop: Platform.select({
      ios: 50,
      android: 30,
      web: 20,
    }),
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // Reduced bronze glow for logo to match landing page
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 6px rgba(201,169,109,0.4))', // Same as landing page
      },
      default: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  pageTitleSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  pageTitleSection: {
    paddingHorizontal: 20,
    marginBottom: 20, // Increased spacing from pills
  },
  pageTitle: {
    fontSize: 22, // Reduced font size as requested
    fontWeight: '600', // Semi-bold
    color: '#F8F8F8',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  profileButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)', // Enhanced frosted glass circle for visibility
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', // Subtle border for definition
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)', // Soft shadow for depth
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  stickyTabsContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    marginBottom: 32,
    ...Platform.select({
      web: {
        position: 'sticky',
      },
    }),
  },
  stickyTabsBlur: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tabChips: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  tabChip: {
    position: 'relative',
    borderRadius: 30,
    overflow: 'hidden',
  },
  tabChipBlur: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  tabChipContent: {
    backgroundColor: 'rgba(25,25,25,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6, // Space between icon and text
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabChipLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  tabChipLabelActive: {
    color: '#F8F8F8',
  },
  tabChipGlow: {
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
  scrollableContent: {
    flex: 1,
  },
  scrollableContentContainer: {
    paddingBottom: 120, // Space for bottom dock
  },
  carouselSection: {
    marginBottom: 32,
  },
  carouselHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingLeft: 16,
  },
  savedCardWrapper: {
    width: width - 80,
    marginRight: 16,
  },
  singleCardWrapper: {
    width: width - 40,
    alignSelf: 'center',
  },
  savedCard: {
    height: height * 0.35,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  savedCardImage: {
    borderRadius: 32,
  },
  cardVignette: {
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
    backgroundColor: 'rgba(20,20,20,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(201,169,109,0.5), inset 0 0 12px rgba(255,255,255,0.08)',
      },
      default: {
        shadowColor: 'rgba(201,169,109,0.6)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 6,
      },
    }),
  },
  cardInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardInfoPane: {
    borderRadius: 26,
    overflow: 'hidden',
  },
  cardInfoInner: {
    backgroundColor: 'rgba(40,40,40,0.35)',
    padding: 16,
    position: 'relative',
  },
  condeNastBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  condeNastBadgeTopRight: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  condeNastBadgeInner: {
    backgroundColor: 'rgba(0,0,0,0.55)', // Matte black pill
    borderRadius: 12, // 12px border radius
    paddingHorizontal: 8, // 6-8px padding
    paddingVertical: 6,
    // No glow - keep understated
  },
  condeNastBadgeText: {
    fontSize: 12, // 12px
    fontWeight: '500', // Inter Medium
    color: '#FFFFFF', // White text
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  destinationCity: {
    fontSize: 20,
    fontWeight: '600', // Semi-bold
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  destinationRegion: {
    fontSize: 18,
    fontWeight: '500', // Medium
    color: 'rgba(255,255,255,0.65)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  destinationTagline: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportIcon: {
    marginRight: 4,
  },
  transportTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)', // 80% white
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  transportSeparator: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  canvasButtonContainer: {
    marginTop: 8, // Space below transport row  
    alignItems: 'flex-start', // Left align below transport row
  },
  canvasIconContainer: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  canvasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,169,109,0.25)',
    borderRadius: 6, // Smaller radius for compact look
    paddingVertical: 4, // Shorter height - reduced from 6px
    paddingHorizontal: 10, // Compact horizontal padding
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)',
      },
    }),
  },
  canvasButtonText: {
    fontSize: 12, // Compact font size
    fontWeight: '600',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(25,25,25,0.45)',
    borderRadius: 8, // Matching primary action
    paddingVertical: 6, // Reduced height to match
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.05)',
      },
    }),
  },
  secondaryActionBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryActionInner: {
    backgroundColor: 'rgba(25,25,25,0.45)', // Frosted neutral
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.05)',
      },
    }),
  },
  secondaryActionText: {
    fontSize: 13, // Matching primary action text size
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  emptyStateSubtext: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  placeholderSubtext: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  // Bottom Dock Styles - Matching Landing Page Exactly
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
    backgroundColor: 'rgba(25,25,25,0.35)', // Exact match to landing page
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
  dockLabelActive: {
    fontSize: 14, // Matching landing page
    color: '#C9A96D',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockLabelInactive: {
    fontSize: 14, // Matching landing page
    color: 'rgba(255,255,255,0.7)', // Matching landing page
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
})