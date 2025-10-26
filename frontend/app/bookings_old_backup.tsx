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

// "Every Journey, Beautifully Told" - Continuous Multi-City Chronicle
const tripData = {
  // Trip Identity
  tripName: 'Summer in Italy 🇮🇹',
  subtitle: 'June 8–14, 2025 · 2 Travelers',
  status: 'Planning', // Planning | Booked | In Progress | Completed
  heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
  
  // Trip Path
  cities: ['FLR', 'ROM', 'VCE', 'MIL'],
  activeCityIndex: 1, // ROM is currently active
  
  // Continuous Chronicle Data
  cityChapters: [
    {
      id: 'amalfi',
      name: 'Amalfi, Italy',
      dates: 'Jun 8–9',
      description: 'Where azure meets ancient stone.',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      flights: [
        {
          id: '1',
          route: 'FCO → NAP',
          airline: 'ITA Airways AZ 1234',
          departure: { time: '09:40', location: 'Rome FCO · T3 · Gate C12' },
          arrival: { time: '10:45', location: 'Naples NAP · T1' },
          duration: '1h 05m · Nonstop',
          details: '🧳 1 Checked · 💺 12A Window · 👤 A. Sharma',
          status: 'confirmed'
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
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
          status: 'confirmed'
        }
      ],
      transport: [
        {
          id: '1',
          title: 'Private Transfer',
          time: '10 AM',
          details: 'Pickup Piazza Duomo → Drop Villa Cimbrone',
          duration: '45 min',
          status: 'confirmed'
        }
      ],
      experiences: [
        {
          id: '1',
          title: 'Lemon Grove Walk',
          details: '2 hrs · Ravello',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
          status: 'confirmed'
        }
      ],
      restaurants: [
        {
          id: '1',
          name: 'Trattoria del Mare',
          time: 'Dinner · 7:30 PM',
          address: 'Via della Marina',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
          status: 'confirmed'
        }
      ]
    },
    {
      id: 'ravello',
      name: 'Ravello, Italy',
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
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
          status: 'confirmed'
        }
      ],
      transport: [
        {
          id: '2',
          title: 'Ferry to Capri',
          time: '2 PM',
          details: 'Amalfi Port → Marina Grande',
          duration: '50 min',
          status: 'pending'
        }
      ],
      experiences: [
        {
          id: '3',
          title: 'Limoncello Tasting',
          details: '1 hr · Local estate',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
          status: 'confirmed'
        }
      ],
      restaurants: [
        {
          id: '2',
          name: 'Rossellinis',
          time: 'Dinner · 8:00 PM',
          address: 'Palazzo Avino',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
          status: 'pending'
        }
      ]
    },
    {
      id: 'capri',
      name: 'Capri, Italy',
      dates: 'Jun 12–14',
      description: 'Where cliffs meet the breeze.',
      heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      flights: [],
      stays: [],
      transport: [],
      experiences: [
        {
          id: '4',
          title: 'Blue Grotto Tour',
          details: '3 hrs · Boat excursion',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
          status: 'saved'
        }
      ],
      restaurants: []
    }
  ],
  
  // Trip End Summary Data
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
  const [showGallery, setShowGallery] = useState(false);

  // Navigate to Trip Gallery
  const openGallery = () => {
    router.push('/gallery');
  };

  // Hero Pane - Trip Identity + Status
  const renderHeroPane = () => (
    <View style={styles.heroPaneContainer}>
      <ImageBackground
        source={{ uri: tripData.heroImage }}
        style={styles.heroPane}
        imageStyle={styles.heroPaneImage}
      >
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          {/* Title Block */}
          <View style={styles.titleBlock}>
            <Text style={styles.heroTitle}>{tripData.tripName}</Text>
            <Text style={styles.heroSubtitle}>{tripData.subtitle}</Text>
          </View>

          {/* Planning Status Dropdown */}
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

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButtonOutline}>
              <Text style={styles.actionButtonOutlineText}>Booking Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonFilled}>
              <Text style={styles.actionButtonFilledText}>Trip Journey</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  // City Chapter Template
  const renderCityChapter = (city: any, index: number) => (
    <View key={city.id} style={styles.cityChapter}>
      {/* City Hero Image Pane */}
      <View style={styles.cityHeroContainer}>
        <ImageBackground
          source={{ uri: city.heroImage }}
          style={styles.cityHeroPane}
          imageStyle={styles.cityHeroPaneImage}
        >
          <View style={styles.cityHeroOverlay} />
          <View style={styles.cityHeroContent}>
            <Text style={styles.cityName}>{city.name}</Text>
            <Text style={styles.cityDates}>{city.dates}</Text>
            <Text style={styles.cityDescription}>{city.description}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Booking Breakdown Sections */}
      <View style={styles.bookingBreakdown}>
        {city.flights.length > 0 && renderFlightsSection(city.flights)}
        {city.stays.length > 0 && renderStaysSection(city.stays)}
        {city.transport.length > 0 && renderTransportSection(city.transport)}
        {city.experiences.length > 0 && renderExperiencesSection(city.experiences)}
        {city.restaurants.length > 0 && renderRestaurantsSection(city.restaurants)}
      </View>

      {/* Between-City Divider */}
      {index < tripData.cityChapters.length - 1 && (
        <View style={styles.cityDivider}>
          <View style={styles.cityDividerLine} />
          <Text style={styles.cityDividerText}>Next Stop</Text>
        </View>
      )}
    </View>
  );

  // Booking Section Renders - Editorial Style
  const renderFlightsSection = (flights: any[]) => (
    <View style={styles.bookingSection}>
      <Text style={styles.sectionLabel}>✈️ Flights</Text>
      {flights.map((flight) => (
        <View key={flight.id} style={styles.flightCard}>
          {/* Elegant Rail Composition */}
          <View style={styles.flightTopRow}>
            <Text style={styles.flightRoute}>{flight.route}</Text>
            <Text style={styles.flightAirline}>{flight.airline}</Text>
          </View>
          
          <View style={styles.flightRail}>
            <View style={styles.flightTimeBlock}>
              <Text style={styles.flightTime}>{flight.departure.time}</Text>
              <Text style={styles.flightLocation}>{flight.departure.location}</Text>
            </View>
            
            <View style={styles.flightDurationChip}>
              <Text style={styles.flightDuration}>{flight.duration}</Text>
            </View>
            
            <View style={styles.flightTimeBlock}>
              <Text style={styles.flightTime}>{flight.arrival.time}</Text>
              <Text style={styles.flightLocation}>{flight.arrival.location}</Text>
            </View>
          </View>
          
          <Text style={styles.flightDetails}>{flight.details}</Text>
          
          <TouchableOpacity style={styles.externalButton}>
            <Ionicons name="open-outline" size={16} color="#CBB88C" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderStaysSection = (stays: any[]) => (
    <View style={styles.bookingSection}>
      <Text style={styles.sectionLabel}>🏨 Stays</Text>
      {stays.map((stay) => (
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
            <Ionicons name="open-outline" size={16} color="#CBB88C" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderTransportSection = (transport: any[]) => (
    <View style={styles.bookingSection}>
      <Text style={styles.sectionLabel}>🚗 Transport</Text>
      {transport.map((item) => (
        <View key={item.id} style={styles.transportCard}>
          <View style={styles.transportContent}>
            <Text style={styles.transportTitle}>{item.title}</Text>
            <Text style={styles.transportTime}>{item.time} · {item.details}</Text>
            <Text style={styles.transportDuration}>{item.duration}</Text>
          </View>
          <TouchableOpacity style={styles.externalButton}>
            <Ionicons name="open-outline" size={16} color="#CBB88C" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderExperiencesSection = (experiences: any[]) => (
    <View style={styles.bookingSection}>
      <Text style={styles.sectionLabel}>🎟️ Experiences</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.experiencesCarousel}>
        {experiences.map((exp) => (
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
                <TouchableOpacity style={styles.experienceCardButton}>
                  <Ionicons name="open-outline" size={14} color="#CBB88C" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderRestaurantsSection = (restaurants: any[]) => (
    <View style={styles.bookingSection}>
      <Text style={styles.sectionLabel}>🍽️ Restaurants</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.restaurantsCarousel}>
        {restaurants.map((rest) => (
          <View key={rest.id} style={styles.restaurantCard}>
            <ImageBackground
              source={{ uri: rest.image }}
              style={styles.restaurantCardImage}
              imageStyle={styles.restaurantCardImageStyle}
            >
              <View style={styles.restaurantCardOverlay} />
              <View style={styles.restaurantCardContent}>
                <Text style={styles.restaurantCardTitle}>{rest.name}</Text>
                <Text style={styles.restaurantCardTime}>{rest.time}</Text>
                <Text style={styles.restaurantCardAddress}>{rest.address}</Text>
                <TouchableOpacity style={styles.restaurantCardButton}>
                  <Ionicons name="open-outline" size={14} color="#CBB88C" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Trip End Summary - "The Journey in Retrospect"
  const renderTripSummary = () => (
    <View style={styles.tripSummaryContainer}>
      {/* Visual Header */}
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

      {/* Trip Recap Pane */}
      <View style={styles.recapPane}>
        <View style={styles.recapStats}>
          <Text style={styles.recapStatsText}>
            🛫  Total Flights: {tripData.summary.stats.flights}{'\n'}
            🏨  Nights Stayed: {tripData.summary.stats.nights}{'\n'}
            🚗  Transfers: {tripData.summary.stats.transfers}{'\n'}
            🎟  Experiences: {tripData.summary.stats.experiences}{'\n'}
            🍽  Restaurants Visited: {tripData.summary.stats.restaurants}
          </Text>
          <Text style={styles.recapSubline}>All bookings confirmed · All memories saved</Text>
        </View>
      </View>

      {/* Trip Reflection Pane */}
      <View style={styles.reflectionPane}>
        <Text style={styles.reflectionText}>{tripData.summary.reflection}</Text>
        
        <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
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
        {/* Hero Pane - Trip Identity + Status */}
        {renderHeroPane()}

        {/* Multi-City Continuous Chronicle */}
        {tripData.cityChapters.map((city, index) => renderCityChapter(city, index))}

        {/* Trip End Summary - "The Journey in Retrospect" */}
        {renderTripSummary()}

        {/* Bottom spacing */}
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
            <Ionicons name="calendar" size={22} color="#CBB88C" />
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
    backgroundColor: '#0A0A0A', // Deep onyx with soft golden vignette
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Account for bottom navigation
  },

  // Hero Pane - Trip Identity + Status (280px)
  heroPaneContainer: {
    height: 280,
    marginBottom: 48,
  },
  heroPane: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroPaneImage: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%', // Bottom 40% fade
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

  // Title Block
  titleBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28, // Playfair Display Bold 28pt
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
    fontSize: 14, // Inter Medium 14pt
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Planning Status Dropdown
  statusDropdown: {
    height: 34,
    width: 150,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  statusText: {
    fontSize: 13, // Inter Semibold 13pt
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Trip Path Strip
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
    backgroundColor: 'rgba(203,184,140,0.25)', // Gold gradient line
    borderRadius: 1,
  },
  cityCapsule: {
    position: 'absolute',
    top: 0,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)', // Frosted outline
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -20 }], // Center on line
  },
  cityCapsuleActive: {
    backgroundColor: 'rgba(203,184,140,0.9)', // Filled gold
    borderColor: 'rgba(203,184,140,0.9)',
  },
  cityCapsuleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(203,184,140,0.8)',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  cityCapsuleTextActive: {
    color: 'rgba(10,10,10,0.9)', // Dark text on active
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButtonOutline: {
    height: 42, // 42pt height
    paddingHorizontal: 20,
    borderRadius: 21, // rounded 21pt
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.6)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  actionButtonOutlineText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  actionButtonFilled: {
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    backgroundColor: 'rgba(203,184,140,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonFilledText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(10,10,10,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // City Chapter Template
  cityChapter: {
    marginBottom: 48, // 48px between cities
  },

  // City Hero Image Pane (220px)
  cityHeroContainer: {
    height: 220,
    marginHorizontal: 24,
    marginBottom: 24,
  },
  cityHeroPane: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cityHeroPaneImage: {
    borderRadius: 22,
  },
  cityHeroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%', // Bottom 40% gradient overlay
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  cityHeroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  cityName: {
    fontSize: 20, // Playfair 20pt
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  cityDates: {
    fontSize: 13, // Inter Regular 13pt
    fontWeight: '400',
    color: 'rgba(203,184,140,0.75)', // Gold 75%
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  cityDescription: {
    fontSize: 13, // Inter Italic 13pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.65)', // Gold 65%
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Booking Breakdown
  bookingBreakdown: {
    paddingHorizontal: 24,
    gap: 24, // 24px vertical spacing
  },
  bookingSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Flight Cards - Elegant Rail Composition
  flightCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 0 1px rgba(255,255,255,0.08), 0 12px 36px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
        elevation: 8,
      },
    }),
  },
  flightTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  flightRoute: {
    fontSize: 20, // Playfair 20pt
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  flightAirline: {
    fontSize: 13, // Inter 13pt
    fontWeight: '500',
    color: 'rgba(203,184,140,0.75)', // Gold 75%
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  flightTimeBlock: {
    flex: 1,
  },
  flightTime: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightLocation: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightDurationChip: {
    backgroundColor: 'rgba(203,184,140,0.15)', // Gold frosted chip
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  flightDuration: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightDetails: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Stay Cards - Two-column split
  stayCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 0 1px rgba(255,255,255,0.08), 0 12px 36px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
        elevation: 8,
      },
    }),
  },
  stayImage: {
    width: 120,
    height: 120,
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 16,
  },
  stayImageStyle: {
    borderRadius: 18,
  },
  stayInfo: {
    flex: 1,
  },
  stayName: {
    fontSize: 17,
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
  stayPlatform: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(203,184,140,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Transport Cards
  transportCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 0 1px rgba(255,255,255,0.08), 0 12px 36px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
        elevation: 8,
      },
    }),
  },
  transportContent: {
    flex: 1,
  },
  transportTitle: {
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
  transportTime: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  transportDuration: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(203,184,140,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Experience & Restaurant Carousels
  experiencesCarousel: {
    paddingRight: 24,
  },
  restaurantsCarousel: {
    paddingRight: 24,
  },

  // Experience Cards (150×180px)
  experienceCard: {
    width: 150,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
      },
    }),
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
    height: 80,
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
    fontSize: 15, // Playfair Semibold 15pt
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  experienceCardDetails: {
    fontSize: 13, // Inter 13pt
    fontWeight: '400',
    color: 'rgba(203,184,140,0.7)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  experienceCardButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(203,184,140,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
  },

  // Restaurant Cards
  restaurantCard: {
    width: 150,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
      },
    }),
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
    height: 90,
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
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  restaurantCardTime: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.8)',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  restaurantCardAddress: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  restaurantCardButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(203,184,140,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
  },

  // External Button (shared)
  externalButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36, // Gold outline circle 36×36px
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(203,184,140,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
  },

  // Between-City Divider
  cityDivider: {
    alignItems: 'center',
    marginVertical: 48, // 48px above next city
  },
  cityDividerLine: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.3)', // 1px gold line opacity 30%
    marginBottom: 12,
  },
  cityDividerText: {
    fontSize: 12, // Inter Italic 12pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.6)', // Gold 60%
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Trip End Summary - "The Journey in Retrospect"
  tripSummaryContainer: {
    marginTop: 24,
  },
  summaryHeaderContainer: {
    height: 240, // 240px as specified
    marginHorizontal: 24,
    marginBottom: 24,
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Soft fade overlay top → bottom
    borderRadius: 24,
  },
  summaryHeroContent: {
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 24, // Playfair Bold 24pt
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
    fontSize: 14, // Inter Regular 14pt
    fontWeight: '400',
    color: 'rgba(203,184,140,0.7)', // Gold 70%
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Trip Recap Pane
  recapPane: {
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.1)',
    padding: 24,
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
  recapStats: {
    alignItems: 'flex-start',
  },
  recapStatsText: {
    fontSize: 15, // Inter Medium 15pt
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  recapSubline: {
    fontSize: 13, // Inter Italic 13pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.65)', // Gold 65%
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Trip Reflection Pane
  reflectionPane: {
    marginHorizontal: 24,
    marginBottom: 48,
    alignItems: 'center',
  },
  reflectionText: {
    fontSize: 15, // Playfair Italic 15pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)', // White 80%
    lineHeight: 24, // 150% line height
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
    height: 46, // 46pt height
    paddingHorizontal: 24,
    borderRadius: 20, // 20pt corner radius
    backgroundColor: 'rgba(203,184,140,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(203,184,140,0.3)',
      },
    }),
  },
  galleryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(10,10,10,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Footer Signature
  footerSignature: {
    alignItems: 'center',
    marginBottom: 80, // Large bottom margin
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
    color: 'rgba(203,184,140,0.7)', // Gold 70%
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom Navigation
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
    color: '#CBB88C',
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

  // Spacing
  bottomSpacing: {
    height: 60,
  },
});