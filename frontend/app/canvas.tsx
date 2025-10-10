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
  dates: 'June 8 – 14, 2025 • 2 Travelers',
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
    stay: { status: 'booked' },
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
    restaurants: { status: 'pending' },
    experiences: { status: 'saved', count: 3 },
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeView, setActiveView] = useState<'booking' | 'journey'>('booking')
  
  const progressAnimation = useRef(new Animated.Value(0)).current
  const fadeAnimation = useRef(new Animated.Value(1)).current
  const scaleAnimation = useRef(new Animated.Value(1)).current
  const dropdownAnimation = useRef(new Animated.Value(0)).current
  const pulseAnimation = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: trip.progress,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [trip.progress])

  // Pulse animation for trip-map line
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.08,
          duration: 2000,
          useNativeDriver: true,
          easing: (t) => t * (2 - t), // ease-in-out
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: (t) => t * (2 - t),
        }),
      ])
    )
    pulseLoop.start()
    return () => pulseLoop.stop()
  }, [])

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
    if (status === 'booked') return 'Booked'
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
      <BlurView intensity={30} tint="dark" style={styles.tripHeader}>
        <View style={styles.tripHeaderInner}>
          {/* Logo and Profile - Same positions */}
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <TraveaWordmark />
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={26} color="#F8F8F8" />
            </TouchableOpacity>
          </View>

          {/* Trip Info Block */}
          <View style={styles.tripInfoBlock}>
            {/* Large elegant title with emoji */}
            <Text style={styles.tripTitleLarge}>Summer in Italy 🇮🇹</Text>
            
            {/* Subtext line */}
            <Text style={styles.tripSubtext}>June 8–14, 2025 • 2 Travelers</Text>
            
            {/* Status Dropdown */}
            <TouchableOpacity 
              style={styles.statusDropdownButton}
              onPress={() => {
                setIsDropdownOpen(!isDropdownOpen)
                Animated.spring(dropdownAnimation, {
                  toValue: isDropdownOpen ? 0 : 1,
                  tension: 80,
                  friction: 12,
                  useNativeDriver: true,
                }).start()
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.statusDropdownText}>{trip.state}</Text>
              <Animated.View style={{ 
                transform: [{ 
                  rotate: dropdownAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg']
                  })
                }] 
              }}>
                <Ionicons name="chevron-down" size={16} color="rgba(248,248,248,0.8)" />
              </Animated.View>
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <Animated.View 
                style={[
                  styles.statusDropdownMenu,
                  {
                    opacity: dropdownAnimation,
                    transform: [{
                      translateY: dropdownAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0]
                      })
                    }]
                  }
                ]}
              >
                <BlurView intensity={40} tint="dark" style={styles.dropdownMenuBlur}>
                  <TouchableOpacity 
                    style={styles.dropdownOption}
                    onPress={() => {
                      setTrip({ ...trip, state: 'Ongoing' })
                      setIsDropdownOpen(false)
                    }}
                  >
                    <View style={[styles.statusDot, styles.statusDotOngoing]} />
                    <Text style={styles.dropdownOptionText}>Ongoing</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.dropdownSeparator} />
                  
                  <TouchableOpacity 
                    style={styles.dropdownOption}
                    onPress={() => {
                      setTrip({ ...trip, state: 'Planning' })
                      setIsDropdownOpen(false)
                    }}
                  >
                    <View style={[styles.statusDot, styles.statusDotPlanning]} />
                    <Text style={styles.dropdownOptionText}>Planning</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.dropdownSeparator} />
                  
                  <TouchableOpacity 
                    style={styles.dropdownOption}
                    onPress={() => {
                      setTrip({ ...trip, state: 'Completed' })
                      setIsDropdownOpen(false)
                    }}
                  >
                    <View style={[styles.statusDot, styles.statusDotCompleted]} />
                    <Text style={styles.dropdownOptionText}>Completed</Text>
                  </TouchableOpacity>
                </BlurView>
              </Animated.View>
            )}
          </View>
        </View>
      </BlurView>
    </View>
  )

  // Orbit Path - Semi-circular journey visualization
  const OrbitPath = () => {
    const destinations = [
      { name: 'Rome', status: 'booked' },
      { name: 'Amalfi', status: 'booked' },
      { name: 'Florence', status: 'booked' },
      { name: 'Venice', status: 'saved' },
      { name: 'Milan', status: 'pending' },
    ]

    return (
      <View style={styles.orbitPathContainer}>
        {/* Semi-circular arc background */}
        <View style={styles.orbitArcContainer}>
          <Animated.View style={[styles.orbitArc, { opacity: pulseAnimation }]} />
          
          {/* Destination orbs positioned along the arc */}
          <View style={styles.orbsContainer}>
            {destinations.map((dest, index) => {
              const totalOrbs = destinations.length
              const position = (index / (totalOrbs - 1)) * 100 // 0% to 100%
              
              return (
                <View
                  key={dest.name}
                  style={[
                    styles.orbPosition,
                    { left: `${position}%` }
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.orb,
                      dest.status === 'booked' && styles.orbBooked,
                      dest.status === 'saved' && styles.orbSaved,
                      dest.status === 'pending' && styles.orbPending,
                      index === 2 && { opacity: pulseAnimation }, // Active orb breathing
                    ]}
                  />
                </View>
              )
            })}
          </View>
          
          {/* Motion shimmer particle */}
          <Animated.View style={[styles.shimmerParticle, { opacity: pulseAnimation }]} />
        </View>
      </View>
    )
  }

  // View Toggle
  const ViewToggle = () => (
    <View style={styles.viewToggleContainer}>
      <View style={styles.viewToggleInner}>
        <TouchableOpacity 
          style={[
            styles.togglePill,
            activeView === 'booking' && styles.togglePillActive
          ]}
          onPress={() => setActiveView('booking')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.togglePillText,
            activeView === 'booking' && styles.togglePillTextActive
          ]}>
            Booking Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.togglePill,
            activeView === 'journey' && styles.togglePillActive
          ]}
          onPress={() => setActiveView('journey')}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.togglePillText,
            activeView === 'journey' && styles.togglePillTextActive
          ]}>
            Trip Journey
          </Text>
        </TouchableOpacity>
      </View>
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
                {segment.days}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BlurView>
    </View>
  )

  const CityPane = () => {
    if (!activeSegment) return null

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
              {activeSegment.city}, {activeSegment.country} • {activeSegment.dateRange}
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
                    {travelSegment.route}
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

            {/* Redesigned Activity Grid - Circular Arrow + Status Line Layout */}
            <View style={styles.activityGrid}>
              {/* Smooth dark gradient background */}
              <View style={styles.calmLobbyBackdrop} />
              
              {/* Stay Card */}
              <Animated.View style={[styles.modernCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={35} tint="light" style={styles.modernCardBlur}>
                  <View style={styles.modernCardInner}>
                    {/* Top-right circular arrow icon */}
                    <TouchableOpacity 
                      style={styles.circularArrow}
                      onPress={() => handleCTAPress('stay', activities.stay?.status)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.arrowIconContainer}>
                        <Ionicons name="arrow-forward" size={13} color="#F8F8F8" style={styles.arrowIcon} />
                      </View>
                    </TouchableOpacity>
                    
                    {/* Center: icon and label */}
                    <View style={styles.centerContent}>
                      <View style={styles.categoryIconContainer}>
                        <Ionicons name="bed-outline" size={28} color="#F8F8F8" style={styles.categoryIcon} />
                      </View>
                      <Text style={styles.categoryLabel}>Stay</Text>
                    </View>
                    
                    {/* Bottom: status pill and colored line */}
                    <View style={styles.bottomSection}>
                      <View style={styles.statusPillContainer}>
                        <View style={[
                          styles.statusPill,
                          activities.stay?.status === 'booked' && styles.pillBooked,
                          activities.stay?.status === 'saved' && styles.pillSaved,
                          activities.stay?.status === 'pending' && styles.pillPending
                        ]}>
                          <Text style={styles.statusPillText}>
                            {getStatusText(activities.stay?.status, activities.stay?.count)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={[
                        styles.statusLine,
                        activities.stay?.status === 'booked' && styles.lineBooked,
                        activities.stay?.status === 'saved' && styles.lineSaved,
                        activities.stay?.status === 'pending' && styles.linePending
                      ]} />
                    </View>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Transport Card */}
              <Animated.View style={[styles.modernCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={35} tint="light" style={styles.modernCardBlur}>
                  <View style={styles.modernCardInner}>
                    <TouchableOpacity 
                      style={styles.circularArrow}
                      onPress={() => handleCTAPress('transport', activities.transport?.status)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.arrowIconContainer}>
                        <Ionicons name="arrow-forward" size={13} color="#F8F8F8" style={styles.arrowIcon} />
                      </View>
                    </TouchableOpacity>
                    
                    <View style={styles.centerContent}>
                      <View style={styles.categoryIconContainer}>
                        <Ionicons name="car-outline" size={28} color="#F8F8F8" style={styles.categoryIcon} />
                      </View>
                      <Text style={styles.categoryLabel}>Transport</Text>
                    </View>
                    
                    <View style={styles.bottomSection}>
                      <View style={styles.statusPillContainer}>
                        <View style={[
                          styles.statusPill,
                          activities.transport?.status === 'booked' && styles.pillBooked,
                          activities.transport?.status === 'saved' && styles.pillSaved,
                          activities.transport?.status === 'pending' && styles.pillPending
                        ]}>
                          <Text style={styles.statusPillText}>
                            {getStatusText(activities.transport?.status, activities.transport?.count)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={[
                        styles.statusLine,
                        activities.transport?.status === 'booked' && styles.lineBooked,
                        activities.transport?.status === 'saved' && styles.lineSaved,
                        activities.transport?.status === 'pending' && styles.linePending
                      ]} />
                    </View>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Restaurants Card */}
              <Animated.View style={[styles.modernCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={35} tint="light" style={styles.modernCardBlur}>
                  <View style={styles.modernCardInner}>
                    <TouchableOpacity 
                      style={styles.circularArrow}
                      onPress={() => handleCTAPress('restaurants', activities.restaurants?.status)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.arrowIconContainer}>
                        <Ionicons name="arrow-forward" size={13} color="#F8F8F8" style={styles.arrowIcon} />
                      </View>
                    </TouchableOpacity>
                    
                    <View style={styles.centerContent}>
                      <View style={styles.categoryIconContainer}>
                        <Ionicons name="restaurant-outline" size={28} color="#F8F8F8" style={styles.categoryIcon} />
                      </View>
                      <Text style={styles.categoryLabel}>Restaurants</Text>
                    </View>
                    
                    <View style={styles.bottomSection}>
                      <View style={styles.statusPillContainer}>
                        <View style={[
                          styles.statusPill,
                          activities.restaurants?.status === 'booked' && styles.pillBooked,
                          activities.restaurants?.status === 'saved' && styles.pillSaved,
                          activities.restaurants?.status === 'pending' && styles.pillPending
                        ]}>
                          <Text style={styles.statusPillText}>
                            {getStatusText(activities.restaurants?.status, activities.restaurants?.count)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={[
                        styles.statusLine,
                        activities.restaurants?.status === 'booked' && styles.lineBooked,
                        activities.restaurants?.status === 'saved' && styles.lineSaved,
                        activities.restaurants?.status === 'pending' && styles.linePending
                      ]} />
                    </View>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Experiences Card */}
              <Animated.View style={[styles.modernCard, { transform: [{ scale: scaleAnimation }] }]}>
                <BlurView intensity={35} tint="light" style={styles.modernCardBlur}>
                  <View style={styles.modernCardInner}>
                    <TouchableOpacity 
                      style={styles.circularArrow}
                      onPress={() => handleCTAPress('experiences', activities.experiences?.status)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.arrowIconContainer}>
                        <Ionicons name="arrow-forward" size={13} color="#F8F8F8" style={styles.arrowIcon} />
                      </View>
                    </TouchableOpacity>
                    
                    <View style={styles.centerContent}>
                      <View style={styles.categoryIconContainer}>
                        <Ionicons name="ticket-outline" size={28} color="#F8F8F8" style={styles.categoryIcon} />
                      </View>
                      <Text style={styles.categoryLabel}>Experiences</Text>
                    </View>
                    
                    <View style={styles.bottomSection}>
                      <View style={styles.statusPillContainer}>
                        <View style={[
                          styles.statusPill,
                          activities.experiences?.status === 'booked' && styles.pillBooked,
                          activities.experiences?.status === 'saved' && styles.pillSaved,
                          activities.experiences?.status === 'pending' && styles.pillPending
                        ]}>
                          <Text style={styles.statusPillText}>
                            {getStatusText(activities.experiences?.status, activities.experiences?.count)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={[
                        styles.statusLine,
                        activities.experiences?.status === 'booked' && styles.lineBooked,
                        activities.experiences?.status === 'saved' && styles.lineSaved,
                        activities.experiences?.status === 'pending' && styles.linePending
                      ]} />
                    </View>
                  </View>
                </BlurView>
              </Animated.View>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    )
  }

  // Booking Overview - 2×2 Grid
  const BookingHub = () => (
    <View style={styles.bookingOverviewContainer}>
      {/* 2x2 Grid */}
      <View style={styles.bookingGrid}>
        {/* Row 1 */}
        <View style={styles.bookingGridRow}>
          {/* Flights Tile */}
          <TouchableOpacity style={styles.bookingTile} activeOpacity={0.85}>
            <BlurView intensity={35} tint="light" style={styles.bookingTileBlur}>
              <View style={styles.bookingTileInner}>
                {/* Arrow circle top-right */}
                <View style={styles.tileArrowCircle}>
                  <Ionicons name="arrow-forward" size={12} color="#F8F8F8" style={{ opacity: 0.98 }} />
                </View>
                
                {/* Icon with glow */}
                <Ionicons name="airplane-outline" size={32} color="#F8F8F8" style={styles.tileIcon} />
                
                {/* Label */}
                <Text style={styles.tileLabel}>Flights</Text>
                
                {/* Horizontal progress band */}
                <View style={styles.tileProgressBand}>
                  <View style={[styles.tileProgressFill, styles.tileProgressBooked, { width: '100%' }]} />
                </View>
                
                {/* Ratio text */}
                <Text style={styles.tileRatioText}>2 of 2 Booked</Text>
                
                {/* Status pill */}
                <View style={[styles.tileStatusPill, styles.tileStatusBooked]}>
                  <Text style={styles.tileStatusText}>Booked</Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>

          {/* Stays Tile */}
          <TouchableOpacity style={styles.bookingTile} activeOpacity={0.85}>
            <BlurView intensity={35} tint="light" style={styles.bookingTileBlur}>
              <View style={styles.bookingTileInner}>
                <View style={styles.tileArrowCircle}>
                  <Ionicons name="arrow-forward" size={12} color="#F8F8F8" style={{ opacity: 0.98 }} />
                </View>
                
                <Ionicons name="bed-outline" size={32} color="#F8F8F8" style={styles.tileIcon} />
                <Text style={styles.tileLabel}>Stays</Text>
                
                <View style={styles.tileProgressBand}>
                  <View style={[styles.tileProgressFill, styles.tileProgressBooked, { width: '67%' }]} />
                </View>
                
                <Text style={styles.tileRatioText}>2 of 3 Booked</Text>
                
                <View style={[styles.tileStatusPill, styles.tileStatusBooked]}>
                  <Text style={styles.tileStatusText}>Booked</Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Row 2 */}
        <View style={styles.bookingGridRow}>
          {/* Transport Tile */}
          <TouchableOpacity style={styles.bookingTile} activeOpacity={0.85}>
            <BlurView intensity={35} tint="light" style={styles.bookingTileBlur}>
              <View style={styles.bookingTileInner}>
                <View style={styles.tileArrowCircle}>
                  <Ionicons name="arrow-forward" size={12} color="#F8F8F8" style={{ opacity: 0.98 }} />
                </View>
                
                <Ionicons name="car-outline" size={32} color="#F8F8F8" style={styles.tileIcon} />
                <Text style={styles.tileLabel}>Transport</Text>
                
                <View style={styles.tileProgressBand}>
                  <View style={[styles.tileProgressFill, styles.tileProgressSaved, { width: '50%' }]} />
                </View>
                
                <Text style={styles.tileRatioText}>1 of 2 Saved</Text>
                
                <View style={[styles.tileStatusPill, styles.tileStatusSaved]}>
                  <Text style={styles.tileStatusText}>Saved</Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>

          {/* Experiences Tile */}
          <TouchableOpacity style={styles.bookingTile} activeOpacity={0.85}>
            <BlurView intensity={35} tint="light" style={styles.bookingTileBlur}>
              <View style={styles.bookingTileInner}>
                <View style={styles.tileArrowCircle}>
                  <Ionicons name="arrow-forward" size={12} color="#F8F8F8" style={{ opacity: 0.98 }} />
                </View>
                
                <Ionicons name="ticket-outline" size={32} color="#F8F8F8" style={styles.tileIcon} />
                <Text style={styles.tileLabel}>Experiences</Text>
                
                <View style={styles.tileProgressBand}>
                  <View style={[styles.tileProgressFill, styles.tileProgressPending, { width: '0%' }]} />
                </View>
                
                <Text style={styles.tileRatioText}>0 of 5 Booked</Text>
                
                <View style={[styles.tileStatusPill, styles.tileStatusPending]}>
                  <Text style={styles.tileStatusText}>Pending</Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  // Bottom Navigation - Exactly matches landing.tsx
  const BottomDock = () => (
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

          <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
            <Ionicons name="brush" size={22} color="#C9A96D" />
            <Text style={styles.dockLabelActive}>Trip Canvas</Text>
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
        <OrbitPath />
        <ViewToggle />
        
        {/* Conditional rendering based on active view */}
        {activeView === 'booking' ? (
          <BookingHub />
        ) : (
          <>
            <DayScroller />
            {activeSegment && <CityPane />}
          </>
        )}
        
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
    padding: 20, // Reduced from 28 for more compact elegant look
    backgroundColor: 'rgba(25,25,25,0.42)',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align profile icon inline with logo
    marginBottom: 24, // Reduced for more compact header
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
  // Trip Info Block - Redesigned
  tripInfoBlock: {
    marginTop: 8,
  },
  
  tripTitleLarge: {
    fontSize: 28,
    fontWeight: '600',
    color: 'rgba(248,248,248,0.95)',
    letterSpacing: 0.4,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  tripSubtext: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(248,248,248,0.7)', // 70% opacity
    letterSpacing: 0.3,
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Status Dropdown Button
  statusDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.15)',
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  
  statusDropdownText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Dropdown Menu
  statusDropdownMenu: {
    position: 'absolute',
    top: 160,
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  dropdownMenuBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 12,
  },
  
  dropdownSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  
  dropdownOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Status Dots
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  statusDotOngoing: {
    backgroundColor: '#CBB88C', // Champagne gold
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(203,184,140,0.6)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
      },
    }),
  },
  
  statusDotPlanning: {
    backgroundColor: '#D6C7A1', // Sand beige
  },
  
  statusDotCompleted: {
    backgroundColor: '#AEBEA4', // Sage green
  },

  // Orbit Path - Semi-circular journey visualization
  orbitPathContainer: {
    paddingHorizontal: 24,
    marginTop: 28,
    marginBottom: 32,
    height: 80, // 1/3 of space allocation
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  orbitArcContainer: {
    width: '100%',
    height: 80,
    position: 'relative',
    alignItems: 'center',
  },
  
  orbitArc: {
    width: '90%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBB88C', // Golden arc
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(203,184,140,0.6)',
        background: 'linear-gradient(90deg, rgba(203,184,140,0.4) 0%, rgba(203,184,140,0.9) 50%, rgba(203,184,140,0.4) 100%)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
      },
    }),
  },
  
  orbsContainer: {
    position: 'absolute',
    width: '90%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  orbPosition: {
    position: 'absolute',
    marginLeft: -8, // Center the orb on its position
  },
  
  orb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  
  orbBooked: {
    backgroundColor: '#CBB88C', // Filled champagne gold
    borderColor: '#CBB88C',
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(203,184,140,0.8)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
    }),
  },
  
  orbSaved: {
    backgroundColor: 'transparent', // Hollow
    borderColor: '#D6C7A1', // Sand beige outline
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(214,199,161,0.6)',
      },
      default: {
        shadowColor: '#D6C7A1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
      },
    }),
  },
  
  orbPending: {
    backgroundColor: 'transparent', // Hollow
    borderColor: 'rgba(180,173,162,0.5)', // Faint warm gray
    borderWidth: 1,
  },
  
  shimmerParticle: {
    position: 'absolute',
    left: '45%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F8F8F8',
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(248,248,248,0.8)',
      },
      default: {
        shadowColor: '#F8F8F8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      },
    }),
  },

  // View Toggle Section - Refined and elegant
  viewToggleContainer: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  
  viewToggleInner: {
    flexDirection: 'row',
    gap: 12, // Refined spacing
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  togglePill: {
    flex: 1,
    paddingVertical: 11, // Reduced for more elegant proportions
    paddingHorizontal: 18, // Reduced for tighter look
    borderRadius: 18, // Smaller radius
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center', // Ensure vertical centering
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
  
  togglePillActive: {
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
  
  togglePillText: {
    fontSize: 14, // Reduced from 15 for elegance
    fontWeight: '500',
    color: 'rgba(248,248,248,0.7)',
    letterSpacing: 0.3,
    textAlign: 'center', // Ensure horizontal centering
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  togglePillTextActive: {
    color: '#CBB88C', // Champagne gold
    fontWeight: '600',
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

  // Redesigned Activity Grid - Circular Arrow + Status Line Layout
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 16,
  },
  
  // Smooth dark gradient background - calm lobby ambience
  calmLobbyBackdrop: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(32,32,32,0.03)', // Charcoal base
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, rgba(64,64,64,0.04) 0%, rgba(32,32,32,0.06) 100%)', // Charcoal → onyx
      },
    }),
  },
  
  // Modern frosted-glass cards - more compact and elegant
  modernCard: {
    width: '46%', // Reduced for more elegant proportions
    marginBottom: 16, // Tighter spacing
    borderRadius: 18, // Smaller radius for refined look
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 16px rgba(0,0,0,0.14)', // Softer shadow
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.16)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
        elevation: 5,
      },
    }),
  },
  
  modernCardBlur: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  
  modernCardInner: {
    backgroundColor: 'rgba(255,255,255,0.05)', // Refined transparency
    minHeight: 95, // Further reduced for almost-square proportions
    padding: 12, // Reduced padding for more compact look
    position: 'relative',
    ...Platform.select({
      web: {
        // Subtle inner glow
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      },
    }),
  },
  
  // VisionOS-style frosted glass arrow circle - tactile and elevated
  circularArrow: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', // Frosted glass base
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(14px) saturate(180%)', // Enhanced glass effect
        // Warm neutral radial glow behind arrow
        background: 'radial-gradient(circle at center, rgba(234,228,214,0.35) 0%, rgba(255,255,255,0.15) 60%)',
        // Micro inner shadow (pressed into glass)
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15), inset 0 -1px 1px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.12)',
        border: '1px solid rgba(255,255,255,0.25)', // Faint halo reflection at upper edge
        borderTopColor: 'rgba(255,255,255,0.4)', // Upper edge glow (VisionOS)
        transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)', // Breathing animation curve
        animation: 'breathing 2s ease-in-out infinite',
      },
      default: {
        shadowColor: 'rgba(234,228,214,0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  
  arrowIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  arrowIcon: {
    opacity: 0.98, // Pearl-white, slightly brighter (95-100% opacity range)
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3)) brightness(1.05)', // Subtle glow
      },
      default: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
    }),
  },
  
  // Center content: icon and label with optimal spacing
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 2, // Minimal top margin for compact square look
  },
  
  categoryIconContainer: {
    marginBottom: 8, // Reduced from 12 for more compact spacing
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  categoryIcon: {
    // Minimal icon with thin white outline
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))',
      },
      default: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  
  categoryLabel: {
    fontSize: 16,
    color: 'rgba(248,248,248,0.85)', // 85% white opacity
    fontWeight: '500', // SF Pro Rounded Medium
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Bottom section: status pill and colored line
  bottomSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  
  statusPillContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
  
  // Slightly larger frosted status pill (centered) - more prominent
  statusPill: {
    paddingHorizontal: 14, // Increased from 12
    paddingVertical: 5, // Increased from 4
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)', // Frosted translucency
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        transition: 'opacity 200ms ease-in-out',
        ':active': {
          opacity: 0.9, // Rises to 0.9 on tap
        },
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.05)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
    }),
  },
  
  // Status pill color variations with distinct shades - Booked stands out
  pillBooked: {
    backgroundColor: 'rgba(201,169,109,0.45)', // Stronger Champagne Gold - clearly booked
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(201,169,109,0.3), inset 0 1px 1px rgba(255,255,255,0.15)', // Subtle glow
      },
      default: {
        shadowColor: 'rgba(201,169,109,0.4)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  pillSaved: {
    backgroundColor: 'rgba(194,179,141,0.32)', // Lighter Sand Beige - distinct from Booked
  },
  pillPending: {
    backgroundColor: 'rgba(160,153,142,0.28)', // Lighter Warm Gray
  },
  
  statusPillText: {
    fontSize: 12, // Increased from 11 for better readability
    color: 'rgba(248,248,248,0.85)', // Increased opacity from 80% to 85%
    fontWeight: '500',
    letterSpacing: 0.2,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Thin colored line (2-4px) spanning 80% width
  statusLine: {
    width: '80%',
    height: 3, // 3px thickness
    borderRadius: 2,
    backgroundColor: 'rgba(180,173,162,0.6)', // Default warm gray
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(180,173,162,0.4)', // Soft glow
        transition: 'all 200ms ease-in-out',
        ':active': {
          boxShadow: '0 0 12px rgba(180,173,162,0.6)', // Glows brighter when active
        },
      },
      default: {
        shadowColor: 'rgba(180,173,162,0.4)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  
  // Status line color variations
  lineBooked: {
    backgroundColor: '#CBB88C', // Champagne Gold
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(203,184,140,0.5)',
        ':active': {
          boxShadow: '0 0 12px rgba(203,184,140,0.7)',
        },
      },
      default: {
        shadowColor: 'rgba(203,184,140,0.5)',
      },
    }),
  },
  lineSaved: {
    backgroundColor: '#D6C7A1', // Sand Beige
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(214,199,161,0.5)',
        ':active': {
          boxShadow: '0 0 12px rgba(214,199,161,0.7)',
        },
      },
      default: {
        shadowColor: 'rgba(214,199,161,0.5)',
      },
    }),
  },
  linePending: {
    backgroundColor: '#B4ADA2', // Warm Gray
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(180,173,162,0.4)',
        ':active': {
          boxShadow: '0 0 12px rgba(180,173,162,0.6)',
        },
      },
      default: {
        shadowColor: 'rgba(180,173,162,0.4)',
      },
    }),
  },

  // Booking Overview - 2×2 Grid Layout
  bookingOverviewContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  
  bookingGrid: {
    gap: 14, // Apple Card-style balanced spacing
  },
  
  bookingGridRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  
  // Individual tile
  bookingTile: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 180,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 25px rgba(0,0,0,0.25)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        ':hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        },
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  
  bookingTileBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  
  bookingTileInner: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
    paddingVertical: 22,
    minHeight: 180,
    position: 'relative',
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      },
    }),
  },
  
  // Arrow circle (top-right)
  tileArrowCircle: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.12)',
        border: '1px solid rgba(255,255,255,0.2)',
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.18)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  
  // Icon with white glow
  tileIcon: {
    marginBottom: 12,
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.35))',
      },
      default: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
    }),
  },
  
  // Label
  tileLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.85)',
    letterSpacing: 0.3,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Horizontal progress band
  tileProgressBand: {
    height: 5,
    backgroundColor: 'rgba(180,173,162,0.2)', // Translucent warm gray
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  
  tileProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  tileProgressBooked: {
    backgroundColor: '#CBB88C', // Gold glow
    ...Platform.select({
      web: {
        boxShadow: '0 0 10px rgba(203,184,140,0.6)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
      },
    }),
  },
  
  tileProgressSaved: {
    backgroundColor: '#D6C7A1', // Sand beige
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(214,199,161,0.5)',
      },
      default: {
        shadowColor: '#D6C7A1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
    }),
  },
  
  tileProgressPending: {
    backgroundColor: 'rgba(180,173,162,0.4)', // Warm gray
  },
  
  // Ratio text
  tileRatioText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(248,248,248,0.7)',
    letterSpacing: 0.2,
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Status pill
  tileStatusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(8px)',
      },
    }),
  },
  
  tileStatusBooked: {
    backgroundColor: 'rgba(203,184,140,0.25)', // Champagne gold tint
  },
  
  tileStatusSaved: {
    backgroundColor: 'rgba(214,199,161,0.25)', // Sand beige tint
  },
  
  tileStatusPending: {
    backgroundColor: 'rgba(180,173,162,0.2)', // Warm gray tint
  },
  
  tileStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.8)',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom Navigation Dock - Exactly matches landing.tsx
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
  bottomPadding: {
    height: 120,
  },
})