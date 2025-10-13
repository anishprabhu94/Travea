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

const { width } = Dimensions.get('window')

export default function StayInfo() {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Placeholder hotel data
  const hotelData = {
    name: 'Hotel Santa Caterina',
    tagline: 'Where terraces meet the azure sea',
    location: 'Amalfi Coast, Italy',
    neighborhood: 'Positano',
    distance: '1.2 mi from center',
    rating: 4.8,
    amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
    estTotal: '€420',
    nights: 2,
    images: [
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    ],
    overview: 'A cliffside sanctuary where lemon groves meet marble terraces. Each morning arrives with salt air and the soft hymn of the sea.',
    address: 'Via Mauro Comite, 9, 84011 Amalfi SA, Italy',
    fullAmenities: [
      { icon: 'water', label: 'Infinity Pool' },
      { icon: 'restaurant', label: 'Breakfast' },
      { icon: 'fitness', label: 'Spa & Wellness' },
      { icon: 'wifi', label: 'Free Wi-Fi' },
      { icon: 'car', label: 'Valet Parking' },
      { icon: 'cafe', label: 'Room Service' },
      { icon: 'partly-sunny', label: 'Ocean View' },
      { icon: 'flower', label: 'Garden Terrace' },
    ],
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    roomType: 'Deluxe Sea View Suite',
    capacity: '2 guests',
    bedConfig: '1 King Bed',
    cancellation: 'Free cancellation up to 48 hours before check-in',
    galleryImages: [
      { url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg', caption: 'Terrace View' },
      { url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg', caption: 'Infinity Pool' },
      { url: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg', caption: 'Lobby Lounge' },
    ],
    reviews: [
      { quote: 'Every detail whispers elegance. The sunrise from our terrace was simply transcendent.', author: 'Sofia M.' },
      { quote: 'Impeccable service, breathtaking views. A sanctuary above the sea.', author: 'Alessandro R.' },
      { quote: 'The perfect balance of luxury and authenticity. We will return.', author: 'Charlotte B.' },
    ],
    footerQuote: 'Where mornings slow and horizons shimmer.',
  }

  const bookingPlatforms = [
    { name: 'Official Site', url: '#' },
    { name: 'Booking.com', url: '#' },
    { name: 'Expedia', url: '#' },
    { name: 'Kayak', url: '#' },
  ]

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section with Image Gallery */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: hotelData.images[activeImageIndex] }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
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

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {hotelData.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.indicator,
                    activeImageIndex === index && styles.indicatorActive
                  ]}
                  onPress={() => setActiveImageIndex(index)}
                  activeOpacity={0.8}
                />
              ))}
            </View>

            {/* Frosted Overlay Content */}
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>{hotelData.name}</Text>
              <Text style={styles.heroTagline}>{hotelData.tagline}</Text>
              
              <Text style={styles.heroLocation}>
                {hotelData.neighborhood}, {hotelData.location} · {hotelData.distance}
              </Text>

              {/* Rating & Amenities Row */}
              <View style={styles.ratingAmenitiesRow}>
                <View style={styles.ratingGroup}>
                  <Ionicons name="star" size={14} color="#D9CBA0" />
                  <Text style={styles.ratingText}>{hotelData.rating}</Text>
                </View>
                {hotelData.amenities.map((amenity, index) => (
                  <React.Fragment key={amenity}>
                    <Text style={styles.amenityDot}>·</Text>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </React.Fragment>
                ))}
              </View>

              <Text style={styles.heroPrice}>
                Est. Total {hotelData.estTotal} · {hotelData.nights} nights
              </Text>

              {/* Book Via Pills */}
              <View style={styles.bookViaPills}>
                <Text style={styles.bookViaLabel}>Book via</Text>
                <View style={styles.pillsRow}>
                  {bookingPlatforms.map((platform) => (
                    <TouchableOpacity 
                      key={platform.name}
                      style={styles.bookPill}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.bookPillText}>{platform.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Content Sections */}
        <View style={styles.contentContainer}>
          {/* Overview Section */}
          <View style={styles.sectionPane}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overviewText}>{hotelData.overview}</Text>
          </View>

          {/* Location & Map Section */}
          <View style={styles.sectionPane}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.addressText}>{hotelData.address}</Text>
            
            {/* Static Map Placeholder */}
            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={48} color="#D9CBA0" />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
              <Text style={styles.mapDistance}>{hotelData.distance}</Text>
            </View>
          </View>

          {/* Amenities Section */}
          <View style={styles.sectionPane}>
            <Text style={styles.sectionTitle}>Amenities & Inclusions</Text>
            <View style={styles.amenitiesGrid}>
              {hotelData.fullAmenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={styles.amenityIconCircle}>
                    <Ionicons name={amenity.icon as any} size={20} color="#D9CBA0" />
                  </View>
                  <Text style={styles.amenityLabel}>{amenity.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Stay Details Section */}
          <View style={styles.sectionPane}>
            <Text style={styles.sectionTitle}>Stay Details</Text>
            
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check-in</Text>
                <Text style={styles.detailValue}>{hotelData.checkIn}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check-out</Text>
                <Text style={styles.detailValue}>{hotelData.checkOut}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Room Type</Text>
                <Text style={styles.detailValue}>{hotelData.roomType}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Capacity</Text>
                <Text style={styles.detailValue}>{hotelData.capacity}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bed Configuration</Text>
                <Text style={styles.detailValue}>{hotelData.bedConfig}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cancellation</Text>
                <Text style={styles.detailValue}>{hotelData.cancellation}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Est. Total</Text>
                <Text style={styles.detailValuePrice}>{hotelData.estTotal} · {hotelData.nights} nights</Text>
              </View>
            </View>
          </View>

          {/* Gallery Section */}
          <View style={styles.sectionPane}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryScroll}
            >
              {hotelData.galleryImages.map((image, index) => (
                <View key={index} style={[styles.galleryItem, index === 0 && styles.firstGalleryItem]}>
                  <ImageBackground
                    source={{ uri: image.url }}
                    style={styles.galleryImage}
                    imageStyle={styles.galleryImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
                      style={styles.galleryGradient}
                    />
                    <View style={styles.galleryCaption}>
                      <Text style={styles.galleryCaptionText}>{image.caption}</Text>
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Reviews Section */}
          <View style={styles.sectionPane}>
            <Text style={styles.sectionTitle}>Guest Reviews</Text>
            {hotelData.reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <Text style={styles.reviewQuote}>"{review.quote}"</Text>
                <Text style={styles.reviewAuthor}>— {review.author}</Text>
              </View>
            ))}
          </View>

          {/* Book Via Section (Reinforced) */}
          <View style={styles.sectionPane}>
            <Text style={styles.sectionTitle}>Book Your Stay</Text>
            <View style={styles.bookViaSection}>
              {bookingPlatforms.map((platform) => (
                <TouchableOpacity 
                  key={platform.name}
                  style={styles.bookButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bookButtonText}>{platform.name}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#D9CBA0" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer Quote */}
          <View style={styles.footerQuote}>
            <Text style={styles.footerQuoteText}>{hotelData.footerQuote}</Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: 60,
  },

  // Hero Section
  heroContainer: {
    height: 520,
    width: '100%',
  },
  heroBackground: {
    flex: 1,
  },
  heroBackgroundImage: {
    opacity: 0.9,
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
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  imageIndicators: {
    position: 'absolute',
    top: 48,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  indicatorActive: {
    backgroundColor: '#D9CBA0',
    width: 24,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20,20,20,0.85)',
    padding: 32,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
      },
    }),
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  heroTagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#D9CBA0',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  ratingAmenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  amenityDot: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
  },
  amenityText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D9CBA0',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  bookViaPills: {
    marginTop: 8,
  },
  bookViaLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bookPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(217,203,160,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
  },
  bookPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Content Container
  contentContainer: {
    padding: 24,
    gap: 32,
  },

  // Section Pane
  sectionPane: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(217,203,160,0.15)',
    padding: 28,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.05)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },

  // Overview
  overviewText: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Location
  addressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: 'rgba(217,203,160,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#D9CBA0',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  mapDistance: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Amenities
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  amenityItem: {
    width: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amenityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(217,203,160,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Stay Details
  detailsGrid: {
    gap: 18,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(217,203,160,0.15)',
  },
  detailLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    flex: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  detailValue: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    flex: 1.5,
    textAlign: 'right',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  detailValuePrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    flex: 1.5,
    textAlign: 'right',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Gallery
  galleryScroll: {
    paddingRight: 28,
  },
  galleryItem: {
    width: 280,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  firstGalleryItem: {
    marginLeft: 0,
  },
  galleryImage: {
    flex: 1,
  },
  galleryImageStyle: {
    borderRadius: 20,
  },
  galleryGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  galleryCaption: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  galleryCaptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Reviews
  reviewItem: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(217,203,160,0.15)',
  },
  reviewQuote: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  reviewAuthor: {
    fontSize: 13,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Book Via Section
  bookViaSection: {
    gap: 12,
  },
  bookButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(217,203,160,0.12)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    padding: 18,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Footer Quote
  footerQuote: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerQuoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#D9CBA0',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
