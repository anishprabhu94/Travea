import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const firstName = (params.name as string) || 'Traveler';
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [paneAnim] = useState(new Animated.Value(0.3));
  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Cinematic entrance animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(paneAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleBeginPersonalization = () => {
    // Bronze shimmer animation on press
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding');
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Aerial Beach Background */}
      <ImageBackground
        source={{
          uri: 'https://customer-assets.emergentagent.com/job_travea-auth/artifacts/zl0td0x2_output%20%286%29.jpg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark matte gradient with bronze warmth */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.45)',
            'rgba(0, 0, 0, 0.55)',
            'rgba(0, 0, 0, 0.65)',
            'rgba(0, 0, 0, 0.75)',
          ]}
          style={styles.darkOverlay}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        
        {/* Bronze warmth overlay */}
        <View style={styles.bronzeOverlay} />

        {/* Content Container */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* TRAVEA Logo */}
          <Text style={styles.logo}>TRAVEA</Text>

          {/* Centered Frosted Glass Pane */}
          <Animated.View
            style={[
              styles.glassPaneContainer,
              {
                opacity: paneAnim,
              },
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.glassPane}>
              <View style={styles.glassPaneInner}>
                {/* Welcome Text */}
                <Text style={styles.welcomeText}>Welcome, Traveler.</Text>
                
                {/* Subtitle */}
                <Text style={styles.subtitleText}>
                  Let's learn about your travel style
                </Text>

                {/* Begin Personalization Button */}
                <TouchableOpacity
                  onPress={handleBeginPersonalization}
                  activeOpacity={0.9}
                  style={styles.beginButton}
                >
                  <BlurView intensity={25} tint="light" style={styles.beginButtonBlur}>
                    <Animated.View 
                      style={[
                        styles.beginButtonInner,
                        {
                          opacity: shimmerAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 0.8, 1],
                          }),
                        },
                      ]}
                    >
                      {/* Inner Bronze Glow */}
                      <View style={styles.buttonGlow} />
                      <Text style={styles.beginButtonText}>BEGIN PERSONALIZATION</Text>
                    </Animated.View>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </Animated.View>
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
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bronzeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(201, 169, 109, 0.08)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    color: '#F8F8F8',
    letterSpacing: 5,
    marginBottom: 80,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  glassPaneContainer: {
    width: '100%',
    maxWidth: 380,
  },
  glassPane: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.26)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(30px) saturate(130%)',
        WebkitBackdropFilter: 'blur(30px) saturate(130%)',
      },
    }),
  },
  glassPaneInner: {
    backgroundColor: 'rgba(25, 25, 25, 0.55)',
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    ...Platform.select({
      web: {
        background: 'rgba(25, 25, 25, 0.55)',
      },
    }),
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 8,
  },
  beginButton: {
    width: '100%',
    position: 'relative',
  },
  beginButtonBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.4)',
    height: 44,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
      },
    }),
  },
  beginButtonInner: {
    backgroundColor: 'rgba(201, 169, 109, 0.50)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        background: 'rgba(201, 169, 109, 0.50)',
      },
    }),
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(201, 169, 109, 0.15)',
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(201, 169, 109, 0.2)',
      },
    }),
  },
  beginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    zIndex: 1,
  },
});
