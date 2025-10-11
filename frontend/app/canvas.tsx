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
      {/* Logo and Profile - Outside trip pane */}
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <TraveaWordmark />
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={26} color="#F8F8F8" />
        </TouchableOpacity>
      </View>

      <View style={styles.tripHeader}>
        <ImageBackground
          source={{ uri: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' }}
          style={styles.tripHeaderBackground}
          imageStyle={styles.tripHeaderBackgroundImage}
        >
          <BlurView intensity={35} tint="dark" style={styles.tripHeaderFrostedGlass}>
            <View style={styles.tripHeaderInner}>
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
                <Ionicons name="chevron-down" size={14} color="rgba(248,248,248,0.8)" />
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
            
            {/* Trip Path - Moved into header */}
            <View style={styles.tripPathInHeader}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tripLineContent}
              >
                {[
                  { name: 'Florence', acronym: 'FLR', status: 'booked' },
                  { name: 'Rome', acronym: 'ROM', status: 'booked' },
                  { name: 'Venice', acronym: 'VCE', status: 'saved' },
                  { name: 'Milan', acronym: 'MIL', status: 'pending' },
                  { name: 'Naples', acronym: 'NAP', status: 'pending' },
                ].map((city, index) => (
                  <View key={city.acronym} style={styles.capsuleWrapper}>
                    <TouchableOpacity 
                      style={[
                        styles.cityCapsule,
                        city.status === 'booked' && styles.capsuleBooked,
                        city.status === 'saved' && styles.capsuleSaved,
                        city.status === 'pending' && styles.capsulePending
                      ]}
                      activeOpacity={0.8}
                    >
                      <Animated.View style={[
                        styles.capsuleInner,
                        city.status === 'booked' && { opacity: pulseAnimation }
                      ]}>
                        <Text style={[
                          styles.capsuleText,
                          city.status === 'booked' && styles.capsuleTextBooked
                        ]}>
                          {city.acronym}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>
                    
                    {index < 4 && (
                      <View style={styles.connectingLine} />
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
          </BlurView>
        </ImageBackground>
      </View>
    </View>
  )

  // Trip Line - Elevated Acronym Capsules
  const TripLine = () => {
    const cities = [
      { name: 'Florence', acronym: 'FLR', status: 'booked' },
      { name: 'Rome', acronym: 'ROM', status: 'booked' },
      { name: 'Venice', acronym: 'VCE', status: 'saved' },
      { name: 'Milan', acronym: 'MIL', status: 'pending' },
      { name: 'Naples', acronym: 'NAP', status: 'pending' },
    ]

    return (
      <View style={styles.tripLineContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tripLineContent}
        >
          {cities.map((city, index) => (
            <View key={city.acronym} style={styles.capsuleWrapper}>
              <TouchableOpacity 
                style={[
                  styles.cityCapsule,
                  city.status === 'booked' && styles.capsuleBooked,
                  city.status === 'saved' && styles.capsuleSaved,
                  city.status === 'pending' && styles.capsulePending
                ]}
                activeOpacity={0.8}
              >
                <Animated.View style={[
                  styles.capsuleInner,
                  city.status === 'booked' && { opacity: pulseAnimation } // Warm pulse
                ]}>
                  <Text style={[
                    styles.capsuleText,
                    city.status === 'booked' && styles.capsuleTextBooked
                  ]}>
                    {city.acronym}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
              
              {/* Connecting line */}
              {index < cities.length - 1 && (
                <View style={styles.connectingLine} />
              )}
            </View>
          ))}
        </ScrollView>
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

  // Booking Hub - Illuminated Ribbons
  const BookingHub = () => {
    const ribbons = [
      { icon: 'airplane', title: 'Flights', progress: 100, count: '2 of 2', cta: 'booked', color: '#CBB88C' },
      { icon: 'bed', title: 'Stays', progress: 67, count: '2 of 3', cta: 'booked', color: '#CBB88C' },
      { icon: 'car', title: 'Transport', progress: 50, count: '1 of 2', cta: 'book', color: '#D6C7A1' },
      { icon: 'ticket', title: 'Experiences', progress: 0, count: '0 of 5', cta: 'explore', color: '#B4ADA2' },
      { icon: 'restaurant', title: 'Restaurants', progress: 0, count: '0 of 8', cta: 'explore', color: '#B4ADA2' },
    ]

    return (
      <View style={styles.ribbonContainer}>
        {ribbons.map((ribbon, index) => (
          <Animated.View 
            key={ribbon.title}
            style={[
              styles.ribbonWrapper,
              { 
                opacity: fadeAnimation,
                transform: [{ translateY: fadeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.ribbon}
              activeOpacity={0.85}
            >
              <BlurView intensity={40} tint="dark" style={styles.ribbonBlur}>
                {/* Micro-particle light layer */}
                <View style={styles.particleLayer} pointerEvents="none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.particle,
                        {
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          width: 1.5 + Math.random() * 2,
                          height: 1.5 + Math.random() * 2,
                          backgroundColor: i < 7 ? '#CBB88C' : i < 10 ? '#D6C7A1' : '#B4ADA2',
                          opacity: pulseAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.03 + Math.random() * 0.03, 0.05 + Math.random() * 0.03]
                          }),
                        }
                      ]}
                    />
                  ))}
                </View>
                
                <View style={[styles.ribbonInner, { borderBottomColor: ribbon.color }]}>
                  {/* Left: Icon with Circular Halo Progress */}
                  <View style={styles.ribbonLeft}>
                    <View style={styles.haloContainer}>
                      {/* Circular Progress Halo */}
                      <View style={[
                        styles.progressHalo,
                        { borderColor: ribbon.color }
                      ]}>
                        {/* Progress arc overlay */}
                        <View style={[
                          styles.progressArc,
                          { 
                            borderColor: ribbon.color,
                            transform: [{ rotate: `${ribbon.progress * 3.6}deg` }]
                          }
                        ]} />
                        
                        {/* Icon centered */}
                        <View style={styles.haloIconContainer}>
                          <Ionicons 
                            name={ribbon.icon as any} 
                            size={18} 
                            color="#F8F8F8" 
                            style={styles.ribbonIcon} 
                          />
                        </View>
                      </View>
                      
                      {/* Progress text beneath halo */}
                      <Text style={styles.haloProgressText}>{ribbon.count}</Text>
                    </View>
                    
                    {/* Category Title */}
                    <Text style={styles.ribbonTitle}>{ribbon.title}</Text>
                  </View>

                  {/* Right: CTA Pill */}
                  <View style={styles.ribbonRight}>
                    <View style={[
                      styles.ribbonCTA,
                      ribbon.cta === 'booked' && styles.ctaBooked,
                      ribbon.cta === 'book' && styles.ctaBook,
                      ribbon.cta === 'explore' && styles.ctaExplore
                    ]}>
                      <Text style={[
                        styles.ribbonCTAText,
                        ribbon.cta === 'booked' && styles.ctaTextBooked
                      ]}>
                        {ribbon.cta === 'booked' ? 'Booked' : ribbon.cta === 'book' ? 'Book' : 'Explore'}
                      </Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    )
  }


  // Booking Hub component ends above

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

  // Trip Header - Match landing page exactly
  headerContainer: {
    paddingTop: 32, // Same as landing page
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tripHeader: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 16, // Increased space below logo/profile (was 12)
  },
  tripHeaderBackground: {
    width: '100%',
    borderRadius: 24,
  },
  tripHeaderBackgroundImage: {
    borderRadius: 24,
    opacity: 0.95, // MUCH more visible (increased from 0.75)
  },
  tripHeaderFrostedGlass: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  tripHeaderInner: {
    paddingVertical: 12, // Further reduced for smaller pane
    paddingHorizontal: 20,
    backgroundColor: 'rgba(25,25,25,0.4)', // More transparent for better image visibility
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0, // No margin, let tripHeader marginTop handle it
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
    marginBottom: 24, // Increased from 16 for more space before trip path
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
  
  // Status Dropdown Button - Much smaller
  statusDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12, // Reduced from 18
    paddingVertical: 6, // Reduced from 10
    borderRadius: 14, // Reduced from 20
    backgroundColor: 'rgba(255,255,255,0.1)',
    gap: 6, // Reduced from 8
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
    fontSize: 13, // Reduced from 15
    fontWeight: '500',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.2, // Reduced from 0.3
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Dropdown Menu - Extremely compact
  statusDropdownMenu: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    marginTop: 4, // Reduced from 6
    borderRadius: 12, // Reduced from 16
    overflow: 'hidden',
  },
  
  dropdownMenuBlur: {
    borderRadius: 12, // Reduced from 16
    overflow: 'hidden',
  },
  
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6, // Extremely reduced from 8
    paddingHorizontal: 12, // Extremely reduced from 16
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 6, // Extremely reduced from 8
  },
  
  dropdownSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  
  dropdownOptionText: {
    fontSize: 13, // Further reduced from 14
    fontWeight: '500',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.2, // Reduced from 0.3
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Status Dots - Reduced
  statusDot: {
    width: 8, // Reduced from 10
    height: 8, // Reduced from 10
    borderRadius: 4, // Reduced from 5
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
  
  // Trip path in header - ADD SPACING
  tripPathInHeader: {
    marginTop: 20, // Space from dropdown button
  },

  // Trip Line - Elevated Acronym Capsules
  tripLineContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 28,
  },
  
  tripLineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  
  capsuleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  cityCapsule: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        transition: 'all 200ms ease-in-out',
      },
    }),
  },
  
  capsuleBooked: {
    backgroundColor: '#CBB88C', // Filled champagne gold
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(203,184,140,0.5), inset 0 1px 2px rgba(255,255,255,0.2)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  
  capsuleSaved: {
    backgroundColor: 'rgba(255,255,255,0.08)', // Frosted
    borderWidth: 1.5,
    borderColor: '#D6C7A1', // Sand beige outline
    ...Platform.select({
      web: {
        boxShadow: '0 3px 10px rgba(214,199,161,0.4), inset 0 1px 2px rgba(255,255,255,0.15)',
      },
      default: {
        shadowColor: '#D6C7A1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 3,
      },
    }),
  },
  
  capsulePending: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(180,173,162,0.4)', // Thin warm gray
    ...Platform.select({
      web: {
        boxShadow: '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.1)',
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  
  capsuleInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  capsuleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(248,248,248,0.85)',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  capsuleTextBooked: {
    color: 'rgba(25,25,25,0.9)', // Dark text on gold
  },
  
  connectingLine: {
    width: 16,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 4,
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

  // Booking Hub - Illuminated Ribbons
  ribbonContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  
  ribbonWrapper: {
    marginBottom: 20, // Even spacing between ribbons
  },
  
  ribbon: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        transition: 'all 200ms ease-in-out',
        ':hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        },
      },
    }),
  },
  
  ribbonBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  
  // Particle layer
  particleLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  
  particle: {
    position: 'absolute',
    borderRadius: 2,
    ...Platform.select({
      web: {
        filter: 'blur(2px)',
        mixBlendMode: 'screen', // Additive blend
        animation: 'particleDrift 15s ease-in-out infinite', // CSS animation
      },
      default: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
    }),
  },
  
  ribbonInner: {
    backgroundColor: 'rgba(22,22,22,0.25)', // Base tint
    paddingVertical: 10, // Aggressively reduced from 14
    paddingHorizontal: 18, // Also reduced
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    ...Platform.select({
      web: {
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(233,226,197,0.1) 100%)', // White blur 15% + beige-gold overlay 10%
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      },
    }),
  },
  
  // Left: Icon with Halo + Title
  ribbonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  // Circular Halo Container
  haloContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  
  progressHalo: {
    width: 36, // Reduced from 42
    height: 36, // Reduced from 42
    borderRadius: 18, // Reduced from 21
    borderWidth: 2.5, // Reduced from 3
    borderColor: 'rgba(255,255,255,0.2)', // Base ring
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
        boxShadow: '0 0 12px rgba(203,184,140,0.25)', // Feathered 6px diffusion
      },
      default: {
        shadowColor: 'rgba(203,184,140,0.3)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    }),
  },
  
  progressArc: {
    position: 'absolute',
    width: 36, // Match reduced halo
    height: 36, // Match reduced halo
    borderRadius: 18, // Match reduced halo
    borderWidth: 2.5, // Match reduced halo
    borderColor: 'transparent',
    borderTopColor: 'currentColor', // Uses parent borderColor
    opacity: 0.25, // 25% opacity as specified
    ...Platform.select({
      web: {
        filter: 'blur(1px)', // Soft edge
      },
    }),
  },
  
  haloIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ribbonIcon: {
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.35))',
      },
      default: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 3,
      },
    }),
  },
  
  haloProgressText: {
    fontSize: 12, // Increased from 10 for better visibility
    fontWeight: '500', // Medium weight for clarity
    color: 'rgba(248,248,248,0.75)', // Increased opacity from 65% to 75%
    letterSpacing: 0.3,
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'SF Pro',
      android: 'Neue Montreal',
      web: 'SF Pro, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  ribbonTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(248,248,248,0.9)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, SF Pro Rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  // Right: CTA Pill
  ribbonRight: {
    flex: 0.3,
    alignItems: 'flex-end',
  },
  
  ribbonCTA: {
    minWidth: 95, // Increased from 90 to prevent "Explore" text wrapping on iPhone
    paddingHorizontal: 22, // Increased from 20 for more room
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
        transition: 'all 200ms ease-in-out',
      },
    }),
  },
  
  ctaExplore: {
    backgroundColor: 'rgba(255,255,255,0.08)', // Transparent frosted
    borderWidth: 1,
    borderColor: 'rgba(180,173,162,0.4)', // Soft silver
  },
  
  ctaBook: {
    backgroundColor: 'rgba(214,199,161,0.25)', // Sand pulse
    borderWidth: 1,
    borderColor: '#D6C7A1',
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(214,199,161,0.4)',
      },
    }),
  },
  
  ctaBooked: {
    backgroundColor: 'rgba(203,184,140,0.3)', // Steady gold
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(203,184,140,0.5)',
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
    }),
  },
  
  ribbonCTAText: {
    fontSize: 13, // Uniform size for all states
    fontWeight: '500',
    color: 'rgba(248,248,248,0.85)',
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'SF Pro Rounded',
      android: 'Neue Montreal',
      web: 'SF Pro Rounded, Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  
  ctaTextBooked: {
    color: 'rgba(248,248,248,0.95)',
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