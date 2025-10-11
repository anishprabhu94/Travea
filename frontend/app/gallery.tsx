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

// Trip Gallery Data - "Travel ends, but beauty remains"
const galleryData = {
  cover: {
    title: 'Summer in Italy',
    subtitle: 'June 8–14, 2025 · 4 Cities · 7 Days',
    description: 'A journal of motion, stillness, and memory.',
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
    quote: 'To travel is to return with new eyes.'
  },
  moments: [
    {
      id: '1',
      type: 'photo',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      caption: 'Evening light over Villa Cimbrone.'
    },
    {
      id: '2',
      type: 'quote',
      text: 'The road gives you stories you never planned to write.'
    },
    {
      id: '3',
      type: 'photo',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      caption: 'Lemon terraces in morning haze.'
    },
    {
      id: '4',
      type: 'booking',
      title: 'Hotel Onda Blu',
      subtitle: 'Amalfi · 2 Nights',
      platform: 'via Booking.com',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
    },
    {
      id: '5',
      type: 'day',
      title: 'Day 4 · Capri',
      description: 'Boats, breeze, and blue horizons.',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    }
  ],
  highlights: {
    title: 'Highlights from Your Journey',
    subtitle: 'Collected from your moments.',
    metrics: [
      { icon: '🛫', label: '2 Flights' },
      { icon: '🏨', label: '6 Nights Stayed' },
      { icon: '🚗', label: '3 Transfers' },
      { icon: '🎟', label: '5 Experiences' },
      { icon: '🍽', label: '8 Restaurants' },
      { icon: '📍', label: '4 Cities Visited' }
    ],
    summary: 'In seven days, you covered 412 kilometers across Italy, tasted 8 local dishes, and collected 27 photos and 5 keepsakes.'
  },
  reflection: {
    quote: 'The best trips never end — they echo.',
    memory: 'Favorite memory: ferry to Capri at sunrise.'
  }
};

export default function TripGallery() {
  const renderCoverSpread = () => (
    <View style={styles.coverSpread}>
      {/* Full-Width Cinematic Hero */}
      <View style={styles.coverHeroContainer}>
        <ImageBackground
          source={{ uri: galleryData.cover.heroImage }}
          style={styles.coverHero}
          imageStyle={styles.coverHeroImage}
        >
          <View style={styles.coverHeroOverlay} />
          <View style={styles.coverHeroContent}>
            <Text style={styles.coverTitle}>{galleryData.cover.title}</Text>
            <Text style={styles.coverSubtitle}>{galleryData.cover.subtitle}</Text>
            <Text style={styles.coverDescription}>{galleryData.cover.description}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Frosted Quote Panel */}
      <View style={styles.quotePanel}>
        <Text style={styles.quoteText}>"{galleryData.cover.quote}"</Text>
      </View>
    </View>
  );

  const renderMomentCard = (moment: any, index: number) => {
    switch (moment.type) {
      case 'photo':
        return (
          <View key={moment.id} style={[styles.momentCard, styles.photoCard]}>
            <ImageBackground
              source={{ uri: moment.image }}
              style={styles.photoCardImage}
              imageStyle={styles.photoCardImageStyle}
            />
            <Text style={styles.photoCaption}>{moment.caption}</Text>
          </View>
        );

      case 'quote':
        return (
          <View key={moment.id} style={[styles.momentCard, styles.quoteCard]}>
            <Text style={styles.momentQuoteText}>"{moment.text}"</Text>
            <View style={styles.quoteAccentLine} />
          </View>
        );

      case 'booking':
        return (
          <View key={moment.id} style={[styles.momentCard, styles.bookingCard]}>
            <ImageBackground
              source={{ uri: moment.image }}
              style={styles.bookingCardImage}
              imageStyle={styles.bookingCardImageStyle}
            />
            <View style={styles.bookingCardContent}>
              <Text style={styles.bookingCardTitle}>{moment.title}</Text>
              <Text style={styles.bookingCardSubtitle}>{moment.subtitle}</Text>
              <Text style={styles.bookingCardPlatform}>{moment.platform}</Text>
            </View>
            <TouchableOpacity style={styles.bookingCardButton}>
              <Ionicons name="open-outline" size={14} color="#CBB88C" />
            </TouchableOpacity>
          </View>
        );

      case 'day':
        return (
          <View key={moment.id} style={[styles.momentCard, styles.dayCard]}>
            <ImageBackground
              source={{ uri: moment.image }}
              style={styles.dayCardImage}
              imageStyle={styles.dayCardImageStyle}
            >
              <View style={styles.dayCardOverlay} />
              <View style={styles.dayCardContent}>
                <Text style={styles.dayCardTitle}>{moment.title}</Text>
                <Text style={styles.dayCardDescription}>{moment.description}</Text>
              </View>
            </ImageBackground>
          </View>
        );

      default:
        return null;
    }
  };

  const renderMomentsGallery = () => (
    <View style={styles.momentsGallery}>
      <View style={styles.galleryGrid}>
        {galleryData.moments.map((moment, index) => renderMomentCard(moment, index))}
      </View>
    </View>
  );

  const renderHighlightsRecap = () => (
    <View style={styles.highlightsSection}>
      <View style={styles.highlightsHeader}>
        <Text style={styles.highlightsTitle}>{galleryData.highlights.title}</Text>
        <Text style={styles.highlightsSubtitle}>{galleryData.highlights.subtitle}</Text>
      </View>

      <View style={styles.metricsContainer}>
        {galleryData.highlights.metrics.map((metric, index) => (
          <View key={index} style={styles.metricCard}>
            <Text style={styles.metricIcon}>{metric.icon}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.memorySummaryPanel}>
        <Text style={styles.memorySummaryText}>{galleryData.highlights.summary}</Text>
      </View>
    </View>
  );

  const renderReflectionShare = () => (
    <View style={styles.reflectionSection}>
      {/* Reflection Card */}
      <View style={styles.reflectionCard}>
        <Text style={styles.reflectionQuote}>"{galleryData.reflection.quote}"</Text>
        <View style={styles.reflectionDivider} />
        <Text style={styles.reflectionMemory}>{galleryData.reflection.memory}</Text>
      </View>

      {/* Share Capsule */}
      <View style={styles.shareButtons}>
        <TouchableOpacity style={styles.shareButtonFilled}>
          <Text style={styles.shareButtonFilledText}>Share Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButtonOutline}>
          <Text style={styles.shareButtonOutlineText}>Export Journal</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.exportSubline}>Export as Trāvea Journal — PDF / Link / Story mode</Text>

      {/* Signature Footer */}
      <View style={styles.signatureFooter}>
        <Text style={styles.signatureLogo}>Trāvea</Text>
        <Text style={styles.signatureTagline}>For travelers who collect moments, not miles.</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <View style={styles.backButtonCircle}>
          <Ionicons name="arrow-back" size={18} color="#CBB88C" />
        </View>
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCoverSpread()}
        {renderMomentsGallery()}
        {renderHighlightsRecap()}
        {renderReflectionShare()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Onyx black with subtle gold vignette
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
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },

  // Section 1 - Cover Spread
  coverSpread: {
    marginBottom: 48,
  },
  coverHeroContainer: {
    height: 340, // 340px as specified
    position: 'relative',
  },
  coverHero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverHeroImage: {
    // No additional styling needed
  },
  coverHeroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%', // Bottom 40% fade
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  coverHeroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    alignItems: 'center',
  },
  coverTitle: {
    fontSize: 28, // Playfair Bold 28pt
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
  coverSubtitle: {
    fontSize: 14, // Inter Regular 14pt
    fontWeight: '400',
    color: 'rgba(203,184,140,0.7)', // Gold 70%
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  coverDescription: {
    fontSize: 13, // Inter Italic 13pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(203,184,140,0.65)', // Gold 65%
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Frosted Quote Panel
  quotePanel: {
    position: 'absolute',
    bottom: -60, // Overlays bottom of hero
    left: '7.5%', // 85% width centered
    right: '7.5%',
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
  quoteText: {
    fontSize: 15, // Playfair Italic 15pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)', // White 80%
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },

  // Section 2 - Moments Gallery
  momentsGallery: {
    paddingHorizontal: 24,
    marginTop: 80, // Account for overlapping quote panel
    marginBottom: 48,
  },
  galleryGrid: {
    gap: 16, // 16px spacing between cards
  },

  // Moment Cards Base
  momentCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.15)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)',
        boxShadow: '0 8px 36px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 18,
        elevation: 8,
      },
    }),
  },

  // Photo Cards
  photoCard: {
    height: 240,
  },
  photoCardImage: {
    flex: 1,
  },
  photoCardImageStyle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  photoCaption: {
    fontSize: 14, // Playfair 14pt
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    padding: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },

  // Quote Cards
  quoteCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  momentQuoteText: {
    fontSize: 15, // Playfair Italic 15pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)', // White 80%
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  quoteAccentLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.6)', // Gold accent line
  },

  // Booking Cards
  bookingCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    height: 120,
  },
  bookingCardImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  bookingCardImageStyle: {
    borderRadius: 20,
  },
  bookingCardContent: {
    flex: 1,
  },
  bookingCardTitle: {
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
  bookingCardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.8)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  bookingCardPlatform: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  bookingCardButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(203,184,140,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.3)',
  },

  // Day Cards
  dayCard: {
    height: 180,
  },
  dayCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dayCardImageStyle: {
    borderRadius: 24,
  },
  dayCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  dayCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  dayCardTitle: {
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
  dayCardDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(203,184,140,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Section 3 - Highlights Recap
  highlightsSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  highlightsHeader: {
    marginBottom: 24,
  },
  highlightsTitle: {
    fontSize: 22, // Playfair Semibold 22pt
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  highlightsSubtitle: {
    fontSize: 13, // Inter Regular 13pt
    fontWeight: '400',
    color: 'rgba(203,184,140,0.7)', // Gold 70%
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Metric Cards
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  metricCard: {
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 13, // Inter Medium 13pt
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Memory Summary Panel
  memorySummaryPanel: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  memorySummaryText: {
    fontSize: 14, // Inter Medium 14pt
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)', // White 80%
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Section 4 - Reflection & Share
  reflectionSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  reflectionCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  reflectionQuote: {
    fontSize: 16, // Playfair Italic 16pt
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.85)', // White 85%
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  reflectionDivider: {
    width: 50,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.4)',
    marginBottom: 16,
  },
  reflectionMemory: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(203,184,140,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Share Buttons
  shareButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  shareButtonFilled: {
    height: 46, // 46pt height
    paddingHorizontal: 24,
    borderRadius: 23, // rounded 23pt
    backgroundColor: 'rgba(203,184,140,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 0 20px rgba(203,184,140,0.2)',
      },
    }),
  },
  shareButtonFilledText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(10,10,10,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  shareButtonOutline: {
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.6)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonOutlineText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(203,184,140,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  exportSubline: {
    fontSize: 12, // Inter 12pt
    fontWeight: '400',
    color: 'rgba(203,184,140,0.65)', // Gold 65%
    textAlign: 'center',
    marginBottom: 48,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Signature Footer
  signatureFooter: {
    alignItems: 'center',
    marginBottom: 80, // Large bottom padding
  },
  signatureLogo: {
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
  signatureTagline: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(203,184,140,0.7)', // Gold 70%
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
});