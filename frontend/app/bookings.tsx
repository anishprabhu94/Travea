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
}
};

export default function BookingsOverview() {
  const [selectedDayId, setSelectedDayId] = useState(tripData.days[0].id);
  const [expandedSections, setExpandedSections] = useState({
    flights: true,
    stays: true,
    transport: true,
    experiences: true,
    restaurants: true
  });

  const selectedDay = tripData.days.find(day => day.id === selectedDayId) || tripData.days[0];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusCount = (section: string) => {
    const data = selectedDay[section as keyof typeof selectedDay] as any[];
    if (Array.isArray(data)) {
      const confirmed = data.filter(item => item.status === 'confirmed').length;
      const total = data.length;
      return total === 0 ? '0 Booked' : `${confirmed} of ${total} Booked`;
    }
    return '0 Booked';
  };

  const renderSectionHeader = (section: string, label: string) => (
    <TouchableOpacity 
      style={styles.sectionHeader}
      onPress={() => toggleSection(section)}
      activeOpacity={0.8}
    >
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={styles.statusChip}>
        <Text style={styles.statusText}>{getStatusCount(section)}</Text>
      </View>
      <Ionicons 
        name={expandedSections[section as keyof typeof expandedSections] ? 'chevron-up' : 'chevron-down'} 
        size={22} 
        color="#CBB88C" 
        style={styles.chevronIcon}
      />
    </TouchableOpacity>
  );

  const renderDayPill = (day: any, isActive: boolean) => (
    <TouchableOpacity
      key={day.id}
      style={[styles.dayPill, isActive && styles.dayPillActive]}
      onPress={() => setSelectedDayId(day.id)}
      activeOpacity={0.8}
    >
      <Text style={[styles.dayPillText, isActive && styles.dayPillTextActive]}>
        {day.title}
      </Text>
    </TouchableOpacity>
  );

  const renderFlightCard = (flight: any) => (
    <View key={flight.id} style={styles.bookingCard}>
      {/* Top Row */}
      <View style={styles.flightTopRow}>
        <Text style={styles.flightRoute}>{flight.route}</Text>
        <Text style={styles.flightAirline}>{flight.airline}</Text>
      </View>
      
      {/* Divider */}
      <View style={styles.flightDivider} />
      
      {/* Middle Row - Flight Rail */}
      <View style={styles.flightRail}>
        <View style={styles.flightBlock}>
          <Text style={styles.flightTime}>{flight.departure.time}</Text>
          <Text style={styles.flightLocation}>{flight.departure.location}</Text>
        </View>
        
        <View style={styles.flightCenter}>
          <Text style={styles.flightDuration}>{flight.duration}</Text>
        </View>
        
        <View style={styles.flightBlock}>
          <Text style={styles.flightTime}>{flight.arrival.time}</Text>
          <Text style={styles.flightLocation}>{flight.arrival.location}</Text>
        </View>
      </View>
      
      {/* Details */}
      <Text style={styles.flightDetails}>{flight.details}</Text>
      
      {/* Bottom Buttons */}
      <View style={styles.flightButtons}>
        <TouchableOpacity style={styles.circularButton}>
          <Ionicons name="open-outline" size={18} color="#CBB88C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton}>
          <Ionicons name="document-outline" size={18} color="#CBB88C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStayCard = (stay: any) => (
    <View key={stay.id} style={styles.bookingCard}>
      <View style={styles.stayContent}>
        <ImageBackground
          source={{ uri: stay.image }}
          style={styles.stayThumbnail}
          imageStyle={styles.stayThumbnailImage}
        />
        <View style={styles.stayDetails}>
          <Text style={styles.stayTitle}>{stay.name}</Text>
          <Text style={styles.staySubtext}>{stay.address}</Text>
          <Text style={styles.staySubtext}>{stay.checkin} · {stay.checkout}</Text>
          <Text style={styles.staySubtext}>{stay.platform}</Text>
        </View>
        <TouchableOpacity style={styles.circularButton}>
          <Ionicons name="open-outline" size={18} color="#CBB88C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTransportCard = (transport: any) => (
    <View key={transport.id} style={styles.bookingCard}>
      <View style={styles.transportContent}>
        <Ionicons name="car-outline" size={28} color="#CBB88C" style={styles.transportIcon} />
        <View style={styles.transportDetails}>
          <Text style={styles.transportTitle}>{transport.title}</Text>
          <Text style={styles.transportSubtext}>{transport.details}</Text>
        </View>
        <TouchableOpacity style={styles.circularButton}>
          <Ionicons name="open-outline" size={18} color="#CBB88C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExperiencesCarousel = (experiences: any[]) => {
    if (experiences.length === 0) return renderEmptyState('experiences');
    
    return (
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {experiences.map((experience, index) => (
          <View key={experience.id} style={[styles.experienceCard, index === 0 && styles.firstCard]}>
            <ImageBackground
              source={{ uri: experience.image }}
              style={styles.experienceCardImage}
              imageStyle={styles.experienceCardImageStyle}
            >
              <View style={styles.experienceCardOverlay} />
              <View style={styles.experienceCardContent}>
                <Text style={styles.experienceCardTitle}>{experience.title}</Text>
                <Text style={styles.experienceCardSubtext}>{experience.details}</Text>
                <TouchableOpacity style={styles.experienceCardButton}>
                  <Ionicons name="open-outline" size={16} color="#CBB88C" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderRestaurantsCarousel = (restaurants: any[]) => {
    if (restaurants.length === 0) return renderEmptyState('restaurants');
    
    return (
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      >
        {restaurants.map((restaurant, index) => (
          <View key={restaurant.id} style={[styles.restaurantCard, index === 0 && styles.firstCard]}>
            <ImageBackground
              source={{ uri: restaurant.image }}
              style={styles.restaurantCardImage}
              imageStyle={styles.restaurantCardImageStyle}
            >
              <View style={styles.restaurantCardOverlay} />
              <View style={styles.restaurantCardContent}>
                <Text style={styles.restaurantCardTitle}>{restaurant.name}</Text>
                <Text style={styles.restaurantCardTime}>{restaurant.time}</Text>
                <Text style={styles.restaurantCardAddress}>{restaurant.address}</Text>
                <TouchableOpacity style={styles.restaurantCardButton}>
                  <Ionicons name="open-outline" size={16} color="#CBB88C" />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderEmptyState = (section: string) => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={48} color="rgba(203,184,140,0.6)" />
      <Text style={styles.emptyStateTitle}>No plans yet.</Text>
      <Text style={styles.emptyStateSubtitle}>Add from Trip Canvas.</Text>
    </View>
  );

  const renderSection = (section: string) => {
    const data = selectedDay[section as keyof typeof selectedDay] as any[];
    const isExpanded = expandedSections[section as keyof typeof expandedSections];
    
    if (!isExpanded) return null;

    // Handle carousel sections differently
    if (section === 'experiences') {
      return renderExperiencesCarousel(data || []);
    }
    
    if (section === 'restaurants') {
      return renderRestaurantsCarousel(data || []);
    }

    // Handle regular card sections
    if (!Array.isArray(data) || data.length === 0) {
      return renderEmptyState(section);
    }

    return (
      <View style={styles.sectionContent}>
        {data.map((item: any) => {
          switch (section) {
            case 'flights':
              return renderFlightCard(item);
            case 'stays':
              return renderStayCard(item);
            case 'transport':
              return renderTransportCard(item);
            default:
              return null;
          }
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Pane */}
        <View style={styles.heroPaneContainer}>
          <ImageBackground
            source={{ uri: selectedDay.heroImage }}
            style={styles.heroPane}
            imageStyle={styles.heroPaneImage}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>{selectedDay.city}</Text>
              <Text style={styles.heroSubtitle}>Your arrangements in order.</Text>
              
              <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.heroButtonOutline}>
                  <Text style={styles.heroButtonOutlineText}>View All Cities</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.heroButtonFilled}>
                  <Text style={styles.heroButtonFilledText}>Edit Bookings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* City / Day Switcher */}
        <View style={styles.daysSwitcher}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScrollContent}
          >
            {tripData.days.map((day) => renderDayPill(day, selectedDayId === day.id))}
          </ScrollView>
        </View>

        {/* Daily Overview Header */}
        <View style={styles.dailyOverview}>
          <Text style={styles.dailyTitle}>{selectedDay.title}</Text>
          <Text style={styles.dailySubtitle}>{selectedDay.subtitle}</Text>
          <View style={styles.dailyDivider} />
        </View>

        {/* Booking Categories - Editorial Layout */}
        <View style={styles.categoriesContainer}>
          {/* Flights */}
          <View style={styles.categorySection}>
            {renderSectionHeader('flights', '✈️ Flights')}
            {renderSection('flights')}
          </View>

          {/* Stays */}
          <View style={styles.categorySection}>
            {renderSectionHeader('stays', '🏨 Stays')}
            {renderSection('stays')}
          </View>

          {/* Transport */}
          <View style={styles.categorySection}>
            {renderSectionHeader('transport', '🚗 Transport')}
            {renderSection('transport')}
          </View>

          {/* Experiences */}
          <View style={styles.categorySection}>
            {renderSectionHeader('experiences', '🎟️ Experiences')}
            {renderSection('experiences')}
          </View>

          {/* Restaurants */}
          <View style={styles.categorySection}>
            {renderSectionHeader('restaurants', '🍽️ Dining')}
            {renderSection('restaurants')}
          </View>
        </View>

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
            onPress={() => router.push('/canvas')}
            activeOpacity={0.8}
          >
            <Ionicons name="brush-outline" size={22} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
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
            <Text style={styles.dockLabelActive}>Bookings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Deep onyx with subtle gold gradient
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at bottom right, rgba(203,184,140,0.06), transparent 50%), #0A0A0A',
      },
    }),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Account for bottom navigation
  },

  // Hero Pane (Top)
  heroPaneContainer: {
    height: 260,
    marginHorizontal: 0,
  },
  heroPane: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroPaneImage: {
    // No additional styling needed
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%', // Bottom 40% fade
    backgroundColor: 'rgba(0,0,0,0.55)',
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
    fontSize: 28, // Playfair Display Bold 28pt
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  heroSubtitle: {
    fontSize: 13, // Inter Italic 13pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.7)', // Gold 70%
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  heroButtonOutline: {
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
  heroButtonOutlineText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  heroButtonFilled: {
    height: 42,
    paddingHorizontal: 20,
    borderRadius: 21,
    backgroundColor: 'rgba(203,184,140,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonFilledText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(10,10,10,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // City / Day Switcher
  daysSwitcher: {
    paddingVertical: 20,
  },
  daysScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  dayPill: {
    height: 34, // 34pt height
    paddingHorizontal: 16,
    borderRadius: 18, // radius 18pt
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.2)', // Frosted outline
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(15px)',
      },
    }),
  },
  dayPillActive: {
    backgroundColor: 'rgba(203,184,140,0.9)', // Filled gold
    borderColor: 'rgba(203,184,140,0.9)',
  },
  dayPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.8)',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  dayPillTextActive: {
    color: 'rgba(10,10,10,0.9)', // White text on active
  },

  // Daily Overview
  dailyOverview: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  dailyTitle: {
    fontSize: 22, // Playfair Display Semibold 22pt
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 6,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  dailySubtitle: {
    fontSize: 14, // Inter Italic 14pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.7)', // Gold 70%
    marginBottom: 16,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  dailyDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.25)', // 1px fade line gold 25%
  },

  // Categories Container
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 24, // 24pt padding between major sections
  },
  categorySection: {
    marginBottom: 16,
  },

  // Section Header Capsule
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48, // 48pt height
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.04)', // Editorial minimalism
    borderRadius: 18, // corner 18pt
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.15)', // 1px solid gold 15%
    marginBottom: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 1px rgba(255,255,255,0.08)', // Soft inner shadow
      },
      default: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
        elevation: 1,
      },
    }),
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600', // Inter Medium
    color: 'rgba(255,255,255,0.9)', // White 90%
    flex: 1,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  statusChip: {
    backgroundColor: 'rgba(203,184,140,0.12)', // Capsule fill
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12, // Inter Medium 12pt
    fontWeight: '500',
    color: 'rgba(203,184,140,0.8)', // Gold text
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter', 
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  chevronIcon: {
    opacity: 0.8,
  },

  // Section Content
  sectionContent: {
    gap: 16, // 16pt spacing between cards (magazine panel spacing)
  },

  // Booking Card Base - Magazine Panel Style
  bookingCard: {
    minHeight: 130,
    padding: 16, // 16pt padding
    backgroundColor: 'rgba(255,255,255,0.07)', // Frosted glass
    borderRadius: 24, // Corner radius 24pt
    borderWidth: 0, // No borders - just light and hierarchy
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 0 1px rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.25)', // Inner + outer glow
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

  // Horizontal Carousels for Experiences and Restaurants
  carouselContainer: {
    paddingRight: 24, // Allow scroll past edge
  },
  firstCard: {
    marginLeft: 0,
  },

  // Flight Card Styles
  flightTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightRoute: {
    fontSize: 20,
    fontWeight: '600', // Playfair Display Semibold
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3, // Monospaced tracking
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  flightAirline: {
    fontSize: 13,
    fontWeight: '500', // Inter Medium
    color: 'rgba(203,184,140,0.8)', // Gold 80%
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightDivider: {
    height: 0.5,
    backgroundColor: 'rgba(203,184,140,0.25)',
    marginBottom: 12,
  },
  flightRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  flightBlock: {
    flex: 1,
  },
  flightTime: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightCenter: {
    backgroundColor: 'rgba(203,184,140,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  flightDuration: {
    fontSize: 12,
    fontWeight: '500', // Inter Medium
    color: 'rgba(203,184,140,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightDetails: {
    fontSize: 11,
    fontWeight: '400', // Inter Regular
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  flightButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },

  // Stay Card Styles
  stayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stayThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  stayThumbnailImage: {
    borderRadius: 16,
  },
  stayDetails: {
    flex: 1,
  },
  stayTitle: {
    fontSize: 17,
    fontWeight: '600', // Playfair equivalent
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  staySubtext: {
    fontSize: 13,
    fontWeight: '400', // Inter Regular
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Transport Card Styles
  transportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transportIcon: {
    opacity: 0.8,
  },
  transportDetails: {
    flex: 1,
  },
  transportTitle: {
    fontSize: 14,
    fontWeight: '500', // Inter Medium
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  transportSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Experience Card Styles
  experienceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  experiencePhoto: {
    width: 120, // 40% width
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  experiencePhotoImage: {
    borderRadius: 16,
  },
  experienceDetails: {
    flex: 1,
  },
  experienceTitle: {
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
  experienceSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  experienceIcon: {
    alignSelf: 'flex-start',
  },

  // Restaurant Card Styles
  restaurantContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  restaurantThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
  },
  restaurantThumbnailImage: {
    borderRadius: 16,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantTitle: {
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
  restaurantTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.8)',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  restaurantSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  restaurantCapsule: {
    backgroundColor: 'rgba(203,184,140,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  restaurantStatus: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Circular Button (shared)
  circularButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(203,184,140,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)',
  },

  // Experience Cards (Horizontal Carousel) - 150×180 px
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
    height: 80, // Gradient overlay
    backgroundColor: 'rgba(0,0,0,0.35)',
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
  experienceCardSubtext: {
    fontSize: 13, // Inter 13pt gold 70%
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

  // Restaurant Cards (Horizontal Carousel)
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
    backgroundColor: 'rgba(0,0,0,0.35)',
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

  // Empty State (Frosted placeholder 120pt height)
  emptyState: {
    height: 120, // 120pt height as specified
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    marginTop: 8,
  },
  emptyStateTitle: {
    fontSize: 14, // Inter Regular 14pt white 70%
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  emptyStateSubtitle: {
    fontSize: 13, // Inter Italic 13pt gold 70%
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.7)',
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
    paddingBottom: Platform.select({ ios: 20, default: 0 }), // Account for iOS home indicator
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
    height: 40,
  },
});