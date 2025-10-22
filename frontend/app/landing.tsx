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
import TraveaWordmark from '../components/TraveaWordmark'

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
  // 2 MULTI-CITY CIRCUITS
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
  const [activeMode, setActiveMode] = useState('vacations') // Default to Vacations
  const [expandedCarousel, setExpandedCarousel] = useState<string | null>(null)
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
    setActiveMode(mode)
    console.log(`Switched to mode: ${mode}`)
    
    // Reset scroll to top when switching tabs
    setTimeout(() => {
      if (Platform.OS === 'web') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
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
    
    if (activeMode === 'vacations') {
      // For You Tab: Curated + Multi-City Circuits + Quick Getaways
      return [
        { 
          id: 'vacations_curated', 
          title: 'Curated for You', 
          cards: baseCards.slice(2, 6).map((card, index) => ({
            ...card,
            id: `vacations_curated_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        },
        { 
          id: 'vacations_circuits', 
          title: 'Multi-City Circuits', 
          cards: baseCards.slice(0, 2).map((card, index) => ({
            ...card,
            id: `vacations_circuits_${card.id}_${index}`,
          }))
        },
        { 
          id: 'vacations_quick', 
          title: 'Quick Getaways', 
          cards: baseCards.slice(6, 10).map((card, index) => ({
            ...card,
            id: `vacations_quick_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        }
      ]
    } else if (activeMode === 'discover') {
      // Discover Tab: Trending Now + Slow Living + Hidden Gems
      return [
        { 
          id: 'discover_trending', 
          title: 'Trending Now', 
          cards: baseCards.slice(0, 4).map((card, index) => ({
            ...card,
            id: `discover_trending_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        },
        { 
          id: 'discover_slow', 
          title: 'Slow Living', 
          cards: baseCards.slice(4, 8).map((card, index) => ({
            ...card,
            id: `discover_slow_${card.id}_${index}`,
            isCondeNastPick: index < 2
          }))
        },
        { 
          id: 'discover_gems', 
          title: 'Hidden Gems', 
          cards: baseCards.slice(8, 12).map((card, index) => ({
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
          if (destination.isMultiCity) {
            router.push(`/multi-city-destination?id=${destination.id}`)
          } else {
            router.push(`/destination?id=${destination.id}&city=${destination.city}&region=${destination.region}`)
          }
        }}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: destination.image }}
          style={styles.destinationCard}
          imageStyle={styles.cardImage}
        >
        {/* Soft neutral grey veil overlay */}
        <View style={styles.cardGreyVeilOverlay} />
        
        {/* Refined vignette with depth */}
        <View style={styles.cardVignetteOverlay} />
        
        {/* Bookmark Icon with Frosted Container */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => {
            console.log('=== BOOKMARK BUTTON CLICKED ===')
            console.log('City:', destination.city)
            console.log('ID:', destination.id)
            console.log('Base ID extracted:', getBaseId(destination.id))
            
            // Use the simple destination ID
            handleBookmark(destination.id)
          }}
          activeOpacity={0.8}
        >
          <Animated.View style={[{ transform: [{ scale: getBookmarkAnimation(destination.id) }] }]}>
            <BlurView intensity={18} tint="light" style={styles.bookmarkContainer}>
              <View style={styles.bookmarkInner}>
                <Ionicons
                  name={bookmarkedItems.includes(getBaseId(destination.id)) ? "bookmark" : "bookmark-outline"}
                  size={16}
                  color={bookmarkedItems.includes(getBaseId(destination.id)) ? "#C9A96D" : "rgba(201,169,109,0.8)"}
                />
              </View>
            </BlurView>
          </Animated.View>
        </TouchableOpacity>

        {/* Luxury Frosted Info Pane */}
        <View style={styles.luxuryInfoContainer}>
          <BlurView intensity={25} tint="light" style={styles.luxuryInfoPane}>
            <View style={styles.luxuryInfoInner}>
              {/* Refined Destination Header: "City, Country" or Multi-City Timeline */}
              {destination.isMultiCity && destination.cities ? (
                <View style={styles.multiCityContainer}>
                  {/* Circuit Title */}
                  {destination.circuitTitle && (
                    <Text style={styles.circuitTitle}>{destination.circuitTitle}</Text>
                  )}
                  {/* City Pills with Full Names - Scrollable */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.cityPillsScroll}
                  >
                    <View style={styles.cityTimelineRow}>
                      {destination.cities.map((city, idx) => (
                        <React.Fragment key={idx}>
                          <View style={styles.cityPill}>
                            <Text style={styles.cityPillText}>{city}</Text>
                          </View>
                          {idx < destination.cities!.length - 1 && (
                            <View style={styles.cityDot} />
                          )}
                        </React.Fragment>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <View style={styles.destinationHeader}>
                  <Text style={styles.destinationCity}>{destination.city}, </Text>
                  <Text style={styles.destinationRegion}>{destination.region}</Text>
                </View>
              )}
              
              {/* Editorial Tagline or Days */}
              <Text style={styles.editorialTagline} numberOfLines={1} ellipsizeMode="tail">
                {destination.tagline}
              </Text>
              
              {/* Transport Info */}
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
              
              {/* Editorial Badge - Condé Nast (conditional) */}
              {destination.isCondeNastPick && (
                <View style={styles.editorialBadge}>
                  <View style={styles.editorialBadgeInner}>
                    <Text style={styles.editorialBadgeText}>Condé Nast</Text>
                  </View>
                </View>
              )}
            </View>
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <TraveaWordmark />
          </View>
          
          {/* Profile */}
          <TouchableOpacity style={styles.profileIcon} activeOpacity={0.8}>
            <BlurView intensity={24} tint="dark" style={styles.profileIconBlur}>
              <Ionicons name="person-outline" size={18} color="rgba(255,255,255,0.9)" />
            </BlurView>
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
          <Text style={styles.greetingMain}>Hello, Anish.</Text>
          <Text style={styles.greetingSub}>
            {activeMode === 'vacations' && 'Curated trips, just for you.'}
            {activeMode === 'discover' && 'Hidden gems, waiting to be found.'}
            {activeMode === 'search' && 'Where would you like to go?'}
          </Text>
        </Animated.View>

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

        {/* Search Pane */}
        {activeMode === 'search' && (
          <View style={styles.searchContainer}>
            <ImageBackground
              source={{ uri: 'https://customer-assets.emergentagent.com/job_c851a5c2-e443-4a96-b503-41a7575b9658/artifacts/86nrn7i6_output%20%286%29.jpg' }}
              style={styles.searchImageBackground}
              imageStyle={styles.searchImageStyle}
            >
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
                    <Ionicons name="arrow-forward-circle-outline" size={20} color="rgba(201,169,109,0.9)" style={styles.searchArrow} />
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
                      <TouchableOpacity 
                        key={index} 
                        activeOpacity={0.7} 
                        style={styles.trendingPillWrapper}
                        onPress={() => router.push(`/destination?city=${destination}`)}
                      >
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
          </ImageBackground>
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
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/bookings')}
            >
              <Ionicons name="calendar" size={22} color="rgba(255,255,255,0.7)" />
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
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/concierge')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
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
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16, // Match parent radius
  },
  chipContentActive: {
    backgroundColor: 'rgba(201,169,109,0.15)', // Elegant light bronze fill
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
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20, // Adjust radius to match new chip radius
    backgroundColor: 'transparent', // Transparent background for glow only
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(201,169,109,0.6)', // Soft bronze glow as specified
      },
      default: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 5,
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
    marginTop: 32, // Add elegant spacing between tabs and carousel content
  },
  scrollableContentContainer: {
    paddingBottom: 120, // Space for bottom dock
  },
  carouselSection: {
    marginTop: 40,
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
  cardVignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    ...Platform.select({
      web: {
        backgroundColor: 'rgba(0,0,0,0.08)', // Subtle overlay (gradient removed for RN Web compatibility)
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
    width: 42, // Further increased for even better visibility
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
  },
  bookmarkInner: {
    flex: 1,
    backgroundColor: 'rgba(10,10,10,0.85)', // Much darker background for higher contrast
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)', // Subtle border for definition
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
  
  // Multi-City Circuit Styles (Matching Trip Canvas)
  multiCityContainer: {
    marginBottom: 4,
  },
  circuitTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 10,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  cityPillsScroll: {
    marginBottom: 6,
  },
  cityTimelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(201,169,109,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(201,169,109,0.5)',
  },
  cityPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C9A96D',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(201,169,109,0.6)',
    marginHorizontal: 8,
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
  searchArrow: {
    marginLeft: 'auto',
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
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(15,15,15,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  trendingPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C9A96D',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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