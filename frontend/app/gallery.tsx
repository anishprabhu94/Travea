import React from 'react';
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

// Gallery Data - Chronological by-day narrative
const galleryData = {
  hero: {
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    quote: 'To travel is to return with new eyes.'
  },
  days: [
    {
      id: 'day1',
      label: 'Day 1 · Amalfi',
      moments: [
        {
          type: 'photo',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
          caption: 'Evening light over Villa Cimbrone.'
        },
        {
          type: 'quote',
          text: 'The road gives you stories you never planned to write.'
        },
        {
          type: 'experience',
          title: 'Lemon Grove Walk',
          details: '2 hrs · Ravello'
        },
        {
          type: 'stay',
          name: 'Hotel Onda Blu',
          details: 'Amalfi · 2 Nights',
          image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
        }
      ]
    },
    {
      id: 'day2',
      label: 'Day 2 · Coast',
      moments: [
        {
          type: 'photo',
          image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
          caption: 'Lemon terraces in morning haze.'
        },
        {
          type: 'experience',
          title: 'Cooking Class at Nonna Lucia\'s',
          details: '3 hrs · Amalfi'
        }
      ]
    }
  ],
  summary: {
    title: 'Journey Completed.',
    subtitle: 'June 8–14 · 4 Cities · 7 Days',
    image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    stats: {
      flights: 2,
      nights: 6,
      transfers: 3,
      experiences: 5,
      restaurants: 8
    },
    caption: 'All bookings confirmed · All memories saved',
    reflection: 'From Rome\'s hum to Amalfi\'s hush, your journey was a tapestry of motion and stillness. Every moment — planned or found — now lives here.'
  }
};

export default function TripGallery() {
  // Hero Quote Spread
  const renderHero = () => (
    <View style={styles.heroContainer}>
      <ImageBackground
        source={{ uri: galleryData.hero.image }}
        style={styles.heroBackground}
        imageStyle={styles.heroBackgroundImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.5)']}
          style={styles.heroGradient}
        />
        
        {/* Quote Capsule Overlay */}
        <View style={styles.quoteCapsule}>
          <Text style={styles.quoteCapsuleText}>"{galleryData.hero.quote}"</Text>
        </View>
      </ImageBackground>
    </View>
  );

  // Render individual moment based on type
  const renderMoment = (moment: any, index: number) => {
    switch (moment.type) {
      case 'photo':
        return (
          <View key={index} style={styles.photoMoment}>
            <ImageBackground
              source={{ uri: moment.image }}
              style={styles.photoImage}
              imageStyle={styles.photoImageStyle}
            />
            <Text style={styles.photoCaption}>{moment.caption}</Text>
          </View>
        );

      case 'quote':
        return (
          <View key={index} style={styles.quoteMoment}>
            <Text style={styles.quoteText}>"{moment.text}"</Text>
          </View>
        );

      case 'experience':
        return (
          <View key={index} style={styles.experienceMoment}>
            <Text style={styles.experienceTitle}>{moment.title}</Text>
            <Text style={styles.experienceDetails}>{moment.details}</Text>
            <View style={styles.externalIcon}>
              <Ionicons name="open-outline" size={14} color="#B59B73" />
            </View>
          </View>
        );

      case 'stay':
        return (
          <View key={index} style={styles.stayMoment}>
            <ImageBackground
              source={{ uri: moment.image }}
              style={styles.stayImage}
              imageStyle={styles.stayImageStyle}
            />
            <View style={styles.stayInfo}>
              <Text style={styles.stayName}>{moment.name}</Text>
              <Text style={styles.stayDetails}>{moment.details}</Text>
            </View>
            <View style={styles.externalIcon}>
              <Ionicons name="open-outline" size={14} color="#B59B73" />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // Chronological Story (By-Day Narrative)
  const renderChronologicalStory = () => (
    <View style={styles.storyContainer}>
      {galleryData.days.map((day) => (
        <View key={day.id} style={styles.dayBlock}>
          <Text style={styles.dayLabel}>{day.label}</Text>
          {day.moments.map((moment, index) => renderMoment(moment, index))}
        </View>
      ))}
    </View>
  );

  // Journey Completed
  const renderJourneyCompleted = () => (
    <View style={styles.completedContainer}>
      {/* Hero Image */}
      <View style={styles.completedHeroContainer}>
        <ImageBackground
          source={{ uri: galleryData.summary.image }}
          style={styles.completedHeroBackground}
          imageStyle={styles.completedHeroBackgroundImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.6)']}
            style={styles.completedHeroGradient}
          />
          <View style={styles.completedHeroContent}>
            <Text style={styles.completedTitle}>{galleryData.summary.title}</Text>
            <Text style={styles.completedSubtitle}>{galleryData.summary.subtitle}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Frosted Summary Card */}
      <View style={styles.summarySection}>
        <View style={styles.frostedPanel}>
          <View style={styles.statsGrid}>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🛫</Text>
              <Text style={styles.statText}>Flights {galleryData.summary.stats.flights}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🏨</Text>
              <Text style={styles.statText}>Nights {galleryData.summary.stats.nights}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🚗</Text>
              <Text style={styles.statText}>Transfers {galleryData.summary.stats.transfers}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🎟</Text>
              <Text style={styles.statText}>Experiences {galleryData.summary.stats.experiences}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statIcon}>🍽</Text>
              <Text style={styles.statText}>Restaurants {galleryData.summary.stats.restaurants}</Text>
            </View>
          </View>
          <Text style={styles.statsCaption}>{galleryData.summary.caption}</Text>
        </View>
      </View>

      {/* Reflection */}
      <View style={styles.reflectionContainer}>
        <Text style={styles.reflectionText}>{galleryData.summary.reflection}</Text>
        
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share Trip Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={18} color="#B59B73" />
        </View>
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHero()}
        {renderChronologicalStory()}
        {renderJourneyCompleted()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 100,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },

  // Hero Quote Spread
  heroContainer: {
    height: 400,
    marginBottom: 32,
  },
  heroBackground: {
    flex: 1,
  },
  heroBackgroundImage: {
    // Full bleed
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  quoteCapsule: {
    position: 'absolute',
    bottom: 40,
    left: '10%',
    right: '10%',
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
  quoteCapsuleText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },

  // Chronological Story
  storyContainer: {
    paddingHorizontal: 24,
  },
  dayBlock: {
    marginBottom: 32,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(181,155,115,0.8)',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Photo Moment
  photoMoment: {
    marginBottom: 20,
  },
  photoImage: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
  },
  photoImageStyle: {
    borderRadius: 24,
  },
  photoCaption: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },

  // Quote Moment - Dark Gradient
  quoteMoment: {
    borderRadius: 24,
    padding: 32,
    marginBottom: 20,
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, rgba(54,65,71,0.95) 0%, rgba(74,66,62,0.95) 100%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      },
      default: {
        backgroundColor: 'rgba(54,65,71,0.95)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },

  // Experience Moment - Dark Gradient
  experienceMoment: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, rgba(54,65,71,0.95) 0%, rgba(74,66,62,0.95) 100%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      },
      default: {
        backgroundColor: 'rgba(54,65,71,0.95)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  experienceTitle: {
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
  experienceDetails: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Stay Moment - Dark Gradient
  stayMoment: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, rgba(54,65,71,0.95) 0%, rgba(74,66,62,0.95) 100%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      },
      default: {
        backgroundColor: 'rgba(54,65,71,0.95)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  stayImage: {
    width: 100,
    height: 100,
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
  stayDetails: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // External Icon
  externalIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(181,155,115,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Journey Completed
  completedContainer: {
    marginTop: 32,
  },
  completedHeroContainer: {
    height: 280,
    marginBottom: 24,
  },
  completedHeroBackground: {
    flex: 1,
  },
  completedHeroBackgroundImage: {
    // Full bleed
  },
  completedHeroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  completedHeroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  completedTitle: {
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
  completedSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Summary Section
  summarySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  // Dark Gradient Panel - Matching Bookings
  frostedPanel: {
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      web: {
        background: 'linear-gradient(135deg, rgba(54,65,71,0.95) 0%, rgba(74,66,62,0.95) 100%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      },
      default: {
        backgroundColor: 'rgba(54,65,71,0.95)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      },
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
    marginBottom: 64,
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
  shareButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 23,
    backgroundColor: '#B59B73',
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
});
