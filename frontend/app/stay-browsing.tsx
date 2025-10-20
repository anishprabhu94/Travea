import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function StayBrowsing() {
  const params = useLocalSearchParams();
  const cityName = params.city as string || 'Florence';
  const cityCode = params.cityCode as string || 'FLR';
  const cityStartMonth = params.startMonth as string || 'Jun';
  const cityStartDay = params.startDay as string || '10';
  const cityEndMonth = params.endMonth as string || 'Jun';
  const cityEndDay = params.endDay as string || '13';
  
  // Calculate nights
  const calculateNights = () => {
    const start = parseInt(cityStartDay);
    const end = parseInt(cityEndDay);
    return end - start;
  };
  
  const totalNights = calculateNights();
  
  // State
  const [savedStays, setSavedStays] = useState<Set<string>>(new Set());
  const contentOpacity = useState(new Animated.Value(0))[0];
  
  // Mock trip data
  const tripData = {
    title: 'Italian Renaissance Circuit',
    dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
    travelers: 2,
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  };
  
  // Mock stay data
  const mockStays = [
    {
      id: '1',
      name: 'Hotel Brunelleschi',
      tagline: 'Historic tower meets Renaissance charm',
      location: 'Piazza Santa Elisabetta · 0.3 mi from Duomo',
      pricePerNight: 340,
      rating: 4.8,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Official Site', 'Booking.com', 'Expedia'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    },
    {
      id: '2',
      name: 'Four Seasons Firenze',
      tagline: 'Renaissance garden sanctuary',
      location: 'Borgo Pinti 99 · 0.8 mi from center',
      pricePerNight: 620,
      rating: 4.9,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Official Site', 'Virtuoso'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    },
    {
      id: '3',
      name: 'Portrait Firenze',
      tagline: 'Modern elegance on the Arno',
      location: 'Lungarno Acciaiuoli 4 · River Views',
      pricePerNight: 480,
      rating: 4.9,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Official Site', 'Booking.com'],
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    },
    {
      id: '4',
      name: 'Palazzo Vecchietti',
      tagline: 'Suites in a Renaissance palace',
      location: 'Via degli Strozzi 4 · Shopping District',
      pricePerNight: 295,
      rating: 4.6,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Booking.com', 'Expedia'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    },
  ];
  
  // Entry animation
  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleSaveStay = (stayId: string) => {
    setSavedStays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stayId)) {
        newSet.delete(stayId);
      } else {
        newSet.add(stayId);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView 
        style={[styles.scrollContainer, { opacity: contentOpacity }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - EXACT FROM TRIP CANVAS */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: tripData.heroImage }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
              style={styles.heroGradient}
            />
            
            {/* Frosted pane container for hero content */}
            <View style={styles.heroFrostedPane}>
              {/* Back Button - Top Left */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="rgba(181,155,115,0.9)" />
              </TouchableOpacity>
              
              <View style={styles.heroTitleContainer}>
                <Text style={styles.heroTitle}>{tripData.title}</Text>
              </View>
              <View style={styles.heroSubtitleRow}>
                <Text style={styles.heroSubtitle}>
                  <Text style={{fontWeight: '700'}}>{tripData.dates}</Text>
                  {' · '}
                  <Text style={{fontWeight: '700'}}>{tripData.travelers} Travelers</Text>
                </Text>
              </View>
              
              {/* City Pill */}
              <View style={styles.cityPillContainer}>
                <LinearGradient
                  colors={['rgba(227,196,123,0.25)', 'rgba(227,196,123,0.15)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cityPill}
                >
                  <Text style={styles.cityPillText}>{cityName}</Text>
                </LinearGradient>
              </View>
            </View>
          </ImageBackground>
        </View>
        
        {/* Stay Cards Section - EXACT FROM BOOK-JOURNEY */}
        <View style={styles.stayCardsSection}>
          {mockStays.map((stay, idx) => {
            const totalPrice = stay.pricePerNight * totalNights;
            
            return (
              <TouchableOpacity 
                key={stay.id}
                style={[styles.stayCard, idx === 0 && styles.firstCard]} 
                activeOpacity={0.8}
                onPress={() => router.push({
                  pathname: '/stay-info-compact',
                  params: { nights: totalNights.toString(), stayId: stay.id }
                })}
              >
                <ImageBackground
                  source={{ uri: stay.image }}
                  style={styles.stayCardBg}
                  imageStyle={styles.stayCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.stayCardGradient}
                  />
                  <View style={styles.stayCardFrosted}>
                    {/* Date Pill - Top Right */}
                    <View style={styles.datePill}>
                      <Text style={styles.datePillText}>{cityStartMonth} {cityStartDay}</Text>
                    </View>
                    
                    {/* Save Heart */}
                    <TouchableOpacity
                      style={styles.saveHeart}
                      onPress={() => handleSaveStay(stay.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                        size={22}
                        color={savedStays.has(stay.id) ? '#CBB88C' : 'rgba(255,255,255,0.7)'}
                      />
                    </TouchableOpacity>

                    <Text style={styles.stayCardName}>{stay.name}</Text>
                    <Text style={styles.stayCardTagline}>{stay.tagline}</Text>
                    <Text style={styles.stayEstTotal}>Est. Total €{totalPrice} · {totalNights} nights</Text>
                    <Text style={styles.stayCardLocation}>{stay.location}</Text>
                    <View style={styles.ratingAmenitiesRow}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color="#CBB88C" />
                        <Text style={styles.ratingText}>{stay.rating}</Text>
                      </View>
                      <Text style={styles.amenityDot}>·</Text>
                      {stay.amenities.map((amenity, index) => (
                        <React.Fragment key={amenity}>
                          <Text style={styles.amenityText}>{amenity}</Text>
                          {index < stay.amenities.length - 1 && <Text style={styles.amenityDot}>·</Text>}
                        </React.Fragment>
                      ))}
                    </View>
                    <View style={styles.bookViaRow}>
                      <Text style={styles.bookViaLabel}>Book via</Text>
                      <View style={styles.logoRow}>
                        {stay.platforms.map(platform => (
                          <Text key={platform} style={styles.logoText}>{platform}</Text>
                        ))}
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // EXACT HERO STYLES FROM TRIP CANVAS
  heroContainer: {
    height: 360,
    marginBottom: 24,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroBackground: {
    flex: 1,
  },
  heroBackgroundImage: {
    opacity: 0.6,
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  heroFrostedPane: {
    position: 'absolute',
    bottom: 30,
    left: '5%',
    right: '5%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 24,
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
  backButton: {
    position: 'absolute',
    top: -280,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.3)',
  },
  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.98)',
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  heroSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityPillContainer: {
    alignItems: 'center',
  },
  cityPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
  },
  cityPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Stay Cards Section
  stayCardsSection: {
    paddingHorizontal: 16,
    gap: 20,
  },
  
  // EXACT STAY CARD STYLES FROM BOOK-JOURNEY
  stayCard: {
    width: '100%',
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  firstCard: {
    marginTop: 0,
  },
  stayCardBg: {
    flex: 1,
  },
  stayCardBgStyle: {
    borderRadius: 24,
  },
  stayCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  stayCardFrosted: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 20,
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
  saveHeart: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stayCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stayCardTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayEstTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D9CBA0',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  datePill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(20,20,20,0.9)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  ratingAmenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  amenityDot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  amenityText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  bookViaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookViaLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  logoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  logoText: {
    fontSize: 11,
    color: '#CBB88C',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
});
