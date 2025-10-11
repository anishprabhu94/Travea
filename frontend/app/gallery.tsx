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

// "Travel ends, but beauty remains" - Refined Gallery
const galleryData = {
  cover: {
    title: 'Summer in Italy',
    subtitle: 'June 8–14, 2025 · 4 Cities · 7 Days',
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
    title: 'Journey Completed.',
    subtitle: 'June 8–14, 2025 · 4 Cities · 7 Days.',
    stats: [
      { icon: '🛫', label: 'Flights', count: 2 },
      { icon: '🏨', label: 'Nights', count: 6 },
      { icon: '🚗', label: 'Transfers', count: 3 },
      { icon: '🎟', label: 'Experiences', count: 5 },
      { icon: '🍽', label: 'Restaurants', count: 8 }
    ],
    subline: 'All bookings confirmed · All memories saved',
    summary: 'In seven days, you covered 412 kilometers across Italy, tasted 8 local dishes, and collected 27 photos and 5 keepsakes.'
  },
  reflection: {
    text: 'From Rome\'s hum to Amalfi\'s hush, your journey was a tapestry of motion and stillness. Every moment — planned or found — now lives here.'
  }
};

export default function TripGallery() {
  const renderCoverSpread = () => (
    <View style={styles.coverSpread}>
      {/* Cinematic Hero with Better Hierarchy */}
      <View style={styles.coverHeroContainer}>
        <ImageBackground
          source={{ uri: galleryData.cover.heroImage }}
          style={styles.coverHero}
          imageStyle={styles.coverHeroImage}
        >
          {/* Strong blur overlay for contrast */}
          <View style={styles.coverBlurOverlay} />
          <View style={styles.coverHeroOverlay} />
          
          <View style={styles.coverHeroContent}>
            <Text style={styles.coverTitle}>{galleryData.cover.title}</Text>
            <Text style={styles.coverSubtitle}>{galleryData.cover.subtitle}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Quote Pane Over Hero Bottom */}
      <View style={styles.quotePanel}>
        <Text style={styles.quoteText}>"{galleryData.cover.quote}"</Text>
      </View>
    </View>
  );

  const renderMomentCard = (moment: any, index: number) => {
    switch (moment.type) {
      case 'photo':
        return (
          <View key={moment.id} style={styles.photoCard}>
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
          <View key={moment.id} style={styles.quoteCard}>
            <Text style={styles.momentQuoteText}>"{moment.text}"</Text>
            <View style={styles.quoteAccentLine} />
          </View>
        );

      case 'booking':
        return (
          <View key={moment.id} style={styles.bookingCard}>
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
              <Ionicons name="open-outline" size={14} color="#B59B73" />
            </TouchableOpacity>
          </View>
        );

      case 'day':
        return (
          <View key={moment.id} style={styles.dayCard}>
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
      {/* Top Image with Blurred Overlay */}
      <View style={styles.highlightsHeroContainer}>
        <ImageBackground
          source={{ uri: galleryData.cover.heroImage }}
          style={styles.highlightsHeroPane}
          imageStyle={styles.highlightsHeroPaneImage}
        >
          <View style={styles.highlightsHeroOverlay} />
          <View style={styles.highlightsHeroContent}>
            <Text style={styles.highlightsTitle}>{galleryData.highlights.title}</Text>
            <Text style={styles.highlightsSubtitle}>{galleryData.highlights.subtitle}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Frosted Summary Card */}
      <View style={styles.recapCard}>
        <View style={styles.recapGrid}>
          {galleryData.highlights.stats.map((stat, index) => (
            <View key={index} style={styles.recapRow}>
              <Text style={styles.recapIcon}>{stat.icon}</Text>
              <Text style={styles.recapLabel}>{stat.label} {stat.count}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.recapSubline}>{galleryData.highlights.subline}</Text>
      </View>

      {/* Reflection Block */}
      <View style={styles.reflectionBlock}>
        <Text style={styles.reflectionBlockText}>{galleryData.reflection.text}</Text>
      </View>
    </View>
  );

  const renderShareSection = () => (
    <View style={styles.shareSection}>
      {/* Centered Share Button */}
      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Share Journal</Text>
      </TouchableOpacity>

      {/* Footer Signature */}
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
          <Ionicons name="arrow-back" size={18} color="#B59B73" />
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
        {renderShareSection()}
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

  // Cover Spread - Better Hierarchy
  coverSpread: {
    marginBottom: 48,
  },
  coverHeroContainer: {
    height: 340,
    position: 'relative',
  },
  coverHero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverHeroImage: {
    // No border radius for full bleed
  },
  coverBlurOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
      },
    }),
  },
  coverHeroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
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
    fontSize: 28,
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
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Quote Panel Over Hero
  quotePanel: {
    position: 'absolute',
    bottom: -60,
    left: '7.5%',
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
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },

  // Moments Gallery - Consistent Pane Styling
  momentsGallery: {
    paddingHorizontal: 24,
    marginTop: 80,
    marginBottom: 48,
  },
  galleryGrid: {
    gap: 20,
  },

  // Photo Cards - Frosted Pane Style
  photoCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
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
  photoCardImage: {
    height: 240,
  },
  photoCardImageStyle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  photoCaption: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    padding: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },

  // Quote Cards - Frosted Pane Style
  quoteCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
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
  momentQuoteText: {
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.8)',
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
    backgroundColor: 'rgba(181,155,115,0.6)',
  },

  // Booking Cards - Frosted Pane Style
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
    padding: 16,
    alignItems: 'center',
    height: 120,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
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
    color: 'rgba(181,155,115,0.8)',
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
    backgroundColor: 'rgba(181,155,115,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.3)',
  },

  // Day Cards - Frosted Pane Style
  dayCard: {
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.2)',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
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
    color: 'rgba(181,155,115,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Highlights Recap - Refined
  highlightsSection: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  highlightsHeroContainer: {
    height: 240,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  highlightsHeroPane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightsHeroPaneImage: {
    borderRadius: 24,
  },
  highlightsHeroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
  },
  highlightsHeroContent: {
    alignItems: 'center',
  },
  highlightsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  highlightsSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Frosted Recap Card
  recapCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.1)',
    padding: 24,
    marginBottom: 32,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
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
  recapGrid: {
    gap: 12,
    marginBottom: 16,
  },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recapIcon: {
    fontSize: 20,
  },
  recapLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(181,155,115,0.9)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  recapSubline: {
    fontSize: 13,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(181,155,115,0.65)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Reflection Block
  reflectionBlock: {
    marginBottom: 32,
  },
  reflectionBlockText: {
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },

  // Share Section
  shareSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  shareButton: {
    height: 46,
    paddingHorizontal: 24,
    borderRadius: 23,
    backgroundColor: 'rgba(181,155,115,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Signature Footer
  signatureFooter: {
    alignItems: 'center',
    marginBottom: 80,
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
    color: 'rgba(181,155,115,0.7)',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
});
