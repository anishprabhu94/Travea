import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useFonts, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignIn = () => {
    // Mock navigation to home
    router.push('/home');
  };

  const handleSignUp = () => {
    // Mock navigation to home
    router.push('/home');
  };

  const handleOAuthGoogle = () => {
    // Mock Google OAuth
    router.push('/home');
  };

  const handleOAuthApple = () => {
    // Mock Apple OAuth
    router.push('/home');
  };

  const handleBrowseWithoutSignIn = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxiZWFjaCUyMHN1bnJpc2V8ZW58MHx8fHwxNzU5ODc2MDg0fDA&ixlib=rb-4.1.0&q=85',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Warm beige overlay */}
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo and Tagline */}
            <View style={styles.header}>
              <Text style={styles.logo}>Travia.ai</Text>
              <Text style={styles.tagline}>Your world, beautifully arranged.</Text>
            </View>

            {/* Floating Card with Frosted Glass Effect */}
            <BlurView intensity={20} tint="light" style={styles.card}>
              {/* Toggle Sign In / Sign Up */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, !isSignUp && styles.toggleButtonActive]}
                  onPress={() => setIsSignUp(false)}
                >
                  <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, isSignUp && styles.toggleButtonActive]}
                  onPress={() => setIsSignUp(true)}
                >
                  <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                {isSignUp && (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#A89F91"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                    <View style={styles.underline} />
                  </View>
                )}

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#A89F91"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <View style={styles.underline} />
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#A89F91"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <View style={styles.underline} />
                </View>
              </View>

              {/* Primary Action Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={isSignUp ? handleSignUp : handleSignIn}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>

              {/* Toggle Link */}
              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleLink}>
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
                  <Ionicons name="logo-google" size={20} color="#2E2E2E" />
                  <Text style={styles.oauthButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.oauthButton, styles.oauthButtonApple]}
                  onPress={handleOAuthApple}
                  activeOpacity={0.8}
                >
                  <Ionicons name="logo-apple" size={20} color="#fff" />
                  <Text style={[styles.oauthButtonText, styles.oauthButtonTextApple]}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>

            {/* Skip Option */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleBrowseWithoutSignIn}
            >
              <Text style={styles.skipText}>Browse without signing in</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F6F3EF',
    opacity: 0.7,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 42,
    color: '#2E2E2E',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#A89F91',
    letterSpacing: 0.3,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: 'rgba(174, 159, 145, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#fff',
  },
  toggleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#A89F91',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#2E2E2E',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#2E2E2E',
    paddingVertical: 8,
  },
  underline: {
    height: 1,
    backgroundColor: '#A89F91',
    opacity: 0.3,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#B9C8C2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#B9C8C2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  toggleLink: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#FF7A5A',
    textAlign: 'center',
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#A89F91',
    opacity: 0.2,
  },
  dividerText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: '#A89F91',
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  oauthContainer: {
    gap: 12,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(46, 46, 46, 0.1)',
  },
  oauthButtonApple: {
    backgroundColor: '#000',
  },
  oauthButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: '#2E2E2E',
    fontWeight: '500',
  },
  oauthButtonTextApple: {
    color: '#fff',
  },
  skipButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  skipText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#2E2E2E',
    opacity: 0.6,
  },
});