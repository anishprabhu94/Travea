import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Platform, StyleSheet, Dimensions } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useTransportBooking } from '../contexts/TransportBookingContext'

const { width } = Dimensions.get('window')
type TabType = 'highlights' | 'itinerary' | 'location'

// Mock transport data
const MOCK_TRANSPORTS: any = {
  'trans1': { id: 'trans1', title: 'Florence to Rome', tagline: 'Trenitalia High-Speed Rail', pricePerPerson: 45, heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
  'trans2': { id: 'trans2', title: 'Florence to Venice', tagline: 'Italo Premium Service', pricePerPerson: 52, heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
  'trans3': { id: 'trans3', title: 'Florence to Siena', tagline: 'FlixBus Express', pricePerPerson: 12, heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
  'trans4': { id: 'trans4', title: 'Florence to Pisa', tagline: 'Busitalia Regional', pricePerPerson: 10, heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
  'trans5': { id: 'trans5', title: 'Full Day Car Rental', tagline: 'Hertz Premium Fleet', pricePerPerson: 85, heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
  'trans6': { id: 'trans6', title: 'Full Day Car Rental', tagline: 'Europcar Standard', pricePerPerson: 75, heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
  'trans7': { id: 'trans7', title: 'Chianti Wine Tour', tagline: 'Private Driver Service', pricePerPerson: 120, heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
  'trans8': { id: 'trans8', title: 'Airport Shuttle', tagline: 'Pisa Airport Transfer', pricePerPerson: 25, heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
};

export default function TransportInfo() {
  const params = useLocalSearchParams()
  const people = parseInt(params.people as string || '2')
  const transportId = params.transportId as string || 'trans1'
  const tripId = params.tripId as string || undefined
  const cityCode = params.cityCode as string || undefined
  const city = params.city as string || undefined
  const date = params.date as string || undefined
  
  const { getBookingStatus, markAsBooked, markAsCanceled } = useTransportBooking()
  const bookingStatus = getBookingStatus(transportId, tripId)
  
  const [activeTab, setActiveTab] = useState<TabType>('highlights')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Get transport data
  const expData = MOCK_TRANSPORTS[transportId] || MOCK_TRANSPORTS['trans1'];

  const handleMarkBooked = () => {
    markAsBooked(
      transportId,
      people,
      date || 'Jun 10',
      expData.title,
      expData.heroImage,
      expData.pricePerPerson,
      city,
      cityCode,
      tripId
    )
    setToastMessage(`Transport booked · ${people} ${people === 1 ? 'person' : 'people'}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleMarkCanceled = () => {
    markAsCanceled(transportId, tripId)
    setToastMessage('Booking canceled')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const transport = {
    title: expData.title,
    tagline: expData.tagline,
    location: 'Amalfi Coast, Italy',
    duration: '2h 30m',
    activityType: 'Guided Walk',
    groupSize: 'Small Group (Max 8)',
    estimatedPrice: '€45',
    startTime: '10:00 AM',
    meetingPoint: 'Villa Cimbrone Gardens',
    heroImage: expData.heroImage,
    
    bookingPlatforms: ['Viator', 'GetYourGuide', 'Direct'],
    
    highlightImages: [
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    ],
    
    itinerarySteps: [
      { time: '10:00', title: 'Meeting & Introduction', description: 'Gather at Villa Cimbrone Gardens', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
      { time: '10:30', title: 'Terraced Groves', description: 'Walk through ancient lemon terraces', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
      { time: '11:30', title: 'Tasting Transport', description: 'Sample limoncello and local treats', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
      { time: '12:30', title: 'Conclusion', description: 'Return to meeting point', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
    ],
    
    locationDetails: {
      meetingPoint: 'Villa Cimbrone Gardens',
      coordinates: 'Amalfi Coast',
      mapImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      nearbyLandmarks: [
        { name: 'Villa Cimbrone', distance: '0 min walk', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
        { name: 'Ravello Center', distance: '5 min walk', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
      ],
    },
    
    transportDetails: [
      { icon: 'time-outline', label: 'Start Time', value: '10:00 AM · Villa Cimbrone' },
      { icon: 'hourglass-outline', label: 'Duration', value: '2h 30m guided walk' },
      { icon: 'people-outline', label: 'Group Size', value: 'Small Group (Max 8 people)' },
      { icon: 'walk-outline', label: 'Activity Type', value: 'Guided Walk · Easy terrain' },
      { icon: 'language-outline', label: 'Languages', value: 'English, Italian' },
      { icon: 'card-outline', label: 'Est. Total', value: '€45 per person' },
    ],
    
    included: [
      { icon: 'person-outline', label: 'Expert Guide', subtext: 'Local historian' },
      { icon: 'wine-outline', label: 'Tastings', subtext: 'Limoncello samples' },
      { icon: 'water-outline', label: 'Refreshments', subtext: 'Water provided' },
      { icon: 'camera-outline', label: 'Photo Stops', subtext: 'Scenic viewpoints' },
    ],
    
    reviews: [
      { quote: 'A magical walk through fragrant groves', traveler: 'Catherine P.', rating: 5 },
      { quote: 'The highlight of our Amalfi trip', traveler: 'Thomas R.', rating: 5 },
      { quote: 'Beautiful scenery and wonderful guide', traveler: 'Julia M.', rating: 5 },
    ],
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <ImageBackground source={{ uri: transport.heroImage }} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
            <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(13,13,13,0.85)']} style={styles.heroGradient} />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={20} color="#D9CBA0" />
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <View style={styles.transportTypeBadge}>
                <Ionicons name="compass-outline" size={14} color="#D9CBA0" />
                <Text style={styles.transportTypeText}>Transport</Text>
              </View>
              <View style={styles.heroRouteRow}>
                <View style={styles.heroRouteLeft}>
                  <Text style={styles.heroRoute}>{transport.title}</Text>
                  <Text style={styles.heroTagline}>{transport.tagline}</Text>
                  <View style={styles.heroMetaRow}>
                    <View style={styles.heroMetaItem}>
                      <Ionicons name="time-outline" size={14} color="#D9CBA0" />
                      <Text style={styles.heroMetaText}>{transport.duration}</Text>
                    </View>
                    <View style={styles.heroMetaDivider} />
                    <Text style={styles.heroMetaText}>{transport.groupSize}</Text>
                  </View>
                </View>
                <View style={styles.heroPriceTag}>
                  <Text style={styles.heroPriceAmount}>{transport.estimatedPrice}</Text>
                  <Text style={styles.heroPriceLabel}>per person</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.floatingBookingStrip}>
          <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bookingStripGradient}>
            <Text style={styles.bookingLabel}>Book via</Text>
            <View style={styles.bookingPillsRow}>
              {transport.bookingPlatforms.map((platform, index) => (
                <TouchableOpacity key={index} style={styles.bookingPillMini} activeOpacity={0.8}>
                  <Text style={styles.bookingPillMiniText}>{platform}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.galleryZone}>
          <View style={styles.tabSelectors}>
            {['highlights', 'itinerary', 'location'].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabPill, activeTab === tab && styles.tabPillActive]} onPress={() => setActiveTab(tab as TabType)} activeOpacity={0.8}>
                <Text style={[styles.tabPillText, activeTab === tab && styles.tabPillTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'highlights' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeScroll}>
                {transport.highlightImages.map((image, index) => (
                  <View key={index} style={[styles.routeCard, index === 0 && styles.firstRouteCard]}>
                    <ImageBackground source={{ uri: image }} style={styles.routeCardBg} imageStyle={styles.routeCardBgStyle}>
                      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} style={styles.routeCardGradient} />
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            )}

            {activeTab === 'itinerary' && (
              <View style={styles.itineraryList}>
                {transport.itinerarySteps.map((step, index) => (
                  <View key={index} style={styles.itineraryStep}>
                    <View style={styles.itineraryTime}>
                      <Ionicons name="time-outline" size={16} color="#D9CBA0" />
                      <Text style={styles.itineraryTimeText}>{step.time}</Text>
                    </View>
                    <View style={styles.itineraryContent}>
                      <Text style={styles.itineraryTitle}>{step.title}</Text>
                      <Text style={styles.itineraryDescription}>{step.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'location' && (
              <View style={styles.locationContent}>
                <View style={styles.mapBackground}>
                  <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.mapGradient}>
                    <Ionicons name="location" size={48} color="#D9CBA0" />
                    <Text style={styles.mapLocationText}>{transport.locationDetails.meetingPoint}</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.nearbyTitle}>Nearby Landmarks</Text>
                <View style={styles.landmarksGrid}>
                  {transport.locationDetails.nearbyLandmarks.map((landmark, index) => (
                    <View key={index} style={styles.landmarkCard}>
                      <ImageBackground source={{ uri: landmark.image }} style={styles.landmarkBg} imageStyle={styles.landmarkBgStyle}>
                        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.landmarkGradient} />
                        <View style={styles.landmarkInfo}>
                          <Text style={styles.landmarkName}>{landmark.name}</Text>
                          <Text style={styles.landmarkDistance}>{landmark.distance}</Text>
                        </View>
                      </ImageBackground>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Transport Overview</Text>
          <View style={styles.detailsPane}>
            <LinearGradient colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.detailsPaneGradient}>
              <View style={styles.detailsGrid}>
                {transport.transportDetails.map((detail, index) => (
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
          <Text style={styles.sectionTitle}>What's Included</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.comfortsRow}>
            {transport.included.map((item, index) => (
              <View key={index} style={[styles.comfortCapsule, index === 0 && styles.firstComfortCapsule]}>
                <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.comfortCapsuleGradient}>
                  <View style={styles.comfortIconCircle}>
                    <Ionicons name={item.icon as any} size={24} color="#D9CBA0" />
                  </View>
                  <Text style={styles.comfortLabel}>{item.label}</Text>
                  <Text style={styles.comfortSubtext}>{item.subtext}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.impressionsSection}>
          <View style={styles.impressionsHeader}>
            <Text style={styles.sectionTitle}>Guest Reviews</Text>
            <TouchableOpacity activeOpacity={0.8}><Text style={styles.seeAllLink}>See all →</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.impressionsCarousel}>
            {transport.reviews.map((review, index) => (
              <View key={index} style={[styles.impressionCard, index === 0 && styles.firstImpressionCard]}>
                <LinearGradient colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.impressionCardGradient}>
                  <View style={styles.impressionStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (<Ionicons key={i} name="star" size={12} color="#D9CBA0" />))}
                  </View>
                  <Text style={styles.impressionQuote}>"{review.quote}"</Text>
                  <Text style={styles.impressionTraveler}>— {review.traveler}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toastContainer}>
          <BlurView intensity={30} tint="light" style={styles.toastBlur}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </BlurView>
        </View>
      )}

      {/* Bottom Dock - Navigation Bar Style (Frosted Glass Capsule) */}
      <View style={styles.bottomDock}>
        <BlurView intensity={22} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            {/* Mark as Booked */}
            <TouchableOpacity
              style={styles.dockAction}
              onPress={handleMarkBooked}
              activeOpacity={0.7}
              disabled={bookingStatus === 'booked'}
            >
              <LinearGradient
                colors={bookingStatus === 'booked' 
                  ? ['rgba(217,189,120,0.25)', 'rgba(217,189,120,0.15)']
                  : ['rgba(217,189,120,0.15)', 'rgba(217,189,120,0.08)']}
                style={styles.dockActionGradient}
              >
                {bookingStatus === 'booked' && (
                  <Ionicons 
                    name="checkmark-circle-outline" 
                    size={16} 
                    color="#D9BD78" 
                    style={{marginRight: 6}} 
                  />
                )}
                <Text style={[styles.dockActionText, bookingStatus === 'booked' && styles.dockActionTextActive]}>
                  {bookingStatus === 'booked' ? 'Booked ✓' : 'Mark as Booked'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Divider */}
            <LinearGradient
              colors={['rgba(217,189,120,0.3)', 'rgba(217,189,120,0.15)', 'rgba(217,189,120,0.3)']}
              style={styles.dockDivider}
            />
            
            {/* Mark as Canceled */}
            <TouchableOpacity
              style={styles.dockAction}
              onPress={handleMarkCanceled}
              activeOpacity={0.7}
              disabled={bookingStatus === 'canceled'}
            >
              <LinearGradient
                colors={bookingStatus === 'canceled'
                  ? ['rgba(107,79,76,0.25)', 'rgba(107,79,76,0.15)']
                  : ['rgba(107,79,76,0.15)', 'rgba(107,79,76,0.08)']}
                style={styles.dockActionGradient}
              >
                {bookingStatus === 'canceled' && (
                  <Ionicons 
                    name="close-circle-outline" 
                    size={16} 
                    color="rgba(245,244,239,0.8)" 
                    style={{marginRight: 6}} 
                  />
                )}
                <Text style={[styles.dockActionText, bookingStatus === 'canceled' && styles.dockActionTextCanceled]}>
                  {bookingStatus === 'canceled' ? 'Canceled ✕' : 'Mark as Canceled'}
                </Text>
              </LinearGradient>
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
  itineraryList: { gap: 16 },
  itineraryStep: { flexDirection: 'row', gap: 16, backgroundColor: 'rgba(217,203,160,0.06)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(217,203,160,0.2)' },
  itineraryTime: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itineraryTimeText: { fontSize: 14, fontWeight: '600', color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  itineraryContent: { flex: 1 },
  itineraryTitle: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', marginBottom: 4, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  itineraryDescription: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  locationContent: { gap: 20 },
  mapBackground: { height: 160, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(217,203,160,0.25)', overflow: 'hidden' },
  mapGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapLocationText: { fontSize: 15, fontWeight: '600', color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  nearbyTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginTop: 8, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  landmarksGrid: { flexDirection: 'row', gap: 12 },
  landmarkCard: { flex: 1, height: 140, borderRadius: 16, overflow: 'hidden' },
  landmarkBg: { flex: 1 },
  landmarkBgStyle: { borderRadius: 16 },
  landmarkGradient: { ...StyleSheet.absoluteFillObject },
  landmarkInfo: { position: 'absolute', bottom: 12, left: 12, right: 12 },
  landmarkName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', marginBottom: 2, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  landmarkDistance: { fontSize: 11, color: '#D9CBA0', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
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
  bottomDock: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  dockContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(217,189,120,0.15)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  dockContent: {
    flexDirection: 'row',
    backgroundColor: 'rgba(27,27,27,0.55)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.1)',
  },
  dockAction: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  dockActionGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(245,244,239,0.7)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dockActionTextActive: {
    color: '#D9BD78',
    fontWeight: '600',
  },
  dockActionTextCanceled: {
    color: 'rgba(245,244,239,0.8)',
    fontWeight: '600',
  },
  dockDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 8,
  },
  
  // Toast Notification
  toastContainer: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center', zIndex: 200 },
  toastBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(231,201,122,0.3)',
  },
  toastText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F6F4EF',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
