import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
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
import { Ionicons } from '@expo/vector-icons';

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
            <Text style={styles.tagline}>Travel, refined.</Text>
          </View>

          {/* Frosted Glass Pane */}
          <View style={styles.paneContainer}>
            <BlurView intensity={20} tint="light" style={styles.frostedPane}>
              <View style={styles.paneInner}>
                {/* Toggle Sign In / Sign Up */}
                <View style={styles.toggleContainer}>
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setIsSignUp(false)}
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
                      <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        placeholderTextColor="#BEBEBE"
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
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#BEBEBE"
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
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#BEBEBE"
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
                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
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
          </View>

          {/* Skip Option */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleBrowseWithoutSignIn}
          >
            <Text style={styles.skipText}>Browse without signing in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 96,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: '#F2F2F2',
    letterSpacing: 1,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: '#BEBEBE',
    letterSpacing: 3,
    opacity: 0.85,
    fontWeight: '300',
  },
  paneContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  frostedPane: {
    width: width * 0.88,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  paneInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  toggleButton: {
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  toggleSpacer: {
    width: 32,
  },
  toggleText: {
    fontSize: 14,
    color: '#BEBEBE',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  toggleTextActive: {
    color: '#F2F2F2',
    fontWeight: '500',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: '#C9A96D',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    fontSize: 14,
    color: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontWeight: '400',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginTop: 4,
  },
  inputUnderlineFocused: {
    backgroundColor: '#C9A96D',
    ...Platform.select({
      ios: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
      },
      web: {
        boxShadow: '0px 0px 4px rgba(201, 169, 109, 0.6)',
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#C9A96D',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  secondaryLink: {
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
    backgroundColor: '#2A2A2A',
  },
  dividerText: {
    fontSize: 10,
    color: '#7A7A7A',
    marginHorizontal: 16,
    letterSpacing: 1,
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
    height: 48,
    borderRadius: 12,
    gap: 12,
  },
  oauthButtonApple: {
    backgroundColor: '#000000',
  },
  oauthButtonText: {
    fontSize: 15,
    color: '#F2F2F2',
    fontWeight: '400',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: 32,
  },
  skipText: {
    fontSize: 13,
    color: '#BEBEBE',
  },
});