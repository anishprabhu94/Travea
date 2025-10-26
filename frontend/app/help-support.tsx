import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HelpSupport() {
  const router = useRouter();

  const handleContactSupport = () => {
    // Open email client
    Linking.openURL('mailto:support@travea.com?subject=Support Request');
  };

  const handleFAQ = () => {
    // Placeholder - would navigate to FAQ page or open external link
    console.log('FAQ clicked');
  };

  const renderButton = (
    icon: string,
    title: string,
    description: string,
    onPress: () => void,
    disabled: boolean = false
  ) => (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color={disabled ? 'rgba(255,255,255,0.4)' : '#C2A46E'} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.buttonTitle, disabled && styles.buttonTitleDisabled]}>
            {title}
          </Text>
          <Text style={styles.buttonDescription}>{description}</Text>
        </View>
        {!disabled && (
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
        )}
        {disabled && (
          <Text style={styles.comingSoonBadge}>Soon</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Living Radial Gradient Background */}
      <View style={styles.background}>
        <LinearGradient
          colors={['rgba(194,164,110,0.15)', 'rgba(11,15,20,0.8)', '#0B0F14']}
          locations={[0, 0.5, 1]}
          start={{ x: 0.3, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={styles.radialGradient}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F8F8F8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Title & Subtitle */}
        <Text style={styles.title}>We're here if you need a hand.</Text>
        <Text style={styles.subtitle}>
          Get help with your trips, account, or any questions about Trāvea.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {renderButton(
            'mail-outline',
            'Contact Support',
            'Get in touch with our team',
            handleContactSupport,
            false
          )}
          {renderButton(
            'help-circle-outline',
            'FAQ',
            'Find answers to common questions',
            handleFAQ,
            true
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made by Trāvea · v1.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  radialGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.select({ ios: 60, android: 40 }),
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 12,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 40,
    lineHeight: 24,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  buttonsContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(194,164,110,0.05)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 40,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 6px 30px rgba(0,0,0,0.4), 0 10px 40px rgba(194,164,110,0.05)',
        backdropFilter: 'blur(20px)',
      },
    }),
  },
  buttonDisabled: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(194,164,110,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#F8F8F8',
    marginBottom: 4,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  buttonTitleDisabled: {
    color: 'rgba(255,255,255,0.4)',
  },
  buttonDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  comingSoonBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(194,164,110,0.7)',
    backgroundColor: 'rgba(194,164,110,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
  footer: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }),
  },
});