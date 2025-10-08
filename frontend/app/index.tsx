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

  // Set body style for web to remove margins
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
          {/* Logo and Tagline */}
          <View style={styles.header}>
            <Text style={styles.logo}>TRAVEA</Text>
            <Text style={styles.tagline}>Travel, refined.</Text>
          </View>

          {/* Frosted Glass Pane */}
          <View style={styles.paneContainer}>
            <BlurView intensity={25} tint="light" style={styles.glassPaneBlur}>
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
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor="rgba(191, 191, 191, 0.9)"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <View style={[
                        styles.inputUnderline,
                        focusedField === 'name' && styles.inputUnderlineFocused
                      ]} />
                    </View>
                  )}

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(191, 191, 191, 0.9)"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <View style={[
                      styles.inputUnderline,
                      focusedField === 'email' && styles.inputUnderlineFocused
                    ]} />
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(191, 191, 191, 0.9)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <View style={[
                      styles.inputUnderline,
                      focusedField === 'password' && styles.inputUnderlineFocused
                    ]} />
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
                    style={styles.oauthButton}
                    onPress={handleOAuthGoogle}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-google" size={20} color="#FFFFFF" />
                    <Text style={styles.oauthButtonText}>Continue with Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.oauthButton, styles.oauthButtonApple]}
                    onPress={handleOAuthApple}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                    <Text style={styles.oauthButtonText}>Continue with Apple</Text>
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
    width: width,
    height: height,
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
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 8px 25px -5px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  glassPaneInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 28,
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
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    fontWeight: '700',
  },
  input: {
    fontSize: 15,
    color: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontWeight: '400',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#2D2D2D',
    marginTop: 4,
  },
  inputUnderlineFocused: {
    backgroundColor: '#C9A96D',
    ...Platform.select({
      ios: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      web: {
        boxShadow: '0px 0px 6px rgba(201, 169, 109, 0.5)',
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#C9A96D',
    height: 52,
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
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1C',
    height: 48,
    borderRadius: 12,
    gap: 12,
  },
  oauthButtonApple: {
    backgroundColor: '#000000',
  },
  oauthButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '400',
  },
});