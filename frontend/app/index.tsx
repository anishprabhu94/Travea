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
    backgroundColor: '#121212', // Deep Charcoal
    ...Platform.select({
      web: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0E0E0E 0%, #151515 100%)', // Full-screen blurred dark gradient
      },
    }),
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      web: {
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  // Center-aligned frosted glass pane
  mainPane: {
    borderRadius: 28, // radius 28px as specified
    overflow: 'hidden',
    width: '100%',
    maxWidth: 380,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)', // Diffuse glow, no drop shadows
      },
      default: {
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.45,
        shadowRadius: 20,
        elevation: 15,
      },
    }),
  },
  paneInner: {
    backgroundColor: 'rgba(25,25,25,0.35)', // rgba(25,25,25,0.35), blur 25px as specified
    padding: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 2,
    fontWeight: '300',
  },
  tabToggleContainer: {
    marginBottom: 24,
  },
  tabToggleBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabToggleInner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 4,
  },
  tabButton: {
    flex: 1,
    position: 'relative',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(201, 169, 109, 0.2)',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  formSection: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  inputBlur: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  oauthSection: {
    gap: 12,
  },
  oauthButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  oauthBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  oauthInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  oauthText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
});