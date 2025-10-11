import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// "Calm, Curated, Cinematic" - Editorial Masterflow
const tripData = {
  tripName: 'Summer in Italy 🇮🇹',
  subtitle: 'June 8–14 · 2 Travelers',
  status: 'Planning',
  heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
  cities: ['FLR', 'ROM', 'VCE', 'MIL'],
  activeCityIndex: 1,
  
  days: [
    {
      id: 'day1-2',
      label: 'Day 1–2',
      city: 'Amalfi, Italy',
      dates: 'Jun 8–9',
      description: 'Where azure meets ancient stone.',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      flights: [
        {
          id: '1',
          route: 'FCO → NAP',
          airline: 'ITA AZ 1234',
          departure: '09:40',
          arrival: '10:45',
          duration: '1h 05m Nonstop',
          details: 'T3 Gate C12 · 1 Checked · 12A Window'
        }
      ],
      stays: [
        {
          id: '1',
          name: 'Hotel Onda Blu',
          address: 'Via Tragara 21',
          checkin: 'Check-in 3 PM',
          checkout: 'Check-out 11 AM',
          platform: 'via Booking.com',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      transport: [
        {
          id: '1',
          title: 'Private Transfer',
          time: '10 AM',
          details: 'Piazza Duomo → Villa Cimbrone',
          duration: '45 min · Car'
        }
      ],
      experiences: [
        {
          id: '1',
          title: 'Lemon Grove Walk',
          details: '2 hrs · Ravello',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ],
      restaurants: [
        {
          id: '1',
          name: 'Trattoria del Mare',
          time: 'Dinner 7:30 PM',
          details: 'Sea View',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ]
    },
    {
      id: 'day3-4',
      label: 'Day 3–4',
      city: 'Ravello, Italy',
      dates: 'Jun 10–11',
      description: 'Where silence hums between lemon trees.',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      flights: [],
      stays: [
        {
          id: '2',
          name: 'Villa San Michele',
          address: 'Via Capodimonte 14',
          checkin: 'Check-in 2 PM',
          checkout: 'Check-out 12 PM',
          platform: 'via Relais & Châteaux',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ],
      transport: [
        {
          id: '2',
          title: 'Ferry to Capri',
          time: '2 PM',
          details: 'Amalfi Port → Marina Grande',
          duration: '50 min'
        }
      ],
      experiences: [
        {
          id: '2',
          title: 'Limoncello Tasting',
          details: '1 hr · Local estate',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      restaurants: []
    },
    {
      id: 'day5-7',
      label: 'Day 5–7',
      city: 'Capri, Italy',
      dates: 'Jun 12–14',
      description: 'Where cliffs meet the breeze.',
      heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      flights: [],
      stays: [],
      transport: [],
      experiences: [
        {
          id: '3',
          title: 'Blue Grotto Tour',
          details: '3 hrs · Boat excursion',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
        }
      ],
      restaurants: []
    }
  ],
  
  summary: {
    title: 'Journey Completed.',
    subtitle: 'June 8–14, 2025 · 4 Cities · 7 Days.',
    stats: {
      flights: 2,
      nights: 6,
      transfers: 3,
      experiences: 5,
      restaurants: 8
    },
    reflection: 'From Rome\'s hum to Amalfi\'s hush, your journey was a tapestry of motion and stillness. Every moment — planned or found — now lives here.',
    finalImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  }
};

export default function TripCanvas() {
  const [activeDayId, setActiveDayId] = useState('day1-2');
  
  const activeDay = tripData.days.find(d => d.id === activeDayId) || tripData.days[0];

  // Hero Pane - 320px with strong blur and Day Selector
  const renderHeroPane = () => (
    <View style={styles.heroPaneContainer}>
      <ImageBackground
        source={{ uri: tripData.heroImage }}
        style={styles.heroPane}
        imageStyle={styles.heroPaneImage}
      >
        {/* Strong Gaussian Blur Overlay */}
        <View style={styles.heroBlurOverlay} />
        <View style={styles.heroOverlay} />
        
        <View style={styles.heroContent}>
          {/* Title Block */}
          <Text style={styles.heroTitle}>{tripData.tripName}</Text>
          <Text style={styles.heroSubtitle}>{tripData.subtitle}</Text>
          
          {/* Status Dropdown */}
          <View style={styles.statusDropdown}>
            <Text style={styles.statusText}>{tripData.status}</Text>
          </View>
          
          {/* Trip Path Strip */}
          <View style={styles.tripPathStrip}>
            <View style={styles.tripPathLine} />
            {tripData.cities.map((city, index) => (
              <View key={city} style={[
                styles.cityCapsule,
                index === tripData.activeCityIndex && styles.cityCapsuleActive,
                { left: `${(index / (tripData.cities.length - 1)) * 85}%` }
              ]}>
                <Text style={[
                  styles.cityCapsuleText,
                  index === tripData.activeCityIndex && styles.cityCapsuleTextActive
                ]}>
                  {city}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Day Selector Tabs (NEW) */}
          <View style={styles.daySelectorContainer}>
            {tripData.days.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayTab,
                  activeDayId === day.id && styles.dayTabActive
                ]}
                onPress={() => setActiveDayId(day.id)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.dayTabText,
                  activeDayId === day.id && styles.dayTabTextActive
                ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  // City Title Pane
  const renderCityPane = () => (
    <View style={styles.cityPaneContainer}>
      <ImageBackground
        source={{ uri: activeDay.heroImage }}
        style={styles.cityPane}
        imageStyle={styles.cityPaneImage}
      >
        <View style={styles.cityOverlay} />
        <View style={styles.cityContent}>
          <Text style={styles.cityName}>{activeDay.city}</Text>
          <Text style={styles.cityDates}>{activeDay.dates}</Text>
          <Text style={styles.cityDescription}>{activeDay.description}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  // Empty State Component
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>Nothing booked yet · this day awaits its story.</Text>
    </View>
  );

  // Flights Section
  const renderFlights = () => {
    if (activeDay.flights.length === 0) return renderEmptyState();
    
    return (
      <View style={styles.categoryPane}>
        <Text style={styles.categoryTitle}>🛫 Flights</Text>
        <View style={styles.categoryDivider} />
        {activeDay.flights.map((flight) => (
          <View key={flight.id} style={styles.flightCard}>
            <View style={styles.flightTopRow}>
              <Text style={styles.flightRoute}>{flight.route}</Text>
              <Text style={styles.flightAirline}>{flight.airline}</Text>
            </View>
            <Text style={styles.flightTime}>{flight.departure} – {flight.arrival} · {flight.duration}</Text>
            <Text style={styles.flightDetails}>{flight.details}</Text>
            <TouchableOpacity style={styles.externalButton}>
              <Ionicons name="open-outline" size={14} color="#B59B73" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  // Stays Section
  const renderStays = () => {
    if (activeDay.stays.length === 0) return renderEmptyState();
    
    return (
      <View style={[styles.categoryPane, styles.stayPane]}>
        <Text style={styles.categoryTitle}>🏨 Stays</Text>
        <View style={styles.categoryDivider} />
        {activeDay.stays.map((stay) => (
          <View key={stay.id} style={styles.stayCard}>
            <ImageBackground
              source={{ uri: stay.image }}
              style={styles.stayImage}
              imageStyle={styles.stayImageStyle}
            />
            <View style={styles.stayInfo}>
              <Text style={styles.stayName}>{stay.name}</Text>
              <Text style={styles.stayAddress}>{stay.address}</Text>
              <Text style={styles.stayDetails}>{stay.checkin} · {stay.checkout}</Text>
              <Text style={styles.stayPlatform}>{stay.platform}</Text>
            </View>
            <TouchableOpacity style={styles.externalButton}>
              <Ionicons name="open-outline" size={14} color="#B59B73" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  // Transport Section
  const renderTransport = () => {
    if (activeDay.transport.length === 0) return renderEmptyState();
    
    return (
      <View style={styles.categoryPane}>
        <Text style={styles.categoryTitle}>🚗 Transport</Text>
        <View style={styles.categoryDivider} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {activeDay.transport.map((item) => (
            <View key={item.id} style={styles.transportCard}>
              <Text style={styles.transportTitle}>{item.title}</Text>
              <Text style={styles.transportTime}>{item.time} · {item.details}</Text>
              <Text style={styles.transportDuration}>{item.duration}</Text>
              <TouchableOpacity style={styles.externalButton}>
                <Ionicons name="open-outline" size={14} color="#B59B73" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Experiences Section
  const renderExperiences = () => {
    if (activeDay.experiences.length === 0) return renderEmptyState();
    
    return (
      <View style={styles.categoryPane}>
        <Text style={styles.categoryTitle}>🎟️ Experiences</Text>
        <View style={styles.categoryDivider} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {activeDay.experiences.map((exp) => (
            <View key={exp.id} style={styles.experienceCard}>
              <ImageBackground
                source={{ uri: exp.image }}
                style={styles.experienceCardImage}
                imageStyle={styles.experienceCardImageStyle}
              >
                <View style={styles.experienceCardOverlay} />
                <View style={styles.experienceCardContent}>
                  <Text style={styles.experienceCardTitle}>{exp.title}</Text>
                  <Text style={styles.experienceCardDetails}>{exp.details}</Text>
                  <TouchableOpacity style={styles.externalButtonSmall}>
                    <Ionicons name="open-outline" size={12} color="#B59B73" />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Restaurants Section
  const renderRestaurants = () => {
    if (activeDay.restaurants.length === 0) return renderEmptyState();
    
    return (
      <View style={styles.categoryPane}>
        <Text style={styles.categoryTitle}>🍽️ Restaurants</Text>
        <View style={styles.categoryDivider} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {activeDay.restaurants.map((rest) => (
            <View key={rest.id} style={styles.restaurantCard}>
              <ImageBackground
                source={{ uri: rest.image }}
                style={styles.restaurantCardImage}
                imageStyle={styles.restaurantCardImageStyle}
              >
                <View style={styles.restaurantCardOverlay} />
                <View style={styles.restaurantCardContent}>
                  <Text style={styles.restaurantCardTitle}>{rest.name}</Text>
                  <Text style={styles.restaurantCardTime}>{rest.time} · {rest.details}</Text>
                  <TouchableOpacity style={styles.externalButtonSmall}>
                    <Ionicons name="open-outline" size={12} color="#B59B73" />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Trip End Summary
  const renderTripSummary = () => (
    <View style={styles.tripSummaryContainer}>
      <View style={styles.summaryHeaderContainer}>
        <ImageBackground
          source={{ uri: tripData.summary.finalImage }}
          style={styles.summaryHeroPane}
          imageStyle={styles.summaryHeroPaneImage}
        >
          <View style={styles.summaryHeroOverlay} />
          <View style={styles.summaryHeroContent}>
            <Text style={styles.summaryTitle}>{tripData.summary.title}</Text>
            <Text style={styles.summarySubtitle}>{tripData.summary.subtitle}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Frosted Summary Card */}
      <View style={styles.recapPane}>
        <View style={styles.recapGrid}>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>🛫</Text>
            <Text style={styles.recapLabel}>Flights {tripData.summary.stats.flights}</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>🏨</Text>
            <Text style={styles.recapLabel}>Nights {tripData.summary.stats.nights}</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>🚗</Text>
            <Text style={styles.recapLabel}>Transfers {tripData.summary.stats.transfers}</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>🎟</Text>
            <Text style={styles.recapLabel}>Experiences {tripData.summary.stats.experiences}</Text>
          </View>
          <View style={styles.recapRow}>
            <Text style={styles.recapIcon}>🍽</Text>
            <Text style={styles.recapLabel}>Restaurants {tripData.summary.stats.restaurants}</Text>
          </View>
        </View>
        <Text style={styles.recapSubline}>All bookings confirmed · All memories saved</Text>
      </View>

      {/* Reflection Pane */}
      <View style={styles.reflectionPane}>
        <Text style={styles.reflectionText}>{tripData.summary.reflection}</Text>
        
        <TouchableOpacity style={styles.galleryButton} onPress={() => router.push('/gallery')}>
          <Text style={styles.galleryButtonText}>View Trip Gallery</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Signature */}
      <View style={styles.footerSignature}>
        <Text style={styles.footerLogo}>Trāvea</Text>
        <Text style={styles.footerTagline}>For travelers who collect moments, not miles.</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeroPane()}
        {renderCityPane()}
        
        <View style={styles.categoriesContainer}>
          {renderFlights()}
          {renderStays()}
          {renderTransport()}
          {renderExperiences()}
          {renderRestaurants()}
        </View>
        
        {renderTripSummary()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomDock}>
        <View style={styles.dockContent}>
          <TouchableOpacity 
            style={styles.dockItem} 
            onPress={() => router.push('/landing')}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dockLabelInactive}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockItem} 
            onPress={() => router.push('/trips')}
            activeOpacity={0.8}
          >
            <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dockLabelInactive}>My Trips</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockItem} 
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={22} color="#B59B73" />
            <Text style={styles.dockLabelActive}>Trip Canvas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockItem} 
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dockLabelInactive}>Concierge</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero Pane - 320px with strong blur
  heroPaneContainer: {
    height: 320,
    marginBottom: 24,
  },
  heroPane: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroPaneImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroBlurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Status Dropdown - Bronze
  statusDropdown: {
    height: 34,
    width: 150,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Trip Path Strip - Bronze
  tripPathStrip: {
    position: 'relative',
    height: 40,
    width: '85%',
    marginBottom: 24,
  },
  tripPathLine: {
    position: 'absolute',
    top: 19,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(181,155,115,0.2)',
    borderRadius: 1,
  },
  cityCapsule: {
    position: 'absolute',
    top: 0,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -20 }],
  },
  cityCapsuleActive: {
    backgroundColor: 'rgba(181,155,115,0.9)',
    borderColor: 'rgba(181,155,115,0.9)',
  },
  cityCapsuleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(181,155,115,0.8)',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  cityCapsuleTextActive: {
    color: 'rgba(10,10,10,0.9)',
  },

  // Day Selector Tabs (NEW)
  daySelectorContainer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 6,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabActive: {
    backgroundColor: 'rgba(181,155,115,0.9)',
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  dayTabTextActive: {
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
  },

  // City Title Pane
  cityPaneContainer: {
    height: 220,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cityPane: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cityPaneImage: {
    borderRadius: 24,
  },
  cityOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  cityContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  cityDates: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  cityDescription: {
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(181,155,115,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Categories Container
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 20,
  },

  // Standardized Frosted Pane - Image Style (Dark Matte with Soft Shadow)
  categoryPane: {
    minHeight: 180,
    backgroundColor: 'rgba(30,30,30,0.85)',
    borderRadius: 24,
    borderWidth: 0,
    padding: 24,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
  },
  stayPane: {
    minHeight: 220,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  categoryDivider: {
    height: 1,
    backgroundColor: 'rgba(181,155,115,0.15)',
    marginBottom: 12,
  },

  // Empty State - Bronze
  emptyState: {
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(181,155,115,0.6)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Flight Card - Simplified
  flightCard: {
    position: 'relative',
  },
  flightTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  flightRoute: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  flightAirline: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.8)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightDetails: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Stay Card
  stayCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stayImage: {
    width: 110,
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 14,
  },
  stayImageStyle: {
    borderRadius: 20,
  },
  stayInfo: {
    flex: 1,
  },
  stayName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  stayAddress: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  stayDetails: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  stayPlatform: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Horizontal Scroll Cards
  horizontalScroll: {
    flexDirection: 'row',
  },
  transportCard: {
    width: 150,
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 14,
    marginRight: 12,
    position: 'relative',
  },
  transportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  transportTime: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  transportDuration: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Experience & Restaurant Cards
  experienceCard: {
    width: 150,
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  experienceCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  experienceCardImageStyle: {
    borderRadius: 20,
  },
  experienceCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  experienceCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  experienceCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  experienceCardDetails: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  restaurantCard: {
    width: 150,
    height: 110,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  restaurantCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  restaurantCardImageStyle: {
    borderRadius: 20,
  },
  restaurantCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  restaurantCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  restaurantCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  restaurantCardTime: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // External Buttons - Bronze
  externalButton: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(181,155,115,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
  },
  externalButtonSmall: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(181,155,115,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
  },

  // Trip Summary
  tripSummaryContainer: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  summaryHeaderContainer: {
    height: 240,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  summaryHeroPane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryHeroPaneImage: {
    borderRadius: 24,
  },
  summaryHeroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
  },
  summaryHeroContent: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  summarySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Frosted Recap Card
  recapPane: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.1)',
    padding: 24,
    marginBottom: 32,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
      },
    }),
  },
  recapGrid: {
    gap: 12,
    marginBottom: 16,
  },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recapIcon: {
    fontSize: 20,
  },
  recapLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  recapSubline: {
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(181,155,115,0.65)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Reflection Pane
  reflectionPane: {
    alignItems: 'center',
    marginBottom: 48,
  },
  reflectionText: {
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  galleryButton: {
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 23,
    backgroundColor: 'rgba(181,155,115,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Footer
  footerSignature: {
    alignItems: 'center',
    marginBottom: 60,
  },
  footerLogo: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  footerTagline: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom Navigation - Bronze
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  dockContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.select({ ios: 20, default: 0 }),
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dockLabelActive: {
    fontSize: 11,
    fontWeight: '500',
    color: '#B59B73',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  dockLabelInactive: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  bottomSpacing: {
    height: 40,
  },
});
