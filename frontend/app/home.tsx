import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.logo}>TRAVEA</Text>
            <View style={styles.logoUnderline} />
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={36} color="#F2F2F2" />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCardContainer}>
          <BlurView intensity={20} tint="light" style={styles.heroCard}>
            <View style={styles.heroCardInner}>
              <Text style={styles.heroTitle}>Your Next Journey</Text>
              <Text style={styles.heroSubtitle}>
                Discover refined travel experiences curated for you
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>EXPLORE</Text>
                <Ionicons name="arrow-forward" size={16} color="#0C0C0C" />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <View style={styles.actionCard}>
            <Text style={styles.actionEmoji}>🧭</Text>
            <Text style={styles.actionTitle}>Discover</Text>
            <Text style={styles.actionSubtitle}>Find destinations</Text>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionEmoji}>📅</Text>
            <Text style={styles.actionTitle}>Plan</Text>
            <Text style={styles.actionSubtitle}>Create trips</Text>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionEmoji}>🔖</Text>
            <Text style={styles.actionTitle}>Saved</Text>
            <Text style={styles.actionSubtitle}>Favorites</Text>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionEmoji}>✨</Text>
            <Text style={styles.actionTitle}>AI Picks</Text>
            <Text style={styles.actionSubtitle}>Smart recs</Text>
          </View>
        </View>

        {/* Coming Soon Section */}
        <Text style={styles.sectionTitle}>Premium Experiences</Text>
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonEmoji}>🌍</Text>
          <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          <Text style={styles.comingSoonSubtext}>
            Exclusive destinations powered by AI
          </Text>
        </View>

        {/* Onboarding Button */}
        <TouchableOpacity
          style={styles.onboardingButton}
          onPress={() => router.push('/onboarding')}
        >
          <Ionicons name="star-outline" size={20} color="#C9A96D" />
          <Text style={styles.onboardingText}>Customize Your Preferences</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color="#C9A96D" />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
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
    fontSize: 13,
    color: '#BEBEBE',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  logo: {
    fontSize: 32,
    color: '#F2F2F2',
    fontWeight: '700',
    letterSpacing: 1,
  },
  logoUnderline: {
    width: 40,
    height: 2,
    backgroundColor: '#C9A96D',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  heroCardContainer: {
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(201, 169, 109, 0.2)',
      },
    }),
  },
  heroCardInner: {
    backgroundColor: 'rgba(201, 169, 109, 0.95)',
    padding: 32,
  },
  heroTitle: {
    fontSize: 28,
    color: '#0C0C0C',
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#0C0C0C',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '300',
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 13,
    color: '#F2F2F2',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#F2F2F2',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 20,
    width: (width - 60) / 2,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  actionEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 15,
    color: '#F2F2F2',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#BEBEBE',
  },
  comingSoonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    borderStyle: 'dashed',
  },
  comingSoonEmoji: {
    fontSize: 48,
  },
  comingSoonTitle: {
    fontSize: 18,
    color: '#F2F2F2',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 13,
    color: '#BEBEBE',
    textAlign: 'center',
  },
  onboardingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(201, 169, 109, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9A96D',
    marginBottom: 16,
  },
  onboardingText: {
    fontSize: 15,
    color: '#C9A96D',
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backText: {
    fontSize: 14,
    color: '#C9A96D',
    fontWeight: '400',
  },
});