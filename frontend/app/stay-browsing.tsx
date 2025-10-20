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
  
  // State
  const [activeFilter, setActiveFilter] = useState<FilterType>('for-you');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [toggleMode, setToggleMode] = useState<ToggleMode>('entire-city');
  const [selectedDates, setSelectedDates] = useState<number[]>([10, 11, 12]);
  const [savedStays, setSavedStays] = useState<Set<string>>(new Set());
  const [bookedStays, setBookedStays] = useState<Set<string>>(new Set());
  
  // Animations
  const filterPanelAnim = useState(new Animated.Value(0))[0];
  const contentOpacity = useState(new Animated.Value(0))[0];
  
  // Mock trip data
  const tripData = {
    title: 'Italian Renaissance Circuit',
    dates: 'Jun 10–16',
    travelers: 2,
    startDay: 10,
    endDay: 16,
    cityImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  };
  
  // Generate date chips
  const dateChips = [];
  for (let i = tripData.startDay; i <= tripData.endDay; i++) {
    dateChips.push(i);
  }
  
  // Calculate nights from selected dates
  const selectedNights = selectedDates.length > 0 ? selectedDates.length : 0;
  const dateRangeText = selectedDates.length > 0 
    ? `${selectedNights} ${selectedNights === 1 ? 'night' : 'nights'} · Jun ${selectedDates[0]}–${selectedDates[selectedDates.length - 1]}`
    : '';
  
  // Mock stay data
  const mockStays = [
    {
      id: '1',
      name: 'Hotel Brunelleschi',
      address: 'Piazza Santa Elisabetta 3',
      pricePerNight: '€340',
      rating: 4.8,
      reviewCount: 342,
      type: 'boutique',
      tags: ['Historic Tower', 'Cathedral Views', 'Tuscan Charm'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      available: true
    },
    {
      id: '2',
      name: 'Four Seasons Firenze',
      address: 'Borgo Pinti 99',
      pricePerNight: '€620',
      rating: 4.9,
      reviewCount: 528,
      type: 'luxury',
      tags: ['Renaissance Garden', 'Michelin Dining', 'Spa Sanctuary'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      available: true
    },
    {
      id: '3',
      name: 'Portrait Firenze',
      address: 'Lungarno Acciaiuoli 4',
      pricePerNight: '€480',
      rating: 4.9,
      reviewCount: 215,
      type: 'boutique',
      tags: ['Arno Views', 'Salvatore Ferragamo', 'Modern Elegance'],
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      available: true
    },
    {
      id: '4',
      name: 'Hotel Savoy',
      address: 'Piazza della Repubblica 7',
      pricePerNight: '€385',
      rating: 4.7,
      reviewCount: 412,
      type: 'luxury',
      tags: ['Piazza Views', 'Central Location', 'Classic Luxury'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      available: false
    },
    {
      id: '5',
      name: 'Palazzo Vecchietti',
      address: 'Via degli Strozzi 4',
      pricePerNight: '€295',
      rating: 4.6,
      reviewCount: 186,
      type: 'affordable',
      tags: ['Renaissance Palace', 'Suites Only', 'Historic Charm'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      available: true
    },
    {
      id: '6',
      name: 'Il Tornabuoni Hotel',
      address: 'Via de Tornabuoni 3',
      pricePerNight: '€360',
      rating: 4.8,
      reviewCount: 298,
      type: 'boutique',
      tags: ['Shopping Street', 'Rooftop Bar', 'Fashion District'],
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      available: true
    }
  ];
  
  // Filter stays based on active filter
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
    if (toggleMode !== 'select-dates') return;
    
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

  return (
    <View style={styles.container}>
      {/* Background Image with Blur */}
      <ImageBackground
        source={{ uri: tripData.cityImage }}
        style={styles.backgroundImage}
        blurRadius={12}
      >
        <View style={styles.backgroundOverlay} />
      </ImageBackground>
      
      <Animated.View style={[styles.contentWrapper, { opacity: contentOpacity }]}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Pane */}
          <View style={styles.heroPaneWrapper}>
            <BlurView intensity={28} style={styles.heroPane} tint="dark">
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                style={styles.heroPaneGradient}
              >
                {/* Trip Title */}
                <Text style={styles.tripTitle}>{tripData.title}</Text>
                
                {/* Trip Details */}
                <Text style={styles.tripDetails}>
                  {tripData.dates} · {tripData.travelers} Travelers
                </Text>
                
                {/* City Chip */}
                <LinearGradient
                  colors={['rgba(231,201,122,0.3)', 'rgba(220,202,162,0.2)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cityChip}
                >
                  <Text style={styles.cityChipText}>{cityName}</Text>
                </LinearGradient>
                
                {/* Toggle Row */}
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      toggleMode === 'entire-city' && styles.toggleButtonActive
                    ]}
                    onPress={() => setToggleMode('entire-city')}
                    activeOpacity={0.7}
                  >
                    {toggleMode === 'entire-city' && (
                      <LinearGradient
                        colors={['rgba(231,201,122,0.4)', 'rgba(220,202,162,0.3)']}
                        style={styles.toggleButtonGradient}
                      />
                    )}
                    <Text style={[
                      styles.toggleButtonText,
                      toggleMode === 'entire-city' && styles.toggleButtonTextActive
                    ]}>
                      One Stay for Entire City
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      toggleMode === 'select-dates' && styles.toggleButtonActive
                    ]}
                    onPress={() => setToggleMode('select-dates')}
                    activeOpacity={0.7}
                  >
                    {toggleMode === 'select-dates' && (
                      <LinearGradient
                        colors={['rgba(231,201,122,0.4)', 'rgba(220,202,162,0.3)']}
                        style={styles.toggleButtonGradient}
                      />
                    )}
                    <Text style={[
                      styles.toggleButtonText,
                      toggleMode === 'select-dates' && styles.toggleButtonTextActive
                    ]}>
                      Select Dates
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Date Chips (only visible when Select Dates is active) */}
                {toggleMode === 'select-dates' && (
                  <>
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
                            style={[
                              styles.dateChip,
                              isSelected && styles.dateChipActive
                            ]}
                            onPress={() => handleDateToggle(date)}
                            activeOpacity={0.7}
                          >
                            {isSelected && (
                              <LinearGradient
                                colors={['rgba(231,201,122,0.5)', 'rgba(220,202,162,0.4)']}
                                style={styles.dateChipGradient}
                              />
                            )}
                            <Text style={[
                              styles.dateChipText,
                              isSelected && styles.dateChipTextActive
                            ]}>
                              {date}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                    
                    {/* Date Range Caption */}
                    {dateRangeText && (
                      <Text style={styles.dateRangeCaption}>{dateRangeText}</Text>
                    )}
                  </>
                )}
              </LinearGradient>
            </BlurView>
          </View>
          
          {/* Stay Grid */}
          <View style={styles.stayGrid}>
            {filteredStays.map((stay, index) => (
              <TouchableOpacity
                key={stay.id}
                style={styles.stayCard}
                activeOpacity={0.8}
                onPress={() => router.push('/stay-info-compact')}
              >
                <ImageBackground
                  source={{ uri: stay.image }}
                  style={styles.stayCardImage}
                  imageStyle={styles.stayCardImageStyle}
                >
                  {/* Unavailable Overlay */}
                  {!stay.available && (
                    <View style={styles.unavailableOverlay}>
                      <Text style={styles.unavailableText}>
                        Unavailable for selected range
                      </Text>
                    </View>
                  )}
                  
                  {/* Saved Heart Icon */}
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleSaveStay(stay.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                      size={22}
                      color={savedStays.has(stay.id) ? '#E7C97A' : 'rgba(255,255,255,0.8)'}
                    />
                  </TouchableOpacity>
                  
                  {/* Booked Checkmark */}
                  {bookedStays.has(stay.id) && (
                    <View style={styles.bookedBadge}>
                      <Ionicons name="checkmark-circle" size={24} color="#E7C97A" />
                    </View>
                  )}
                  
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
                    style={styles.stayCardGradient}
                  />
                  
                  <View style={styles.stayCardContent}>
                    <Text style={styles.stayCardName}>{stay.name}</Text>
                    <Text style={styles.stayCardAddress}>{stay.address}</Text>
                    
                    <View style={styles.stayCardTags}>
                      {stay.tags.slice(0, 2).map((tag, i) => (
                        <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                    
                    <View style={styles.stayCardFooter}>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={14} color="#E7C97A" />
                        <Text style={styles.ratingText}>{stay.rating}</Text>
                        <Text style={styles.reviewCount}>({stay.reviewCount})</Text>
                      </View>
                      <Text style={styles.priceText}>{stay.pricePerNight}<Text style={styles.perNight}>/night</Text></Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        
        {/* Filter Panel Arrow (Always Visible) */}
        <TouchableOpacity
          style={styles.filterArrow}
          onPress={() => setFilterPanelOpen(!filterPanelOpen)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={filterPanelOpen ? 'chevron-back' : 'chevron-forward'} 
            size={20} 
            color="#E7C97A" 
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
          <BlurView intensity={32} style={styles.filterPanelBlur} tint="dark">
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.5)']}
              style={styles.filterPanelGradient}
            >
              {(['for-you', 'boutique', 'luxury', 'affordable', 'featured'] as FilterType[]).map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    activeFilter === filter && styles.filterButtonActive
                  ]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.7}
                >
                  {activeFilter === filter && (
                    <LinearGradient
                      colors={['rgba(231,201,122,0.5)', 'rgba(220,202,162,0.4)']}
                      style={styles.filterButtonGradient}
                    />
                  )}
                  <Text style={[
                    styles.filterButtonText,
                    activeFilter === filter && styles.filterButtonTextActive
                  ]}>
                    {filter === 'for-you' ? 'For You' : 
                     filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
              
              {/* Search Button */}
              <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
                <Ionicons name="search" size={18} color="rgba(241,239,234,0.7)" />
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>
        </Animated.View>
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="rgba(241,239,234,0.9)" />
        </TouchableOpacity>
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
    backgroundColor: 'rgba(14,14,14,0.7)',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Hero Pane
  heroPaneWrapper: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  heroPane: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(231,201,122,0.25)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroPaneGradient: {
    padding: 24,
    alignItems: 'center',
  },
  tripTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tripDetails: {
    fontSize: 14,
    color: 'rgba(241,239,234,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
    marginBottom: 20,
  },
  cityChip: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(231,201,122,0.3)',
  },
  cityChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F1EFEA',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Toggle Row
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(241,239,234,0.25)',
    overflow: 'hidden',
    position: 'relative',
  },
  toggleButtonActive: {
    borderColor: 'rgba(231,201,122,0.5)',
  },
  toggleButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  toggleButtonText: {
    fontSize: 13,
    color: 'rgba(241,239,234,0.6)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  toggleButtonTextActive: {
    color: '#F1EFEA',
    fontWeight: '600',
  },
  
  // Date Chips
  dateChipsScroll: {
    width: '100%',
    marginTop: 8,
  },
  dateChipsContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  dateChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(241,239,234,0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  dateChipActive: {
    borderColor: 'rgba(231,201,122,0.6)',
  },
  dateChipGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  dateChipText: {
    fontSize: 14,
    color: 'rgba(241,239,234,0.6)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dateChipTextActive: {
    color: '#F1EFEA',
    fontWeight: '600',
  },
  dateRangeCaption: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(241,239,234,0.6)',
    marginTop: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Stay Grid
  stayGrid: {
    paddingHorizontal: 20,
    gap: 24,
  },
  stayCard: {
    height: 380,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.5)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  stayCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  stayCardImageStyle: {
    borderRadius: 16,
  },
  stayCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  stayCardContent: {
    padding: 20,
  },
  stayCardName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F6F4EF',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stayCardAddress: {
    fontSize: 14,
    color: 'rgba(199,194,178,0.9)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(231,201,122,0.2)',
    borderWidth: 0.5,
    borderColor: 'rgba(231,201,122,0.3)',
  },
  tagText: {
    fontSize: 11,
    color: 'rgba(231,201,122,0.9)',
    fontWeight: '500',
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F6F4EF',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  reviewCount: {
    fontSize: 13,
    color: 'rgba(199,194,178,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E7C97A',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  perNight: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(231,201,122,0.7)',
  },
  
  // Save & Booked Buttons
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
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
    top: 16,
    right: 64,
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
  
  // Filter Panel
  filterArrow: {
    position: 'absolute',
    left: 0,
    top: height * 0.4,
    width: 36,
    height: 60,
    backgroundColor: 'rgba(231,201,122,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: 'rgba(231,201,122,0.3)',
    zIndex: 999,
  },
  filterPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.25,
    zIndex: 998,
  },
  filterPanelBlur: {
    flex: 1,
  },
  filterPanelGradient: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 12,
    paddingBottom: 40,
    borderRightWidth: 1,
    borderColor: 'rgba(231,201,122,0.2)',
  },
  filterButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(241,239,234,0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  filterButtonActive: {
    borderColor: 'rgba(231,201,122,0.5)',
  },
  filterButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  filterButtonText: {
    fontSize: 13,
    color: 'rgba(241,239,234,0.6)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterButtonTextActive: {
    color: '#F1EFEA',
    fontWeight: '600',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 'auto',
    borderTopWidth: 1,
    borderColor: 'rgba(241,239,234,0.1)',
    paddingTop: 20,
  },
  searchButtonText: {
    fontSize: 13,
    color: 'rgba(241,239,234,0.7)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Back Button
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(241,239,234,0.2)',
    zIndex: 1000,
  },
});
