import React, { useState, useEffect, useRef } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground,
  Image, 
  Platform, 
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard
} from 'react-native'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useBookmarks } from '../contexts/BookmarkContext'
import { useTrips } from '../contexts/TripsContext'
import { useStayBooking } from '../contexts/StayBookingContext'
import { useExperienceBooking } from '../contexts/ExperienceBookingContext'
import { useRestaurantBooking } from '../contexts/RestaurantBookingContext'
import { useTransportBooking } from '../contexts/TransportBookingContext'
import TraveaWordmark from '../components/TraveaWordmark'
import ProfileDrawer from '../components/ProfileDrawer'

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
  isCondeNastPick?: boolean
  isMultiCity?: boolean
  cities?: string[]
  cityInitials?: string[]
  duration?: string
  circuitTitle?: string
}

const destinationCards: DestinationCard[] = [
  // MULTI-CITY CIRCUITS
  { 
    id: 'italian-coast-circuit', 
    city: 'Amalfi → Ravello → Sorrento', 
    region: 'Italy', 
    tagline: 'Lemon groves & stone paths', 
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', 
    transport: [{ icon: 'calendar-outline', time: '4 days' }], 
    category: 'inspire',
    isMultiCity: true,
    cities: ['Amalfi', 'Ravello', 'Sorrento'],
    cityInitials: ['AMF', 'RAV', 'SOR'],
    duration: '4 days',
    circuitTitle: 'Lemon Coast Trail',
    isCondeNastPick: true
  },
  { 
    id: 'tuscany-circuit', 
    city: 'Florence → Siena → San Gimignano', 
    region: 'Italy', 
    tagline: 'Renaissance art & vineyards', 
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', 
    transport: [{ icon: 'calendar-outline', time: '5 days' }], 
    category: 'inspire',
    isMultiCity: true,
    cities: ['Florence', 'Siena', 'San Gimignano'],
    cityInitials: ['FLR', 'SIE', 'SGM'],
    duration: '5 days',
    circuitTitle: 'Tuscan Renaissance Loop'
  },
  { 
    id: 'kyoto-osaka-circuit', 
    city: 'Kyoto → Osaka → Nara', 
    region: 'Japan', 
    tagline: 'Ancient temples & modern pulse', 
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', 
    transport: [{ icon: 'calendar-outline', time: '6 days' }], 
    category: 'inspire',
    isMultiCity: true,
    cities: ['Kyoto', 'Osaka', 'Nara'],
    cityInitials: ['KYO', 'OSA', 'NAR'],
    duration: '6 days',
    circuitTitle: 'Kyoto – Osaka Loop'
  },
  { 
    id: 'kyoto-tokyo-circuit', 
    city: 'Kyoto → Hakone → Tokyo', 
    region: 'Japan', 
    tagline: 'Tradition meets metropolis', 
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', 
    transport: [{ icon: 'calendar-outline', time: '8 days' }], 
    category: 'inspire',
    isMultiCity: true,
    cities: ['Kyoto', 'Hakone', 'Tokyo'],
    cityInitials: ['KYO', 'HAK', 'TYO'],
    duration: '8 days',
    circuitTitle: 'Kyoto – Nara – Tokyo'
  },
  
  // 12 UNIQUE VACATIONS DESTINATIONS
  { id: 'amalfi', city: 'Amalfi', region: 'Italy', tagline: 'Coastal drives & lemon air', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '8h 30m' }], category: 'inspire' },
  { id: 'kyoto', city: 'Kyoto', region: 'Japan', tagline: 'Temples & still mornings', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '12h 15m' }], category: 'inspire' },
  { id: 'reykjavik', city: 'Reykjavík', region: 'Iceland', tagline: 'Aurora skies & Nordic calm', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '6h 45m' }], category: 'inspire' },
  { id: 'barcelona', city: 'Barcelona', region: 'Spain', tagline: 'Gaudi dreams & tapas nights', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '7h 20m' }], category: 'inspire' },
  { id: 'vienna', city: 'Vienna', region: 'Austria', tagline: 'Imperial elegance & coffee', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '9h 45m' }], category: 'inspire' },
  { id: 'lisbon', city: 'Lisbon', region: 'Portugal', tagline: 'Tram rides & golden sunsets', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '10h 15m' }], category: 'inspire' },
  { id: 'prague', city: 'Prague', region: 'Czech Republic', tagline: 'Castle views & beer halls', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '8h 50m' }], category: 'inspire' },
  { id: 'budapest', city: 'Budapest', region: 'Hungary', tagline: 'Thermal baths & river cruises', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '9h 30m' }], category: 'inspire' },
  { id: 'amsterdam', city: 'Amsterdam', region: 'Netherlands', tagline: 'Canals & cycling paths', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '8h 10m' }], category: 'inspire' },
  { id: 'stockholm', city: 'Stockholm', region: 'Sweden', tagline: 'Archipelago & midnight sun', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '10h 45m' }], category: 'inspire' },
  { id: 'copenhagen', city: 'Copenhagen', region: 'Denmark', tagline: 'Hygge culture & harbor views', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '9h 20m' }], category: 'inspire' },
  { id: 'dubrovnik', city: 'Dubrovnik', region: 'Croatia', tagline: 'Medieval walls & azure seas', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '11h 30m' }], category: 'inspire' },

  // 12 UNIQUE DISCOVER DESTINATIONS  
  { id: 'santorini', city: 'Santorini', region: 'Greece', tagline: 'Whitewashed cliffs & wine', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '12h 20m' }], category: 'weekend' },
  { id: 'provence', city: 'Provence', region: 'France', tagline: 'Lavender fields & markets', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'car-outline', time: '2h 15m' }], category: 'weekend' },
  { id: 'tuscany', city: 'Tuscany', region: 'Italy', tagline: 'Rolling hills & vineyards', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'car-outline', time: '3h 05m' }], category: 'weekend' },
  { id: 'bali', city: 'Bali', region: 'Indonesia', tagline: 'Rice terraces & temples', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '15h 30m' }], category: 'weekend' },
  { id: 'maldives', city: 'Maldives', region: 'Indian Ocean', tagline: 'Overwater luxury & reefs', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '18h 45m' }], category: 'weekend' },
  { id: 'patagonia', city: 'Patagonia', region: 'Chile', tagline: 'Glaciers & wild landscapes', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'airplane-outline', time: '20h 15m' }], category: 'weekend' },
  { id: 'marrakech', city: 'Marrakech', region: 'Morocco', tagline: 'Souks & desert sunsets', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '13h 40m' }], category: 'weekend' },
  { id: 'capetown', city: 'Cape Town', region: 'South Africa', tagline: 'Table Mountain & vineyards', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '17h 25m' }], category: 'weekend' },
  { id: 'queenstown', city: 'Queenstown', region: 'New Zealand', tagline: 'Adventure & alpine lakes', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'airplane-outline', time: '22h 10m' }], category: 'weekend' },
  { id: 'aspen', city: 'Aspen', region: 'USA', tagline: 'Powder snow & luxury lodges', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '6h 30m' }], category: 'weekend' },
  { id: 'gstaad', city: 'Gstaad', region: 'Switzerland', tagline: 'Alpine elegance & skiing', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '9h 45m' }], category: 'weekend' },
  { id: 'napa', city: 'Napa Valley', region: 'USA', tagline: 'World-class wines & cuisine', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'car-outline', time: '1h 45m' }], category: 'weekend' },
  
  // ADDITIONAL INSPIRE CARDS (10 more for expansion)
  { id: 'edinburgh', city: 'Edinburgh', region: 'Scotland', tagline: 'Medieval castles & whisky', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '8h 15m' }], category: 'inspire' },
  { id: 'krakow', city: 'Kraków', region: 'Poland', tagline: 'Gothic charm & salt mines', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '10h 30m' }], category: 'inspire' },
  { id: 'bruges', city: 'Bruges', region: 'Belgium', tagline: 'Fairy-tale canals & chocolate', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '7h 50m' }], category: 'inspire' },
  { id: 'helsinki', city: 'Helsinki', region: 'Finland', tagline: 'Nordic design & saunas', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '11h 20m' }], category: 'inspire' },
  { id: 'salzburg', city: 'Salzburg', region: 'Austria', tagline: 'Mozart & mountain views', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '9h 15m' }], category: 'inspire' },
  { id: 'tallinn', city: 'Tallinn', region: 'Estonia', tagline: 'Medieval walls & digital hub', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '12h 05m' }], category: 'inspire' },
  { id: 'porto', city: 'Porto', region: 'Portugal', tagline: 'Port wine & riverside charm', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '10h 40m' }], category: 'inspire' },
  { id: 'zurich', city: 'Zürich', region: 'Switzerland', tagline: 'Swiss precision & lakeside views', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', transport: [{ icon: 'airplane-outline', time: '8h 45m' }], category: 'inspire' },
  { id: 'seville', city: 'Seville', region: 'Spain', tagline: 'Flamenco & Moorish palaces', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg', transport: [{ icon: 'airplane-outline', time: '11h 10m' }], category: 'inspire' },
  { id: 'lyon', city: 'Lyon', region: 'France', tagline: 'Gastronomy & silk weavers', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', transport: [{ icon: 'airplane-outline', time: '9h 35m' }], category: 'inspire' },
  
  // ADDITIONAL WEEKEND CARDS (10 more for expansion)
  { id: 'seychelles', city: 'Seychelles', region: 'Indian Ocean', tagline: 'Granite boulders & beaches', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '19h 30m' }], category: 'weekend' },
  { id: 'fiji', city: 'Fiji', region: 'South Pacific', tagline: 'Island paradise & coral reefs', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '21h 15m' }], category: 'weekend' },
  { id: 'bhutan', city: 'Bhutan', region: 'Himalayas', tagline: 'Mountain monasteries & mindfulness', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'airplane-outline', time: '16h 45m' }], category: 'weekend' },
  { id: 'iceland-south', city: 'South Iceland', region: 'Iceland', tagline: 'Waterfalls & black sand beaches', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'car-outline', time: '4h 20m' }], category: 'weekend' },
  { id: 'oman', city: 'Muscat', region: 'Oman', tagline: 'Desert dunes & frankincense', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '14h 55m' }], category: 'weekend' },
  { id: 'jordan', city: 'Petra', region: 'Jordan', tagline: 'Ancient ruins & desert camps', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'airplane-outline', time: '13h 20m' }], category: 'weekend' },
  { id: 'madagascar', city: 'Madagascar', region: 'Africa', tagline: 'Unique wildlife & rainforests', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '20h 40m' }], category: 'weekend' },
  { id: 'galapagos', city: 'Galápagos', region: 'Ecuador', tagline: 'Evolution & pristine nature', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg', transport: [{ icon: 'airplane-outline', time: '18h 10m' }], category: 'weekend' },
  { id: 'azores', city: 'Azores', region: 'Portugal', tagline: 'Volcanic islands & hot springs', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg', transport: [{ icon: 'airplane-outline', time: '8h 50m' }], category: 'weekend' },
  { id: 'faroe', city: 'Faroe Islands', region: 'Denmark', tagline: 'Dramatic cliffs & puffins', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg', transport: [{ icon: 'airplane-outline', time: '10h 25m' }], category: 'weekend' }
]

export default function Landing() {
  const router = useRouter()
  const { bookmarkedItems, addBookmark, removeBookmark } = useBookmarks()
  const { trips } = useTrips()
  const { bookedStays } = useStayBooking()
  const { bookedExperiences } = useExperienceBooking()
  const { bookedRestaurants } = useRestaurantBooking()
  const { bookedTransports } = useTransportBooking()
  const [activeMode, setActiveMode] = useState<'vacations' | 'weekends'>('vacations')
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [bookmarkAnimations, setBookmarkAnimations] = useState<{[key: string]: Animated.Value}>({})
  const [showProfileDrawer, setShowProfileDrawer] = useState(false)
  
  // Search transition states
  const [searchTransitionState, setSearchTransitionState] = useState<'idle' | 'activated' | 'results'>('idle')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [showSearchCapsule, setShowSearchCapsule] = useState(false)
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const greetingAnim = useRef(new Animated.Value(0)).current
  const dockAnim = useRef(new Animated.Value(0)).current
  const dockGlowAnim = useRef(new Animated.Value(0)).current
  
  // Search capsule animation refs
  const searchCapsuleScale = useRef(new Animated.Value(0.95)).current
  const searchCapsuleOpacity = useRef(new Animated.Value(0)).current
  const searchBackdropOpacity = useRef(new Animated.Value(0)).current
  const searchGlowPulse = useRef(new Animated.Value(0)).current
  
  // Search transition animation refs
  const searchPaneExpansion = useRef(new Animated.Value(1)).current // Scale for pane expansion
  const searchBlurIntensity = useRef(new Animated.Value(25)).current // Blur intensity
  const backgroundDim = useRef(new Animated.Value(1)).current // Background opacity
  const searchGlowAnim = useRef(new Animated.Value(0)).current // Glow effect
  
  // Breathing animation for Liquid Horizon background
  const breathingAnim = useRef(new Animated.Value(0)).current

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
  
  useEffect(() => {
    // Breathing animation for Liquid Horizon background (15-20 seconds)
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breathingAnim, {
          toValue: 1,
          duration: 18000, // 18 seconds
          useNativeDriver: false,
        }),
        Animated.timing(breathingAnim, {
          toValue: 0,
          duration: 18000, // 18 seconds
          useNativeDriver: false,
        })
      ])
    )
    breathingAnimation.start()
    
    return () => breathingAnimation.stop()
  }, [])

  const handleModeSwitch = (mode: string) => {
    if (mode === activeMode) return
    
    // Add haptic feedback
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
    
    // Special handling for search - open floating capsule
    if (mode === 'search') {
      setShowSearchCapsule(true)
      // Animate capsule in
      Animated.parallel([
        Animated.spring(searchCapsuleScale, {
          toValue: 1.0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(searchCapsuleOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(searchBackdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
      return
    }
    
    setActiveMode(mode)
    console.log(`Switched to mode: ${mode}`)
    
    // Reset scroll to top when switching tabs
    setTimeout(() => {
      if (Platform.OS === 'web') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }
  
  // Handle closing search capsule
  const closeSearchCapsule = () => {
    Animated.parallel([
      Animated.timing(searchCapsuleScale, {
        toValue: 0.95,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(searchCapsuleOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(searchBackdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSearchCapsule(false)
      setSearchQuery('')
    })
  }

  // Helper function to extract base ID from complex carousel ID
  const getBaseId = (complexId: string) => {
    // Complex ID format: "vacations_curated_amalfi_0" or "discover_slow_santorini_1"
    // We want to extract the base ID: "amalfi" or "santorini"
    const parts = complexId.split('_')
    if (parts.length >= 3) {
      // Remove carousel prefix and index suffix, keep the base ID
      return parts.slice(2, -1).join('_') // Handle cases where base ID might have underscores
    }
    return complexId // Fallback to original if format doesn't match
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
    // Extract base ID for consistent bookmark storage
    const baseId = getBaseId(itemId)
    console.log('handleBookmark: Complex ID:', itemId, 'Base ID:', baseId)
    
    const isBookmarked = bookmarkedItems.includes(baseId)
    
    if (isBookmarked) {
      removeBookmark(baseId)
    } else {
      addBookmark(baseId)
      
      // Get individual animation for this specific heart icon
      const bookmarkAnim = getBookmarkAnimation(itemId)
      
      // Elegant heart pulse animation
      Animated.sequence([
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
      ]).start()
    }
  }

  // Stage 1: Search Activation Handler
  const handleSearchActivation = () => {
    setSearchTransitionState('activated')
    
    // Smooth cinematic animations (350ms with ease-in-out)
    Animated.parallel([
      // Expand pane by ~10-15%
      Animated.timing(searchPaneExpansion, {
        toValue: 1.12,
        duration: 350,
        useNativeDriver: true,
      }),
      // Increase blur intensity +4px
      Animated.timing(searchBlurIntensity, {
        toValue: 29,
        duration: 350,
        useNativeDriver: false,
      }),
      // Dim background to 60%
      Animated.timing(backgroundDim, {
        toValue: 0.6,
        duration: 350,
        useNativeDriver: true,
      }),
      // Shift glow to golden hue
      Animated.timing(searchGlowAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: false,
      })
    ]).start()
  }

  // Stage 2: City Selection and Transition to Results
  const handleCitySelection = (city: string) => {
    setSelectedCity(city)
    
    // Pulse effect to signal handoff
    Animated.sequence([
      Animated.timing(searchGlowAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(searchGlowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      })
    ]).start(() => {
      // After pulse, transition to results
      setSearchTransitionState('results')
      
      // Transform pane into result state
      Animated.parallel([
        Animated.timing(searchPaneExpansion, {
          toValue: 1.5, // Expand further for results
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundDim, {
          toValue: 0.4, // Brighten slightly to reveal context
          duration: 350,
          useNativeDriver: true,
        })
      ]).start()
    })
  }

  // Stage 4: Back to Search
  const handleBackToSearch = () => {
    setSearchTransitionState('idle')
    setSelectedCity(null)
    setSearchQuery('') // Reset search query to blank
    
    // Fold back animations
    Animated.parallel([
      Animated.timing(searchPaneExpansion, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(searchBlurIntensity, {
        toValue: 25,
        duration: 350,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundDim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(searchGlowAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: false,
      })
    ]).start()
  }

  // Helper: Check if city exists in user's trips
  const getCityTripContext = (city: string) => {
    for (const trip of trips) {
      // Check if any city in the trip matches the searched city
      if (trip.cities && trip.cities.some((c: any) => c.name === city)) {
        return {
          exists: true,
          trip: trip,
          cityData: trip.cities.find((c: any) => c.name === city)
        }
      }
    }
    return { exists: false, trip: null, cityData: null }
  }

  // Helper: Get booked items for a specific city and trip
  const getBookedItemsForCity = (tripId: string, city: string) => {
    const stays = Object.values(bookedStays).filter((stay: any) => 
      stay.tripId === tripId && stay.stayName?.includes(city)
    )
    const experiences = Object.values(bookedExperiences).filter((exp: any) => 
      exp.tripId === tripId
    )
    const restaurants = Object.values(bookedRestaurants).filter((rest: any) => 
      rest.tripId === tripId
    )
    const transports = Object.values(bookedTransports).filter((trans: any) => 
      trans.tripId === tripId
    )
    
    return { stays, experiences, restaurants, transports }
  }

  const getCurrentCards = () => {
    if (activeMode === 'search') return []
    // Map new mode names to card categories
    const categoryMap = {
      'vacations': 'inspire',  // Vacations tab shows inspire category cards
      'discover': 'weekend'    // Discover tab shows weekend category cards
    }
    const category = categoryMap[activeMode] || activeMode
    const filteredCards = destinationCards.filter(card => card.category === category)
    console.log(`Active mode: ${activeMode}, Mapped to category: ${category}, Found cards:`, filteredCards.length)
    return filteredCards
  }

  // Carousel configurations - now showing ALL cards in each carousel
  const getCarouselConfig = () => {
    const baseCards = getCurrentCards()
    
    if (activeMode === 'vacations') {
      // For You Tab: Curated first, then Multi-City Circuits
      return [
        { 
          id: 'vacations_curated', 
          title: 'Curated for You', 
          cards: baseCards.filter(card => !card.isMultiCity).map((card, index) => ({
            ...card,
            id: `vacations_curated_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        },
        { 
          id: 'vacations_circuits', 
          title: 'Multi-City Circuits', 
          cards: baseCards.filter(card => card.isMultiCity).map((card, index) => ({
            ...card,
            id: `vacations_circuits_${card.id}_${index}`,
          }))
        }
      ]
    } else if (activeMode === 'discover') {
      // Discover Tab: Trending Now, Slow Living, Hidden Gems
      return [
        { 
          id: 'discover_trending', 
          title: 'Trending Now', 
          cards: baseCards.slice(0, 8).map((card, index) => ({
            ...card,
            id: `discover_trending_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        },
        { 
          id: 'discover_slow', 
          title: 'Slow Living', 
          cards: baseCards.slice(8, 16).map((card, index) => ({
            ...card,
            id: `discover_slow_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        },
        { 
          id: 'discover_gems', 
          title: 'Hidden Gems', 
          cards: baseCards.slice(16).map((card, index) => ({
            ...card,
            id: `discover_gems_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        }
      ]
    }
    return []
  }

  const renderDestinationCard = (destination: DestinationCard, index: number) => (
    <View key={destination.id} style={styles.cardWrapper}>
      <TouchableOpacity 
        onPress={() => {
          // Haptic feedback
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          
          if (destination.isMultiCity) {
            router.push(`/multi-city-destination?id=${destination.id}`)
          } else {
            router.push(`/destination?id=${destination.id}&city=${destination.city}&region=${destination.region}`)
          }
        }}
        activeOpacity={0.85}
        style={{ transform: [{ scale: 1 }] }}
      >
        <ImageBackground
          source={{ uri: destination.image }}
          style={styles.destinationCard}
          imageStyle={styles.cardImage}
        >
        {/* Faint gradient film for unified photography */}
        <LinearGradient
          colors={[
            'rgba(15,18,20,0.05)',
            'rgba(15,18,20,0.25)'
          ]}
          locations={[0, 1]}
          style={styles.cardGradientFilm}
        />
        
        {/* Soft neutral grey veil overlay */}
        <View style={styles.cardGreyVeilOverlay} />
        
        {/* Refined vignette with depth */}
        <View style={styles.cardVignetteOverlay} />
        
        {/* Top-Left Floating Condé Nast Tag (Outside Frosted Pane) */}
        {destination.isCondeNastPick && (
          <View style={styles.condeNastFloatingTag}>
            <BlurView intensity={12} tint="light" style={styles.condeNastTagBlur}>
              <Text style={styles.condeNastTagText}>Condé Nast</Text>
            </BlurView>
          </View>
        )}
        
        {/* Liquid-Glass Heart Capsule */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => {
            // Haptic feedback
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
              const Haptics = require('expo-haptics');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            handleBookmark(destination.id)
          }}
          activeOpacity={0.7}
        >
          <Animated.View style={[{ transform: [{ scale: getBookmarkAnimation(destination.id) }] }]}>
            <LinearGradient
              colors={['rgba(194,164,110,0.06)', 'rgba(15,18,20,0.45)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heartCapsule}
            >
              <BlurView intensity={18} tint="dark" style={styles.heartContainer}>
                <Ionicons
                  name={bookmarkedItems.includes(getBaseId(destination.id)) ? "heart" : "heart-outline"}
                  size={20}
                  color={bookmarkedItems.includes(getBaseId(destination.id)) ? "#C2A46E" : "rgba(255,255,255,1)"}
                />
              </BlurView>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* Luxury Frosted Info Pane - Redesigned as Window into Story */}
        <View style={styles.luxuryInfoContainer}>
          <BlurView intensity={22} tint="light" style={styles.frostedGlassPane}>
            <LinearGradient
              colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.05)']}
              locations={[0, 1]}
              start={{ x: 0.3, y: 0.1 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassPaneGradient}
            >
              {/* Faint top-down gradient overlay for text breathing */}
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
                locations={[0, 0.3]}
                style={styles.topDownGradientOverlay}
              />
              <View style={styles.glassPaneInner}>
                {/* MULTI-CITY CARDS */}
                {destination.isMultiCity && destination.cities ? (
                  <>
                    {/* Circuit Title - Muted Bronze Ink */}
                    <Text style={styles.circuitTitleBronze}>
                      {destination.circuitTitle || "Journey"}
                    </Text>
                    
                    {/* Burnt-Edge Divider */}
                    <LinearGradient
                      colors={[
                        'rgba(255,220,180,0.4)',
                        'rgba(255,190,130,0.2)',
                        'rgba(255,220,180,0.05)'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      locations={[0, 0.6, 1]}
                      style={styles.burntEdgeDivider}
                    />
                    
                    {/* Route Flow Row - Micro-postcards */}
                    <View style={styles.routeFlowRow}>
                      {destination.cities.slice(0, 3).map((city, idx) => (
                        <React.Fragment key={idx}>
                          <View style={styles.microPostcard}>
                            <BlurView intensity={8} tint="light" style={styles.microPostcardBlur}>
                              <Text style={styles.microPostcardText}>{city}</Text>
                            </BlurView>
                          </View>
                          {idx < Math.min(destination.cities.length - 1, 2) && (
                            <Text style={styles.routeArrow}> ⟶ </Text>
                          )}
                        </React.Fragment>
                      ))}
                    </View>
                    
                    {/* Mood Descriptor Row (Optional) */}
                    <View style={styles.moodDescriptorRow}>
                      <View style={styles.moodChip}>
                        <BlurView intensity={6} tint="light" style={styles.moodChipBlur}>
                          <Text style={styles.moodChipText}>🍋 Citrus air</Text>
                        </BlurView>
                      </View>
                      <View style={styles.moodChip}>
                        <BlurView intensity={6} tint="light" style={styles.moodChipBlur}>
                          <Text style={styles.moodChipText}>☀ Slow mornings</Text>
                        </BlurView>
                      </View>
                    </View>
                    
                    {/* Duration with Icons - Match Single City Format */}
                    <View style={styles.narrativeDurationRow}>
                      <Ionicons name="airplane-outline" size={13} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.durationText}>
                        {destination.transport[0]?.time || "8h 30m"} away
                      </Text>
                      <Text style={styles.durationText}> • </Text>
                      <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.durationText}> 4 days</Text>
                    </View>
                  </>                ) : (
                  <>
                    {/* SINGLE CITY CARDS - Left Aligned */}
                    {/* Title with Country */}
                    <Text style={styles.singleCityTitleBronze}>{destination.city}, {destination.region}</Text>
                    
                    {/* Burnt-Edge Divider */}
                    <LinearGradient
                      colors={[
                        'rgba(255,220,180,0.4)',
                        'rgba(255,190,130,0.2)',
                        'rgba(255,220,180,0.05)'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      locations={[0, 0.6, 1]}
                      style={styles.burntEdgeDivider}
                    />
                    
                    {/* Poetic Hook / Tagline */}
                    <Text style={styles.poeticHook} numberOfLines={1} ellipsizeMode="tail">
                      {destination.tagline}
                    </Text>
                    
                    {/* Sensory Pills (Max 2) */}
                    <View style={styles.sensoryPillsRow}>
                      <View style={styles.sensoryPillSingle}>
                        <BlurView intensity={8} tint="light" style={styles.sensoryPillBlur}>
                          <Text style={styles.sensoryPillText}>🍋 Lemon paths</Text>
                        </BlurView>
                      </View>
                      <View style={styles.sensoryPillSingle}>
                        <BlurView intensity={8} tint="light" style={styles.sensoryPillBlur}>
                          <Text style={styles.sensoryPillText}>🌊 Sea breeze</Text>
                        </BlurView>
                      </View>
                    </View>
                    
                    {/* Narrative Duration with Icons */}
                    <View style={styles.narrativeDurationRow}>
                      <Ionicons name="airplane-outline" size={13} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.narrativeDuration}>
                        {destination.transport[0]?.time || "8h 30m"} away
                      </Text>
                      <Text style={styles.narrativeDuration}> • </Text>
                      <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.narrativeDuration}> 4 Days</Text>
                    </View>
                  </>
                )}
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </ImageBackground>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Vignette Overlay */}
      <View style={styles.vignetteOverlay} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Editorial Header - Liquid Glass Catching Sunset */}
        <View style={styles.editorialHeaderContainer}>
          {/* Same Header Background as Concierge */}
          <ImageBackground
            source={{ uri: 'https://customer-assets.emergentagent.com/job_glass-voyage/artifacts/vmebbjwa_image.png' }}
            style={styles.liquidSunsetBase}
            imageStyle={styles.headerImageStyle}
            blurRadius={4}
          >
            <LinearGradient
              colors={['rgba(13,13,13,0.75)', 'rgba(26,26,26,0.85)']}
              style={{ width: '100%', height: '100%' }}
            />
          </ImageBackground>
          
          {/* Layer 4: Bottom Feather (Smooth dissolve) */}
          <LinearGradient
            colors={[
              'rgba(15,18,20,0)',
              'rgba(15,18,20,0.85)'
            ]}
            locations={[0.8, 1]}
            style={styles.bottomFeather}
          />
            
          {/* Layer 5: Header Content (Foreground - Above all veils) */}
          <View style={styles.editorialHeaderContent}>
            {/* Top Bar - Logo & Profile */}
            <View style={styles.editorialTopBar}>
              <TraveaWordmark />
              <TouchableOpacity 
                style={styles.editorialProfileIcon} 
                activeOpacity={0.8}
                onPress={() => setShowProfileDrawer(true)}
              >
                <BlurView intensity={10} tint="dark" style={styles.editorialProfileBlur}>
                  <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.9)" />
                </BlurView>
              </TouchableOpacity>
            </View>

            {/* Greeting Section */}
            <Animated.View 
              style={[
                styles.editorialGreetingSection, 
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
              <Text style={styles.editorialGreetingMain}>Hello, Anish</Text>
              <Text style={styles.editorialGreetingSubtext}>
                {activeMode === 'vacations' && 'Curated trips, just for you.'}
                {activeMode === 'discover' && 'Hidden gems, waiting to be found.'}
                {activeMode === 'search' && 'Where would you like to go?'}
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Sticky Category Chips */}
        <View style={styles.stickyChipsContainer}>
          <View style={styles.categoryChips}>
              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleModeSwitch('vacations')}
                activeOpacity={0.8}
              >
                {activeMode === 'vacations' && <View style={styles.chipGlow} />}
                <BlurView intensity={25} tint="light" style={styles.chipBlur}>
                  <View style={[styles.chipContent, activeMode === 'vacations' && styles.chipContentActive]}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.9)" />
                    <Text style={[styles.chipLabel, activeMode === 'vacations' && styles.chipLabelActive]}>
                      For You
                    </Text>
                  </View>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chip}
                onPress={() => handleModeSwitch('discover')}
                activeOpacity={0.8}
              >
                {activeMode === 'discover' && <View style={styles.chipGlow} />}
                <BlurView intensity={25} tint="light" style={styles.chipBlur}>
                  <View style={[styles.chipContent, activeMode === 'discover' && styles.chipContentActive]}>
                    <Ionicons name="compass-outline" size={16} color="rgba(255,255,255,0.9)" />
                    <Text style={[styles.chipLabel, activeMode === 'discover' && styles.chipLabelActive]}>
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
                <BlurView intensity={25} tint="light" style={styles.chipBlur}>
                  <View style={[styles.chipContent, activeMode === 'search' && styles.chipContentActive]}>
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
                {/* Carousel Title */}
                <View style={styles.carouselHeader}>
                  <Text style={styles.carouselTitle}>{carousel.title}</Text>
                </View>

                {/* Horizontal Carousel */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.carousel}
                  contentContainerStyle={styles.carouselContent}
                >
                  {(() => {
                    console.log(`Rendering carousel "${carousel.title}" with ${carousel.cards.length} cards`);
                    return carousel.cards.map((destination, cardIndex) => 
                      renderDestinationCard(destination, cardIndex)
                    );
                  })()}
                </ScrollView>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Search Pane with Cinematic Transitions */}
        {activeMode === 'search' && (
          <>
            {/* Dimmed Background Overlay */}
            <Animated.View 
              style={[
                styles.searchBackgroundOverlay,
                { opacity: backgroundDim.interpolate({
                  inputRange: [0.4, 0.6, 1],
                  outputRange: [0.6, 0.4, 0]
                })}
              ]}
              pointerEvents="none"
            />
            
            <View style={styles.searchContainer}>
              {searchTransitionState === 'idle' || searchTransitionState === 'activated' ? (
                // IDLE & ACTIVATED STATE: "Where to?" Pane
                <Animated.View 
                  style={[
                    styles.searchPaneWrapper,
                    {
                      transform: [{ scale: searchPaneExpansion }]
                    }
                  ]}
                  pointerEvents="box-none"
                >
                  <ImageBackground
                    source={{ uri: 'https://customer-assets.emergentagent.com/job_frosted-journey-1/artifacts/7s7pg3pn_image.png' }}
                    style={styles.searchImageBackground}
                    imageStyle={styles.searchImageStyle}
                    blurRadius={8}
                  >
                    <BlurView intensity={25} tint="light" style={styles.searchPane}>
                      {/* Sunset Gradient Background */}
                      <LinearGradient
                        colors={[
                          'rgba(255,200,140,0.35)',
                          'rgba(180,110,70,0.30)',
                          'rgba(40,25,20,0.65)',
                          '#0F1214'
                        ]}
                        locations={[0, 0.25, 0.65, 1]}
                        start={{ x: 0.35, y: 0.1 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.searchPaneGradient}
                      />
                      <View style={styles.searchPaneContent}>
                        {/* Title */}
                        <View style={styles.titleContainer}>
                          <Text style={styles.searchTitle}>Where to?</Text>
                          <View style={styles.titleAccent} />
                        </View>
                        
                        {/* Search Bar with Golden Glow */}
                        <Animated.View 
                          style={[
                            styles.searchBarWrapper,
                            {
                              shadowColor: searchGlowAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['rgba(255,255,255,0.2)', 'rgba(212,190,132,0.35)']
                              })
                            }
                          ]}
                          pointerEvents="box-none"
                        >
                          <BlurView intensity={25} tint="light" style={styles.searchBarContainer} pointerEvents="box-none">
                            <View style={styles.searchBarContent} pointerEvents="box-none">
                              <Image 
                                source={{ uri: 'https://images.unsplash.com/photo-1580578505986-43cc9dadd4c7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHw0fHxmcm9zdGVkJTIwZ2xhc3MlMjBnbG9iZXxlbnwwfHx8d2hpdGV8MTc2MTQyMTg0MXww&ixlib=rb-4.1.0&q=85' }}
                                style={styles.searchGlobeIcon}
                                resizeMode="contain"
                              />
                              <TextInput
                                style={styles.searchInput}
                                placeholder="Search cities"
                                placeholderTextColor="rgba(255,255,255,0.65)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onFocus={handleSearchActivation}
                                onSubmitEditing={() => {
                                  if (searchQuery.trim()) {
                                    handleCitySelection(searchQuery.trim())
                                    Keyboard.dismiss()
                                  }
                                }}
                                returnKeyType="search"
                                autoCapitalize="words"
                                autoCorrect={false}
                              />
                              {/* Halo Lens Arrow Button */}
                              <TouchableOpacity
                                style={styles.haloLensButton}
                                onPress={() => {
                                  if (searchQuery.trim()) {
                                    handleCitySelection(searchQuery.trim())
                                    Keyboard.dismiss()
                                  }
                                }}
                                activeOpacity={0.7}
                              >
                                <BlurView intensity={8} tint="light" style={styles.haloLensBlur}>
                                  <LinearGradient
                                    colors={['rgba(255,255,255,0.25)', 'rgba(227,200,141,1)']}
                                    style={styles.haloLensGradient}
                                  >
                                    <View style={styles.haloLensInner}>
                                      <Ionicons name="arrow-forward" size={11} color="#FFFFFF" style={{ opacity: 0.85 }} />
                                    </View>
                                  </LinearGradient>
                                </BlurView>
                              </TouchableOpacity>
                            </View>
                          </BlurView>
                        </Animated.View>
                        
                        {/* Trending Section - Sophisticated Dual-Tone */}
                        <View style={styles.trendingSection}>
                          {/* Dual-Tone Typography */}
                          <View style={styles.trendingLabelContainer}>
                            <Text style={styles.trendingIvory}>Trending</Text>
                            <Text style={styles.trendingBronze}> now</Text>
                          </View>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.trendingScrollView}
                            contentContainerStyle={styles.trendingContent}
                          >
                            {['Lisbon', 'Kyoto', 'Marrakech', 'Reykjavík', 'Venice', 'Santorini'].map((destination, index) => (
                              <TouchableOpacity 
                                key={index} 
                                activeOpacity={0.7} 
                                style={styles.trendingPillWrapper}
                                onPress={() => handleCitySelection(destination)}
                              >
                                {/* Frosted Glass Pills with Bronze Border */}
                                <View style={styles.trendingPillFrosted}>
                                  <Text style={styles.trendingPillTextNew}>{destination}</Text>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      </View>
                    </BlurView>
                  </ImageBackground>
                </Animated.View>
              ) : (
                // RESULTS STATE: City Results View
                <Animated.View style={[
                  styles.resultsContainer,
                  {
                    opacity: searchPaneExpansion.interpolate({
                      inputRange: [1, 1.5],
                      outputRange: [0, 1]
                    })
                  }
                ]}>
                  {/* Functional Search Header */}
                  <View style={styles.resultsHeader}>
                    <BlurView intensity={25} tint="dark" style={styles.resultsHeaderBlur}>
                      <View style={styles.resultsHeaderContent}>
                        <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.75)" style={{ marginRight: 10 }} />
                        <TextInput
                          style={styles.resultsSearchInput}
                          placeholder={selectedCity || "Search city..."}
                          placeholderTextColor="rgba(255,255,255,0.5)"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          onSubmitEditing={() => {
                            if (searchQuery.trim()) {
                              handleCitySelection(searchQuery.trim())
                              Keyboard.dismiss()
                            }
                          }}
                          returnKeyType="search"
                          autoCapitalize="words"
                          autoCorrect={false}
                        />
                        <TouchableOpacity onPress={handleBackToSearch}>
                          <Ionicons name="close" size={20} color="rgba(255,255,255,0.9)" />
                        </TouchableOpacity>
                      </View>
                    </BlurView>
                  </View>
                  
                  {/* Scrollable Results Feed - Context Aware */}
                  <ScrollView 
                    style={styles.resultsFeed}
                    contentContainerStyle={styles.resultsFeedContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {(() => {
                      const cityContext = selectedCity ? getCityTripContext(selectedCity) : { exists: false, trip: null, cityData: null }
                      
                      if (cityContext.exists && cityContext.trip) {
                        // CITY EXISTS IN A TRIP - Show "Continue Your Trip" flow
                        const bookedItems = getBookedItemsForCity(cityContext.trip.id, selectedCity!)
                        
                        return (
                          <>
                            {/* Continue Your Trip Header */}
                            <View style={styles.continueYourTripHeader}>
                              <Text style={styles.continueYourTripTitle}>Continue your trip in {selectedCity}</Text>
                              <Text style={styles.continueYourTripSubtext}>
                                Part of {cityContext.trip.name} · {cityContext.trip.startDate} – {cityContext.trip.endDate}
                              </Text>
                            </View>
                            
                            {/* Booked Stays */}
                            {bookedItems.stays.length > 0 && (
                              <View style={styles.bookedSection}>
                                <View style={styles.bookedBadge}>
                                  <LinearGradient
                                    colors={['rgba(212,190,132,0.3)', 'rgba(212,190,132,0.15)']}
                                    style={styles.bookedBadgeGradient}
                                  >
                                    <Text style={styles.bookedBadgeText}>✦ Booked</Text>
                                  </LinearGradient>
                                </View>
                                {bookedItems.stays.map((stay: any, idx: number) => (
                                  <View key={`booked-stay-${idx}`} style={styles.bookedItemCard}>
                                    <Text style={styles.bookedItemTitle}>{stay.stayName || 'Your Stay'}</Text>
                                    <Text style={styles.bookedItemDetail}>
                                      ${stay.pricePerNight}/night · {stay.bookingDates?.start} – {stay.bookingDates?.end}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                            
                            {/* You Might Also Like Carousel */}
                            <View style={styles.relatedSection}>
                              <Text style={styles.relatedSectionTitle}>You Might Also Like</Text>
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.resultsCarousel}
                                contentContainerStyle={styles.resultsCarouselContent}
                              >
                                {destinationCards
                                  .filter(card => !card.isMultiCity && 
                                    card.city.toLowerCase().includes(selectedCity!.toLowerCase()))
                                  .slice(0, 3)
                                  .map((destination, index) => (
                                    <View key={`alternate-${destination.id}`} style={styles.resultsCarouselCard}>
                                      {renderDestinationCard(destination, index)}
                                    </View>
                                  ))
                                }
                              </ScrollView>
                            </View>
                            
                            {/* Multi-City Circuits Carousel */}
                            <View style={styles.relatedSection}>
                              <Text style={styles.relatedSectionTitle}>Multi-city Trips ✦</Text>
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.resultsCarousel}
                                contentContainerStyle={styles.resultsCarouselContent}
                              >
                                {destinationCards
                                  .filter(card => card.isMultiCity && 
                                    card.cities?.some(city => city.toLowerCase().includes(selectedCity!.toLowerCase())))
                                  .map((destination, index) => (
                                    <View key={`multi-${destination.id}`} style={styles.resultsCarouselCard}>
                                      {renderDestinationCard(destination, index)}
                                    </View>
                                  ))
                                }
                              </ScrollView>
                            </View>
                          </>
                        )
                      } else {
                        // CITY NOT IN ANY TRIP - Show standard discovery flow
                        return (
                          <>
                            {/* Primary City Card */}
                            {destinationCards
                              .filter(card => !card.isMultiCity && 
                                card.city.toLowerCase().includes(selectedCity!.toLowerCase()))
                              .map((destination, index) => (
                                <Animated.View 
                                  key={`primary-${destination.id}`}
                                  style={[
                                    styles.resultCardWrapper,
                                    {
                                      transform: [{
                                        scale: new Animated.Value(1.02).interpolate({
                                          inputRange: [1, 1.02],
                                          outputRange: [1, 1.02]
                                        })
                                      }]
                                    }
                                  ]}
                                >
                                  {renderDestinationCard(destination, index)}
                                </Animated.View>
                              ))
                            }
                            
                            {/* Multi-City Circuits Carousel */}
                            <View style={styles.relatedSection}>
                              <Text style={styles.relatedSectionTitle}>Multi-city Trips ✦</Text>
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.resultsCarousel}
                                contentContainerStyle={styles.resultsCarouselContent}
                              >
                                {destinationCards
                                  .filter(card => card.isMultiCity && 
                                    card.cities?.some(city => city.toLowerCase().includes(selectedCity!.toLowerCase())))
                                  .map((destination, index) => (
                                    <View key={`multi-${destination.id}`} style={styles.resultsCarouselCard}>
                                      {renderDestinationCard(destination, index)}
                                    </View>
                                  ))
                                }
                              </ScrollView>
                            </View>
                          </>
                        )
                      }
                    })()}
                  </ScrollView>
                </Animated.View>
              )}
            </View>
          </>
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
        <BlurView intensity={22} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="home" size={22} color="#C2A46E" />
              <Text style={styles.dockLabelActive}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/bookings');
              }}
            >
              <Ionicons name="calendar" size={22} color="rgba(255,255,255,0.82)" />
              <Text style={styles.dockLabel}>Trip Canvas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/trips');
              }}
            >
              <Animated.View style={[styles.dockGlowContainer, { opacity: dockGlowAnim }]}>
                <View style={styles.dockGlow} />
              </Animated.View>
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.82)" />
              <Text style={styles.dockLabel}>My Trips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/concierge');
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.82)" />
              <Text style={styles.dockLabel}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      {/* Floating Search Canvas */}
      {showSearchCapsule && (
        <View style={styles.searchCanvasContainer}>
          {/* Radial Gradient Background Fade with Blur */}
          <Animated.View 
            style={[
              styles.radialBackdrop,
              { opacity: searchBackdropOpacity }
            ]}
          >
            <BlurView intensity={20} tint="dark" style={styles.backdropBlur}>
              <TouchableOpacity 
                style={styles.backdropTouchable}
                activeOpacity={1}
                onPress={closeSearchCapsule}
              />
            </BlurView>
          </Animated.View>

          {/* Floating Liquid Glass Pane */}
          <Animated.View
            style={[
              styles.liquidGlassPane,
              {
                opacity: searchCapsuleOpacity,
                transform: [
                  { scale: searchCapsuleScale },
                  { translateY: searchCapsuleScale.interpolate({
                    inputRange: [0.95, 1],
                    outputRange: [10, 0]
                  })}
                ]
              }
            ]}
          >
            {/* Barely Visible Sunset Background */}
            <ImageBackground
              source={require('../assets/search-bg.png')}
              style={styles.sunsetBackground}
              imageStyle={styles.sunsetImageStyle}
              blurRadius={30}
            >
              {/* Signature Motion Beam */}
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.motionBeam}
              />

              <BlurView intensity={25} tint="dark" style={styles.glassBlurLayer}>
                <View style={styles.paneContent}>
                  {/* Search Field Pill */}
                  <Animated.View style={[
                    styles.searchPill,
                    { transform: [{ scale: searchCapsuleScale }] }
                  ]}>
                    <View style={styles.searchPillInner}>
                      <Ionicons 
                        name="search-outline" 
                        size={20} 
                        color="#D4B882" 
                        style={styles.searchIconCanvas} 
                      />
                      <TextInput
                        style={styles.searchInputCanvas}
                        placeholder="Search cities"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                        returnKeyType="search"
                        onFocus={() => {
                          // Haptic feedback + 2% expansion
                          if (Platform.OS === 'ios' || Platform.OS === 'android') {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                          }
                        }}
                      />
                      {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                          <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </Animated.View>

                  {/* Search Results - Redesigned */}
                  {searchQuery.length > 0 ? (
                    <ScrollView 
                      style={styles.resultsScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {/* Section 1: Matching City (Hero Result) */}
                      {destinationCards.filter(dest => 
                        !dest.isMultiCity &&
                        dest.city.toLowerCase().includes(searchQuery.toLowerCase())
                      ).slice(0, 1).map((dest) => (
                        <View key={dest.id} style={styles.matchingCitySection}>
                          <Text style={styles.sectionLabel}>Matching City</Text>
                          <TouchableOpacity
                            style={styles.heroCityCard}
                            onPress={() => {
                              closeSearchCapsule()
                              router.push(`/destination?id=${dest.id}&city=${dest.city}&region=${dest.region}`)
                            }}
                          >
                            <BlurView intensity={10} tint="light" style={styles.heroCityBlur}>
                              <ImageBackground
                                source={{ uri: dest.image }}
                                style={styles.heroCityImage}
                                imageStyle={styles.heroCityImageStyle}
                                blurRadius={8}
                              />
                              <View style={styles.heroCityContent}>
                                <Text style={styles.heroCityTitle}>{dest.city}</Text>
                                <Text style={styles.heroCitySubtitle}>{dest.region}</Text>
                              </View>
                              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                            </BlurView>
                          </TouchableOpacity>
                        </View>
                      ))}

                      {/* Section 2: Curated Journeys (Max 2) */}
                      {destinationCards.filter(dest => 
                        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (dest.region && dest.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (dest.tagline && dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
                      ).slice(0, 2).length > 0 && (
                        <View style={styles.curatedJourneysSearchSection}>
                          <View style={styles.sectionDivider} />
                          <Text style={styles.sectionLabel}>Curated Journeys</Text>
                          {destinationCards.filter(dest => 
                            dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (dest.region && dest.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
                            (dest.tagline && dest.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
                          ).slice(0, 2).map((dest) => (
                            <TouchableOpacity
                              key={dest.id}
                              style={styles.curatedJourneyCard}
                              onPress={() => {
                                closeSearchCapsule()
                                if (dest.isMultiCity) {
                                  router.push(`/multi-city-destination?id=${dest.id}`)
                                } else {
                                  router.push(`/destination?id=${dest.id}&city=${dest.city}&region=${dest.region}`)
                                }
                              }}
                            >
                              <BlurView intensity={8} tint="dark" style={styles.curatedJourneyBlur}>
                                <View style={styles.curatedJourneyContent}>
                                  {/* Publisher Tag */}
                                  {dest.isCondeNastPick && (
                                    <View style={styles.publisherTagSearch}>
                                      <Text style={styles.publisherTagTextSearch}>Condé Nast</Text>
                                    </View>
                                  )}
                                  
                                  {/* Journey Title */}
                                  <Text style={styles.curatedJourneyTitle}>
                                    {dest.isMultiCity ? dest.circuitTitle : dest.city}
                                  </Text>
                                  
                                  {/* Subtext */}
                                  <Text style={styles.curatedJourneySubtext}>
                                    {dest.isMultiCity && dest.cities 
                                      ? dest.cities.join(' – ')
                                      : dest.region
                                    }
                                  </Text>
                                  
                                  {/* Mood Tags */}
                                  <View style={styles.moodTagsRow}>
                                    <View style={styles.moodTagPill}>
                                      <Text style={styles.moodTagText}>
                                        {dest.tagline?.split('&')[0]?.trim() || '✨ Discover'}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                
                                {/* View Pill */}
                                <View style={styles.viewPill}>
                                  <Text style={styles.viewPillText}>View</Text>
                                </View>
                              </BlurView>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}

                      {/* No Results */}
                      {destinationCards.filter(dest => 
                        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (dest.region && dest.region.toLowerCase().includes(searchQuery.toLowerCase()))
                      ).length === 0 && (
                        <View style={styles.noResultsContainer}>
                          <Text style={styles.noResultsText}>No destinations found</Text>
                        </View>
                      )}
                    </ScrollView>
                  ) : (
                    <View style={styles.emptySearchState}>
                      <Ionicons name="earth-outline" size={64} color="rgba(255,255,255,0.25)" />
                      <Text style={styles.emptyStateTitle}>Search cities</Text>
                      <Text style={styles.emptyStateSubtitle}>Discover your next journey</Text>
                    </View>
                  )}
                </View>
              </BlurView>
            </ImageBackground>
          </Animated.View>
        </View>
      )}

      {/* Profile Drawer */}
      <ProfileDrawer 
        visible={showProfileDrawer} 
        onClose={() => setShowProfileDrawer(false)} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: '#0E0E0E', // Deep charcoal base
    ...Platform.select({
      web: {
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#0E0E0E', // Deep charcoal (gradient removed for RN Web compatibility)
      },
      default: {
        // Gradient simulation for native using backgroundColor
        backgroundColor: '#0E0E0E',
      },
    }),
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      web: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Subtle vignette (gradient removed for RN Web compatibility)
      },
      default: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle vignette for native
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
    paddingTop: 32, // 32px top as specified
    paddingHorizontal: 24, // 24px side as specified  
    paddingBottom: 16,
    zIndex: 10,
  },
  logoContainer: {
    // Reduced bronze glow for logo
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 0 6px rgba(201,169,109,0.4))', // Reduced from 8px/0.6 to 6px/0.4
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
  profileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconBlur: {
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
  greetingSection: {
    paddingHorizontal: 24, // 24px side padding as specified
    marginBottom: 24,
  },
  greetingMain: {
    fontSize: 20, // Reduced to 20px as requested
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    letterSpacing: 0.8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  // EDITORIAL HEADER STYLES - Clean & Sophisticated
  editorialHeaderContainer: {
    position: 'relative',
    width: '100%',
    height: height * 0.22, // Further reduced from 0.24 to 0.22
    marginBottom: -8, // Negative margin to pull carousels up
    marginTop: Platform.select({
      ios: -50,
      android: -40,
      web: 0,
    }),
    paddingTop: Platform.select({
      ios: 50,
      android: 40,
      web: 0,
    }),
    paddingBottom: 0, // Removed bottom padding for tighter fit
    backgroundColor: '#0B0F14', // Match main background
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
  },
  editorialSunsetBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  editorialSunsetImageStyle: {
    resizeMode: 'cover',
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  // Layer 1: Liquid Sunset Base
  liquidSunsetBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  // Header Image Style
  headerImageStyle: {
    resizeMode: 'cover',
  },
  // Frosted Glass Overlay for Liquid Effect
  frostedGlassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  // Layer 2: Abstract Texture Overlay (Legacy - keeping for reference)
  liquidTextureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03, // Ultra-light for maximum sunset brightness
    zIndex: 2,
  },
  liquidTextureImage: {
    resizeMode: 'cover',
    opacity: 1,
    ...Platform.select({
      web: {
        filter: 'blur(10px)',
      },
    }),
  },
  // Layer 3: Contrast Veil (Between background and text)
  contrastVeilLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(6px)',
      },
    }),
  },
  // Layer 4: Bottom Feather (Smooth dissolve)
  bottomFeather: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '20%', // Cover bottom 20% of header
    zIndex: 4,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    }),
  },
  translucentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11,15,20,0.40)', // 40% dark overlay to make image translucent
    zIndex: 1,
  },
  editorialHeaderContent: {
    flex: 1,
    paddingTop: Platform.select({
      ios: 18, // Moved up more from 28
      android: 16, // Moved up more from 24
      web: 12, // Moved up more from 18
    }),
    paddingHorizontal: 24,
    paddingBottom: 22, // Increased for more space
    zIndex: 10, // Above all veils and backgrounds
  },
  editorialTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Reduced from 12 for tighter spacing
    paddingVertical: 6, // Reduced from 10px
  },
  editorialProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  editorialProfileBlur: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', // Glass capsule background
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // Glass reflection ring
  },
  editorialGreetingSection: {
    marginTop: 6, // Further reduced from 12 to move up
  },
  editorialGreetingMain: {
    fontSize: 24,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.96)', // Bright white as specified
    marginBottom: 4,
    letterSpacing: 2.5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
      },
      web: {
        textShadow: '0 2px 6px rgba(0,0,0,0.35)',
      },
    }),
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  hairlineBronzeRule: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(168,150,115,0.25)', // 25% opacity
    marginBottom: 6,
    marginLeft: 2, // Offset
  },
  editorialGreetingSubtext: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)', // As specified
    letterSpacing: 0.2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
      },
      web: {
        textShadow: '0 2px 6px rgba(0,0,0,0.35)',
      },
    }),
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  greetingSub: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)', // rgba(255,255,255,0.7) for subhead
    lineHeight: 24,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  headerDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 24,
    marginBottom: 8,
  },
  stickyChipsContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    paddingTop: 36, // Increased from 28 to move pills down more
    paddingBottom: 8,
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
    gap: 12, // Better spacing between pills
  },
  chip: {
    position: 'relative',
    borderRadius: 30,
    overflow: 'hidden',
  },
  chipBlur: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)', // Base for gradient
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)', // Enhanced border
    ...Platform.select({
      web: {
        backdropFilter: 'blur(18px)',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))',
        boxShadow: 'inset 0 0 2px rgba(255,255,255,0.25), 0 6px 16px rgba(0,0,0,0.28)',
      },
      ios: {
        shadowColor: 'rgba(0,0,0,0.28)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 10, // Elegant spacing between icon and text
  },
  chipContentActive: {
    backgroundColor: 'rgba(194,164,110,0.10)', // Enhanced bronze tint for active
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)', // 85% for inactive
    letterSpacing: 0.2, // Increased for airy aesthetic
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  chipLabelActive: {
    color: '#FFFFFF', // Full white for active
  },
  chipActive: {
    // Active state handled by glow
  },
  chipGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20, // Adjust radius to match new chip radius
    backgroundColor: 'transparent', // Transparent background for glow only
    ...Platform.select({
      web: {
        boxShadow: '0 0 4px rgba(194,164,110,0.25)', // Micro-glow edge in muted bronze
      },
      default: {
        shadowColor: '#C2A46E',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
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
    marginTop: 16, // Reduced from 32 to move carousels closer to pills
  },
  scrollableContentContainer: {
    paddingBottom: 120, // Space for bottom dock
  },
  carouselSection: {
    marginTop: 12, // Reduced from 16 for tighter spacing
    marginBottom: 12, // Reduced from 16
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center', // This ensures vertical center alignment
    paddingHorizontal: 20,
    marginBottom: 16,
    justifyContent: 'flex-start', // Align items to the start
  },
  condeNastFloatingTag: {
    position: 'absolute',
    top: 20, // Moved down from 16 to align with heart icon
    left: 16,
    zIndex: 10,
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
      },
    }),
  },
  condeNastTagBlur: {
    backgroundColor: 'rgba(30,30,30,0.85)', // Dark gray background
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
      },
    }),
  },
  condeNastTagText: {
    fontSize: 13, // Increased from 12 for even better presence
    fontWeight: '600', // Bold for impact
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5, // Increased spacing
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  carouselTitle: {
    fontSize: 21, // Increased from 18 for better presence
    fontWeight: '500', // Medium instead of bold
    color: 'rgba(255,255,255,0.9)', // Soft white instead of pure
    letterSpacing: 0.3, // Added for airy aesthetic
    marginTop: 14, // Breathing room above
    marginBottom: 6, // Space below
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
    height: height * 0.34, // Reduced by ~10.5% from 0.38 for sleeker feel
    borderRadius: 24, // Tightened from 32 for refined aesthetic
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      },
    }),
  },
  cardImage: {
    borderRadius: 24, // Match parent radius
    ...Platform.select({
      web: {
        // Further reduced brightness and contrast for more toned down appearance
        filter: 'brightness(0.78) contrast(0.72)',
      },
    }),
  },
  
  // Faint gradient film for unified photography
  cardGradientFilm: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  
  // Soft neutral grey veil overlay for subtle desaturation
  cardGreyVeilOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18,18,18,0.12)', // Reduced opacity for subtlety
    zIndex: 2,
  },
  
  // Enhanced vignette with depth (no blur)
  cardVignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    ...Platform.select({
      web: {
        backgroundColor: 'rgba(0,0,0,0.08)', // Subtle overlay (gradient removed for RN Web compatibility)
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.08)',
      },
    }),
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  heartCapsule: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
      },
    }),
  },
  heartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15,18,20,0.45)',
  },
  // REDESIGNED FROSTED GLASS PANE - Window into a Story
  luxuryInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'auto',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  frostedGlassPane: {
    borderRadius: 22,
    overflow: 'hidden',
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.22)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(22px) saturate(180%)',
        boxShadow: '0 4px 25px rgba(0,0,0,0.45), inset 0 0 0.5px rgba(255,255,255,0.4)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 25,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  glassPaneGradient: {
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        background: 'radial-gradient(circle at 30% 10%, rgba(255,255,255,0.18), rgba(255,255,255,0.05))',
      },
    }),
  },
  topDownGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 1,
  },
  glassPaneInner: {
    padding: 17, // 16-18px inside pane
    position: 'relative',
    zIndex: 2,
    // Vertical gradient overlay for visual cohesion (top: lighter, bottom: darker)
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.3))',
      },
    }),
  },
  // Destination Title
  glassDestinationTitle: {
    fontSize: 19,
    fontWeight: '600', // SemiBold
    color: 'rgba(255,255,255,0.95)', // White 95%
    letterSpacing: 0.2,
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
      },
      web: {
        textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      },
    }),
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  // Burnt-Edge Divider
  burntEdgeDivider: {
    height: 1,
    width: '48%',
    marginTop: 4,
    marginBottom: 8,
    ...Platform.select({
      web: {
        filter: 'blur(0.6px) contrast(1.2)',
      },
    }),
  },
  // Poetic Hook / Sensory Sentence - Ethereal but Clear
  poeticHook: {
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.92)', // White @ 92%
    marginBottom: 8,
    letterSpacing: 0.15, // Minimalist rhythm
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
      },
      web: {
        textShadow: '0 0 2px rgba(0,0,0,0.25)', // Legibility over complex images
      },
    }),
  },
  // Sensory Chips
  sensoryChipsScroll: {
    marginBottom: 8,
  },
  sensoryChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensoryChip: {
    marginRight: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  sensoryChipBlur: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  sensoryChipText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)', // White 85%
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  // Meta Whisper Line
  metaWhisperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaWhisperIcon: {
    marginRight: 4,
  },
  metaWhisperText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.60)', // Muted
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  metaWhisperDot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.60)',
    marginHorizontal: 4,
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
  condeNastTag: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  condeNastText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  editorialBadge: {
    alignSelf: 'flex-start',
  },
  editorialBadgeInner: {
    backgroundColor: 'rgba(0,0,0,0.55)', // Matte black pill
    borderRadius: 12, // 12px border radius
    paddingHorizontal: 8, // 6-8px padding
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    // No glow - keep understated
  },
  editorialBadgeText: {
    fontSize: 12, // 12px
    fontWeight: '500', // Inter Medium
    color: '#FFFFFF', // White text
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
    marginTop: 32, // Push down from pills
    marginBottom: 120, // Space from dock
  },
  searchImageBackground: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  searchImageStyle: {
    borderRadius: 28,
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
        backdropFilter: 'blur(30px)',
      },
    }),
  },
  searchPaneContent: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    backgroundColor: 'transparent', // Let the gradient show through
  },
  searchPaneGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  titleContainer: {
    alignSelf: 'flex-start',
    marginBottom: 28,
  },
  searchTitle: {
    fontSize: 24, // Increased for prominence
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
    paddingHorizontal: 14,
    paddingVertical: 8, // Further reduced
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
  searchGlobeIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    opacity: 0.85,
  },
  searchArrow: {
    marginLeft: 'auto',
  },
  // Halo Lens Arrow Button Styles
  haloLensButton: {
    width: 26, // Further reduced
    height: 26, // Further reduced
    borderRadius: 13, // Further reduced
    marginLeft: 10,
    overflow: 'hidden',
  },
  haloLensBlur: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  haloLensGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  haloLensInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(227,200,141,0.5)',
  },
  searchPlaceholder: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.65)', // Lighter for elegance
    letterSpacing: 0.5, // Elegant spacing
    flex: 1,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  searchInput: {
    fontSize: 16,
    color: '#F8F8F8',
    letterSpacing: 0.5,
    flex: 1,
    paddingVertical: 0,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    outlineStyle: 'none', // Remove default outline on web
  },
  trendingSection: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 12, // Closer to search bar
  },
  // Dual-Tone Typography Styles
  trendingLabelContainer: {
    flexDirection: 'row',
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  trendingIvory: {
    fontSize: 24, // Match "Where to?" size
    fontWeight: '500', // Match "Where to?" weight
    color: '#E8E6E2', // Soft ivory
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  trendingBronze: {
    fontSize: 24, // Match "Where to?" size
    fontWeight: '500',
    color: '#E8E6E2', // Same as "Trending" - soft ivory
    letterSpacing: 0.5,
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
    gap: 10,
  },
  trendingPillWrapper: {
    marginRight: 10,
  },
  // Frosted Glass Pill with Bronze Border
  trendingPillFrosted: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(168,150,115,0.25)', // Bronze border
    borderRadius: 24,
  },
  trendingPillTextNew: {
    fontSize: 13,
    fontWeight: '500',
    color: '#F4F3EE', // Warm ivory
    opacity: 0.85,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  // Search Transition Styles
  searchBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 5,
  },
  searchPaneWrapper: {
    width: '100%',
  },
  searchBarWrapper: {
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(212,190,132,0.35)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 0 12px rgba(212,190,132,0.35)',
      },
    }),
  },
  // Results View Styles
  resultsContainer: {
    flex: 1,
    width: '100%',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  resultsHeaderBlur: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  resultsHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(25,25,25,0.6)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resultsHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  resultsSearchInput: {
    fontSize: 16,
    color: '#F8F8F8',
    letterSpacing: 0.3,
    flex: 1,
    paddingVertical: 0,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    outlineStyle: 'none',
  },
  resultsFeed: {
    flex: 1,
  },
  resultsFeedContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  resultCardWrapper: {
    marginBottom: 24,
  },
  relatedSection: {
    marginTop: 32,
  },
  relatedSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 20,
    paddingHorizontal: 20,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  resultsCarousel: {
    flex: 1,
  },
  resultsCarouselContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  resultsCarouselCard: {
    width: width - 80,
    marginRight: 16,
  },
  // Context-Aware Search Styles
  continueYourTripHeader: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  continueYourTripTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 6,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  continueYourTripSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bookedSection: {
    marginBottom: 32,
  },
  bookedBadge: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookedBadgeGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,190,132,0.4)',
  },
  bookedBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C9A96D',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bookedItemCard: {
    backgroundColor: 'rgba(25,25,25,0.5)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bookedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bookedItemDetail: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  inspiredHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  inspiredText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bottomDock: {
    position: 'absolute',
    bottom: 13, // 12-14px bottom offset for floating
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dockContainer: {
    width: '93%', // 92-94% of screen
    height: 68, // 66-72px height
    borderRadius: 30, // 28-34px corner radius
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 40,
      },
      android: {
        elevation: 20,
      },
      web: {
        boxShadow: '0 10px 40px rgba(0,0,0,0.45), 0 18px 40px rgba(0,0,0,0.42), inset 0 0 2px rgba(255,255,255,0.30), inset 0 1px 0 rgba(255,255,255,0.10)',
      },
    }),
  },
  dockContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)', // Base layer for gradient
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, // Safe-area padding 8-10px
    ...Platform.select({
      web: {
        background: 'linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
        backdropFilter: 'blur(22px)',
      },
    }),
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    position: 'relative',
    minWidth: 44, // Minimum 44x44 hit area
    minHeight: 44,
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
    fontSize: 12, // 11-12px
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)', // Default state
    marginTop: 4,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockLabelActive: {
    fontSize: 12, // 11-12px
    fontWeight: '500',
    color: 'rgba(255,255,255,0.95)', // Active state
    marginTop: 4,
    letterSpacing: 0.2,
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
  
  // Expansion View Styles - Refined Atmospheric System
  expansionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  expansionBlurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  expansionBlur: {
    flex: 1,
  },
  // Warm-Neutral Frost Tone Overlay
  expansionFrostTone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(212,190,132,0.08)', // Gold hue lift
  },
  // Vertical Gradient Depth Overlay
  expansionGradientDepth: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  expansionDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,10,10,0.55)', // Dark neutral veil
  },
  // Redesigned Header Bar with Background Image
  expansionTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height * 0.18, // 18% of screen
    zIndex: 1001,
  },
  headerBackgroundImage: {
    flex: 1,
    width: '100%',
  },
  headerBackgroundImageStyle: {
    opacity: 0.9,
  },
  headerFrostedPane: {
    flex: 1,
    backgroundColor: 'rgba(15,15,15,0.55)',
  },
  headerGoldGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#EAE7DF', // Warm ivory
    letterSpacing: 0.3,
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(234,231,223,0.6)',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, sans-serif',
    }),
  },
  headerSeparatorLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerFadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  // Close Pill with Gradient - Tactile Frosted Glass Capsule
  headerCloseButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  closePillGradient: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,190,132,0.25)', // Gold border highlight
  },
  closePillBlur: {
    borderRadius: 20,
  },
  closePillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)', // Engraved feel
      },
    }),
  },
  headerCloseIcon: {
    fontSize: 14,
    color: '#E9E4D0', // Gold-white
    marginRight: 6,
  },
  headerCloseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E9E4D0', // Gold-white
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, sans-serif',
    }),
  },
  // Frosted Feed Container
  expansionFeedContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.18, // Below header (18% of screen)
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    backgroundColor: 'rgba(10,10,10,0.55)', // Dark glass tone
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)', // Depth blur
      },
    }),
  },
  expansionCardFeed: {
    flex: 1,
  },
  expansionCardFeedContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  expansionCardWrapper: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  // SINGLE CITY & MULTI-CITY BRONZE TITLES - Luminous Sand Tone
  singleCityTitleBronze: {
    fontSize: 20, // +1px bump for emphasis
    fontWeight: '600', // Semi-bold
    color: '#E9D4A0', // Warm luminous sand tone
    letterSpacing: 0.4,
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.35)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
      },
      web: {
        textShadow: '0 0 3px rgba(0,0,0,0.35), 0 0 2px rgba(212,184,130,0.25)', // Outer glow + inner bronze glow
        filter: 'contrast(1.15) brightness(1.1)',
      },
    }),
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  circuitTitleBronze: {
    fontSize: 20, // +1px bump for emphasis
    fontWeight: '600', // Semi-bold
    color: '#E9D4A0', // Warm luminous sand tone (same as single-city for cohesion)
    letterSpacing: 0.4,
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.35)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3,
      },
      web: {
        textShadow: '0 0 3px rgba(0,0,0,0.35), 0 0 2px rgba(212,184,130,0.25)', // Outer glow + inner bronze glow
        filter: 'contrast(1.15) brightness(1.1)',
      },
    }),
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  // SINGLE CITY - Sensory Pills Row
  sensoryPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping if needed
    marginBottom: 8,
    gap: 6,
  },
  sensoryPillSingle: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.4)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.25)', // Drop shadow + specular line
      },
    }),
  },
  sensoryPillBlur: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.15)', // Linear gradient simulation start
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.25)', // Top specular line
    borderBottomWidth: 0,
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
      },
    }),
  },
  sensoryPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.95)', // Near-white for visibility
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  // SINGLE CITY - Narrative Duration - Refined String Pill Style
  narrativeDuration: {
    fontSize: 11,
    fontWeight: '500', // Medium weight
    fontStyle: 'italic', // Adds curatorial feel
    color: 'rgba(255,255,255,0.80)', // White @ 80%
    letterSpacing: 0.2, // Breathing room
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  narrativeDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  // MULTI-CITY - Route Flow Row
  routeFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  microPostcard: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.25)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.25), inset 0 0 1px rgba(0,0,0,0.1)',
      },
    }),
  },
  microPostcardBlur: {
    paddingVertical: 3,
    paddingHorizontal: 7, // Reduced padding for three pills
    backgroundColor: 'rgba(200,210,220,0.2)', // Cool glass tone
    borderWidth: 0,
  },
  microPostcardText: {
    fontSize: 12,
    fontWeight: '500', // Increased from 400 for better visibility
    color: 'rgba(255,255,255,0.9)', // White @ 90%
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  routeArrow: {
    fontSize: 12,
    color: 'rgba(192,167,124,0.60)',
    marginHorizontal: 4,
  },
  // MULTI-CITY - Mood Descriptor Row
  moodDescriptorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping if needed
    marginBottom: 8,
    gap: 6,
    width: '100%', // Ensure full width to prevent cutoff
  },
  moodChip: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.4)', // Match city pills border
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.25), inset 0 0.5px 0 rgba(255,255,255,0.25)', // Match specular
      },
    }),
  },
  moodChipBlur: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.15)', // Match single-city mood pills
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.25)', // Top specular line
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
      },
    }),
  },
  moodChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.95)', // Match single-city (white @ 95%)
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  // MULTI-CITY - Duration
  durationText: {
    fontSize: 11,
    fontWeight: '500', // Medium weight
    fontStyle: 'italic', // For curatorial feel
    color: 'rgba(255,255,255,0.85)', // White @ 85%
    letterSpacing: 0.3, // Breathing room
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  // FLOATING SEARCH CANVAS STYLES
  searchCanvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radialBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropBlur: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backdropTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  liquidGlassPane: {
    width: '85%',
    maxWidth: 500,
    maxHeight: '70%',
    minHeight: 400,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(30,25,20,0.45)',
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.25)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.45)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 40,
      },
      android: {
        elevation: 30,
      },
      web: {
        boxShadow: '0 6px 40px rgba(0,0,0,0.45)',
      },
    }),
  },
  sunsetBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  sunsetImageStyle: {
    opacity: 0.15,
  },
  motionBeam: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    zIndex: 1,
  },
  glassBlurLayer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  paneContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 2,
  },
  searchPill: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchPillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIconCanvas: {
    marginRight: 10,
  },
  searchInputCanvas: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  resultsScroll: {
    flex: 1,
    marginBottom: 10,
  },
  suggestedCitiesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  citiesScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  miniCityCard: {
    width: 140,
    height: 100,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  miniCityImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  miniCityImageStyle: {
    borderRadius: 12,
  },
  miniCityOverlay: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  miniCityName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E1C48A',
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  miniCityRegion: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  curatedJourneysSection: {
    marginBottom: 20,
  },
  miniJourneyCard: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  journeyCardBlur: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  journeyCardContent: {
    padding: 14,
  },
  publisherTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(212,184,130,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(212,184,130,0.3)',
  },
  publisherTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#D4B882',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E1C48A',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  journeyCityPills: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 6,
  },
  miniCityPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(200,210,220,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  miniCityPillText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  journeyTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  emptySearchState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  centerGlobeIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    opacity: 0.9,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  // SEARCH RESULTS STYLES - Matching City & Curated Journeys
  matchingCitySection: {
    paddingTop: 12,
    paddingLeft: 18,
    paddingRight: 18,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Inter',
      web: 'SF Pro Display, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  heroCityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(233,212,160,0.15)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 0 10px rgba(233,212,160,0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      },
    }),
  },
  heroCityBlur: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  heroCityImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  heroCityImageStyle: {
    borderRadius: 10,
    ...Platform.select({
      web: {
        filter: 'blur(2px)',
      },
    }),
  },
  heroCityContent: {
    flex: 1,
  },
  heroCityTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#E9D4A0',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Inter',
      web: 'SF Pro Display, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  heroCitySubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Inter',
      web: 'SF Pro Display, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  curatedJourneysSearchSection: {
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  sectionDivider: {
    height: 0.5,
    width: '70%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  curatedJourneyCard: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.35)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
      },
    }),
  },
  curatedJourneyBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
    minHeight: 90,
  },
  curatedJourneyContent: {
    flex: 1,
    paddingRight: 12,
  },
  publisherTagSearch: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(212,184,130,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(212,184,130,0.3)',
    marginBottom: 8,
  },
  publisherTagTextSearch: {
    fontSize: 10,
    fontWeight: '500',
    color: '#D4B882',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  curatedJourneyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E9D4A0',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Inter',
      web: 'SF Pro Display, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  curatedJourneySubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'Inter',
      web: 'SF Pro Display, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  moodTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  moodTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.05)',
    ...Platform.select({
      web: {
        background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
      },
    }),
  },
  moodTagText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  viewPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(233,212,160,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(233,212,160,0.25)',
    alignSelf: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(233,212,160,0.15)',
      },
    }),
  },
  viewPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#E9D4A0',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  noResultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
});