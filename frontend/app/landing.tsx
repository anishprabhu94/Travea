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
  TextInput 
} from 'react-native'
import { useRouter } from 'expo-router'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import TraveaWordmark from '../components/TraveaWordmark'

const { width, height } = Dimensions.get('window')

interface Mode {
  id: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
  image: string
  title: string
  subtitle: string
  content: string[]
  cta: string
}

const modes: Mode[] = [
  {
    id: 'weekend',
    label: 'Weekend Trips',
    icon: 'airplane-outline',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/nbtzgzgu_weekend%202.jpg',
    title: 'Weekend Escapes',
    subtitle: 'Short trips nearby for a quick reset.',
    content: ['Sonoma – 1.5h drive', 'Big Sur – 2h drive', 'Carmel – 1h'],
    cta: 'Explore Nearby'
  },
  {
    id: 'inspire',
    label: 'Inspire Me',
    icon: 'leaf-outline',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/9fi0vlp6_seasonal%203.jpg',
    title: 'Get Inspired',
    subtitle: 'Explore destinations worth adding to your list.',
    content: ['Kyoto in Spring', 'Santorini Summers', 'Iceland\'s Winter Glow'],
    cta: 'See Inspiration'
  },
  {
    id: 'search',
    label: 'Search',
    icon: 'search-outline',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sh631agb_globe.jpg',
    title: 'Know where you\'re going?',
    subtitle: 'Find guides, stays, and highlights for your chosen city.',
    content: [],
    cta: ''
  }
]

export default function Landing() {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState('weekend')
  
  // Animation refs
  const greetingAnim = useRef(new Animated.Value(0)).current
  const modeChipsAnim = useRef(new Animated.Value(0)).current
  const heroAnim = useRef(new Animated.Value(0)).current
  const contentOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      Animated.timing(greetingAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(modeChipsAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start()
  }, [])

  const handleModePress = (modeId: string) => {
    if (modeId === activeMode) return

    // Cross-fade animation
    Animated.timing(contentOpacity, {
      toValue: 0.7,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setActiveMode(modeId)
      // Fade in new content with slight upward movement
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    })
  }

  const activeModeData = modes.find(mode => mode.id === activeMode)!

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <ImageBackground
        source={{
          uri: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/71gsrwd0_output%20%286%29.jpg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />
      </ImageBackground>

      {/* Header Section */}
      <View style={styles.header}>
        {/* Logo with gradient glow */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>TRĀVEA</Text>
        </View>
        
        {/* Profile Icon */}
        <TouchableOpacity style={styles.profileIcon}>
          <Ionicons name="person-outline" size={24} color="#F8F8F8" />
        </TouchableOpacity>
      </View>

      {/* Greeting Block */}
      <Animated.View
        style={[
          styles.greetingBlock,
          {
            opacity: greetingAnim,
            transform: [{
              translateY: greetingAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              })
            }]
          }
        ]}
      >
        <Text style={styles.greetingMain}>Good to see you, Anish.</Text>
        <Text style={styles.greetingSub}>Let's find your next escape.</Text>
      </Animated.View>

      {/* Inspiration Header */}
      <View style={styles.inspirationHeader}>
        <Text style={styles.inspirationText}>Choose your next escape.</Text>
      </View>

      {/* Mode Chips */}
      <Animated.View
        style={[
          styles.modeChipsContainer,
          {
            opacity: modeChipsAnim,
          }
        ]}
      >
        <View style={styles.modeChipsRow}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[
                styles.modeChip,
                activeMode === mode.id && styles.modeChipActive
              ]}
              onPress={() => handleModePress(mode.id)}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint="light" style={styles.chipBlur}>
                <View style={styles.chipContent}>
                  <Ionicons 
                    name={mode.icon} 
                    size={16} 
                    color="#F8F8F8"
                    style={styles.chipIcon} 
                  />
                  <Text style={styles.chipLabel}>{mode.label}</Text>
                </View>
              </BlurView>
              {activeMode === mode.id && (
                <View style={styles.chipActiveIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Dynamic Hero Tile */}
      <Animated.View
        style={[
          styles.heroContainer,
          {
            opacity: heroAnim,
            transform: [{
              scale: heroAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.98, 1],
              })
            }]
          }
        ]}
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          {activeMode === 'search' ? (
            // Search Mode - Transform to search bar
            <BlurView intensity={25} tint="light" style={styles.searchContainer}>
              <View style={styles.searchContent}>
                <Text style={styles.searchTitle}>{activeModeData.title}</Text>
                <Text style={styles.searchSubtitle}>{activeModeData.subtitle}</Text>
                
                <View style={styles.searchBarContainer}>
                  <BlurView intensity={25} tint="light" style={styles.searchBar}>
                    <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.65)" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search destination..."
                      placeholderTextColor="rgba(255,255,255,0.65)"
                    />
                  </BlurView>
                </View>
              </View>
            </BlurView>
          ) : (
            // Weekend/Inspire Mode - Regular hero tile
            <ImageBackground
              source={{ uri: activeModeData.image }}
              style={styles.heroTile}
              imageStyle={{ borderRadius: 28 }}
              blurRadius={8}
            >
              {/* Overlay */}
              <View style={styles.heroOverlay} />
              
              {/* Content */}
              <BlurView intensity={18} tint="light" style={styles.heroContent}>
                <View style={styles.heroInner}>
                  <Text style={styles.heroTitle}>{activeModeData.title}</Text>
                  <Text style={styles.heroSubtitle}>{activeModeData.subtitle}</Text>
                  
                  <View style={styles.contentList}>
                    {activeModeData.content.map((item, index) => (
                      <Text key={index} style={styles.contentItem}>{item}</Text>
                    ))}
                  </View>
                  
                  <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                    <BlurView intensity={18} tint="light" style={styles.ctaBlur}>
                      <View style={styles.ctaInner}>
                        <Text style={styles.ctaText}>{activeModeData.cta}</Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </ImageBackground>
          )}
        </Animated.View>
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
              <Ionicons name="map-outline" size={26} color="rgba(255,255,255,0.75)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
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
    backgroundColor: '#1E1E1E',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 5.28, // +0.20em * 22px = 4.4px, increased to 5.28 for more spacing
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 0 12px rgba(201,169,109,0.25), 0 0 20px rgba(255,255,255,0.1)',
      },
    }),
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingBlock: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  greetingMain: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 0 12px rgba(201,169,109,0.25)',
      },
    }),
  },
  greetingSub: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  inspirationHeader: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  inspirationText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 0 10px rgba(201,169,109,0.25)',
      },
    }),
  },
  modeChipsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  modeChipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modeChip: {
    width: 110,
    height: 44,
    borderRadius: 20,
    position: 'relative',
  },
  modeChipActive: {
    transform: [{ translateY: -4 }],
  },
  chipBlur: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chipContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  chipIcon: {
    marginRight: 2,
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
  chipActiveIndicator: {
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
  heroContainer: {
    alignItems: 'center',
    marginTop: 32,
    flex: 1,
    paddingBottom: 120, // Space for bottom dock
  },
  // Search Mode Styles
  searchContainer: {
    width: width * 0.92,
    height: height * 0.43,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 13,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 26px rgba(0,0,0,0.45)',
      },
    }),
  },
  searchContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.3)',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  searchSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.80)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  searchBarContainer: {
    width: '100%',
  },
  searchBar: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -9,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(25,25,25,0.45)',
    height: 50,
    paddingLeft: 48,
    paddingRight: 16,
    fontSize: 16,
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  // Hero Tile Styles
  heroTile: {
    width: width * 0.92,
    height: height * 0.43,
    borderRadius: 28,
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(25,25,25,0.3)',
  },
  heroContent: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 13,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 26px rgba(0,0,0,0.45)',
      },
    }),
  },
  heroInner: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.3)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.80)',
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  contentList: {
    marginBottom: 24,
  },
  contentItem: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 6,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  ctaButton: {
    alignSelf: 'flex-start',
  },
  ctaBlur: {
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
      },
    }),
  },
  ctaInner: {
    backgroundColor: 'rgba(201,169,109,0.35)',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  // Bottom Dock Styles
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
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
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