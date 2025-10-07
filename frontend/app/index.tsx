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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignIn = () => {
    router.push('/home');
  };

  const handleSignUp = () => {
    router.push('/home');
  };

  const handleOAuthGoogle = () => {
    router.push('/home');
  };

  const handleOAuthApple = () => {
    router.push('/home');
  };

  const handleBrowseWithoutSignIn = () => {
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1517462035531-76bc910a6903?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwyfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDB8fHxibGFja3wxNzU5ODc2ODA0fDA&ixlib=rb-4.1.0&q=85',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={8}
      >
        {/* Dark overlay with gradient */}
        <LinearGradient
          colors={['rgba(15, 15, 15, 0.75)', 'rgba(26, 26, 26, 0.85)', 'rgba(15, 15, 15, 0.75)']}
          style={styles.overlay}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

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
              <Text style={styles.logo}>TRAVEA</Text>
              <View style={styles.logoUnderline} />
              <Text style={styles.tagline}>Your world, beautifully arranged.</Text>
            </View>

            {/* Frosted Glass Card */}
            <BlurView intensity={30} tint="dark" style={styles.card}>
              <View style={styles.cardInner}>
                {/* Toggle Sign In / Sign Up */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={[styles.toggleButton, !isSignUp && styles.toggleButtonActive]}
                    onPress={() => setIsSignUp(false)}
                  >
                    <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>
                      SIGN IN
                    </Text>
                    {!isSignUp && <View style={styles.activeUnderline} />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleButton, isSignUp && styles.toggleButtonActive]}
                    onPress={() => setIsSignUp(true)}
                  >
                    <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>
                      SIGN UP
                    </Text>
                    {isSignUp && <View style={styles.activeUnderline} />}
                  </TouchableOpacity>
                </View>

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                  {isSignUp && (
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#A8A8A8"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                      />
                      <View style={styles.inputUnderline} />
                    </View>
                  )}

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#A8A8A8"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <View style={styles.inputUnderline} />
                  </View>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#A8A8A8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                    <View style={styles.inputUnderline} />
                  </View>
                </View>

                {/* Primary Action Button */}
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={isSignUp ? handleSignUp : handleSignIn}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#B89361', '#C9A96D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryButtonText}>
                      {isSignUp ? 'SIGN UP' : 'SIGN IN'}
                    </Text>
                  </LinearGradient>
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
                    <Ionicons name="logo-google" size={20} color="#F2F2F2" />
                    <Text style={styles.oauthButtonText}>Continue with Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.oauthButton, styles.oauthButtonApple]}
                    onPress={handleOAuthApple}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-apple" size={20} color="#F2F2F2" />
                    <Text style={styles.oauthButtonText}>Continue with Apple</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: '#0F0F0F',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: '#F2F2F2',
    letterSpacing: 2,
    marginBottom: 4,
  },
  logoUnderline: {
    width: 60,
    height: 2,
    backgroundColor: '#C9A96D',
    marginTop: 4,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 14,
    color: '#A8A8A8',
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  cardInner: {
    backgroundColor: 'rgba(25, 25, 25, 0.55)',
    padding: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 24,
    justifyContent: 'center',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    position: 'relative',
  },
  toggleButtonActive: {},
  toggleText: {
    fontSize: 13,
    color: '#A8A8A8',
    fontWeight: '500',
    letterSpacing: 1,
  },
  toggleTextActive: {
    color: '#F2F2F2',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#C9A96D',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  input: {
    fontSize: 16,
    color: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#2C2C2C',
    marginTop: 4,
  },
  primaryButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  toggleLink: {
    fontSize: 13,
    color: '#E47B63',
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
    backgroundColor: '#2C2C2C',
  },
  dividerText: {
    fontSize: 10,
    color: '#A8A8A8',
    marginHorizontal: 16,
    letterSpacing: 1.2,
    fontWeight: '300',
  },
  oauthContainer: {
    gap: 12,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#2C2C2C',
  },
  oauthButtonApple: {
    backgroundColor: '#000000',
  },
  oauthButtonText: {
    fontSize: 15,
    color: '#F2F2F2',
    fontWeight: '500',
  },
  skipButton: {
    marginTop: 32,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 13,
    color: '#A8A8A8',
  },
});