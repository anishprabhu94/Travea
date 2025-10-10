import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TraveaWordmark from '../components/TraveaWordmark';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignIn = () => {
    router.push('/landing');
  };

  const handleSignUp = () => {
    // Navigate to welcome screen with user's name
    router.push({
      pathname: '/welcome',
      params: { name: name || 'Traveler' }
    });
  };

  const handleOAuthGoogle = () => {
    router.push('/landing');
  };

  const handleOAuthApple = () => {
    router.push('/landing');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Deep charcoal gradient background */}
      <LinearGradient
        colors={['#1a1a1a', '#0a0a0a']}
        style={styles.backgroundGradient}
      />
      
      {/* Content */}
      <View style={styles.contentContainer}>
        
        {/* Center-aligned glass pane with background image */}
        <View style={styles.mainPane}>
          <ImageBackground
            source={{ uri: 'https://customer-assets.emergentagent.com/job_travea-luxury-app/artifacts/vyx1vpo5_sign%20in%20final.jpg' }}
            style={styles.paneImageBackground}
            imageStyle={styles.paneImageStyle}
          >
            <BlurView intensity={25} tint="dark" style={styles.paneBlurOverlay}>
              <View style={styles.paneInner}>
            
            {/* TRĀVEA Logo and tagline */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <TraveaWordmark />
              </View>
              <Text style={styles.tagline}>Travel, refined.</Text>
            </View>

            {/* Tab toggle for Sign In / Sign Up */}
            <View style={styles.tabToggleContainer}>
              <View style={styles.tabToggleInner}>
                <TouchableOpacity
                  style={[styles.tabButton, !isSignUp && styles.tabButtonActive]}
                  onPress={() => setIsSignUp(false)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.tabButton, isSignUp && styles.tabButtonActive]}
                  onPress={() => setIsSignUp(true)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form content */}
            <View style={styles.formSection}>
              
              {/* Name Field (Sign Up only) */}
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor="rgba(255,255,255,0.45)"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}
              
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              {/* Password Field */}
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              
              {/* Bronze-gradient primary button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={isSignUp ? handleSignUp : handleSignIn}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#C9A96D', '#B8956A']}
                  style={styles.gradientButton}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
              
              {/* OAuth buttons */}
              <View style={styles.oauthSection}>
                
                {/* Google Button */}
                <TouchableOpacity
                  style={styles.oauthButton}
                  onPress={handleOAuthGoogle}
                  activeOpacity={0.8}
                >
                  <View style={styles.oauthInner}>
                    <Ionicons name="logo-google" size={18} color="#F8F8F8" />
                    <Text style={styles.oauthText}>Continue with Google</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Apple Button */}
                <TouchableOpacity
                  style={styles.oauthButton}
                  onPress={handleOAuthApple}
                  activeOpacity={0.8}
                >
                  <View style={styles.oauthInner}>
                    <Ionicons name="logo-apple" size={18} color="#F8F8F8" />
                    <Text style={styles.oauthText}>Continue with Apple</Text>
                  </View>
                </TouchableOpacity>
                
              </View>
              
            </View>
            
          </View>
        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Deep Charcoal base
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  // Center-aligned frosted glass pane
  mainPane: {
    borderRadius: 28,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 22,
  },
  
  paneInner: {
    backgroundColor: 'rgba(40,40,40,0.8)',
    padding: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  // TRĀVEA logo and tagline at top
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 6,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 12,
    letterSpacing: 1.2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    textAlign: 'center',
  },
  
  // Tab toggle for Sign In / Sign Up
  tabToggleContainer: {
    marginBottom: 32,
  },
  tabToggleInner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(201,169,109,0.3)',
  },
  tabText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  tabTextActive: {
    color: '#F8F8F8',
    fontWeight: '600',
  },
  
  // Form content
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 18,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#F8F8F8',
    fontWeight: '400',
    letterSpacing: 0.2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  
  // Bronze-gradient primary button
  primaryButton: {
    marginTop: 12,
    marginBottom: 28,
  },
  gradientButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#C9A96D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F8F8',
    letterSpacing: 0.4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dividerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginHorizontal: 20,
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  
  // OAuth buttons
  oauthSection: {
    width: '100%',
  },
  oauthButton: {
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden',
  },
  oauthInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(128,128,128,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  oauthText: {
    fontSize: 15,
    color: '#F8F8F8',
    marginLeft: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
});