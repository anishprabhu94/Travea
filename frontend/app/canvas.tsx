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
  TextInput,
} from 'react-native'
import { router } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import TraveaWordmark from '../components/TraveaWordmark'

const { width, height } = Dimensions.get('window')

// Trip Canvas Interfaces
interface TripData {
  id: string
  title: string
  dates: string
  state: 'Planning' | 'Planned' | 'Ongoing'
  progress: number
}

interface DayRange {
  id: string
  days: string
  city: string
  country: string
  dateRange: string
  image: string
  isExpanded: boolean
}

interface ActivityStatus {
  type: 'stay' | 'transport' | 'dining' | 'experiences'
  status: 'booked' | 'saved' | 'not-explored'
  label: string
  icon: string
  count?: number
}

interface CityPaneData extends DayRange {
  activities: ActivityStatus[]
}

// Mock Data
const mockTrip: TripData = {
  id: 'trip-1',
  title: 'Italian Coast Explorer',
  dates: 'Jun 8 – Jun 16, 2025',
  state: 'Planning',
  progress: 65,
}

const mockDayRanges: DayRange[] = [
  {
    id: 'range-1',
    days: 'Day 1–2',
    city: 'Amalfi',
    country: 'Italy',
    dateRange: 'Jun 8–9',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    isExpanded: false,
  },
  {
    id: 'range-2',
    days: 'Day 3–4',
    city: 'Florence',
    country: 'Italy',
    dateRange: 'Jun 10–11',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    isExpanded: false,
  },
  {
    id: 'range-3',
    days: 'Day 5–6',
    city: 'Rome',
    country: 'Italy',
    dateRange: 'Jun 12–13',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg',
    isExpanded: false,
  },
]

const mockActivities: { [key: string]: ActivityStatus[] } = {
  'range-1': [
    { type: 'stay', status: 'booked', label: 'Booked • Palazzo Avino', icon: 'bed-outline' },
    { type: 'transport', status: 'saved', label: '2 saved', icon: 'car-outline' },
    { type: 'dining', status: 'not-explored', label: 'Not explored', icon: 'restaurant-outline' },
    { type: 'experiences', status: 'saved', label: '3 saved', icon: 'ticket-outline' },
  ],
  'range-2': [
    { type: 'stay', status: 'saved', label: '1 saved', icon: 'bed-outline' },
    { type: 'transport', status: 'not-explored', label: 'Not explored', icon: 'train-outline' },
    { type: 'dining', status: 'not-explored', label: 'Not explored', icon: 'restaurant-outline' },
    { type: 'experiences', status: 'not-explored', label: 'Not explored', icon: 'ticket-outline' },
  ],
  'range-3': [
    { type: 'stay', status: 'not-explored', label: 'Not explored', icon: 'bed-outline' },
    { type: 'transport', status: 'not-explored', label: 'Not explored', icon: 'airplane-outline' },
    { type: 'dining', status: 'not-explored', label: 'Not explored', icon: 'restaurant-outline' },
    { type: 'experiences', status: 'not-explored', label: 'Not explored', icon: 'ticket-outline' },
  ],
}

export default function TripCanvas() {
  const [trip, setTrip] = useState<TripData>(mockTrip)
  const [dayRanges, setDayRanges] = useState<DayRange[]>(mockDayRanges)
  const [expandedRange, setExpandedRange] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const progressAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: trip.progress,
      duration: 1000,
      useNativeDriver: false,
    }).start()
  }, [trip.progress])

  const toggleRangeExpansion = (rangeId: string) => {
    setExpandedRange(expandedRange === rangeId ? null : rangeId)
  }

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'booked': return '#C9A96D'
      case 'saved': return 'transparent'
      case 'not-explored': return 'rgba(255,255,255,0.3)'
      default: return 'rgba(255,255,255,0.3)'
    }
  }

  const getStatusDotBorder = (status: string) => {
    return status === 'saved' ? '2px solid #C9A96D' : 'none'
  }

  const getCTAText = (activity: ActivityStatus) => {
    const typeMap = {
      'stay': 'stays',
      'transport': 'transport',
      'dining': 'restaurants',
      'experiences': 'experiences'
    }
    
    switch (activity.status) {
      case 'booked': return 'View booking'
      case 'saved': return `Review saved ${typeMap[activity.type]}`
      case 'not-explored': return `Browse ${typeMap[activity.type]}`
      default: return `Browse ${typeMap[activity.type]}`
    }
  }

  const handleNavigation = (destination: string) => {
    router.push(destination as any)
  }

  // Components
  const TripHeader = () => (
    <BlurView intensity={26} tint="dark" style={styles.tripHeader}>
      <View style={styles.tripHeaderInner}>
        {/* Logo and Profile */}
        <View style={styles.headerTop}>
          <View style={styles.logoContainer}>
            <TraveaWordmark />
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={28} color="#F8F8F8" />
          </TouchableOpacity>
        </View>

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={styles.tripTitleRow}>
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
          </View>
          
          <Text style={styles.tripDates}>{trip.dates}</Text>
          
          {/* State Pill */}
          <View style={[styles.statePill, trip.state === 'Ongoing' && styles.statePillActive]}>
            {trip.state === 'Ongoing' && <View style={styles.statePillGlow} />}
            <Text style={[styles.statePillText, trip.state === 'Ongoing' && styles.statePillTextActive]}>
              {trip.state}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
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
  )

  const DayScroller = () => (
    <BlurView intensity={24} tint="dark" style={styles.dayScroller}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.dayScrollerContent}
      >
        {dayRanges.map((range, index) => (
          <TouchableOpacity
            key={range.id}
            style={[styles.dayRangeButton, expandedRange === range.id && styles.dayRangeButtonActive]}
            onPress={() => toggleRangeExpansion(range.id)}
            activeOpacity={0.8}
          >
            {expandedRange === range.id && <View style={styles.dayRangeGlow} />}
            <Text style={[styles.dayRangeText, expandedRange === range.id && styles.dayRangeTextActive]}>
              {range.days} • {range.city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BlurView>
  )

  const ActivityCard = ({ activity, rangeId }: { activity: ActivityStatus, rangeId: string }) => (
    <BlurView intensity={22} tint="dark" style={styles.activityCard}>
      <View style={styles.activityCardInner}>
        {/* Icon and Status */}
        <View style={styles.activityHeader}>
          <Ionicons name={activity.icon as any} size={20} color="#F8F8F8" />
          <View style={styles.activityStatus}>
            <View 
              style={[
                styles.statusDot, 
                { 
                  backgroundColor: getStatusDotColor(activity.status),
                  borderWidth: activity.status === 'saved' ? 2 : 0,
                  borderColor: activity.status === 'saved' ? '#C9A96D' : 'transparent'
                }
              ]} 
            />
            <Text style={styles.activityLabel}>{activity.label}</Text>
          </View>
        </View>
        
        {/* CTA Button */}
        <TouchableOpacity style={styles.activityCTA}>
          <Text style={styles.activityCTAText}>{getCTAText(activity)}</Text>
        </TouchableOpacity>
        
        {/* Day Range Caption */}
        <Text style={styles.activityCaption}>
          Applies to {dayRanges.find(r => r.id === rangeId)?.days}
        </Text>
      </View>
    </BlurView>
  )

  const CityPane = ({ range }: { range: DayRange }) => {
    if (!expandedRange || expandedRange !== range.id) return null
    
    const activities = mockActivities[range.id] || []
    
    return (
      <Animated.View style={styles.cityPaneContainer}>
        <BlurView intensity={25} tint="dark" style={styles.cityPane}>
          <View style={styles.cityPaneInner}>
            {/* City Title */}
            <Text style={styles.cityTitle}>{range.city}, {range.country} — {range.dateRange}</Text>
            
            {/* Hero Image Strip */}
            <View style={styles.heroImageContainer}>
              <ImageBackground
                source={{ uri: range.image }}
                style={styles.heroImage}
                imageStyle={styles.heroImageStyle}
              >
                <View style={styles.heroImageOverlay} />
              </ImageBackground>
            </View>
            
            {/* Activity Grid */}
            <View style={styles.activityGrid}>
              {activities.map((activity, index) => (
                <ActivityCard key={index} activity={activity} rangeId={range.id} />
              ))}
            </View>
          </View>
        </BlurView>
      </Animated.View>
    )
  }

  const BookingHub = () => (
    <BlurView intensity={22} tint="dark" style={styles.bookingHub}>
      <View style={styles.bookingHubInner}>
        <Text style={styles.bookingHubTitle}>Quick Actions</Text>
        <View style={styles.bookingChips}>
          <TouchableOpacity style={styles.bookingChip}>
            <Ionicons name="airplane-outline" size={16} color="#F8F8F8" />
            <Text style={styles.bookingChipText}>Flights</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookingChip}>
            <Ionicons name="bed-outline" size={16} color="#F8F8F8" />
            <Text style={styles.bookingChipText}>Stays</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookingChip}>
            <Ionicons name="car-outline" size={16} color="#F8F8F8" />
            <Text style={styles.bookingChipText}>Transport</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  )

  const ProgressMarker = () => (
    <View style={styles.progressMarker}>
      <View style={styles.progressMarkerTrack}>
        <Animated.View 
          style={[
            styles.progressMarkerFill,
            {
              height: progressAnimation.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp'
              })
            }
          ]} 
        />
      </View>
    </View>
  )

  // Bottom Navigation Dock (same as other pages)
  const BottomDock = () => (
    <View style={styles.dockContainer}>
      <BlurView intensity={28} tint="dark" style={styles.dock}>
        <View style={styles.dockInner}>
          <TouchableOpacity 
            style={styles.dockItem} 
            onPress={() => handleNavigation('/landing')}
            activeOpacity={0.7}
          >
            <Ionicons name="compass-outline" size={24} color="rgba(255,255,255,0.6)" />
            <Text style={styles.dockLabel}>Discover</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockItem} 
            onPress={() => handleNavigation('/trips')}
            activeOpacity={0.7}
          >
            <Ionicons name="bookmark-outline" size={24} color="rgba(255,255,255,0.6)" />
            <Text style={styles.dockLabel}>My Trips</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dockItem, styles.dockItemActive]} 
            onPress={() => handleNavigation('/canvas')}
            activeOpacity={0.7}
          >
            <View style={styles.dockActiveGlow} />
            <Ionicons name="layers-outline" size={24} color="#C9A96D" />
            <Text style={[styles.dockLabel, styles.dockLabelActive]}>Trip Canvas</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Deep charcoal gradient background */}
      <View style={styles.backgroundGradient} />
      
      {/* Soft vignette overlay */}
      <View style={styles.vignetteOverlay} />
      
      {/* Progress Marker */}
      <ProgressMarker />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Trip Header */}
        <TripHeader />
        
        {/* Day Scroller */}
        <DayScroller />
        
        {/* Expanded City Pane */}
        {dayRanges.map(range => (
          <CityPane key={range.id} range={range} />
        ))}
        
        {/* Booking Hub */}
        <BookingHub />
        
        {/* Bottom padding for dock */}
        <View style={styles.bottomPadding} />
      </ScrollView>
      
      {/* Bottom Navigation Dock */}
      <BottomDock />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Deep charcoal base
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)',
      },
      default: {
        backgroundColor: '#121212',
      },
    }),
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.3) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  scrollContainer: {
    flex: 1,
  },

  // Trip Header
  tripHeader: {
    marginTop: Platform.OS === 'web' ? 0 : 44,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  tripHeaderInner: {
    padding: 24,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    // Consistent with landing page positioning
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tripInfo: {
    marginBottom: 16,
  },
  tripTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  tripTitleInput: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C9A96D',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  tripDates: {
    fontSize: 16,
    color: 'rgba(248,248,248,0.8)',
    marginBottom: 12,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  statePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    position: 'relative',
  },
  statePillActive: {
    backgroundColor: 'rgba(201,169,109,0.2)',
  },
  statePillGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  statePillText: {
    fontSize: 14,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  statePillTextActive: {
    color: '#C9A96D',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9A96D',
    borderRadius: 2,
  },

  // Day Scroller
  dayScroller: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dayScrollerContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  dayRangeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  dayRangeButtonActive: {
    backgroundColor: 'rgba(201,169,109,0.15)',
  },
  dayRangeGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  dayRangeText: {
    fontSize: 15,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dayRangeTextActive: {
    color: '#C9A96D',
  },

  // City Pane
  cityPaneContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  cityPane: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cityPaneInner: {
    padding: 24,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  cityTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 16,
    letterSpacing: 0.4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  heroImageContainer: {
    height: 120,
    marginBottom: 20,
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
        filter: 'brightness(0.78) contrast(0.72)',
      },
    }),
  },
  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18,18,18,0.12)',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Activity Cards
  activityCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activityCardInner: {
    padding: 16,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  activityLabel: {
    fontSize: 14,
    color: 'rgba(248,248,248,0.8)',
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  activityCTA: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 8,
  },
  activityCTAText: {
    fontSize: 13,
    color: '#F8F8F8',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  activityCaption: {
    fontSize: 12,
    color: 'rgba(248,248,248,0.65)',
    textAlign: 'center',
    letterSpacing: 0.1,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // Booking Hub
  bookingHub: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookingHubInner: {
    padding: 20,
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  bookingHubTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 12,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bookingChips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookingChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 4,
  },
  bookingChipText: {
    fontSize: 14,
    color: '#F8F8F8',
    fontWeight: '500',
    marginLeft: 8,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  // Progress Marker
  progressMarker: {
    position: 'absolute',
    right: 16,
    top: 100,
    bottom: 100,
    width: 4,
    zIndex: 1,
  },
  progressMarkerTrack: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressMarkerFill: {
    backgroundColor: '#C9A96D',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // Bottom Navigation Dock (consistent with other pages)
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
    ...Platform.select({
      web: {
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
      },
      default: {
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 16,
      },
    }),
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
    paddingHorizontal: 16,
    borderRadius: 16,
    position: 'relative',
  },
  dockItemActive: {
    backgroundColor: 'rgba(201,169,109,0.15)',
  },
  dockActiveGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  dockLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockLabelActive: {
    color: '#C9A96D',
  },
  bottomPadding: {
    height: 120,
  },
})