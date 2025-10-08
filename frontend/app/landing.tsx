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

interface DestinationCard {
  id: string
  city: string
  tagline: string
  image: string
  transport?: TransportInfo[]
  feature: string
}

interface TransportInfo {
  icon: keyof typeof Ionicons.glyphMap
  time: string
}

const weekendDestinations: DestinationCard[] = [
  {
    id: 'sonoma',
    city: 'Sonoma',
    tagline: 'Wine alleys & golden light',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/cjd9m4ea_Sonoma.jpg',
    transport: [
      { icon: 'car-outline', time: '1h 30m' },
      { icon: 'train-outline', time: '2h 10m' }
    ],
    feature: 'Condé Nast'
  },
  {
    id: 'carmel',
    city: 'Carmel-by-the-Sea',
    tagline: 'Cliffside cafés & slow tides',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg',
    transport: [
      { icon: 'car-outline', time: '2h 15m' },
      { icon: 'train-outline', time: '2h 45m' }
    ],
    feature: 'Condé Nast'
  },
  {
    id: 'bigsur',
    city: 'Big Sur',
    tagline: 'Misty cliffs & endless roads',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg',
    transport: [
      { icon: 'car-outline', time: '3h 05m' },
      { icon: 'airplane-outline', time: '1h 15m' }
    ],
    feature: 'Condé Nast'
  }
]

const inspireMeDestinations: DestinationCard[] = [
  {
    id: 'amalfi',
    city: 'Amalfi Coast',
    tagline: 'Cliffside lemon groves & sea whispers',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    feature: "Editor's Pick"
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    tagline: 'Spring rituals & silent gardens',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    feature: "Editor's Pick"
  },
  {
    id: 'iceland',
    city: 'Iceland',
    tagline: 'Glaciers, mist, and endless light',
    image: 'https://images.unsplash.com/photo-1539066688414-9a2c2112febd?w=800&q=80',
    feature: "Editor's Pick"
  }
]

export default function Landing() {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState('weekend')
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const modeTransition = useRef(new Animated.Value(1)).current
  const dockGlowAnim = useRef(new Animated.Value(0)).current
  const cardScrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleModeSwitch = (mode: string) => {
    if (mode === activeMode) return

    Animated.sequence([
      Animated.timing(modeTransition, {
        toValue: 0.7,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(modeTransition, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start()

    setActiveMode(mode)
    setCurrentCardIndex(0)
    
    // Scroll to first card
    setTimeout(() => {
      cardScrollRef.current?.scrollTo({ x: 0, animated: true })
    }, 50)
  }

  const handleBookmark = (itemId: string) => {
    const isBookmarked = bookmarkedItems.includes(itemId)
    
    if (isBookmarked) {
      setBookmarkedItems(prev => prev.filter(id => id !== itemId))
    } else {
      setBookmarkedItems(prev => [...prev, itemId])
      
      // Animate dock glow
      Animated.sequence([
        Animated.timing(dockGlowAnim, {
          toValue: 1,
          duration: 200,
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

  const renderDestinationCard = (destination: DestinationCard) => (
    <View key={destination.id} style={styles.cardContainer}>
      <ImageBackground
        source={{ uri: destination.image }}
        style={styles.destinationCard}
        imageStyle={styles.cardImage}
      >
        {/* Overlay Gradient */}
        <View style={styles.cardOverlay} />
        
        {/* Bookmark Icon */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => handleBookmark(destination.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={bookmarkedItems.includes(destination.id) ? "bookmark" : "bookmark-outline"}
            size={22}
            color={bookmarkedItems.includes(destination.id) ? "#C9A96D" : "rgba(255,255,255,0.85)"}
          />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.cardContent}>
          <BlurView intensity={14} tint="light" style={styles.textPanel}>
            <View style={styles.textPanelInner}>
              <Text style={styles.cityName}>{destination.city}</Text>
              <Text style={styles.cityTagline}>{destination.tagline}</Text>
            </View>
          </BlurView>

          {/* Transport Row (Weekend only) */}
          {activeMode === 'weekend' && destination.transport && (
            <View style={styles.transportRow}>
              {destination.transport.map((transport, index) => (
                <BlurView key={index} intensity={12} tint="light" style={styles.transportChip}>
                  <View style={styles.transportChipInner}>
                    <Ionicons name={transport.icon} size={16} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.transportTime}>{transport.time}</Text>
                  </View>
                </BlurView>
              ))}
            </View>
          )}

          {/* Feature Tag */}
          <BlurView intensity={20} tint="light" style={styles.featureTag}>
            <View style={styles.featureTagInner}>
              <Text style={styles.featureText}>{destination.feature}</Text>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
  )

  const getCurrentDestinations = () => {
    return activeMode === 'weekend' ? weekendDestinations : inspireMeDestinations
  }

  const getCarouselTitle = () => {
    return activeMode === 'weekend' 
      ? 'Closer than you think — perfect weekends await.'
      : 'Faraway places, nearer dreams.'
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TRĀVEA</Text>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingMain}>Good to see you, Anish.</Text>
          <Text style={styles.greetingSub}>Let's find your next escape.</Text>
        </View>

        {/* Mode Chips */}
        <View style={styles.modeChipsContainer}>
          <TouchableOpacity
            style={[styles.modeChip, activeMode === 'weekend' && styles.modeChipActive]}
            onPress={() => handleModeSwitch('weekend')}
            activeOpacity={0.8}
          >
            <BlurView intensity={18} tint="light" style={styles.chipBlur}>
              <View style={styles.chipContent}>
                <Text style={styles.chipIcon}>🛫</Text>
                <Text style={styles.chipLabel}>Weekend</Text>
              </View>
            </BlurView>
            {activeMode === 'weekend' && <View style={styles.chipUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeChip, activeMode === 'inspire' && styles.modeChipActive]}
            onPress={() => handleModeSwitch('inspire')}
            activeOpacity={0.8}
          >
            <BlurView intensity={18} tint="light" style={styles.chipBlur}>
              <View style={styles.chipContent}>
                <Text style={styles.chipIcon}>🌿</Text>
                <Text style={styles.chipLabel}>Inspire Me</Text>
              </View>
            </BlurView>
            {activeMode === 'inspire' && <View style={styles.chipUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeChip, activeMode === 'search' && styles.modeChipActive]}
            onPress={() => handleModeSwitch('search')}
            activeOpacity={0.8}
          >
            <BlurView intensity={18} tint="light" style={styles.chipBlur}>
              <View style={styles.chipContent}>
                <Text style={styles.chipIcon}>📍</Text>
                <Text style={styles.chipLabel}>Search</Text>
              </View>
            </BlurView>
            {activeMode === 'search' && <View style={styles.chipUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Carousel Section */}
        {activeMode !== 'search' && (
          <Animated.View style={[styles.carouselSection, { opacity: modeTransition }]}>
            <Text style={styles.carouselTitle}>{getCarouselTitle()}</Text>
            
            <ScrollView
              ref={cardScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              contentContainerStyle={styles.carouselContent}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width)
                setCurrentCardIndex(index)
              }}
            >
              {getCurrentDestinations().map(renderDestinationCard)}
            </ScrollView>
          </Animated.View>
        )}

        {/* Search Mode Placeholder */}
        {activeMode === 'search' && (
          <View style={styles.searchPlaceholder}>
            <Text style={styles.searchText}>Search functionality coming soon...</Text>
          </View>
        )}
      </Animated.View>

      {/* Bottom Dock */}
      <View style={styles.bottomDock}>
        <BlurView intensity={25} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="home-outline" size={22} color="#F8F8F8" />
              <Text style={styles.dockLabel}>Home</Text>
              <View style={styles.dockActiveIndicator} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Ionicons name="map-outline" size={24} color="rgba(255,255,255,0.75)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
              <Animated.View style={[styles.dockGlowContainer, { opacity: dockGlowAnim }]}>
                <View style={styles.dockGlow} />
              </Animated.View>
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.75)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
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
    backgroundColor: '#161616',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#161616',
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #161616 0%, #222222 100%)',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, rgba(201,169,109,0.08) 0%, transparent 70%)',
        }
      },
    }),
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 3.6, // +0.15em * 24px
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #F8F8F8 0%, #C9A96D 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(201,169,109,0.3)',
      },
    }),
  },
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  greetingMain: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 0 12px rgba(201,169,109,0.2)',
      },
    }),
  },
  greetingSub: {
    fontSize: 14,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.75)',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  modeChipsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  modeChip: {
    width: 108,
    height: 44,
    borderRadius: 20,
    position: 'relative',
  },
  modeChipActive: {
    // Active styling handled by underline
  },
  chipBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  chipContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  chipUnderline: {
    position: 'absolute',
    bottom: -2,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: '#C9A96D',
    borderRadius: 1,
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(201,169,109,0.5)',
      },
    }),
  },
  carouselSection: {
    flex: 1,
    marginBottom: 100, // Space for dock
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: 12,
  },
  cardContainer: {
    width: width - 24,
    marginHorizontal: 12,
  },
  destinationCard: {
    height: height * 0.75,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 30px rgba(0,0,0,0.45)',
      },
    }),
  },
  cardImage: {
    borderRadius: 28,
  },
  cardOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.25))',
      },
    }),
  },
  bookmarkButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(25,25,25,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  textPanel: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
  },
  textPanelInner: {
    backgroundColor: 'rgba(25,25,25,0.35)',
    padding: 20,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  cityTagline: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  transportRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  transportChip: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  transportChipInner: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  transportTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  featureTag: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureTagInner: {
    backgroundColor: 'rgba(25,25,25,0.45)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  searchPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  searchText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  bottomDock: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dockContainer: {
    width: '92%',
    height: 62,
    borderRadius: 26,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
      },
    }),
  },
  dockContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.45)',
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
    fontSize: 11,
    color: '#F8F8F8',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockLabelInactive: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockActiveIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(201,169,109,0.8)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 6px rgba(201,169,109,0.4)',
      },
    }),
  },
});