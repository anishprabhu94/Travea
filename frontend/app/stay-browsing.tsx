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
        {/* Hero Section - EXACT Trip Canvas Structure */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={{ uri: tripData.cityImage }}
            style={styles.heroBackground}
            imageStyle={styles.heroBackgroundImage}
          >
            <View style={styles.heroBackgroundOverlay} />
          </ImageBackground>
          
          <View style={styles.heroFrostedPane}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButtonHero}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="rgba(214,193,152,0.9)" />
            </TouchableOpacity>
            
            {/* Trip Title */}
            <Text style={styles.heroTripTitle}>{tripData.title}</Text>
            
            {/* Dates & Travelers */}
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroMeta}>
                {tripData.dates} · {tripData.travelers} Travelers
              </Text>
            </View>
            
            {/* City Pill */}
            <View style={styles.heroCityPillContainer}>
              <LinearGradient
                colors={['rgba(214,193,152,0.25)', 'rgba(214,193,152,0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCityPill}
              >
                <Text style={styles.heroCityPillText}>{cityName}</Text>
              </LinearGradient>
            </View>
            
            {/* Toggle */}
            <View style={styles.heroToggleContainer}>
              <TouchableOpacity
                style={[styles.heroToggleSide, toggleMode === 'single' && styles.heroToggleSideActive]}
                onPress={() => setToggleMode('single')}
                activeOpacity={0.7}
              >
                {toggleMode === 'single' && (
                  <LinearGradient
                    colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
                    style={styles.heroToggleGradient}
                  />
                )}
                <Text style={[styles.heroToggleText, toggleMode === 'single' && styles.heroToggleTextActive]}>
                  Single Stay
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.heroToggleSide, toggleMode === 'multiple' && styles.heroToggleSideActive]}
                onPress={() => setToggleMode('multiple')}
                activeOpacity={0.7}
              >
                {toggleMode === 'multiple' && (
                  <LinearGradient
                    colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
                    style={styles.heroToggleGradient}
                  />
                )}
                <Text style={[styles.heroToggleText, toggleMode === 'multiple' && styles.heroToggleTextActive]}>
                  Multiple Stays
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Date Chips - Center Aligned */}
            {toggleMode === 'multiple' && (
              <View style={styles.heroDateChipsContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.heroDateChipsContent}
                >
                  {dateChips.map(date => {
                    const isSelected = selectedDates.includes(date);
                    return (
                      <TouchableOpacity
                        key={date}
                        style={[styles.heroDateChip, isSelected && styles.heroDateChipActive]}
                        onPress={() => handleDateToggle(date)}
                        activeOpacity={0.7}
                      >
                        {isSelected && (
                          <LinearGradient
                            colors={['rgba(214,193,152,0.4)', 'rgba(214,193,152,0.3)']}
                            style={styles.heroDateChipGradient}
                          />
                        )}
                        <Text style={[styles.heroDateChipText, isSelected && styles.heroDateChipTextActive]}>
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
  
  // Hero Section - EXACT Trip Canvas Structure
  heroContainer: {
    position: 'relative',
    height: height * 0.45,
    marginBottom: 20,
  },
  heroBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroBackgroundImage: {
    borderRadius: 0,
  },
  heroBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroFrostedPane: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(20,20,20,0.75)',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(214,193,152,0.2)',
    alignItems: 'center',
  },
  backButtonHero: {
    position: 'absolute',
    top: -height * 0.35,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(214,193,152,0.3)',
  },
  heroTripTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    textAlign: 'center',
    marginBottom: 8,
  },
  heroMetaRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  heroMeta: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroCityPillContainer: {
    marginBottom: 16,
  },
  heroCityPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.3)',
  },
  heroCityPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Hero Toggle
  heroToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    padding: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
    marginBottom: 16,
  },
  heroToggleSide: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  heroToggleSideActive: {
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.4)',
  },
  heroToggleGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  heroToggleText: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.6)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroToggleTextActive: {
    color: 'rgba(214,193,152,0.95)',
    fontWeight: '600',
  },
  
  // Hero Date Chips
  heroDateChipsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  heroDateChipsContent: {
    paddingHorizontal: 8,
    gap: 10,
  },
  heroDateChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  heroDateChipActive: {
    borderColor: 'rgba(214,193,152,0.6)',
  },
  heroDateChipGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  heroDateChipText: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.7)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  heroDateChipTextActive: {
    color: 'rgba(214,193,152,0.95)',
    fontWeight: '600',
  },
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
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
