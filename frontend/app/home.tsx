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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0F0F0F', '#1A1A1A', '#0F0F0F']}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
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
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#B89361', '#C9A96D', '#B89361']}
              style={styles.heroGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.heroTitle}>Start Your Journey</Text>
              <Text style={styles.heroSubtitle}>
                Discover premium travel experiences curated by AI
              </Text>
              <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>EXPLORE NOW</Text>
                <Ionicons name="arrow-forward" size={18} color="#0F0F0F" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>🧭</Text>
              </View>
              <Text style={styles.actionTitle}>Discover</Text>
              <Text style={styles.actionSubtitle}>Find destinations</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>📅</Text>
              </View>
              <Text style={styles.actionTitle}>Plan</Text>
              <Text style={styles.actionSubtitle}>Create trips</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>🔖</Text>
              </View>
              <Text style={styles.actionTitle}>Saved</Text>
              <Text style={styles.actionSubtitle}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionEmoji}>✨</Text>
              </View>
              <Text style={styles.actionTitle}>AI Picks</Text>
              <Text style={styles.actionSubtitle}>Smart recs</Text>
            </TouchableOpacity>
          </View>

          {/* Coming Soon */}
          <Text style={styles.sectionTitle}>Premium Destinations</Text>
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonEmoji}>🌍</Text>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
            <Text style={styles.comingSoonSubtext}>
              Exclusive travel experiences powered by AI
            </Text>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color="#C9A96D" />
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
    backgroundColor: '#0F0F0F',
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
    fontSize: 13,
    color: '#A8A8A8',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  logo: {
    fontSize: 32,
    color: '#F2F2F2',
    fontWeight: '800',
    letterSpacing: 2,
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
  heroCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 8px 16px rgba(201, 169, 109, 0.3)',
      },
    }),
  },
  heroGradient: {
    padding: 32,
  },
  heroTitle: {
    fontSize: 28,
    color: '#0F0F0F',
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#0F0F0F',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 24,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 13,
    color: '#F2F2F2',
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#F2F2F2',
    fontWeight: '700',
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
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: 20,
    width: (width - 60) / 2,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2C',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  actionIconContainer: {
    marginBottom: 12,
  },
  actionEmoji: {
    fontSize: 36,
  },
  actionTitle: {
    fontSize: 15,
    color: '#F2F2F2',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#A8A8A8',
  },
  comingSoonCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderStyle: 'dashed',
  },
  comingSoonEmoji: {
    fontSize: 48,
  },
  comingSoonText: {
    fontSize: 18,
    color: '#F2F2F2',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonSubtext: {
    fontSize: 13,
    color: '#A8A8A8',
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
    fontSize: 14,
    color: '#C9A96D',
    fontWeight: '500',
  },
});