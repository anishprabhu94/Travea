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
import { useStayBooking } from '../contexts/StayBookingContext';

const { width, height } = Dimensions.get('window');

type FilterType = 'for-you' | 'boutique' | 'luxury' | 'affordable' | 'featured';
type ToggleMode = 'single' | 'multiple';

export default function StayBrowsing() {
  const params = useLocalSearchParams();
  const cityName = params.city as string || 'Florence';
  const cityCode = params.cityCode as string || 'FLR';
  const cityStartMonth = params.startMonth as string || 'Jun';
  const cityStartDay = params.startDay as string || '10';
  const cityEndMonth = params.endMonth as string || 'Jun';
  const cityEndDay = params.endDay as string || '13';
  
  const { getBookingStatus } = useStayBooking();
  
  // Calculate nights
  const calculateNights = () => {
    const start = parseInt(cityStartDay);
    const end = parseInt(cityEndDay);
    return end - start;
  };
  
  const totalNights = calculateNights();
  
  // State
  const [activeFilter, setActiveFilter] = useState<FilterType>('for-you');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [toggleMode, setToggleMode] = useState<ToggleMode>('single');
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [savedStays, setSavedStays] = useState<Set<string>>(new Set());
  
  // Animations
  const filterPanelAnim = useState(new Animated.Value(0))[0];
  const contentOpacity = useState(new Animated.Value(0))[0];
  
  // Mock trip data
  const tripData = {
    title: 'Italian Renaissance Circuit',
    dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
    travelers: 2,
    cityImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  };
  
  // Generate date chips
  const dateChips = [];
  for (let i = parseInt(cityStartDay); i <= parseInt(cityEndDay); i++) {
    dateChips.push(i);
  }
  
  // Mock stay data
  const mockStays = [
    {
      id: 'stay-1',
      name: 'Hotel Brunelleschi',
      tagline: 'Historic tower meets Renaissance charm',
      location: 'Piazza Santa Elisabetta · 0.3 mi from Duomo',
      pricePerNight: 340,
      rating: 4.8,
      amenities: ['Historic Tower', 'Cathedral Views', 'Tuscan Dining', 'Wi-Fi'],
      platforms: ['Official Site', 'Booking.com', 'Expedia'],
      type: 'boutique',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    },
    {
      id: 'stay-2',
      name: 'Four Seasons Firenze',
      tagline: 'Renaissance garden sanctuary',
      location: 'Borgo Pinti 99 · 0.8 mi from center',
      pricePerNight: 620,
      rating: 4.9,
      amenities: ['Garden', 'Michelin Star', 'Spa', 'Pool'],
      platforms: ['Official Site', 'Virtuoso'],
      type: 'luxury',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    },
    {
      id: 'stay-3',
      name: 'Portrait Firenze',
      tagline: 'Modern elegance on the Arno',
      location: 'Lungarno Acciaiuoli 4 · River Views',
      pricePerNight: 480,
      rating: 4.9,
      amenities: ['Arno Views', 'Rooftop Bar', 'Ferragamo', 'Concierge'],
      platforms: ['Official Site', 'Booking.com'],
      type: 'boutique',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    },
    {
      id: 'stay-4',
      name: 'Palazzo Vecchietti',
      tagline: 'Suites in a Renaissance palace',
      location: 'Via degli Strozzi 4 · Shopping District',
      pricePerNight: 295,
      rating: 4.6,
      amenities: ['Suites Only', 'Historic Palace', 'Central', 'Breakfast'],
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
  
  // Filter panel animation
  useEffect(() => {
    Animated.timing(filterPanelAnim, {
      toValue: filterPanelOpen ? 1 : 0,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [filterPanelOpen]);
  
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
  
  const filterTitleMap = {
    'for-you': 'For You',
    'boutique': 'Boutique',
    'luxury': 'Luxury',
    'affordable': 'Affordable',
    'featured': 'Featured'
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#0B0F14', '#111417']}
        style={styles.pageBackground}
      />
      
      <Animated.View style={[styles.contentWrapper, { opacity: contentOpacity }]}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section - Contained Module */}
          <View style={styles.heroModule}>
            <ImageBackground
              source={{ uri: tripData.cityImage }}
              style={styles.heroImageContainer}
              imageStyle={styles.heroImage}
              blurRadius={8}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
                style={styles.heroImageOverlay}
              />
            </ImageBackground>
            
            <View style={styles.heroFrostedPane}>
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={20} color="rgba(245,244,239,0.85)" />
              </TouchableOpacity>
              
              {/* Trip Title */}
              <Text style={styles.heroTitle}>{tripData.title}</Text>
              
              {/* Dates & Travelers */}
              <Text style={styles.heroMeta}>
                {tripData.dates} · {tripData.travelers} Travelers
              </Text>
              
              {/* City Pill */}
              <View style={styles.cityPillContainer}>
                <LinearGradient
                  colors={['rgba(217,189,120,0.2)', 'rgba(217,189,120,0.15)']}                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cityPill}
                >
                  <Text style={styles.cityPillText}>{cityName.toUpperCase()}</Text>
                </LinearGradient>
              </View>
              
              {/* Toggle */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleSide, toggleMode === 'single' && styles.toggleSideActive]}
                  onPress={() => setToggleMode('single')}
                  activeOpacity={0.7}
                >
                  {toggleMode === 'single' && (
                    <LinearGradient
                      colors={['rgba(217,189,120,0.3)', 'rgba(203,175,107,0.2)']}
                      style={styles.toggleActiveGradient}
                    />
                  )}
                  <Text style={[styles.toggleText, toggleMode === 'single' && styles.toggleTextActive]}>
                    Single Stay
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.toggleSide, toggleMode === 'multiple' && styles.toggleSideActive]}
                  onPress={() => setToggleMode('multiple')}
                  activeOpacity={0.7}
                >
                  {toggleMode === 'multiple' && (
                    <LinearGradient
                      colors={['rgba(217,189,120,0.3)', 'rgba(203,175,107,0.2)']}
                      style={styles.toggleActiveGradient}
                    />
                  )}
                  <Text style={[styles.toggleText, toggleMode === 'multiple' && styles.toggleTextActive]}>
                    Multiple Stays
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Date Selector - Center Aligned */}
              {toggleMode === 'multiple' && (
                <View style={styles.dateChipsContainer}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.dateChipsContent}
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
                </View>
              )}
            </View>
          </View>
          
          {/* Filter Arrow */}
          <TouchableOpacity
            style={styles.filterArrow}
            onPress={() => setFilterPanelOpen(!filterPanelOpen)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={filterPanelOpen ? 'chevron-back' : 'chevron-forward'} 
              size={18} 
              color="rgba(217,189,120,0.9)" 
            />
          </TouchableOpacity>
          
          {/* Filter Panel */}
          <Animated.View
            style={[
              styles.filterPanel,
              {
                transform: [{
                  translateX: filterPanelAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-width * 0.28, 0]
                  })
                }]
              }
            ]}
          >
            <View style={styles.filterPanelContent}>
              {(['for-you', 'boutique', 'luxury', 'affordable', 'featured'] as FilterType[]).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
                  onPress={() => {
                    setActiveFilter(filter);
                    setFilterPanelOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  {activeFilter === filter && (
                    <LinearGradient
                      colors={['rgba(217,189,120,0.3)', 'rgba(217,189,120,0.2)']}
                      style={styles.filterButtonGradient}
                    />
                  )}
                  <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                    {filterTitleMap[filter]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
          
          {/* Filter Title */}
          <Text style={styles.filterTitleText}>{filterTitleMap[activeFilter]}</Text>
          
          {/* Stay Grid - EXACT book-journey.tsx structure */}
          <View style={styles.stayGrid}>
            {filteredStays.map((stay, idx) => {
              const totalPrice = stay.pricePerNight * totalNights;
              
              // Calculate dates
              let displayDates = '';
              if (toggleMode === 'single') {
                displayDates = `${cityStartMonth} ${cityStartDay}–${cityEndDay}`;
              } else {
                if (selectedDates.length > 0) {
                  const firstDate = selectedDates[0];
                  const lastDate = selectedDates[selectedDates.length - 1];
                  displayDates = `${cityStartMonth} ${firstDate}–${lastDate}`;
                } else {
                  displayDates = `${cityStartMonth} ${cityStartDay}`;
                }
              }
              
              const displayNights = toggleMode === 'multiple' && selectedDates.length > 0 
                ? selectedDates.length 
                : totalNights;
              
              const bookingStatus = getBookingStatus(stay.id);
              
              return (
                <TouchableOpacity
                  key={stay.id}
                  style={[styles.stayCard, idx === 0 && styles.firstCard]}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/stay-info-compact',
                    params: { nights: displayNights.toString(), stayId: stay.id }
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
                      {/* Date Pill */}
                      <View style={styles.datePill}>
                        <Text style={styles.datePillText}>{displayDates}</Text>
                      </View>
                      
                      {/* Save Heart */}
                      <TouchableOpacity
                        style={styles.saveHeart}
                        onPress={() => handleSaveStay(stay.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                          size={18}
                          color={savedStays.has(stay.id) ? '#CBB88C' : 'rgba(255,255,255,0.8)'}
                        />
                      </TouchableOpacity>
                      
                      {/* Booking Status Indicator */}
                      {bookingStatus === 'booked' && (
                        <View style={styles.bookedIndicator}>
                          <Text style={styles.bookedText}>Booked</Text>
                        </View>
                      )}
                      {bookingStatus === 'canceled' && (
                        <View style={styles.canceledIndicator}>
                          <Text style={styles.canceledText}>Canceled</Text>
                        </View>
                      )}
                      
                      <Text style={styles.stayCardName}>{stay.name}</Text>
                      <Text style={styles.stayCardTagline}>{stay.tagline}</Text>
                      <Text style={styles.stayEstTotal}>Est. Total €{totalPrice} · {displayNights} {displayNights === 1 ? 'night' : 'nights'}</Text>
                      <Text style={styles.stayCardLocation}>{stay.location}</Text>
                      
                      <View style={styles.ratingAmenitiesRow}>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={12} color="#CBB88C" />
                          <Text style={styles.ratingText}>{stay.rating}</Text>
                        </View>
                        <Text style={styles.amenityDot}>·</Text>
                        {stay.amenities.slice(0, 3).map((amenity, index) => (
                          <React.Fragment key={amenity}>
                            <Text style={styles.amenityText}>{amenity}</Text>
                            {index < 2 && <Text style={styles.amenityDot}>·</Text>}
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
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Hero Module - Contained
  heroModule: {
    marginHorizontal: 20,
    marginTop: 50,
    marginBottom: 24,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(217,189,120,0.08)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 25,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  heroImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  heroImage: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroFrostedPane: {
    backgroundColor: 'rgba(20,20,20,0.65)',
    padding: 24,
    paddingTop: 180,
    borderRadius: 28,
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.25)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,20,20,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.2)',
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#F5F4EF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  heroMeta: {
    fontSize: 14,
    color: '#E8D9A6',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityPillContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cityPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.3)',
  },
  cityPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Toggle
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(25,25,25,0.55)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.2)',
    marginBottom: 12,
  },
  toggleSide: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 17,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
  },
  toggleSideActive: {
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.4)',
  },
  toggleActiveGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 17,
  },
  toggleText: {
    fontSize: 13,
    color: 'rgba(245,244,239,0.5)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  toggleTextActive: {
    color: 'rgba(245,244,239,0.95)',
    fontWeight: '600',
  },
  
  // Date Chips - Center Aligned
  dateChipsContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  dateChipsContent: {
    gap: 8,
    paddingHorizontal: 4,
  },
  dateChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.2)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    position: 'relative',
    overflow: 'hidden',
  },
  dateChipActive: {
    borderColor: 'rgba(217,189,120,0.5)',
  },
  dateChipGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 19,
  },
  dateChipText: {
    fontSize: 13,
    color: 'rgba(217,189,120,0.6)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dateChipTextActive: {
    color: 'rgba(217,189,120,0.95)',
    fontWeight: '600',
  },
  
  // Filter Arrow
  filterArrow: {
    position: 'absolute',
    left: 0,
    top: height * 0.35,
    width: 32,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderColor: 'rgba(217,189,120,0.25)',
    zIndex: 999,
  },
  
  // Filter Panel
  filterPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRightWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.2)',
    zIndex: 998,
  },
  filterPanelContent: {
    paddingTop: 120,
    paddingHorizontal: 10,
    gap: 10,
  },
  filterButton: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  filterButtonActive: {
    borderColor: 'rgba(217,189,120,0.4)',
  },
  filterButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 11,
    color: 'rgba(217,189,120,0.6)',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterTextActive: {
    color: 'rgba(217,189,120,0.95)',
    fontWeight: '600',
  },
  
  // Filter Title
  filterTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(217,189,120,0.95)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    marginBottom: 16,
    marginHorizontal: 20,
  },
  
  // Stay Grid
  stayGrid: {
    paddingHorizontal: 20,
    gap: 18,
  },
  
  // Stay Card - EXACT book-journey.tsx structure
  stayCard: {
    width: width - 40,
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  firstCard: {
    marginLeft: 0,
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
    color: 'rgba(203,184,140,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  saveHeart: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(20,20,20,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
  },
  bookedIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(217,189,120,0.25)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.4)',
  },
  bookedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D9BD78',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  canceledIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(107,79,76,0.6)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(107,79,76,0.4)',
  },
  canceledText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F4F0EC',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
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
  ratingAmenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    color: '#F6F4EF',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  amenityDot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginHorizontal: 5,
  },
  amenityText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
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
    fontSize: 10,
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
    fontSize: 10,
    color: 'rgba(203,184,140,0.8)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
});