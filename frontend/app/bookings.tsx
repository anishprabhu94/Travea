import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

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
  const [activeDayId, setActiveDayId] = useState('day1-2');
  const [tripStatus, setTripStatus] = useState('Planning');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showEditPane, setShowEditPane] = useState(false);
  
  // Editable trip state with new date system
  const [editableTripName, setEditableTripName] = useState(tripData.tripName);
  const [tripStartMonth, setTripStartMonth] = useState('June');
  const [tripStartDay, setTripStartDay] = useState(8);
  const [tripEndMonth, setTripEndMonth] = useState('June');
  const [tripEndDay, setTripEndDay] = useState(15);
  const [editableTravelers, setEditableTravelers] = useState(2);
  const [editableCities, setEditableCities] = useState([...tripData.cities]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showMonthPicker, setShowMonthPicker] = useState<{type: 'start' | 'end' | null, cityIndex?: number}>({type: null});
  const [showDayPicker, setShowDayPicker] = useState<{type: 'start' | 'end' | null, cityIndex?: number}>({type: null});
  const [cityDates, setCityDates] = useState<{[key: string]: {startMonth: string, startDay: number, endMonth: string, endDay: number}}>({
    'FLR': {startMonth: 'June', startDay: 8, endMonth: 'June', endDay: 9},
    'ROM': {startMonth: 'June', startDay: 10, endMonth: 'June', endDay: 11},
    'VCE': {startMonth: 'June', startDay: 12, endMonth: 'June', endDay: 13},
    'AML': {startMonth: 'June', startDay: 14, endMonth: 'June', endDay: 15},
  });
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthDays = {
    'January': 31, 'February': 28, 'March': 31, 'April': 30, 'May': 31, 'June': 30,
    'July': 31, 'August': 31, 'September': 30, 'October': 31, 'November': 30, 'December': 31
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
  
  // Check if save should be enabled
  const canSave = () => {
    const duration = getTripDuration();
    const coverage = getCoverage();
    return duration > 0 && coverage === duration && editableCities.every(city => {
      const dates = cityDates[city];
      return dates && dates.startMonth && dates.startDay && dates.endMonth && dates.endDay;
    });
  };
  
  const activeDay = tripData.days.find(d => d.id === activeDayId) || tripData.days[0];
  const activeCityCode = activeDay.cityCode;
  
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
            <Text style={styles.heroTitle}>{tripData.tripName}</Text>
          </View>
          <View style={styles.heroSubtitleRow}>
            <Text style={styles.heroSubtitle}>
              <Text style={{fontWeight: '700'}}>{tripStartMonth.substring(0,3)} {tripStartDay}–{tripEndMonth.substring(0,3)} {tripEndDay}</Text>
              {' · '}
              <Text style={{fontWeight: '700'}}>{editableTravelers} Travelers</Text>
            </Text>
            <TouchableOpacity 
              style={styles.editIconButton} 
              activeOpacity={0.7}
              onPress={() => setShowEditPane(true)}
            >
              <Ionicons name="create-outline" size={14} color="rgba(181,155,115,0.9)" />
            </TouchableOpacity>
          </View>
          
          {/* Status Dropdown */}
          <TouchableOpacity 
            style={styles.statusCapsule}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            activeOpacity={0.7}
          >
            <Text style={styles.statusText}>{tripStatus}</Text>
            <Ionicons name="chevron-down" size={14} color="rgba(181,155,115,0.8)" style={{marginLeft: 6}} />
          </TouchableOpacity>
          
          {showStatusDropdown && (
            <View style={styles.statusDropdownMenu}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.statusDropdownItem}
                  onPress={() => {
                    setTripStatus(status);
                    setShowStatusDropdown(false);
                  }}
                >
                  <Text style={styles.statusDropdownText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* City Strip - Horizontal Scrollable Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.cityStripScroll}
            contentContainerStyle={styles.cityStripContent}
          >
            {editableCities.map((city, index) => (
              <View 
                key={city}
                style={styles.cityCapsuleWrapper}
              >
                <View style={[
                  styles.cityCapsule,
                  city === activeCityCode && styles.cityCapsuleActive
                ]}>
                  <Text style={[
                    styles.cityCapsuleText,
                    city === activeCityCode && styles.cityCapsuleTextActive
                  ]}>
                    {city}
                  </Text>
                </View>
                {index < editableCities.length - 1 && (
                  <View style={styles.cityDot} />
                )}
              </View>
            ))}
          </ScrollView>
          
          {/* Day Selector Tabs - Scrollable & Elegant */}
          <View style={styles.dayTabsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.dayTabsScroll}
              contentContainerStyle={styles.dayTabsContent}
            >
              {tripData.days.map((day) => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayTab,
                    activeDayId === day.id && styles.dayTabActive
                  ]}
                  onPress={() => setActiveDayId(day.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dayTabText,
                    activeDayId === day.id && styles.dayTabTextActive
                  ]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
        
        {/* Date badge on card image (top right) */}
        <View style={styles.cardDateBadgeOnImage}>
          <Text style={styles.cardDateText}>{activeDay.dates.toUpperCase()}</Text>
        </View>
        
        {/* Frosted glass card for city info */}
        <View style={styles.cityFrostedCard}>
          <View style={styles.cityHeaderRow}>
            <Text style={styles.cityName}>{activeDay.city}</Text>
          </View>
          <Text style={styles.cityDescription}>{activeDay.description}</Text>
        </View>
      </ImageBackground>
    </View>
  );

  // Flights Section - Frosted Glass Cards (No Images)
  const renderFlights = () => {
    if (activeDay.flights.length === 0) return null;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="airplane" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Flights</Text>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push('/book-journey')}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.flights.map((flight, index) => (
              <TouchableOpacity 
                key={flight.id} 
                style={[styles.flightCard, index === activeDay.flights.length - 1 && {marginRight: 0}]}
                activeOpacity={0.8}
              >
                <View style={styles.flightCardTopRow}>
                  <Text style={styles.flightCardTraveler}>{flight.traveler}</Text>
                  <View style={styles.cardDateBadge}>
                    <Text style={styles.cardDateText}>{flight.date}</Text>
                  </View>
                </View>
                <View style={styles.flightCardHeader}>
                  <Text style={styles.flightCardRoute}>{flight.route}</Text>
                </View>
                <Text style={styles.flightCardAirline}>{flight.airline}</Text>
                <Text style={styles.flightCardTime}>{flight.time}</Text>
                <Text style={styles.flightCardDetails}>{flight.details}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Stays Section - Image-Based Cards
  const renderStays = () => {
    if (activeDay.stays.length === 0) return null;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="bed" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Stays</Text>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push('/book-journey')}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.stays.map((stay, index) => (
              <TouchableOpacity 
                key={stay.id} 
                style={[styles.stayImageCard, index === activeDay.stays.length - 1 && {marginRight: 0}]}
                activeOpacity={0.8}
                onPress={() => router.push('/stay-info-compact')}
              >
                <ImageBackground
                  source={{ uri: stay.image }}
                  style={styles.stayImageCardBg}
                  imageStyle={styles.stayImageCardBgStyle}
                >
                  <View style={styles.cardDateBadgeOnImage}>
                    <Text style={styles.cardDateText}>{stay.dates.toUpperCase()}</Text>
                  </View>
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.stayImageCardGradient}
                  />
                  <View style={styles.stayImageCardFrosted}>
                    <Text style={styles.stayCardName}>{stay.name}</Text>
                    <Text style={styles.stayCardAddress}>{stay.address}</Text>
                    <Text style={styles.stayCardTimes}>{stay.checkin} · {stay.checkout}</Text>
                    <Text style={styles.stayCardPlatform}>{stay.platform}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Transport Section - Horizontal Scroll
  const renderTransport = () => {
    if (activeDay.transport.length === 0) return null;
    
    // Get unique dates for transport items
    const uniqueDates = [...new Set(activeDay.transport.map(item => item.date))];
    const displayDate = uniqueDates.length === 1 ? uniqueDates[0] : `${uniqueDates[0]} – ${uniqueDates[uniqueDates.length - 1]}`;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="car" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Transport</Text>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push('/book-journey')}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.transport.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.transportImageCard, index === activeDay.transport.length - 1 && {marginRight: 0}]}
                activeOpacity={0.8}
                onPress={() => {
                  // Navigate based on transport type
                  if (item.type === 'train') {
                    router.push('/train-info');
                  } else if (item.type === 'bus') {
                    router.push('/bus-info');
                  } else if (item.type === 'rental-car') {
                    router.push('/car-rental-info');
                  } else if (item.type === 'ferry') {
                    router.push('/ferry-info');
                  }
                }}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.transportImageCardBg}
                  imageStyle={styles.transportImageCardBgStyle}
                >
                  <View style={styles.cardDateBadgeOnImage}>
                    <Text style={styles.cardDateText}>{item.date.toUpperCase()}</Text>
                  </View>
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.transportImageCardGradient}
                  />
                  <View style={styles.transportImageCardFrosted}>
                    {/* Transport Type Icon - Top Right */}
                    <View style={styles.transportTypeIcon}>
                      <Ionicons 
                        name={
                          item.type === 'train' ? 'train-outline' :
                          item.type === 'bus' ? 'bus-outline' :
                          item.type === 'rental-car' ? 'car-sport-outline' :
                          item.type === 'ferry' ? 'boat-outline' :
                          'navigate-outline'
                        } 
                        size={20} 
                        color="rgba(181,155,115,0.95)" 
                      />
                    </View>
                    <Text style={styles.transportCardTitle}>{item.title}</Text>
                    <Text style={styles.transportCardRoute}>{item.route}</Text>
                    {item.type === 'rental-car' ? (
                      <>
                        <View style={styles.transportCardTimeRow}>
                          <Text style={styles.transportCardTime}>Pick-up: {item.time}</Text>
                        </View>
                        <View style={styles.transportCardDurationRow}>
                          <Ionicons name="calendar-outline" size={14} color="rgba(181,155,115,0.9)" />
                          <Text style={styles.transportCardDuration}>{item.duration.split('·')[0].trim()}</Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.transportCardTime}>Pick-up: {item.time}</Text>
                        <Text style={styles.transportCardDuration}>{item.duration.split('·')[0].trim()}</Text>
                      </>
                    )}
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Experiences Section - Horizontal Scroll
  const renderExperiences = () => {
    if (activeDay.experiences.length === 0) return null;
    
    // Get unique dates for experiences
    const uniqueDates = [...new Set(activeDay.experiences.map(exp => exp.date))];
    const displayDate = uniqueDates.length === 1 ? uniqueDates[0] : `${uniqueDates[0]} – ${uniqueDates[uniqueDates.length - 1]}`;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="ticket" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Experiences</Text>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push('/book-journey')}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.experiences.map((exp, index) => (
              <TouchableOpacity 
                key={exp.id} 
                style={[styles.experienceImageCard, index === activeDay.experiences.length - 1 && {marginRight: 0}]}
                activeOpacity={0.8}
                onPress={() => router.push('/experience-info')}
              >
                <ImageBackground
                  source={{ uri: exp.image }}
                  style={styles.experienceImageCardBg}
                  imageStyle={styles.experienceImageCardBgStyle}
                >
                  <View style={styles.cardDateBadgeOnImage}>
                    <Text style={styles.cardDateText}>{exp.date.toUpperCase()}</Text>
                  </View>
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.experienceImageCardGradient}
                  />
                  <View style={styles.experienceImageCardFrosted}>
                    <Text style={styles.experienceCardTitle}>{exp.title}</Text>
                    <View style={styles.experienceCardDetailsRow}>
                      <Ionicons name="time-outline" size={14} color="rgba(181,155,115,0.9)" />
                      <Text style={styles.experienceCardDetails}>
                        {'duration' in exp ? exp.duration : exp.details}
                      </Text>
                      <Text style={styles.experienceCardLocation}>· 0.4 Mi from center</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Restaurants Section - Horizontal Scroll
  const renderRestaurants = () => {
    if (activeDay.restaurants.length === 0) return null;
    
    // Get unique dates for restaurants
    const uniqueDates = [...new Set(activeDay.restaurants.map(rest => rest.date))];
    const displayDate = uniqueDates.length === 1 ? uniqueDates[0] : `${uniqueDates[0]} – ${uniqueDates[uniqueDates.length - 1]}`;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryHeaderLeft}>
              <Ionicons name="restaurant" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Restaurants</Text>
            </View>
            <TouchableOpacity 
              style={styles.browseIconButton}
              onPress={() => router.push('/book-journey')}
              activeOpacity={0.7}
            >
              <Ionicons name="compass-outline" size={18} color="rgba(203,184,140,0.8)" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.restaurants.map((rest, index) => (
              <TouchableOpacity 
                key={rest.id} 
                style={[styles.restaurantImageCard, index === activeDay.restaurants.length - 1 && {marginRight: 0}]}
                activeOpacity={0.8}
                onPress={() => router.push('/restaurant-info')}
              >
                <ImageBackground
                  source={{ uri: rest.image }}
                  style={styles.restaurantImageCardBg}
                  imageStyle={styles.restaurantImageCardBgStyle}
                >
                  <View style={styles.cardDateBadgeOnImage}>
                    <Text style={styles.cardDateText}>{rest.date.toUpperCase()}</Text>
                  </View>
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.restaurantImageCardGradient}
                  />
                  <View style={styles.restaurantImageCardFrosted}>
                    <Text style={styles.restaurantCardTitle}>{rest.name}</Text>
                    <Text style={styles.restaurantCardDetails}>{rest.time} · {rest.details}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    return (
      <Modal visible={showEditPane} transparent={true} onRequestClose={() => setShowEditPane(false)}>
        <View style={styles.luxuryEditOverlay}>
          <TouchableOpacity onPress={() => setShowEditPane(false)}><Text>Close</Text></TouchableOpacity>
        </View>
      </Modal>
    );
  };

 
            <TouchableOpacity 
              style={StyleSheet.absoluteFill} 
              onPress={() => setShowEditPane(false)}
              activeOpacity={1}
            />
            
            <View style={styles.luxuryEditPane}>
              {/* Close Button */}
              <TouchableOpacity 
                style={styles.luxuryCloseButton}
                onPress={() => setShowEditPane(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="rgba(214,193,152,0.9)" />
              </TouchableOpacity>

              <ScrollView 
                style={styles.luxuryEditScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.luxuryEditScrollContent}
              >
                {/* Subtitle */}
                <Text style={styles.luxuryEditSubtitle}>CUSTOMIZE YOUR JOURNEY</Text>
                
                {/* Title */}
                <Text style={styles.luxuryEditTitle}>Edit Trip</Text>
                
                {/* Divider */}
                <View style={styles.luxuryDivider} />

                {/* Trip Name */}
                <View style={styles.luxurySection}>
                  <TextInput
                    style={styles.luxuryInputLarge}
                    value={editableTripName}
                    onChangeText={setEditableTripName}
                    placeholder="Trip Name"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                  />
                </View>

                {/* Divider */}
                <View style={styles.luxuryDivider} />

                {/* Trip Dates & Travelers */}
                <View style={styles.luxurySection}>
                  <Text style={styles.luxurySectionLabel}>TRIP DATES & TRAVELERS</Text>
                  
                  {/* Date Row */}
                  <View style={styles.dateRow}>
                    <View style={styles.dateSelect}>
                      <Text style={styles.dateLabel}>Start Month</Text>
                      <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>{tripStartMonth}</Text>
                      </View>
                    </View>
                    <View style={styles.dateSelectSmall}>
                      <Text style={styles.dateLabel}>Day</Text>
                      <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>{tripStartDay}</Text>
                      </View>
                    </View>
                    <View style={styles.dateSelect}>
                      <Text style={styles.dateLabel}>End Month</Text>
                      <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>{tripEndMonth}</Text>
                      </View>
                    </View>
                    <View style={styles.dateSelectSmall}>
                      <Text style={styles.dateLabel}>Day</Text>
                      <View style={styles.selectWrapper}>
                        <Text style={styles.selectText}>{tripEndDay}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Travelers Stepper */}
                  <View style={styles.travelersStepper}>
                    <Text style={styles.dateLabel}>Travelers</Text>
                    <View style={styles.stepperControls}>
                      <TouchableOpacity 
                        style={styles.stepperButton}
                        onPress={() => setEditableTravelers(Math.max(1, editableTravelers - 1))}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="remove" size={18} color="rgba(214,193,152,0.9)" />
                      </TouchableOpacity>
                      <Text style={styles.stepperValue}>{editableTravelers}</Text>
                      <TouchableOpacity 
                        style={styles.stepperButton}
                        onPress={() => setEditableTravelers(editableTravelers + 1)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={18} color="rgba(214,193,152,0.9)" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Error/Summary */}
                  {isEndBeforeStart ? (
                    <Text style={styles.errorHint}>End must be after Start.</Text>
                  ) : tripDuration > 0 ? (
                    <Text style={styles.tripSummary}>
                      Trip: {tripStartMonth.substring(0,3)} {tripStartDay} – {tripEndMonth.substring(0,3)} {tripEndDay} ({tripDuration} days)
                    </Text>
                  ) : null}
                </View>

                {/* Divider */}
                <View style={styles.luxuryDivider} />

                {/* Cities & Dates */}
                <View style={styles.luxurySection}>
                  <Text style={styles.luxurySectionLabel}>CITIES & DATES</Text>
                  
                  {/* Coverage Progress */}
                  <View style={styles.coverageBar}>
                    <Text style={styles.coverageText}>Coverage: {coverage} / {tripDuration} days assigned</Text>
                    {remaining > 0 && (
                      <Text style={styles.coverageHint}>Assign remaining {remaining} days</Text>
                    )}
                  </View>

                  {/* City Cards */}
                  <View style={styles.luxuryCityList}>
                    {editableCities.map((cityCode, index) => {
                      const cityData = AVAILABLE_CITIES.find(c => c.code === cityCode);
                      const cityDate = cityDates[cityCode] || {startMonth: '', startDay: 0, endMonth: '', endDay: 0};
                      const hasValidDates = cityDate.startMonth && cityDate.startDay && cityDate.endMonth && cityDate.endDay;
                      
                      // Calculate nights
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
                        <View key={`${cityCode}-${index}`} style={styles.cityCard}>
                          <View style={styles.cityCardHeader}>
                            {/* Reorder Handle */}
                            <View style={styles.luxuryReorderHandle}>
                              <View style={styles.luxuryDot} />
                              <View style={styles.luxuryDot} />
                              <View style={styles.luxuryDot} />
                            </View>
                            
                            <Text style={styles.cityCardName}>{cityData?.name || cityCode}</Text>
                            
                            {/* Delete Button */}
                            <TouchableOpacity
                              style={styles.luxuryDeleteButton}
                              onPress={() => {
                                const newCities = editableCities.filter((_, i) => i !== index);
                                setEditableCities(newCities);
                              }}
                              activeOpacity={0.6}
                            >
                              <Ionicons name="close" size={14} color="rgba(255,255,255,0.5)" />
                            </TouchableOpacity>
                          </View>

                          {/* City Date Selects */}
                          <View style={styles.cityDateRow}>
                            <View style={styles.cityDateGroup}>
                              <Text style={styles.cityDateLabel}>Start</Text>
                              <View style={styles.cityDateFields}>
                                <View style={styles.cityDateField}>
                                  <Text style={styles.cityDateFieldText}>{cityDate.startMonth?.substring(0,3) || 'Mon'}</Text>
                                </View>
                                <View style={styles.cityDateField}>
                                  <Text style={styles.cityDateFieldText}>{cityDate.startDay || 'D'}</Text>
                                </View>
                              </View>
                            </View>
                            
                            <View style={styles.cityDateGroup}>
                              <Text style={styles.cityDateLabel}>End</Text>
                              <View style={styles.cityDateFields}>
                                <View style={styles.cityDateField}>
                                  <Text style={styles.cityDateFieldText}>{cityDate.endMonth?.substring(0,3) || 'Mon'}</Text>
                                </View>
                                <View style={styles.cityDateField}>
                                  <Text style={styles.cityDateFieldText}>{cityDate.endDay || 'D'}</Text>
                                </View>
                              </View>
                            </View>
                          </View>

                          {/* Subcaption */}
                          {hasValidDates && (
                            <Text style={styles.cityNights}>{nights} {nights === 1 ? 'night' : 'nights'}</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>

                  {/* Add City */}
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
                            <Text style={styles.luxuryNotAvailableText}>
                              This city is not available
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity 
                  style={[
                    styles.luxurySaveButton,
                    !canSave() && styles.luxurySaveButtonDisabled
                  ]}
                  onPress={() => canSave() && setShowEditPane(false)}
                  activeOpacity={canSave() ? 0.8 : 1}
                  disabled={!canSave()}
                >
                  <LinearGradient
                    colors={canSave() ? 
                      ['rgba(201,180,124,0.2)', 'rgba(184,156,115,0.25)'] : 
                      ['rgba(100,100,100,0.15)', 'rgba(80,80,80,0.2)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.luxurySaveGradient}
                  >
                    <Text style={[
                      styles.luxurySaveText,
                      !canSave() && styles.luxurySaveTextDisabled
                    ]}>
                      {canSave() ? 'Save Changes' : `Assign all ${tripDuration} days`}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </BlurView>
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

      {/* Bottom Dock - Matching Landing Page */}
      <View style={styles.dockWrapper}>
        <View style={styles.dockContainer}>
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
              onPress={() => router.push('/bookings')}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar" size={22} color="#C9A96D" />
              <Text style={styles.dockLabelActive}>Trip Canvas</Text>
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
              onPress={() => router.push('/concierge')}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Concierge</Text>
            </TouchableOpacity>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero Panel - Rounded bottom, more blur, better spacing
  heroContainer: {
    height: 360,
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
    bottom: 32,
    left: '5%',
    right: '5%',
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
  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.98)',
    textAlign: 'center',
    letterSpacing: 0.5,
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
  },
  cityStripContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
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
    fontSize: 12,
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

  // Day Tabs Container & Scrollable Tabs
  dayTabsContainer: {
    marginTop: 16,
  },
  dayTabsScroll: {
    flexGrow: 0,
  },
  dayTabsContent: {
    paddingHorizontal: 20,
    gap: 10,
    alignItems: 'center',
  },
  // dayTabs style removed - now using ScrollView with dayTabsScroll and dayTabsContent
  dayTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
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

  // City Header - 220px
  cityHeaderContainer: {
    height: 220,
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
    color: 'rgba(255,255,255,0.9)',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  cityDescription: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(181,155,115,0.9)',
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

  // Flight Card - Enhanced Frosted Glass (No Image)
  flightCard: {
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.25)',
    padding: 20,
    marginRight: 16,
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
  flightCardTraveler: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(181,155,115,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightCardHeader: {
    marginBottom: 10,
  },
  flightCardRoute: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  flightCardAirline: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(181,155,115,0.85)',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightCardTime: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.95)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightCardDetails: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
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
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardTimes: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  stayCardPlatform: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.75)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
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
  },
  luxuryEditBlur: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  luxuryEditPane: {
    width: '88%',
    maxWidth: 480,
    maxHeight: '75%',
    backgroundColor: '#0C0C0C',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(214,193,152,0.25)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(214,193,152,0.15)',
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
  luxuryCloseButton: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245,240,230,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  luxuryEditScroll: {
    flex: 1,
  },
  luxuryEditScrollContent: {
    padding: 20,
    paddingTop: 24,
  },
  luxuryEditSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(214,193,152,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  luxuryEditTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(245,240,230,0.95)',
    marginBottom: 18,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  luxuryDivider: {
    height: 0.5,
    backgroundColor: 'rgba(214,193,152,0.2)',
    marginVertical: 20,
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
  // Coverage Bar
  coverageBar: {
    marginBottom: 16,
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
  coverageHint: {
    fontSize: 11,
    color: 'rgba(214,193,152,0.6)',
    marginTop: 4,
    fontStyle: 'italic',
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
  cityDateFieldText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(245,240,230,0.85)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
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
  luxurySaveButton: {
    borderRadius: 14,
    marginTop: 36,
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
});
