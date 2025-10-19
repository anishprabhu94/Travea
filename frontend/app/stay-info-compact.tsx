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
import { router, useLocalSearchParams } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

const { width, height } = Dimensions.get('window')

type TabType = 'gallery' | 'rooms' | 'location'

export default function StayInfoCompact() {
  const params = useLocalSearchParams()
  const nights = parseInt(params.nights as string || '3')
  
  const [activeTab, setActiveTab] = useState<TabType>('gallery')
  const [bookingStatus, setBookingStatus] = useState<'none' | 'booked' | 'canceled'>('none')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleMarkBooked = () => {
    setBookingStatus('booked')
    setToastMessage(`Stay booked · ${nights} ${nights === 1 ? 'night' : 'nights'}`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleMarkCanceled = () => {
    setBookingStatus('canceled')
    setToastMessage('Booking canceled')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // Compact stay data
  const pricePerNight = 420 // Base price in euros
  const totalPrice = pricePerNight * nights
  
  const stay = {
    name: 'Hotel Santa Caterina',
    tagline: 'Where terraces meet the azure sea',
    location: 'Positano, Amalfi Coast',
    rating: 4.8,
    reviewCount: 342,
    pricePerNight: `€${pricePerNight}`,
    totalPrice: `€${totalPrice}`,
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    
    essenceTags: ['Azure Air', 'Lemon Calm', 'Cliff Light'],
    
    bookingPlatforms: ['Official Site', 'Booking.com', 'Expedia'],
    
    galleryImages: [
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    ],
    
    rooms: [
      {
        name: 'Deluxe Sea View Suite',
        caption: 'Where azure meets horizon',
        price: '€420',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      },
      {
        name: 'Superior Garden Room',
        caption: 'Lemon-scented morning air',
        price: '€320',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      },
      {
        name: 'Premium Ocean Suite',
        caption: 'Two terraces, endless views',
        price: '€580',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      },
    ],
    
    nearbyPlaces: [
      { name: 'Positano Beach', distance: '0.3 mi', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
      { name: 'Path of Gods', distance: '2.1 mi', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
      { name: 'Villa Rufolo', distance: '4.5 mi', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
    ],
    
    amenities: [
      { icon: 'water', label: 'Infinity Pool', subtext: 'Heated with ocean views' },
      { icon: 'partly-sunny', label: 'Ocean View', subtext: 'Every room, every angle' },
      { icon: 'fitness', label: 'Spa & Wellness', subtext: 'Massage, sauna, steam' },
      { icon: 'restaurant', label: 'Breakfast', subtext: 'Continental & Italian' },
    ],
    
    reviews: [
      { quote: 'Every detail whispers elegance', author: 'Sofia M.', rating: 5 },
      { quote: 'A sanctuary above the sea', author: 'Alessandro R.', rating: 5 },
      { quote: 'We will return, always', author: 'Charlotte B.', rating: 5 },
      { quote: 'Impeccable service and views', author: 'Marco V.', rating: 5 },
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
            source={{ uri: stay.heroImage }}
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
              {/* Essence Tags */}
              <View style={styles.essenceTagsRow}>
                {stay.essenceTags.map((tag, index) => (
                  <View key={index} style={styles.essenceTag}>
                    <Text style={styles.essenceTagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Hotel Info */}
              <View style={styles.heroNameRow}>
                <View style={styles.heroNameLeft}>
                  <Text style={styles.heroName}>{stay.name}</Text>
                  <Text style={styles.heroTagline}>{stay.tagline}</Text>
                </View>
                <View style={styles.heroPriceTag}>
                  <Text style={styles.heroPriceAmount}>{stay.totalPrice}</Text>
                  <Text style={styles.heroPriceLabel}>total · {nights} {nights === 1 ? 'night' : 'nights'}</Text>
                </View>
              </View>
              <Text style={styles.heroLocation}>{stay.location}</Text>

              {/* Rating */}
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#D9CBA0" />
                <Text style={styles.ratingText}>{stay.rating}</Text>
                <Text style={styles.reviewCount}>({stay.reviewCount} reviews)</Text>
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
              {stay.bookingPlatforms.map((platform, index) => (
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
            {['gallery', 'rooms', 'location'].map((tab) => (
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
            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <View style={styles.galleryGrid}>
                {stay.galleryImages.map((image, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.galleryItem,
                      index % 3 === 0 && styles.galleryItemLarge
                    ]}
                  >
                    <ImageBackground
                      source={{ uri: image }}
                      style={styles.galleryItemBg}
                      imageStyle={styles.galleryItemBgStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.4)']}
                        style={styles.galleryItemGradient}
                      />
                    </ImageBackground>
                  </View>
                ))}
              </View>
            )}

            {/* Rooms Tab */}
            {activeTab === 'rooms' && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.roomsCarousel}
              >
                {stay.rooms.map((room, index) => (
                  <View 
                    key={index} 
                    style={[styles.roomCard, index === 0 && styles.firstRoomCard]}
                  >
                    <ImageBackground
                      source={{ uri: room.image }}
                      style={styles.roomCardBg}
                      imageStyle={styles.roomCardBgStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(13,13,13,0.9)']}
                        style={styles.roomCardGradient}
                      />
                      <View style={styles.roomCardInfo}>
                        <LinearGradient
                          colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.roomCardInfoGradient}
                        >
                          <Text style={styles.roomCardName}>{room.name}</Text>
                          <Text style={styles.roomCardCaption}>{room.caption}</Text>
                          <Text style={styles.roomCardPrice}>{room.price} / night</Text>
                        </LinearGradient>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <View style={styles.locationContent}>
                {/* Dark Map Background - Reduced Height */}
                <View style={styles.mapBackground}>
                  <LinearGradient
                    colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.mapGradient}
                  >
                    <Ionicons name="location" size={48} color="#D9CBA0" />
                    <Text style={styles.mapLocationText}>{stay.location}</Text>
                  </LinearGradient>
                </View>

                {/* Nearby Places - Horizontal Scrollable */}
                <Text style={styles.nearbyPlacesTitle}>Nearby Highlights</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.nearbyPlacesScroll}
                >
                  {stay.nearbyPlaces.map((place, index) => (
                    <View key={index} style={[styles.nearbyPlaceCard, index === 0 && styles.firstNearbyCard]}>
                      <ImageBackground
                        source={{ uri: place.image }}
                        style={styles.nearbyPlaceBg}
                        imageStyle={styles.nearbyPlaceBgStyle}
                      >
                        <LinearGradient
                          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                          style={styles.nearbyPlaceGradient}
                        />
                        <View style={styles.nearbyPlaceInfo}>
                          <Text style={styles.nearbyPlaceName}>{place.name}</Text>
                          <Text style={styles.nearbyPlaceDistance}>{place.distance}</Text>
                        </View>
                      </ImageBackground>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* 3. KEY AMENITIES */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Highlights of the Stay</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.amenitiesRow}
          >
            {stay.amenities.map((amenity, index) => (
              <View 
                key={index} 
                style={[styles.amenityCapsule, index === 0 && styles.firstAmenityCapsule]}
              >
                <LinearGradient
                  colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.amenityCapsuleGradient}
                >
                  <View style={styles.amenityIconCircle}>
                    <Ionicons name={amenity.icon as any} size={28} color="#D9CBA0" />
                  </View>
                  <Text style={styles.amenityLabel}>{amenity.label}</Text>
                  <Text style={styles.amenitySubtext}>{amenity.subtext}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 4. REVIEWS */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>What Guests Loved</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.seeAllLink}>See all reviews →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsCarousel}
          >
            {stay.reviews.map((review, index) => (
              <View 
                key={index} 
                style={[styles.reviewCard, index === 0 && styles.firstReviewCard]}
              >
                <LinearGradient
                  colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.reviewCardGradient}
                >
                  <View style={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Ionicons key={i} name="star" size={12} color="#D9CBA0" />
                    ))}
                  </View>
                  <Text style={styles.reviewQuote}>"{review.quote}"</Text>
                  <Text style={styles.reviewAuthor}>— {review.author}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Toast Notification */}
      {showToast && (
        <View style={styles.toast}>
          <BlurView intensity={24} tint="dark" style={styles.toastBlur}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </BlurView>
        </View>
      )}

      {/* Bottom Dock - Booking Buttons Only (Light & Sleek) */}
      <View style={styles.bottomDock}>
        <BlurView intensity={18} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity
              style={[styles.bookingDockButton, styles.bookingDockButtonBooked]}
              onPress={handleMarkBooked}
              activeOpacity={0.8}
              disabled={bookingStatus === 'booked'}
            >
              <LinearGradient
                colors={bookingStatus === 'booked' 
                  ? ['rgba(156,142,106,0.5)', 'rgba(156,142,106,0.4)'] 
                  : ['rgba(214,193,152,0.4)', 'rgba(214,193,152,0.3)']}
                style={styles.bookingDockButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {bookingStatus === 'booked' && (
                  <Ionicons name="checkmark-circle" size={16} color="rgba(214,193,152,0.9)" style={{marginRight: 6}} />
                )}
                <Text style={[styles.bookingDockButtonText, bookingStatus === 'booked' && styles.bookingDockButtonTextDisabled]}>
                  {bookingStatus === 'booked' ? 'Booked' : 'Mark as Booked'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.bookingDockButton, styles.bookingDockButtonCancel]}
              onPress={handleMarkCanceled}
              activeOpacity={0.8}
              disabled={bookingStatus === 'canceled'}
            >
              <LinearGradient
                colors={bookingStatus === 'canceled' 
                  ? ['rgba(108,85,80,0.4)', 'rgba(108,85,80,0.3)'] 
                  : ['rgba(126,85,80,0.5)', 'rgba(108,85,80,0.4)']}
                style={styles.bookingDockButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {bookingStatus === 'canceled' && (
                  <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.7)" style={{marginRight: 6}} />
                )}
                <Text style={[styles.bookingDockButtonText, styles.bookingDockButtonTextCancel]}>
                  {bookingStatus === 'canceled' ? 'Canceled' : 'Mark as Canceled'}
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
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for dock
  },

  // 1. HERO SECTION
  heroSection: {
    width: '100%',
  },
  heroImage: {
    height: 420,
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
  essenceTagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  essenceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(217,203,160,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
  },
  essenceTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroNameLeft: {
    flex: 1,
    marginRight: 16,
  },
  heroName: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
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
  heroTagline: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#D9CBA0',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroLocation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  reviewCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Floating Booking Strip - Better Spacing
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
    minHeight: 400,
  },

  // Gallery Grid
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  galleryItem: {
    width: (width - 60) / 2,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  galleryItemLarge: {
    width: width - 48,
    height: 200,
  },
  galleryItemBg: {
    flex: 1,
  },
  galleryItemBgStyle: {
    borderRadius: 16,
  },
  galleryItemGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  // Rooms Carousel
  roomsCarousel: {
    paddingRight: 24,
  },
  roomCard: {
    width: 300,
    height: 360,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  firstRoomCard: {
    marginLeft: 0,
  },
  roomCardBg: {
    flex: 1,
  },
  roomCardBgStyle: {
    borderRadius: 24,
  },
  roomCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  roomCardInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
  },
  roomCardInfoGradient: {
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  roomCardName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  roomCardCaption: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  roomCardPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Location Content
  locationContent: {
    gap: 20,
  },
  mapBackground: {
    height: 160,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
  },
  mapGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  mapLocationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  nearbyPlacesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  nearbyPlacesScroll: {
    paddingRight: 24,
  },
  nearbyPlaceCard: {
    width: 200,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  firstNearbyCard: {
    marginLeft: 0,
  },
  nearbyPlaceBg: {
    flex: 1,
  },
  nearbyPlaceBgStyle: {
    borderRadius: 16,
  },
  nearbyPlaceGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  nearbyPlaceInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  nearbyPlaceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 3,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  nearbyPlaceDistance: {
    fontSize: 11,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 3. KEY AMENITIES - Reduced & Elegant
  amenitiesSection: {
    paddingLeft: 24,
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
  amenitiesRow: {
    paddingRight: 24,
  },
  amenityCapsule: {
    width: 140,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
    marginRight: 12,
  },
  firstAmenityCapsule: {
    marginLeft: 0,
  },
  amenityCapsuleGradient: {
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
  amenityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217,203,160,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  amenitySubtext: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 4. REVIEWS
  reviewsSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllLink: {
    fontSize: 13,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  reviewsCarousel: {
    paddingRight: 24,
  },
  reviewCard: {
    width: 260,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    overflow: 'hidden',
    marginRight: 16,
  },
  firstReviewCard: {
    marginLeft: 0,
  },
  reviewCardGradient: {
    padding: 20,
    minHeight: 130,
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  reviewQuote: {
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
  reviewAuthor: {
    fontSize: 12,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // BOTTOM DOCK - Identical to Landing Page
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  
  // Booking Dock Buttons (Sleek & Thin)
  bookingDockButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  bookingDockButtonBooked: {
    borderColor: 'rgba(214,193,152,0.3)',
  },
  bookingDockButtonCancel: {
    borderColor: 'rgba(126,85,80,0.3)',
  },
  bookingDockButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  bookingDockButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  bookingDockButtonTextDisabled: {
    color: 'rgba(214,193,152,0.6)',
  },
  bookingDockButtonTextCancel: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Toast Notification
  toast: {
    position: 'absolute',
    bottom: 110,
    left: '50%',
    transform: [{ translateX: -150 }],
    width: 300,
    zIndex: 1000,
  },
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
