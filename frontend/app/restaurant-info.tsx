import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ImageBackground, Platform, StyleSheet, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

const { width } = Dimensions.get('window')
type TabType = 'menu' | 'ambiance' | 'location'

export default function RestaurantInfo() {
  const [activeTab, setActiveTab] = useState<TabType>('ambiance')

  const restaurant = {
    name: 'Ristorante La Caravella',
    tagline: 'Historic Elegance Meets Coastal Flavors',
    location: 'Amalfi, Amalfi Coast',
    cuisine: 'Italian Mediterranean',
    mealType: 'Dinner', // Can be 'Breakfast', 'Lunch', or 'Dinner'
    priceRange: '€€€',
    estimatedPrice: '€85',
    reservationTime: '8:00 PM',
    dressCode: 'Smart Casual',
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    
    bookingPlatforms: ['OpenTable', 'TheFork', 'Direct'],
    
    ambianceImages: [
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    ],
    
    menuHighlights: [
      { course: 'Antipasti', dish: 'Carpaccio di Pesce', description: 'Fresh local catch, lemon, olive oil', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
      { course: 'Primi', dish: 'Scialatielli ai Frutti di Mare', description: 'Handmade pasta, seafood medley', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
      { course: 'Secondi', dish: 'Branzino al Forno', description: 'Roasted sea bass, herbs, potatoes', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
      { course: 'Dolci', dish: 'Delizia al Limone', description: 'Lemon cream cake, local specialty', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
    ],
    
    locationDetails: {
      address: 'Via Matteo Camera, 12, Amalfi',
      coordinates: 'Amalfi Historic Center',
      mapImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      nearbyLandmarks: [
        { name: 'Amalfi Cathedral', distance: '2 min walk', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
        { name: 'Piazza Duomo', distance: '1 min walk', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
      ],
    },
    
    diningDetails: [
      { icon: 'time-outline', label: 'Reservation', value: '8:00 PM · Jun 9' },
      { icon: 'people-outline', label: 'Party Size', value: '2 guests' },
      { icon: 'restaurant-outline', label: 'Cuisine', value: 'Italian Mediterranean' },
      { icon: 'shirt-outline', label: 'Dress Code', value: 'Smart Casual' },
      { icon: 'star-outline', label: 'Michelin', value: '1 Star · Traditional' },
      { icon: 'card-outline', label: 'Est. Total', value: '€85 per person (3-course)' },
    ],
    
    features: [
      { icon: 'wine-outline', label: 'Wine Cellar', subtext: '500+ selections' },
      { icon: 'leaf-outline', label: 'Terrace Seating', subtext: 'Sea views' },
      { icon: 'fish-outline', label: 'Fresh Seafood', subtext: 'Daily catch' },
      { icon: 'flame-outline', label: 'Open Kitchen', subtext: 'Chef\'s table' },
    ],
    
    reviews: [
      { quote: 'The lemon dessert was heaven', traveler: 'Francesca B.', rating: 5 },
      { quote: 'Best dining in Amalfi, hands down', traveler: 'Robert M.', rating: 5 },
      { quote: 'Historic charm with impeccable service', traveler: 'Elena P.', rating: 5 },
    ],
  }

  // Get meal type icon
  const getMealIcon = () => {
    switch(restaurant.mealType.toLowerCase()) {
      case 'breakfast': return 'sunny-outline'
      case 'lunch': return 'partly-sunny-outline'
      case 'dinner': return 'moon-outline'
      default: return 'restaurant-outline'
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <ImageBackground source={{ uri: restaurant.heroImage }} style={styles.heroImage} imageStyle={styles.heroImageStyle}>
            <LinearGradient colors={['rgba(0,0,0,0.2)', 'rgba(13,13,13,0.85)']} style={styles.heroGradient} />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={20} color="#D9CBA0" />
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <View style={styles.mealTypeBadge}>
                <Ionicons name={getMealIcon()} size={14} color="#D9CBA0" />
                <Text style={styles.mealTypeText}>{restaurant.mealType}</Text>
              </View>
              <View style={styles.heroRouteRow}>
                <View style={styles.heroRouteLeft}>
                  <Text style={styles.heroRoute}>{restaurant.name}</Text>
                  <Text style={styles.heroTagline}>{restaurant.tagline}</Text>
                  <View style={styles.heroMetaRow}>
                    <Text style={styles.heroMetaText}>{restaurant.cuisine}</Text>
                    <View style={styles.heroMetaDivider} />
                    <Text style={styles.heroMetaText}>{restaurant.priceRange}</Text>
                  </View>
                </View>
                <View style={styles.heroPriceTag}>
                  <Text style={styles.heroPriceAmount}>{restaurant.estimatedPrice}</Text>
                  <Text style={styles.heroPriceLabel}>per person</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.floatingBookingStrip}>
          <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bookingStripGradient}>
            <Text style={styles.bookingLabel}>Reserve via</Text>
            <View style={styles.bookingPillsRow}>
              {restaurant.bookingPlatforms.map((platform, index) => (
                <TouchableOpacity key={index} style={styles.bookingPillMini} activeOpacity={0.8}>
                  <Text style={styles.bookingPillMiniText}>{platform}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.galleryZone}>
          <View style={styles.tabSelectors}>
            {['menu', 'ambiance', 'location'].map((tab) => (
              <TouchableOpacity key={tab} style={[styles.tabPill, activeTab === tab && styles.tabPillActive]} onPress={() => setActiveTab(tab as TabType)} activeOpacity={0.8}>
                <Text style={[styles.tabPillText, activeTab === tab && styles.tabPillTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === 'menu' && (
              <View style={styles.menuList}>
                {restaurant.menuHighlights.map((item, index) => (
                  <View key={index} style={styles.menuItem}>
                    <ImageBackground source={{ uri: item.image }} style={styles.menuItemBg} imageStyle={styles.menuItemBgStyle}>
                      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(13,13,13,0.85)']} style={styles.menuItemGradient} />
                      <View style={styles.menuItemInfo}>
                        <Text style={styles.menuCourse}>{item.course}</Text>
                        <Text style={styles.menuDish}>{item.dish}</Text>
                        <Text style={styles.menuDescription}>{item.description}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'ambiance' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.routeScroll}>
                {restaurant.ambianceImages.map((image, index) => (
                  <View key={index} style={[styles.routeCard, index === 0 && styles.firstRouteCard]}>
                    <ImageBackground source={{ uri: image }} style={styles.routeCardBg} imageStyle={styles.routeCardBgStyle}>
                      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']} style={styles.routeCardGradient} />
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            )}

            {activeTab === 'location' && (
              <View style={styles.locationContent}>
                <View style={styles.mapBackground}>
                  <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.mapGradient}>
                    <Ionicons name="location" size={48} color="#D9CBA0" />
                    <Text style={styles.mapLocationText}>{restaurant.locationDetails.address}</Text>
                  </LinearGradient>
                </View>
                <Text style={styles.nearbyTitle}>Nearby Landmarks</Text>
                <View style={styles.landmarksGrid}>
                  {restaurant.locationDetails.nearbyLandmarks.map((landmark, index) => (
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
          <Text style={styles.sectionTitle}>Dining Details</Text>
          <View style={styles.detailsPane}>
            <LinearGradient colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.detailsPaneGradient}>
              <View style={styles.detailsGrid}>
                {restaurant.diningDetails.map((detail, index) => (
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
          <Text style={styles.sectionTitle}>Restaurant Features</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.comfortsRow}>
            {restaurant.features.map((feature, index) => (
              <View key={index} style={[styles.comfortCapsule, index === 0 && styles.firstComfortCapsule]}>
                <LinearGradient colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.comfortCapsuleGradient}>
                  <View style={styles.comfortIconCircle}>
                    <Ionicons name={feature.icon as any} size={24} color="#D9CBA0" />
                  </View>
                  <Text style={styles.comfortLabel}>{feature.label}</Text>
                  <Text style={styles.comfortSubtext}>{feature.subtext}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.impressionsSection}>
          <View style={styles.impressionsHeader}>
            <Text style={styles.sectionTitle}>Diner Reviews</Text>
            <TouchableOpacity activeOpacity={0.8}><Text style={styles.seeAllLink}>See all →</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.impressionsCarousel}>
            {restaurant.reviews.map((review, index) => (
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

      <View style={styles.bottomDock}>
        <BlurView intensity={20} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8} onPress={() => router.push('/landing')}><Ionicons name="home" size={22} color="rgba(255,255,255,0.7)" /><Text style={styles.dockLabelInactive}>Home</Text></TouchableOpacity>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8} onPress={() => router.push('/bookings')}><Ionicons name="calendar" size={22} color="rgba(255,255,255,0.7)" /><Text style={styles.dockLabelInactive}>Trip Canvas</Text></TouchableOpacity>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8} onPress={() => router.push('/trips')}><Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" /><Text style={styles.dockLabelInactive}>My Trips</Text></TouchableOpacity>
            <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}><Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" /><Text style={styles.dockLabelInactive}>Concierge</Text></TouchableOpacity>
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
  mealTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(217,203,160,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(217,203,160,0.3)', alignSelf: 'flex-start', marginBottom: 12 },
  mealTypeText: { fontSize: 11, fontWeight: '600', color: '#D9CBA0', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  heroRouteRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroRouteLeft: { flex: 1, marginRight: 16 },
  heroRoute: { fontSize: 26, fontWeight: '600', color: '#FFFFFF', marginBottom: 6, fontFamily: Platform.select({ ios: 'Playfair Display', android: 'serif', web: 'Playfair Display, Georgia, serif' }) },
  heroTagline: { fontSize: 15, fontStyle: 'italic', color: '#D9CBA0', marginBottom: 12, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  heroMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
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
  menuList: { gap: 16 },
  menuItem: { height: 160, borderRadius: 20, overflow: 'hidden' },
  menuItemBg: { flex: 1, justifyContent: 'flex-end' },
  menuItemBgStyle: { borderRadius: 20 },
  menuItemGradient: { ...StyleSheet.absoluteFillObject },
  menuItemInfo: { padding: 20 },
  menuCourse: { fontSize: 11, fontWeight: '600', color: '#D9CBA0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  menuDish: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 4, fontFamily: Platform.select({ ios: 'Playfair Display', android: 'serif', web: 'Playfair Display, Georgia, serif' }) },
  menuDescription: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
  routeScroll: { paddingRight: 24 },
  routeCard: { width: 320, height: 240, borderRadius: 20, overflow: 'hidden', marginRight: 16 },
  firstRouteCard: { marginLeft: 0 },
  routeCardBg: { flex: 1 },
  routeCardBgStyle: { borderRadius: 20 },
  routeCardGradient: { ...StyleSheet.absoluteFillObject },
  locationContent: { gap: 20 },
  mapBackground: { height: 160, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(217,203,160,0.25)', overflow: 'hidden' },
  mapGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapLocationText: { fontSize: 14, fontWeight: '600', color: '#D9CBA0', textAlign: 'center', paddingHorizontal: 20, fontFamily: Platform.select({ ios: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
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
  bottomDock: { position: 'absolute', bottom: 12, left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  dockContainer: { width: '92%', height: 60, borderRadius: 28, overflow: 'hidden' },
  dockContent: { flex: 1, backgroundColor: 'rgba(25,25,25,0.35)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  dockItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  dockLabelInactive: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontFamily: Platform.select({ ios: 'Inter', android: 'Inter', web: 'Inter, -apple-system, sans-serif' }) },
})
