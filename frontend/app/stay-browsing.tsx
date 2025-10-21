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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStayBooking } from '../contexts/StayBookingContext';

const { width, height } = Dimensions.get('window');

export default function StayBrowsing() {
  const params = useLocalSearchParams();
  const cityName = params.city as string || 'Florence';
  const cityCode = params.cityCode as string || 'FLR';
  const cityStartMonth = params.startMonth as string || 'Jun';
  const cityStartDay = params.startDay as string || '10';
  const cityEndMonth = params.endMonth as string || 'Jun';
  const cityEndDay = params.endDay as string || '13';
  
  // Use StayBookingContext
  const { getBookingStatus } = useStayBooking();
  
  // State
  const [savedStays, setSavedStays] = useState<Set<string>>(new Set());
  const [stayMode, setStayMode] = useState<'single' | 'multi'>('single');
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<{start: number | null, end: number | null}>({start: null, end: null});
  const [filterClusterOpen, setFilterClusterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'boutique' | 'luxury' | 'affordable' | 'featured' | 'saved'>('all');
  const [tripTitle, setTripTitle] = useState('');
  const contentOpacity = useState(new Animated.Value(0))[0];
  const filterClusterAnim = useState(new Animated.Value(0))[0];
  const dockAnim = useState(new Animated.Value(0))[0];
  
  // Calculate nights based on mode
  const calculateNights = () => {
    if (stayMode === 'multi' && selectedDates.length > 0) {
      return selectedDates.length;
    }
    const start = parseInt(cityStartDay);
    const end = parseInt(cityEndDay);
    return end - start;
  };
  
  const totalNights = calculateNights();
  const cityTotalDays = parseInt(cityEndDay) - parseInt(cityStartDay) + 1;
  const maxSelectableDays = cityTotalDays - 1; // Can select up to total - 1
  
  // Generate date range for city
  const generateDateRange = () => {
    const dates = [];
    const start = parseInt(cityStartDay);
    const end = parseInt(cityEndDay);
    for (let i = start; i <= end; i++) {
      dates.push(i);
    }
    return dates;
  };
  
  const cityDates = generateDateRange();
  
  // Mock trip data
  const tripData = {
    title: tripTitle || 'Lemon Coast Trail',
    dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
    travelers: 2,
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  };
  
  // Handle date selection for Multi-Stay
  const handleDateToggle = (date: number) => {
    if (stayMode !== 'multi') return;
    
    setSelectedDates(prev => {
      if (prev.includes(date)) {
        // Deselect
        return prev.filter(d => d !== date);
      } else {
        // Check if we can select more
        if (prev.length >= maxSelectableDays) {
          // Already at max, don't add
          return prev;
        }
        // Add and sort
        return [...prev, date].sort((a, b) => a - b);
      }
    });
  };
  
  // Check if date is in selected range
  const isDateInRange = (date: number) => {
    if (!selectedDateRange.start) return false;
    if (!selectedDateRange.end) return date === selectedDateRange.start;
    return date >= selectedDateRange.start && date <= selectedDateRange.end;
  };
  
  // Check if date is booked (placeholder logic)
  const isDateBooked = (date: number) => {
    // In real implementation, check against bookedStays data
    return false;
  };
  
  // Handle date selection for range
  const handleDateSelection = (date: number) => {
    if (stayMode !== 'multi') return;
    
    setSelectedDateRange(prev => {
      if (!prev.start) {
        // First selection - set start
        return { start: date, end: null };
      } else if (!prev.end) {
        // Second selection - set end (ensure start <= end)
        if (date < prev.start) {
          return { start: date, end: prev.start };
        } else {
          return { start: prev.start, end: date };
        }
      } else {
        // Range already selected - start new selection
        return { start: date, end: null };
      }
    });
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
      experiences: ['Historic Tower', 'Cathedral Views'],
      platforms: ['Official Site', 'Booking.com', 'Expedia'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      category: 'boutique',
    },
    {
      id: '2',
      name: 'Four Seasons Firenze',
      tagline: 'Renaissance garden sanctuary',
      location: 'Borgo Pinti 99 · 0.8 mi from center',
      pricePerNight: 620,
      rating: 4.9,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      experiences: ['Garden Oasis', 'Spa Retreat'],
      platforms: ['Official Site', 'Virtuoso'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      category: 'luxury',
    },
    {
      id: '3',
      name: 'Portrait Firenze',
      tagline: 'Modern elegance on the Arno',
      location: 'Lungarno Acciaiuoli 4 · River Views',
      pricePerNight: 480,
      rating: 4.9,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      experiences: ['River Views', 'Modern Design'],
      platforms: ['Official Site', 'Booking.com'],
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      category: 'luxury',
    },
    {
      id: '4',
      name: 'Palazzo Vecchietti',
      tagline: 'Suites in a Renaissance palace',
      location: 'Via degli Strozzi 4 · Shopping District',
      pricePerNight: 295,
      rating: 4.6,
      amenities: ['Pool', 'Breakfast', 'Spa', 'Wi-Fi'],
      experiences: ['Palace Suites'],
      platforms: ['Booking.com', 'Expedia'],
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      category: 'affordable',
    },
  ];
  
  // Entry animation and load trip title
  useEffect(() => {
    // Load trip title from AsyncStorage
    const loadTripTitle = async () => {
      try {
        const tripsData = await AsyncStorage.getItem('trips');
        if (tripsData) {
          const trips = JSON.parse(tripsData);
          if (trips && trips.length > 0) {
            // Get the first active trip
            setTripTitle(trips[0].title);
          }
        }
      } catch (error) {
        console.log('Error loading trip title:', error);
      }
    };
    
    loadTripTitle();
    
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(dockAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  // Toggle filter cluster
  const toggleFilterCluster = () => {
    if (filterClusterOpen) {
      // Close animation
      Animated.timing(filterClusterAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setFilterClusterOpen(false));
    } else {
      // Open animation
      setFilterClusterOpen(true);
      Animated.timing(filterClusterAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
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
  
  // Format price with comma
  const formatPrice = (price: number) => {
    return price >= 1000 ? price.toLocaleString('en-US') : price.toString();
  };
  
  // Filter stays based on active filter
  const getFilteredStays = () => {
    if (activeFilter === 'saved') {
      // Show only saved stays
      return mockStays.filter(stay => savedStays.has(stay.id));
    } else if (activeFilter === 'all') {
      return mockStays;
    } else {
      // Filter by category
      return mockStays.filter(stay => stay.category === activeFilter);
    }
  };
  
  // Get saved stays grouped by category
  const getSavedStaysByCategory = () => {
    const allSaved = mockStays.filter(stay => savedStays.has(stay.id));
    const grouped: { [key: string]: typeof mockStays } = {};
    
    allSaved.forEach(stay => {
      const category = stay.category;
      // Only include if it matches current filter or we're on "all"
      if (activeFilter === 'all' || stay.category === activeFilter) {
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(stay);
      }
    });
    
    return grouped;
  };
  
  // Calculate display dates for cards
  const getDisplayDates = () => {
    if (stayMode === 'single') {
      // Show full city dates
      return {
        startMonth: cityStartMonth,
        startDay: cityStartDay,
        endMonth: cityEndMonth,
        endDay: cityEndDay
      };
    } else {
      // Multi-stay: show selected dates
      if (selectedDates.length >= 2) {
        const sortedDates = [...selectedDates].sort((a, b) => a - b);
        const firstDate = sortedDates[0];
        const lastDate = sortedDates[sortedDates.length - 1];
        
        // Simple month calculation (assuming same month for now)
        return {
          startMonth: cityStartMonth,
          startDay: firstDate.toString(),
          endMonth: cityStartMonth,
          endDay: lastDate.toString()
        };
      }
      // Default to city dates if no selection
      return {
        startMonth: cityStartMonth,
        startDay: cityStartDay,
        endMonth: cityEndMonth,
        endDay: cityEndDay
      };
    }
  };
  
  const filteredStays = getFilteredStays();
  const savedStaysByCategory = getSavedStaysByCategory();
  const displayDates = getDisplayDates();

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
            
            {/* Back Button - Top Left (Soft Bronze) */}
            <TouchableOpacity
              style={styles.backButtonTopLeft}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#D4BE84" />
            </TouchableOpacity>
            
            {/* Frosted pane container for hero content */}
            <View style={styles.heroFrostedPane}>
              <View style={styles.heroTitleContainer}>
                <Text style={styles.heroTitle}>{tripData.title}</Text>
              </View>
              <View style={styles.heroSubtitleRow}>
                <Ionicons name="calendar-outline" size={14} color="#FFFFFF" style={{marginRight: 6}} />
                <Text style={[styles.heroSubtext, {color: '#FFFFFF'}]}>
                  <Text style={{fontWeight: '700'}}>{cityStartMonth.slice(0, 3)} {cityStartDay}–{cityEndMonth.slice(0, 3)} {cityEndDay}</Text>
                </Text>
                <Ionicons name="people-outline" size={14} color="#FFFFFF" style={{marginLeft: 12, marginRight: 6}} />
                <Text style={[styles.heroSubtext, {color: '#FFFFFF'}]}>
                  <Text style={{fontWeight: '700'}}>{tripData.travelers}</Text>
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
              
              {/* Stay Mode Toggle Switch */}
              <View style={styles.toggleSwitchContainer}>
                <TouchableOpacity
                  style={[styles.toggleSwitchOption, stayMode === 'single' && styles.toggleSwitchOptionActive]}
                  onPress={() => setStayMode('single')}
                  activeOpacity={0.7}
                >
                  {stayMode === 'single' && (
                    <LinearGradient
                      colors={['#C6B27E', '#B8A473']}
                      style={styles.toggleSwitchGradient}
                    />
                  )}
                  <Text style={[styles.toggleSwitchText, stayMode === 'single' && styles.toggleSwitchTextActive]}>
                    Single Stay
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.toggleSwitchOption, stayMode === 'multi' && styles.toggleSwitchOptionActive]}
                  onPress={() => setStayMode('multi')}
                  activeOpacity={0.7}
                >
                  {stayMode === 'multi' && (
                    <LinearGradient
                      colors={['#C6B27E', '#B8A473']}
                      style={styles.toggleSwitchGradient}
                    />
                  )}
                  <Text style={[styles.toggleSwitchText, stayMode === 'multi' && styles.toggleSwitchTextActive]}>
                    Multi-Stay
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Day Circles - Show when Multi-Stay selected (Horizontal Scroll) */}
              {stayMode === 'multi' && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.dayCirclesScrollContent}
                  style={styles.dayCirclesScroll}
                >
                  {cityDates.map(date => {
                    const isSelected = selectedDates.includes(date);
                    return (
                      <TouchableOpacity
                        key={date}
                        style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
                        onPress={() => handleDateToggle(date)}
                        activeOpacity={0.7}
                        disabled={selectedDates.length >= maxSelectableDays && !isSelected}
                      >
                        {isSelected && (
                          <LinearGradient
                            colors={['#C6B27E', '#B8A473']}
                            style={styles.dayCircleGradient}
                          />
                        )}
                        <Text style={[styles.dayCircleText, isSelected && styles.dayCircleTextSelected]}>
                          {date}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </ImageBackground>
        </View>
        
        {/* Floating Filter Cluster Button - Top Right */}
        <View style={styles.filterClusterContainer}>
          {/* Main Filter Button */}
          <TouchableOpacity
            style={styles.filterMainButton}
            onPress={toggleFilterCluster}
            activeOpacity={0.8}
          >
            <View style={styles.filterMainButtonView}>
              <Text style={styles.filterMainButtonText}>✦ Filters</Text>
            </View>
          </TouchableOpacity>
          
          {/* Filter Pills Cluster */}
          {filterClusterOpen && (
            <Animated.View 
              style={[
                styles.filterPillsCluster,
                {
                  opacity: filterClusterAnim,
                  transform: [{
                    scale: filterClusterAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1]
                    })
                  }]
                }
              ]}
            >
                {(['all', 'boutique', 'luxury', 'affordable', 'featured', 'saved'] as const).map((filter, index) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterPill,
                      activeFilter === filter && styles.filterPillActive,
                    ]}
                    onPress={() => {
                      setActiveFilter(filter);
                      toggleFilterCluster();
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.filterPillView}>
                      {activeFilter === filter && (
                        <View style={styles.filterPillActiveFill} />
                      )}
                      <Text style={[
                        styles.filterPillText,
                        activeFilter === filter && styles.filterPillTextActive
                      ]}>
                        {filter === 'all' ? 'For You' : filter === 'saved' ? 'Saved' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
        </View>
        
        {/* Filter Title Above Cards */}
        <View style={styles.filterTitleContainer}>
          <Text style={styles.filterTitleText}>
            {activeFilter === 'all' ? 'For You' : activeFilter === 'saved' ? 'Saved' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
          </Text>
        </View>
        
        {/* Stay Cards Section */}
        <View style={styles.stayCardsSection}>
          {activeFilter === 'saved' ? (
            // Saved filter: Show ONLY carousels by category
            Object.entries(savedStaysByCategory).map(([category, stays]) => (
              <View key={category} style={styles.savedCategorySection}>
                <Text style={styles.savedCategoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.savedCarouselContent}
                  style={styles.savedCarousel}
                >
                {stays.map((stay) => {
                  const totalPrice = stay.pricePerNight * totalNights;
                  const bookingStatus = getBookingStatus(stay.id);
                  
                  return (
                    <TouchableOpacity 
                      key={stay.id}
                      style={styles.stayCardHorizontal} 
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
                        
                        {bookingStatus === 'booked' && (
                          <View style={styles.bookedLabel}>
                            <LinearGradient
                              colors={['rgba(212,190,132,0.9)', 'rgba(180,155,100,0.75)']}
                              style={styles.bookedLabelGradient}
                            >
                              <Text style={styles.bookedLabelText}>BOOKED</Text>
                            </LinearGradient>
                          </View>
                        )}
                        
                        {bookingStatus === 'canceled' && (
                          <View style={styles.canceledLabel}>
                            <LinearGradient
                              colors={['rgba(140,80,80,0.75)', 'rgba(100,50,50,0.55)']}
                              style={styles.canceledLabelGradient}
                            >
                              <Text style={styles.canceledLabelText}>CANCELED</Text>
                            </LinearGradient>
                          </View>
                        )}
                        
                        <TouchableOpacity
                          style={styles.saveHeartFrostedCircle}
                          onPressIn={() => handleSaveStay(stay.id)}
                          activeOpacity={0.7}
                        >
                          <BlurView intensity={20} tint="light" style={styles.saveHeartBlur}>
                            <Ionicons
                              name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                              size={20}
                              color={savedStays.has(stay.id) ? '#CBB88C' : 'rgba(255,255,255,0.7)'}
                            />
                          </BlurView>
                        </TouchableOpacity>
                        
                        {/* Frosted pane with all content */}
                        <View style={styles.stayCardFrosted}>
                          {Platform.OS === 'web' ? (
                            <View style={styles.frostedContent}>
                              <Text style={styles.stayCardName}>{stay.name}</Text>
                              <Text style={styles.stayCardTagline}>{stay.tagline}</Text>
                              <View style={styles.decisionRow}>
                                <Text style={styles.priceText}>€{formatPrice(totalPrice)}</Text>
                                <Text style={styles.decisionDot}> · </Text>
                                <Text style={styles.nightsRatingText}>{totalNights} nights</Text>
                                <Text style={styles.decisionDot}> · </Text>
                                <Ionicons name="star" size={12} color="#FFFFFF" style={{marginRight: 3}} />
                                <Text style={styles.nightsRatingText}>{stay.rating}</Text>
                              </View>
                              <View style={styles.ivorySeparator} />
                              <View style={styles.cardDatePill}>
                                <Text style={styles.cardDatePillText}>{displayDates.startMonth} {displayDates.startDay}</Text>
                              </View>
                            </View>
                          ) : (
                            <BlurView intensity={30} tint="light" style={styles.blurViewContent}>
                              <Text style={styles.stayCardName}>{stay.name}</Text>
                              <Text style={styles.stayCardTagline}>{stay.tagline}</Text>
                              <View style={styles.decisionRow}>
                                <Text style={styles.priceText}>€{formatPrice(totalPrice)}</Text>
                                <Text style={styles.decisionDot}> · </Text>
                                <Text style={styles.nightsRatingText}>{totalNights} nights</Text>
                                <Text style={styles.decisionDot}> · </Text>
                                <Ionicons name="star" size={12} color="#FFFFFF" style={{marginRight: 3}} />
                                <Text style={styles.nightsRatingText}>{stay.rating}</Text>
                              </View>
                              <View style={styles.ivorySeparator} />
                              <View style={styles.cardDatePill}>
                                <Text style={styles.cardDatePillText}>{displayDates.startMonth} {displayDates.startDay}</Text>
                              </View>
                            </BlurView>
                          )}
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ))
          ) : (
            // Other filters: Show regular vertical cards
            filteredStays.map((stay, idx) => {
            const totalPrice = stay.pricePerNight * totalNights;
            const bookingStatus = getBookingStatus(stay.id);
            
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
                  
                  {/* Booking Status Label - Top Left of Image (Enhanced Visibility) */}
                  {bookingStatus === 'booked' && (
                    <View style={styles.bookedLabel}>
                      <LinearGradient
                        colors={['rgba(212,190,132,0.9)', 'rgba(180,155,100,0.75)']}
                        style={styles.bookedLabelGradient}
                      >
                        <Text style={styles.bookedLabelText}>BOOKED</Text>
                      </LinearGradient>
                    </View>
                  )}
                  
                  {bookingStatus === 'canceled' && (
                    <View style={styles.canceledLabel}>
                      <LinearGradient
                        colors={['rgba(140,80,80,0.75)', 'rgba(100,50,50,0.55)']}
                        style={styles.canceledLabelGradient}
                      >
                        <Text style={styles.canceledLabelText}>CANCELED</Text>
                      </LinearGradient>
                    </View>
                  )}
                  
                  {/* Save Heart - Top Right on Frosted Circle */}
                  <TouchableOpacity
                    style={styles.saveHeartFrostedCircle}
                    onPressIn={() => handleSaveStay(stay.id)}
                    activeOpacity={0.7}
                  >
                    <BlurView intensity={20} tint="light" style={styles.saveHeartBlur}>
                      <Ionicons
                        name={savedStays.has(stay.id) ? 'heart' : 'heart-outline'}
                        size={20}
                        color={savedStays.has(stay.id) ? '#CBB88C' : 'rgba(255,255,255,0.7)'}
                      />
                    </BlurView>
                  </TouchableOpacity>
                  
                  <View style={styles.stayCardFrosted}>
                    {Platform.OS === 'web' ? (
                      <View style={styles.frostedContent}>
                        {/* Hero Layer - Title & Tagline */}
                        <Text style={styles.stayCardName}>{stay.name}</Text>
                        <Text style={styles.stayCardTagline}>{stay.tagline}</Text>
                        
                        {/* Decision Layer - Combined Price, Nights, Rating with Star */}
                        <View style={styles.decisionRow}>
                          <Text style={styles.priceText}>€{formatPrice(totalPrice)}</Text>
                          <Text style={styles.decisionDot}> · </Text>
                          <Text style={styles.nightsRatingText}>{totalNights} nights</Text>
                          <Text style={styles.decisionDot}> · </Text>
                          <Ionicons name="star" size={12} color="#FFFFFF" style={{marginRight: 3}} />
                          <Text style={styles.nightsRatingText}>{stay.rating}</Text>
                        </View>
                        
                        {/* Ivory Separator */}
                        <View style={styles.ivorySeparator} />
                        
                        {/* Date Pill - Replacing View Details */}
                        <View style={styles.cardDatePill}>
                          <Text style={styles.cardDatePillText}>{displayDates.startMonth} {displayDates.startDay}</Text>
                        </View>
                      </View>
                    ) : (
                      <BlurView intensity={30} tint="light" style={styles.blurViewContent}>
                        {/* Hero Layer - Title & Tagline */}
                        <Text style={styles.stayCardName}>{stay.name}</Text>
                        <Text style={styles.stayCardTagline}>{stay.tagline}</Text>
                        
                        {/* Decision Layer - Combined Price, Nights, Rating with Star */}
                        <View style={styles.decisionRow}>
                          <Text style={styles.priceText}>€{formatPrice(totalPrice)}</Text>
                          <Text style={styles.decisionDot}> · </Text>
                          <Text style={styles.nightsRatingText}>{totalNights} nights</Text>
                          <Text style={styles.decisionDot}> · </Text>
                          <Ionicons name="star" size={12} color="#FFFFFF" style={{marginRight: 3}} />
                          <Text style={styles.nightsRatingText}>{stay.rating}</Text>
                        </View>
                        
                        {/* Ivory Separator */}
                        <View style={styles.ivorySeparator} />
                        
                        {/* Date Pill - Replacing View Details */}
                        <View style={styles.cardDatePill}>
                          <Text style={styles.cardDatePillText}>{displayDates.startMonth} {displayDates.startDay}</Text>
                        </View>
                      </BlurView>
                    )}
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })
          )
        }
        </View>
      </Animated.ScrollView>
      
      {/* Bottom Dock - Exact from Landing Page */}
      <Animated.View 
        style={[
          styles.bottomDock,
          {
            opacity: dockAnim,
            transform: [{
              translateY: dockAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })
            }]
          }
        ]}
      >
        <BlurView intensity={20} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/landing')}
            >
              <Ionicons name="home" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/bookings')}
            >
              <Ionicons name="calendar" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/trips')}
            >
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/concierge')}
            >
              <Ionicons name="chatbubble-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>
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
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
  backButtonTopLeft: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 10,
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
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
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
  
  // Filter Title Above Cards
  filterTitleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stickyFilterTitle: {
    position: 'absolute',
    top: 420,
    left: 16,
    zIndex: 50,
    backgroundColor: 'transparent',
  },
  filterTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  
  // Stay Cards Section
  stayCardsSection: {
    paddingHorizontal: 16,
    gap: 20,
    alignItems: 'center',
  },
  
  // EXACT STAY CARD STYLES FROM BOOK-JOURNEY
  stayCard: {
    width: '92%',
    height: 280,
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
    minHeight: 130,
    backgroundColor: Platform.OS === 'web' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0)',
    borderRadius: 20,
    borderWidth: Platform.OS === 'web' ? 0.5 : 0,
    borderColor: Platform.OS === 'web' ? 'rgba(181,155,115,0.15)' : 'transparent',
    padding: Platform.OS === 'web' ? 16 : 0,
    paddingTop: Platform.OS === 'web' ? 14 : 0,
    paddingBottom: Platform.OS === 'web' ? 16 : 0,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px) saturate(130%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.05)',
      },
      default: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
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
    fontWeight: '700',
    color: '#F6F1E7',
    marginBottom: 6,
    lineHeight: 23,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'sans-serif',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardTagline: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#C7BFA6',
    marginBottom: 12,
    lineHeight: 18,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
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
  bookViaDivider: {
    height: 1,
    backgroundColor: 'rgba(246,244,239,0.15)',
    marginVertical: 10,
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
  frostedBookingPill: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
  },
  frostedPillGradient: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  frostedPillText: {
    fontSize: 11,
    color: 'rgba(246,244,239,0.9)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
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
  
  // Toggle Switch (Single Stay / Multi-Stay)
  toggleSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(34,34,34,0.5)',
    borderRadius: 24,
    padding: 4,
    width: '100%',
    marginTop: 14,
  },
  toggleSwitchOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  toggleSwitchOptionActive: {
    // Gradient overlay
  },
  toggleSwitchGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  toggleSwitchText: {
    fontSize: 14,
    color: 'rgba(245,244,239,0.6)',
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  toggleSwitchTextActive: {
    color: '#FFFFFF',
  },
  
  // Day Circles - In Frosted Pane
  dayCirclesScroll: {
    marginTop: 12,
  },
  dayCirclesScrollContent: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 2,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(207,201,184,0.3)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  dayCircleSelected: {
    borderColor: 'rgba(198,178,126,0.6)',
  },
  dayCircleGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  dayCircleText: {
    fontSize: 15,
    color: 'rgba(207,201,184,0.7)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dayCircleTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Filter Title Above Cards
  filterTitleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
    alignItems: 'flex-start',
  },
  filterTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F6F1E7',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  
  // Filter Arrow - Left Side (Scroll Locked)
  filterArrowContainer: {
    position: 'absolute',
    left: 0,
    top: 384, // Between hero (360px) and filter title
    zIndex: 100,
  },
  filterArrow: {
    width: 32,
    height: 48,
    backgroundColor: 'rgba(15,15,15,0.8)',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(212,190,132,0.3)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(212,190,132,0.2)',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '2px 0 8px rgba(212,190,132,0.2)',
      },
    }),
  },
  
  // Filter Pane - Inline Below Hero
  filterPaneInline: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      },
    }),
  },
  filterPaneGlass: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,240,210,0.25)',
    borderRadius: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
      },
    }),
  },
  filterPaneTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F6F1E7',
    marginBottom: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'sans-serif',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterOptions: {
    gap: 14,
  },
  filterOptionPill: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(207,201,184,0.3)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  filterOptionPillActive: {
    borderColor: 'rgba(212,190,132,0.5)',
  },
  filterOptionGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  filterOptionText: {
    fontSize: 15,
    color: '#CFC9B8',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterOptionTextActive: {
    color: '#F5F4EF',
    fontWeight: '600',
  },
  filterBlurBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 90,
  },
  
  // Cinematic Filter Pane - New Design
  cinematicBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 999,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(36px)',
      },
    }),
  },
  filterPaneFloating: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    right: '15%',
    maxHeight: '55%',
    borderRadius: 18,
    overflow: 'hidden',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.45)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
      web: {
        boxShadow: '0px 8px 24px rgba(0,0,0,0.45)',
      },
    }),
  },
  filterPaneGlassNew: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    minHeight: 280,
  },
  filterPaneTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  filterCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  filterPaneTitleNew: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F6F1E7',
    marginBottom: 12,
    textAlign: 'left',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterGoldDivider: {
    height: 1,
    backgroundColor: 'rgba(212,190,132,0.3)',
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(212,190,132,0.2)',
      },
    }),
  },
  filterOptionsNew: {
    gap: 12,
  },
  filterOptionPillNew: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  filterOptionPillActiveNew: {
    borderColor: 'rgba(212,190,132,0.3)',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 8px rgba(212,190,132,0.25)',
      },
    }),
  },
  filterOptionGradientNew: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  filterOptionTextNew: {
    fontSize: 15,
    color: 'rgba(246,244,239,0.7)',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterOptionTextActiveNew: {
    color: '#F6F1E7',
    fontWeight: '600',
  },
  filterResetButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'flex-end',
  },
  filterResetText: {
    fontSize: 14,
    color: 'rgba(212,190,132,0.9)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Booking Status Labels - Enhanced with Depth
  bookedLabel: {
    position: 'absolute',
    top: 18,
    left: 12,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,190,132,0.5)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(212,190,132,0.3)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(212,190,132,0.3), inset 0 0 4px rgba(212,190,132,0.2)',
      },
    }),
  },
  bookedLabelGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookedLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFBEA',
    letterSpacing: 0.36,
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  canceledLabel: {
    position: 'absolute',
    top: 18,
    left: 12,
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(156,94,94,0.4)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(156,94,94,0.3)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(156,94,94,0.3), inset 0 0 4px rgba(156,94,94,0.2)',
      },
    }),
  },
  canceledLabelGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  canceledLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F7E6E6',
    letterSpacing: 0.36,
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Save Heart - Top Right
  saveHeartTopRight: {
    position: 'absolute',
    top: -290,
    right: 56,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Bottom Dock - Exact from Landing Page
  bottomDock: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dockContainer: {
    width: '92%',
    height: 60,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
    }),
  },
  dockContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  dockLabelInactive: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Multi-Stay Day Calendar
  dayCalendarContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      },
    }),
  },
  dayCalendarGlass: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,240,210,0.25)',
    borderRadius: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
      },
    }),
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F6F1E7',
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  selectedRangeText: {
    fontSize: 14,
    color: '#D9BD78',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(207,201,184,0.7)',
    marginBottom: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  dateCell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(207,201,184,0.3)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    position: 'relative',
    overflow: 'hidden',
  },
  dateCellInRange: {
    borderColor: 'rgba(217,189,120,0.4)',
    backgroundColor: 'rgba(217,189,120,0.1)',
  },
  dateCellEdge: {
    borderColor: 'rgba(217,189,120,0.6)',
  },
  dateCellBooked: {
    backgroundColor: 'rgba(100,100,100,0.1)',
    borderColor: 'rgba(160,160,160,0.3)',
  },
  dateCellRangeBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(217,189,120,0.1)',
    borderRadius: 22,
  },
  dateCellEdgeGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  dateCellText: {
    fontSize: 15,
    color: '#CFC9B8',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dateCellTextInRange: {
    color: '#D9BD78',
    fontWeight: '600',
  },
  dateCellTextEdge: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dateCellTextBooked: {
    color: 'rgba(160,160,160,0.5)',
    textDecorationLine: 'line-through',
  },
  
  // Increased frosted pane height for better spacing
  stayCardFrostedTaller: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    minHeight: 185,
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
  
  // Decision Layer - Combined Price/Nights/Rating
  decisionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EEDCB6',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  nightsRatingText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#DAD6C7',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  decisionDot: {
    fontSize: 13,
    color: '#D4BE84',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Context Layer - Experience Tags
  experienceTagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  experienceTag: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  experienceTagText: {
    fontSize: 12,
    color: '#D4BE84',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // View Details CTA - Left Aligned
  viewDetailsCTA: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  viewDetailsCTAGradient: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsCTAText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D4BE84',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Ivory Separator Line
  ivorySeparator: {
    height: 0.5,
    backgroundColor: 'rgba(218,214,199,0.2)',
    marginVertical: 8,
    marginHorizontal: -4,
  },
  
  // BlurView Content for Native
  frostedContent: {
    flex: 1,
  },
  blurViewContent: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  
  // Card Date Pill (Inside Card, Replacing View Details)
  cardDatePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 2,
  },
  cardDatePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Save Heart with Frosted Circle (Top Right)
  saveHeartFrostedCircle: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.25)',
      },
    }),
  },
  saveHeartBlur: {
    flex: 1,
    backgroundColor: 'rgba(100,100,100,0.7)',
    borderWidth: 0.5,
    borderColor: 'rgba(120,120,120,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  
  // Floating Filter Cluster Button System
  filterClusterContainer: {
    position: 'absolute',
    top: 310,
    right: 16,
    zIndex: 100,
  },
  filterMainButton: {
    width: 100,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.35)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 16px rgba(0,0,0,0.35)',
      },
    }),
  },
  filterMainButtonView: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.85)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  filterMainButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F6F1E7',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterClusterBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 98,
  },
  filterPillsCluster: {
    marginTop: 8,
    gap: 8,
  },
  filterPill: {
    width: 110,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0,0,0,0.25)',
      },
    }),
  },
  filterPillView: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.85)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  filterPillActive: {
    borderColor: 'rgba(212,190,132,0.25)',
  },
  filterPillActiveFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(212,190,132,0.25)',
    borderRadius: 18,
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#DAD6C7',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Saved Category Sections
  savedCategorySection: {
    marginBottom: 24,
  },
  savedCategoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F3F1E7',
    marginLeft: 16,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  savedCarousel: {
    paddingLeft: 16,
  },
  savedCarouselContent: {
    gap: 16,
    paddingRight: 16,
  },
  stayCardHorizontal: {
    width: 300,
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
  },
});

