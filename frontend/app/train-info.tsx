import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

const { width, height } = Dimensions.get('window')

type TabType = 'route' | 'cabin' | 'stations'

export default function TrainInfo() {
  const [activeTab, setActiveTab] = useState<TabType>('route')

  // Train journey data
  const journey = {
    route: 'Florence → Rome',
    tagline: "Through Italy's Heartland",
    duration: '1h 36m',
    trainClass: 'First Class',
    trainType: 'Frecciarossa 1000',
    estimatedPrice: '€52',
    departureTime: '14:15',
    arrivalTime: '15:51',
    departureStation: 'Firenze Santa Maria Novella',
    arrivalStation: 'Roma Termini',
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    
    bookingPlatforms: ['Trainline', 'RailEurope', 'Official Site'],
    
    routeImages: [
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    ],
    
    cabinImages: [
      {
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
        caption: 'First class seats',
      },
      {
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
        caption: 'Panoramic windows',
      },
      {
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
        caption: 'Dining area',
      },
    ],
    
    stationImages: [
      {
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
        name: 'Firenze SMN',
        location: 'Florence',
      },
      {
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
        name: 'Roma Termini',
        location: 'Rome',
      },
    ],
    
    travelDetails: [
      { icon: 'time-outline', label: 'Departure', value: '14:15 · Firenze SMN' },
      { icon: 'location-outline', label: 'Arrival', value: '15:51 · Roma Termini' },
      { icon: 'hourglass-outline', label: 'Duration', value: '1h 36m Nonstop' },
      { icon: 'train-outline', label: 'Train Type', value: 'Frecciarossa 1000' },
      { icon: 'business-outline', label: 'Class', value: 'First Class · Seat 12A' },
      { icon: 'card-outline', label: 'Est. Total', value: '€52' },
    ],
    
    comforts: [
      { icon: 'wifi', label: 'Wi-Fi Access', subtext: 'Complimentary onboard' },
      { icon: 'cafe', label: 'Snack Bar', subtext: 'Car 5 · Italian cuisine' },
      { icon: 'eye-outline', label: 'Panoramic Views', subtext: 'Tuscany countryside' },
      { icon: 'bed-outline', label: 'Reclining Seats', subtext: 'Extra legroom' },
    ],
    
    impressions: [
      { quote: 'Tuscany rolled by like a painting', traveler: 'Sophie L.', rating: 5 },
      { quote: 'Smooth, quiet, absolutely beautiful', traveler: 'Marco R.', rating: 5 },
      { quote: 'Best way to see the Italian heartland', traveler: 'Elena M.', rating: 5 },
      { quote: 'Felt like slow cinema through the window', traveler: 'James K.', rating: 5 },
    ],
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. HERO SECTION */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: journey.heroImage }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(13,13,13,0.85)']}
              style={styles.heroGradient}
            />

            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color="#D9CBA0" />
            </TouchableOpacity>

            {/* Hero Content */}
            <View style={styles.heroContent}>
              {/* Transport Type Badge */}
              <View style={styles.transportTypeBadge}>
                <Ionicons name="train-outline" size={14} color="#D9CBA0" />
                <Text style={styles.transportTypeText}>Train</Text>
              </View>

              {/* Route Info */}
              <View style={styles.heroRouteRow}>
                <View style={styles.heroRouteLeft}>
                  <Text style={styles.heroRoute}>{journey.route}</Text>
                  <Text style={styles.heroTagline}>{journey.tagline}</Text>
                  <View style={styles.heroMetaRow}>
                    <View style={styles.heroMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#D9CBA0" />
                      <Text style={styles.heroMetaText}>{journey.duration}</Text>
                    </View>
                    <View style={styles.heroMetaDivider} />
                    <Text style={styles.heroMetaText}>{journey.trainClass}</Text>
                  </View>
                </View>
                <View style={styles.heroPriceTag}>
                  <Text style={styles.heroPriceAmount}>{journey.estimatedPrice}</Text>
                  <Text style={styles.heroPriceLabel}>est. total</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Floating Book Via Strip */}
        <View style={styles.floatingBookingStrip}>
          <LinearGradient
            colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bookingStripGradient}
          >
            <Text style={styles.bookingLabel}>Book via</Text>
            <View style={styles.bookingPillsRow}>
              {journey.bookingPlatforms.map((platform, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.bookingPillMini}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bookingPillMiniText}>{platform}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* 2. MAIN GALLERY ZONE */}
        <View style={styles.galleryZone}>
          {/* Tab Selectors */}
          <View style={styles.tabSelectors}>
            {['route', 'cabin', 'stations'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabPill,
                  activeTab === tab && styles.tabPillActive
                ]}
                onPress={() => setActiveTab(tab as TabType)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.tabPillText,
                  activeTab === tab && styles.tabPillTextActive
                ]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {/* Route Tab */}
            {activeTab === 'route' && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.routeScroll}
              >
                {journey.routeImages.map((image, index) => (
                  <View 
                    key={index} 
                    style={[styles.routeCard, index === 0 && styles.firstRouteCard]}
                  >
                    <ImageBackground
                      source={{ uri: image }}
                      style={styles.routeCardBg}
                      imageStyle={styles.routeCardBgStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
                        style={styles.routeCardGradient}
                      />
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Cabin Tab */}
            {activeTab === 'cabin' && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cabinScroll}
              >
                {journey.cabinImages.map((cabin, index) => (
                  <View 
                    key={index} 
                    style={[styles.cabinCard, index === 0 && styles.firstCabinCard]}
                  >
                    <ImageBackground
                      source={{ uri: cabin.image }}
                      style={styles.cabinCardBg}
                      imageStyle={styles.cabinCardBgStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(13,13,13,0.8)']}
                        style={styles.cabinCardGradient}
                      />
                      <View style={styles.cabinCardCaption}>
                        <Text style={styles.cabinCaptionText}>{cabin.caption}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Stations Tab */}
            {activeTab === 'stations' && (
              <View style={styles.stationsGrid}>
                {journey.stationImages.map((station, index) => (
                  <View key={index} style={styles.stationCard}>
                    <ImageBackground
                      source={{ uri: station.image }}
                      style={styles.stationCardBg}
                      imageStyle={styles.stationCardBgStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                        style={styles.stationCardGradient}
                      />
                      <View style={styles.stationCardInfo}>
                        <Text style={styles.stationName}>{station.name}</Text>
                        <Text style={styles.stationLocation}>{station.location}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 3. TRAVEL DETAILS */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Journey Overview</Text>
          <View style={styles.detailsPane}>
            <LinearGradient
              colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.detailsPaneGradient}
            >
              <View style={styles.detailsGrid}>
                {journey.travelDetails.map((detail, index) => (
                  <View key={index} style={styles.detailRow}>
                    <View style={styles.detailLeft}>
                      <Ionicons name={detail.icon as any} size={16} color="#D9CBA0" />
                      <Text style={styles.detailLabel}>{detail.label}</Text>
                    </View>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* 4. COMFORT HIGHLIGHTS */}
        <View style={styles.comfortsSection}>
          <Text style={styles.sectionTitle}>Onboard Comforts</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.comfortsRow}
          >
            {journey.comforts.map((comfort, index) => (
              <View 
                key={index} 
                style={[styles.comfortCapsule, index === 0 && styles.firstComfortCapsule]}
              >
                <LinearGradient
                  colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.comfortCapsuleGradient}
                >
                  <View style={styles.comfortIconCircle}>
                    <Ionicons name={comfort.icon as any} size={24} color="#D9CBA0" />
                  </View>
                  <Text style={styles.comfortLabel}>{comfort.label}</Text>
                  <Text style={styles.comfortSubtext}>{comfort.subtext}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 5. TRAVELER IMPRESSIONS */}
        <View style={styles.impressionsSection}>
          <View style={styles.impressionsHeader}>
            <Text style={styles.sectionTitle}>From the Journey</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.seeAllLink}>See all →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.impressionsCarousel}
          >
            {journey.impressions.map((impression, index) => (
              <View 
                key={index} 
                style={[styles.impressionCard, index === 0 && styles.firstImpressionCard]}
              >
                <LinearGradient
                  colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.impressionCardGradient}
                >
                  <View style={styles.impressionStars}>
                    {Array.from({ length: impression.rating }).map((_, i) => (
                      <Ionicons key={i} name="star" size={12} color="#D9CBA0" />
                    ))}
                  </View>
                  <Text style={styles.impressionQuote}>"{impression.quote}"</Text>
                  <Text style={styles.impressionTraveler}>— {impression.traveler}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Dock - Identical to Landing Page */}
      <View style={styles.bottomDock}>
        <BlurView intensity={20} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/landing')}
            >
              <Ionicons name="home" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Home</Text>
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
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
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
    backgroundColor: '#0D0D0D',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // 1. HERO SECTION
  heroSection: {
    width: '100%',
  },
  heroImage: {
    height: 400,
    width: '100%',
  },
  heroImageStyle: {
    opacity: 0.85,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(13,13,13,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
      },
    }),
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  heroRouteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroRouteLeft: {
    flex: 1,
    marginRight: 16,
  },
  heroRoute: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  heroTagline: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#D9CBA0',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroMetaDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(217,203,160,0.4)',
  },
  heroMetaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroPriceTag: {
    backgroundColor: 'rgba(217,203,160,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
    alignItems: 'center',
  },
  heroPriceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroPriceLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Floating Booking Strip
  floatingBookingStrip: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
      },
    }),
  },
  bookingStripGradient: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  bookingLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  bookingPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bookingPillMini: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(217,203,160,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
  },
  bookingPillMiniText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 2. GALLERY ZONE
  galleryZone: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  tabSelectors: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tabPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
  },
  tabPillActive: {
    backgroundColor: 'rgba(217,203,160,0.2)',
    borderColor: '#D9CBA0',
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  tabPillTextActive: {
    color: '#D9CBA0',
  },
  tabContent: {
    minHeight: 280,
  },

  // Route Tab
  routeScroll: {
    paddingRight: 24,
  },
  routeCard: {
    width: 320,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  firstRouteCard: {
    marginLeft: 0,
  },
  routeCardBg: {
    flex: 1,
  },
  routeCardBgStyle: {
    borderRadius: 20,
  },
  routeCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // Cabin Tab
  cabinScroll: {
    paddingRight: 24,
  },
  cabinCard: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  firstCabinCard: {
    marginLeft: 0,
  },
  cabinCardBg: {
    flex: 1,
  },
  cabinCardBgStyle: {
    borderRadius: 20,
  },
  cabinCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cabinCardCaption: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(13,13,13,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
  },
  cabinCaptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D9CBA0',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Stations Tab
  stationsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  stationCard: {
    flex: 1,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
  stationCardBg: {
    flex: 1,
  },
  stationCardBgStyle: {
    borderRadius: 20,
  },
  stationCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  stationCardInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stationLocation: {
    fontSize: 13,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 3. TRAVEL DETAILS
  detailsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  detailsPane: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
  },
  detailsPaneGradient: {
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 4. COMFORT HIGHLIGHTS
  comfortsSection: {
    paddingLeft: 24,
    marginBottom: 32,
  },
  comfortsRow: {
    paddingRight: 24,
  },
  comfortCapsule: {
    width: 140,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
    marginRight: 12,
  },
  firstComfortCapsule: {
    marginLeft: 0,
  },
  comfortCapsuleGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 130,
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  comfortIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217,203,160,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comfortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  comfortSubtext: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 5. TRAVELER IMPRESSIONS
  impressionsSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  impressionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllLink: {
    fontSize: 13,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  impressionsCarousel: {
    paddingRight: 24,
  },
  impressionCard: {
    width: 260,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    overflow: 'hidden',
    marginRight: 16,
  },
  firstImpressionCard: {
    marginLeft: 0,
  },
  impressionCardGradient: {
    padding: 20,
    minHeight: 130,
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  impressionStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  impressionQuote: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  impressionTraveler: {
    fontSize: 12,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // BOTTOM DOCK
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
  dockLabelInactive: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
