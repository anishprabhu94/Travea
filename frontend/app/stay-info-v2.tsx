import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

export default function StayInfoV2() {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  // Editorial hotel data
  const stayData = {
    name: 'Hotel Santa Caterina',
    tagline: 'Where terraces meet the azure sea',
    location: 'Positano, Amalfi Coast',
    distance: '1.2 mi from center',
    rating: 4.8,
    
    // Only experiential amenities with icons
    coreAmenities: [
      { icon: 'water', label: 'Infinity Pool' },
      { icon: 'partly-sunny', label: 'Ocean View' },
      { icon: 'fitness', label: 'Spa' },
      { icon: 'restaurant', label: 'Breakfast' },
    ],
    
    estTotal: '€420',
    nights: 2,
    
    // Hero image
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    
    // Story section - poetic lines
    storyLines: [
      'A cliffside sanctuary',
      'where lemon groves meet marble terraces.',
      'Each morning, salt air. Each evening, golden reverie.',
    ],
    storyBackgroundImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    
    // Location
    mapCoordinates: '40.6340, 14.6028',
    nearbyPlaces: [
      { name: 'Positano Beach', distance: '0.3 mi' },
      { name: 'Path of the Gods', distance: '2.1 mi' },
      { name: 'Villa Rufolo', distance: '4.5 mi' },
    ],
    
    // Rooms
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
    
    // Reviews
    reviews: [
      { quote: 'Every detail whispers elegance', author: 'S.M.', rating: 5 },
      { quote: 'A sanctuary above the sea', author: 'A.R.', rating: 5 },
      { quote: 'We will return, always', author: 'C.B.', rating: 5 },
    ],
    
    // Final quote
    finalQuote: 'Where mornings slow and horizons shimmer.',
    finalImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
  }

  const bookingPlatforms = ['Official Site', 'Booking.com', 'Expedia', 'Kayak']

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* 1. THE ARRIVAL - Hero Section */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: stayData.heroImages[activeImageIndex] }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(13,13,13,0.8)']}
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

            {/* Image Carousel Indicators */}
            <View style={styles.carouselIndicators}>
              {stayData.heroImages.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.carouselDot,
                    activeImageIndex === index && styles.carouselDotActive
                  ]}
                  onPress={() => setActiveImageIndex(index)}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            {/* Floating Essence Tags */}
            <View style={styles.essenceTagsContainer}>
              {stayData.essenceTags.map((tag, index) => (
                <View key={index} style={styles.essenceFloatingTag}>
                  <Text style={styles.essenceFloatingTagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Bronze Frosted Info Card */}
            <View style={styles.heroInfoCard}>
              <LinearGradient
                colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroInfoGradient}
              >
                <Text style={styles.heroPropertyName}>{stayData.name}</Text>
                <Text style={styles.heroTagline}>{stayData.tagline}</Text>
                <Text style={styles.heroLocation}>
                  {stayData.location} · {stayData.distance}
                </Text>

                {/* Rating & Amenities */}
                <View style={styles.heroMetaRow}>
                  <Ionicons name="star" size={14} color="#D9CBA0" />
                  <Text style={styles.heroRating}>{stayData.rating}</Text>
                  {stayData.quickAmenities.map((amenity, index) => (
                    <React.Fragment key={amenity}>
                      <Text style={styles.heroDot}>·</Text>
                      <Text style={styles.heroAmenity}>{amenity}</Text>
                    </React.Fragment>
                  ))}
                </View>

                <Text style={styles.heroPrice}>
                  Est. Total {stayData.estTotal} · {stayData.nights} nights
                </Text>
              </LinearGradient>
            </View>

            {/* Scroll Cue */}
            <View style={styles.scrollCue}>
              <Text style={styles.scrollCueText}>Explore your stay</Text>
              <Ionicons name="chevron-down" size={16} color="#D9CBA0" />
            </View>
          </ImageBackground>
        </View>

        {/* 2. THE EXPERIENCE - Mid Section */}
        <View style={styles.experienceSection}>
          {/* Overview - Poetic Text */}
          <View style={styles.overviewContainer}>
            <View style={styles.frostCapsule}>
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.frostGradient}
              >
                <Text style={styles.overviewTitle}>The Stay</Text>
                <Text style={styles.overviewText}>{stayData.overview}</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Location - Split View */}
          <View style={styles.locationContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            
            <View style={styles.locationSplit}>
              {/* Map Placeholder */}
              <View style={styles.bronzeMap}>
                <LinearGradient
                  colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.mapGradient}
                >
                  <Ionicons name="location" size={48} color="#D9CBA0" />
                  <Text style={styles.mapText}>{stayData.distance}</Text>
                </LinearGradient>
              </View>

              {/* Nearby Places Chips */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.nearbyChipsScroll}
              >
                {stayData.nearbyPlaces.map((place, index) => (
                  <View key={index} style={styles.nearbyChip}>
                    <ImageBackground
                      source={{ uri: place.image }}
                      style={styles.nearbyChipBg}
                      imageStyle={styles.nearbyChipBgImage}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                        style={styles.nearbyChipGradient}
                      >
                        <Text style={styles.nearbyChipName}>{place.name}</Text>
                        <Text style={styles.nearbyChipDistance}>{place.distance}</Text>
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Amenities - Interactive Capsules */}
          <View style={styles.amenitiesContainer}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {stayData.amenities.map((amenity, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.amenityCapsule}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.amenityCapsuleGradient}
                  >
                    <View style={styles.amenityIconContainer}>
                      <Ionicons name={amenity.icon as any} size={24} color="#D9CBA0" />
                    </View>
                    <Text style={styles.amenityLabel}>{amenity.label}</Text>
                    <Text style={styles.amenityDescription}>{amenity.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rooms - Horizontal Scroller */}
          <View style={styles.roomsContainer}>
            <Text style={styles.sectionTitle}>Choose Your Room</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.roomsScroll}
            >
              {stayData.rooms.map((room, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.roomCard, index === 0 && styles.firstRoomCard]}
                  activeOpacity={0.8}
                >
                  <ImageBackground
                    source={{ uri: room.image }}
                    style={styles.roomCardBg}
                    imageStyle={styles.roomCardBgImage}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(13,13,13,0.9)']}
                      style={styles.roomCardGradient}
                    />
                    <View style={styles.roomCardContent}>
                      <LinearGradient
                        colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.roomCardFrost}
                      >
                        <Text style={styles.roomName}>{room.name}</Text>
                        <Text style={styles.roomDescription}>{room.description}</Text>
                        <Text style={styles.roomPrice}>{room.price} / night</Text>
                      </LinearGradient>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 3. FAREWELL - Full-width Dusk Image */}
        <View style={styles.farewellSection}>
          <ImageBackground
            source={{ uri: stayData.farewellImage }}
            style={styles.farewellBackground}
            imageStyle={styles.farewellBackgroundImage}
          >
            <LinearGradient
              colors={['rgba(13,13,13,0.6)', 'rgba(13,13,13,0.9)']}
              style={styles.farewellGradient}
            />

            {/* Frosted Quote Capsule */}
            <View style={styles.farewellQuoteCapsule}>
              <LinearGradient
                colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.04)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.farewellQuoteGradient}
              >
                <Text style={styles.farewellQuoteText}>"{stayData.farewellQuote}"</Text>
              </LinearGradient>
            </View>

            {/* Floating Booking Buttons */}
            <View style={styles.bookingButtonsContainer}>
              {bookingPlatforms.map((platform, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.bookingButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.02)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.bookingButtonGradient}
                  >
                    <Text style={styles.bookingButtonText}>{platform}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ImageBackground>
        </View>

        {/* Footer with Icons */}
        <View style={styles.footerSection}>
          <View style={styles.footerIconsGrid}>
            {stayData.footerInfo.map((info, index) => (
              <View key={index} style={styles.footerIconItem}>
                <View style={styles.footerIconCircle}>
                  <Ionicons name={info.icon as any} size={20} color="#D9CBA0" />
                </View>
                <Text style={styles.footerIconLabel}>{info.label}</Text>
                <Text style={styles.footerIconValue}>{info.value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.footerCaption}>{stayData.footerCaption}</Text>
        </View>
      </Animated.ScrollView>
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

  // 1. THE ARRIVAL - Hero Section
  heroSection: {
    height: height * 0.85,
    width: '100%',
  },
  heroBackground: {
    flex: 1,
  },
  heroBackgroundImage: {
    opacity: 0.85,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(13,13,13,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
      },
    }),
  },
  carouselIndicators: {
    position: 'absolute',
    top: 56,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
    zIndex: 15,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  carouselDotActive: {
    backgroundColor: '#D9CBA0',
    width: 20,
  },
  essenceTagsContainer: {
    position: 'absolute',
    top: 120,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    zIndex: 10,
  },
  essenceFloatingTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(217,203,160,0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      },
    }),
  },
  essenceFloatingTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D9CBA0',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroInfoCard: {
    position: 'absolute',
    bottom: 32,
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
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  heroPropertyName: {
    fontSize: 24,
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
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroLocation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  heroRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroDot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  heroAmenity: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  scrollCue: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 4,
  },
  scrollCueText: {
    fontSize: 12,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 2. THE EXPERIENCE - Mid Section
  experienceSection: {
    paddingVertical: 48,
    gap: 48,
  },

  // Overview
  overviewContainer: {
    paddingHorizontal: 24,
  },
  frostCapsule: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 30px rgba(0,0,0,0.6)',
      },
    }),
  },
  frostGradient: {
    padding: 28,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
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
  locationContainer: {
    paddingHorizontal: 24,
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
  locationSplit: {
    gap: 20,
  },
  bronzeMap: {
    height: 180,
    borderRadius: 20,
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
        backdropFilter: 'blur(16px)',
      },
    }),
  },
  mapText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  nearbyChipsScroll: {
    paddingRight: 24,
  },
  nearbyChip: {
    width: 160,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
  },
  nearbyChipBg: {
    flex: 1,
  },
  nearbyChipBgImage: {
    borderRadius: 16,
  },
  nearbyChipGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
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
    paddingHorizontal: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenityCapsule: {
    width: (width - 64) / 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    overflow: 'hidden',
  },
  amenityCapsuleGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  amenityIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(217,203,160,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  amenityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  amenityDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Rooms
  roomsContainer: {
    paddingLeft: 24,
  },
  roomsScroll: {
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
  roomCardBgImage: {
    borderRadius: 24,
  },
  roomCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  roomCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  roomCardFrost: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  roomDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  roomPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // 3. FAREWELL Section
  farewellSection: {
    height: 500,
    width: '100%',
  },
  farewellBackground: {
    flex: 1,
  },
  farewellBackgroundImage: {
    opacity: 0.7,
  },
  farewellGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  farewellQuoteCapsule: {
    position: 'absolute',
    top: 80,
    left: 40,
    right: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    overflow: 'hidden',
  },
  farewellQuoteGradient: {
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(24px)',
      },
    }),
  },
  farewellQuoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#D9CBA0',
    textAlign: 'center',
    lineHeight: 32,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  bookingButtonsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 40,
    right: 40,
    gap: 12,
  },
  bookingButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.3)',
    overflow: 'hidden',
  },
  bookingButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(16px)',
      },
    }),
  },
  bookingButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Footer
  footerSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    backgroundColor: '#0D0D0D',
  },
  footerIconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  footerIconItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(217,203,160,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  footerIconLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  footerIconValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  footerCaption: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(217,203,160,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
