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
  TextInput,
} from 'react-native'
import { router } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import TraveaWordmark from '../components/TraveaWordmark'

const { width, height } = Dimensions.get('window')

// Enhanced Interfaces
interface TripData {
  id: string
  title: string
  dates: string
  startDate: string
  endDate: string
  state: 'Planning' | 'Planned' | 'Ongoing'
  progress: number
}

interface CitySegment {
  id: string
  days: string
  city: string
  country: string
  dateRange: string
  image: string
  nights: number
  startDay: number
  endDay: number
}

interface ActivityData {
  stay: { status: 'booked' | 'saved' | 'pending', detail?: string }
  transport: { status: 'booked' | 'saved' | 'pending', detail?: string, count?: number }
  restaurants: { status: 'booked' | 'saved' | 'pending', count?: number }
  experiences: { status: 'booked' | 'saved' | 'pending', count?: number }
}

interface TravelSegment {
  hasTravel: boolean
  type?: 'flight' | 'train' | 'car'
  route?: string
  status?: 'booked' | 'saved'
}

// Refined Mock Data
const mockTrip: TripData = {
  id: 'summer-italy-2025',
  title: 'Summer in Italy',
  dates: 'June 8 – 14, 2025',
  startDate: '2025-06-08',
  endDate: '2025-06-14',
  state: 'Planning',
  progress: 72,
}

const mockCitySegments: CitySegment[] = [
  {
    id: 'segment-amalfi',
    days: 'Day 1–2',
    city: 'Amalfi',
    country: 'Italy',
    dateRange: 'Jun 8–9',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    nights: 2,
    startDay: 1,
    endDay: 2,
  },
  {
    id: 'segment-florence',
    days: 'Day 3–4',
    city: 'Florence',
    country: 'Italy',  
    dateRange: 'Jun 10–11',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    nights: 2,
    startDay: 3,
    endDay: 4,
  },
  {
    id: 'segment-rome',
    days: 'Day 5–7',
    city: 'Rome',
    country: 'Italy',
    dateRange: 'Jun 12–14',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg',
    nights: 3,
    startDay: 5,
    endDay: 7,
  },
]

const mockActivities: { [key: string]: ActivityData } = {
  'segment-amalfi': {
    stay: { status: 'booked', detail: 'Palazzo Avino' },
    transport: { status: 'saved', count: 2 },
    restaurants: { status: 'pending' },
    experiences: { status: 'saved', count: 3 },
  },
  'segment-florence': {
    stay: { status: 'saved', count: 1 },
    transport: { status: 'pending' },
    restaurants: { status: 'pending' },
    experiences: { status: 'pending' },
  },
  'segment-rome': {
    stay: { status: 'pending' },
    transport: { status: 'pending' },
    restaurants: { status: 'saved', count: 2 },
    experiences: { status: 'booked', detail: 'Vatican Museums' },
  },
}

const mockTravelSegments: { [key: string]: TravelSegment } = {
  'segment-amalfi': {
    hasTravel: true,
    type: 'flight',
    route: 'Rome → Amalfi',
    status: 'booked',
  },
  'segment-florence': {
    hasTravel: true,
    type: 'train',
    route: 'Amalfi → Florence',
    status: 'saved',
  },
  'segment-rome': {
    hasTravel: false,
  },
}

export default function TripCanvas() {
  const [trip, setTrip] = useState<TripData>(mockTrip)
  const [segments, setSegments] = useState<CitySegment[]>(mockCitySegments)
  const [activeSegmentId, setActiveSegmentId] = useState<string>('segment-amalfi')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  
  const progressAnimation = useRef(new Animated.Value(0)).current
  const fadeAnimation = useRef(new Animated.Value(1)).current
  const scaleAnimation = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: trip.progress,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [trip.progress])

  const handleSegmentChange = (segmentId: string) => {
    if (segmentId === activeSegmentId) return

    // Smooth transition animation
    Animated.sequence([
      Animated.timing(fadeAnimation, {
        toValue: 0.8,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start()

    setActiveSegmentId(segmentId)
  }

  const handleCTAPress = (type: string, status: string) => {
    // Tactile bounce animation
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    // Handle routing based on type and status
    console.log(`CTA pressed: ${type} - ${status}`)
  }

  const getStatusText = (status: string, count?: number, detail?: string) => {
    if (status === 'booked' && detail) return 'Booked'
    if (status === 'saved' && count) return `${count} Saved`
    if (status === 'saved') return 'Saved'
    if (status === 'pending') return 'Pending'
    return 'Pending'
  }

  const getCTAText = (status: string) => {
    switch (status) {
      case 'booked': return 'View'
      case 'saved': return 'Review'  
      case 'pending': return 'Browse'
      default: return 'Browse'
    }
  }

  const getIconForActivity = (type: string, transportType?: 'flight' | 'train' | 'car') => {
    switch (type) {
      case 'stay': return 'bed-outline'
      case 'transport':
        if (transportType === 'flight') return 'airplane-outline'
        if (transportType === 'train') return 'train-outline'
        if (transportType === 'car') return 'car-outline'
        return 'car-outline'
      case 'restaurants': return 'restaurant-outline'
      case 'experiences': return 'ticket-outline'
      default: return 'help-outline'
    }
  }

  const activeSegment = segments.find(s => s.id === activeSegmentId)
  const activities = mockActivities[activeSegmentId] || {}
  const travelSegment = mockTravelSegments[activeSegmentId] || { hasTravel: false }

  // Components
  const TripHeader = () => (
    <View style={styles.headerContainer}>
      <BlurView intensity={26} tint="dark" style={styles.tripHeader}>
        <View style={styles.tripHeaderInner}>
          {/* Logo and Profile - Properly Spaced */}
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <TraveaWordmark />
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={26} color="#F8F8F8" />
            </TouchableOpacity>
          </View>

          {/* Trip Title */}
          <View style={styles.tripTitleContainer}>
            {isEditingTitle ? (
              <TextInput
                style={styles.tripTitleInput}
                value={trip.title}
                onChangeText={(text) => setTrip({ ...trip, title: text })}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={() => setIsEditingTitle(false)}
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditingTitle(true)}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
              </TouchableOpacity>
            )}
            
            <Text style={styles.tripDates}>{trip.dates}</Text>
            
            {/* State Pill */}
            <View style={[styles.statePill, trip.state === 'Ongoing' && styles.statePillGlow]}>
              <Text style={[styles.statePillText, trip.state === 'Ongoing' && styles.statePillTextActive]}>
                {trip.state}
              </Text>
            </View>
          </View>

          {/* Ambient Progress Bar */}
          {trip.state === 'Planning' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnimation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                        extrapolate: 'clamp'
                      })
                    }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>
      </BlurView>
    </View>
  )

  const DayScroller = () => (
    <View style={styles.scrollerContainer}>
      <BlurView intensity={26} tint="dark" style={styles.dayScroller}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollerContent}
        >
          {segments.map((segment) => (
            <TouchableOpacity
              key={segment.id}
              style={[
                styles.segmentCapsule,
                activeSegmentId === segment.id && styles.segmentCapsuleActive
              ]}
              onPress={() => handleSegmentChange(segment.id)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.segmentText,
                activeSegmentId === segment.id && styles.segmentTextActive
              ]}>
                {segment.days} {segment.city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BlurView>
    </View>
  )

  const CityPane = () => {
    if (!activeSegment) {
      console.log('No active segment found:', activeSegmentId)
      return null
    }
    console.log('Rendering city pane for:', activeSegment.city)

    return (
      <Animated.View 
        style={[
          styles.cityPaneContainer,
          { opacity: fadeAnimation }
        ]}
      >
        <BlurView intensity={26} tint="dark" style={styles.cityPane}>
          <View style={styles.cityPaneInner}>
            {/* City Header */}
            <Text style={styles.cityHeader}>
              {activeSegment.city}, {activeSegment.country} — {activeSegment.dateRange}
            </Text>

            {/* Hero Image */}
            <View style={styles.heroContainer}>
              <ImageBackground
                source={{ uri: activeSegment.image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                <View style={styles.heroOverlay} />
                <View style={styles.heroVignette} />
              </ImageBackground>
            </View>

            {/* Travel Row */}
            {travelSegment.hasTravel ? (
              <View style={styles.travelRow}>
                <View style={styles.travelInfo}>
                  <Ionicons 
                    name={getIconForActivity('transport', travelSegment.type) as any} 
                    size={16} 
                    color="#F8F8F8" 
                    style={styles.travelIcon}
                  />
                  <Text style={styles.travelText}>
                    Travel In: {travelSegment.route}
                  </Text>
                  <View style={[
                    styles.travelStatus,
                    travelSegment.status === 'booked' && styles.travelStatusBooked
                  ]}>
                    <Text style={styles.travelStatusText}>
                      {travelSegment.status === 'booked' ? 'Booked' : 'Saved'}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.addTravelRow}>
                <Ionicons name="airplane-outline" size={16} color="rgba(248,248,248,0.6)" />
                <Text style={styles.addTravelText}>Add flight for this segment →</Text>
              </TouchableOpacity>
            )}

            {/* Activity Grid */}
            <View style={styles.activityGrid}>
              {/* Stay Card */}
              <Animated.View style={[styles.activityCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={22} tint="light" style={styles.activityCardBlur}>
                  <View style={styles.activityCardInner}>
                    <Text style={styles.activityStatus}>
                      {getStatusText(activities.stay?.status, activities.stay?.count, activities.stay?.detail)}
                    </Text>
                    <View style={styles.activityCenter}>
                      <Ionicons name="bed-outline" size={24} color="#F8F8F8" />
                      <Text style={styles.activityLabel}>Stay</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.activityCTA}
                      onPress={() => handleCTAPress('stay', activities.stay?.status)}
                    >
                      <Text style={styles.activityCTAText}>
                        {getCTAText(activities.stay?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Transport Card */}
              <Animated.View style={[styles.activityCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={22} tint="light" style={styles.activityCardBlur}>
                  <View style={styles.activityCardInner}>
                    <Text style={styles.activityStatus}>
                      {getStatusText(activities.transport?.status, activities.transport?.count)}
                    </Text>
                    <View style={styles.activityCenter}>
                      <Ionicons name="car-outline" size={24} color="#F8F8F8" />
                      <Text style={styles.activityLabel}>Transport</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.activityCTA}
                      onPress={() => handleCTAPress('transport', activities.transport?.status)}
                    >
                      <Text style={styles.activityCTAText}>
                        {getCTAText(activities.transport?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Restaurants Card */}
              <Animated.View style={[styles.activityCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={22} tint="light" style={styles.activityCardBlur}>
                  <View style={styles.activityCardInner}>
                    <Text style={styles.activityStatus}>
                      {getStatusText(activities.restaurants?.status, activities.restaurants?.count)}
                    </Text>
                    <View style={styles.activityCenter}>
                      <Ionicons name="restaurant-outline" size={24} color="#F8F8F8" />
                      <Text style={styles.activityLabel}>Restaurants</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.activityCTA}
                      onPress={() => handleCTAPress('restaurants', activities.restaurants?.status)}
                    >
                      <Text style={styles.activityCTAText}>
                        {getCTAText(activities.restaurants?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Experiences Card */}
              <Animated.View style={[styles.activityCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={22} tint="light" style={styles.activityCardBlur}>
                  <View style={styles.activityCardInner}>
                    <Text style={styles.activityStatus}>
                      {getStatusText(activities.experiences?.status, activities.experiences?.count, activities.experiences?.detail)}
                    </Text>
                    <View style={styles.activityCenter}>
                      <Ionicons name="ticket-outline" size={24} color="#F8F8F8" />
                      <Text style={styles.activityLabel}>Experiences</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.activityCTA}
                      onPress={() => handleCTAPress('experiences', activities.experiences?.status)}
                    >
                      <Text style={styles.activityCTAText}>
                        {getCTAText(activities.experiences?.status)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    )
  }

  const BookingHub = () => (
    <View style={styles.bookingHubContainer}>
      <BlurView intensity={26} tint="dark" style={styles.bookingHub}>
        <View style={styles.bookingHubInner}>
          <Text style={styles.bookingHubTitle}>Booking Hub</Text>
          
          <View style={styles.bookingChips}>
            <TouchableOpacity style={styles.bookingChip}>
              <Ionicons name="airplane-outline" size={16} color="#F8F8F8" />
              <Text style={styles.bookingChipText}>Flights — 2 Booked</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookingChip}>
              <Ionicons name="bed-outline" size={16} color="#F8F8F8" />
              <Text style={styles.bookingChipText}>Stays — 2 of 3 Booked</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.bookingChip}>
              <Ionicons name="car-outline" size={16} color="#F8F8F8" />
              <Text style={styles.bookingChipText}>Transport — 1 Saved</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.continueCTA}>
            <Text style={styles.continueCTAText}>Continue planning your trip →</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  )

  // Bottom Navigation
  const BottomDock = () => (
    <View style={styles.dockContainer}>
      <BlurView intensity={28} tint="dark" style={styles.dock}>
        <View style={styles.dockInner}>
          <TouchableOpacity 
            style={styles.dockItem} 
            onPress={() => router.push('/landing')}
          >
            <Ionicons name="compass-outline" size={24} color="rgba(255,255,255,0.6)" />
            <Text style={styles.dockLabel}>Discover</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockItem} 
            onPress={() => router.push('/trips')}
          >
            <Ionicons name="bookmark-outline" size={24} color="rgba(255,255,255,0.6)" />
            <Text style={styles.dockLabel}>My Trips</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.dockItem, styles.dockItemActive]}>
            <View style={styles.dockGlow} />
            <Ionicons name="layers-outline" size={24} color="#C9A96D" />
            <Text style={[styles.dockLabel, styles.dockLabelActive]}>Trip Canvas</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Deep charcoal background with center vignette */}
      <View style={styles.backgroundGradient} />
      <View style={styles.centerVignette} />
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TripHeader />
        <DayScroller />
        <CityPane />
        <BookingHub />
        
        {/* Bottom padding for dock */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <BottomDock />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121212',
  },
  centerVignette: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.4) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Trip Header - Properly Spaced
  headerContainer: {
    paddingTop: Platform.OS === 'web' ? 24 : 54,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  tripHeader: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  tripHeaderInner: {
    padding: 28,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32, // Generous spacing to avoid congestion
  },
  logoContainer: {
    // Clean spacing for logo
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tripTitleContainer: {
    alignItems: 'flex-start',
  },
  tripTitle: {
    fontSize: 32,
    fontWeight: '500', // Medium weight as requested
    color: 'rgba(248,248,248,0.9)', // 90% opacity for headings
    letterSpacing: 0.6, // Slight spacing for elegance
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  tripTitleInput: {
    fontSize: 32,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9A96D',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  tripDates: {
    fontSize: 16,
    color: 'rgba(248,248,248,0.8)', // 80% opacity for body text
    letterSpacing: 0.4,
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  statePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
  },
  statePillGlow: {
    backgroundColor: 'rgba(201,169,109,0.15)',
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  statePillText: {
    fontSize: 14,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  statePillTextActive: {
    color: '#C9A96D',
  },
  progressContainer: {
    marginTop: 0,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9A96D',
    borderRadius: 1,
  },

  // Day Scroller - Sticky and Elegant
  scrollerContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  dayScroller: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  scrollerContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  segmentCapsule: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  segmentCapsuleActive: {
    backgroundColor: 'rgba(201,169,109,0.15)',
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  segmentText: {
    fontSize: 15,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  segmentTextActive: {
    color: '#C9A96D',
  },

  // City Pane - Refined and Serene
  cityPaneContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  cityPane: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cityPaneInner: {
    padding: 32,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  cityHeader: {
    fontSize: 24,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.5,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Hero Image with Refined Processing
  heroContainer: {
    height: 140,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    flex: 1,
  },
  heroImageStyle: {
    borderRadius: 16,
    ...Platform.select({
      web: {
        // Slightly desaturated, reduced brightness and contrast as specified
        filter: 'brightness(0.95) contrast(0.95) saturate(0.9)',
      },
    }),
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,18,18,0.06)', // Subtle overlay
  },
  heroVignette: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(201,169,109,0.1) 100%)',
      },
      default: {
        backgroundColor: 'rgba(201,169,109,0.05)',
      },
    }),
  },

  // Travel Row
  travelRow: {
    marginBottom: 28,
  },
  travelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  travelIcon: {
    marginRight: 12,
  },
  travelText: {
    flex: 1,
    fontSize: 15,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  travelStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  travelStatusBooked: {
    backgroundColor: 'rgba(201,169,109,0.2)',
  },
  travelStatusText: {
    fontSize: 12,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  addTravelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 28,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  addTravelText: {
    fontSize: 15,
    color: 'rgba(248,248,248,0.6)',
    marginLeft: 12,
    fontWeight: '400',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Activity Grid - Clean 2x2 Layout
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activityCardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  activityCardInner: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.06)', // Subtle frosted background
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'space-between',
  },
  activityStatus: {
    fontSize: 13,
    color: 'rgba(248,248,248,0.7)',
    fontWeight: '400',
    letterSpacing: 0.2,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  activityCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  activityLabel: {
    fontSize: 16,
    color: 'rgba(248,248,248,0.9)',
    fontWeight: '500',
    marginTop: 12,
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  activityCTA: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(201,169,109,0.15)',
  },
  activityCTAText: {
    fontSize: 13,
    color: '#C9A96D',
    fontWeight: '500',
    letterSpacing: 0.2,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Booking Hub
  bookingHubContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  bookingHub: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  bookingHubInner: {
    padding: 32,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  bookingHubTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#C9A96D', // Bronze header text as specified
    letterSpacing: 0.4,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  bookingChips: {
    marginBottom: 24,
  },
  bookingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
  },
  bookingChipText: {
    fontSize: 15,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '400',
    marginLeft: 16,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  continueCTA: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    backgroundColor: 'rgba(201,169,109,0.15)',
    alignItems: 'center',
  },
  continueCTAText: {
    fontSize: 16,
    color: '#C9A96D',
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom Navigation Dock
  dockContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  dock: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  dockInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  dockItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    position: 'relative',
  },
  dockItemActive: {
    backgroundColor: 'rgba(201,169,109,0.1)',
  },
  dockGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dockLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontWeight: '400',
    letterSpacing: 0.1,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Inter',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  dockLabelActive: {
    color: '#C9A96D',
  },
  bottomPadding: {
    height: 120,
  },
})