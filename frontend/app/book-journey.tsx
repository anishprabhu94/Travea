import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Platform,
  StyleSheet,
  Animated,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'

export default function BookYourJourney() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [blurOpacity] = useState(new Animated.Value(0))
  const [tripStatus, setTripStatus] = useState('Planning')
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [activeDayId, setActiveDayId] = useState('day1-2')

  const toggleCategory = (category: string) => {
    const isExpanding = expandedCategory !== category
    setExpandedCategory(isExpanding ? category : null)
    
    Animated.timing(blurOpacity, {
      toValue: isExpanding ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const statusOptions = ['Planning', 'Upcoming', 'Ongoing', 'Completed']
  const tripData = {
    tripName: 'Summer in Italy',
    subtitle: 'Jun 10–16, 2025',
    cities: ['FLR', 'ROM', 'VCE', 'AML'],
    days: [
      { id: 'day1-2', label: 'Day 1-2' },
      { id: 'day3-4', label: 'Day 3-4' },
      { id: 'day5-7', label: 'Day 5-7' },
    ],
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
  }

  return (
    <View style={styles.container}>
      {/* Background blur overlay when category is expanded */}
      {expandedCategory && (
        <Animated.View 
          style={[
            styles.blurOverlay,
            { opacity: blurOpacity }
          ]}
        />
      )}

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - EXACT COPY from Trip Canvas */}
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
              {/* Back Button */}
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={18} color="rgba(181,155,115,0.9)" />
              </TouchableOpacity>

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
                        setTripStatus(status)
                        setShowStatusDropdown(false)
                      }}
                    >
                      <Text style={styles.statusDropdownText}>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {/* City Strip */}
              <View style={styles.cityStrip}>
                {tripData.cities.map((city, index) => (
                  <View 
                    key={city}
                    style={styles.cityCapsuleWrapper}
                  >
                    <View style={[
                      styles.cityCapsule,
                      index === 0 && styles.cityCapsuleActive
                    ]}>
                      <Text style={[
                        styles.cityCapsuleText,
                        index === 0 && styles.cityCapsuleTextActive
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
              
              {/* Day Selector Tabs */}
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

        {/* Category Sections */}
        <View style={styles.categoriesContainer}>
          {/* Flights Category */}
          <CategorySection
            icon="airplane"
            title="Flights"
            emoji="✈️"
            isExpanded={expandedCategory === 'flights'}
            onToggle={() => toggleCategory('flights')}
          >
            <FlightsContent />
          </CategorySection>

          {/* Stays Category */}
          <CategorySection
            icon="bed"
            title="Stays"
            emoji="🏨"
            isExpanded={expandedCategory === 'stays'}
            onToggle={() => toggleCategory('stays')}
          >
            <StaysContent />
          </CategorySection>

          {/* Transport Category */}
          <CategorySection
            icon="car"
            title="Transport"
            emoji="🚗"
            isExpanded={expandedCategory === 'transport'}
            onToggle={() => toggleCategory('transport')}
          >
            <TransportContent />
          </CategorySection>

          {/* Experiences Category */}
          <CategorySection
            icon="ticket"
            title="Experiences"
            emoji="🎟️"
            isExpanded={expandedCategory === 'experiences'}
            onToggle={() => toggleCategory('experiences')}
          >
            <ExperiencesContent />
          </CategorySection>

          {/* Restaurants Category */}
          <CategorySection
            icon="restaurant"
            title="Restaurants"
            emoji="🍽️"
            isExpanded={expandedCategory === 'restaurants'}
            onToggle={() => toggleCategory('restaurants')}
          >
            <RestaurantsContent />
          </CategorySection>
        </View>
      </ScrollView>
    </View>
  )
}

// Category Section Component
function CategorySection({ icon, title, emoji, isExpanded, onToggle, children }: any) {
  return (
    <View style={styles.categorySection}>
      <TouchableOpacity 
        style={styles.categoryHeaderButton}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.categoryHeaderLeft}>
          <Text style={styles.categoryHeaderTitle}>{title}</Text>
          <Text style={styles.categoryHeaderEmoji}>{emoji}</Text>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="rgba(203,184,140,0.6)" 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.categoryContent}>
          {children}
        </View>
      )}
    </View>
  )
}

// Flights Content
function FlightsContent() {
  return (
    <View style={styles.flightsContainer}>
      {/* Flight Input Section */}
      <View style={styles.flightInputPane}>
        <Text style={styles.inputLabel}>Enter flight number (e.g., ITA AZ1234)</Text>
        <TextInput
          style={styles.flightInput}
          placeholder="Flight number..."
          placeholderTextColor="rgba(255,255,255,0.3)"
        />
        <TouchableOpacity style={styles.addFlightButton} activeOpacity={0.8}>
          <Text style={styles.addFlightButtonText}>Add Flight</Text>
        </TouchableOpacity>
      </View>

      {/* Added Flights (Example) */}
      <View style={styles.addedFlightsSection}>
        <Text style={styles.sectionSubtitle}>Your Flights</Text>
        <View style={styles.flightCard}>
          <View style={styles.flightCardHeader}>
            <Text style={styles.flightRoute}>FCO → NAP</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Upcoming</Text>
            </View>
          </View>
          <Text style={styles.flightAirline}>ITA Airways · AZ1234</Text>
          <View style={styles.flightTimesRow}>
            <View>
              <Text style={styles.flightTime}>10:30 AM</Text>
              <Text style={styles.flightTerminal}>Terminal 3</Text>
            </View>
            <View style={styles.flightDuration}>
              <Text style={styles.durationText}>1h 15m</Text>
            </View>
            <View>
              <Text style={styles.flightTime}>11:45 AM</Text>
              <Text style={styles.flightTerminal}>Terminal 1</Text>
            </View>
          </View>
          <View style={styles.travelerRow}>
            <View style={styles.travelerInitials}>
              <Text style={styles.initialsText}>A.S.</Text>
            </View>
            <View style={styles.travelerInitials}>
              <Text style={styles.initialsText}>M.K.</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

// Stays Content
function StaysContent() {
  const subcategories = [
    { title: 'For You', stays: 3 },
    { title: 'Boutique', stays: 4 },
    { title: 'Luxury', stays: 3 },
    { title: 'Affordable', stays: 5 },
  ]

  return (
    <View style={styles.staysContainer}>
      {subcategories.map((subcat, index) => (
        <View key={subcat.title} style={styles.subcategorySection}>
          <View style={styles.subcategoryHeader}>
            <Text style={styles.subcategoryTitle}>{subcat.title}</Text>
            <Text style={styles.subcategoryCount}>{subcat.stays} options</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {Array.from({ length: Math.ceil(subcat.stays / 1.25) }).map((_, idx) => (
              <TouchableOpacity key={idx} style={[styles.stayCard, idx === 0 && styles.firstCard]} activeOpacity={0.8}>
                <ImageBackground
                  source={{ uri: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }}
                  style={styles.stayCardBg}
                  imageStyle={styles.stayCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.stayCardGradient}
                  />
                  <View style={styles.stayCardFrosted}>
                    {/* Date Pill - Top Right */}
                    <View style={styles.datePill}>
                      <Text style={styles.datePillText}>Jun 12</Text>
                    </View>

                    <Text style={styles.stayCardName}>Hotel Santa Caterina</Text>
                    <Text style={styles.stayCardTagline}>Where terraces meet the azure sea</Text>
                    <Text style={styles.stayEstTotal}>Est. Total €420 · 2 nights</Text>
                    <Text style={styles.stayCardLocation}>Trastevere, Rome · 1.2 mi from center</Text>
                    <View style={styles.stayCardRow}>
                      <View style={styles.ratingRow}>
                        <Text style={styles.starIcon}>⭐</Text>
                        <Text style={styles.ratingText}>4.7</Text>
                      </View>
                    </View>
                    <View style={styles.amenitiesRow}>
                      {['Pool', 'Breakfast', 'Spa', 'Wi-Fi'].map((amenity) => (
                        <Text key={amenity} style={styles.amenityText}>{amenity}</Text>
                      ))}
                    </View>
                    <View style={styles.bookViaRow}>
                      <Text style={styles.bookViaLabel}>Book via</Text>
                      <View style={styles.logoRow}>
                        <Text style={styles.logoText}>Official Site</Text>
                        <Text style={styles.logoText}>Booking.com</Text>
                        <Text style={styles.logoText}>Expedia</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  )
}

// Transport Content
function TransportContent() {
  const subcategories = ['Trains', 'Buses', 'Car Rentals']

  return (
    <View style={styles.transportContainer}>
      {subcategories.map((subcat) => (
        <View key={subcat} style={styles.subcategorySection}>
          <Text style={styles.subcategoryTitle}>{subcat}</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <TouchableOpacity key={idx} style={[styles.transportCard, idx === 0 && styles.firstCard]} activeOpacity={0.8}>
                <ImageBackground
                  source={{ uri: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }}
                  style={styles.transportCardBg}
                  imageStyle={styles.transportCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.transportCardGradient}
                  />
                  <View style={styles.transportCardFrosted}>
                    {/* Date Pill */}
                    <View style={styles.datePill}>
                      <Text style={styles.datePillText}>Jun 13</Text>
                    </View>

                    <View style={styles.transportHeader}>
                      <Ionicons name="train" size={20} color="#CBB88C" />
                      <Text style={styles.transportRoute}>Rome → Venice</Text>
                    </View>
                    <Text style={styles.transportTime}>Depart 10 AM · Arrive 1:40 PM</Text>
                    <Text style={styles.transportDuration}>Duration: 3h 40m</Text>
                    <Text style={styles.transportProvider}>Trenitalia</Text>
                    <Text style={styles.estimatedTotal}>Est. Total €40</Text>
                    <View style={styles.bookViaRow}>
                      <Text style={styles.bookViaLabel}>Book via</Text>
                      <View style={styles.logoRow}>
                        <Text style={styles.logoText}>Official</Text>
                        <Text style={styles.logoText}>Booking.com</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  )
}

// Experiences Content
function ExperiencesContent() {
  const subcategories = ['Attractions', 'Experiential', 'Adventures']

  return (
    <View style={styles.experiencesContainer}>
      {subcategories.map((subcat) => (
        <View key={subcat} style={styles.subcategorySection}>
          <Text style={styles.subcategoryTitle}>{subcat}</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <TouchableOpacity key={idx} style={[styles.experienceCard, idx === 0 && styles.firstCard]} activeOpacity={0.8}>
                <ImageBackground
                  source={{ uri: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' }}
                  style={styles.experienceCardBg}
                  imageStyle={styles.experienceCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.experienceCardGradient}
                  />
                  <View style={styles.experienceCardFrosted}>
                    {/* Date Pill */}
                    <View style={styles.datePill}>
                      <Text style={styles.datePillText}>Jun 14</Text>
                    </View>

                    <Text style={styles.experienceCardName}>Villa Cimbrone Gardens</Text>
                    <Text style={styles.experienceCardTagline}>Where terraces meet infinity views</Text>
                    <Text style={styles.experienceCardLocation}>Ravello · 0.4 mi from center</Text>
                    <Text style={styles.experienceCardDuration}>2 hrs</Text>
                    <Text style={styles.estimatedTotal}>Est. Total €25</Text>
                    <View style={styles.bookViaRow}>
                      <Text style={styles.bookViaLabel}>Book via</Text>
                      <View style={styles.logoRow}>
                        <Text style={styles.logoText}>Official</Text>
                        <Text style={styles.logoText}>Viator</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  )
}

// Restaurants Content
function RestaurantsContent() {
  const subcategories = ['Breakfast', 'Lunch', 'Dinner']

  return (
    <View style={styles.restaurantsContainer}>
      {subcategories.map((subcat) => (
        <View key={subcat} style={styles.subcategorySection}>
          <Text style={styles.subcategoryTitle}>{subcat}</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScroll}
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <TouchableOpacity key={idx} style={[styles.restaurantCard, idx === 0 && styles.firstCard]} activeOpacity={0.8}>
                <ImageBackground
                  source={{ uri: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' }}
                  style={styles.restaurantCardBg}
                  imageStyle={styles.restaurantCardBgStyle}
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                    style={styles.restaurantCardGradient}
                  />
                  <View style={styles.restaurantCardFrosted}>
                    {/* Date Pill */}
                    <View style={styles.datePill}>
                      <Text style={styles.datePillText}>Jun 15</Text>
                    </View>

                    <Text style={styles.restaurantCardName}>Il Refettorio</Text>
                    <Text style={styles.restaurantCardCuisine}>Italian Coastal</Text>
                    <Text style={styles.restaurantCardTagline}>Sea salt on lips, limoncello sunsets</Text>
                    <Text style={styles.restaurantCardLocation}>Praiano · 1.4 mi from center</Text>
                    <View style={styles.restaurantMetaRow}>
                      <View style={styles.ratingRow}>
                        <Text style={styles.starIcon}>⭐</Text>
                        <Text style={styles.ratingText}>4.8</Text>
                      </View>
                      <Text style={styles.priceTier}>€€€</Text>
                    </View>
                    <Text style={styles.estimatedTotal}>Est. Total €120 (2 guests)</Text>
                    <View style={styles.bookViaRow}>
                      <Text style={styles.bookViaLabel}>Book via</Text>
                      <View style={styles.logoRow}>
                        <Text style={styles.logoText}>Official</Text>
                        <Text style={styles.logoText}>OpenTable</Text>
                        <Text style={styles.logoText}>Resy</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Hero Section - EXACT from Trip Canvas
  heroContainer: {
    height: 340,
    marginBottom: 24,
  },
  heroBackground: {
    flex: 1,
  },
  heroBackgroundImage: {
    opacity: 0.5,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroFrostedPane: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 12,
      },
    }),
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: '#F3F1E7',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  editIconButton: {
    marginLeft: 8,
    padding: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  statusCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  statusDropdownMenu: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    padding: 8,
    zIndex: 1000,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  statusDropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusDropdownText: {
    fontSize: 14,
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cityCapsuleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityCapsule: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
  },
  cityCapsuleActive: {
    backgroundColor: 'rgba(203,184,140,0.2)',
    borderColor: '#C9A96D',
  },
  cityCapsuleText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityCapsuleTextActive: {
    color: '#C9A96D',
  },
  cityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(181,155,115,0.4)',
    marginHorizontal: 6,
  },
  dayTabsContainer: {
    marginTop: 4,
  },
  dayTabsScroll: {
    flexGrow: 0,
  },
  dayTabsContent: {
    gap: 8,
    justifyContent: 'center',
  },
  dayTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
  },
  dayTabActive: {
    backgroundColor: '#B59B73',
    borderColor: '#B59B73',
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dayTabTextActive: {
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(203,184,140,0.5)',
    marginHorizontal: 12,
  },
  planningDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.2)',
  },
  planningText: {
    fontSize: 14,
    color: '#CBB88C',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityPathContainer: {
    marginBottom: 16,
  },
  cityPathScroll: {
    alignItems: 'center',
    gap: 8,
  },
  cityPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
  },
  cityPillActive: {
    backgroundColor: 'rgba(203,184,140,0.2)',
    borderColor: '#C9A96D',
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cityPillTextActive: {
    color: '#C9A96D',
  },
  cityArrow: {
    width: 6,
    height: 6,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(203,184,140,0.4)',
    transform: [{ rotate: '45deg' }],
  },
  dayTabsContainer: {
    marginTop: 8,
  },
  dayTabsScroll: {
    gap: 10,
  },
  dayTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
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
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dayTabTextActive: {
    color: '#FFFFFF',
  },

  // Categories Container
  categoriesContainer: {
    paddingHorizontal: 24,
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
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
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  categoryHeaderEmoji: {
    fontSize: 18,
  },
  categoryContent: {
    marginTop: 16,
  },

  // Flights Content
  flightsContainer: {
    gap: 24,
  },
  flightInputPane: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  inputLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  addFlightButton: {
    backgroundColor: '#B59B73',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addFlightButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  addedFlightsSection: {
    gap: 12,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  flightCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flightRoute: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  statusBadge: {
    backgroundColor: 'rgba(203,184,140,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightAirline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  flightTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightTerminal: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  flightDuration: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  travelerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  travelerInitials: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(203,184,140,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Stays Content
  staysContainer: {
    gap: 32,
  },
  subcategorySection: {
    gap: 16,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subcategoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  subcategoryCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  carouselScroll: {
    paddingRight: 24,
  },
  stayCard: {
    width: 320,
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  firstCard: {
    marginLeft: 0,
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(181,155,115,0.15)',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  stayCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  stayCardTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
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
  stayCardRow: {
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starIcon: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  amenityText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  estimatedTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CBB88C',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  bookViaRow: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(181,155,115,0.2)',
    paddingTop: 12,
  },
  bookViaLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  logoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  logoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#CBB88C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(203,184,140,0.12)',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.3)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Transport Content
  transportContainer: {
    gap: 32,
  },
  transportCard: {
    width: 300,
    marginRight: 16,
  },
  transportCardFrosted: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  transportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  transportRoute: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  transportTime: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  transportDuration: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  transportProvider: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Experiences Content
  experiencesContainer: {
    gap: 32,
  },
  experienceCard: {
    width: 300,
    height: 320,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  experienceCardBg: {
    flex: 1,
  },
  experienceCardBgStyle: {
    borderRadius: 24,
  },
  experienceCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  experienceCardFrosted: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(181,155,115,0.15)',
    padding: 18,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  experienceCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  experienceCardTagline: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  experienceCardLocation: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  experienceCardDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Restaurants Content
  restaurantsContainer: {
    gap: 32,
  },
  restaurantCard: {
    width: 340,
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  restaurantCardBg: {
    flex: 1,
  },
  restaurantCardBgStyle: {
    borderRadius: 24,
  },
  restaurantCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  restaurantCardFrosted: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(181,155,115,0.15)',
    padding: 20,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  restaurantCardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  restaurantCardCuisine: {
    fontSize: 12,
    color: '#CBB88C',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  restaurantCardTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  restaurantCardLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 10,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  restaurantMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceTier: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
