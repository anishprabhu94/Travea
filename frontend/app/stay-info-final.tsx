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

const { width, height } = Dimensions.get('window')

export default function StayInfoFinal() {
  const [activeRoomIndex, setActiveRoomIndex] = useState(0)

  // Editorial stay data
  const stay = {
    name: 'Hotel Santa Caterina',
    tagline: 'Where terraces meet the azure sea',
    location: 'Positano, Amalfi Coast',
    distance: '1.2 mi from center',
    rating: 4.8,
    coreAmenities: [
      { icon: 'water', label: 'Infinity Pool' },
      { icon: 'partly-sunny', label: 'Ocean View' },
      { icon: 'fitness', label: 'Spa' },
      { icon: 'restaurant', label: 'Breakfast' },
    ],
    estTotal: '€420',
    nights: 2,
    
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    
    storyLines: [
      'A cliffside sanctuary',
      'where lemon groves meet marble terraces.',
      'Each morning, salt air. Each evening, golden reverie.',
    ],
    storyBackgroundImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    
    nearbyPlaces: [
      { name: 'Positano Beach', distance: '0.3 mi' },
      { name: 'Path of Gods', distance: '2.1 mi' },
      { name: 'Villa Rufolo', distance: '4.5 mi' },
    ],
    
    rooms: [
      {
        name: 'Deluxe Sea View Suite',
        poeticLine: 'Where azure meets horizon',
        price: '€420',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      },
      {
        name: 'Superior Garden Room',
        poeticLine: 'Lemon-scented morning air',
        price: '€320',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      },
      {
        name: 'Premium Ocean Suite',
        poeticLine: 'Two terraces, endless views',
        price: '€580',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      },
    ],
    
    reviews: [
      { quote: 'Every detail whispers elegance', author: 'S.M.', rating: 5 },
      { quote: 'A sanctuary above the sea', author: 'A.R.', rating: 5 },
      { quote: 'We will return, always', author: 'C.B.', rating: 5 },
    ],
    
    finalQuote: 'Where mornings slow and horizons shimmer.',
    finalImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
  }

  const bookingPlatforms = ['Official Site', 'Booking.com', 'Expedia', 'Kayak']

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. ARRIVAL - Hero Visual & Overview */}
        <View style={styles.arrivalSection}>
          <ImageBackground
            source={{ uri: stay.heroImage }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            {/* Bronze gradient at bottom */}
            <LinearGradient
              colors={['rgba(0,0,0,0)', 'rgba(13,13,13,0.9)']}
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

            {/* Slim Info Card */}
            <View style={styles.heroInfoCard}>
              <LinearGradient
                colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroInfoGradient}
              >
                <Text style={styles.heroName}>{stay.name}</Text>
                <Text style={styles.heroTagline}>{stay.tagline}</Text>
                <Text style={styles.heroLocation}>
                  {stay.location} · {stay.distance}
                </Text>

                {/* Rating & Core Amenities */}
                <View style={styles.heroMeta}>
                  <View style={styles.ratingGroup}>
                    <Ionicons name="star" size={14} color="#D9CBA0" />
                    <Text style={styles.ratingText}>{stay.rating}</Text>
                  </View>
                  {stay.coreAmenities.map((amenity, index) => (
                    <React.Fragment key={index}>
                      <Text style={styles.metaDot}>·</Text>
                      <Ionicons name={amenity.icon as any} size={14} color="rgba(217,203,160,0.8)" />
                      <Text style={styles.amenityLabel}>{amenity.label}</Text>
                    </React.Fragment>
                  ))}
                </View>

                <Text style={styles.heroPrice}>
                  Est. Total {stay.estTotal} · {stay.nights} nights
                </Text>
              </LinearGradient>
            </View>

            {/* Scroll Cue */}
            <View style={styles.scrollCue}>
              <Text style={styles.scrollCueText}>Explore your stay</Text>
              <Ionicons name="chevron-down" size={14} color="rgba(217,203,160,0.6)" />
            </View>
          </ImageBackground>
        </View>

        {/* 2. THE STAY - Story + Highlights */}
        <View style={styles.staySection}>
          <ImageBackground
            source={{ uri: stay.storyBackgroundImage }}
            style={styles.storyBackground}
            imageStyle={styles.storyBackgroundStyle}
          >
            <LinearGradient
              colors={['rgba(13,13,13,0.85)', 'rgba(13,13,13,0.92)']}
              style={styles.storyGradient}
            />

            {/* Poetic Text with Staggered Alignment */}
            <View style={styles.storyTextContainer}>
              <View style={styles.frostPoetry}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.frostPoetryGradient}
                >
                  {stay.storyLines.map((line, index) => (
                    <Text 
                      key={index} 
                      style={[
                        styles.poetryLine,
                        index === 0 && styles.poetryLineFirst,
                        index === 1 && styles.poetryLineSecond,
                        index === 2 && styles.poetryLineThird,
                      ]}
                    >
                      {line}
                    </Text>
                  ))}
                </LinearGradient>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* 3. ESSENTIALS - Location · Amenities · Rooms */}
        <View style={styles.essentialsSection}>
          {/* A. Location */}
          <View style={styles.locationContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            
            {/* Map Placeholder with Bronze Theme */}
            <View style={styles.mapContainer}>
              <LinearGradient
                colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mapGradient}
              >
                <Ionicons name="location" size={56} color="#D9CBA0" />
                <Text style={styles.mapSubtitle}>{stay.location}</Text>
                <Text style={styles.mapDistance}>{stay.distance}</Text>
              </LinearGradient>
            </View>

            {/* Nearby Chips */}
            <View style={styles.nearbyChipsContainer}>
              {stay.nearbyPlaces.map((place, index) => (
                <View key={index} style={styles.nearbyChip}>
                  <LinearGradient
                    colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.nearbyChipGradient}
                  >
                    <Text style={styles.nearbyChipName}>{place.name}</Text>
                    <Text style={styles.nearbyChipDistance}>{place.distance}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          {/* B. Key Amenities - 4 Horizontal Capsules */}
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.amenitiesRow}>
              {stay.coreAmenities.map((amenity, index) => (
                <View key={index} style={styles.amenityCapsule}>
                  <LinearGradient
                    colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.amenityCapsuleGradient}
                  >
                    <View style={styles.amenityIconCircle}>
                      <Ionicons name={amenity.icon as any} size={24} color="#D9CBA0" />
                    </View>
                    <Text style={styles.amenityCapsuleLabel}>{amenity.label}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>

          {/* C. Their Rooms */}
          <View style={styles.roomsContainer}>
            <Text style={styles.sectionTitle}>Their Rooms</Text>
            
            {/* Horizontal Room Carousel */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.roomsScroll}
              onScroll={(e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / 320)
                setActiveRoomIndex(index)
              }}
              scrollEventThrottle={16}
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
                      colors={['rgba(0,0,0,0)', 'rgba(13,13,13,0.85)']}
                      style={styles.roomCardGradient}
                    />
                    
                    {/* Frosted Info Overlay Bottom-Left */}
                    <View style={styles.roomInfoOverlay}>
                      <LinearGradient
                        colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.roomInfoGradient}
                      >
                        <Text style={styles.roomName}>{room.name}</Text>
                        <Text style={styles.roomPoeticLine}>{room.poeticLine}</Text>
                        <Text style={styles.roomPrice}>{room.price} / night</Text>
                      </LinearGradient>
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>

            {/* Room Indicators */}
            <View style={styles.roomIndicators}>
              {stay.rooms.map((_, index) => (
                <View 
                  key={index}
                  style={[
                    styles.roomDot,
                    activeRoomIndex === index && styles.roomDotActive
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* 4. IMPRESSION - Reviews + Booking */}
        <View style={styles.impressionSection}>
          {/* A. Reviews - Compact Horizontal Carousel */}
          <View style={styles.reviewsContainer}>
            <Text style={styles.sectionTitle}>Impressions</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewsScroll}
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

          {/* B. Booking Strip - Floating over Final Image */}
          <View style={styles.bookingSection}>
            <ImageBackground
              source={{ uri: stay.finalImage }}
              style={styles.bookingBackground}
              imageStyle={styles.bookingBackgroundStyle}
            >
              <LinearGradient
                colors={['rgba(13,13,13,0.75)', 'rgba(13,13,13,0.9)']}
                style={styles.bookingGradient}
              />

              {/* Floating Bronze Strip */}
              <View style={styles.bookingStrip}>
                <LinearGradient
                  colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.bookingStripGradient}
                >
                  {/* Left: Quote */}
                  <Text style={styles.bookingQuote}>"{stay.finalQuote}"</Text>

                  {/* Right: Inline Booking Pills */}
                  <View style={styles.bookingPills}>
                    {bookingPlatforms.map((platform, index) => (
                      <TouchableOpacity 
                        key={index}
                        style={styles.bookingPill}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.bookingPillText}>{platform}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </LinearGradient>
              </View>
            </ImageBackground>
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
    paddingBottom: 0,
  },

  // 1. ARRIVAL Section
  arrivalSection: {
    width: '100%',
  },
  heroImage: {
    height: 480,
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
    borderColor: 'rgba(217,203,160,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
      },
    }),
  },
  heroInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 30px rgba(0,0,0,0.6)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
      },
    }),
  },
  heroInfoGradient: {
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  heroName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  heroTagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#D9CBA0',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  metaDot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
  },
  amenityLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  scrollCue: {
    position: 'absolute',
    bottom: 4,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 2,
  },
  scrollCueText: {
    fontSize: 11,
    color: 'rgba(217,203,160,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 2. THE STAY Section
  staySection: {
    width: '100%',
  },
  storyBackground: {
    height: 360,
    width: '100%',
  },
  storyBackgroundStyle: {
    opacity: 0.4,
  },
  storyGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  storyTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  frostPoetry: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  frostPoetryGradient: {
    padding: 32,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  poetryLine: {
    fontSize: 18,
    lineHeight: 32,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  poetryLineFirst: {
    paddingLeft: 0,
  },
  poetryLineSecond: {
    paddingLeft: 20,
  },
  poetryLineThird: {
    paddingLeft: 40,
    color: '#D9CBA0',
  },

  // 3. ESSENTIALS Section
  essentialsSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 48,
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

  // Location
  locationContainer: {
    gap: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
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
  mapSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#D9CBA0',
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
  nearbyChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  nearbyChip: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    overflow: 'hidden',
  },
  nearbyChipGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
      },
    }),
  },
  nearbyChipName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  nearbyChipDistance: {
    fontSize: 11,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Amenities
  amenitiesContainer: {
    gap: 20,
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  amenityCapsule: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
  },
  amenityCapsuleGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 10,
    minHeight: 120,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  amenityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(217,203,160,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityCapsuleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Rooms
  roomsContainer: {
    gap: 20,
  },
  roomsScroll: {
    paddingRight: 24,
  },
  roomCard: {
    width: 320,
    height: 380,
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
  roomInfoOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    overflow: 'hidden',
  },
  roomInfoGradient: {
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  roomName: {
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
  roomPoeticLine: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  roomPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  roomIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  roomDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(217,203,160,0.3)',
  },
  roomDotActive: {
    backgroundColor: '#D9CBA0',
    width: 20,
  },

  // 4. IMPRESSION Section
  impressionSection: {
    gap: 0,
  },

  // Reviews
  reviewsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  reviewsScroll: {
    paddingRight: 24,
  },
  reviewCard: {
    width: 280,
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
    minHeight: 140,
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
    fontSize: 15,
    lineHeight: 22,
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

  // Booking Section
  bookingSection: {
    width: '100%',
  },
  bookingBackground: {
    height: 320,
    width: '100%',
  },
  bookingBackgroundStyle: {
    opacity: 0.5,
  },
  bookingGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  bookingStrip: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
  },
  bookingStripGradient: {
    padding: 24,
    gap: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  bookingQuote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#D9CBA0',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  bookingPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  bookingPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(217,203,160,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
  },
  bookingPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
