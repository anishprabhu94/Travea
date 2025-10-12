import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StyleSheet,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

// Multi-city circuit data for Italian Coast (Amalfi → Ravello → Sorrento)
const multiCityData = {
  circuitName: 'Italian Coast Circuit',
  cities: ['Amalfi', 'Ravello', 'Sorrento'],
  cityCodes: ['AMF', 'RAV', 'SOR'],
  duration: '4 days',
  cityData: {
    'Amalfi': {
      name: 'Amalfi',
      code: 'AMF',
      subtitle: 'Where azure meets ancient stone',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      poeticLine: 'Where time slows, and the sea hums in gold.',
      travelInfo: [
        { icon: 'calendar-outline', label: 'Day 1', sublabel: 'Arrival' },
        { icon: 'time-outline', label: '8 hrs', sublabel: 'Stay' },
      ],
      experiences: [
        {
          title: 'Cathedral Visit',
          subtext: '1 hr · Historic center',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        },
        {
          title: 'Coastal Walk',
          subtext: '2 hrs · Seaside path',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ],
      foodCulture: [
        {
          title: 'Trattoria da Gemma',
          subtext: 'Sea salt on lips, limoncello sunsets',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        },
        {
          title: 'Local Pizzeria',
          subtext: 'Wood-fired tradition',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      insights: [
        'Lemons here grow as large as grapefruits.',
        'Church bells echo over the cliffs every evening.',
        'Paper has been made by hand here since 1220.'
      ]
    },
    'Ravello': {
      name: 'Ravello',
      code: 'RAV',
      subtitle: 'Where silence hums between lemon trees',
      heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      poeticLine: 'Gardens suspended above the world.',
      travelInfo: [
        { icon: 'calendar-outline', label: 'Day 2', sublabel: 'Morning' },
        { icon: 'time-outline', label: '6 hrs', sublabel: 'Stay' },
      ],
      experiences: [
        {
          title: 'Villa Cimbrone Gardens',
          subtext: '2 hrs · Infinity views',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        },
        {
          title: 'Lemon Grove Walk',
          subtext: '1.5 hrs · Terraced paths',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ],
      foodCulture: [
        {
          title: 'Ristorante Rossellinis',
          subtext: 'Michelin star elegance',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      insights: [
        'Wagner composed Parsifal in these gardens.',
        'The Terrace of Infinity offers views to eternity.',
        'Ravello hosts a summer music festival since 1953.'
      ]
    },
    'Sorrento': {
      name: 'Sorrento',
      code: 'SOR',
      subtitle: 'Island allure & Mediterranean calm',
      heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      poeticLine: 'Where citrus perfumes the twilight air.',
      travelInfo: [
        { icon: 'calendar-outline', label: 'Day 3-4', sublabel: 'Final stop' },
        { icon: 'time-outline', label: '2 days', sublabel: 'Stay' },
      ],
      experiences: [
        {
          title: 'Marina Grande',
          subtext: '2 hrs · Fishing village',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
        },
        {
          title: 'Limoncello Tasting',
          subtext: '1 hr · Local distillery',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ],
      foodCulture: [
        {
          title: "L'Antica Trattoria",
          subtext: 'Family recipes, sea views',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
        }
      ],
      insights: [
        'Sorrento produces the finest limoncello in Italy.',
        'Cliffside streets lead to hidden beaches.',
        'The Bay of Naples sparkles at sunset.'
      ]
    }
  },
  suggestedJourneys: [
    {
      title: 'Path of the Gods Hike',
      subtext: 'Ravello to Positano · 3 hrs',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    },
    {
      title: 'Capri Day Trip',
      subtext: 'From Sorrento · Full day',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
    }
  ]
}

export default function MultiCityDestination() {
  const [selectedCity, setSelectedCity] = useState('Amalfi')
  const activeCityData = multiCityData.cityData[selectedCity]

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section with Dynamic Background */}
        <ImageBackground
          source={{ uri: activeCityData.heroImage }}
          style={styles.heroSection}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>

          {/* City Selector Pills */}
          <View style={styles.citySelectorContainer}>
            {multiCityData.cities.map((city, idx) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.citySelectorPill,
                  selectedCity === city && styles.citySelectorPillActive
                ]}
                onPress={() => setSelectedCity(city)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.citySelectorText,
                  selectedCity === city && styles.citySelectorTextActive
                ]}>
                  {multiCityData.cityCodes[idx]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hero Title (Dynamic) */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{activeCityData.name}</Text>
            <Text style={styles.heroSubtitle}>{activeCityData.subtitle}</Text>
          </View>
        </ImageBackground>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* City Overview Pane (Matching Trip Canvas) */}
          <View style={styles.frostedPanel}>
            <View style={styles.categoryHeader}>
              <Ionicons name="location" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>City Overview</Text>
            </View>
            <View style={styles.categoryDivider} />
            
            <Text style={styles.poeticLine}>{activeCityData.poeticLine}</Text>
            
            <View style={styles.travelInfoRow}>
              {activeCityData.travelInfo.map((info, idx) => (
                <View key={idx} style={styles.travelInfoItem}>
                  <Ionicons name={info.icon as any} size={20} color="#B59B73" />
                  <Text style={styles.travelInfoLabel}>{info.label}</Text>
                  <Text style={styles.travelInfoSublabel}>{info.sublabel}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Experiences Section (Matching Trip Canvas) */}
          {activeCityData.experiences.length > 0 && (
            <View style={styles.frostedPanel}>
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
                {activeCityData.experiences.map((exp, idx) => (
                  <View 
                    key={idx} 
                    style={[styles.experienceCard, idx === activeCityData.experiences.length - 1 && {marginRight: 0}]}
                  >
                    <ImageBackground
                      source={{ uri: exp.image }}
                      style={styles.cardImageBg}
                      imageStyle={styles.cardImageStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                        style={styles.cardGradient}
                      />
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{exp.title}</Text>
                        <Text style={styles.cardSubtext}>{exp.subtext}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Food & Culture Section (Matching Trip Canvas) */}
          {activeCityData.foodCulture.length > 0 && (
            <View style={styles.frostedPanel}>
              <View style={styles.categoryHeader}>
                <Ionicons name="restaurant" size={18} color="#B59B73" style={{marginRight: 8}} />
                <Text style={styles.categoryTitle}>Food & Culture</Text>
              </View>
              <View style={styles.categoryDivider} />
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {activeCityData.foodCulture.map((food, idx) => (
                  <View 
                    key={idx} 
                    style={[styles.experienceCard, idx === activeCityData.foodCulture.length - 1 && {marginRight: 0}]}
                  >
                    <ImageBackground
                      source={{ uri: food.image }}
                      style={styles.cardImageBg}
                      imageStyle={styles.cardImageStyle}
                    >
                      <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                        style={styles.cardGradient}
                      />
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{food.title}</Text>
                        <Text style={styles.cardSubtext}>{food.subtext}</Text>
                      </View>
                    </ImageBackground>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Local Insights (Matching Trip Canvas) */}
          {activeCityData.insights.length > 0 && (
            <View style={styles.frostedPanel}>
              <View style={styles.categoryHeader}>
                <Ionicons name="bulb" size={18} color="#B59B73" style={{marginRight: 8}} />
                <Text style={styles.categoryTitle}>Local Insights</Text>
              </View>
              <View style={styles.categoryDivider} />
              
              {activeCityData.insights.map((insight, idx) => (
                <View key={idx} style={styles.insightItem}>
                  <View style={styles.insightDot} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Suggested Journeys (Matching Trip Canvas) */}
          <View style={styles.frostedPanel}>
            <View style={styles.categoryHeader}>
              <Ionicons name="map" size={18} color="#B59B73" style={{marginRight: 8}} />
              <Text style={styles.categoryTitle}>Suggested Journeys</Text>
            </View>
            <View style={styles.categoryDivider} />
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {multiCityData.suggestedJourneys.map((journey, idx) => (
                <View 
                  key={idx} 
                  style={[styles.experienceCard, idx === multiCityData.suggestedJourneys.length - 1 && {marginRight: 0}]}
                >
                  <ImageBackground
                    source={{ uri: journey.image }}
                    style={styles.cardImageBg}
                    imageStyle={styles.cardImageStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.cardGradient}
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{journey.title}</Text>
                      <Text style={styles.cardSubtext}>{journey.subtext}</Text>
                    </View>
                  </ImageBackground>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Bottom Spacing */}
          <View style={{height: 40}} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    height: 380,
    position: 'relative',
  },
  heroImage: {
    opacity: 0.9,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  
  // City Selector Pills
  citySelectorContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  citySelectorPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
  },
  citySelectorPillActive: {
    backgroundColor: 'rgba(201,169,109,0.25)',
    borderColor: '#C9A96D',
  },
  citySelectorText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  citySelectorTextActive: {
    color: '#C9A96D',
  },
  
  heroContent: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '300',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Content Container
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  
  // Frosted Panel (MATCHING TRIP CANVAS EXACTLY)
  frostedPanel: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 24,
    marginBottom: 20,
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
  
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
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
    backgroundColor: 'rgba(181,155,115,0.2)',
    marginBottom: 16,
  },
  
  // City Overview
  poeticLine: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  travelInfoRow: {
    flexDirection: 'row',
    gap: 24,
  },
  travelInfoItem: {
    alignItems: 'center',
  },
  travelInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  travelInfoSublabel: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Horizontal Scroll Cards
  horizontalScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  experienceCard: {
    width: 280,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  cardImageBg: {
    width: '100%',
    height: '100%',
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  cardSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  
  // Local Insights
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B59B73',
    marginTop: 7,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
