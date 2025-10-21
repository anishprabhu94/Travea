import React, { useState, useEffect, useMemo } from 'react';
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
import { useExperienceBooking } from '../contexts/ExperienceBookingContext';
import { useTrips } from '../contexts/TripsContext';

const { width } = Dimensions.get('window');

export default function ExperienceBrowsing() {
  const params = useLocalSearchParams();
  const { trips, getTripById } = useTrips();
  
  // Get trip and city from params
  const tripId = params.tripId as string;
  const cityCode = params.cityCode as string;
  
  console.log('ExperienceBrowsing - Params:', { tripId, cityCode });
  console.log('ExperienceBrowsing - Available trips:', trips.length);
  
  // Get real trip data
  const trip = tripId ? getTripById(tripId) : (trips.length > 0 ? trips[0] : null);
  
  console.log('ExperienceBrowsing - Selected trip:', trip ? trip.title : 'No trip found');
  
  // Get city from trip
  const city = trip?.cities ? (
    cityCode 
      ? trip.cities.find(c => c.code === cityCode) || trip.cities[0]
      : trip.cities[0]
  ) : null;
  
  console.log('ExperienceBrowsing - Selected city:', city ? city.name : 'No city found');
  
  // Use real data from trip with proper fallbacks
  const cityName = city?.name || 'Florence';
  const cityStartMonth = city?.startMonth || trip?.startMonth || 'Jun';
  const cityStartDay = (city?.startDay || trip?.startDay || 10);
  const cityEndMonth = city?.endMonth || trip?.endMonth || 'Jun';
  const cityEndDay = (city?.endDay || trip?.endDay || 13);
  const travelers = trip?.travelers || 2;
  const tripTitle = trip?.title || 'Summer in Italy';
  
  // State
  const [savedExperiences, setSavedExperiences] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<number>(cityStartDay); // Only one day at a time
  const [filterClusterOpen, setFilterClusterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'attractions' | 'immersions' | 'adventures'>('attractions');
  const contentOpacity = useState(new Animated.Value(0))[0];
  const filterClusterAnim = useState(new Animated.Value(0))[0];
  const dockAnim = useState(new Animated.Value(0))[0];
  
  const { getBookingStatus } = useExperienceBooking();

  // Generate date range based on city dates
  const generateDateRange = () => {
    const days = [];
    const totalDays = cityEndDay - cityStartDay + 1;
    
    for (let i = 0; i < totalDays; i++) {
      days.push(cityStartDay + i);
    }
    
    return days;
  };
  
  const cityDates = generateDateRange();
  
  // Real trip data
  const tripData = {
    title: tripTitle,
    dates: `${cityStartMonth} ${cityStartDay}–${cityEndMonth} ${cityEndDay}`,
    travelers: travelers,
    heroImage: trip?.cities?.[0]?.name === 'Amalfi Coast' || city?.name === 'Amalfi Coast'
      ? 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
      : 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
  };

  // Entry animation
  useEffect(() => {
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

  // Filter cluster animation
  useEffect(() => {
    Animated.timing(filterClusterAnim, {
      toValue: filterClusterOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [filterClusterOpen]);

  const handleSaveExperience = (experienceId: string) => {
    setSavedExperiences(prev => {
      const newSet = new Set(prev);
      if (newSet.has(experienceId)) {
        newSet.delete(experienceId);
      } else {
        newSet.add(experienceId);
      }
      return newSet;
    });
  };

  const handleToggleDay = (day: number) => {
    setSelectedDay(day); // Only set one day
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US');
  };

  // Mock experience data - 5 per category (MECE)
  const mockExperiences = [
    // ATTRACTIONS CATEGORY (5 experiences)
    {
      id: '1',
      name: 'Uffizi Gallery Tour',
      tagline: 'Renaissance masterpieces unveiled',
      pricePerPerson: 85,
      rating: 4.9,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      category: 'attractions',
    },
    {
      id: '2',
      name: 'Duomo Rooftop Access',
      tagline: 'Cathedral heights & city views',
      pricePerPerson: 65,
      rating: 4.8,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      category: 'attractions',
    },
    {
      id: '3',
      name: 'Accademia Museum',
      tagline: "Michelangelo's David awaits",
      pricePerPerson: 75,
      rating: 4.9,
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      category: 'attractions',
    },
    {
      id: '4',
      name: 'Palazzo Vecchio',
      tagline: 'Hidden passages & secret rooms',
      pricePerPerson: 55,
      rating: 4.7,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      category: 'attractions',
    },
    {
      id: '5',
      name: 'Boboli Gardens',
      tagline: 'Medici sculpture gardens',
      pricePerPerson: 45,
      rating: 4.6,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      category: 'attractions',
    },
    
    // IMMERSIONS CATEGORY (5 experiences)
    {
      id: '6',
      name: 'Tuscan Cooking Class',
      tagline: 'From market to table',
      pricePerPerson: 145,
      rating: 4.9,
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      category: 'immersions',
    },
    {
      id: '7',
      name: 'Artisan Workshop Tour',
      tagline: 'Leather, gold & craftsmanship',
      pricePerPerson: 95,
      rating: 4.8,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      category: 'immersions',
    },
    {
      id: '8',
      name: 'Wine Tasting in Chianti',
      tagline: 'Vineyards & villa terraces',
      pricePerPerson: 165,
      rating: 4.9,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      category: 'immersions',
    },
    {
      id: '9',
      name: 'Fresco Painting Class',
      tagline: 'Renaissance techniques revealed',
      pricePerPerson: 125,
      rating: 4.7,
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      category: 'immersions',
    },
    {
      id: '10',
      name: 'Opera Evening',
      tagline: 'Puccini in historic theater',
      pricePerPerson: 185,
      rating: 4.8,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      category: 'immersions',
    },
    
    // ADVENTURES CATEGORY (5 experiences)
    {
      id: '11',
      name: 'Vespa Tour',
      tagline: 'Hills, curves & cypress roads',
      pricePerPerson: 195,
      rating: 4.9,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      category: 'adventures',
    },
    {
      id: '12',
      name: 'Hot Air Balloon',
      tagline: 'Dawn over Tuscan valleys',
      pricePerPerson: 285,
      rating: 4.9,
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      category: 'adventures',
    },
    {
      id: '13',
      name: 'E-Bike Vineyard Tour',
      tagline: 'Pedal through wine country',
      pricePerPerson: 135,
      rating: 4.8,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      category: 'adventures',
    },
    {
      id: '14',
      name: 'Hiking Path of Gods',
      tagline: 'Coastal trails & ancient steps',
      pricePerPerson: 95,
      rating: 4.7,
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      category: 'adventures',
    },
    {
      id: '15',
      name: 'Sunset Sailing',
      tagline: 'Mediterranean golden hour',
      pricePerPerson: 225,
      rating: 4.9,
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      category: 'adventures',
    },
  ];

  // Filter experiences based on active filter
  const getFilteredExperiences = () => {
    return mockExperiences.filter(exp => exp.category === activeFilter);
  };

  const filteredExperiences = getFilteredExperiences();

  // Calculate display date based on selected day
  const displayDate = useMemo(() => {
    return {
      month: selectedDay === cityStartDay ? cityStartMonth : 
             (selectedDay > cityStartDay && selectedDay <= cityEndDay) ? cityStartMonth : cityEndMonth,
      day: selectedDay.toString()
    };
  }, [selectedDay, cityStartMonth, cityEndMonth, cityStartDay, cityEndDay]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: tripData.heroImage }}
        style={styles.backgroundImage}
        blurRadius={0}
      >
        <View style={styles.vignetteOverlay} />
        
        <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#D9CBA0" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.cityName}>{cityName}</Text>
              <Text style={styles.tripTitle}>{tripData.title}</Text>
            </View>
            
            <View style={styles.headerRight} />
          </View>

          {/* HERO SECTION - Date Circles Only */}
          <View style={styles.heroSection}>
            <View style={styles.heroContent}>
              <Text style={styles.heroLabel}>Select a Day</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dayCirclesContent}
                style={styles.dayCirclesScroll}
              >
                {cityDates.map((day) => {
                  const isSelected = selectedDay === day;
                  
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayCircle,
                        isSelected && styles.dayCircleSelected,
                      ]}
                      onPress={() => handleToggleDay(day)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayCircleText,
                          isSelected && styles.dayCircleTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* FILTERS - Frosted Cluster Button */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={styles.filterClusterButton}
              onPress={() => setFilterClusterOpen(!filterClusterOpen)}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint="light" style={styles.filterClusterBlur}>
                <Text style={styles.filterClusterText}>Filters ✦</Text>
              </BlurView>
            </TouchableOpacity>
            
            {filterClusterOpen && (
              <Animated.View
                style={[
                  styles.filterOptionsCluster,
                  {
                    opacity: filterClusterAnim,
                    transform: [
                      {
                        scale: filterClusterAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {['attractions', 'immersions', 'adventures'].map((filter, index) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterOptionPill,
                      { top: (index + 1) * 60 },
                      activeFilter === filter && styles.filterOptionPillActive,
                    ]}
                    onPress={() => {
                      setActiveFilter(filter as 'attractions' | 'immersions' | 'adventures');
                      setFilterClusterOpen(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <BlurView intensity={25} tint="light" style={styles.filterOptionBlur}>
                      <Text
                        style={[
                          styles.filterOptionText,
                          activeFilter === filter && styles.filterOptionTextActive,
                        ]}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
          >
            {/* Experience Cards Section */}
            <View style={styles.experienceCardsSection}>
              {filteredExperiences.map((experience, idx) => {
                const totalPrice = experience.pricePerPerson * travelers;
                const bookingStatus = getBookingStatus(experience.id);
                
                return (
                  <TouchableOpacity 
                    key={experience.id}
                    style={[styles.experienceCard, idx === 0 && styles.firstCard]} 
                    activeOpacity={0.8}
                    onPress={() => router.push({
                      pathname: '/experience-info',
                      params: { 
                        people: travelers.toString(), 
                        experienceId: experience.id,
                        tripId: tripId,
                        cityCode: cityCode,
                        city: cityName,
                        date: `${displayDate.month} ${displayDate.day}`
                      }
                    })}
                  >
                    <ImageBackground
                      source={{ uri: experience.image }}
                      style={styles.experienceCardBg}
                      imageStyle={styles.experienceCardBgStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.75)']}
                        style={styles.experienceCardGradient}
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
                        onPressIn={() => handleSaveExperience(experience.id)}
                        activeOpacity={0.7}
                      >
                        <BlurView intensity={20} tint="light" style={styles.saveHeartBlur}>
                          <Ionicons
                            name={savedExperiences.has(experience.id) ? 'heart' : 'heart-outline'}
                            size={20}
                            color={savedExperiences.has(experience.id) ? '#CBB88C' : 'rgba(255,255,255,0.7)'}
                          />
                        </BlurView>
                      </TouchableOpacity>
                      
                      <View style={styles.experienceCardFrosted}>
                        {Platform.OS === 'web' ? (
                          <View style={styles.frostedContent}>
                            <Text style={styles.experienceCardName}>{experience.name}</Text>
                            <Text style={styles.experienceCardTagline}>{experience.tagline}</Text>
                            <View style={styles.decisionRow}>
                              <Text style={styles.priceText}>€{formatPrice(totalPrice)}</Text>
                              <Text style={styles.decisionDot}> · </Text>
                              <Text style={styles.peopleRatingText}>{travelers} {travelers === 1 ? 'person' : 'people'}</Text>
                              <Text style={styles.decisionDot}> · </Text>
                              <Ionicons name="star" size={12} color="#FFFFFF" style={{marginRight: 3}} />
                              <Text style={styles.peopleRatingText}>{experience.rating}</Text>
                            </View>
                            <View style={styles.ivorySeparator} />
                            <View style={styles.cardDatePill}>
                              <Text style={styles.cardDatePillText}>
                                {displayDate.month.slice(0, 3)} {displayDate.day}
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <BlurView intensity={30} tint="light" style={styles.blurViewContent}>
                            <Text style={styles.experienceCardName}>{experience.name}</Text>
                            <Text style={styles.experienceCardTagline}>{experience.tagline}</Text>
                            <View style={styles.decisionRow}>
                              <Text style={styles.priceText}>€{formatPrice(totalPrice)}</Text>
                              <Text style={styles.decisionDot}> · </Text>
                              <Text style={styles.peopleRatingText}>{travelers} {travelers === 1 ? 'person' : 'people'}</Text>
                              <Text style={styles.decisionDot}> · </Text>
                              <Ionicons name="star" size={12} color="#FFFFFF" style={{marginRight: 3}} />
                              <Text style={styles.peopleRatingText}>{experience.rating}</Text>
                            </View>
                            <View style={styles.ivorySeparator} />
                            <View style={styles.cardDatePill}>
                              <Text style={styles.cardDatePillText}>
                                {displayDate.month.slice(0, 3)} {displayDate.day}
                              </Text>
                            </View>
                          </BlurView>
                        )}
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,13,13,0.65)',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  cityName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'DMSans-Bold',
    letterSpacing: 0.5,
  },
  tripTitle: {
    fontSize: 13,
    color: 'rgba(217,203,160,0.7)',
    fontFamily: 'DMSans-Regular',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroLabel: {
    fontSize: 14,
    color: 'rgba(217,203,160,0.8)',
    fontFamily: 'DMSans-Regular',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  dayCirclesScroll: {
    width: '100%',
  },
  dayCirclesContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  dayCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(217,203,160,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  dayCircleSelected: {
    backgroundColor: 'rgba(203,184,140,0.25)',
    borderColor: 'rgba(203,184,140,0.8)',
    shadowColor: '#CBB88C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  dayCircleText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'DMSans-Medium',
  },
  dayCircleTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'DMSans-Bold',
  },
  filterContainer: {
    position: 'absolute',
    top: 240,
    right: 20,
    zIndex: 10,
  },
  filterClusterButton: {
    width: 120,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  filterClusterBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  filterClusterText: {
    fontSize: 15,
    fontFamily: 'DMSans-Medium',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  filterOptionsCluster: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  filterOptionPill: {
    position: 'absolute',
    right: 0,
    width: 140,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  filterOptionPillActive: {
    shadowColor: '#CBB88C',
    shadowOpacity: 0.4,
  },
  filterOptionBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
  },
  filterOptionTextActive: {
    color: '#CBB88C',
    fontFamily: 'DMSans-Medium',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  experienceCardsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  firstCard: {
    marginTop: 0,
  },
  experienceCard: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  experienceCardBg: {
    width: '100%',
    height: '100%',
  },
  experienceCardBgStyle: {
    borderRadius: 16,
  },
  experienceCardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  bookedLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#D4BE84',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  bookedLabelGradient: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(212,190,132,0.4)',
  },
  bookedLabelText: {
    fontSize: 11,
    fontFamily: 'DMSans-Bold',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  canceledLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#8C5050',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  canceledLabelGradient: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(140,80,80,0.3)',
  },
  canceledLabelText: {
    fontSize: 11,
    fontFamily: 'DMSans-Bold',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.2,
  },
  saveHeartFrostedCircle: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveHeartBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  experienceCardFrosted: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  frostedContent: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  blurViewContent: {
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  experienceCardName: {
    fontSize: 19,
    fontFamily: 'DMSans-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  experienceCardTagline: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(217,203,160,0.8)',
    marginBottom: 12,
    lineHeight: 20,
  },
  decisionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 17,
    fontFamily: 'DMSans-Bold',
    color: '#FFFFFF',
  },
  decisionDot: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  peopleRatingText: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  ivorySeparator: {
    height: 1,
    backgroundColor: 'rgba(217,203,160,0.2)',
    marginBottom: 12,
  },
  cardDatePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(203,184,140,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
  },
  cardDatePillText: {
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
});
