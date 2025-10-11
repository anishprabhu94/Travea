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
import { LinearGradient } from 'expo-linear-gradient';

// "Frosted Editorial System v3" - Luxury Travel Chronicle
const tripData = {
  tripName: 'Summer in Italy',
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
          traveler: 'Traveler 1',
          date: 'Jun 8',
          route: 'FCO → NAP',
          airline: 'ITA AZ 1234',
          time: '09:40 – 10:45 · 1h 05m Nonstop',
          details: 'T3 Gate C12 · 1 Checked · Seat 12A Window',
        },
        {
          id: '1b',
          traveler: 'Traveler 2',
          date: 'Jun 8',
          route: 'FCO → NAP',
          airline: 'ITA AZ 1234',
          time: '09:40 – 10:45 · 1h 05m Nonstop',
          details: 'T3 Gate C12 · 1 Checked · Seat 12B Window',
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
          title: 'Private Transfer',
          date: 'Jun 8',
          time: '10 AM',
          route: 'Piazza Duomo → Villa Cimbrone',
          duration: '45 min · Car',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        },
        {
          id: '2',
          title: 'Ferry to Capri',
          date: 'Jun 9',
          time: '2 PM',
          route: 'Amalfi Pier → Capri Port',
          duration: '1h 15 min · Boat',
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
          title: 'Cooking Class at Nonna Lucia\'s',
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
      city: 'Ravello, Italy',
      dates: 'Jun 10–11',
      description: 'Where silence hums between lemon trees.',
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
      id: 'day5-7',
      label: 'Day 5–7',
      city: 'Capri, Italy',
      dates: 'Jun 12–14',
      description: 'Where cliffs meet the breeze.',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      flights: [
        {
          id: '2',
          traveler: 'Traveler 1',
          date: 'Jun 14',
          route: 'NAP → FCO',
          airline: 'ITA AZ 5678',
          time: '16:00 – 17:10 · 1h 10m Nonstop',
          details: 'T1 Gate B8 · 1 Checked · Seat 14F Window',
        },
        {
          id: '2b',
          traveler: 'Traveler 2',
          date: 'Jun 14',
          route: 'NAP → FCO',
          airline: 'ITA AZ 5678',
          time: '16:00 – 17:10 · 1h 10m Nonstop',
          details: 'T1 Gate B8 · 1 Checked · Seat 14G Window',
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

export default function TripCanvas() {
  const [activeDayId, setActiveDayId] = useState('day1-2');
  const [tripStatus, setTripStatus] = useState('Planning');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  const activeDay = tripData.days.find(d => d.id === activeDayId) || tripData.days[0];
  
  const statusOptions = ['Planning', 'Upcoming', 'Ongoing', 'Completed'];

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
            <TouchableOpacity style={styles.editIconButton} activeOpacity={0.7}>
              <Ionicons name="create-outline" size={18} color="rgba(181,155,115,0.9)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.heroSubtitle}>{tripData.subtitle}</Text>
          
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
          
          {/* City Strip - Centered Pills */}
          <View style={styles.cityStrip}>
            {tripData.cities.map((city, index) => (
              <View 
                key={city}
                style={styles.cityCapsuleWrapper}
              >
                <View style={[
                  styles.cityCapsule,
                  index === tripData.activeCityIndex && styles.cityCapsuleActive
                ]}>
                  <Text style={[
                    styles.cityCapsuleText,
                    index === tripData.activeCityIndex && styles.cityCapsuleTextActive
                  ]}>
                    {city}
                  </Text>
                </View>
                {index < tripData.cities.length - 1 && (
                  <View style={styles.cityDot} />
                )}
              </View>
            ))}
          </View>
          
          {/* Day Selector Tabs - Expanded & Centered */}
          <View style={styles.dayTabsContainer}>
            <View style={styles.dayTabs}>
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
          <Text style={styles.cityName}>{activeDay.city}</Text>
          <Text style={styles.cityDates}>{activeDay.dates}</Text>
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
            <Ionicons name="airplane" size={18} color="#B59B73" style={{marginRight: 8}} />
            <Text style={styles.categoryTitle}>Flights</Text>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.flights.map((flight, index) => (
              <View 
                key={flight.id} 
                style={[styles.flightCard, index === activeDay.flights.length - 1 && {marginRight: 0}]}
              >
                <View style={styles.cardDateBadge}>
                  <Text style={styles.cardDateText}>{flight.date}</Text>
                </View>
                <Text style={styles.flightCardTraveler}>{flight.traveler}</Text>
                <View style={styles.flightCardHeader}>
                  <Text style={styles.flightCardRoute}>{flight.route}</Text>
                </View>
                <Text style={styles.flightCardAirline}>{flight.airline}</Text>
                <Text style={styles.flightCardTime}>{flight.time}</Text>
                <Text style={styles.flightCardDetails}>{flight.details}</Text>
              </View>
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
            <Ionicons name="bed" size={18} color="#B59B73" style={{marginRight: 8}} />
            <Text style={styles.categoryTitle}>Stays</Text>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.stays.map((stay, index) => (
              <View 
                key={stay.id} 
                style={[styles.stayImageCard, index === activeDay.stays.length - 1 && {marginRight: 0}]}
              >
                <ImageBackground
                  source={{ uri: stay.image }}
                  style={styles.stayImageCardBg}
                  imageStyle={styles.stayImageCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.stayImageCardGradient}
                  />
                  <View style={styles.stayImageCardFrosted}>
                    <View style={styles.cardDateBadge}>
                      <Text style={styles.cardDateText}>{stay.dates}</Text>
                    </View>
                    <Text style={styles.stayCardName}>{stay.name}</Text>
                    <Text style={styles.stayCardAddress}>{stay.address}</Text>
                    <Text style={styles.stayCardTimes}>{stay.checkin} · {stay.checkout}</Text>
                    <Text style={styles.stayCardPlatform}>{stay.platform}</Text>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Transport Section - Horizontal Scroll
  const renderTransport = () => {
    if (activeDay.transport.length === 0) return null;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.categoryHeader}>
            <Ionicons name="car" size={18} color="#B59B73" style={{marginRight: 8}} />
            <Text style={styles.categoryTitle}>Transport</Text>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.transport.map((item, index) => (
              <View 
                key={item.id} 
                style={[styles.transportImageCard, index === activeDay.transport.length - 1 && {marginRight: 0}]}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.transportImageCardBg}
                  imageStyle={styles.transportImageCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.transportImageCardGradient}
                  />
                  <View style={styles.transportImageCardFrosted}>
                    <View style={styles.cardDateBadge}>
                      <Text style={styles.cardDateText}>{item.date}</Text>
                    </View>
                    <Text style={styles.transportCardTitle}>{item.title}</Text>
                    <Text style={styles.transportCardRoute}>{item.route}</Text>
                    <Text style={styles.transportCardTime}>Leave: {item.time}</Text>
                    <Text style={styles.transportCardDuration}>{item.duration}</Text>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Experiences Section - Horizontal Scroll
  const renderExperiences = () => {
    if (activeDay.experiences.length === 0) return null;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <Text style={styles.categoryDate}>{activeDay.dates}</Text>
          <View style={styles.categoryHeader}>
            <Ionicons name="ticket" size={18} color="#B59B73" style={{marginRight: 8}} />
            <Text style={styles.categoryTitle}>Experiences</Text>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.experiences.map((exp, index) => (
              <View 
                key={exp.id} 
                style={[styles.experienceImageCard, index === activeDay.experiences.length - 1 && {marginRight: 0}]}
              >
                <ImageBackground
                  source={{ uri: exp.image }}
                  style={styles.experienceImageCardBg}
                  imageStyle={styles.experienceImageCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.experienceImageCardGradient}
                  />
                  <View style={styles.experienceImageCardFrosted}>
                    <Text style={styles.experienceCardTitle}>{exp.title}</Text>
                    <Text style={styles.experienceCardDetails}>Start: {exp.startTime} · Duration: {exp.duration}</Text>
                    <Text style={styles.experienceCardLocation}>{exp.location}</Text>
                  </View>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  // Restaurants Section - Horizontal Scroll
  const renderRestaurants = () => {
    if (activeDay.restaurants.length === 0) return null;
    
    return (
      <View style={styles.categorySection}>
        <View style={styles.frostedPanel}>
          <Text style={styles.categoryDate}>{activeDay.dates}</Text>
          <View style={styles.categoryHeader}>
            <Ionicons name="restaurant" size={18} color="#B59B73" style={{marginRight: 8}} />
            <Text style={styles.categoryTitle}>Restaurants</Text>
          </View>
          <View style={styles.categoryDivider} />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {activeDay.restaurants.map((rest, index) => (
              <View 
                key={rest.id} 
                style={[styles.restaurantImageCard, index === activeDay.restaurants.length - 1 && {marginRight: 0}]}
              >
                <ImageBackground
                  source={{ uri: rest.image }}
                  style={styles.restaurantImageCardBg}
                  imageStyle={styles.restaurantImageCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.restaurantImageCardGradient}
                  />
                  <View style={styles.restaurantImageCardFrosted}>
                    <Text style={styles.restaurantCardTitle}>{rest.name}</Text>
                    <Text style={styles.restaurantCardDetails}>{rest.time} · {rest.details}</Text>
                  </View>
                </ImageBackground>
              </View>
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('/landing')}
        >
          <Ionicons name="home-outline" size={22} color="rgba(255,255,255,0.7)" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('/trips')}
        >
          <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
          <Text style={styles.navLabel}>My Trips</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar" size={22} color="#B59B73" />
          <Text style={styles.navLabelActive}>Trip Canvas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="rgba(255,255,255,0.7)" />
          <Text style={styles.navLabel}>Concierge</Text>
        </TouchableOpacity>
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

  // Hero Panel - 340px with darkened background
  heroContainer: {
    height: 340,
    marginBottom: 0,
  },
  heroBackground: {
    flex: 1,
  },
  heroBackgroundImage: {
    opacity: 0.95,
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
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
    padding: 24,
    alignItems: 'center',
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
    gap: 12,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  editIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 16,
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

  // City Strip - Centered with Dots
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

  // Day Tabs - Expanded & Centered
  dayTabsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  dayTabs: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 6,
    width: '95%',
  },
  dayTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabActive: {
    backgroundColor: '#B59B73',
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
  cityName: {
    fontSize: 22,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  cityDates: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.95)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
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
    marginBottom: 12,
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

  // Flight Card - Frosted Glass (No Image)
  flightCard: {
    width: 300,
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
  flightCardTraveler: {
    fontSize: 11,
    fontWeight: '600',
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
    fontSize: 22,
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
  experienceCardDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.9)',
    marginBottom: 4,
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

  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.select({ ios: 20, default: 0 }),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  navLabelActive: {
    fontSize: 11,
    fontWeight: '500',
    color: '#B59B73',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
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
  transportCardDuration: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.75)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
});
