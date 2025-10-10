import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Dimensions,
  Animated,
  StyleSheet,
  FlatList,
} from 'react-native'
import { router } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import TraveaWordmark from '../components/TraveaWordmark'

const { width, height } = Dimensions.get('window')

// Trip and destination interfaces
interface TripData {
  id: string
  title: string
  dates: string
  travelers: number
  days: number
  cities: number
  progress: number
  status: 'planning' | 'in-progress' | 'completed'
}

interface DestinationData {
  id: string
  city: string
  region: string
  tagline: string
  image: string
  transport: TransportInfo[]
  isCondeNastPick?: boolean
  isHiddenGem?: boolean
  modules: {
    stay: ModuleStatus
    move: ModuleStatus
    explore: ModuleStatus
    dine: ModuleStatus
  }
}

interface TransportInfo {
  icon: string
  time: string
}

interface ModuleStatus {
  status: 'not-set' | 'suggested' | 'saved' | 'booked'
  count?: number
  details?: string
}

// Mock active trip data
const mockActiveTrip: TripData = {
  id: 'summer-italy-2024',
  title: 'Summer in Italy',
  dates: 'June 8–14',
  travelers: 2,
  days: 7,
  cities: 2,
  progress: 0.4, // 40% complete
  status: 'planning'
}

// Mock destinations (will be populated from bookmarked items)
const mockDestinations: DestinationData[] = [
  {
    id: 'amalfi',
    city: 'Amalfi',
    region: 'Italy',
    tagline: 'Coastal drives & lemon air',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    transport: [{ icon: 'airplane-outline', time: '8h 30m' }],
    isCondeNastPick: true,
    modules: {
      stay: { status: 'not-set' },
      move: { status: 'not-set' },
      explore: { status: 'saved', count: 2 },
      dine: { status: 'not-set' }
    }
  },
  {
    id: 'santorini',
    city: 'Santorini',
    region: 'Greece',
    tagline: 'Whitewashed cliffs & wine',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg',
    transport: [{ icon: 'airplane-outline', time: '12h 20m' }],
    isHiddenGem: true,
    modules: {
      stay: { status: 'saved', details: 'Katikies Hotel' },
      move: { status: 'booked', details: 'Ferry booked' },
      explore: { status: 'saved', count: 3 },
      dine: { status: 'booked', count: 1, details: 'Selene Restaurant' }
    }
  }
]

export default function MyCanvas() {
  // const { bookmarkedItems } = useBookmarks()
  const bookmarkedItems: string[] = [] // Mock for now
  const [activeTrip, setActiveTrip] = useState<TripData>(mockActiveTrip)
  const [destinations, setDestinations] = useState<DestinationData[]>(mockDestinations)
  const [selectedDay, setSelectedDay] = useState(1)
  const scrollViewRef = useRef<ScrollView>(null)
  const progressAnim = useRef(new Animated.Value(0)).current

  // Animation on mount
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: activeTrip.progress,
      duration: 1200,
      useNativeDriver: false,
    }).start()
  }, [activeTrip.progress])

  // Get smart CTA text based on booking status
  const getSmartCTA = () => {
    // Logic for dynamic CTA based on what's missing
    if (activeTrip.progress < 0.3) {
      return "Find flights for JFK → NAP"
    } else if (activeTrip.progress < 0.6) {
      return "Choose stay in Amalfi"
    } else if (activeTrip.progress < 0.9) {
      return "Plan transport Amalfi → Rome"
    } else {
      return "Trip ready ✈︎"
    }
  }

  // Render booking hub pills
  const renderBookingHub = () => {
    const bookingItems = [
      { icon: 'airplane-outline', label: 'Flights', status: 'saved' as const },
      { icon: 'home-outline', label: 'Stays', status: 'not-set' as const },
      { icon: 'car-outline', label: 'Transport', status: 'not-set' as const },
      { icon: 'compass-outline', label: 'Experiences', status: 'saved' as const },
      { icon: 'restaurant-outline', label: 'Dining', status: 'not-set' as const }
    ]

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.bookingHubScroll}
        contentContainerStyle={styles.bookingHubContent}
      >
        {bookingItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bookingPill}
            activeOpacity={0.8}
          >
            <BlurView intensity={20} tint="light" style={styles.bookingPillBlur}>
              <View style={styles.bookingPillInner}>
                <Ionicons name={item.icon} size={18} color="#F8F8F8" />
                <Text style={styles.bookingPillLabel}>{item.label}</Text>
                <View style={[
                  styles.statusChip, 
                  styles[`statusChip${item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', '')}`]
                ]}>
                  <Text style={[
                    styles.statusChipText,
                    item.status === 'booked' && styles.statusChipTextBooked
                  ]}>
                    {item.status === 'not-set' ? 'Not set' : 
                     item.status === 'saved' ? 'Saved' : 'Booked'}
                  </Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }

  // Render destination city card
  const renderCityCard = (destination: DestinationData, index: number) => (
    <View key={destination.id} style={[styles.cityCard, { marginTop: index === 0 ? 0 : -12 }]}>
      <BlurView intensity={26} tint="dark" style={styles.cityCardBlur}>
        <View style={styles.cityCardInner}>
          {/* Hero Image */}
          <ImageBackground
            source={{ uri: destination.image }}
            style={styles.cityCardImage}
            imageStyle={styles.cityCardImageStyle}
          >
            {/* Soft neutral grey veil overlay */}
            <View style={styles.cityCardGreyVeilOverlay} />
            
            {/* Refined vignette with depth */}
            <View style={styles.cityCardImageOverlay} />
            
            {/* Bookmark Icon */}
            <View style={styles.cityCardBookmark}>
              <BlurView intensity={18} tint="light" style={styles.bookmarkBlur}>
                <Ionicons name="bookmark" size={16} color="#C9A96D" />
              </BlurView>
            </View>

            {/* Tags */}
            <View style={styles.cityCardTags}>
              {destination.isCondeNastPick && (
                <View style={styles.cityCardTag}>
                  <Text style={styles.cityCardTagText}>Condé Nast</Text>
                </View>
              )}
              {destination.isHiddenGem && (
                <View style={styles.cityCardTag}>
                  <Text style={styles.cityCardTagText}>Hidden Gem</Text>
                </View>
              )}
            </View>
          </ImageBackground>

          {/* City Info */}
          <View style={styles.cityCardContent}>
            <View style={styles.cityCardHeader}>
              <Text style={styles.cityCardTitle}>{destination.city}</Text>
              <View style={styles.regionTag}>
                <Text style={styles.regionTagText}>{destination.region}</Text>
              </View>
            </View>
            
            <Text style={styles.cityCardTagline}>{destination.tagline}</Text>
            
            {/* Transport Info */}
            <View style={styles.cityCardTransport}>
              {destination.transport.map((transport, idx) => (
                <View key={idx} style={styles.transportItem}>
                  <Ionicons name={transport.icon} size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.transportTime}>{transport.time}</Text>
                </View>
              ))}
            </View>

            {/* City Sub-Modules */}
            {renderCityModules(destination)}

            {/* CTA Button */}
            <TouchableOpacity style={styles.cityCTA} activeOpacity={0.8}>
              <BlurView intensity={20} tint="light" style={styles.cityCTABlur}>
                <Text style={styles.cityCTAText}>Plan Trip</Text>
                <Ionicons name="arrow-forward" size={16} color="#F8F8F8" />
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </View>
  )

  // Render city sub-modules (Stay, Move, Explore, Dine)
  const renderCityModules = (destination: DestinationData) => {
    const modules = [
      { key: 'stay', icon: 'home-outline', label: 'Stay', cta: 'Browse stays' },
      { key: 'move', icon: 'car-outline', label: 'Move', cta: 'Plan transport' },
      { key: 'explore', icon: 'compass-outline', label: 'Explore', cta: 'Add experiences' },
      { key: 'dine', icon: 'restaurant-outline', label: 'Dine', cta: 'Add dining' }
    ]

    return (
      <View style={styles.cityModules}>
        {modules.map((module) => {
          const moduleData = destination.modules[module.key as keyof typeof destination.modules]
          const needsAttention = (module.key === 'stay' || module.key === 'move') && moduleData.status === 'not-set'
          
          return (
            <TouchableOpacity
              key={module.key}
              style={[styles.cityModule, needsAttention && styles.cityModuleNeedsAttention]}
              activeOpacity={0.8}
            >
              <BlurView intensity={15} tint="dark" style={styles.cityModuleBlur}>
                <View style={styles.cityModuleInner}>
                  <View style={styles.cityModuleLeft}>
                    <Ionicons name={module.icon} size={16} color="#F8F8F8" />
                    <Text style={styles.cityModuleLabel}>{module.label}</Text>
                    {moduleData.status === 'booked' && (
                      <Ionicons name="checkmark-circle" size={14} color="#C9A96D" />
                    )}
                  </View>
                  
                  <View style={styles.cityModuleRight}>
                    <Text style={styles.cityModuleCTA}>{module.cta}</Text>
                    <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.6)" />
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  // Render timeline bar
  const renderTimelineBar = () => {
    const days = Array.from({ length: activeTrip.days }, (_, i) => i + 1)
    
    return (
      <View style={styles.timelineBar}>
        <BlurView intensity={22} tint="dark" style={styles.timelineBarBlur}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.timelineScroll}
            contentContainerStyle={styles.timelineContent}
          >
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.timelineDay, selectedDay === day && styles.timelineDayActive]}
                onPress={() => setSelectedDay(day)}
                activeOpacity={0.8}
              >
                <Text style={[styles.timelineDayText, selectedDay === day && styles.timelineDayTextActive]}>
                  Day {day}
                </Text>
                <View style={styles.timelineProgress}>
                  <View style={[styles.timelineProgressDot, styles.timelineProgressDotFilled]} />
                  <View style={styles.timelineProgressDot} />
                  <View style={styles.timelineProgressDot} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BlurView>
      </View>
    )
  }

  return (
    <ImageBackground
      source={{
        uri: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/7685c7d9-489b-4dcd-97de-18a2f10d0c3d_2024-10-03_20-55-13.png'
      }}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Header */}
      <View style={styles.header}>
        <BlurView intensity={24} tint="dark" style={styles.headerBlur}>
          <View style={styles.headerInner}>
            {/* TRAVEA Logo */}
            <View style={styles.headerLeft}>
              <TraveaWordmark />
            </View>

            {/* Trip Selector */}
            <TouchableOpacity style={styles.tripSelector} activeOpacity={0.8}>
              <BlurView intensity={18} tint="light" style={styles.tripSelectorBlur}>
                <View style={styles.tripSelectorInner}>
                  <Text style={styles.tripSelectorText}>
                    {activeTrip.title.split(' ')[0]} & {activeTrip.title.split(' ')[2]} • {activeTrip.dates}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.8)" />
                </View>
              </BlurView>
            </TouchableOpacity>

            {/* Profile & Chat */}
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.chatOrb} activeOpacity={0.8}>
                <BlurView intensity={20} tint="light" style={styles.chatOrbBlur}>
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#F8F8F8" />
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.profileAvatar} activeOpacity={0.8}>
                <BlurView intensity={20} tint="light" style={styles.profileAvatarBlur}>
                  <Ionicons name="person-outline" size={18} color="#F8F8F8" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Trip Overview */}
        <View style={styles.heroSection}>
          <BlurView intensity={26} tint="dark" style={styles.heroBlur}>
            <View style={styles.heroInner}>
              {/* Trip Title & Info */}
              <Text style={styles.heroTitle}>{activeTrip.title}</Text>
              <Text style={styles.heroSubtext}>
                {activeTrip.travelers} Travelers • {activeTrip.days} Days • {activeTrip.cities} Cities
              </Text>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <Animated.View 
                    style={[
                      styles.progressFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        })
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {Math.round(activeTrip.progress * 100)}% Complete
                </Text>
              </View>

              {/* Booking Hub */}
              <Text style={styles.bookingHubTitle}>Booking Hub</Text>
              {renderBookingHub()}

              {/* Smart CTA */}
              <TouchableOpacity style={styles.smartCTA} activeOpacity={0.8}>
                <BlurView intensity={20} tint="light" style={styles.smartCTABlur}>
                  <Text style={styles.smartCTAText}>{getSmartCTA()}</Text>
                  <Ionicons name="arrow-forward" size={18} color="#C9A96D" />
                </BlurView>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* City Stack */}
        <View style={styles.cityStack}>
          {destinations.map((destination, index) => renderCityCard(destination, index))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Timeline Bar */}
      {renderTimelineBar()}

      {/* Bottom Dock */}
      <View style={styles.dock}>
        <BlurView intensity={28} tint="dark" style={styles.dockBlur}>
          <View style={styles.dockInner}>
            <TouchableOpacity 
              style={styles.dockItem} 
              onPress={() => router.push('/landing')}
              activeOpacity={0.8}
            >
              <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
            >
              <Ionicons name="brush" size={22} color="#C9A96D" />
              <Text style={[styles.dockText, styles.dockTextActive]}>Trip Canvas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              onPress={() => router.push('/trips')}
              activeOpacity={0.8}
            >
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockText}>My Trips</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockText}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  
  // Header Styles
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: Platform.select({ ios: 50, android: 40, web: 20 }),
  },
  headerBlur: {
    borderRadius: 0,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  tripSelector: {
    flex: 2,
    marginHorizontal: 12,
  },
  tripSelectorBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tripSelectorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tripSelectorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F8F8F8',
    marginRight: 8,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chatOrb: {
    marginRight: 12,
  },
  chatOrbBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  profileAvatar: {
    // Profile avatar styles
  },
  profileAvatarBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.select({ ios: 120, android: 110, web: 100 }),
    paddingHorizontal: 20,
  },

  // Hero Section
  heroSection: {
    marginBottom: 32,
  },
  heroBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 28px rgba(0,0,0,0.35)',
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 8,
      },
    }),
  },
  heroInner: {
    padding: 24,
    backgroundColor: 'rgba(25,25,25,0.40)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 8,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  heroSubtext: {
    fontSize: 16,
    color: 'rgba(248,248,248,0.85)',
    marginBottom: 20,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // Progress Bar
  progressContainer: {
    marginBottom: 24,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9A96D',
    borderRadius: 3,
    ...Platform.select({
      web: {
        background: 'linear-gradient(90deg, #C9A96D 0%, #D4B477 100%)',
      },
    }),
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(248,248,248,0.7)',
    textAlign: 'center',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter', 
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // Booking Hub
  bookingHubTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 16,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bookingHubScroll: {
    marginBottom: 24,
  },
  bookingHubContent: {
    paddingRight: 20,
  },
  bookingPill: {
    marginRight: 12,
  },
  bookingPillBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bookingPillInner: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    minWidth: 90,
  },
  bookingPillLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F8F8F8',
    marginTop: 6,
    marginBottom: 8,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // Status Chips
  statusChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  statusChipNotset: {
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  statusChipSaved: {
    backgroundColor: 'rgba(255,255,255,0.90)',
  },
  statusChipBooked: {
    backgroundColor: 'rgba(201,169,109,0.25)',
    borderWidth: 1,
    borderColor: '#C9A96D',
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#121212',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  statusChipTextBooked: {
    color: '#F8F8F8',
  },

  // Smart CTA
  smartCTA: {
    alignSelf: 'flex-end',
  },
  smartCTABlur: {
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(201,169,109,0.25)',
  },
  smartCTAText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8F8F8',
    marginRight: 8,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal', 
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // City Stack
  cityStack: {
    marginBottom: 32,
  },
  cityCard: {
    marginBottom: 24,
  },
  cityCardBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 10,
      },
    }),
  },
  cityCardInner: {
    backgroundColor: 'rgba(25,25,25,0.40)',
  },
  cityCardImage: {
    height: 180,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 16,
  },
  cityCardImageStyle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      web: {
        // More prominent brightness and contrast reduction
        filter: 'brightness(0.85) contrast(0.80)',
      },
    }),
  },
  
  // Soft neutral grey veil overlay for subtle desaturation
  cityCardGreyVeilOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,18,18,0.12)', // Reduced opacity for subtlety
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 1,
  },
  
  // Enhanced vignette with depth (no blur)
  cityCardImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 2,
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.12) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.20)',
      },
    }),
  },
  cityCardBookmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  bookmarkBlur: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cityCardTags: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
  },
  cityCardTag: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  cityCardTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // City Card Content
  cityCardContent: {
    padding: 20,
  },
  cityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityCardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    marginRight: 12,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  regionTag: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  regionTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F8F8F8',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  cityCardTagline: {
    fontSize: 16,
    color: 'rgba(248,248,248,0.85)',
    marginBottom: 12,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  cityCardTransport: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  transportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  transportTime: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 6,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // City Modules
  cityModules: {
    marginBottom: 16,
  },
  cityModule: {
    marginBottom: 8,
  },
  cityModuleNeedsAttention: {
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(201,169,109,0.3)',
      },
      default: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  cityModuleBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cityModuleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(15,15,15,0.40)',
  },
  cityModuleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cityModuleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F8F8F8',
    marginLeft: 10,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  cityModuleRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityModuleCTA: {
    fontSize: 12,
    color: 'rgba(248,248,248,0.7)',
    marginRight: 6,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // City CTA
  cityCTA: {
    alignSelf: 'flex-end',
  },
  cityCTABlur: {
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(201,169,109,0.25)',
  },
  cityCTAText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8F8F8',
    marginRight: 8,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // Timeline Bar
  timelineBar: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  timelineBarBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  timelineScroll: {
    // No additional styles needed
  },
  timelineContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timelineDay: {
    alignItems: 'center',
    marginRight: 24,
  },
  timelineDayActive: {
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(201,169,109,0.4)',
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
  timelineDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.7)',
    marginBottom: 6,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  timelineDayTextActive: {
    color: '#C9A96D',
  },
  timelineProgress: {
    flexDirection: 'row',
  },
  timelineProgressDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 1,
  },
  timelineProgressDotFilled: {
    backgroundColor: '#C9A96D',
  },

  // Bottom Dock
  dock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.select({ ios: 30, android: 20, web: 20 }),
  },
  dockBlur: {
    borderRadius: 0,
  },
  dockInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(15,15,15,0.45)',
  },
  dockItem: {
    alignItems: 'center',
    flex: 1,
  },
  dockText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockTextActive: {
    color: '#C9A96D',
  },
})