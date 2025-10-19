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
  
  // Generate date chips for multiple stays mode
  const dateChips = [];
  for (let i = parseInt(cityStartDay); i <= parseInt(cityEndDay); i++) {
    dateChips.push(i);
  }
  
  // Mock stay data
  const mockStays = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
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
      id: '4',
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
      {/* Background Image with Blur */}
      <ImageBackground
        source={{ uri: tripData.cityImage }}
        style={styles.backgroundImage}
        blurRadius={12}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
          style={styles.backgroundOverlay}
        />
      </ImageBackground>
      
      <Animated.View style={[styles.contentWrapper, { opacity: contentOpacity }]}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="rgba(241,239,234,0.9)" />
          </TouchableOpacity>
        </View>
        
        {/* Hero Section - EXACT Trip Canvas Style */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>{tripData.title}</Text>
          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMeta}>
              <Text style={{fontWeight: '700'}}>{tripData.dates}</Text>
              {' · '}
              <Text style={{fontWeight: '700'}}>{tripData.travelers} Travelers</Text>
            </Text>
          </View>
          
          {/* City Pill */}
          <View style={styles.cityPillContainer}>
            <LinearGradient
              colors={['rgba(214,193,152,0.25)', 'rgba(214,193,152,0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cityPill}
            >
              <Text style={styles.cityPillText}>{cityName}</Text>
            </LinearGradient>
          </View>
          
          {/* Single Toggle Container */}
          <View style={styles.toggleOuterContainer}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleSide, toggleMode === 'single' && styles.toggleSideActive]}
                onPress={() => setToggleMode('single')}
                activeOpacity={0.7}
              >
                {toggleMode === 'single' && (
                  <LinearGradient
                    colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
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
                    colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
                    style={styles.toggleActiveGradient}
                  />
                )}
                <Text style={[styles.toggleText, toggleMode === 'multiple' && styles.toggleTextActive]}>
                  Multiple Stays
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Date Selector for Multiple Stays */}
          {toggleMode === 'multiple' && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.dateChipsScroll}
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
                        colors={['rgba(214,193,152,0.4)', 'rgba(214,193,152,0.3)']}
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
        
        {/* Filter Arrow (Always Visible) */}
        <TouchableOpacity
          style={styles.filterArrow}
          onPress={() => setFilterPanelOpen(!filterPanelOpen)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={filterPanelOpen ? 'chevron-back' : 'chevron-forward'} 
            size={18} 
            color="rgba(214,193,152,0.9)" 
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
                    colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
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
        
        {/* Stay Grid with Filter Title */}
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Filter Title */}
          <Text style={styles.filterTitleText}>{filterTitleMap[activeFilter]}</Text>
          
          <View style={styles.stayGrid}>
            {filteredStays.map((stay) => {
              const totalPrice = stay.pricePerNight * totalNights;
              
              // Calculate date display based on mode
              let displayDates = '';
              if (toggleMode === 'single') {
                // Show full range
                displayDates = `${cityStartMonth} ${cityStartDay}–${cityEndDay}`;
              } else {
                // Show selected dates range
                if (selectedDates.length > 0) {
                  const firstDate = selectedDates[0];
                  const lastDate = selectedDates[selectedDates.length - 1];
                  displayDates = `${cityStartMonth} ${firstDate}–${lastDate}`;
                } else {
                  displayDates = `${cityStartMonth} ${cityStartDay}`;
                }
              }
              
              // Calculate nights for display
              const displayNights = toggleMode === 'multiple' && selectedDates.length > 0 
                ? selectedDates.length 
                : totalNights;
              
              return (
                <TouchableOpacity
                  key={stay.id}
                  style={styles.stayCard}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/stay-info-compact',
                    params: { nights: displayNights.toString() }
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
                    
                    {/* Frosted Pane with Content */}
                    <View style={styles.stayCardFrosted}>
                      {/* Date Pill - Top Right */}
                      <View style={styles.datePillTopRight}>
                        <Text style={styles.datePillText}>{displayDates}</Text>
                      </View>
                      
                      {/* Save Heart - Top Right on Frosted Pane */}
                      <TouchableOpacity
                        style={styles.saveHeartFrosted}
                        onPress={() => handleSaveStay(stay.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                          size={20}
                          color={savedStays.has(stay.id) ? '#D9BD78' : 'rgba(255,255,255,0.8)'}
                        />
                      </TouchableOpacity>
                      
                      <Text style={styles.stayCardName}>{stay.name}</Text>
                      <Text style={styles.stayCardTagline}>{stay.tagline}</Text>
                      <Text style={styles.stayEstTotal}>Est. Total <Text style={styles.priceHighlight}>€{totalPrice}</Text> · {displayNights} {displayNights === 1 ? 'night' : 'nights'}</Text>
                      <Text style={styles.stayCardLocation}>{stay.location}</Text>
                      
                      {/* Rating & Amenities */}
                      <View style={styles.ratingAmenitiesRow}>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={12} color="#D9BD78" />
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
                      
                      {/* Book Via Row */}
                      <View style={styles.bookViaSection}>
                        <Text style={styles.bookViaLabel}>Book via</Text>
                        <View style={styles.bookingButtonsRow}>
                          {stay.platforms.map(platform => (
                            <TouchableOpacity 
                              key={platform} 
                              style={styles.bookingPlatformButton}
                              activeOpacity={0.7}
                            >
                              <LinearGradient
                                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                                style={styles.bookingPlatformGradient}
                              >
                                <Text style={styles.bookingPlatformText}>{platform}</Text>
                              </LinearGradient>
                            </TouchableOpacity>
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
    backgroundColor: '#0E0E0E',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentWrapper: {
    flex: 1,
  },
  
  // Header
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(241,239,234,0.2)',
  },
  
  // Hero Section - EXACT Trip Canvas Match
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    textAlign: 'center',
    marginBottom: 6,
  },
  heroMetaRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  heroMeta: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityPillContainer: {
    marginBottom: 14,
  },
  cityPill: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Toggle (Single Pill) - Larger
  toggleOuterContainer: {
    width: '100%',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.2)',
  },
  toggleSide: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 17,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleSideActive: {
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.35)',
  },
  toggleActiveGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 17,
  },
  toggleText: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.5)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  toggleTextActive: {
    color: 'rgba(214,193,152,0.95)',
    fontWeight: '600',
  },
  
  // Date Chips for Multiple Stays
  dateChipsScroll: {
    width: '100%',
    marginTop: 12,
  },
  dateChipsContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  dateChip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.2)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    position: 'relative',
    overflow: 'hidden',
  },
  dateChipActive: {
    borderColor: 'rgba(214,193,152,0.5)',
  },
  dateChipGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 19,
  },
  dateChipText: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.6)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dateChipTextActive: {
    color: 'rgba(214,193,152,0.95)',
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
    borderColor: 'rgba(214,193,152,0.25)',
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
    borderColor: 'rgba(214,193,152,0.2)',
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
    borderColor: 'rgba(214,193,152,0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  filterButtonActive: {
    borderColor: 'rgba(214,193,152,0.4)',
  },
  filterButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 11,
    color: 'rgba(214,193,152,0.6)',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterTextActive: {
    color: 'rgba(214,193,152,0.95)',
    fontWeight: '600',
  },
  
  // Stay Grid
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  filterTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.95)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    marginBottom: 16,
  },
  stayGrid: {
    gap: 18,
  },
  
  // Stay Card - World-Class Cinematic Design
  stayCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(217,189,120,0.08)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  stayCardBg: {
    width: '100%',
    aspectRatio: 4/3,
    minHeight: Math.min(width * 0.65, 380),
  },
  stayCardBgStyle: {
    borderRadius: 24,
  },
  stayCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  stayCardFrosted: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20,20,20,0.55)',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(200,180,126,0.08)',
  },
  datePillTopRight: {
    position: 'absolute',
    top: -300,
    right: 12,
    backgroundColor: 'rgba(30,30,30,0.65)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.2)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  datePillText: {
    fontSize: 12,
    color: '#F7F7F7',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  saveHeartFrosted: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,20,20,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.15)',
  },
  stayCardName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F5F5F5',
    marginBottom: 4,
    letterSpacing: -0.2,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stayCardTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#D8C389',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, serif',
    }),
  },
  stayEstTotal: {
    fontSize: 15,
    fontWeight: '500',
    color: '#EAE8E0',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  priceHighlight: {
    color: '#E7C97A',
    fontWeight: '600',
  },
  stayCardLocation: {
    fontSize: 12,
    color: 'rgba(213,210,202,0.7)',
    marginBottom: 10,
    lineHeight: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  ratingAmenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    color: '#F6F4EF',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  amenityDot: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    marginHorizontal: 6,
  },
  amenityText: {
    fontSize: 12,
    color: '#DDD6C5',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  bookViaSection: {
    marginTop: 4,
  },
  bookViaLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  bookingButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bookingPlatformButton: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(217,189,120,0.15)',
  },
  bookingPlatformGradient: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingPlatformText: {
    fontSize: 11,
    color: '#F7F7F7',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
});
