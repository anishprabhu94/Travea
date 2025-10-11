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

// Multi-day trip data structure - "The Trip, Materialized"
const tripData = {
  tripName: 'Amalfi Coast',
  heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
  days: [
    {
      id: 'day1',
      title: 'Day 1 · Rome → Amalfi',
      subtitle: 'Dawn departure to coastal dreams.',
      city: 'Amalfi',
      heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
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
        },
        {
          id: '2',
          title: 'Villa Cimbrone Gardens',
          details: 'Views from infinity',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
          status: 'saved'
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
      id: 'day2',
      title: 'Day 2 · Ravello',
      subtitle: 'Walks through lemon air.',
      city: 'Ravello',
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
      id: 'day3',
      title: 'Day 3 · Capri',
      subtitle: 'Blue grotto and endless views.',
      city: 'Capri',
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
  ]
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

  const renderExperienceCard = (experience: any) => (
    <View key={experience.id} style={styles.bookingCard}>
      <View style={styles.experienceContent}>
        <ImageBackground
          source={{ uri: experience.image }}
          style={styles.experiencePhoto}
          imageStyle={styles.experiencePhotoImage}
        />
        <View style={styles.experienceDetails}>
          <Text style={styles.experienceTitle}>{experience.title}</Text>
          <Text style={styles.experienceSubtext}>{experience.details}</Text>
          <View style={styles.experienceIcon}>
            <Ionicons name="ticket-outline" size={16} color="#CBB88C" />
          </View>
        </View>
        <TouchableOpacity style={styles.circularButton}>
          <Ionicons name="open-outline" size={18} color="#CBB88C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRestaurantCard = (restaurant: any) => (
    <View key={restaurant.id} style={styles.bookingCard}>
      <View style={styles.restaurantContent}>
        <ImageBackground
          source={{ uri: restaurant.image }}
          style={styles.restaurantThumbnail}
          imageStyle={styles.restaurantThumbnailImage}
        />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
          <Text style={styles.restaurantTime}>{restaurant.time}</Text>
          <Text style={styles.restaurantSubtext}>{restaurant.address}</Text>
          <View style={styles.restaurantCapsule}>
            <Text style={styles.restaurantStatus}>Booked</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.circularButton}>
          <Ionicons name="open-outline" size={18} color="#CBB88C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSection = (section: string) => {
    const data = bookingData[section as keyof typeof bookingData];
    const isExpanded = expandedSections[section as keyof typeof expandedSections];
    
    if (!isExpanded) return null;

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name={sectionIcons[section as keyof typeof sectionIcons] as any} size={48} color="#CBB88C" />
          <Text style={styles.emptyStateTitle}>Nothing booked yet.</Text>
          <Text style={styles.emptyStateSubtitle}>Add details from your Trip Canvas.</Text>
        </View>
      );
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
            case 'experiences':
              return renderExperienceCard(item);
            case 'restaurants':
              return renderRestaurantCard(item);
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
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Bookings in {bookingData.city}</Text>
          <Text style={styles.headerSubtitle}>Your plans, curated and confirmed.</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* Booking Sections */}
        {Object.keys(sectionLabels).map((section) => (
          <View key={section} style={styles.section}>
            {renderSectionHeader(section)}
            {renderSection(section)}
          </View>
        ))}

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
            <Ionicons name="bookmark" size={22} color="#CBB88C" />
            <Text style={styles.dockLabelActive}>My Trips</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dockItem} activeOpacity={0.8}>
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
    backgroundColor: '#0A0A0A', // Deep onyx
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Account for bottom navigation
  },

  // Header Section
  header: {
    paddingTop: 28,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700', // Playfair Display Bold equivalent
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.7)', // Gold 70% opacity
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  headerDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.3)', // Gold 30% opacity
  },

  // Section Styles
  section: {
    marginHorizontal: 20,
    marginBottom: 20, // 20px vertical rhythm
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)',
    marginBottom: 14,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600', // Inter Semibold
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  statusChip: {
    backgroundColor: 'rgba(203,184,140,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500', // Inter Medium
    color: 'rgba(203,184,140,0.8)',
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
    gap: 14, // 14px spacing between cards
  },

  // Booking Card Base
  bookingCard: {
    minHeight: 130, // 130-150px auto-adjust
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22, // 22pt
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.18)', // Subtle gold stroke
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
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

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 22,
    marginTop: 8,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '400', // Inter Regular
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
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
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