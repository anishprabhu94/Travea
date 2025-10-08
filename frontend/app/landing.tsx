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
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.55))',
      },
    }),
  },
  vignette: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.25) 70%)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(255,255,255,0.15)',
      },
    }),
  },
  greetingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  greetingPane: {
    width: '85%',
    height: 90,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201,169,109,0.25)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0,0,0,0.35), 0 0 20px rgba(201,169,109,0.25)',
      },
    }),
  },
  greetingContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.45)',
    paddingLeft: 20,
    paddingTop: 16,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  questionText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  tabsContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  tabsPane: {
    width: '90%',
    height: 52,
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
      },
    }),
  },
  tabsContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: 'relative',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.02,
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  tabTextActive: {
    color: '#F8F8F8',
  },
  tabTextInactive: {
    color: 'rgba(255,255,255,0.45)',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: '#C9A96D',
    ...Platform.select({
      web: {
        boxShadow: '0 0 4px rgba(201,169,109,0.25)',
      },
    }),
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 32,
    flex: 1,
  },
  contentTile: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 28,
    overflow: 'hidden',
  },
  contentGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))',
      },
    }),
  },
  contentFrosted: {
    flex: 1,
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
  contentInner: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.45)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  contentIcon: {
    marginBottom: 16,
  },
  contentTitle: {
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
  contentTagline: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 24,
    lineHeight: 22,
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
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
    }),
  },
  ctaInner: {
    backgroundColor: 'rgba(201,169,109,0.35)',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F8F8',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
});