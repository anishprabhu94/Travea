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
import TraveaWordmark from '../components/TraveaWordmark'
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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('planning') // Default dropdown value
  
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

  const getEmptyStateMessage = () => {
    if (activeTab === 'saved') {
      return {
        title: 'No saved destinations yet',
        subtitle: 'Bookmark places on the discover page to see them here'
      }
    }
    
    // For dropdown filters
    switch (selectedFilter) {
      case 'planning':
        return {
          title: 'No trips in planning',
          subtitle: 'Start planning your next journey from saved destinations'
        }
      case 'upcoming':
        return {
          title: 'No upcoming trips',
          subtitle: 'Finalize your plans to see them here'
        }
      case 'ongoing':
        return {
          title: 'No active trips',
          subtitle: 'Your current journey will appear here'
        }
      case 'completed':
        return {
          title: 'No completed trips yet',
          subtitle: 'Your travel history will be saved here'
        }
      default:
        return {
          title: 'No trips found',
          subtitle: 'Start exploring to create your first trip'
        }
    }
  }

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
      <TouchableOpacity 
        onPress={() => router.push(`/destination?id=${destination.id}&city=${destination.city}&region=${destination.region}`)}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: destination.image }}
          style={styles.savedCard}
          imageStyle={styles.savedCardImage}
        >
        {/* Soft neutral grey veil overlay */}
        <View style={styles.cardGreyVeilOverlay} />
        
        {/* Refined vignette with depth */}
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

              {/* Plan Trip Button */}
              <View style={styles.planTripButtonContainer}>
                <TouchableOpacity style={styles.planTripButton} activeOpacity={0.8}>
                  <Text style={styles.planTripButtonText}>Plan Trip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
      </TouchableOpacity>
    </View>
    )
  }

  const renderSavedContent = () => {
    console.log('renderSavedContent: Called')
    const groupedDestinations = getGroupedDestinations()
    console.log('renderSavedContent: groupedDestinations:', groupedDestinations)
    
    if (Object.keys(groupedDestinations).length === 0) {
      console.log('renderSavedContent: No destinations found, showing empty state')
      const emptyMessage = getEmptyStateMessage()
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{emptyMessage.title}</Text>
          <Text style={styles.emptyStateSubtext}>{emptyMessage.subtitle}</Text>
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
          {/* Left Aligned Logo */}
          <View style={styles.logoContainer}>
            <TraveaWordmark size="medium" />
          </View>
        </Animated.View>

        {/* Sticky Tab Pills - Removed Page Title */}
        <View style={styles.stickyTabsContainer}>
          <View style={styles.tabChips}>
            {/* Saved Pill - First */}
            <TouchableOpacity
              style={styles.tabChip}
              onPress={() => handleTabSwitch('saved')}
              activeOpacity={0.8}
            >
              {activeTab === 'saved' && <View style={styles.tabChipGlow} />}
              <BlurView intensity={20} tint="light" style={styles.tabChipBlur}>
                <View style={[styles.tabChipContent, activeTab === 'saved' && styles.tabChipContentActive]}>
                  <Ionicons name="bookmark-outline" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={[styles.tabChipLabel, activeTab === 'saved' && styles.tabChipLabelActive]}>
                    Saved
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>

            {/* Dropdown Pill */}
            <TouchableOpacity
              style={styles.tabChip}
              onPress={() => setDropdownOpen(!dropdownOpen)}
              activeOpacity={0.8}
            >
              {activeTab !== 'saved' && <View style={styles.tabChipGlow} />}
              <BlurView intensity={20} tint="light" style={styles.tabChipBlur}>
                <View style={[styles.tabChipContent, activeTab !== 'saved' && styles.tabChipContentActive]}>
                  <Ionicons name="funnel-outline" size={16} color="rgba(255,255,255,0.9)" />
                  <Text style={[styles.tabChipLabel, activeTab !== 'saved' && styles.tabChipLabelActive]}>
                    {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
                  </Text>
                  <Ionicons name={dropdownOpen ? "chevron-up" : "chevron-down"} size={14} color="rgba(255,255,255,0.7)" />
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>
          
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              <BlurView intensity={30} tint="light" style={styles.dropdownBlur}>
                <View style={styles.dropdownContent}>
                  {['planning', 'upcoming', 'ongoing', 'completed'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedFilter(option)
                        setDropdownOpen(false)
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        selectedFilter === option && styles.dropdownItemTextActive
                      ]}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                      {selectedFilter === option && (
                        <Ionicons name="checkmark" size={16} color="#C9A96D" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </BlurView>
            </View>
          )}
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
              onPress={() => router.push('/bookings')}
            >
              <Ionicons name="calendar" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="bookmark" size={22} color="#C9A96D" />
              <Text style={styles.dockLabelActive}>My Trips</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
            >
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
    backgroundColor: '#0E0E0E', // Simple solid color for iOS compatibility
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Simple solid overlay for iOS
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
    marginBottom: 20,
  },
  logoContainer: {
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 6px rgba(201,169,109,0.4))',
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
  // Removed unused styles: backButton, logoText, pageTitleSection, pageTitle, profileButton, profileIcon
  stickyTabsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0D0D0D',
    zIndex: 1000,
  },
  stickyTabsBlur: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tabChips: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  dropdownMenu: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dropdownBlur: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  dropdownContent: {
    paddingVertical: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dropdownItemTextActive: {
    color: '#C9A96D',
    fontWeight: '600',
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
    borderRadius: 28, // Match parent radius
  },
  tabChipContentActive: {
    backgroundColor: 'rgba(201,169,109,0.15)', // Elegant light bronze fill for active state
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
    ...Platform.select({
      web: {
        // Further reduced brightness and contrast for more toned down appearance
        filter: 'brightness(0.78) contrast(0.72)',
      },
    }),
  },
  
  // Soft neutral grey veil overlay for subtle desaturation
  cardGreyVeilOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18,18,18,0.12)', // Reduced opacity for subtlety
    zIndex: 1,
  },
  
  // Enhanced vignette with depth (no blur)
  cardVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.12) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.08)',
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
  planTripButtonContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  planTripButton: {
    backgroundColor: 'rgba(201,169,109,0.25)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,169,109,0.3)',
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)',
      },
    }),
  },
  planTripButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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