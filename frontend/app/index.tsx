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
    router.push('/home');
  };

  const handleSignUp = () => {
    // Navigate to welcome screen with user's name
    router.push({
      pathname: '/welcome',
      params: { name: name || 'Traveler' }
    });
  };

  const handleOAuthGoogle = () => {
    router.push('/home');
  };

  const handleOAuthApple = () => {
    router.push('/home');
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
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Full-Screen Background */}
      <ImageBackground
        source={{
          uri: 'https://customer-assets.emergentagent.com/job_modern-journey-app/artifacts/rfhpzh4c_output%20%281%29.jpg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={Platform.OS === 'ios' ? 12 : 10}
      >
        {/* Mild vignette effect */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.15)',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.05)',
            'rgba(0, 0, 0, 0.15)',
          ]}
          style={styles.vignetteOverlay}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* Content Container - No Scroll */}
        <View style={styles.contentContainer}>
          {/* Luxury Wordmark */}
          <View style={styles.header}>
            <TraveaWordmark size="large" />
            <Text style={styles.tagline}>Travel, refined.</Text>
          </View>

          {/* Frosted Glass Pane */}
          <View style={styles.paneContainer}>
            <BlurView intensity={30} tint="light" style={styles.glassPaneBlur}>
              <View style={styles.glassPaneInner}>
                {/* Tab Toggle */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setIsSignUp(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>
                      Sign In
                    </Text>
                    {!isSignUp && <View style={styles.activeUnderline} />}
                  </TouchableOpacity>
                  
                  <View style={styles.toggleSpacer} />
                  
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setIsSignUp(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>
                      Sign Up
                    </Text>
                    {isSignUp && <View style={styles.activeUnderline} />}
                  </TouchableOpacity>
                </View>

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                  {isSignUp && (
                    <View style={styles.inputField}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <TextInput
                        style={[
                          styles.input,
                          focusedField === 'name' && styles.inputActive
                        ]}
                        placeholder=""
                        placeholderTextColor="rgba(255, 255, 255, 0.45)"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        selectionColor="rgba(255, 255, 255, 0.3)"
                      />
                    </View>
                  )}

                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === 'email' && styles.inputActive
                      ]}
                      placeholder=""
                      placeholderTextColor="rgba(255, 255, 255, 0.45)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      selectionColor="rgba(255, 255, 255, 0.3)"
                    />
                  </View>

                  <View style={styles.inputField}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={[
                        styles.input,
                        focusedField === 'password' && styles.inputActive
                      ]}
                      placeholder=""
                      placeholderTextColor="rgba(255, 255, 255, 0.45)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      selectionColor="rgba(255, 255, 255, 0.3)"
                    />
                  </View>
                </View>

                {/* Primary CTA Button */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={isSignUp ? handleSignUp : handleSignIn}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSignUp ? 'SIGN UP' : 'SIGN IN'}
                  </Text>
                </TouchableOpacity>

                {/* Secondary Toggle Link */}
                <TouchableOpacity 
                  onPress={() => setIsSignUp(!isSignUp)}
                  style={styles.secondaryLinkContainer}
                >
                  <Text style={styles.secondaryLink}>
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"}
                  </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* OAuth Buttons */}
                <View style={styles.oauthContainer}>
                  <TouchableOpacity
                    style={styles.oauthButtonContainer}
                    onPress={handleOAuthGoogle}
                    activeOpacity={0.9}
                  >
                    <BlurView intensity={20} tint="light" style={styles.oauthButton}>
                      <View style={styles.oauthButtonInner}>
                        <Ionicons name="logo-google" size={18} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.oauthButtonText}>Continue with Google</Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.oauthButtonContainer}
                    onPress={handleOAuthApple}
                    activeOpacity={0.9}
                  >
                    <BlurView intensity={20} tint="light" style={styles.oauthButton}>
                      <View style={styles.oauthButtonInner}>
                        <Ionicons name="logo-apple" size={18} color="rgba(255,255,255,0.85)" />
                        <Text style={styles.oauthButtonText}>Continue with Apple</Text>
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </View>
      </ImageBackground>
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
    color: 'rgba(255, 255, 255, 0.65)',
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
    color: '#FFFFFF',
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
  primaryButton: {
    backgroundColor: '#C9A96D',
    height: 44, // Reduced height for classier appearance
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1.5,
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
    height: 50,
    borderRadius: 18,
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
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  oauthButtonInner: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // 10px gap between icon and text as specified
    paddingHorizontal: 16,
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