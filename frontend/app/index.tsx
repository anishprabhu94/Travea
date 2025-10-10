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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  // Set body style for web to remove margins and input outlines
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.innerHTML = `
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
        }
        
        input, textarea {
          outline: none !important;
          border-radius: 10px !important;
          -webkit-appearance: none !important;
          appearance: none !important;
        }
        
        input:focus, textarea:focus {
          outline: none !important;
          box-shadow: none !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Vignette overlay */}
      <View style={styles.vignetteOverlay} />
      
      {/* Content */}
      <View style={styles.contentContainer}>
        
        {/* Center-aligned frosted glass pane */}
        <BlurView intensity={25} tint="dark" style={styles.mainPane}>
          <View style={styles.paneInner}>
            
            {/* TRĀVEA Logo and tagline */}
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                <TraveaWordmark />
              </View>
              <Text style={styles.tagline}>Travel, refined.</Text>
            </View>

            {/* Frosted tab toggle for Sign In / Sign Up */}
            <View style={styles.tabToggleContainer}>
              <BlurView intensity={20} tint="light" style={styles.tabToggleBlur}>
                <View style={styles.tabToggleInner}>
                  <TouchableOpacity
                    style={[styles.tabButton, !isSignUp && styles.tabButtonActive]}
                    onPress={() => setIsSignUp(false)}
                    activeOpacity={0.8}
                  >
                    {!isSignUp && <View style={styles.tabGlow} />}
                    <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.tabButton, isSignUp && styles.tabButtonActive]}
                    onPress={() => setIsSignUp(true)}
                    activeOpacity={0.8}
                  >
                    {isSignUp && <View style={styles.tabGlow} />}
                    <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>

            {/* Form content */}
            <View style={styles.formSection}>
              
              {/* Name Field (Sign Up only) */}
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <BlurView intensity={12} tint="light" style={styles.inputBlur}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full name"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      value={name}
                      onChangeText={setName}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </BlurView>
                </View>
              )}
              
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <BlurView intensity={12} tint="light" style={styles.inputBlur}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </BlurView>
              </View>
              
              {/* Password Field */}
              <View style={styles.inputGroup}>
                <BlurView intensity={12} tint="light" style={styles.inputBlur}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                </BlurView>
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
              
              {/* Frosted secondary buttons for OAuth */}
              <View style={styles.oauthSection}>
                
                {/* Google Button */}
                <TouchableOpacity
                  style={styles.oauthButton}
                  onPress={handleOAuthGoogle}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={18} tint="light" style={styles.oauthBlur}>
                    <View style={styles.oauthInner}>
                      <Ionicons name="logo-google" size={18} color="#F8F8F8" />
                      <Text style={styles.oauthText}>Continue with Google</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
                
                {/* Apple Button */}
                <TouchableOpacity
                  style={styles.oauthButton}
                  onPress={handleOAuthApple}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={18} tint="light" style={styles.oauthBlur}>
                    <View style={styles.oauthInner}>
                      <Ionicons name="logo-apple" size={18} color="#F8F8F8" />
                      <Text style={styles.oauthText}>Continue with Apple</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
                
              </View>
              
            </View>
            
          </View>
        </BlurView>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    margin: 0,
    padding: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100vh',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 0,
  },
  logo: {
    fontSize: 46,
    fontWeight: '700',
    color: '#F8F8F8',
    letterSpacing: 4,
    marginBottom: 18,
  },
  tagline: {
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 3,
    opacity: 0.85,
    fontWeight: '300',
  },
  paneContainer: {
    alignItems: 'center',
  },
  glassPaneBlur: {
    width: width - 48,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.26)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 28px -6px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(30px) saturate(130%)',
        WebkitBackdropFilter: 'blur(30px) saturate(130%)',
      },
    }),
  },
  glassPaneInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 28,
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 42%)',
      },
    }),
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  toggleButton: {
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  toggleSpacer: {
    width: 40,
  },
  toggleText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#C9A96D',
  },
  inputContainer: {
    marginBottom: 24,
    gap: 10,
  },
  inputField: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 13,
    color: '#F8F8F8', // Changed to white for better visibility
    marginBottom: 6,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#F8F8F8', // Brighter white for better visibility
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayRoman',
      android: 'NeueHaasDisplayRoman',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        outline: 'none',
        '&:focus': {
          outline: 'none',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        },
      },
      ios: {
        // Remove iOS blue outline
        borderWidth: 1,
      },
    }),
  },
  inputActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  primaryButtonContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButtonBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryButton: {
    backgroundColor: 'rgba(201,169,109,0.65)', // Darker bronze fill for better visibility
    borderWidth: 1,
    borderColor: 'rgba(201,169,109,0.7)', // More visible bronze border
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 6px rgba(255,255,255,0.15), 0 3px 12px rgba(0,0,0,0.15)', // Enhanced frosted glass effect
      },
      default: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF', // White text for good contrast against bronze
    fontWeight: '600',
    letterSpacing: 1.5,
    ...Platform.select({
      web: {
        textShadow: '0 1px 2px rgba(0,0,0,0.3)', // Subtle shadow for better readability
      },
    }),
  },
  secondaryLinkContainer: {
    marginBottom: 24,
  },
  secondaryLink: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    opacity: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#5A5A5A',
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 13,
    color: '#FFFFFF',
    marginHorizontal: 16,
    letterSpacing: 1,
    fontWeight: '400',
    opacity: 0.75,
  },
  oauthContainer: {
    gap: 12,
  },
  oauthButtonContainer: {
    height: 44, // Match Sign In button height
    borderRadius: 12, // Match Sign In button radius for consistency
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      },
    }),
  },
  oauthButton: {
    flex: 1,
    borderRadius: 12, // Match Sign In button radius
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)', // Slightly more visible border for frostier effect
  },
  oauthButtonInner: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.25)', // More transparent for frostier appearance
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // 10px gap between icon and text as specified
    paddingHorizontal: 16,
  },
  oauthButtonGoogle: {
    // Additional styling for Google button if needed
  },
  oauthButtonApple: {
    // Additional styling for Apple button if needed
  },
  oauthButtonText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)', // Updated color as specified
    fontWeight: '500', // Medium weight as specified
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
});