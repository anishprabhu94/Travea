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
  transport: TransportInfo[]
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
    ]
  },
  {
    id: 'carmel',
    city: 'Carmel-by-the-Sea',
    tagline: 'Cliffside cafés & slow tides',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/wokepbpr_carmel.jpg',
    transport: [
      { icon: 'car-outline', time: '2h 15m' },
      { icon: 'train-outline', time: '2h 45m' }
    ]
  },
  {
    id: 'bigsur',
    city: 'Big Sur',
    tagline: 'Misty cliffs & endless roads',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/pk6sky07_big%20sur.jpg',
    transport: [
      { icon: 'car-outline', time: '3h 05m' },
      { icon: 'airplane-outline', time: '1h 15m' }
    ]
  }
]

export default function Landing() {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState('weekend')
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current
  const carouselOpacity = useRef(new Animated.Value(1)).current
  const dockGlowAnim = useRef(new Animated.Value(0)).current
  const cardScrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleModeSwitch = (mode: string) => {
    if (mode === activeMode) return
    setActiveMode(mode)
  }

  const handleBookmark = (itemId: string) => {
    const isBookmarked = bookmarkedItems.includes(itemId)
    
    if (isBookmarked) {
      setBookmarkedItems(prev => prev.filter(id => id !== itemId))
    } else {
      setBookmarkedItems(prev => [...prev, itemId])
      
      // Animate dock glow for "My Trips"
      Animated.sequence([
        Animated.timing(dockGlowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dockGlowAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start()
    }
  }

  const onScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffset / width)
    setCurrentCardIndex(index)
  }

  const renderDestinationCard = (destination: DestinationCard, index: number) => (
    <View key={destination.id} style={styles.cardWrapper}>
      <ImageBackground
        source={{ uri: destination.image }}
        style={styles.destinationCard}
        imageStyle={styles.cardImage}
      >
        {/* Bookmark Icon */}
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => handleBookmark(destination.id)}
          activeOpacity={0.8}
        >
          <BlurView intensity={15} tint="light" style={styles.bookmarkBlur}>
            <View style={styles.bookmarkInner}>
              <Ionicons
                name={bookmarkedItems.includes(destination.id) ? "bookmark" : "bookmark-outline"}
                size={20}
                color={bookmarkedItems.includes(destination.id) ? "#C9A96D" : "rgba(255,255,255,0.9)"}
              />
            </View>
          </BlurView>
        </TouchableOpacity>

        {/* Mid-left Floating Content Block */}
        <View style={styles.contentBlockContainer}>
          <BlurView intensity={20} tint="light" style={styles.contentBlock}>
            <View style={styles.contentBlockInner}>
              {/* City Name */}
              <Text style={styles.cityName}>{destination.city}</Text>
              
              {/* Tagline */}
              <Text style={styles.cityTagline}>{destination.tagline}</Text>
              
              {/* Transport Row */}
              <View style={styles.transportRow}>
                {destination.transport.map((transport, transportIndex) => (
                  <View key={transportIndex} style={styles.transportItem}>
                    <Ionicons 
                      name={transport.icon} 
                      size={16} 
                      color="rgba(255,255,255,0.85)" 
                      style={styles.transportIcon}
                    />
                    <Text style={styles.transportTime}>{transport.time}</Text>
                  </View>
                ))}
              </View>
              
              {/* Bronze Pill Tag */}
              <View style={styles.pillTagContainer}>
                <BlurView intensity={18} tint="light" style={styles.pillTag}>
                  <View style={styles.pillTagInner}>
                    <Text style={styles.pillTagText}>Condé Nast</Text>
                  </View>
                </BlurView>
              </View>
            </View>
          </BlurView>
        </View>
      </ImageBackground>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.background} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          {/* TRĀVEA Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TRĀVEA</Text>
          </View>
          
          {/* Profile Icon */}
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
            <BlurView intensity={20} tint="light" style={styles.profileBlur}>
              <View style={styles.profileInner}>
                <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.9)" />
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingMain}>Good to see you, Anish.</Text>
          <Text style={styles.greetingSub}>Let's find your next escape.</Text>
        </View>

        {/* Mode Pills */}
        <View style={styles.modePillsContainer}>
          <TouchableOpacity
            style={[styles.modePill, activeMode === 'weekend' && styles.modePillActive]}
            onPress={() => handleModeSwitch('weekend')}
            activeOpacity={0.8}
          >
            <BlurView intensity={18} tint="light" style={styles.pillBlur}>
              <View style={styles.pillContent}>
                <Ionicons name="airplane-outline" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.pillLabel}>Weekend</Text>
              </View>
            </BlurView>
            {activeMode === 'weekend' && <View style={styles.pillUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, activeMode === 'inspire' && styles.modePillActive]}
            onPress={() => handleModeSwitch('inspire')}
            activeOpacity={0.8}
          >
            <BlurView intensity={18} tint="light" style={styles.pillBlur}>
              <View style={styles.pillContent}>
                <Ionicons name="leaf-outline" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.pillLabel}>Inspire Me</Text>
              </View>
            </BlurView>
            {activeMode === 'inspire' && <View style={styles.pillUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, activeMode === 'search' && styles.modePillActive]}
            onPress={() => handleModeSwitch('search')}
            activeOpacity={0.8}
          >
            <BlurView intensity={18} tint="light" style={styles.pillBlur}>
              <View style={styles.pillContent}>
                <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.pillLabel}>Search</Text>
              </View>
            </BlurView>
            {activeMode === 'search' && <View style={styles.pillUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>Closer than you think — perfect weekends await.</Text>
        </View>

        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <Animated.View style={{ opacity: carouselOpacity }}>
            <ScrollView
              ref={cardScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.carousel}
              contentContainerStyle={styles.carouselContent}
              onScroll={onScroll}
              scrollEventThrottle={16}
            >
              {weekendDestinations.map((destination, index) => 
                renderDestinationCard(destination, index)
              )}
            </ScrollView>
          </Animated.View>
        </View>
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
              <Ionicons name="map-outline" size={22} color="rgba(255,255,255,0.75)" />
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
    zIndex: 0,
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, #161616 0%, #222222 100%)',
      },
    }),
  },
  content: {
    flex: 1,
    paddingTop: 50,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    letterSpacing: 4.8, // Spaced letters as requested
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
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profileBlur: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileInner: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
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
  modePillsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  modePill: {
    width: 108, // Same size for all pills
    height: 44,
    borderRadius: 20,
    position: 'relative',
  },
  modePillActive: {
    // Active styling handled by underline
  },
  pillBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  pillContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pillLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  pillUnderline: {
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
  taglineContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'left', // Left-aligned as requested
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  carouselContainer: {
    flex: 1,
    marginBottom: 90, // Space for bottom dock
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  cardWrapper: {
    width: width,
    paddingHorizontal: 24,
  },
  destinationCard: {
    height: height * 0.72, // 72% of screen height as requested
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
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
  bookmarkButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    zIndex: 10,
  },
  bookmarkBlur: {
    flex: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  bookmarkInner: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBlockContainer: {
    position: 'absolute',
    left: 24,
    top: '25%', // Positioned in the middle-left area
    width: '40%', // 40% width as requested
    height: '50%', // 50% height as requested
    justifyContent: 'center',
  },
  contentBlock: {
    borderRadius: 20,
    overflow: 'hidden',
    flex: 1,
  },
  contentBlockInner: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)', // As specified
    padding: 20,
    justifyContent: 'center',
  },
  cityName: {
    fontSize: 24,
    fontWeight: '600', // Semi-bold as requested
    color: '#F8F8F8',
    marginBottom: 8,
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
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  transportRow: {
    marginBottom: 16,
  },
  transportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transportIcon: {
    marginRight: 8,
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
  pillTagContainer: {
    alignSelf: 'flex-start',
  },
  pillTag: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  pillTagInner: {
    backgroundColor: '#C9A96D', // Bronze background as requested
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
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
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#C9A96D', // Bronze underline as requested
    ...Platform.select({
      web: {
        boxShadow: '0 0 6px rgba(201,169,109,0.4)',
      },
    }),
  },
});