import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import TraveaLogo from '../components/TraveaLogo';

export default function LogoShowcase() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0C0C0C', '#1A1A1A', '#0C0C0C']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#F8F8F8" />
            </TouchableOpacity>
            <Text style={styles.title}>TRAVEA Logo Showcase</Text>
          </View>

          {/* Section: Animated White Logo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Animated - White Variant</Text>
            <Text style={styles.sectionSubtitle}>
              Plane ascending along V diagonal
            </Text>
            <View style={styles.logoContainer}>
              <TraveaLogo variant="white" animated={true} size="large" />
            </View>
            <Text style={styles.description}>
              Minimalist plane icon integrated with upward stroke of V • Geometric design • Continuous ascending animation
            </Text>
          </View>

          {/* Section: Static White Logo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Static - White Variant</Text>
            <View style={styles.logoContainer}>
              <TraveaLogo variant="white" animated={false} size="large" />
            </View>
            <Text style={styles.description}>
              Clean, professional lockup for static applications
            </Text>
          </View>

          {/* Section: Animated Bronze Logo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Animated - Bronze Accent</Text>
            <Text style={styles.sectionSubtitle}>
              Bronze plane (#C9A96D) for premium feel
            </Text>
            <View style={styles.logoContainer}>
              <TraveaLogo variant="bronze" animated={true} size="large" />
            </View>
            <Text style={styles.description}>
              Luxury variant with champagne bronze plane • Premium brand applications
            </Text>
          </View>

          {/* Section: Static Bronze Logo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Static - Bronze Accent</Text>
            <View style={styles.logoContainer}>
              <TraveaLogo variant="bronze" animated={false} size="large" />
            </View>
            <Text style={styles.description}>
              Premium static version with bronze accent
            </Text>
          </View>

          {/* Section: Size Variants */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Size Variants</Text>
            
            <View style={styles.sizeShowcase}>
              <View style={styles.sizeItem}>
                <Text style={styles.sizeLabel}>Large</Text>
                <TraveaLogo variant="white" animated={false} size="large" />
              </View>
              
              <View style={styles.sizeItem}>
                <Text style={styles.sizeLabel}>Medium</Text>
                <TraveaLogo variant="white" animated={false} size="medium" />
              </View>
              
              <View style={styles.sizeItem}>
                <Text style={styles.sizeLabel}>Small</Text>
                <TraveaLogo variant="white" animated={false} size="small" />
              </View>
            </View>
          </View>

          {/* Section: On Frosted Glass */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>On Frosted Glass Background</Text>
            <View style={[styles.logoContainer, styles.frostedBg]}>
              <TraveaLogo variant="white" animated={true} size="large" />
            </View>
            <Text style={styles.description}>
              Logo maintains visibility on frosted glass overlays
            </Text>
          </View>

          {/* Design Specifications */}
          <View style={styles.specs}>
            <Text style={styles.specsTitle}>Design Specifications</Text>
            <Text style={styles.specItem}>• Font: System Sans-Serif (approximating Neue Montreal Bold)</Text>
            <Text style={styles.specItem}>• Letter Spacing: +4</Text>
            <Text style={styles.specItem}>• Text Color: #F8F8F8 (Soft White)</Text>
            <Text style={styles.specItem}>• Bronze Accent: #C9A96D</Text>
            <Text style={styles.specItem}>• Plane Design: Geometric, minimal, matches text stroke</Text>
            <Text style={styles.specItem}>• Animation: 2.5s continuous loop ascending</Text>
            <Text style={styles.specItem}>• Rotation: -35° along V diagonal</Text>
          </View>

          {/* Back Button */}
          <TouchableOpacity 
            style={styles.homeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.homeButtonText}>Back to App</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  title: {
    fontSize: 24,
    color: '#F8F8F8',
    fontWeight: '700',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#F8F8F8',
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#C9A96D',
    marginBottom: 16,
    fontWeight: '400',
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  frostedBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px)',
  },
  description: {
    fontSize: 13,
    color: '#A8A8A8',
    lineHeight: 20,
    textAlign: 'center',
  },
  sizeShowcase: {
    gap: 24,
  },
  sizeItem: {
    alignItems: 'center',
    gap: 12,
  },
  sizeLabel: {
    fontSize: 14,
    color: '#C9A96D',
    fontWeight: '500',
  },
  specs: {
    backgroundColor: 'rgba(201, 169, 109, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.3)',
  },
  specsTitle: {
    fontSize: 16,
    color: '#F8F8F8',
    fontWeight: '600',
    marginBottom: 12,
  },
  specItem: {
    fontSize: 13,
    color: '#D1D1D1',
    marginBottom: 8,
    lineHeight: 20,
  },
  homeButton: {
    backgroundColor: '#C9A96D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1,
  },
});
