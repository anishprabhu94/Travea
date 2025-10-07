import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular } from '@expo-google-fonts/inter';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#F6F3EF', '#E8E3DC']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome to</Text>
              <Text style={styles.logo}>Travia.ai</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={36} color="#2E2E2E" />
            </TouchableOpacity>
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#B9C8C2', '#A3B5AD']}
              style={styles.heroGradient}
            >
              <Text style={styles.heroTitle}>Start Your Journey</Text>
              <Text style={styles.heroSubtitle}>
                Discover beautifully curated travel experiences tailored just for you
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Explore Destinations</Text>
                <Ionicons name="arrow-forward" size={20} color="#2E2E2E" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="compass-outline" size={28} color="#B9C8C2" />
              </View>
              <Text style={styles.actionTitle}>Discover</Text>
              <Text style={styles.actionSubtitle}>Find new places</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="calendar-outline" size={28} color="#FF7A5A" />
              </View>
              <Text style={styles.actionTitle}>Plan Trip</Text>
              <Text style={styles.actionSubtitle}>Create itinerary</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="bookmark-outline" size={28} color="#A89F91" />
              </View>
              <Text style={styles.actionTitle}>Saved</Text>
              <Text style={styles.actionSubtitle}>Your favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="sparkles-outline" size={28} color="#FFB366" />
              </View>
              <Text style={styles.actionTitle}>AI Suggest</Text>
              <Text style={styles.actionSubtitle}>Smart picks</Text>
            </TouchableOpacity>
          </View>

          {/* Placeholder for more content */}
          <Text style={styles.sectionTitle}>Trending Destinations</Text>
          <View style={styles.comingSoonCard}>
            <Ionicons name="globe-outline" size={48} color="#A89F91" />
            <Text style={styles.comingSoonText}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>
              Beautiful destinations curated by AI
            </Text>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#FF7A5A" />
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#A89F91',
    marginBottom: 4,
  },
  logo: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 32,
    color: '#2E2E2E',
    letterSpacing: 0.5,
  },
  profileButton: {
    padding: 4,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  heroGradient: {
    padding: 32,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 28,
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 24,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  heroButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#2E2E2E',
    fontWeight: '600',
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    color: '#2E2E2E',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(185, 200, 194, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#2E2E2E',
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#A89F91',
  },
  comingSoonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(168, 159, 145, 0.2)',
    borderStyle: 'dashed',
  },
  comingSoonText: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: '#2E2E2E',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#A89F91',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#FF7A5A',
    fontWeight: '500',
  },
});