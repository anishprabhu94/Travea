import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TraveaWordmark from '../components/TraveaWordmark';
import { useTrips, TripStatus } from '../contexts/TripsContext';

export default function MyTripsPage() {
  const router = useRouter();
  const { trips, getFilteredTrips, refreshTripStatuses } = useTrips();
  const [selectedStatus, setSelectedStatus] = useState<TripStatus>('Planning');
  const [showDropdown, setShowDropdown] = useState(false);

  const statusOptions: TripStatus[] = ['Planning', 'Upcoming', 'Ongoing', 'Completed'];

  // Refresh statuses when page opens
  useEffect(() => {
    refreshTripStatuses();
  }, []);

  const filteredTrips = getFilteredTrips(selectedStatus);

  // Status pill colors
  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case 'Planning': return 'rgba(201,166,91,0.3)';
      case 'Upcoming': return 'rgba(100,180,255,0.3)';
      case 'Ongoing': return 'rgba(120,200,100,0.3)';
      case 'Completed': return 'rgba(150,150,150,0.3)';
    }
  };

  const getStatusTextColor = (status: TripStatus) => {
    switch (status) {
      case 'Planning': return '#C9A65B';
      case 'Upcoming': return '#64B4FF';
      case 'Ongoing': return '#78C864';
      case 'Completed': return '#999999';
    }
  };

  const formatDateRange = (startMonth: string, startDay: number, endMonth: string, endDay: number) => {
    return `${startMonth.substring(0, 3)} ${startDay} – ${endMonth.substring(0, 3)} ${endDay}`;
  };

  const renderTripCard = (trip: any) => {
    const cityCodes = trip.cities.map((c: any) => c.code).join(', ');
    const dateRange = formatDateRange(trip.startMonth, trip.startDay, trip.endMonth, trip.endDay);
    
    return (
      <TouchableOpacity
        key={trip.id}
        style={styles.tripCard}
        onPress={() => router.push(`/bookings?tripId=${trip.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.tripCardHeader}>
          <Text style={styles.tripTitle}>{trip.title}</Text>
          <View style={[styles.statusPill, { backgroundColor: getStatusColor(trip.status) }]}>
            <Text style={[styles.statusText, { color: getStatusTextColor(trip.status) }]}>
              {trip.status}
            </Text>
          </View>
        </View>

        <View style={styles.tripCardDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color="rgba(214,193,152,0.7)" />
            <Text style={styles.detailText}>{dateRange}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={14} color="rgba(214,193,152,0.7)" />
            <Text style={styles.detailText}>{trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</Text>
          </View>
          
          {cityCodes && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={14} color="rgba(214,193,152,0.7)" />
              <Text style={styles.detailText}>{cityCodes}</Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${trip.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{trip.progress}% Complete</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    const messages: { [key in TripStatus]: string } = {
      'Planning': 'No trips in planning. Start planning your next journey from saved destinations.',
      'Upcoming': 'No upcoming trips. Complete your planning to see trips here.',
      'Ongoing': 'No trips currently ongoing.',
      'Completed': 'No completed trips yet. Your travel history will appear here.'
    };

    return (
      <View style={styles.emptyState}>
        <Ionicons name="airplane-outline" size={48} color="rgba(214,193,152,0.3)" />
        <Text style={styles.emptyText}>{messages[selectedStatus]}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="rgba(214,193,152,0.9)" />
        </TouchableOpacity>
        
        <TraveaWordmark width={120} height={32} fill="#D6C198" />
      </View>

      {/* Page Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.pageTitle}>My Trips</Text>
        <Text style={styles.pageSubtitle}>Manage your travel itineraries</Text>
      </View>

      {/* Status Filter Dropdown */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>FILTER BY STATUS</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowDropdown(!showDropdown)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownText}>{selectedStatus}</Text>
          <Ionicons 
            name={showDropdown ? "chevron-up" : "chevron-down"} 
            size={18} 
            color="rgba(214,193,152,0.7)" 
          />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownMenu}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.dropdownOption}
                onPress={() => {
                  setSelectedStatus(status);
                  setShowDropdown(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dropdownOptionText,
                  selectedStatus === status && styles.dropdownOptionTextActive
                ]}>
                  {status}
                </Text>
                {selectedStatus === status && (
                  <Ionicons name="checkmark" size={18} color="#C9A65B" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Trip Cards */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => renderTripCard(trip))
        ) : (
          renderEmptyState()
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.select({ ios: 60, android: 40, web: 20 }),
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: 'rgba(214,193,152,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    zIndex: 100,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.6)',
    letterSpacing: 1.2,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.2)',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 15,
    color: 'rgba(245,240,230,0.9)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dropdownMenu: {
    position: 'absolute',
    top: 72,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(20,20,20,0.98)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
    zIndex: 200,
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
      },
    }),
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(214,193,152,0.1)',
  },
  dropdownOptionText: {
    fontSize: 15,
    color: 'rgba(245,240,230,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dropdownOptionTextActive: {
    color: '#C9A65B',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  tripCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    padding: 18,
    marginBottom: 16,
  },
  tripCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tripTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    marginRight: 12,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  tripCardDetails: {
    gap: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: 'rgba(214,193,152,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(214,193,152,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#C9A65B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: 'rgba(214,193,152,0.7)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(214,193,152,0.6)',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 280,
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
});
