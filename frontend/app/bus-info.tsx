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

type TabType = 'route' | 'interior' | 'stops'

export default function BusInfo() {
  const [activeTab, setActiveTab] = useState<TabType>('route')

  const journey = {
    route: 'Rome → Naples',
    tagline: 'Coastal Highway to Southern Italy',
    duration: '2h 30m',
    busClass: 'Premium Coach',
    busType: 'FlixBus Premium',
    estimatedPrice: '€18',
    departureTime: '09:00',
    arrivalTime: '11:30',
    departureStation: 'Roma Tiburtina',
    arrivalStation: 'Napoli Centrale',
    heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    
    bookingPlatforms: ['FlixBus', 'Busbud', 'Official Site'],
    
    routeImages: [
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    ],
    
    interiorImages: [
      { image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', caption: 'Reclining seats' },
      { image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg', caption: 'Panoramic windows' },
      { image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', caption: 'Onboard comfort' },
    ],
    
    stopImages: [
      { image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', name: 'Roma Tiburtina', location: 'Rome' },
      { image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', name: 'Napoli Centrale', location: 'Naples' },
    ],
    
    travelDetails: [
      { icon: 'time-outline', label: 'Departure', value: '09:00 · Roma Tiburtina' },
      { icon: 'location-outline', label: 'Arrival', value: '11:30 · Napoli Centrale' },
      { icon: 'hourglass-outline', label: 'Duration', value: '2h 30m Direct' },
      { icon: 'bus-outline', label: 'Bus Type', value: 'FlixBus Premium' },
      { icon: 'business-outline', label: 'Class', value: 'Premium · Seat 12B' },
      { icon: 'card-outline', label: 'Est. Total', value: '€18' },
    ],
    
    comforts: [
      { icon: 'wifi', label: 'Wi-Fi', subtext: 'Free onboard' },
      { icon: 'cafe', label: 'USB Charging', subtext: 'Every seat' },
      { icon: 'eye-outline', label: 'Large Windows', subtext: 'Coastal views' },
      { icon: 'bed-outline', label: 'Reclining Seats', subtext: 'Extra legroom' },
    ],
    
    impressions: [
      { quote: 'Smooth ride along the coast', traveler: 'Maria G.', rating: 5 },
      { quote: 'Comfortable and punctual', traveler: 'Giovanni L.', rating: 5 },
      { quote: 'Best way to reach Naples', traveler: 'Anna R.', rating: 4 },
    ],
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <ImageBackground source={{ uri: journey.heroImage }} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
            <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(13,13,13,0.85)']} style={styles.heroGradient} />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={20} color="#D9CBA0" />
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <View style={styles.transportTypeBadge}>
                <Ionicons name="bus-outline" size={14} color="#D9CBA0" />
                <Text style={styles.transportTypeText}>Bus</Text>
              </View>
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
                    <Text style={styles.heroMetaText}>{journey.busClass}</Text>
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

        <View style={styles.floatingBookingStrip}>
          <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bookingStripGradient}>
            <Text style={styles.bookingLabel}>Book via</Text>
            <View style={styles.bookingPillsRow}>
              {journey.bookingPlatforms.map((platform, index) => (
                <TouchableOpacity key={index} style={styles.bookingPillMini} activeOpacity={0.8}>
                  <Text style={styles.bookingPillMiniText}>{platform}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.galleryZone}>
          <View style={styles.tabSelectors}>
            {['route', 'interior', 'stops'].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabPill, activeTab === tab && styles.tabPillActive]} onPress={() => setActiveTab(tab as TabType)} activeOpacity={0.8}>
                <Text style={[styles.tabPillText, activeTab === tab && styles.tabPillTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'route' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeScroll}>
                {journey.routeImages.map((image, index) => (
                  <View key={index} style={[styles.routeCard, index === 0 && styles.firstRouteCard]}>
                    <ImageBackground source={{ uri: image }} style={styles.routeCardBg} imageStyle={styles.routeCardBgStyle}>
                      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} style={styles.routeCardGradient} />
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            )}

            {activeTab === 'interior' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cabinScroll}>
                {journey.interiorImages.map((interior, index) => (
                  <View key={index} style={[styles.cabinCard, index === 0 && styles.firstCabinCard]}>
                    <ImageBackground source={{ uri: interior.image }} style={styles.cabinCardBg} imageStyle={styles.cabinCardBgStyle}>
                      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(13,13,13,0.8)']} style={styles.cabinCardGradient} />
                      <View style={styles.cabinCardCaption}>
                        <Text style={styles.cabinCaptionText}>{interior.caption}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            )}

            {activeTab === 'stops' && (
              <View style={styles.stationsGrid}>
                {journey.stopImages.map((stop, index) => (
                  <View key={index} style={styles.stationCard}>
                    <ImageBackground source={{ uri: stop.image }} style={styles.stationCardBg} imageStyle={styles.stationCardBgStyle}>
                      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.stationCardGradient} />
                      <View style={styles.stationCardInfo}>
                        <Text style={styles.stationName}>{stop.name}</Text>
                        <Text style={styles.stationLocation}>{stop.location}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Journey Overview</Text>
          <View style={styles.detailsPane}>
            <LinearGradient colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.detailsPaneGradient}>
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

        <View style={styles.comfortsSection}>
          <Text style={styles.sectionTitle}>Onboard Comforts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.comfortsRow}>
            {journey.comforts.map((comfort, index) => (
              <View key={index} style={[styles.comfortCapsule, index === 0 && styles.firstComfortCapsule]}>
                <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.comfortCapsuleGradient}>
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

        <View style={styles.impressionsSection}>
          <View style={styles.impressionsHeader}>
            <Text style={styles.sectionTitle}>From the Journey</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.seeAllLink}>See all →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.impressionsCarousel}>
            {journey.impressions.map((impression, index) => (
              <View key={index} style={[styles.impressionCard, index === 0 && styles.firstImpressionCard]}>
                <LinearGradient colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.impressionCardGradient}>
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

      <View style={styles.bottomDock}>
        <BlurView intensity={20} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8} onPress={() => router.push('/landing')}>
              <Ionicons name="home" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8} onPress={() => router.push('/bookings')}>
              <Ionicons name="calendar" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8} onPress={() => router.push('/trips')}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  heroSection: { width: '100%' },
  heroImage: { height: 400, width: '100%' },
  heroImageStyle: { opacity: 0.85 },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', top: 48, left: 24, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(13,13,13,0.6)', borderWidth: 1, borderColor: 'rgba(217,203,160,0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  heroContent: { position: 'absolute', bottom: 24, left: 24, right: 24 },
  transportTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(217,203,160,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(217,203,160,0.3)', alignSelf: 'flex-start', marginBottom: 12 },
  transportTypeText: { fontSize: 11, fontWeight: '600', color: '#D9CBA0', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  heroRouteRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroRouteLeft: { flex: 1, marginRight: 16 },
  heroRoute: { fontSize: 26, fontWeight: '600', color: '#FFFFFF', marginBottom: 6, fontFamily: Platform.select({ ios: 'Playfair Display', android: 'serif', web: 'Playfair Display, Georgia, serif' }) },
  heroTagline: { fontSize: 15, fontStyle: 'italic', color: '#D9CBA0', marginBottom: 12, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaDivider: { width: 1, height: 12, backgroundColor: 'rgba(217,203,160,0.4)' },
  heroMetaText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  heroPriceTag: { backgroundColor: 'rgba(217,203,160,0.15)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(217,203,160,0.3)', alignItems: 'center' },
  heroPriceAmount: { fontSize: 18, fontWeight: '700', color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  heroPriceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  floatingBookingStrip: { marginHorizontal: 24, marginTop: 16, marginBottom: 32, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(217,203,160,0.25)', overflow: 'hidden' },
  bookingStripGradient: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bookingLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  bookingPillsRow: { flexDirection: 'row', gap: 8 },
  bookingPillMini: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(217,203,160,0.15)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(217,203,160,0.3)' },
  bookingPillMiniText: { fontSize: 11, fontWeight: '600', color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  galleryZone: { paddingHorizontal: 24, marginBottom: 40 },
  tabSelectors: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  tabPill: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(217,203,160,0.2)' },
  tabPillActive: { backgroundColor: 'rgba(217,203,160,0.2)', borderColor: '#D9CBA0' },
  tabPillText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.6)', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  tabPillTextActive: { color: '#D9CBA0' },
  tabContent: { minHeight: 280 },
  routeScroll: { paddingRight: 24 },
  routeCard: { width: 320, height: 240, borderRadius: 20, overflow: 'hidden', marginRight: 16 },
  firstRouteCard: { marginLeft: 0 },
  routeCardBg: { flex: 1 },
  routeCardBgStyle: { borderRadius: 20 },
  routeCardGradient: { ...StyleSheet.absoluteFillObject },
  cabinScroll: { paddingRight: 24 },
  cabinCard: { width: 280, height: 280, borderRadius: 20, overflow: 'hidden', marginRight: 16 },
  firstCabinCard: { marginLeft: 0 },
  cabinCardBg: { flex: 1 },
  cabinCardBgStyle: { borderRadius: 20 },
  cabinCardGradient: { ...StyleSheet.absoluteFillObject },
  cabinCardCaption: { position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: 'rgba(13,13,13,0.7)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(217,203,160,0.25)' },
  cabinCaptionText: { fontSize: 14, fontWeight: '600', color: '#D9CBA0', textAlign: 'center', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  stationsGrid: { flexDirection: 'row', gap: 16 },
  stationCard: { flex: 1, height: 200, borderRadius: 20, overflow: 'hidden' },
  stationCardBg: { flex: 1 },
  stationCardBgStyle: { borderRadius: 20 },
  stationCardGradient: { ...StyleSheet.absoluteFillObject },
  stationCardInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  stationName: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 4, fontFamily: Platform.select({ ios: 'Playfair Display', android: 'serif', web: 'Playfair Display, Georgia, serif' }) },
  stationLocation: { fontSize: 13, color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  detailsSection: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#FFFFFF', marginBottom: 16, fontFamily: Platform.select({ ios: 'Playfair Display', android: 'serif', web: 'Playfair Display, Georgia, serif' }) },
  detailsPane: { borderRadius: 20, borderWidth: 1, borderColor: 'rgba(217,203,160,0.25)', overflow: 'hidden' },
  detailsPaneGradient: { padding: 20 },
  detailsGrid: { gap: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  detailLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'right', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  comfortsSection: { paddingLeft: 24, marginBottom: 32 },
  comfortsRow: { paddingRight: 24 },
  comfortCapsule: { width: 140, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(217,203,160,0.25)', overflow: 'hidden', marginRight: 12 },
  firstComfortCapsule: { marginLeft: 0 },
  comfortCapsuleGradient: { padding: 16, alignItems: 'center', minHeight: 130, justifyContent: 'center', gap: 8 },
  comfortIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(217,203,160,0.15)', alignItems: 'center', justifyContent: 'center' },
  comfortLabel: { fontSize: 13, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  comfortSubtext: { fontSize: 10, color: 'rgba(255,255,255,0.65)', textAlign: 'center', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  impressionsSection: { paddingHorizontal: 24, marginBottom: 20 },
  impressionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  seeAllLink: { fontSize: 13, color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  impressionsCarousel: { paddingRight: 24 },
  impressionCard: { width: 260, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(217,203,160,0.2)', overflow: 'hidden', marginRight: 16 },
  firstImpressionCard: { marginLeft: 0 },
  impressionCardGradient: { padding: 20, minHeight: 130, justifyContent: 'space-between' },
  impressionStars: { flexDirection: 'row', gap: 4, marginBottom: 12 },
  impressionQuote: { fontSize: 14, lineHeight: 20, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', marginBottom: 12, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  impressionTraveler: { fontSize: 12, color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  bottomDock: { position: 'absolute', bottom: 12, left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  dockContainer: { width: '92%', height: 60, borderRadius: 28, overflow: 'hidden' },
  dockContent: { flex: 1, backgroundColor: 'rgba(25,25,25,0.35)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  dockItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  dockLabelInactive: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontFamily: Platform.select({ ios: 'Inter', android: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
})
