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
    // Simple calculation - in real app would handle month boundaries
    const start = parseInt(cityStartDay);
    const end = parseInt(cityEndDay);
    return end - start;
  };
  
  const totalNights = calculateNights();
  
  // State
  const [activeFilter, setActiveFilter] = useState<FilterType>('for-you');
  const [toggleMode, setToggleMode] = useState<ToggleMode>('single');
  const [savedStays, setSavedStays] = useState<Set<string>>(new Set());
  const [bookedStays, setBookedStays] = useState<Set<string>>(new Set());
  
  // Animations
  const contentOpacity = useState(new Animated.Value(0))[0];
  
  // Mock trip data
  const tripData = {
    title: 'Italian Renaissance Circuit',
    dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
    travelers: 2,
    cityImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  };
  
  // Mock stay data - using original structure
  const mockStays = [
    {
      id: '1',
      name: 'Hotel Brunelleschi',
      address: 'Piazza Santa Elisabetta 3',
      pricePerNight: 340,
      dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
      checkin: 'Check-in 3 PM',
      checkout: 'Check-out 11 AM',
      platform: 'via Booking.com',
      type: 'boutique',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      available: true
    },
    {
      id: '2',
      name: 'Four Seasons Firenze',
      address: 'Borgo Pinti 99',
      pricePerNight: 620,
      dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
      checkin: 'Check-in 3 PM',
      checkout: 'Check-out 11 AM',
      platform: 'via Official Site',
      type: 'luxury',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      available: true
    },
    {
      id: '3',
      name: 'Portrait Firenze',
      address: 'Lungarno Acciaiuoli 4',
      pricePerNight: 480,
      dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
      checkin: 'Check-in 3 PM',
      checkout: 'Check-out 11 AM',
      platform: 'via Virtuoso',
      type: 'boutique',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      available: true
    },
    {
      id: '4',
      name: 'Hotel Savoy',
      address: 'Piazza della Repubblica 7',
      pricePerNight: 385,
      dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
      checkin: 'Check-in 3 PM',
      checkout: 'Check-out 11 AM',
      platform: 'via Booking.com',
      type: 'luxury',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      available: false
    },
    {
      id: '5',
      name: 'Palazzo Vecchietti',
      address: 'Via degli Strozzi 4',
      pricePerNight: 295,
      dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
      checkin: 'Check-in 3 PM',
      checkout: 'Check-out 11 AM',
      platform: 'via Expedia',
      type: 'affordable',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      available: true
    }
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
        
        {/* Hero Section - Matching Trip Canvas Style */}
        <View style={styles.heroContainer}>
          <View style={styles.heroFrostedPane}>
            <Text style={styles.heroTitle}>{tripData.title}</Text>
            
            <View style={styles.heroSubtitleRow}>
              <Text style={styles.heroSubtitle}>
                <Text style={{fontWeight: '700'}}>{tripData.dates}</Text>
                {' · '}
                <Text style={{fontWeight: '700'}}>{tripData.travelers} Travelers</Text>
              </Text>
            </View>
            
            {/* City Chip */}
            <LinearGradient
              colors={['rgba(214,193,152,0.25)', 'rgba(214,193,152,0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cityChip}
            >
              <Text style={styles.cityChipText}>{cityName}</Text>
            </LinearGradient>
            
            {/* Toggle Button (Single Pill with Two Sides) */}
            <View style={styles.toggleContainer}>
              <View style={styles.togglePill}>
                <TouchableOpacity
                  style={[styles.toggleSide, styles.toggleSideLeft, toggleMode === 'single' && styles.toggleSideActive]}
                  onPress={() => setToggleMode('single')}
                  activeOpacity={0.7}
                >
                  {toggleMode === 'single' && (
                    <LinearGradient
                      colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
                      style={styles.toggleSideGradient}
                    />
                  )}
                  <Text style={[styles.toggleText, toggleMode === 'single' && styles.toggleTextActive]}>
                    Single Stay
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.toggleSide, styles.toggleSideRight, toggleMode === 'multiple' && styles.toggleSideActive]}
                  onPress={() => setToggleMode('multiple')}
                  activeOpacity={0.7}
                >
                  {toggleMode === 'multiple' && (
                    <LinearGradient
                      colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
                      style={styles.toggleSideGradient}
                    />
                  )}
                  <Text style={[styles.toggleText, toggleMode === 'multiple' && styles.toggleTextActive]}>
                    Multiple Stays
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        
        {/* Filter Sidebar */}
        <View style={styles.filterSidebar}>
          {(['for-you', 'boutique', 'luxury', 'affordable', 'featured'] as FilterType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, activeFilter === filter && styles.filterButtonActive]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              {activeFilter === filter && (
                <LinearGradient
                  colors={['rgba(214,193,152,0.3)', 'rgba(214,193,152,0.2)']}
                  style={styles.filterButtonGradient}
                />
              )}
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter === 'for-you' ? 'For You' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Stay Grid - Using Original Card Style */}
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.stayGrid}>
            {filteredStays.map((stay) => {
              const totalPrice = stay.pricePerNight * totalNights;
              return (
                <TouchableOpacity
                  key={stay.id}
                  style={styles.stayCard}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/stay-info-compact',
                    params: { nights: totalNights.toString() }
                  })}
                >
                  <ImageBackground
                    source={{ uri: stay.image }}
                    style={styles.stayImageCardBg}
                    imageStyle={styles.stayImageCardBgStyle}
                  >
                    {/* Unavailable Overlay */}
                    {!stay.available && (
                      <View style={styles.unavailableOverlay}>
                        <Text style={styles.unavailableText}>
                          Unavailable for selected range
                        </Text>
                      </View>
                    )}
                    
                    {/* Date Badge */}
                    <View style={styles.cardDateBadgeOnImage}>
                      <Text style={styles.cardDateText}>{stay.dates}</Text>
                    </View>
                    
                    {/* Save Heart */}
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSaveStay(stay.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                        size={22}
                        color={savedStays.has(stay.id) ? '#D6C198' : 'rgba(255,255,255,0.8)'}
                      />
                    </TouchableOpacity>
                    
                    {/* Booked Badge */}
                    {bookedStays.has(stay.id) && (
                      <View style={styles.bookedBadge}>
                        <Ionicons name="checkmark-circle" size={24} color="#D6C198" />
                      </View>
                    )}
                    
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.stayImageCardGradient}
                    />
                    
                    <View style={styles.stayImageCardFrosted}>
                      <Text style={styles.stayCardName}>{stay.name}</Text>
                      <Text style={styles.stayCardAddress}>{stay.address}</Text>
                      <Text style={styles.stayCardTimes}>{stay.checkin} · {stay.checkout}</Text>
                      <View style={styles.stayCardFooter}>
                        <Text style={styles.stayCardPlatform}>{stay.platform}</Text>
                        <Text style={styles.stayCardPrice}>€{totalPrice}<Text style={styles.priceLabel}> total</Text></Text>
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
  
  // Hero Section - Matching Trip Canvas
  heroContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroFrostedPane: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
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
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityChip: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
  },
  cityChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Toggle (Single Pill with Two Sides)
  toggleContainer: {
    alignItems: 'center',
  },
  togglePill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.2)',
  },
  toggleSide: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 17,
    position: 'relative',
    overflow: 'hidden',
  },
  toggleSideLeft: {
    marginRight: 2,
  },
  toggleSideRight: {
    marginLeft: 2,
  },
  toggleSideActive: {
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.4)',
  },
  toggleSideGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 17,
  },
  toggleText: {
    fontSize: 12,
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
  
  // Filter Sidebar
  filterSidebar: {
    position: 'absolute',
    left: 0,
    top: 180,
    width: 90,
    paddingLeft: 12,
    paddingVertical: 20,
    gap: 8,
    zIndex: 10,
  },
  filterButton: {
    paddingVertical: 10,
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
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingLeft: 110, // Offset for filter sidebar
  },
  stayGrid: {
    gap: 20,
  },
  stayCard: {
    marginRight: 20,
  },
  stayImageCardBg: {
    width: width - 150,
    height: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  stayImageCardBgStyle: {
    borderRadius: 16,
  },
  stayImageCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  cardDateBadgeOnImage: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.3)',
  },
  cardDateText: {
    fontSize: 11,
    color: 'rgba(214,193,152,0.9)',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayImageCardFrosted: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  stayCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F6F4EF',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stayCardAddress: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.85)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardTimes: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stayCardPlatform: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D6C198',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(214,193,152,0.7)',
  },
  
  // Save & Booked
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  bookedBadge: {
    position: 'absolute',
    top: 12,
    right: 60,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  unavailableText: {
    fontSize: 15,
    color: '#B9A97D',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
});
