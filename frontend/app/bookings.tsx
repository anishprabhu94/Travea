import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Modal,
  TextInput,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { useTripCanvas } from '../contexts/TripCanvasContext';
import { useTrips } from '../contexts/TripsContext';
import { useStayBooking } from '../contexts/StayBookingContext';
import { useExperienceBooking } from '../contexts/ExperienceBookingContext';
import { useRestaurantBooking } from '../contexts/RestaurantBookingContext';
import { useTransportBooking } from '../contexts/TransportBookingContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// "Frosted Editorial System v3" - Luxury Travel Chronicle
const tripData = {
  tripName: 'Summer in Italy',
  subtitle: 'June 8–15 · 2 Travelers',
  status: 'Planning',
  heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
  cities: ['FLR', 'ROM', 'VCE', 'AML'],
  
  days: [
    {
      id: 'day1-2',
      label: 'Day 1–2',
      city: 'Florence, Italy',
      cityCode: 'FLR',
      dates: 'Jun 8–9',
      description: 'Renaissance art meets Tuscan charm.',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      // Mock booking status for Phase A
      mockBookingStatus: {
        flights: 'Booked',
        stays: 'Booked',
        transport: 'Booked'
      },
      flights: [
        {
          id: '1',
          traveler: 'Traveler 1',
          date: 'Jun 8',
          route: 'FCO → NAP',
          airline: 'ITA AZ 1234',
          time: '09:40 – 10:45 · 1h 05m Nonstop',
          details: 'T3 Gate C12',
        },
        {
          id: '1b',
          traveler: 'Traveler 2',
          date: 'Jun 8',
          route: 'FCO → NAP',
          airline: 'ITA AZ 1234',
          time: '09:40 – 10:45 · 1h 05m Nonstop',
          details: 'T3 Gate C12',
        }
      ],
      stays: [
        {
          id: '1',
          name: 'Hotel Onda Blu',
          address: 'Via Tragara 21',
          dates: 'Jun 8–9',
          checkin: 'Check-in 3 PM',
          checkout: 'Check-out 11 AM',
          platform: 'via Booking.com',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      transport: [
        {
          id: '1',
          type: 'rental-car',
          title: 'Alfa Romeo Giulia',
          date: 'Jun 8-11',
          time: '10:00 AM',
          route: 'Florence → Tuscany',
          duration: '3 days · Rental',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
        },
        {
          id: '2',
          type: 'train',
          title: 'Frecciarossa 1000',
          date: 'Jun 9',
          time: '2:15 PM',
          route: 'Florence → Rome',
          duration: '1h 36 min · Train',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        },
        {
          id: '3',
          type: 'bus',
          title: 'FlixBus Premium',
          date: 'Jun 9',
          time: '9:00 AM',
          route: 'Rome → Naples',
          duration: '2h 30 min · Bus',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        },
        {
          id: '4',
          type: 'ferry',
          title: 'Capri Express',
          date: 'Jun 9',
          time: '10:30 AM',
          route: 'Amalfi → Capri',
          duration: '1h 15m · Ferry',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ],
      experiences: [
        {
          id: '1',
          title: 'Lemon Grove Walk',
          date: 'Jun 8',
          startTime: '10:00 AM',
          duration: '2 hrs',
          location: 'Ravello',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        },
        {
          id: '2',
          title: 'Cooking Class at Nonna',
          date: 'Jun 9',
          startTime: '3:00 PM',
          duration: '3 hrs',
          location: 'Amalfi',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      restaurants: [
        {
          id: '1',
          name: 'Trattoria del Mare',
          date: 'Jun 8',
          time: 'Dinner 7:30 PM',
          details: 'Sea View',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        },
        {
          id: '2',
          name: 'La Caravella Ristorante',
          date: 'Jun 9',
          time: 'Lunch 12:00 PM',
          details: 'Michelin Star',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
        }
      ]
    },
    {
      id: 'day3-4',
      label: 'Day 3–4',
      city: 'Rome, Italy',
      cityCode: 'ROM',
      dates: 'Jun 10–11',
      description: 'Eternal city of ancient wonders.',
      heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      // Mock booking status for Phase A
      mockBookingStatus: {
        flights: 'Pending',
        stays: 'Booked',
        transport: 'Booked'
      },
      flights: [],
      stays: [
        {
          id: '2',
          name: 'Villa San Michele',
          address: 'Via Capodimonte 14',
          dates: 'Jun 10–11',
          checkin: 'Check-in 2 PM',
          checkout: 'Check-out 12 PM',
          platform: 'via Relais & Châteaux',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
        }
      ],
      transport: [
        {
          id: '3',
          type: 'car',
          title: 'Mountain Road Transfer',
          date: 'Jun 10',
          time: '11 AM',
          route: 'Amalfi → Ravello Hills',
          duration: '30 min · Car',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
        }
      ],
      experiences: [
        {
          id: '3',
          title: 'Limoncello Tasting',
          date: 'Jun 11',
          details: '1 hr · Local estate',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      restaurants: [
        {
          id: '3',
          name: 'Ristorante Rossellinis',
          date: 'Jun 11',
          time: 'Dinner 8:00 PM',
          details: 'Michelin Star',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ]
    },
    {
      id: 'day5-6',
      label: 'Day 5–6',
      city: 'Venice, Italy',
      cityCode: 'VCE',
      dates: 'Jun 12–13',
      description: 'Floating city of romance & canals.',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      // Mock booking status for Phase A
      mockBookingStatus: {
        flights: 'Pending',
        stays: 'Pending',
        transport: 'N/A'
      },
      flights: [
        {
          id: '2',
          traveler: 'Traveler 1',
          date: 'Jun 14',
          route: 'NAP → FCO',
          airline: 'ITA AZ 5678',
          time: '16:00 – 17:10 · 1h 10m Nonstop',
          details: 'T1 Gate B8 · 1 Checked · Seat 14F',
        },
        {
          id: '2b',
          traveler: 'Traveler 2',
          date: 'Jun 14',
          route: 'NAP → FCO',
          airline: 'ITA AZ 5678',
          time: '16:00 – 17:10 · 1h 10m Nonstop',
          details: 'T1 Gate B8',
        }
      ],
      stays: [
        {
          id: '3',
          name: 'Hotel La Palma',
          address: 'Via V. Emanuele 39',
          dates: 'Jun 12–14',
          checkin: 'Check-in 2 PM',
          checkout: 'Check-out 11 AM',
          platform: 'via Hotels.com',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
        }
      ],
      transport: [],
      experiences: [
        {
          id: '4',
          title: 'Blue Grotto Tour',
          date: 'Jun 13',
          details: '3 hrs · Boat excursion',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      restaurants: [
        {
          id: '4',
          name: 'Aurora Ristorante',
          date: 'Jun 12',
          time: 'Lunch 1:00 PM',
          details: 'Piazzetta View',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ]
    },
    {
      id: 'day6-8',
      label: 'Day 6–8',
      city: 'Amalfi, Italy',
      cityCode: 'AML',
      dates: 'Jun 14–16',
      description: 'Coastal paradise & azure waters.',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      // Mock booking status for Phase A
      mockBookingStatus: {
        flights: 'Pending',
        stays: 'Pending',
        transport: 'Pending'
      },
      flights: [],
      stays: [
        {
          id: '4',
          name: 'Hotel Santa Caterina',
          address: 'Via Mauro Comite 9',
          dates: 'Jun 14–16',
          checkin: 'Check-in 2 PM',
          checkout: 'Check-out 11 AM',
          platform: 'via Booking.com',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      transport: [],
      experiences: [
        {
          id: '5',
          title: 'Coastal Boat Tour',
          date: 'Jun 15',
          startTime: '9:00 AM',
          duration: '4 hrs',
          location: 'Amalfi Coast',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      restaurants: [
        {
          id: '5',
          name: 'Ristorante Marina Grande',
          date: 'Jun 14',
          time: 'Dinner 7:30 PM',
          details: 'Seafront Dining',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ]
    }
  ],
  
  summary: {
    title: 'Journey Completed.',
    subtitle: 'June 8–14 · 4 Cities · 7 Days',
    stats: {
      flights: 2,
      nights: 6,
      transfers: 3,
      experiences: 5,
      restaurants: 8
    },
    reflection: 'From Rome\'s hum to Amalfi\'s hush, your journey was a tapestry of motion and stillness. Every moment — planned or found — now lives here.',
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  }
};

// Available cities (from landing page)
const AVAILABLE_CITIES = [
  { code: 'FLR', name: 'Florence', region: 'Italy' },
  { code: 'ROM', name: 'Rome', region: 'Italy' },
  { code: 'VCE', name: 'Venice', region: 'Italy' },
  { code: 'AML', name: 'Amalfi', region: 'Italy' },
  { code: 'BCN', name: 'Barcelona', region: 'Spain' },
  { code: 'LIS', name: 'Lisbon', region: 'Portugal' },
  { code: 'PRG', name: 'Prague', region: 'Czech Republic' },
  { code: 'VIE', name: 'Vienna', region: 'Austria' },
  { code: 'KYO', name: 'Kyoto', region: 'Japan' },
  { code: 'REY', name: 'Reykjavík', region: 'Iceland' },
];

export default function TripCanvas() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { trips, getTripById, getFilteredTrips, deleteTrip, updateTrip } = useTrips();
  const { getBookingsByTrip: getStayBookingsByTrip } = useStayBooking();
  const { getBookingsByTrip: getExperienceBookingsByTrip } = useExperienceBooking();
  const { getBookingsByTrip: getRestaurantBookingsByTrip } = useRestaurantBooking();
  const { getBookingsByTrip: getTransportBookingsByTrip } = useTransportBooking();
  
  // State management - ALL hooks must be called before any conditional returns
  const [activeDayId, setActiveDayId] = useState('day1-2');
  const [showEditPane, setShowEditPane] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Shake animation for city pill when dates not assigned
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };
  
  const handleBrowseStays = () => {
    const city = currentTrip.cities.find(c => c.code === activeCityCode);
    
    // Check if city has dates assigned
    if (!city || !city.startMonth || !city.endMonth) {
      triggerShake();
      return;
    }
    
    // Navigate with city dates and tripId
    router.push({
      pathname: '/stay-browsing',
      params: {
        tripId: currentTrip.id,
        city: city.name || activeCityCode,
        cityCode: activeCityCode,
        startMonth: city.startMonth,
        startDay: city.startDay.toString(),
        endMonth: city.endMonth,
        endDay: city.endDay.toString(),
      }
    });
  };
  
  // Edit pane state
  const [editableTripName, setEditableTripName] = useState('');
  const [tripStartMonth, setTripStartMonth] = useState('');
  const [tripStartDay, setTripStartDay] = useState(0);
  const [tripEndMonth, setTripEndMonth] = useState('');
  const [tripEndDay, setTripEndDay] = useState(0);
  const [editableTravelers, setEditableTravelers] = useState(2);
  const [editableCities, setEditableCities] = useState<string[]>([]);
  const [cityDates, setCityDates] = useState<{[key: string]: {startMonth: string, startDay: number, endMonth: string, endDay: number}}>({});
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showMonthPicker, setShowMonthPicker] = useState<{type: 'start' | 'end' | null, cityIndex?: number}>({type: null});
  const [showDayPicker, setShowDayPicker] = useState<{type: 'start' | 'end' | null, cityIndex?: number}>({type: null});
  const [tripChangeMessage, setTripChangeMessage] = useState('');
  const [hasUsedAssignAll, setHasUsedAssignAll] = useState(false);
  
  // Flight input states
  const [flightNumber, setFlightNumber] = useState('');
  const [dayFlights, setDayFlights] = useState<{[key: string]: any[]}>({}); // Store flights per day
  
  const prevTripDates = React.useRef({ startMonth: tripStartMonth, startDay: tripStartDay, endMonth: tripEndMonth, endDay: tripEndDay });
  
  // Calculate progress based on mock booking status (Phase A)
  const calculateMockProgress = () => {
    if (!tripData.days || tripData.days.length === 0) return 0;
    
    // Count cities that are fully booked (all sections = "Booked")
    const bookedCities = tripData.days.filter(day => {
      const { flights, stays, transport } = day.mockBookingStatus || {};
      
      // A city is considered booked when:
      // - Flights: Booked (if applicable)
      // - Stays: Booked (always required)
      // - Transport: Booked or N/A
      
      const flightsReady = flights === 'Booked' || flights === 'N/A';
      const staysReady = stays === 'Booked';
      const transportReady = transport === 'Booked' || transport === 'N/A';
      
      return flightsReady && staysReady && transportReady;
    }).length;
    
    return Math.round((bookedCities / tripData.days.length) * 100);
  };
  
  // Determine which trip to show
  const getTripToDisplay = () => {
    // If tripId in URL, use that
    if (params.tripId && typeof params.tripId === 'string') {
      const trip = getTripById(params.tripId);
      if (trip) return trip;
    }
    
    // Otherwise, show most recent Planning trip
    const planningTrips = getFilteredTrips('Planning');
    if (planningTrips.length > 0) {
      return planningTrips[0]; // Most recent
    }
    
    // Fallback to most recent Upcoming trip
    const upcomingTrips = getFilteredTrips('Upcoming');
    if (upcomingTrips.length > 0) {
      return upcomingTrips[0];
    }
    
    return null;
  };
  
  const currentTrip = getTripToDisplay();
  
  // Get number of travelers from trip data
  const numberOfTravelers = currentTrip?.travelers || 2;
  
  // Calculate flight status based on number of travelers
  const calculateFlightStatus = (flights: any[]) => {
    if (flights.length === 0) return 'Pending';
    if (flights.length >= numberOfTravelers) return 'Booked';
    return 'Pending';
  };
  
  // Add flight function
  const handleAddFlight = (dayId: string, activeCityFirstDate: string) => {
    if (!flightNumber.trim()) return;
    
    // Mock flight data - in real app, this would call an API
    const newFlight = {
      id: Date.now().toString(),
      traveler: `Traveler ${(dayFlights[dayId]?.length || 0) + 1}`,
      date: activeCityFirstDate,
      route: 'JFK → FCO', // Mock data
      airline: flightNumber.toUpperCase(),
      time: '22:00 – 06:30 · 8h 30m Nonstop', // Mock data - military time
      details: 'T1 Gate B12', // Mock data
    };
    
    setDayFlights(prev => ({
      ...prev,
      [dayId]: [...(prev[dayId] || []), newFlight]
    }));
    
    setFlightNumber('');
  };
  
  // Load trip data into edit state when opening edit pane
  useEffect(() => {
    if (currentTrip && showEditPane) {
      // Use circuitTitle for multi-city trips, otherwise use regular title
      setEditableTripName(currentTrip.circuitTitle || currentTrip.title);
      setTripStartMonth(currentTrip.startMonth);
      setTripStartDay(currentTrip.startDay);
      setTripEndMonth(currentTrip.endMonth);
      setTripEndDay(currentTrip.endDay);
      setEditableTravelers(currentTrip.travelers);
      setEditableCities(currentTrip.cities.map(c => c.code));
      
      // Load existing city dates if they exist
      const existingCityDates: { [key: string]: any } = {};
      currentTrip.cities.forEach(city => {
        if (city.startMonth && city.endMonth) {
          existingCityDates[city.code] = {
            startMonth: city.startMonth,
            startDay: city.startDay,
            endMonth: city.endMonth,
            endDay: city.endDay,
          };
        }
      });
      setCityDates(existingCityDates);
    }
  }, [showEditPane, currentTrip]);
  
  // When trip dates change, clear all city dates
  React.useEffect(() => {
    const prev = prevTripDates.current;
    if (prev.startMonth !== tripStartMonth || prev.startDay !== tripStartDay || 
        prev.endMonth !== tripEndMonth || prev.endDay !== tripEndDay) {
      
      // Clear all city dates
      setCityDates({});
      setTripChangeMessage('Trip updated. City dates cleared.');
      setTimeout(() => setTripChangeMessage(''), 4000);
      
      // Update ref
      prevTripDates.current = { startMonth: tripStartMonth, startDay: tripStartDay, endMonth: tripEndMonth, endDay: tripEndDay };
    }
  }, [tripStartMonth, tripStartDay, tripEndMonth, tripEndDay]);
  
  // Helper: Get status pill colors
  const getStatusGradientColors = (status: string) => {
    switch (status) {
      case 'Planning': 
        return ['rgba(217,189,120,0.25)', 'rgba(217,189,120,0.05)'];
      case 'Upcoming': 
        return ['rgba(236,230,195,0.35)', 'rgba(255,255,255,0.1)'];
      case 'Ongoing': 
        return ['rgba(168,215,198,0.25)', 'rgba(90,144,127,0.1)'];
      case 'Completed': 
        return ['rgba(160,160,160,0.2)', 'rgba(100,100,100,0.05)'];
      default: 
        return ['rgba(217,189,120,0.25)', 'rgba(217,189,120,0.05)'];
    }
  };
  
  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Planning': return '#F5DFA2';
      case 'Upcoming': return '#FFFBEA';
      case 'Ongoing': return '#E9F4ED';
      case 'Completed': return '#DCDCDC';
      default: return '#F5DFA2';
    }
  };
  
  // Helper functions for booking status icon colors
  const getBookingIconColor = (bookingStatus: string) => {
    switch (bookingStatus) {
      case 'Booked': return '#FFFBEA'; // Ivory white
      case 'Pending': return 'rgba(227,181,122,0.6)'; // Muted amber at 60%
      case 'N/A': return 'rgba(255,255,255,0.25)'; // Desaturated white
      default: return 'rgba(255,255,255,0.3)';
    }
  };
  
  const getBookingLabelOpacity = (bookingStatus: string) => {
    switch (bookingStatus) {
      case 'Booked': return 0.9;
      case 'Pending': return 0.6;
      case 'N/A': return 0.4;
      default: return 0.7;
    }
  };
  
  const getBookingIconGlow = (bookingStatus: string) => {
    if (bookingStatus === 'Booked') {
      return {
        shadowColor: '#FFDC96',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      };
    }
    return {};
  };
  
  // Handle save changes - Update trip with edited data
  const handleSaveChanges = () => {
    if (!currentTrip || !canSave()) return;
    
    // Update cities with assigned dates from cityDates state
    const updatedCities = editableCities.map(cityCode => {
      const existingCity = currentTrip.cities.find(c => c.code === cityCode);
      const cityDate = cityDates[cityCode];
      
      // Preserve all city data, just update dates if assigned
      if (existingCity) {
        return {
          ...existingCity,
          ...(cityDate && cityDate.startMonth && cityDate.endMonth ? {
            startMonth: cityDate.startMonth,
            startDay: cityDate.startDay,
            endMonth: cityDate.endMonth,
            endDay: cityDate.endDay,
          } : {
            startMonth: existingCity.startMonth || '',
            startDay: existingCity.startDay || 0,
            endMonth: existingCity.endMonth || '',
            endDay: existingCity.endDay || 0,
          }),
        };
      } else {
        // New city being added - extract name from AVAILABLE_CITIES or use code
        const cityInfo = AVAILABLE_CITIES.find(c => c.code === cityCode);
        return {
          code: cityCode,
          name: cityInfo?.name || cityCode,
          startMonth: cityDate?.startMonth || '',
          startDay: cityDate?.startDay || 0,
          endMonth: cityDate?.endMonth || '',
          endDay: cityDate?.endDay || 0,
          status: 'Pending' as const,
          bookings: {
            flights: 'Pending' as const,
            stays: 'Pending' as const,
            transport: 'Pending' as const
          }
        };
      }
    });
    
    // Create updated trip object
    const updatedTrip = {
      ...currentTrip,
      title: editableTripName,
      // If trip has circuitTitle (multi-city), update that too
      ...(currentTrip.circuitTitle ? { circuitTitle: editableTripName } : {}),
      startMonth: tripStartMonth,
      startDay: tripStartDay,
      endMonth: tripEndMonth,
      endDay: tripEndDay,
      travelers: editableTravelers,
      cities: updatedCities,
    };
    
    // Update in context
    updateTrip(currentTrip.id, updatedTrip);
    
    // Close edit pane
    setShowEditPane(false);
  };
  
  // Handle delete trip
  const handleDeleteTrip = async () => {
    if (currentTrip) {
      console.log('Deleting trip:', currentTrip.id);
      deleteTrip(currentTrip.id);
      setShowDeleteModal(false);
      setShowEditPane(false);
      // Small delay to ensure context updates
      setTimeout(() => {
        router.push('/trips');
      }, 100);
    }
  };
  
  // If no trip exists, show empty state - AFTER all hooks
  if (!currentTrip) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="airplane-outline" size={64} color="rgba(214,193,152,0.3)" />
          <Text style={styles.emptyStateTitle}>No active trips</Text>
          <Text style={styles.emptyStateText}>Start a new journey from My Trips</Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => router.push('/trips')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyStateButtonText}>Go to My Trips</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  // Helper: Convert trip day number to readable date format (e.g., "Jun 8")
  const formatTripDay = (dayNum: number) => {
    const date = tripDayToDate(dayNum);
    return `${date.month.substring(0, 3)} ${date.day}`;
  };
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthDays = {
    'January': 31, 'February': 28, 'March': 31, 'April': 30, 'May': 31, 'June': 30,
    'July': 31, 'August': 31, 'September': 30, 'October': 31, 'November': 30, 'December': 31
  };
  
  // Helper: Convert date to day number from trip start
  const dateToTripDay = (month: string, day: number) => {
    const tripStartIdx = months.indexOf(tripStartMonth);
    const dateIdx = months.indexOf(month);
    
    let dayNum = 0;
    if (tripStartIdx === dateIdx) {
      dayNum = day - tripStartDay + 1;
    } else {
      dayNum = monthDays[tripStartMonth] - tripStartDay + 1;
      for (let i = tripStartIdx + 1; i < dateIdx; i++) {
        dayNum += monthDays[months[i]];
      }
      dayNum += day;
    }
    return dayNum;
  };
  
  // Helper: Check if date is within trip bounds
  const isDateInTripRange = (month: string, day: number) => {
    const dayNum = dateToTripDay(month, day);
    const tripDuration = getTripDuration();
    return dayNum >= 1 && dayNum <= tripDuration;
  };
  
  // Handle city reorder - Clear all city dates
  const handleCityReorder = (newOrder: string[]) => {
    setEditableCities(newOrder);
    // Clear all city dates when reordered
    setCityDates({});
    setHasUsedAssignAll(false);
    setTripChangeMessage("City order changed. All dates cleared.");
    setTimeout(() => setTripChangeMessage(''), 4000);
  };
  
  // Helper: Get inline validation message for a city (Option A Logic)
  const getCityValidationMessage = (cityCode: string, cityIndex: number) => {
    const city = cityDates[cityCode];
    
    if (!city || !city.startMonth || !city.startDay || !city.endMonth || !city.endDay) {
      return ''; // Don't validate incomplete dates
    }
    
    // Check if end is before start
    const startDay = dateToTripDay(city.startMonth, city.startDay);
    const endDay = dateToTripDay(city.endMonth, city.endDay);
    if (endDay < startDay) {
      return "End date must be the same as or after the start date.";
    }
    
    // Check if dates are within trip bounds
    if (!isDateInTripRange(city.startMonth, city.startDay) || !isDateInTripRange(city.endMonth, city.endDay)) {
      return "Choose dates inside the trip.";
    }
    
    // Check for overlaps with other cities
    for (let i = 0; i < editableCities.length; i++) {
      if (i === cityIndex) continue;
      const otherCode = editableCities[i];
      const other = cityDates[otherCode];
      if (!other || !other.startMonth || !other.endMonth) continue;
      
      const otherStart = dateToTripDay(other.startMonth, other.startDay);
      const otherEnd = dateToTripDay(other.endMonth, other.endDay);
      
      // Check if ranges overlap
      if (!(endDay < otherStart || startDay > otherEnd)) {
        return "These days are already assigned.";
      }
    }
    
    return '';
  };
  
  // Helper: Convert trip day number to month/day
  const tripDayToDate = (dayNum: number) => {
    const tripStartIdx = months.indexOf(tripStartMonth);
    let currentMonth = tripStartMonth;
    let currentDay = tripStartDay + dayNum - 1;
    
    // Adjust for month overflow
    let monthIdx = tripStartIdx;
    while (currentDay > monthDays[currentMonth]) {
      currentDay -= monthDays[currentMonth];
      monthIdx++;
      currentMonth = months[monthIdx];
    }
    
    return { month: currentMonth, day: currentDay };
  };
  
  // Assign All Logic (deterministic auto-distribution)
  const handleAssignAll = () => {
    const totalDays = getTripDuration();
    const cityCount = editableCities.length;
    
    if (cityCount === 0 || totalDays === 0) return;
    
    // Check if more cities than days
    if (cityCount > totalDays) {
      setTripChangeMessage("Not enough days for all cities. Assign manually or remove some cities.");
      setTimeout(() => setTripChangeMessage(''), 5000);
      return;
    }
    
    const base = Math.floor(totalDays / cityCount);
    const remainder = totalDays - (base * cityCount);
    
    const newCityDates: {[key: string]: {startMonth: string, startDay: number, endMonth: string, endDay: number}} = {};
    let currentDayNum = 1;
    
    editableCities.forEach((cityCode, index) => {
      // First 'remainder' cities get base + 1 days
      const daysForThisCity = index < remainder ? base + 1 : base;
      
      const startDate = tripDayToDate(currentDayNum);
      const endDate = tripDayToDate(currentDayNum + daysForThisCity - 1);
      
      newCityDates[cityCode] = {
        startMonth: startDate.month,
        startDay: startDate.day,
        endMonth: endDate.month,
        endDay: endDate.day
      };
      
      currentDayNum += daysForThisCity;
    });
    
    setCityDates(newCityDates);
    setHasUsedAssignAll(true);
    setTripChangeMessage("Days assigned evenly by list order.");
    setTimeout(() => setTripChangeMessage(''), 4000);
  };
  
  // Helper: Get available days for a city (for picker dropdowns)
  const getUnassignedDays = (cityIndex: number) => {
    const tripDuration = getTripDuration();
    const usedDays = new Set<number>();
    
    // Mark days used by other cities
    editableCities.forEach((otherCode, otherIndex) => {
      if (otherIndex === cityIndex) return;
      
      const other = cityDates[otherCode];
      if (!other || !other.startMonth || !other.endMonth) return;
      
      const otherStart = dateToTripDay(other.startMonth, other.startDay);
      const otherEnd = dateToTripDay(other.endMonth, other.endDay);
      
      for (let d = otherStart; d <= otherEnd; d++) {
        usedDays.add(d);
      }
    });
    
    return { usedDays, tripDuration };
  };
  
  // Calculate trip duration in days
  const getTripDuration = () => {
    const startIdx = months.indexOf(tripStartMonth);
    const endIdx = months.indexOf(tripEndMonth);
    if (endIdx < startIdx || (endIdx === startIdx && tripEndDay < tripStartDay)) return 0;
    
    let days = 0;
    if (startIdx === endIdx) {
      days = tripEndDay - tripStartDay + 1;
    } else {
      days = monthDays[tripStartMonth] - tripStartDay + 1;
      for (let i = startIdx + 1; i < endIdx; i++) {
        days += monthDays[months[i]];
      }
      days += tripEndDay;
    }
    return days;
  };
  
  // Calculate coverage (days assigned to cities)
  const getCoverage = () => {
    let assigned = 0;
    editableCities.forEach(cityCode => {
      const city = cityDates[cityCode];
      if (city && city.startMonth && city.startDay && city.endMonth && city.endDay) {
        const startIdx = months.indexOf(city.startMonth);
        const endIdx = months.indexOf(city.endMonth);
        if (startIdx === endIdx) {
          assigned += city.endDay - city.startDay + 1;
        } else {
          assigned += monthDays[city.startMonth] - city.startDay + 1;
          for (let i = startIdx + 1; i < endIdx; i++) {
            assigned += monthDays[months[i]];
          }
          assigned += city.endDay;
        }
      }
    });
    return assigned;
  };
  
  // Check if save should be enabled (Option A: strict - full coverage, no errors)
  const canSave = () => {
    const duration = getTripDuration();
    const coverage = getCoverage();
    
    // Must have full coverage
    if (duration === 0 || coverage !== duration) return false;
    
    // All cities must have valid dates
    if (!editableCities.every(city => {
      const dates = cityDates[city];
      return dates && dates.startMonth && dates.startDay && dates.endMonth && dates.endDay;
    })) {
      return false;
    }
    
    // No validation errors allowed
    for (let i = 0; i < editableCities.length; i++) {
      const message = getCityValidationMessage(editableCities[i], i);
      if (message) return false;
    }
    
    return true;
  };
  
  // Generate dynamic tripData.days based on currentTrip.cities
  const generateDynamicDays = () => {
    return currentTrip.cities.map((city, index) => ({
      id: `day-${index}`,
      label: `Day ${index + 1}`,
      city: city.name || city.code,
      cityCode: city.code,
      dates: city.startMonth && city.endMonth 
        ? `${city.startMonth.substring(0, 3)} ${city.startDay}–${city.endMonth.substring(0, 3)} ${city.endDay}`
        : 'Unassigned',
      description: `Discover ${city.name || city.code}`,
      heroImage: tripData.heroImage,
      mockBookingStatus: {
        flights: city.bookings?.flights || 'Pending',
        stays: city.bookings?.stays || 'Pending',
        transport: city.bookings?.transport || 'Pending'
      },
      flights: tripData.days[index]?.flights || [],
      stays: tripData.days[index]?.stays || [],
      transport: tripData.days[index]?.transport || [],
      experiences: tripData.days[index]?.experiences || [],
      dining: tripData.days[index]?.dining || [],
      restaurants: tripData.days[index]?.restaurants || []
    }));
  };
  
  const dynamicDays = generateDynamicDays();
  const activeDay = dynamicDays.find(d => d.id === activeDayId) || dynamicDays[0];
  const activeCityCode = activeDay.cityCode;
  
  // Get dynamic date range for active city from currentTrip
  const getActiveCityDateRange = () => {
    const matchingCity = currentTrip.cities.find(c => c.code === activeCityCode);
    
    if (matchingCity && matchingCity.startMonth && matchingCity.endMonth) {
      // City has assigned dates - Format as "MONTH X - MONTH Y"
      const start = `${matchingCity.startMonth.toUpperCase()} ${matchingCity.startDay}`;
      const end = `${matchingCity.endMonth.toUpperCase()} ${matchingCity.endDay}`;
      return `${start} - ${end}`;
    } else {
      // Fallback to "Unassigned"
      return 'UNASSIGNED';
    }
  };
  
  // Get first date only for experiences/restaurants
  const getActiveCityFirstDate = () => {
    const matchingCity = currentTrip.cities.find(c => c.code === activeCityCode);
    
    if (matchingCity && matchingCity.startMonth) {
      return `${matchingCity.startMonth.toUpperCase()} ${matchingCity.startDay}`;
    } else {
      return 'UNASSIGNED';
    }
  };
  
  // Get stay date range (city start to city end - 1 day for nights)
  const getActiveCityStayDates = () => {
    const matchingCity = currentTrip.cities.find(c => c.code === activeCityCode);
    
    if (matchingCity && matchingCity.startMonth && matchingCity.endMonth) {
      const start = `${matchingCity.startMonth.toUpperCase()} ${matchingCity.startDay}`;
      // Calculate end date - 1 day for nights
      let endDay = matchingCity.endDay - 1;
      let endMonth = matchingCity.endMonth;
      
      // If endDay becomes 0, move to previous month's last day
      if (endDay === 0) {
        const monthIndex = months.indexOf(matchingCity.endMonth);
        if (monthIndex > 0) {
          endMonth = months[monthIndex - 1];
          endDay = daysInMonth[endMonth];
        } else {
          // Edge case: January, go to December
          endMonth = 'December';
          endDay = 31;
        }
      }
      
      const end = `${endMonth.toUpperCase()} ${endDay}`;
      return `${start} - ${end}`;
    } else {
      return 'UNASSIGNED';
    }
  };
  
  const activeCityDateRange = getActiveCityDateRange();
  const activeCityFirstDate = getActiveCityFirstDate();
  const activeCityStayDates = getActiveCityStayDates();
  
  const statusOptions = ['Planning', 'Upcoming', 'Ongoing', 'Completed'];
  
  // Filter available cities based on search
  const filteredCities = AVAILABLE_CITIES.filter(city => 
    city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    city.region.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Hero Panel - 340px with clean background
  const renderHeroPanel = () => (
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
        
        {/* Frosted pane container for hero content */}
        <View style={styles.heroFrostedPane}>
          <View style={styles.heroTitleContainer}>
            <Text style={styles.heroTitle}>{currentTrip.circuitTitle || currentTrip.title}</Text>
          </View>
          <View style={styles.heroSubtitleRow}>
            <Text style={styles.heroSubtitle}>
              <Text style={{fontWeight: '700'}}>{currentTrip.startMonth.substring(0,3)} {currentTrip.startDay}–{currentTrip.endMonth.substring(0,3)} {currentTrip.endDay}</Text>
              {' · '}
            </Text>
            <Ionicons name="people" size={14} color="rgba(255,255,255,0.85)" style={{marginRight: 4}} />
            <Text style={styles.heroSubtitle}>
              <Text style={{fontWeight: '700'}}>{currentTrip.travelers}</Text>
            </Text>
            <TouchableOpacity 
              style={styles.editIconButton} 
              activeOpacity={0.7}
              onPress={() => setShowEditPane(true)}
            >
              <Ionicons name="create-outline" size={14} color="rgba(181,155,115,0.9)" />
            </TouchableOpacity>
          </View>
          
          {/* Status Pill - Read-only with Gradient */}
          <LinearGradient
            colors={getStatusGradientColors(currentTrip.status)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statusPill}
          >
            <Text style={[styles.statusPillText, { color: getStatusTextColor(currentTrip.status) }]}>
              {currentTrip.status}
            </Text>
          </LinearGradient>
          
          {/* Progress Bar */}
          <View style={styles.heroProgressContainer}>
            <View style={styles.heroProgressBar}>
              {/* Track Background with Gradient */}
              <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressTrack}
              />
              
              {/* Progress Fill with Gradient */}
              <LinearGradient
                colors={['#E3C47B', '#FFF5CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.heroProgressFill, { width: `${calculateMockProgress()}%` }]}
              >
                {/* Leading Edge Highlight */}
                <View style={styles.progressLeadingEdge} />
              </LinearGradient>
              
              {/* Progress Capsule */}
              {calculateMockProgress() > 0 && (
                <View style={[
                  styles.progressCapsule,
                  { 
                    left: `${Math.max(0, Math.min(calculateMockProgress() - 8, 92))}%`,
                    backgroundColor: 
                      currentTrip.status === 'Planning' ? 'rgba(227,196,123,0.2)' :
                      currentTrip.status === 'Upcoming' ? 'rgba(255,250,235,0.15)' :
                      currentTrip.status === 'Ongoing' ? 'rgba(180,230,215,0.2)' :
                      currentTrip.status === 'Completed' ? 'rgba(255,255,255,0.08)' :
                      'rgba(227,196,123,0.2)' // default to Planning
                  }
                ]}>
                  <Text style={[
                    styles.progressCapsuleText,
                    currentTrip.status === 'Completed' && styles.progressCapsuleTextCompleted
                  ]}>
                    {calculateMockProgress()}%
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* City Strip - Horizontal Scrollable Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cityStripScroll}
            contentContainerStyle={styles.cityStripContent}
          >
            {currentTrip.cities.map((city, index) => (
              <Animated.View 
                key={city.code}
                style={[
                  styles.cityCapsuleWrapper,
                  city.code === activeCityCode && {
                    transform: [{ translateX: shakeAnimation }]
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    // Find matching day for this city and set it as active
                    const matchingDay = dynamicDays.find(d => d.cityCode === city.code);
                    if (matchingDay) setActiveDayId(matchingDay.id);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.cityCapsule,
                    city.code === activeCityCode && styles.cityCapsuleActive
                  ]}>
                    <Text style={[
                      styles.cityCapsuleText,
                      city.code === activeCityCode && styles.cityCapsuleTextActive
                    ]}>
                      {city.name || city.code}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < currentTrip.cities.length - 1 && (
                  <View style={styles.cityDot} />
                )}
              </Animated.View>
            ))}
          </ScrollView>
          
          {/* Quick Status Row - Flight, Stay, Transport Icons with Gradient Effects */}
          <View style={styles.quickStatusContainer}>
            {/* Flight Status */}
            <View style={styles.quickStatusItem}>
              <View style={[
                styles.quickStatusIcon,
                activeDay.mockBookingStatus?.flights === 'Booked' && getBookingIconGlow('Booked')
              ]}>
                {activeDay.mockBookingStatus?.flights === 'Booked' && (
                  <LinearGradient
                    colors={['rgba(255,251,234,0.15)', 'rgba(201,166,91,0.15)']}
                    style={styles.quickStatusIconGradient}
                  />
                )}
                <Ionicons 
                  name="airplane-outline" 
                  size={18} 
                  color={getBookingIconColor(activeDay.mockBookingStatus?.flights || 'Pending')} 
                />
                {activeDay.mockBookingStatus?.flights === 'Pending' && (
                  <View style={styles.pendingDot} />
                )}
              </View>
              <Text style={[
                styles.quickStatusLabel,
                { opacity: getBookingLabelOpacity(activeDay.mockBookingStatus?.flights || 'Pending') }
              ]}>
                Flight
              </Text>
            </View>
            
            {/* Stay Status */}
            <View style={styles.quickStatusItem}>
              <View style={[
                styles.quickStatusIcon,
                activeDay.mockBookingStatus?.stays === 'Booked' && getBookingIconGlow('Booked')
              ]}>
                {activeDay.mockBookingStatus?.stays === 'Booked' && (
                  <LinearGradient
                    colors={['rgba(255,251,234,0.15)', 'rgba(201,166,91,0.15)']}
                    style={styles.quickStatusIconGradient}
                  />
                )}
                <Ionicons 
                  name="bed-outline" 
                  size={18} 
                  color={getBookingIconColor(activeDay.mockBookingStatus?.stays || 'Pending')} 
                />
                {activeDay.mockBookingStatus?.stays === 'Pending' && (
                  <View style={styles.pendingDot} />
                )}
              </View>
              <Text style={[
                styles.quickStatusLabel,
                { opacity: getBookingLabelOpacity(activeDay.mockBookingStatus?.stays || 'Pending') }
              ]}>
                Stay
              </Text>
            </View>
            
            {/* Transport Status */}
            <View style={styles.quickStatusItem}>
              <View style={[
                styles.quickStatusIcon,
                activeDay.mockBookingStatus?.transport === 'Booked' && getBookingIconGlow('Booked')
              ]}>
                {activeDay.mockBookingStatus?.transport === 'Booked' && (
                  <LinearGradient
                    colors={['rgba(255,251,234,0.15)', 'rgba(201,166,91,0.15)']}
                    style={styles.quickStatusIconGradient}
                  />
                )}
                <Ionicons 
                  name="car-outline" 
                  size={18} 
                  color={getBookingIconColor(activeDay.mockBookingStatus?.transport || 'N/A')} 
                />
                {activeDay.mockBookingStatus?.transport === 'Pending' && (
                  <View style={styles.pendingDot} />
                )}
              </View>
              <Text style={[
                styles.quickStatusLabel,
                { opacity: getBookingLabelOpacity(activeDay.mockBookingStatus?.transport || 'N/A') }
              ]}>
                Transport
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  // City Header - 220px with Frosted Glass Card
  const renderCityHeader = () => (
    <View style={styles.cityHeaderContainer}>
      <ImageBackground
        source={{ uri: activeDay.heroImage }}
        style={styles.cityBackground}
        imageStyle={styles.cityBackgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
          style={styles.cityGradient}
        />
        
        {/* Frosted glass card for city info */}
        <View style={styles.cityFrostedCard}>
          <View style={styles.cityHeaderRow}>
            <Text style={styles.cityName}>{activeDay.city}</Text>
          </View>
          <Text style={styles.cityDescription}>{activeDay.description}</Text>
          
          {/* Large centered date pill - Premium editorial style */}
          <View style={styles.cityDatePillContainer}>
            <View style={styles.cityDatePill}>
              <Text style={styles.cityDatePillText}>{activeCityDateRange}</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );

  const renderFlights = () => {
    const currentDayFlights = dayFlights[activeDay.id] || [];
    const allFlights = [...activeDay.flights, ...currentDayFlights];
    
    // Calculate status
    const sectionStatus = calculateFlightStatus(allFlights);
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="airplane" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Flights</Text>
              {/* Status Pill */}
              <View style={[styles.sectionStatusPill, {
                backgroundColor: sectionStatus === 'Booked' ? 'rgba(201,166,91,0.25)' : 
                                sectionStatus === 'Pending' ? 'rgba(150,150,150,0.25)' : 
                                'rgba(255,255,255,0.1)'
              }]}>
                <Text style={[styles.sectionStatusText, {
                  color: sectionStatus === 'Booked' ? '#C9A65B' : 
                        sectionStatus === 'Pending' ? '#999999' : 
                        'rgba(255,255,255,0.6)'
                }]}>
                  {sectionStatus}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {allFlights.map((flight, index) => {
              // Check if this is a user-added flight (not a mock flight)
              const isUserAdded = currentDayFlights.some(f => f.id === flight.id);
              
              return (
                <View 
                  key={flight.id} 
                  style={styles.flightCard}
                >
                  <ImageBackground
                    source={{ uri: 'https://customer-assets.emergentagent.com/job_tripplanner-90/artifacts/kdqm7un3_search%202.jpg' }}
                    style={styles.flightImageCardBg}
                    imageStyle={styles.flightImageCardBgStyle}
                    blurRadius={4}
                  >
                    {/* Date Badge - Top Left */}
                    <View style={styles.cardDateBadgeOnImageLeft}>
                      <Text style={styles.cardDateText}>{activeCityFirstDate}</Text>
                    </View>
                    
                    {/* Remove Flight Button - Top Right (Only for user-added flights) */}
                    {isUserAdded && (
                      <TouchableOpacity
                        style={styles.removeFlightButton}
                        onPress={() => {
                          console.log('Deleting flight:', flight.id);
                          setDayFlights(prev => {
                            const currentFlights = prev[activeDay.id] || [];
                            const filteredFlights = currentFlights.filter(f => f.id !== flight.id);
                            console.log('Before:', currentFlights.length, 'After:', filteredFlights.length);
                            return {
                              ...prev,
                              [activeDay.id]: filteredFlights
                            };
                          });
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close" size={16} color="rgba(255,255,255,0.9)" />
                      </TouchableOpacity>
                    )}
                  
                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.flightImageCardGradient}
                  />
                  
                  {/* Frosted Glass Content Pane */}
                  <View style={styles.flightImageCardFrosted}>
                    <Text style={styles.flightCardTraveler}>{flight.traveler === 'Traveler 1' ? (user?.name || 'Traveler 1') : flight.traveler}</Text>
                    <Text style={styles.flightCardRoute}>{flight.route}</Text>
                    <Text style={styles.flightCardAirline}>{flight.airline}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 6}}>
                      <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.85)" style={{marginRight: 6}} />
                      <Text style={styles.flightCardTime}>22:00 – 06:30 · 8h 30m Nonstop</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Ionicons name="navigate-outline" size={14} color="rgba(255,255,255,0.7)" style={{marginRight: 6}} />
                      <Text style={styles.flightCardDetails}>T1 Gate B12</Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
              );
            })}
            
            {/* Flight Input Card - Always shown as last card */}
            <View style={styles.flightInputCard}>
              <Text style={styles.flightInputLabel}>Add Flight</Text>
              <TextInput
                style={styles.flightInput}
                placeholder="Enter flight number (e.g., ITAAZ1234)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={flightNumber}
                onChangeText={setFlightNumber}
                autoCapitalize="characters"
              />
              <TouchableOpacity 
                style={styles.addFlightButton}
                onPress={() => handleAddFlight(activeDay.id, activeCityFirstDate)}
                activeOpacity={0.7}
              >
                <Text style={styles.addFlightButtonText}>Add Flight</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  // Stays Section - Image-Based Cards with Real Bookings
  const renderStays = () => {
    // Get booked stays for current trip
    const bookedStays = getStayBookingsByTrip(currentTrip.id);
    
    // Filter stays for active city
    const cityBookedStays = bookedStays.filter(booking => 
      booking.cityCode === activeCityCode
    );
    
    console.log('Trip Canvas - Booked stays for trip:', currentTrip.id, 'count:', bookedStays.length);
    console.log('Trip Canvas - City booked stays for', activeCityCode, ':', cityBookedStays.length);
    
    // Determine status: if any stays booked for this city, show "Booked", else "Pending"
    const sectionStatus = cityBookedStays.length > 0 ? 'Booked' : 'Pending';
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="bed" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Stays</Text>
              {/* Status Pill */}
              <View style={[styles.sectionStatusPill, {
                backgroundColor: sectionStatus === 'Booked' ? 'rgba(201,166,91,0.25)' : 
                                sectionStatus === 'Pending' ? 'rgba(150,150,150,0.25)' : 
                                'rgba(255,255,255,0.1)'
              }]}>
                <Text style={[styles.sectionStatusText, {
                  color: sectionStatus === 'Booked' ? '#C9A65B' : 
                        sectionStatus === 'Pending' ? '#999999' : 
                        'rgba(255,255,255,0.6)'
                }]}>
                  {sectionStatus}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={handleBrowseStays}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          
          {cityBookedStays.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {cityBookedStays.map((booking, index) => (
                <TouchableOpacity 
                  key={booking.stayId} 
                  style={[styles.stayImageCard, index === cityBookedStays.length - 1 && {marginRight: 0}]}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/stay-info-compact',
                    params: {
                      stayId: booking.stayId,
                      nights: booking.nights.toString(),
                      tripId: currentTrip.id,
                      cityCode: activeCityCode,
                      city: booking.city,
                      dateRange: booking.dateRange
                    }
                  })}
                >
                  <ImageBackground
                    source={{ uri: booking.stayImage || 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }}
                    style={styles.stayImageCardBg}
                    imageStyle={styles.stayImageCardBgStyle}
                  >
                    <View style={styles.cardDateBadgeOnImage}>
                      <Text style={styles.cardDateText}>{booking.dateRange || activeCityStayDates}</Text>
                    </View>
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.stayImageCardGradient}
                    />
                    <View style={styles.stayImageCardFrosted}>
                      <Text style={styles.stayCardName}>{booking.stayName || 'Stay'}</Text>
                      <Text style={styles.stayCardAddress}>{booking.city || activeCityCode}</Text>
                      <Text style={styles.stayCardPriceNights}>
                        <Text style={styles.stayCardPrice}>€{booking.pricePerNight ? booking.pricePerNight * booking.nights : '---'}</Text>
                        {' · '}
                        <Text style={styles.stayCardNights}>{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</Text>
                      </Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'DMSans-Regular' }}>
                No stays booked yet
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 4 }}>
                Tap the compass to browse stays
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Transport Section - Horizontal Scroll

  // Transport Section - With Real Bookings
  const renderTransport = () => {
    const bookedTransports = getTransportBookingsByTrip(currentTrip.id);
    const cityBookedTransports = bookedTransports.filter(booking => booking.cityCode === activeCityCode);
    
    const sectionStatus = cityBookedTransports.length > 0 ? 'Booked' : 'Pending';
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="car-sport" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Transport</Text>
              <View style={[styles.sectionStatusPill, {
                backgroundColor: sectionStatus === 'Booked' ? 'rgba(201,166,91,0.25)' : 'rgba(150,150,150,0.25)'
              }]}>
                <Text style={[styles.sectionStatusText, {
                  color: sectionStatus === 'Booked' ? '#C9A65B' : '#999999'
                }]}>
                  {sectionStatus}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push({
                pathname: '/transport-browsing',
                params: { tripId: currentTrip.id, cityCode: activeCityCode }
              })}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          
          {cityBookedTransports.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {cityBookedTransports.map((booking, index) => (
                <TouchableOpacity 
                  key={booking.transportId} 
                  style={[styles.experienceImageCard, index === cityBookedTransports.length - 1 && {marginRight: 0}]}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/transport-info',
                    params: {
                      transportId: booking.transportId,
                      people: booking.people.toString(),
                      tripId: currentTrip.id,
                      cityCode: activeCityCode,
                      city: booking.city,
                      date: booking.date
                    }
                  })}
                >
                  <ImageBackground
                    source={{ uri: booking.transportImage || 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }}
                    style={styles.experienceImageCardBg}
                    imageStyle={styles.experienceImageCardBgStyle}
                  >
                    <View style={styles.cardDateBadgeOnImage}>
                      <Text style={styles.cardDateText}>{booking.date || activeCityFirstDate}</Text>
                    </View>
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.experienceImageCardGradient}
                    />
                    <View style={styles.experienceImageCardFrosted}>
                      <Text style={styles.experienceCardTitle}>{booking.transportName || 'Transport'}</Text>
                      <View style={styles.experienceCardDetailsRow}>
                        <Ionicons name="people-outline" size={14} color="rgba(181,155,115,0.9)" />
                        <Text style={styles.experienceCardDetails}>
                          {booking.people} {booking.people === 1 ? 'person' : 'people'}
                        </Text>
                        <Text style={styles.experienceCardLocation}>· €{booking.pricePerPerson ? booking.pricePerPerson * booking.people : '---'}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'DMSans-Regular' }}>
                No transport booked yet
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 4 }}>
                Tap the compass to browse transport
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Experiences Section - With Real Bookings
  const renderExperiences = () => {
    // Get booked experiences for current trip
    const bookedExperiences = getExperienceBookingsByTrip(currentTrip.id);
    
    // Filter experiences for active city
    const cityBookedExperiences = bookedExperiences.filter(booking => 
      booking.cityCode === activeCityCode
    );
    
    console.log('Trip Canvas - Booked experiences for trip:', currentTrip.id, 'count:', bookedExperiences.length);
    console.log('Trip Canvas - City booked experiences for', activeCityCode, ':', cityBookedExperiences.length);
    
    // Determine status
    const sectionStatus = cityBookedExperiences.length > 0 ? 'Booked' : 'Pending';
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="ticket" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Experiences</Text>
              {/* Status Pill */}
              <View style={[styles.sectionStatusPill, {
                backgroundColor: sectionStatus === 'Booked' ? 'rgba(201,166,91,0.25)' : 
                                sectionStatus === 'Pending' ? 'rgba(150,150,150,0.25)' : 
                                'rgba(255,255,255,0.1)'
              }]}>
                <Text style={[styles.sectionStatusText, {
                  color: sectionStatus === 'Booked' ? '#C9A65B' : 
                        sectionStatus === 'Pending' ? '#999999' : 
                        'rgba(255,255,255,0.6)'
                }]}>
                  {sectionStatus}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push({
                pathname: '/experience-browsing',
                params: {
                  tripId: currentTrip.id,
                  cityCode: activeCityCode,
                }
              })}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          
          {cityBookedExperiences.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {cityBookedExperiences.map((booking, index) => (
                <TouchableOpacity 
                  key={booking.experienceId} 
                  style={[styles.experienceImageCard, index === cityBookedExperiences.length - 1 && {marginRight: 0}]}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/experience-info',
                    params: {
                      experienceId: booking.experienceId,
                      people: booking.people.toString(),
                      tripId: currentTrip.id,
                      cityCode: activeCityCode,
                      city: booking.city,
                      date: booking.date
                    }
                  })}
                >
                  <ImageBackground
                    source={{ uri: booking.experienceImage || 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }}
                    style={styles.experienceImageCardBg}
                    imageStyle={styles.experienceImageCardBgStyle}
                  >
                    <View style={styles.cardDateBadgeOnImage}>
                      <Text style={styles.cardDateText}>{booking.date || activeCityFirstDate}</Text>
                    </View>
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.experienceImageCardGradient}
                    />
                    <View style={styles.experienceImageCardFrosted}>
                      <Text style={styles.experienceCardTitle}>{booking.experienceName || 'Experience'}</Text>
                      <View style={styles.experienceCardDetailsRow}>
                        <Ionicons name="people-outline" size={14} color="rgba(181,155,115,0.9)" />
                        <Text style={styles.experienceCardDetails}>
                          {booking.people} {booking.people === 1 ? 'person' : 'people'}
                        </Text>
                        <Text style={styles.experienceCardLocation}>· €{booking.pricePerPerson ? booking.pricePerPerson * booking.people : '---'}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'DMSans-Regular' }}>
                No experiences booked yet
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 4 }}>
                Tap the compass to browse experiences
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };


  // Restaurants Section - With Real Bookings
  const renderRestaurants = () => {
    const bookedRestaurants = getRestaurantBookingsByTrip(currentTrip.id);
    const cityBookedRestaurants = bookedRestaurants.filter(booking => booking.cityCode === activeCityCode);
    
    console.log('Trip Canvas - Booked restaurants for trip:', currentTrip.id, 'count:', bookedRestaurants.length);
    console.log('Trip Canvas - City booked restaurants for', activeCityCode, ':', cityBookedRestaurants.length);
    
    const sectionStatus = cityBookedRestaurants.length > 0 ? 'Booked' : 'Pending';
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="restaurant" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Restaurants</Text>
              <View style={[styles.sectionStatusPill, {
                backgroundColor: sectionStatus === 'Booked' ? 'rgba(201,166,91,0.25)' : 'rgba(150,150,150,0.25)'
              }]}>
                <Text style={[styles.sectionStatusText, {
                  color: sectionStatus === 'Booked' ? '#C9A65B' : '#999999'
                }]}>
                  {sectionStatus}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push({
                pathname: '/restaurant-browsing',
                params: { tripId: currentTrip.id, cityCode: activeCityCode }
              })}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          
          {cityBookedRestaurants.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {cityBookedRestaurants.map((booking, index) => (
                <TouchableOpacity 
                  key={booking.restaurantId} 
                  style={[styles.experienceImageCard, index === cityBookedRestaurants.length - 1 && {marginRight: 0}]}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/restaurant-info',
                    params: {
                      restaurantId: booking.restaurantId,
                      people: booking.people.toString(),
                      tripId: currentTrip.id,
                      cityCode: activeCityCode,
                      city: booking.city,
                      date: booking.date
                    }
                  })}
                >
                  <ImageBackground
                    source={{ uri: booking.restaurantImage || 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }}
                    style={styles.experienceImageCardBg}
                    imageStyle={styles.experienceImageCardBgStyle}
                  >
                    <View style={styles.cardDateBadgeOnImage}>
                      <Text style={styles.cardDateText}>{booking.date || activeCityFirstDate}</Text>
                    </View>
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.experienceImageCardGradient}
                    />
                    <View style={styles.experienceImageCardFrosted}>
                      <Text style={styles.experienceCardTitle}>{booking.restaurantName || 'Restaurant'}</Text>
                      <View style={styles.experienceCardDetailsRow}>
                        <Ionicons name="people-outline" size={14} color="rgba(181,155,115,0.9)" />
                        <Text style={styles.experienceCardDetails}>
                          {booking.people} {booking.people === 1 ? 'person' : 'people'}
                        </Text>
                        <Text style={styles.experienceCardLocation}>· €{booking.pricePerPerson ? booking.pricePerPerson * booking.people : '---'}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'DMSans-Regular' }}>
                No restaurants booked yet
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'DMSans-Regular', marginTop: 4 }}>
                Tap the compass to browse restaurants
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Trip Summary
  const renderTripSummary = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryHeroContainer}>
        <ImageBackground
          source={{ uri: tripData.summary.heroImage }}
          style={styles.summaryHeroBackground}
          imageStyle={styles.summaryHeroBackgroundImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
            style={styles.summaryHeroGradient}
          />
          <View style={styles.summaryHeroContent}>
            <Text style={styles.summaryTitle}>{tripData.summary.title}</Text>
            <Text style={styles.summarySubtitle}>{tripData.summary.subtitle}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Frosted Summary Card */}
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.statsGrid}>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🛫</Text>
              <Text style={styles.statText}>Flights {tripData.summary.stats.flights}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🏨</Text>
              <Text style={styles.statText}>Nights {tripData.summary.stats.nights}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🚗</Text>
              <Text style={styles.statText}>Transfers {tripData.summary.stats.transfers}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🎟</Text>
              <Text style={styles.statText}>Experiences {tripData.summary.stats.experiences}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🍽</Text>
              <Text style={styles.statText}>Restaurants {tripData.summary.stats.restaurants}</Text>
            </View>
          </View>
          <Text style={styles.statsCaption}>All bookings confirmed · All memories saved</Text>
        </View>
      </View>

      {/* Reflection */}
      <View style={styles.reflectionContainer}>
        <Text style={styles.reflectionText}>{tripData.summary.reflection}</Text>
        
        <TouchableOpacity style={styles.galleryButton} onPress={() => router.push('/gallery')}>
          <Text style={styles.galleryButtonText}>Share Trip Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Check if all cities have valid dates
  const areCityDatesValid = () => {
    return editableCities.every(city => cityDates[city] && cityDates[city].startMonth && cityDates[city].startDay && cityDates[city].endMonth && cityDates[city].endDay);
  };

  // Luxury Edit Pane with Select-Based Date System
  const renderEditPane = () => {
    const tripDuration = getTripDuration();
    const coverage = getCoverage();
    const remaining = tripDuration - coverage;
    const isEndBeforeStart = months.indexOf(tripEndMonth) < months.indexOf(tripStartMonth) || 
      (tripEndMonth === tripStartMonth && tripEndDay < tripStartDay);
    
    return (
      <Modal
        visible={showEditPane}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditPane(false)}
      >
        <View style={styles.luxuryEditOverlay}>
          <TouchableOpacity 
            style={styles.luxuryEditBlurFallback} 
            onPress={() => setShowEditPane(false)}
            activeOpacity={1}
          />
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.luxuryEditPane}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            {/* Sticky Header with Title and Close Button */}
            <LinearGradient
              colors={['rgba(255,180,120,0.12)', 'rgba(212,140,90,0.18)', 'rgba(80,50,40,0.35)', 'rgba(60,45,50,0.5)', 'rgba(30,25,28,0.75)']}
              locations={[0, 0.25, 0.6, 0.85, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.luxuryEditHeader}
            >
              <View style={styles.luxuryEditTitleContainer}>
                <Text style={styles.luxuryEditTitle}>Edit Trip</Text>
              </View>
              <TouchableOpacity 
                style={styles.luxuryCloseButton}
                onPress={() => setShowEditPane(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="rgba(214,193,152,0.9)" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView 
              style={styles.luxuryEditScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.luxuryEditScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.luxuryDivider} />

                <View style={styles.luxurySection}>
                  <Text style={styles.luxurySectionLabel}>TRIP TITLE</Text>
                  <TextInput
                    style={styles.luxuryInputLarge}
                    value={editableTripName}
                    onChangeText={(text) => setEditableTripName(text.substring(0, 18))}
                    placeholder="Enter trip name"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    maxLength={18}
                  />
                  <Text style={styles.charCounter}>{editableTripName.length}/18</Text>
                </View>

                <View style={styles.luxuryDivider} />
                
                <View style={styles.luxurySection}>
                  <Text style={styles.luxurySectionLabel}>TRIP DATES</Text>
                  <View style={styles.dateRow}>
                    <View style={styles.dateSelect}>
                      <Text style={styles.dateLabel}>Start Month</Text>
                      <TouchableOpacity 
                        style={styles.selectWrapper}
                        onPress={() => {
                          setShowDayPicker({type: null, cityIndex: undefined});
                          setShowMonthPicker(
                            showMonthPicker.type === 'start' && showMonthPicker.cityIndex === undefined
                              ? {type: null}
                              : {type: 'start'}
                          );
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.selectText}>{tripStartMonth}</Text>
                        <Ionicons name="chevron-down" size={14} color="rgba(214,193,152,0.6)" style={{position: 'absolute', right: 10}} />
                      </TouchableOpacity>
                      
                      {showMonthPicker.type === 'start' && showMonthPicker.cityIndex === undefined && (
                        <View style={styles.pickerDropdown}>
                          <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                            {months.map(month => (
                              <TouchableOpacity
                                key={month}
                                style={styles.pickerOption}
                                onPress={() => {
                                  setTripStartMonth(month);
                                  setShowMonthPicker({type: null});
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.pickerOptionText}>{month}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.dateSelectSmall}>
                      <Text style={styles.dateLabel}>Day</Text>
                      <TouchableOpacity 
                        style={styles.selectWrapper}
                        onPress={() => {
                          setShowMonthPicker({type: null, cityIndex: undefined});
                          setShowDayPicker(
                            showDayPicker.type === 'start' && showDayPicker.cityIndex === undefined
                              ? {type: null}
                              : {type: 'start'}
                          );
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.selectText}>{tripStartDay}</Text>
                        <Ionicons name="chevron-down" size={14} color="rgba(214,193,152,0.6)" style={{position: 'absolute', right: 8}} />
                      </TouchableOpacity>
                      
                      {showDayPicker.type === 'start' && showDayPicker.cityIndex === undefined && (
                        <View style={styles.pickerDropdown}>
                          <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                            {Array.from({length: monthDays[tripStartMonth]}, (_, i) => i + 1).map(day => (
                              <TouchableOpacity
                                key={day}
                                style={styles.pickerOption}
                                onPress={() => {
                                  setTripStartDay(day);
                                  setShowDayPicker({type: null});
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.pickerOptionText}>{day}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.dateSelect}>
                      <Text style={styles.dateLabel}>End Month</Text>
                      <TouchableOpacity 
                        style={styles.selectWrapper}
                        onPress={() => {
                          setShowDayPicker({type: null, cityIndex: undefined});
                          setShowMonthPicker(
                            showMonthPicker.type === 'end' && showMonthPicker.cityIndex === undefined
                              ? {type: null}
                              : {type: 'end'}
                          );
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.selectText}>{tripEndMonth}</Text>
                        <Ionicons name="chevron-down" size={14} color="rgba(214,193,152,0.6)" style={{position: 'absolute', right: 10}} />
                      </TouchableOpacity>
                      
                      {showMonthPicker.type === 'end' && showMonthPicker.cityIndex === undefined && (
                        <View style={styles.pickerDropdown}>
                          <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                            {months.map(month => (
                              <TouchableOpacity
                                key={month}
                                style={styles.pickerOption}
                                onPress={() => {
                                  setTripEndMonth(month);
                                  setShowMonthPicker({type: null});
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.pickerOptionText}>{month}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.dateSelectSmall}>
                      <Text style={styles.dateLabel}>Day</Text>
                      <TouchableOpacity 
                        style={styles.selectWrapper}
                        onPress={() => {
                          setShowMonthPicker({type: null, cityIndex: undefined});
                          setShowDayPicker(
                            showDayPicker.type === 'end' && showDayPicker.cityIndex === undefined
                              ? {type: null}
                              : {type: 'end'}
                          );
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.selectText}>{tripEndDay}</Text>
                        <Ionicons name="chevron-down" size={14} color="rgba(214,193,152,0.6)" style={{position: 'absolute', right: 8}} />
                      </TouchableOpacity>
                      
                      {showDayPicker.type === 'end' && showDayPicker.cityIndex === undefined && (
                        <View style={styles.pickerDropdown}>
                          <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                            {Array.from({length: monthDays[tripEndMonth]}, (_, i) => i + 1).map(day => (
                              <TouchableOpacity
                                key={day}
                                style={styles.pickerOption}
                                onPress={() => {
                                  setTripEndDay(day);
                                  setShowDayPicker({type: null});
                                }}
                                activeOpacity={0.7}
                              >
                                <Text style={styles.pickerOptionText}>{day}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  </View>

                  {isEndBeforeStart ? (
                    <Text style={styles.errorHint}>End must be after Start.</Text>
                  ) : tripDuration > 0 ? (
                    <Text style={styles.tripSummary}>
                      Trip: {tripStartMonth.substring(0,3)} {tripStartDay} – {tripEndMonth.substring(0,3)} {tripEndDay} ({tripDuration} days)
                    </Text>
                  ) : null}
                  
                  <View style={styles.travelersSection}>
                    <Text style={styles.luxurySectionLabel}>TRAVELERS</Text>
                    <View style={styles.stepperControls}>
                      <TouchableOpacity 
                        style={styles.stepperButton}
                        onPress={() => setEditableTravelers(Math.max(1, editableTravelers - 1))}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="remove" size={16} color="rgba(214,193,152,0.9)" />
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{editableTravelers}</Text>
                      <TouchableOpacity 
                        style={styles.stepperButton}
                        onPress={() => setEditableTravelers(editableTravelers + 1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={16} color="rgba(214,193,152,0.9)" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.luxuryDivider} />

                <View style={styles.luxurySection}>
                  <Text style={styles.luxurySectionLabel}>CITIES & DATES</Text>
                  
                  {/* Trip Change Message */}
                  {tripChangeMessage && (
                    <View style={styles.tripChangeMessageContainer}>
                      <Text style={styles.tripChangeMessage}>{tripChangeMessage}</Text>
                    </View>
                  )}
                  
                  {/* Coverage Bar */}
                  <View style={styles.coverageBar}>
                    <Text style={styles.coverageText}>Coverage: {coverage} / {tripDuration} days</Text>
                  </View>
                  
                  {/* Assign All Button */}
                  {coverage < tripDuration && editableCities.length > 0 && tripDuration > 0 && (
                    <TouchableOpacity 
                      style={styles.assignAllButton}
                      onPress={handleAssignAll}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.assignAllButtonText}>
                        {hasUsedAssignAll ? 'Re-assign Evenly' : 'Assign All'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {/* City Cards - Draggable */}
                  <GestureHandlerRootView style={styles.luxuryCityList}>
                    <DraggableFlatList
                      data={editableCities}
                      scrollEnabled={false}
                      renderItem={({ item: cityCode, drag, isActive, getIndex }) => {
                        const index = getIndex() ?? 0;
                        // Get full city name - prioritize currentTrip.cities, fallback to AVAILABLE_CITIES
                        let cityName = cityCode; // fallback to code if nothing else works
                        
                        // First check currentTrip.cities (most accurate source)
                        if (currentTrip) {
                          const tripCity = currentTrip.cities.find(c => c.code === cityCode);
                          if (tripCity && tripCity.name) {
                            cityName = tripCity.name;
                          }
                        }
                        
                        // Fallback to AVAILABLE_CITIES if not found in trip
                        if (cityName === cityCode) {
                          const availableCity = AVAILABLE_CITIES.find(c => c.code === cityCode);
                          if (availableCity && availableCity.name) {
                            cityName = availableCity.name;
                          }
                        }
                        
                        const cityDate = cityDates[cityCode] || {startMonth: '', startDay: 0, endMonth: '', endDay: 0};
                        const hasValidDates = cityDate.startMonth && cityDate.startDay && cityDate.endMonth && cityDate.endDay;
                        const validationMessage = hasValidDates ? getCityValidationMessage(cityCode, index) : '';
                        
                        let nights = 0;
                        if (hasValidDates) {
                          const startIdx = months.indexOf(cityDate.startMonth);
                          const endIdx = months.indexOf(cityDate.endMonth);
                          if (startIdx === endIdx) {
                            nights = cityDate.endDay - cityDate.startDay;
                          } else {
                            nights = monthDays[cityDate.startMonth] - cityDate.startDay;
                            for (let i = startIdx + 1; i < endIdx; i++) {
                              nights += monthDays[months[i]];
                            }
                            nights += cityDate.endDay;
                          }
                        }
                        
                        return (
                          <ScaleDecorator>
                            <View 
                              key={`${cityCode}-${index}`} 
                              style={[
                                styles.cityCard,
                                isActive && styles.cityCardActive
                              ]}
                            >
                              <View style={styles.cityCardHeader}>
                                <TouchableOpacity 
                                  onLongPress={drag}
                                  disabled={isActive}
                                  style={styles.luxuryReorderHandle}
                                  activeOpacity={0.7}
                                >
                                  <View style={styles.luxuryDot} />
                                  <View style={styles.luxuryDot} />
                                  <View style={styles.luxuryDot} />
                                </TouchableOpacity>
                                <Text style={styles.cityCardName}>{cityName}</Text>
                                <TouchableOpacity
                                  style={styles.luxuryDeleteButton}
                                  onPress={() => {
                                    const newCities = editableCities.filter((_, i) => i !== index);
                                    setEditableCities(newCities);
                                    // Clear this city's dates
                                    const newDates = {...cityDates};
                                    delete newDates[cityCode];
                                    setCityDates(newDates);
                                  }}
                                  activeOpacity={0.6}
                                >
                                  <Ionicons name="close" size={14} color="rgba(255,255,255,0.5)" />
                                </TouchableOpacity>
                              </View>

                              <View style={styles.cityDateRow}>
                            <View style={styles.cityDateGroup}>
                              <Text style={styles.cityDateLabel}>Start</Text>
                              <View style={styles.cityDateFields}>
                                <TouchableOpacity 
                                  style={styles.cityDateField}
                                  onPress={() => setShowMonthPicker(
                                    showMonthPicker.type === 'start' && showMonthPicker.cityIndex === index 
                                      ? {type: null} 
                                      : {type: 'start', cityIndex: index}
                                  )}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.cityDateFieldText}>
                                    {cityDate.startMonth?.substring(0,3) || '―'}
                                  </Text>
                                </TouchableOpacity>
                                
                                {showMonthPicker.type === 'start' && showMonthPicker.cityIndex === index && (
                                  <View style={[styles.pickerDropdown, {zIndex: 5000 + index}]}>
                                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                                      {months.filter(month => {
                                        // Only show months within trip range
                                        const monthIdx = months.indexOf(month);
                                        const startIdx = months.indexOf(tripStartMonth);
                                        const endIdx = months.indexOf(tripEndMonth);
                                        return monthIdx >= startIdx && monthIdx <= endIdx;
                                      }).map(month => (
                                        <TouchableOpacity
                                          key={month}
                                          style={styles.pickerOption}
                                          onPress={() => {
                                            setCityDates(prev => ({
                                              ...prev,
                                              [cityCode]: {...(prev[cityCode] || {}), startMonth: month, startDay: prev[cityCode]?.startDay || 1}
                                            }));
                                            setShowMonthPicker({type: null});
                                          }}
                                          activeOpacity={0.7}
                                        >
                                          <Text style={styles.pickerOptionText}>{month}</Text>
                                        </TouchableOpacity>
                                      ))}
                                    </ScrollView>
                                  </View>
                                )}
                                
                                <TouchableOpacity 
                                  style={styles.cityDateField}
                                  onPress={() => setShowDayPicker(
                                    showDayPicker.type === 'start' && showDayPicker.cityIndex === index 
                                      ? {type: null} 
                                      : {type: 'start', cityIndex: index}
                                  )}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.cityDateFieldText}>
                                    {cityDate.startDay || '―'}
                                  </Text>
                                </TouchableOpacity>
                                
                                {showDayPicker.type === 'start' && showDayPicker.cityIndex === index && cityDate.startMonth && (
                                  <View style={[styles.pickerDropdown, {zIndex: 5000 + index}]}>
                                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                                      {Array.from({length: monthDays[cityDate.startMonth]}, (_, i) => i + 1).map(day => {
                                        const dayNum = dateToTripDay(cityDate.startMonth, day);
                                        const { usedDays } = getUnassignedDays(index);
                                        const isDisabled = usedDays.has(dayNum) || !isDateInTripRange(cityDate.startMonth, day);
                                        
                                        return (
                                          <TouchableOpacity
                                            key={day}
                                            style={[styles.pickerOption, isDisabled && styles.pickerOptionDisabled]}
                                            onPress={() => {
                                              if (!isDisabled) {
                                                setCityDates(prev => ({
                                                  ...prev,
                                                  [cityCode]: {...(prev[cityCode] || {}), startDay: day}
                                                }));
                                                setShowDayPicker({type: null});
                                              }
                                            }}
                                            activeOpacity={isDisabled ? 1 : 0.7}
                                            disabled={isDisabled}
                                          >
                                            <Text style={[styles.pickerOptionText, isDisabled && styles.pickerOptionTextDisabled]}>{day}</Text>
                                          </TouchableOpacity>
                                        );
                                      })}
                                    </ScrollView>
                                  </View>
                                )}
                              </View>
                            </View>
                            
                            <View style={styles.cityDateGroup}>
                              <Text style={styles.cityDateLabel}>End</Text>
                              <View style={styles.cityDateFields}>
                                <TouchableOpacity 
                                  style={styles.cityDateField}
                                  onPress={() => setShowMonthPicker(
                                    showMonthPicker.type === 'end' && showMonthPicker.cityIndex === index 
                                      ? {type: null} 
                                      : {type: 'end', cityIndex: index}
                                  )}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.cityDateFieldText}>
                                    {cityDate.endMonth?.substring(0,3) || '―'}
                                  </Text>
                                </TouchableOpacity>
                                
                                {showMonthPicker.type === 'end' && showMonthPicker.cityIndex === index && (
                                  <View style={[styles.pickerDropdown, {zIndex: 5000 + index}]}>
                                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                                      {months.filter(month => {
                                        // Only show months within trip range and >= start month
                                        const monthIdx = months.indexOf(month);
                                        const startIdx = months.indexOf(tripStartMonth);
                                        const endIdx = months.indexOf(tripEndMonth);
                                        const cityStartIdx = cityDate.startMonth ? months.indexOf(cityDate.startMonth) : -1;
                                        return monthIdx >= startIdx && monthIdx <= endIdx && (cityStartIdx === -1 || monthIdx >= cityStartIdx);
                                      }).map(month => (
                                        <TouchableOpacity
                                          key={month}
                                          style={styles.pickerOption}
                                          onPress={() => {
                                            setCityDates(prev => ({
                                              ...prev,
                                              [cityCode]: {...(prev[cityCode] || {}), endMonth: month, endDay: prev[cityCode]?.endDay || 1}
                                            }));
                                            setShowMonthPicker({type: null});
                                          }}
                                          activeOpacity={0.7}
                                        >
                                          <Text style={styles.pickerOptionText}>{month}</Text>
                                        </TouchableOpacity>
                                      ))}
                                    </ScrollView>
                                  </View>
                                )}
                                
                                <TouchableOpacity 
                                  style={styles.cityDateField}
                                  onPress={() => setShowDayPicker(
                                    showDayPicker.type === 'end' && showDayPicker.cityIndex === index 
                                      ? {type: null} 
                                      : {type: 'end', cityIndex: index}
                                  )}
                                  activeOpacity={0.7}
                                >
                                  <Text style={styles.cityDateFieldText}>
                                    {cityDate.endDay || '―'}
                                  </Text>
                                </TouchableOpacity>
                                
                                {showDayPicker.type === 'end' && showDayPicker.cityIndex === index && cityDate.endMonth && (
                                  <View style={[styles.pickerDropdown, {zIndex: 5000 + index}]}>
                                    <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                                      {Array.from({length: monthDays[cityDate.endMonth]}, (_, i) => i + 1).map(day => {
                                        const dayNum = dateToTripDay(cityDate.endMonth, day);
                                        const { usedDays } = getUnassignedDays(index);
                                        // Also check if day is >= city start day if same month
                                        const isSameMonth = cityDate.startMonth === cityDate.endMonth;
                                        const isTooEarly = isSameMonth && cityDate.startDay && day < cityDate.startDay;
                                        const isDisabled = usedDays.has(dayNum) || !isDateInTripRange(cityDate.endMonth, day) || isTooEarly;
                                        
                                        return (
                                          <TouchableOpacity
                                            key={day}
                                            style={[styles.pickerOption, isDisabled && styles.pickerOptionDisabled]}
                                            onPress={() => {
                                              if (!isDisabled) {
                                                setCityDates(prev => ({
                                                  ...prev,
                                                  [cityCode]: {...(prev[cityCode] || {}), endDay: day}
                                                }));
                                                setShowDayPicker({type: null});
                                              }
                                            }}
                                            activeOpacity={isDisabled ? 1 : 0.7}
                                            disabled={isDisabled}
                                          >
                                            <Text style={[styles.pickerOptionText, isDisabled && styles.pickerOptionTextDisabled]}>{day}</Text>
                                          </TouchableOpacity>
                                        );
                                      })}
                                    </ScrollView>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          {/* Display city state: nights if valid, unassigned if not, or inline error */}
                          {!hasValidDates ? (
                            <Text style={styles.cityUnassignedText}>Unassigned. Set start and end.</Text>
                          ) : validationMessage ? (
                            <Text style={styles.cityValidationMessage}>{validationMessage}</Text>
                          ) : (
                            <Text style={styles.cityNights}>{cityName} — {nights} {nights === 1 ? 'night' : 'nights'}.</Text>
                          )}
                        </View>
                      </ScaleDecorator>
                    );
                  }}
                  keyExtractor={(item) => item}
                  onDragEnd={({ data }) => handleCityReorder(data)}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  containerStyle={styles.draggableListContainer}
                />
              </GestureHandlerRootView>
              
              <View style={styles.luxuryAddCitySection}>
                    <TextInput
                      style={styles.luxuryInput}
                      value={citySearchQuery}
                      onChangeText={setCitySearchQuery}
                      placeholder="Search to add a city..."
                      placeholderTextColor="rgba(255,255,255,0.35)"
                    />
                    {citySearchQuery.length > 0 && (
                      <View style={styles.luxuryCityResults}>
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <TouchableOpacity
                              key={city.code}
                              style={styles.luxuryCityResult}
                              onPress={() => {
                                if (!editableCities.includes(city.code)) {
                                  setEditableCities([...editableCities, city.code]);
                                }
                                setCitySearchQuery('');
                              }}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.luxuryCityResultText}>
                                {city.name}, {city.region}
                              </Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <View style={styles.luxuryCityResult}>
                            <Text style={styles.luxuryNotAvailableText}>This city is not available</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>

                {/* Save Button with Inline Feedback */}
                {!canSave() && (
                  <View style={styles.saveBlockedMessage}>
                    <Text style={styles.saveBlockedText}>
                      {getCoverage() < getTripDuration() ? 'Assign all days before saving.' : 'Fix city date errors to continue.'}
                    </Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={[styles.luxurySaveButton, !canSave() && styles.luxurySaveButtonDisabled]}
                  onPress={handleSaveChanges}
                  activeOpacity={canSave() ? 0.8 : 1}
                  disabled={!canSave()}
                >
                  <LinearGradient
                    colors={canSave() ? ['rgba(201,180,124,0.2)', 'rgba(184,156,115,0.25)'] : ['rgba(100,100,100,0.15)', 'rgba(80,80,80,0.2)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.luxurySaveGradient}
                  >
                    <Text style={[styles.luxurySaveText, !canSave() && styles.luxurySaveTextDisabled]}>
                      Save Changes
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                {/* Delete Trip Button - Only for Planning Status */}
                {currentTrip.status === 'Planning' && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      console.log('Delete button pressed');
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setShowDeleteModal(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteButtonText}>Delete Trip</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeroPanel()}
        {renderCityHeader()}
        {renderFlights()}
        {renderStays()}
        {renderTransport()}
        {renderExperiences()}
        {renderRestaurants()}
      </ScrollView>

      {/* Edit Pane Modal */}
      {renderEditPane()}
      
      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete this trip?</Text>
            <Text style={styles.deleteModalBody}>
              This will permanently remove all trip details, including cities, dates, and bookings. This action cannot be undone.
            </Text>
            
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.deleteModalCancelButton}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteModalConfirmButton}
                onPress={handleDeleteTrip}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteModalConfirmText}>Delete Trip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Bottom Dock */}
      <View style={styles.bottomDock}>
        <BlurView intensity={22} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/landing');
              }}
            >
              <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.82)" />
              <Text style={styles.dockLabelInactive}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="calendar" size={22} color="#C2A46E" />
              <Text style={styles.dockLabelActive}>Trip Canvas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/trips');
              }}
            >
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.82)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/concierge');
              }}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.82)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero Panel - Compact and elegant
  heroContainer: {
    height: 280,
    marginBottom: 0,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroBackground: {
    flex: 1,
  },
  heroBackgroundImage: {
    opacity: 0.6,
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
    bottom: 24,
    left: '5%',
    right: '5%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 18,
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
  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8, // Increased from 4 for better spacing
  },
  heroTitle: {
    fontSize: 24, // Reduced from 32 to fit in one line
    fontWeight: '600',
    color: 'rgba(255,255,255,0.98)',
    textAlign: 'center',
    letterSpacing: 0.3, // Reduced from 0.5
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  editIconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(217,203,160,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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

  // Status Capsule
  statusCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    marginBottom: 20,
  },
  statusDropdownMenu: {
    position: 'absolute',
    top: 110,
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.25)',
    padding: 8,
    zIndex: 100,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
      },
    }),
  },
  statusDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  statusDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // City Strip - Horizontal Scroll
  cityStripScroll: {
    marginBottom: 24,
    marginLeft: '3%', // Moved left from 5% for better alignment
  },
  cityStripContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0, // Changed from 20 to left-align
    paddingLeft: 24, // Add left padding only
    gap: 8,
  },
  cityStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  cityCapsuleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(181,155,115,0.4)',
  },
  cityCapsule: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
  },
  cityCapsuleActive: {
    backgroundColor: '#B59B73',
    borderColor: '#B59B73',
  },
  cityCapsuleText: {
    fontSize: 14, // Increased from 12 for better visibility
    fontWeight: '600',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityCapsuleTextActive: {
    color: 'rgba(10,10,10,0.9)',
  },

  // Quick Status Row - Refined Outlined Icons (Whisper of Light Through Fog)
  quickStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    marginTop: 18,
    marginLeft: '5%',
    marginRight: '5%',
  },
  quickStatusItem: {
    alignItems: 'center',
    gap: 10,
  },
  quickStatusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'transparent',
    overflow: 'visible',
    position: 'relative',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(5px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  quickStatusIconGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 18,
  },
  pendingDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F2B266',
    shadowColor: '#F2B266',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  quickStatusLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Day Selector Pills
  dayStripScroll: {
    marginTop: 12,
    marginBottom: 4,
  },
  dayStripContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  dayPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    marginRight: 8,
  },
  dayPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dayPillUnassigned: {
    backgroundColor: 'rgba(120,120,120,0.08)',
    borderColor: 'rgba(150,150,150,0.15)',
  },
  dayPillTextUnassigned: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(180,180,180,0.65)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Day Tabs Container & Scrollable Tabs
  dayTabsContainer: {
    marginTop: 16,
    marginLeft: '5%', // Match frosted pane left position
  },
  dayTabsScroll: {
    flexGrow: 0,
  },
  dayTabsContent: {
    paddingHorizontal: 0,
    paddingLeft: 24, // Left-align with progress bar
    gap: 10,
    alignItems: 'center',
  },
  // dayTabs style removed - now using ScrollView with dayTabsScroll and dayTabsContent
  dayTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
    minWidth: 120,
  },
  dayTabActive: {
    backgroundColor: '#B59B73',
    borderColor: '#B59B73',
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dayTabTextActive: {
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
  },
  dayTabUnassigned: {
    backgroundColor: 'rgba(120,120,120,0.08)',
    borderColor: 'rgba(150,150,150,0.15)',
    minWidth: 160,
  },
  dayTabTextUnassigned: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(180,180,180,0.65)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // City Header - 180px (reduced)
  cityHeaderContainer: {
    height: 180,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  cityBackground: {
    flex: 1,
  },
  cityBackgroundImage: {
    borderRadius: 24,
  },
  cityGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  cityFrostedCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
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
  cityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#E9D4A0',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  cityDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Large Centered Date Pill - Refined, smaller and elegant
  cityDatePillContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  cityDatePill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(25,25,25,0.75)',
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
  },
  cityDatePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B59B73',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Category Section (Full Width)
  categorySection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  // Frosted Glass Pane - EXACT Gallery Style
  frostedPanel: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 24,
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

  // Category Date (Prominent & Fancy)
  categoryDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B59B73',
    textTransform: 'uppercase',
    letterSpacing: 3.5,
    marginBottom: 20,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(181,155,115,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    overflow: 'hidden',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    ...Platform.select({
      web: {
        textShadow: '0 2px 8px rgba(181,155,115,0.4)',
      },
      default: {
        shadowColor: '#B59B73',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  
  // Category Header with Bronze Icon
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  browseIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  // Section Status Pills
  sectionStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  sectionStatusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  categoryDivider: {
    height: 1,
    backgroundColor: 'rgba(181,155,115,0.25)',
    marginBottom: 20,
  },

  // Card Date Badge (Darker shade for visibility)
  cardDateBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(181,155,115,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.5)',
  },
  cardDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C9A96D',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Date Badge on Image Cards (Dark frosted glass with light bronze text)
  cardDateBadgeOnImage: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(25,25,25,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    zIndex: 10,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(15px)',
      },
    }),
  },

  // Arrow Icon Top Right on Image Cards (Diagonal)
  cardArrowIconTopRightOnImage: {
    position: 'absolute',
    top: 12,
    right: 70,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transform: [{rotate: '-45deg'}],
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
      },
    }),
  },

  // Arrow Icon Top Right on Frosted Panes (Diagonal)
  cardArrowIconTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '-45deg'}],
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
      },
    }),
  },

  // Flight Card Top Row (Traveler + Date)
  flightCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 20,
  },
  
  // Arrow Icon on Frosted Pane (Top Right, for ALL categories)
  cardArrowIconOnPane: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '-45deg'}],
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
      },
    }),
  },

  // Flight Card - Image-Based with Frosted Glass (Reduced Height)
  flightCard: {
    width: 300,
    height: 260,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  flightImageCardBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  flightImageCardBgStyle: {
    borderRadius: 24,
  },
  flightImageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '65%',
  },
  flightImageCardFrosted: {
    padding: 18,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.25)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
      },
    }),
  },
  removeFlightButton: {
    position: 'absolute',
    top: 16,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(25,25,25,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cardDateBadgeOnImageLeft: {
    position: 'absolute',
    top: 16,
    left: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(25,25,25,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    zIndex: 10,
  },
  flightCardTraveler: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(181,155,115,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightCardRoute: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  flightCardAirline: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(181,155,115,0.9)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightCardTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightCardDetails: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Flight Input Card
  flightInputCard: {
    width: 300,
    backgroundColor: 'rgba(40,40,40,0.5)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.25)',
    padding: 20,
    marginRight: 0,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4), inset 2px 2px 0 rgba(255,255,255,0.08)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
      },
    }),
  },
  flightInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(181,155,115,0.85)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightInput: {
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
    padding: 14,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  addFlightButton: {
    backgroundColor: 'rgba(181,155,115,0.3)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.5)',
  },
  addFlightButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B59B73',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // External Icon Top-Left
  externalIconTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(181,155,115,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  externalIconCircleSmall: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(181,155,115,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stay Content
  stayContent: {
    flexDirection: 'row',
    position: 'relative',
  },
  stayImage: {
    width: 110,
    height: 110,
    marginRight: 16,
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
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stayAddress: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCheckin: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCheckout: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayPlatform: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Horizontal Scroll
  horizontalScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },

  // Horizontal Card (Transport)
  horizontalCard: {
    width: 280,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 20,
    marginRight: 16,
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
  horizontalCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  horizontalCardRoute: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  horizontalCardTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.9)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  horizontalCardDuration: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.75)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Experience Image Card
  experienceImageCard: {
    width: 280,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  experienceImageCardBg: {
    flex: 1,
  },
  experienceImageCardBgStyle: {
    borderRadius: 24,
  },
  experienceImageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  experienceImageCardFrosted: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 16,
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
  experienceCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  experienceCardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  experienceCardDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  experienceCardLocation: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.75)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Restaurant Image Card
  restaurantImageCard: {
    width: 280,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  restaurantImageCardBg: {
    flex: 1,
  },
  restaurantImageCardBgStyle: {
    borderRadius: 24,
  },
  restaurantImageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  restaurantImageCardFrosted: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 16,
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
  restaurantCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  restaurantCardDetails: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Horizontal Scroll
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },

  // Horizontal Card (Transport)
  horizontalCard: {
    width: 220,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.1)',
    padding: 16,
    marginRight: 12,
    position: 'relative',
  },
  horizontalCardLast: {
    marginRight: 0,
  },
  horizontalCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  horizontalCardTime: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  horizontalCardDuration: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Image Card (Experiences/Restaurants)
  imageCard: {
    width: 220,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  imageCardLast: {
    marginRight: 0,
  },
  imageCardBackground: {
    flex: 1,
  },
  imageCardBackgroundImage: {
    borderRadius: 20,
  },
  imageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  imageCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  imageCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  imageCardDetails: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Trip Summary
  summaryContainer: {
    marginTop: 32,
  },
  summaryHeroContainer: {
    height: 240,
    marginBottom: 24,
  },
  summaryHeroBackground: {
    flex: 1,
  },
  summaryHeroBackgroundImage: {
    // No border radius
  },
  summaryHeroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  summaryHeroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  summarySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Stats Grid
  statsGrid: {
    gap: 14,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIcon: {
    fontSize: 18,
  },
  statText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  statsCaption: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(181,155,115,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Reflection
  reflectionContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 48,
  },
  reflectionText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  galleryButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 23,
    backgroundColor: '#B59B73',
  },
  galleryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Bottom Dock (Matching Landing Page)
  dockWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  dockLabel: {
    fontSize: 14,
    color: '#F8F8F8',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockLabelActive: {
    fontSize: 14,
    color: '#C9A96D',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  dockLabelInactive: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },

  bottomSpacing: {
    height: 40,
  },

  // Stay Image Card - Same as Transport
  stayImageCard: {
    width: 300,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  stayImageCardBg: {
    flex: 1,
  },
  stayImageCardBgStyle: {
    borderRadius: 24,
  },
  stayImageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  stayImageCardFrosted: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 16,
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
  stayCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stayCardAddress: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardPriceNights: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardPrice: {
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
  },
  stayCardNights: {
    fontWeight: '400',
    color: 'rgba(181,155,115,0.9)',
  },

  // Transport Image Card
  transportImageCard: {
    width: 300,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  transportImageCardBg: {
    flex: 1,
  },
  transportImageCardBgStyle: {
    borderRadius: 24,
  },
  transportImageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  transportImageCardFrosted: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 16,
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
  transportTypeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(13,13,13,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  transportCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  transportCardRoute: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  transportCardTime: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  transportCardTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  transportCardDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  transportCardTimeSeparator: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.6)',
    marginHorizontal: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  transportCardDuration: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.75)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Edit Pane Styles
  // Luxury Edit Pane Styles - Apple × Aman Resort Aesthetic
  luxuryEditOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  luxuryEditBlurFallback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  luxuryEditPane: {
    width: '88%',
    maxWidth: 480,
    height: '78%',
    backgroundColor: '#0C0C0C',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(214,193,152,0.15)',
        background: 'linear-gradient(165deg, rgba(255,180,120,0.12) 0%, rgba(212,140,90,0.18) 25%, rgba(80,50,40,0.35) 60%, rgba(60,45,50,0.5) 85%, rgba(30,25,28,0.75) 100%)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 16,
      },
    }),
  },
  luxuryEditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(214,193,152,0.15)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 100,
  },
  luxuryCloseButton: {
    position: 'absolute',
    top: 18,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245,240,230,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
  },
  luxuryEditScroll: {
    flex: 1,
  },
  luxuryEditScrollContent: {
    padding: 18,
    paddingTop: 12,
    paddingBottom: 120, // Increased to ensure delete button is visible
  },
  luxuryEditTitleContainer: {
    alignItems: 'center',
  },
  luxuryEditTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  luxuryDivider: {
    height: 0.5,
    backgroundColor: 'rgba(214,193,152,0.2)',
    marginVertical: 16,
  },
  luxurySection: {
    marginBottom: 2,
  },
  luxurySectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  charCounter: {
    fontSize: 11,
    color: 'rgba(181,155,115,0.6)',
    textAlign: 'right',
    marginTop: 4,
  },
  luxuryFieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(245,240,230,0.6)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxuryInputLarge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    color: 'rgba(245,240,230,0.95)',
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxuryInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: 'rgba(245,240,230,0.95)',
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxuryInputText: {
    fontSize: 15,
    color: 'rgba(245,240,230,0.95)',
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Date Select Styles
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dateSelect: {
    flex: 2,
  },
  dateSelectSmall: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(214,193,152,0.75)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  selectWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 14,
    color: 'rgba(245,240,230,0.9)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Travelers Stepper
  travelersSection: {
    marginTop: 18,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    minWidth: 30,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Error & Summary
  errorHint: {
    fontSize: 12,
    color: 'rgba(255,120,120,0.85)',
    fontStyle: 'italic',
    marginTop: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  tripSummary: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(214,193,152,0.85)',
    marginTop: 16,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Picker Dropdown Styles
  pickerDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: 'rgba(20,20,20,0.98)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
    maxHeight: 200,
    zIndex: 1000,
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
  pickerScroll: {
    maxHeight: 200,
  },
  pickerOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(214,193,152,0.1)',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(245,240,230,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Trip Change Message
  tripChangeMessageContainer: {
    padding: 12,
    backgroundColor: 'rgba(201,169,109,0.08)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(201,169,109,0.25)',
    marginBottom: 16,
  },
  tripChangeMessage: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(201,169,109,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Coverage Bar
  coverageBar: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.12)',
  },
  coverageText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Assign All Button
  assignAllButton: {
    backgroundColor: 'rgba(201,180,124,0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,180,124,0.35)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  assignAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // City Card Styles
  cityCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    padding: 14,
    marginBottom: 12,
    overflow: 'visible',
  },
  cityCardActive: {
    backgroundColor: 'rgba(201,180,124,0.12)',
    borderColor: 'rgba(201,180,124,0.35)',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(201,180,124,0.3)',
      },
      default: {
        shadowColor: 'rgba(201,180,124,0.6)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  cityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityCardName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(245,240,230,0.9)',
    marginLeft: 12,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  cityDateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cityDateGroup: {
    flex: 1,
  },
  cityDateLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityDateFields: {
    flexDirection: 'row',
    gap: 6,
  },
  cityDateField: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  cityDateFieldLocked: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    opacity: 0.5,
  },
  cityDateFieldText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(245,240,230,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityDateFieldTextLocked: {
    color: 'rgba(245,240,230,0.5)',
  },
  cityNights: {
    fontSize: 11,
    color: 'rgba(214,193,152,0.65)',
    marginTop: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityUnassignedText: {
    fontSize: 11,
    color: 'rgba(180,180,180,0.6)',
    marginTop: 8,
    fontStyle: 'italic',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityValidationMessage: {
    fontSize: 11,
    color: 'rgba(255,160,80,0.85)',
    marginTop: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityErrorContainer: {
    marginTop: 8,
    gap: 4,
  },
  cityError: {
    fontSize: 11,
    color: 'rgba(255,100,100,0.9)',
    fontStyle: 'italic',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  pickerOptionDisabled: {
    opacity: 0.3,
  },
  pickerOptionTextDisabled: {
    color: 'rgba(245,240,230,0.3)',
  },
  // Floating Calendar Styles
  floatingCalendar: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.2)',
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.9)',
    marginBottom: 14,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  calendarDay: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  calendarDaySelected: {
    backgroundColor: 'rgba(201,180,124,0.25)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(201,180,124,0.4)',
      },
    }),
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(245,240,230,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  calendarDayTextSelected: {
    color: 'rgba(201,180,124,0.95)',
    fontWeight: '600',
  },
  // Per-City Date Styles
  luxuryCityRow: {
    marginBottom: 12,
  },
  luxuryCityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  luxuryCityPillValid: {
    borderColor: 'rgba(201,180,124,0.35)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 8px rgba(201,180,124,0.2)',
      },
    }),
  },
  cityDateField: {
    flex: 1,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 0.5,
    borderColor: 'rgba(150,150,150,0.2)',
  },
  cityDateFieldValid: {
    backgroundColor: 'rgba(201,180,124,0.1)',
    borderColor: 'rgba(201,180,124,0.3)',
    ...Platform.select({
      web: {
        boxShadow: '0 0 6px rgba(201,180,124,0.15)',
      },
    }),
  },
  cityDateText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(245,240,230,0.75)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  inlineCityDatePicker: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.12)',
  },
  cityPickerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(214,193,152,0.8)',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityDateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cityDateDay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
  },
  cityDateDayText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(245,240,230,0.75)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxurySaveButtonDisabled: {
    opacity: 0.5,
  },
  luxurySaveTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  luxuryRow: {
    flexDirection: 'row',
    gap: 14,
  },
  luxuryRowItem: {
    flex: 1,
  },
  luxuryCityList: {
    gap: 10,
  },
  draggableListContainer: {
    flex: 1,
  },
  luxuryCityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  luxuryReorderHandle: {
    flexDirection: 'column',
    gap: 3,
    marginRight: 12,
  },
  luxuryDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  luxuryCityName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(245,240,230,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxuryDeleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  luxuryAddCitySection: {
    marginTop: 16,
  },
  luxuryCityResults: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.12)',
    overflow: 'hidden',
  },
  luxuryCityResult: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(214,193,152,0.08)',
  },
  luxuryCityResultText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(245,240,230,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxuryNotAvailableText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(214,193,152,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Save Blocked Message
  saveBlockedMessage: {
    padding: 12,
    backgroundColor: 'rgba(255,160,80,0.08)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,160,80,0.25)',
    marginTop: 24,
    alignItems: 'center',
  },
  saveBlockedText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,180,100,0.9)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxurySaveButton: {
    borderRadius: 14,
    marginTop: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 3px 12px rgba(201,180,124,0.3), inset 0 0.5px 0 rgba(255,255,255,0.1)',
      },
      default: {
        shadowColor: 'rgba(201,180,124,0.6)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  luxurySaveGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  luxurySaveText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.9)',
    marginTop: 20,
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  emptyStateText: {
    fontSize: 15,
    color: 'rgba(214,193,152,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  emptyStateButton: {
    backgroundColor: 'rgba(201,180,124,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,180,124,0.4)',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C9A65B',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Status Pill Styles (Read-only)
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    ...Platform.select({
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Hero Progress Bar - Redesigned
  heroProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  heroProgressBar: {
    flex: 1,
    height: 8, // Increased from 6px to 8px for better visual weight
    borderRadius: 4, // Soft rounded ends - pill of light
    overflow: 'visible', // Changed to visible to show capsule
    position: 'relative',
  },
  progressTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    // Inner shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  heroProgressFill: {
    height: '100%',
    borderRadius: 4,
    position: 'relative',
    zIndex: 1,
    // Faint glow effect
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(255,220,160,0.3)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  progressLeadingEdge: {
    position: 'absolute',
    right: -0.5,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 1,
  },
  progressCapsule: {
    position: 'absolute',
    height: 24,
    minWidth: 45,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(30,30,32,0.75)',
    borderWidth: 0.5,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    top: -8,
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
      },
    }),
  },
  progressCapsuleCompleted: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  progressCapsuleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F5E6C8',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  progressCapsuleTextCompleted: {
    color: 'rgba(255,255,255,0.9)', // Matte white embossed
    fontWeight: '700',
  },
  heroProgressText: {
    fontSize: 11,
    color: 'rgba(214,193,152,0.8)',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Delete Button Styles
  deleteButton: {
    marginTop: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#B85C5C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  // Delete Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  deleteModalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.2)',
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  deleteModalBody: {
    fontSize: 14,
    color: 'rgba(214,193,152,0.8)',
    lineHeight: 21,
    marginBottom: 24,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteModalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalCancelText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(245,240,230,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  deleteModalConfirmButton: {
    flex: 1,
    backgroundColor: 'rgba(184,92,92,0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(184,92,92,0.4)',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalConfirmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B85C5C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Bottom Dock Styles
  bottomDock: {
    position: 'absolute',
    bottom: 13, // 12-14px bottom offset for floating
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dockContainer: {
    width: '93%', // 92-94% of screen
    height: 68, // 66-72px height
    borderRadius: 30, // 28-34px corner radius
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 40,
      },
      android: {
        elevation: 20,
      },
      web: {
        boxShadow: '0 10px 40px rgba(0,0,0,0.45), 0 18px 40px rgba(0,0,0,0.42), inset 0 0 2px rgba(255,255,255,0.30), inset 0 1px 0 rgba(255,255,255,0.10)',
      },
    }),
  },
  dockContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)', // Base layer for gradient
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, // Safe-area padding
    ...Platform.select({
      web: {
        backdropFilter: 'blur(22px)',
      },
    }),
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    position: 'relative',
    minWidth: 44, // Minimum 44x44 hit area
    minHeight: 44,
  },
  dockLabelActive: {
    fontSize: 12, // 11-12px
    fontWeight: '500',
    color: 'rgba(255,255,255,0.95)', // Active state
    marginTop: 4,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, sans-serif',
    }),
  },
  dockLabelInactive: {
    fontSize: 12, // 11-12px
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)', // Default state
    marginTop: 4,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, sans-serif',
    }),
  },
});

