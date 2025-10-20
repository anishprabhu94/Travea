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
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

type FilterType = 'for-you' | 'boutique' | 'luxury' | 'affordable' | 'featured';
type ToggleMode = 'entire-city' | 'select-dates';

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
  const [activeFilter, setActiveFilter] = useState<FilterType>('for-you');
  const [toggleMode, setToggleMode] = useState<ToggleMode>('entire-city');
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [savedStays, setSavedStays] = useState<Set<string>>(new Set());
  
  // Animations
  const contentOpacity = useState(new Animated.Value(0))[0];
  
  // Mock trip data
  const tripData = {
    title: 'Italian Renaissance Circuit',
    dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
    travelers: 2,
    cityImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  };
  
  // Generate date chips for select dates mode
  const dateChips = [];
  for (let i = parseInt(cityStartDay); i <= parseInt(cityEndDay); i++) {
    dateChips.push(i);
  }
  
  // Mock stay data
  const mockStays = [
    {
      id: '1',
      name: 'Hotel Brunelleschi',
      subtitle: 'Historic tower meets Renaissance charm',
      address: 'Piazza Santa Elisabetta · 0.3 mi from Duomo',
      pricePerNight: 340,
      rating: 4.8,
      reviewCount: 342,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Official Site', 'Booking.com', 'Expedia'],
      type: 'boutique',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    },
    {
      id: '2',
      name: 'Four Seasons Firenze',
      subtitle: 'Renaissance garden sanctuary',
      address: 'Borgo Pinti 99 · 0.8 mi from center',
      pricePerNight: 620,
      rating: 4.9,
      reviewCount: 528,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Official Site', 'Virtuoso'],
      type: 'luxury',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    },
    {
      id: '3',
      name: 'Portrait Firenze',
      subtitle: 'Modern elegance on the Arno',
      address: 'Lungarno Acciaiuoli 4 · River Views',
      pricePerNight: 480,
      rating: 4.9,
      reviewCount: 215,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Official Site', 'Booking.com'],
      type: 'boutique',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    },
    {
      id: '4',
      name: 'Palazzo Vecchietti',
      subtitle: 'Suites in a Renaissance palace',
      address: 'Via degli Strozzi 4 · Shopping District',
      pricePerNight: 295,
      rating: 4.6,
      reviewCount: 189,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      platforms: ['Booking.com', 'Expedia'],
      type: 'affordable',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    },
  ];
  
  // Filter stays
  const filteredStays = mockStays.filter(stay => {
    if (activeFilter === 'for-you') return true;
    return stay.type === activeFilter;
  });
  
  // Entry animation
  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleDateToggle = (date: number) => {
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date].sort((a, b) => a - b);
      }
    });
  };
  
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
  
  // Calculate nights for display
  const displayNights = toggleMode === 'select-dates' && selectedDates.length > 0 
    ? selectedDates.length 
    : totalNights;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundLayer}>
        <LinearGradient
          colors={['#0B0F14', '#0F1419']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      
      <Animated.ScrollView 
        style={[styles.scrollContainer, { opacity: contentOpacity }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - Modular Container (92% width, centered) */}
        <View style={styles.heroModule}>
          <ImageBackground
            source={{ uri: tripData.cityImage }}
            style={styles.heroImageBackground}
            imageStyle={styles.heroImageStyle}
          >
            {/* Darken text region for readability */}
            <LinearGradient
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
              style={StyleSheet.absoluteFill}
            />
            
            {/* Back Button - Inside Hero */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="rgba(245,244,239,0.9)" />
            </TouchableOpacity>
          </ImageBackground>
          
          {/* Frosted Glass Content Overlay */}
          <View style={styles.heroFrostedContainer}>
            {/* Inner gold glow edge */}
            <LinearGradient
              colors={['rgba(217,189,120,0.25)', 'rgba(217,189,120,0)']}
              style={styles.heroTopGoldEdge}
            />
            
            {/* Trip Title */}
            <Text style={styles.heroTitle}>{tripData.title}</Text>
            
            {/* Dates & Travelers */}
            <Text style={styles.heroSubtext}>
              {tripData.dates} · {tripData.travelers} Travelers
            </Text>
            
            {/* City Pill */}
            <View style={styles.cityPillContainer}>
              <LinearGradient
                colors={['rgba(217,189,120,0.2)', 'rgba(217,189,120,0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cityPill}
              >
                <Text style={styles.cityPillText}>{cityName}</Text>
              </LinearGradient>
            </View>
            
            {/* Stay Selection Toggle Dock */}
            <View style={styles.toggleDock}>
              <TouchableOpacity
                style={[styles.toggleButton, toggleMode === 'entire-city' && styles.toggleButtonActive]}
                onPress={() => setToggleMode('entire-city')}
                activeOpacity={0.7}
              >
                {toggleMode === 'entire-city' && (
                  <LinearGradient
                    colors={['#D9BD78', '#CBAF6B']}
                    style={styles.toggleActiveGradient}
                  />
                )}
                <Text style={[styles.toggleText, toggleMode === 'entire-city' && styles.toggleTextActive]}>
                  One Stay for Entire City
                </Text>
              </TouchableOpacity>
              
              <View style={styles.toggleSpacer} />
              
              <TouchableOpacity
                style={[styles.toggleButton, toggleMode === 'select-dates' && styles.toggleButtonActive]}
                onPress={() => setToggleMode('select-dates')}
                activeOpacity={0.7}
              >
                {toggleMode === 'select-dates' && (
                  <LinearGradient
                    colors={['#D9BD78', '#CBAF6B']}
                    style={styles.toggleActiveGradient}
                  />
                )}
                <Text style={[styles.toggleText, toggleMode === 'select-dates' && styles.toggleTextActive]}>
                  Select Dates
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Date Selection Chips (if Select Dates mode) */}
            {toggleMode === 'select-dates' && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateChipsContainer}
                style={styles.dateChipsScroll}
              >
                {dateChips.map(date => {
                  const isSelected = selectedDates.includes(date);
                  return (
                    <TouchableOpacity
                      key={date}
                      style={[styles.dateChip, isSelected && styles.dateChipActive]}
                      onPress={() => handleDateToggle(date)}
                      activeOpacity={0.7}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={['rgba(217,189,120,0.4)', 'rgba(217,189,120,0.3)']}
                          style={styles.dateChipGradient}
                        />
                      )}
                      <Text style={[styles.dateChipText, isSelected && styles.dateChipTextActive]}>
                        {date}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
        
        {/* Stay Cards Section - Santa Caterina Style */}
        <View style={styles.stayCardsSection}>
          {filteredStays.map((stay) => {
            const totalPrice = stay.pricePerNight * displayNights;
            
            return (
              <TouchableOpacity
                key={stay.id}
                style={styles.stayCard}
                activeOpacity={0.8}
                onPress={() => router.push({
                  pathname: '/stay-info-compact',
                  params: { nights: displayNights.toString(), stayId: stay.id }
                })}
              >
                <ImageBackground
                  source={{ uri: stay.image }}
                  style={styles.cardImageBackground}
                  imageStyle={styles.cardImageStyle}
                >
                  {/* Image vignette */}
                  <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
                    style={StyleSheet.absoluteFill}
                  />
                  
                  {/* Date Pill - Top Right */}
                  <View style={styles.datePill}>
                    <Text style={styles.datePillText}>
                      {cityStartMonth} {toggleMode === 'select-dates' && selectedDates.length > 0 
                        ? selectedDates[0]
                        : cityStartDay}
                    </Text>
                  </View>
                  
                  {/* Save Heart Icon - Top Right */}
                  <TouchableOpacity
                    style={styles.heartIcon}
                    onPress={() => handleSaveStay(stay.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                      size={24}
                      color={savedStays.has(stay.id) ? '#E8C474' : 'rgba(246,244,239,0.6)'}
                    />
                  </TouchableOpacity>
                  
                  {/* Frosted Bottom Pane - Santa Caterina Style */}
                  <View style={styles.cardFrostedPane}>
                    {/* Top gold gradient edge */}
                    <LinearGradient
                      colors={['rgba(217,189,120,0.15)', 'rgba(217,189,120,0)']}
                      style={styles.cardTopGoldEdge}
                    />
                    
                    {/* Hotel Name */}
                    <Text style={styles.hotelName}>{stay.name}</Text>
                    
                    {/* Subtitle */}
                    <Text style={styles.hotelSubtitle}>{stay.subtitle}</Text>
                    
                    {/* Price Line */}
                    <Text style={styles.priceLine}>
                      <Text style={styles.priceLabel}>Est. Total </Text>
                      <Text style={styles.priceAmount}>€{totalPrice}</Text>
                      <Text style={styles.priceLabel}> · {displayNights} {displayNights === 1 ? 'night' : 'nights'}</Text>
                    </Text>
                    
                    {/* Address */}
                    <Text style={styles.hotelAddress}>{stay.address}</Text>
                    
                    {/* Rating Row */}
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#E8C474" />
                      <Text style={styles.ratingText}>{stay.rating}</Text>
                      <Text style={styles.ratingCount}>({stay.reviewCount})</Text>
                      <Text style={styles.amenityDivider}>·</Text>
                      {stay.amenities.slice(0, 4).map((amenity, index) => (
                        <React.Fragment key={amenity}>
                          <Text style={styles.amenityText}>{amenity}</Text>
                          {index < Math.min(stay.amenities.length, 4) - 1 && (
                            <Text style={styles.amenityDivider}>·</Text>
                          )}
                        </React.Fragment>
                      ))}
                    </View>
                    
                    {/* Book Via Section */}
                    <Text style={styles.bookViaLabel}>Book via</Text>
                    <View style={styles.bookingPillsRow}>
                      {stay.platforms.map(platform => {
                        const displayName = platform === 'Official Site' ? 'Official Site' : platform;
                        return (
                          <TouchableOpacity 
                            key={platform} 
                            style={styles.bookingPill}
                            activeOpacity={0.7}
                          >
                            <LinearGradient
                              colors={['rgba(217,189,120,0.25)', 'rgba(217,189,120,0.15)']}
                              style={styles.bookingPillGradient}
                            >
                              <Text style={styles.bookingPillText}>{displayName}</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        );
                      })}
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
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  
  // Hero Module - Modular Container (92% width, centered)
  heroModule: {
    width: '92%',
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(15,15,15,0.6)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(217,189,120,0.08)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 25,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  heroImageBackground: {
    width: '100%',
    height: height * 0.4,
  },
  heroImageStyle: {
    opacity: 0.75,
    borderRadius: 28,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,244,239,0.2)',
  },
  heroFrostedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15,15,15,0.6)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  heroTopGoldEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: '600',
    color: '#F5F4EF',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSubtext: {
    fontSize: 13,
    color: '#E8D9A6',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
    textAlign: 'center',
    marginBottom: 12,
  },
  cityPillContainer: {
    marginBottom: 14,
  },
  cityPill: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(217,189,120,0.3)',
  },
  cityPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Toggle Dock - Smoky Black Glass Background
  toggleDock: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25,25,25,0.55)',
    borderRadius: 24,
    padding: 6,
    width: '100%',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  toggleSpacer: {
    width: 12,
  },
  toggleButtonActive: {
    // Active state handled by gradient
  },
  toggleActiveGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 14,
    color: 'rgba(245,244,239,0.6)',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Date Chips
  dateChipsScroll: {
    marginTop: 14,
  },
  dateChipsContainer: {
    paddingHorizontal: 8,
    gap: 10,
  },
  dateChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(217,189,120,0.25)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  dateChipActive: {
    borderColor: 'rgba(217,189,120,0.6)',
  },
  dateChipGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  dateChipText: {
    fontSize: 13,
    color: 'rgba(217,189,120,0.7)',
    fontWeight: '500',
  },
  dateChipTextActive: {
    color: 'rgba(217,189,120,0.95)',
    fontWeight: '600',
  },
  
  // Stay Cards Section
  stayCardsSection: {
    paddingHorizontal: 16,
    gap: 20,
  },
  
  // Stay Card - Santa Caterina Style
  stayCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(15,15,15,0.4)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardImageBackground: {
    width: '100%',
    aspectRatio: 4 / 3,
    minHeight: 240,
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  datePill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(30,30,30,0.45)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  datePillText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  heartIcon: {
    position: 'absolute',
    top: 52,
    right: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Frosted Bottom Pane - Santa Caterina Style (40% height)
  cardFrostedPane: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(15,15,15,0.55)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cardTopGoldEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F5F5',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    marginBottom: 2,
  },
  hotelSubtitle: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#D7C18A',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
    }),
    marginBottom: 4,
  },
  priceLine: {
    fontSize: 14,
    marginBottom: 3,
  },
  priceLabel: {
    color: '#F6F4EF',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  priceAmount: {
    color: '#E8C474',
    fontWeight: '600',
  },
  hotelAddress: {
    fontSize: 12,
    color: '#D4D2CA',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  ratingText: {
    fontSize: 12,
    color: 'rgba(246,244,239,0.8)',
    fontWeight: '500',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: 'rgba(246,244,239,0.6)',
    marginLeft: 2,
  },
  amenityDivider: {
    fontSize: 12,
    color: 'rgba(246,244,239,0.4)',
    marginHorizontal: 5,
  },
  amenityText: {
    fontSize: 12,
    color: 'rgba(246,244,239,0.7)',
  },
  bookViaLabel: {
    fontSize: 11,
    color: 'rgba(246,244,239,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
    marginBottom: 5,
    marginTop: 2,
  },
  bookingPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bookingPill: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  bookingPillGradient: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(34,34,34,0.4)',
    backgroundColor: 'rgba(34,34,34,0.4)',
  },
  bookingPillText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
