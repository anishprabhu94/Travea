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

// Mock saved destinations data - in real app, this would come from state/storage
const mockSavedDestinations: SavedDestination[] = [
  {
    id: 'inspire_curated_amalfi_0',
    city: 'Amalfi',
    region: 'Italy',
    tagline: 'Coastal drives & lemon air',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    transport: [
      { icon: 'car-outline', time: '2h 45m' },
      { icon: 'airplane-outline', time: '1h 20m' }
    ],
    sourceCarousel: 'Curated for You',
    sourceTab: 'Vacations',
    isCondeNastPick: true
  },
  {
    id: 'inspire_trending_kyoto_1',
    city: 'Kyoto',
    region: 'Japan',
    tagline: 'Temples, lanterns & still mornings',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    transport: [
      { icon: 'airplane-outline', time: '11h 30m' },
      { icon: 'train-outline', time: '3h 15m' }
    ],
    sourceCarousel: 'Trending Now',
    sourceTab: 'Vacations'
  },
  {
    id: 'weekend_slow_sonoma_0',
    city: 'Sonoma',
    region: 'USA',
    tagline: 'Wine alleys & golden light',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg',
    transport: [
      { icon: 'car-outline', time: '1h 30m' }
    ],
    sourceCarousel: 'Slow Living',
    sourceTab: 'Discover'
  }
]

export default function MyTrips() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('saved') // Default to Saved
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>(mockSavedDestinations)
  
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
    setSavedDestinations(prev => prev.filter(dest => dest.id !== destinationId))
  }

  // Group saved destinations by their source carousel
  const getGroupedDestinations = () => {
    const groups: { [key: string]: SavedDestination[] } = {}
    
    savedDestinations.forEach(dest => {
      const groupKey = dest.sourceCarousel // Remove prefixes, just use carousel name
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(dest)
    })
    
    return groups
  }

  const renderSavedCard = (destination: SavedDestination, index: number, isOnlyCard: boolean) => (
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
              {/* Condé Nast Pick Badge */}
              {destination.isCondeNastPick && (
                <View style={styles.condeNastBadge}>
                  <BlurView intensity={18} tint="light" style={styles.condeNastBadgeBlur}>
                    <View style={styles.condeNastBadgeInner}>
                      <Text style={styles.condeNastBadgeText}>Condé Nast Pick</Text>
                    </View>
                  </BlurView>
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

              {/* Integrated Action Buttons */}
              <View style={styles.integratedActions}>
                <TouchableOpacity style={styles.primaryAction} activeOpacity={0.8}>
                  <Ionicons name="canvas-outline" size={16} color="rgba(255,255,255,0.9)" style={styles.actionIcon} />
                  <Text style={styles.primaryActionText}>Add to Canvas</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.secondaryAction} activeOpacity={0.8}>
                  <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.8)" style={styles.actionIcon} />
                  <Text style={styles.secondaryActionText}>Learn More</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
  )

  const renderSavedContent = () => {
    const groupedDestinations = getGroupedDestinations()
    
    if (Object.keys(groupedDestinations).length === 0) {
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
            <Text style={styles.placeholderSubtext}>Your active travel experiences will appear here</Text>
          </View>
        )}
        
        {activeTab === 'upcoming' && (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>Upcoming Trips</Text>
            <Text style={styles.placeholderSubtext}>Your planned adventures will show here</Text>
          </View>
        )}
      </Animated.View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Deep charcoal background
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
        backgroundColor: 'rgba(0,0,0,0.1)',
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
  titleContainer: {
    flex: 2,
    alignItems: 'flex-start',
  },
  pageTitleSection: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
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
    backgroundColor: 'rgba(60,60,60,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 0 15px rgba(0,0,0,0.3)',
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
    paddingBottom: 40,
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
  condeNastBadgeBlur: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  condeNastBadgeInner: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  condeNastBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
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
  integratedActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionIcon: {
    marginRight: 6,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,169,109,0.25)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)',
      },
    }),
  },
  primaryActionBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryActionInner: {
    backgroundColor: 'rgba(201,169,109,0.25)', // Frosted bronze
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.1)',
      },
    }),
  },
  primaryActionText: {
    fontSize: 15,
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
    borderRadius: 12,
    paddingVertical: 10,
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
    fontSize: 15,
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
})